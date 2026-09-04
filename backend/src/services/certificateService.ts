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

  private static generateInternshipCredentialId() {
    const randomPart = crypto.randomBytes(8).toString('hex').toUpperCase();
    return `NEX-INT-${randomPart}`;
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
    let verificationStatus = 'PENDING';
    let verifiedAt: Date | null = null;
    const existingRecord = await prisma.certificateRecord.findFirst({
      where: { userId: user.id, courseId }
    });
    if (existingRecord) {
      credentialId = existingRecord.verificationCode;
      verificationStatus = existingRecord.verificationStatus;
      verifiedAt = existingRecord.verifiedAt;
    } else {
      // Issue #101: a newly issued credential starts PENDING — the admin must
      // verify it from the Certificate Access Console before its QR scan
      // reports "Verified".
      await prisma.certificateRecord.create({
        data: {
          userId: user.id,
          courseId,
          verificationCode: credentialId,
          verificationStatus
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
      verificationStatus,
      verifiedAt,
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
      // Issue #101: verification is admin-controlled and persisted on the
      // record — the status is the source of truth, not a live derivation.
      // The ID is 64-bit random (unguessable), so full verification data is
      // safe to return once the admin has marked it VERIFIED.
      return this.verifyIssuedCredential(record);
    }

    // Legacy format: certificates issued before the random-ID fix. Parsed only
    // so already-printed credentials keep verifying. Do NOT extend this path.
    // SECURITY (#100): legacy IDs are GUESSABLE (`1000 + userId` + first name),
    // so the public verify endpoint must NOT return PII for them — an attacker
    // enumerating IDs would harvest names/colleges. Verify only + course info.
    return this.verifyLegacy(cleanId);
  }

  /**
   * Issue #101: new-format credential lookup driven by the record's persisted
   * verificationStatus. PENDING → reported as not-yet-verified (no PII);
   * VERIFIED → full verification data, skipping the completion/payment re-check
   * because the admin's VERIFIED decision is final (admin-granted credentials
   * may legitimately lack either).
   */
  private static async verifyIssuedCredential(record: any) {
    if (record.certificateType === 'INTERNSHIP') {
      return this.verifyInternshipCredential(record);
    }
    if (record.verificationStatus !== 'VERIFIED') {
      // NOTE: do NOT add fields here — TRAINING responses stay byte-for-byte
      // identical (global constraint). Internship is distinguished by the
      // presence of certificateType === 'INTERNSHIP'.
      return {
        verified: false,
        auditStatus: 'PENDING / AWAITING ADMIN VERIFICATION',
        courseId: record.courseId,
        courseName: this.getDisplayCourseName(record.courseId),
        accreditationRegistry: 'EduNexus Pro Credential Registry',
        message: 'This credential has been issued but is awaiting official verification.'
      };
    }

    return this.verifyUserAndCourse(record.userId, record.courseId, true, false);
  }

  private static async verifyInternshipCredential(record: any) {
    if (record.verificationStatus !== 'VERIFIED') {
      return {
        verified: false,
        auditStatus: 'PENDING / AWAITING ADMIN VERIFICATION',
        certificateType: 'INTERNSHIP',
        credentialTitle: 'Internship Completion Certificate',
        accreditationRegistry: 'EduNexus Pro Credential Registry',
        message: 'This credential has been issued but is awaiting official verification.'
      };
    }

    const internship = await prisma.internship.findUnique({
      where: { id: record.internshipId },
      include: { user: { select: { name: true } } },
    });
    if (!internship) throw new AppError('No internship matches this credential.', 404);

    const fmt = (d?: Date | null) =>
      d ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

    return {
      verified: true,
      auditStatus: 'ACTIVE / VERIFIED',
      certificateType: 'INTERNSHIP',
      credentialTitle: 'Internship Completion Certificate',
      candidateName: internship.user.name,
      programTitle: internship.programTitle,
      domain: internship.domain,
      role: internship.role,
      duration: internship.duration || null,
      startDate: fmt(internship.startDate),
      endDate: fmt(internship.endDate),
      performanceGrade: internship.performanceGrade || null,
      issuedBy: 'EduNexus Pro',
      accreditationRegistry: 'EduNexus Pro Credential Registry',
    };
  }

  private static async verifyUserAndCourse(userId: number, courseId: string, includePii = true, requireActive = true) {
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

    // Legacy derivation gate — only for records that are not admin-verified
    // (requireActive=true). Verified records skip it (issue #101).
    if (requireActive) {
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

    const result: Record<string, unknown> = {
      verified: true,
      auditStatus: "ACTIVE / VERIFIED",
      courseId,
      courseName: displayCourseName,
      completionDate,
      accreditationRegistry: "EduNexus Pro Credential Registry",
      compliance: "Verified by EduNexus Pro against training completion records"
    };

    // PII is only returned for unguessable (new-format) credential IDs, or to
    // an authenticated caller. The legacy path (verifyLegacy) passes includePii
    // = false so guessable IDs can't be enumerated to harvest identities.
    if (includePii) {
      result.candidateName = user.name;
      result.fatherName = user.fatherName;
      result.collegeName = user.collegeName;
      result.branchName = user.branchName;
      result.grade = grade;
    }

    return result;
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

    // includePii=false: legacy IDs are guessable — return only verified-status +
    // course info, never the candidate's personal details.
    return this.verifyUserAndCourse(user.id, courseId, false);
  }

  /**
   * Issue #101: list every issued credential with its persisted verification
   * status, so the admin console can show and toggle each one.
   */
  static async getAllCertificateRecords() {
    return await prisma.certificateRecord.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Issue #101: admin verify/un-verify a credential from the console.
   * VERIFIED stamps verifiedAt; back to PENDING clears it.
   */
  static async setCredentialVerification(recordId: string, verified: boolean) {
    const record = await prisma.certificateRecord.findUnique({
      where: { id: recordId }
    });

    if (!record) return { error: 'Credential record not found.', status: 404 };

    const updatedRecord = await prisma.certificateRecord.update({
      where: { id: recordId },
      data: {
        verificationStatus: verified ? 'VERIFIED' : 'PENDING',
        verifiedAt: verified ? new Date() : null
      }
    });

    return { success: true, record: updatedRecord };
  }

  /**
   * issue #102: admin-only issuance of an Internship Completion Certificate.
   * Gate: internship.status === COMPLETED AND certificateEligible === true.
   * Idempotent: reuses the existing CertificateRecord so the printed credential
   * ID stays stable across regenerations (mirrors training issue #66).
   */
  static async generateInternshipCertificate(internshipId: string) {
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: { user: true, certificate: true },
    });
    if (!internship) throw new AppError('Internship record not found.', 404);
    if (internship.status !== 'COMPLETED' || !internship.certificateEligible) {
      throw new AppError('Certificate can be issued only after the internship is COMPLETED and marked eligible.', 409);
    }

    let record = internship.certificate;
    if (!record) {
      const credentialId = this.generateInternshipCredentialId();
      record = await prisma.certificateRecord.create({
        data: {
          userId: internship.userId,
          courseId: null,
          internshipId: internship.id,
          certificateType: 'INTERNSHIP',
          verificationCode: credentialId,
          verificationStatus: 'PENDING',
        },
      });
    }

    return this.formatInternshipPayload(internship, record);
  }

  /** Issue #102: payload for the InternshipCertificate page. Owner-or-admin. */
  static async getInternshipCertificateDisplay(
    internshipId: string,
    viewerUserId: number,
    viewerRole: string
  ) {
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: { user: true, certificate: true },
    });
    if (!internship) throw new AppError('Internship record not found.', 404);
    if (viewerRole !== 'ADMIN' && internship.userId !== viewerUserId) {
      throw new AppError('Access denied: you can only view your own internship certificates.', 403);
    }
    if (!internship.certificate) {
      throw new AppError('No certificate issued for this internship yet.', 404);
    }
    return this.formatInternshipPayload(internship, internship.certificate);
  }

  private static formatInternshipPayload(internship: any, record: any) {
    const fmt = (d?: Date | null) =>
      d ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
    return {
      certificateType: 'INTERNSHIP',
      name: internship.user.name,
      fatherName: internship.user.fatherName,
      collegeName: internship.user.collegeName,
      branchName: internship.user.branchName,
      programTitle: internship.programTitle,
      domain: internship.domain,
      role: internship.role,
      duration: internship.duration,
      performanceGrade: internship.performanceGrade,
      startDate: fmt(internship.startDate),
      endDate: fmt(internship.endDate),
      credentialId: record.verificationCode,
      verificationStatus: record.verificationStatus,
      verifiedAt: record.verifiedAt,
      internshipId: internship.id,
      signatures: {
        chiefAcademicOfficer: 'Prof. Vinayak Singh',
        technicalDirector: 'Er. Gaurav Singh'
      }
    };
  }
}
