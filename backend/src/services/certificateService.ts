import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export class CertificateService {
  private static generateCredentialId(userId: number, name: string, courseId: string) {
    const cleanFirstName = name.split(' ')[0].toUpperCase();
    const cleanCourseKey = courseId.toUpperCase() === "C++" ? "CPP_EMBEDDED" : courseId.toUpperCase() + "_SYSTEMS";
    return `NEX-${cleanCourseKey}-${cleanFirstName}${1000 + userId}-VERIFIED`;
  }

  private static getDisplayCourseName(courseId: string) {
    switch (courseId) {
      case "C": return "C & Systems Programming for Hardware";
      case "C++": return "C++ & OOP for Embedded Systems";
      case "IoT": return "IoT & Smart Interfacing Solutions";
      case "Embedded": return "Embedded Systems & Real-Time OS";
      default: return "Advanced Computing Solutions";
    }
  }

  private static calculateGrade(results: any[], courseId: string) {
    const coursePassingResults = results.filter(r => r.courseId === courseId && r.passed);
    const highestWeekScores: Record<number, number> = {};
    
    coursePassingResults.forEach(res => {
      if (!highestWeekScores[res.week] || res.score > highestWeekScores[res.week]) {
        highestWeekScores[res.week] = res.score;
      }
    });

    const scores = Object.values(highestWeekScores);
    const avgScore = scores.length > 0 
      ? scores.reduce((acc: number, curr: number) => acc + curr, 0) / scores.length 
      : 70;

    if (avgScore >= 90) return "A+";
    if (avgScore >= 75) return "A";
    return "A";
  }

  static async generateCertificate(userId: number, courseId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        results: true,
        progresses: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const progress = user.progresses.find(p => p.courseId === courseId);
    if (!progress || progress.weekCompleted < 4) {
      throw new AppError(`Training track '${courseId}' not completed yet. Complete all 4 weeks to unlock.`, 403);
    }

    const successPayment = await prisma.payment.findFirst({
      where: {
        userId,
        courseId,
        status: 'SUCCESS'
      }
    });

    if (!successPayment) {
      const error = new AppError(`Payment clearance required to generate certified credentials for '${courseId}'.`, 402);
      (error as any).paymentRequired = true;
      throw error;
    }

    const grade = this.calculateGrade(user.results, courseId);
    const displayCourseName = this.getDisplayCourseName(courseId);
    const credentialId = this.generateCredentialId(user.id, user.name, courseId);

    return {
      name: user.name,
      fatherName: user.fatherName,
      collegeName: user.collegeName,
      branchName: user.branchName,
      courseId,
      courseName: displayCourseName,
      grade: grade,
      credentialId,
      completionDate: new Date(progress.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      signatures: {
        chiefAcademicOfficer: "Prof. Vinayak Singh",
        technicalDirector: "Er. Gaurav Singh"
      }
    };
  }

  static async verifyCertificate(credentialId: string) {
    const match = credentialId.match(/-[A-Z0-9_]+([0-9]{4})-VERIFIED$/i);
    if (!match) {
      throw new AppError('Invalid Credential ID format.', 400);
    }

    const calculatedUserId = parseInt(match[1]) - 1000;
    if (isNaN(calculatedUserId) || calculatedUserId <= 0) {
      throw new AppError('Invalid verification signature.', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: calculatedUserId },
      include: {
        progresses: true,
        results: true
      }
    });

    if (!user) {
      throw new AppError('No registered candidate matches this credential.', 404);
    }

    let courseId = "C";
    if (credentialId.toUpperCase().includes("CPP_EMBEDDED")) courseId = "C++";
    else if (credentialId.toUpperCase().includes("IOT")) courseId = "IoT";
    else if (credentialId.toUpperCase().includes("EMBEDDED")) courseId = "Embedded";
    else if (credentialId.toUpperCase().includes("C_SYSTEMS")) courseId = "C";

    const progress = user.progresses.find(p => p.courseId === courseId);
    if (!progress || progress.weekCompleted < 4) {
      throw new AppError('Credential is still active/uncompleted in database.', 403);
    }

    const expectedId = this.generateCredentialId(user.id, user.name, courseId);
    if (expectedId.toLowerCase() !== credentialId.toLowerCase()) {
      throw new AppError('Credential verification signature mismatch.', 400);
    }

    const grade = this.calculateGrade(user.results, courseId);
    const displayCourseName = this.getDisplayCourseName(courseId);

    return {
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
    };
  }
}

