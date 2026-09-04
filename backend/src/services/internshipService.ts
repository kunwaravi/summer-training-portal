import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const INTERNSHIP_STATUSES = ['APPLIED', 'SELECTED', 'ACTIVE', 'COMPLETED'] as const;
export type InternshipStatus = (typeof INTERNSHIP_STATUSES)[number];

// Filter values for ?certificate= (admin list)
export const CERT_FILTERS = {
  ISSUED: 'ISSUED',      // has a CertificateRecord
  PENDING: 'PENDING',    // has a CertificateRecord that is not VERIFIED
  NONE: 'NONE',          // no CertificateRecord yet
} as const;

// Display fields that, once a certificate is issued, must not silently change.
const SENSITIVE_AFTER_ISSUE = [
  'programTitle', 'domain', 'role', 'startDate', 'endDate', 'duration',
  'performanceGrade', 'projectTitle',
] as const;

interface InternshipCreateData {
  programTitle: string;
  domain: string;
  role: string;
  startDate?: string | null;
  endDate?: string | null;
  duration?: string | null;
  institution?: string | null;
  branch?: string | null;
  session?: string | null;
  mentorName?: string | null;
  projectTitle?: string | null;
  performanceGrade?: string | null;
  completionNotes?: string | null;
  remarks?: string | null;
  status?: InternshipStatus;
}

export class InternshipService {
  static async list(opts: {
    search?: string;
    domain?: string;
    status?: string;
    certificate?: string;
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(opts.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(opts.limit) || 20));
    const sort: 'asc' | 'desc' = opts.sort === 'asc' ? 'asc' : 'desc';

    const where: Record<string, unknown> = {};
    if (opts.domain) where.domain = opts.domain;
    if (opts.status) where.status = opts.status;

    if (opts.search) {
      where.OR = [
        { user: { name: { contains: opts.search, mode: 'insensitive' } } },
        { user: { email: { contains: opts.search, mode: 'insensitive' } } },
        { programTitle: { contains: opts.search, mode: 'insensitive' } },
      ];
    }

    const certificate = opts.certificate;
    if (certificate) {
      // Certificate predicate lives in the SQL `where` (not a JS post-filter) so
      // pagination and `total` stay correct when ?certificate= is used.
      if (certificate === CERT_FILTERS.ISSUED) {
        where.certificate = { isNot: null };
      } else if (certificate === CERT_FILTERS.NONE) {
        where.certificate = { is: null };
      } else if (certificate === CERT_FILTERS.PENDING) {
        where.certificate = { isNot: null, verificationStatus: { not: 'VERIFIED' } };
      }
      // Any other value is left as no filter; the route validates the value up front.
    }

    // Admin console summary cards (Task 9 / #102). Global counts across all
    // internships — deliberately NOT scoped to the active filters so the cards
    // describe the whole pipeline while `total` stays the filtered row count.
    const [internships, total, statsTotal, statsActive, statsCompleted, statsIssued, statsPending] =
      await Promise.all([
        prisma.internship.findMany({
          where,
          include: {
            user: { select: { id: true, name: true, email: true } },
            certificate: { select: { id: true, verificationCode: true, verificationStatus: true, createdAt: true } },
          },
          orderBy: { createdAt: sort },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.internship.count({ where }),
        prisma.internship.count(),
        prisma.internship.count({ where: { status: 'ACTIVE' } }),
        prisma.internship.count({ where: { status: 'COMPLETED' } }),
        prisma.internship.count({ where: { certificate: { isNot: null } } }),
        prisma.internship.count({ where: { certificate: { is: { verificationStatus: { not: 'VERIFIED' } } } } }),
      ]);

    return {
      internships,
      total,
      page,
      limit,
      stats: {
        total: statsTotal,
        active: statsActive,
        completed: statsCompleted,
        issued: statsIssued,
        pending: statsPending,
      },
    };
  }

  static async getById(id: string) {
    const internship = await prisma.internship.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, fatherName: true, collegeName: true, branchName: true } },
        certificate: true,
      },
    });
    if (!internship) throw new AppError('Internship record not found.', 404);
    return internship;
  }

  static async listMine(userId: number) {
    return prisma.internship.findMany({
      where: { userId },
      include: { certificate: { select: { verificationCode: true, verificationStatus: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async create(data: InternshipCreateData, resolve: { userId?: number; email?: string }) {
    let userId = resolve.userId;
    if (!userId && resolve.email) {
      const user = await prisma.user.findUnique({ where: { email: resolve.email } });
      if (!user) throw new AppError('No registered user matches that email.', 404);
      userId = user.id;
    }
    if (!userId) throw new AppError('userId or email is required.', 400);

    // Spec: duplicate guard on (userId, programTitle, startDate, endDate) — a candidate may
    // re-sit the same program/domain in a later session, so dates disambiguate. Null date
    // fields match null-date rows (an explicit admin edge case can be created by tweaking a date).
    const dup = await prisma.internship.findFirst({
      where: {
        userId,
        programTitle: data.programTitle,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    if (dup) {
      throw new AppError('Duplicate internship record: this candidate already has the same program in the same period.', 409);
    }

    return prisma.internship.create({
      data: {
        userId,
        programTitle: data.programTitle,
        domain: data.domain,
        role: data.role,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        duration: data.duration ?? null,
        institution: data.institution ?? null,
        branch: data.branch ?? null,
        session: data.session ?? null,
        mentorName: data.mentorName ?? null,
        projectTitle: data.projectTitle ?? null,
        performanceGrade: data.performanceGrade ?? null,
        completionNotes: data.completionNotes ?? null,
        remarks: data.remarks ?? null,
        status: data.status ?? 'APPLIED',
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  static async update(id: string, data: Partial<InternshipCreateData>, opts: { confirm?: boolean } = {}) {
    const existing = await this.getById(id);
    const certIssued = Boolean(existing.certificate);

    if (certIssued && !opts.confirm) {
      const touchesSensitive = SENSITIVE_AFTER_ISSUE.some(
        (k) => data[k as keyof InternshipCreateData] !== undefined
      );
      if (touchesSensitive) {
        throw new AppError(
          'A certificate is already issued for this internship. Changing display fields requires confirmation.',
          409
        );
      }
    }

    const { userId: _ignore, email: _ignore2, ...safe } = data as any;
    return prisma.internship.update({
      where: { id },
      data: {
        ...(safe.programTitle !== undefined && { programTitle: safe.programTitle }),
        ...(safe.domain !== undefined && { domain: safe.domain }),
        ...(safe.role !== undefined && { role: safe.role }),
        ...(safe.startDate !== undefined && { startDate: safe.startDate ? new Date(safe.startDate) : null }),
        ...(safe.endDate !== undefined && { endDate: safe.endDate ? new Date(safe.endDate) : null }),
        ...(safe.duration !== undefined && { duration: safe.duration ?? null }),
        ...(safe.institution !== undefined && { institution: safe.institution ?? null }),
        ...(safe.branch !== undefined && { branch: safe.branch ?? null }),
        ...(safe.session !== undefined && { session: safe.session ?? null }),
        ...(safe.mentorName !== undefined && { mentorName: safe.mentorName ?? null }),
        ...(safe.projectTitle !== undefined && { projectTitle: safe.projectTitle ?? null }),
        ...(safe.performanceGrade !== undefined && { performanceGrade: safe.performanceGrade ?? null }),
        ...(safe.completionNotes !== undefined && { completionNotes: safe.completionNotes ?? null }),
        ...(safe.remarks !== undefined && { remarks: safe.remarks ?? null }),
        ...(safe.status !== undefined && { status: safe.status }),
        ...(safe.certificateEligible !== undefined && { certificateEligible: safe.certificateEligible }),
      },
      include: { user: { select: { id: true, name: true, email: true } }, certificate: true },
    });
  }

  static async remove(id: string) {
    const existing = await this.getById(id);
    if (existing.certificate) {
      throw new AppError('A certificate is issued for this internship. Delete/void it first.', 400);
    }
    await prisma.internship.delete({ where: { id } });
  }

  static async complete(id: string) {
    const existing = await this.getById(id);
    if (existing.status === 'COMPLETED') return existing; // idempotent
    return prisma.internship.update({
      where: { id },
      data: { status: 'COMPLETED', certificateEligible: true },
      include: { user: { select: { id: true, name: true, email: true } }, certificate: true },
    });
  }
}
