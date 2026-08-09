import prisma from '../lib/prisma';
import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler';

export class CertificateService {
  /**
   * Generate a random, non-predictable credential ID (issue #66).
   * Old IDs encoded `1000 + userId` in plain text, letting anyone guess
   * other users' credentials and leak their data via the verify endpoint.
   * New IDs use 64 bits of cryptographic randomness — unguessable.
   */
  private static generateCredentialId(courseId: string) {
    const cleanCourseKey = courseId.toUpperCase() === "C++" ? "CPP_EMBEDDED" : courseId.toUpperCase() + "_SYSTEMS";
    const randomPart = crypto.randomBytes(8).toString('hex').toUpperCase();
    return `NEX-${randomPart}-${cleanCourseKey}`;
  }

  /**
   * Legacy predictable formula — kept ONLY to verify certificates that were
   * issued before the random-ID fix. Never used to issue new credentials.
   */
  private static generateLegacyCredentialId(userId: number, name: string, courseId: string) {
    const cleanFirstName = name.trim().split(' ')[0].toUpperCase();
    const cleanCourseKey = courseId.toUpperCase() === "C++" ? "CPP_EMBEDDED" : courseId.toUpperCase() + "_SYSTEMS";
    return `NEX-${cleanCourseKey}-${cleanFirstName}${1000 + userId}-VERIFIED`;
  }

  private static getDisplayCourseName(courseId: string) {
    switch (courseId) {
      case "C": return "C & Systems Programming for Hardware";
      case "C++": return "C++ & OOP for Embedded Systems";
      case "IoT": return "IoT & Smart Interfacing Solutions";
      case "Embedded": return "Embedded Systems & Real-Time OS";
      case "WebDesign": return "Web Design & Frontend Development";
      case "Python": return "Python Programming & Scripting";
      case "SQL": return "Database Management & SQL";
      case "CADDED_Mech": return "CADDED Software (Mechanical)";
      case "CADDED_Civil": return "CADDED Software (Civil/Architecture)";
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

    // No real quiz history (e.g. admin-granted certificate) → modest pass,
    // not the inflated A everyone got before (issue #67).
    if (scores.length === 0) return "B";

    const avgScore = scores.reduce((acc: number, curr: number) => acc + curr, 0) / scores.length;

    if (avgScore >= 90) return "A+";
    if (avgScore >= 80) return "A";
    if (avgScore >= 70) return "B+";
    if (avgScore >= 60) return "B";
    if (avgScore >= 50) return "C";
    return "D"; // below 50 — no auto-pass (issue #67)
  }

  static async generateCertificate(userId: number, courseId: string, isAdmin = false) {
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

    if (!isAdmin) {
      const totalModules = await prisma.module.count({
        where: { courseId }
      });
      const requiredWeeks = totalModules > 0 ? totalModules : 20;

      if (!progress || (progress.weekCompleted < requiredWeeks && !progress.completed)) {
        throw new AppError(`Training track '${courseId}' not completed yet. Complete all ${requiredWeeks} chapters to unlock.`, 403);
      }

      const successPayment = await prisma.payment.findFirst({
        where: {
          userId,
          courseId,
          status: 'VERIFIED'
        }
      });

      if (!successPayment) {
        const error = new AppError(`Payment clearance required to generate certified credentials for '${courseId}'.`, 402);
        (error as any).paymentRequired = true;
        throw error;
      }
    }

    const grade = this.calculateGrade(user.results, courseId);
    const displayCourseName = this.getDisplayCourseName(courseId);

    // Persist the credential so verification is a record lookup, not ID parsing.
    // Reuses an existing record for this user+course so a re-generated
    // certificate keeps its already-printed ID verifiable (issue #66).
    let credentialId = this.generateCredentialId(courseId);
    const existingRecord = await prisma.certificateRecord.findFirst({
      where: { userId: user.id, courseId }
    });
    if (existingRecord) {
      credentialId = existingRecord.verificationCode;
    } else {
      await prisma.certificateRecord.create({
        data: {
          userId: user.id,
          courseId,
          verificationCode: credentialId
        }
      });
    }

    const startDateObj = user.certificateStartDate ? new Date(user.certificateStartDate) : new Date(user.createdAt);
    const endDateObj = user.certificateEndDate
      ? new Date(user.certificateEndDate)
      : new Date(startDateObj.getTime() + 28 * 24 * 60 * 60 * 1000); // fallback: 28 days after start

    const startDate = startDateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const endDate = endDateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const completionDate = endDate;

    return {
      name: user.name,
      fatherName: user.fatherName,
      collegeName: user.collegeName,
      branchName: user.branchName,
      courseId,
      courseName: displayCourseName,
      grade: grade,
      credentialId,
      completionDate,
      startDate,
      endDate,
      signatures: {
        chiefAcademicOfficer: "Prof. Vinayak Singh",
        technicalDirector: "Er. Gaurav Singh"
      }
    };
  }

  static async verifyCertificate(credentialId: string) {
    const cleanId = credentialId.trim();

    // New format (issue #66): the credential is stored in CertificateRecord, so
    // verification is a simple unique lookup. Nothing user-derived is in the ID.
    const record = await prisma.certificateRecord.findUnique({
      where: { verificationCode: cleanId }
    });
    if (record) {
      return this.verifyUserAndCourse(record.userId, record.courseId);
    }

    // Legacy format: certificates issued before the random-ID fix. Parsed only
    // so already-printed credentials keep verifying. Do NOT extend this path.
    return this.verifyLegacy(cleanId);
  }

  private static async verifyUserAndCourse(userId: number, courseId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        progresses: true,
        results: true
      }
    });

    if (!user) {
      throw new AppError('No registered candidate matches this credential.', 404);
    }

    const progress = user.progresses.find(p => p.courseId === courseId);
    const totalModules = await prisma.module.count({ where: { courseId } });
    const requiredWeeks = totalModules > 0 ? totalModules : 20;
    const isCompleted = progress && (progress.completed || progress.weekCompleted >= requiredWeeks);

    const successPayment = await prisma.payment.findFirst({
      where: {
        userId,
        courseId,
        status: 'VERIFIED'
      }
    });

    if (!isCompleted || !successPayment) {
      throw new AppError('Credential is still active/uncompleted or unpaid in database.', 403);
    }

    const grade = this.calculateGrade(user.results, courseId);
    const displayCourseName = this.getDisplayCourseName(courseId);

    const endDateObj = user.certificateEndDate
      ? new Date(user.certificateEndDate)
      : new Date(user.createdAt.getTime() + 28 * 24 * 60 * 60 * 1000);

    const completionDate = endDateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      verified: true,
      auditStatus: "ACTIVE / VERIFIED",
      candidateName: user.name,
      fatherName: user.fatherName,
      collegeName: user.collegeName,
      branchName: user.branchName,
      courseId,
      courseName: displayCourseName,
      grade,
      completionDate,
      accreditationRegistry: "EduNexus Pro Credential Registry",
      compliance: "Verified by EduNexus Pro against training completion records"
    };
  }

  private static async verifyLegacy(credentialId: string) {
    const match = credentialId.match(/-[A-Z0-9_.\s-]+?([0-9]+)-VERIFIED$/i);
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

    const parts = credentialId.split('-');
    if (parts.length < 4) {
      throw new AppError('Invalid Credential ID format.', 400);
    }
    const cleanCourseKey = parts[1].toUpperCase();
    let courseId = "C";
    if (cleanCourseKey === "CPP_EMBEDDED") courseId = "C++";
    else if (cleanCourseKey === "IOT_SYSTEMS") courseId = "IoT";
    else if (cleanCourseKey === "EMBEDDED_SYSTEMS") courseId = "Embedded";
    else if (cleanCourseKey === "C_SYSTEMS") courseId = "C";
    else if (cleanCourseKey === "WEBDESIGN_SYSTEMS") courseId = "WebDesign";
    else if (cleanCourseKey === "PYTHON_SYSTEMS") courseId = "Python";
    else if (cleanCourseKey === "SQL_SYSTEMS") courseId = "SQL";
    else if (cleanCourseKey === "CADDED_MECH_SYSTEMS") courseId = "CADDED_Mech";
    else if (cleanCourseKey === "CADDED_CIVIL_SYSTEMS") courseId = "CADDED_Civil";
    else {
      throw new AppError('Unknown course key in credential.', 400);
    }

    const expectedId = this.generateLegacyCredentialId(user.id, user.name, courseId);
    if (expectedId.toLowerCase() !== credentialId.toLowerCase()) {
      throw new AppError('Credential verification signature mismatch.', 400);
    }

    return this.verifyUserAndCourse(user.id, courseId);
  }
}
