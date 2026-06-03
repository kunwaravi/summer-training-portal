import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../lib/logger';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Helper to generate the exact same Credential ID
const generateCredentialId = (userId: number, name: string, courseId: string) => {
  const cleanFirstName = name.split(' ')[0].toUpperCase();
  const cleanCourseKey = courseId.toUpperCase() === "C++" ? "CPP_EMBEDDED" : courseId.toUpperCase() + "_SYSTEMS";
  return `NEX-${cleanCourseKey}-${cleanFirstName}${1000 + userId}-VERIFIED`;
};

// GET /api/certificate/:courseId - Generate certificate data for a specific authenticated user and course track
router.get('/:courseId', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params as any;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        results: true,
        progresses: true
      }
    });

    if (!user) {
      logger.error(`Certificate fetch failure: User ID ${userId} not found.`);
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Check payment status
    const successPayment = await prisma.payment.findFirst({
      where: {
        userId,
        courseId,
        status: 'SUCCESS'
      }
    });

    if (!successPayment && req.user.role !== 'ADMIN') {
      logger.error(`Certificate fetch blocked: Payment clearance outstanding for track ${courseId} / user ${userId}.`);
      return res.status(402).json({ 
        message: `Payment clearance required to generate certified credentials for '${courseId}'.`,
        paymentRequired: true 
      });
    }

    // 2. Check 20 modules completed & passed
    const completedCount = await prisma.moduleProgress.count({
      where: {
        userId,
        courseId,
        quizPassed: true
      }
    });
    if (completedCount < 20 && req.user.role !== 'ADMIN') {
      logger.error(`Certificate fetch denied: Modules incomplete (${completedCount}/20) for user ${userId}.`);
      return res.status(403).json({ message: `Syllabus incomplete: You must pass the quizzes for all 20 modules. Completed: ${completedCount}/20.` });
    }

    // 3. Check 4 weekly assignments approved
    const approvedAssignments = await prisma.assignmentSubmission.count({
      where: {
        userId,
        courseId,
        status: 'APPROVED'
      }
    });
    if (approvedAssignments < 4 && req.user.role !== 'ADMIN') {
      logger.error(`Certificate fetch denied: Assignments outstanding (${approvedAssignments}/4 approved) for user ${userId}.`);
      return res.status(403).json({ message: `Assignments outstanding: You must have all 4 weekly assignments APPROVED by an instructor. Approved: ${approvedAssignments}/4.` });
    }

    // 4. Check final project approved
    const approvedProject = await prisma.projectSubmission.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });
    if ((!approvedProject || approvedProject.status !== 'APPROVED') && req.user.role !== 'ADMIN') {
      logger.error(`Certificate fetch denied: Project is not approved for user ${userId}.`);
      return res.status(403).json({ message: 'Project outstanding: Your final project submission must be APPROVED by an instructor.' });
    }

    // 5. Check final exam passed
    const coursePassingResults = user.results.filter(r => r.courseId === courseId && r.passed);
    if (coursePassingResults.length === 0 && req.user.role !== 'ADMIN') {
      logger.error(`Certificate fetch denied: Final exam not passed for user ${userId}.`);
      return res.status(403).json({ message: 'Final Exam outstanding: You must pass the final assessment exam with a score >= 60%.' });
    }

    const progress = await prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    const bestResult = coursePassingResults.length > 0 
        ? coursePassingResults.reduce((prev, current) => (prev.accuracy > current.accuracy) ? prev : current)
        : { grade: 'Outstanding', accuracy: 100 };

    const grade = bestResult.grade || "Good";

    // Clean course names for NEXUS Solutions presentation
    let displayCourseName = "Advanced Computing Solutions";
    if (courseId === "C") displayCourseName = "C & Systems Programming for Hardware";
    else if (courseId === "C++") displayCourseName = "C++ & OOP for Embedded Systems";
    else if (courseId === "IoT") displayCourseName = "IoT & Smart Interfacing Solutions";
    else if (courseId === "Embedded") displayCourseName = "Embedded Systems & Real-Time OS";

    const credentialId = generateCredentialId(user.id, user.name, courseId);

    logger.info(`Certificate generated successfully for user ${userId} on track ${courseId}. Grade: ${grade} (Admin bypass: ${req.user.role === 'ADMIN'})`);

    res.json({
      name: user.name,
      fatherName: user.fatherName,
      collegeName: user.collegeName,
      branchName: user.branchName,
      courseId,
      courseName: displayCourseName,
      grade: grade,
      credentialId,
      completionDate: new Date(progress?.updatedAt || new Date()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      signatures: {
        chiefAcademicOfficer: "Prof. Vinayak Singh",
        technicalDirector: "Er. Gaurav Singh"
      }
    });
  } catch (error: any) {
    logger.error('Fetch certificate error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/certificate/verify/:credentialId - Public verification registry endpoint with rate limiting
router.get('/verify/:credentialId', rateLimiter(10, 60 * 1000), async (req: Request, res: Response): Promise<any> => {
  try {
    const { credentialId } = req.params as any;

    const match = credentialId.match(/-[A-Z0-9_]+([0-9]{4})-VERIFIED$/i);
    if (!match) {
      logger.error(`Certificate verification query failed: Invalid Credential ID format ${credentialId}`);
      return res.status(400).json({ message: 'Invalid Credential ID format.' });
    }

    const calculatedUserId = parseInt(match[1]) - 1000;
    if (isNaN(calculatedUserId) || calculatedUserId <= 0) {
      logger.error(`Certificate verification query failed: Mismatched signature key ${credentialId}`);
      return res.status(400).json({ message: 'Invalid verification signature.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: calculatedUserId },
      include: {
        progresses: true,
        results: true
      }
    });

    if (!user) {
      logger.error(`Certificate verification query failed: Registered student ID ${calculatedUserId} not found.`);
      return res.status(404).json({ message: 'No registered candidate matches this credential.' });
    }

    let courseId = "C";
    if (credentialId.toUpperCase().includes("CPP_EMBEDDED")) courseId = "C++";
    else if (credentialId.toUpperCase().includes("IOT")) courseId = "IoT";
    else if (credentialId.toUpperCase().includes("EMBEDDED")) courseId = "Embedded";
    else if (credentialId.toUpperCase().includes("C_SYSTEMS")) courseId = "C";

    const progress = user.progresses.find(p => p.courseId === courseId);
    if (!progress || !progress.completed) {
      logger.error(`Certificate verification query failed: Track ${courseId} is incomplete for student ${calculatedUserId}`);
      return res.status(403).json({ message: 'Credential is still active/uncompleted in database.' });
    }

    const expectedId = generateCredentialId(user.id, user.name, courseId);
    if (expectedId.toLowerCase() !== credentialId.toLowerCase()) {
      logger.error(`Certificate verification query failed: Signature mismatch for ${credentialId}`);
      return res.status(400).json({ message: 'Credential verification signature mismatch.' });
    }

    const coursePassingResults = user.results.filter(r => r.courseId === courseId && r.passed);
    let grade = "Good";
    if (coursePassingResults.length > 0) {
      const bestResult = coursePassingResults.reduce((prev, current) => 
          (prev.accuracy > current.accuracy) ? prev : current
      );
      grade = bestResult.grade || "Good";
    }

    let displayCourseName = "Advanced Computing Solutions";
    if (courseId === "C") displayCourseName = "C & Systems Programming for Hardware";
    else if (courseId === "C++") displayCourseName = "C++ & OOP for Embedded Systems";
    else if (courseId === "IoT") displayCourseName = "IoT & Smart Interfacing Solutions";
    else if (courseId === "Embedded") displayCourseName = "Embedded Systems & Real-Time OS";

    logger.info(`Certificate verified query success: registry matches ID ${credentialId} / user ${user.id}`);

    res.json({
      verified: true,
      auditStatus: "ACTIVE / VERIFIED",
      candidateName: user.name,
      fatherName: user.fatherName,
      collegeName: user.collegeName,
      branchName: user.branchName,
      courseName: displayCourseName,
      grade,
      completionDate: new Date(progress.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      accreditationRegistry: "NEXUS EMBEDDED SYSTEMS CORPORATE REGISTRY (CIN: U72900DL2026PTC394820)",
      compliance: "ISO 9001:2015 & ISO/IEC 27001 Certified System Standards"
    });
  } catch (error: any) {
    logger.error('Verify credential error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;