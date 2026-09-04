# Internship Certificate Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Internship Completion Certificate credential type to EduNexus Pro (issue #102) by additively extending the schema and reusing the existing certificate registry, without touching training certificates or removing any data.

**Architecture:** New `Internship` table + `CertificateRecord.certificateType` discriminator (TRAINING/INTERNSHIP). New `InternshipService` (CRUD/completion), extended `CertificateService` (type-aware verify + internship issue/display). New Admin tab renders a self-contained `InternshipAdmin` component; new `InternshipCertificate` page mirrors the training template exactly; public `/verify` becomes type-aware; student Dashboard gains a "My Internship" section. All DB changes are additive; applied only by the prod Docker `prisma migrate deploy` on start.

**Tech Stack:** React 19 + Vite + Tailwind, Express 5, Prisma 6 + PostgreSQL, `qrcode.react`, lucide-react. Worktree root: `/home/abhi/repo/.worktrees/internship-certificates` (branch `feat/internship-certificates`, base `origin/master`).

## Global Constraints

- **Additive-only DB:** no data removal, no destructive DDL, no `UPDATE` on existing rows. Existing `CertificateRecord` rows keep `verificationCode`, `verificationStatus`, `courseId`, dates. No QR/verify URL breaks.
- **Training certificate untouched:** `frontend/src/pages/Certificate.tsx` and its route are NOT modified. Training verify responses stay byte-for-byte identical.
- **No parallel system:** extend `CertificateService`/`verify`; never create a second registry.
- **No new dependencies, no new framework.** Follow existing code style (string statuses, `AppError`, `authenticateToken` + `isAdmin` from `../middleware/auth`, `prisma` from `../lib/prisma`, `api` axios client base `/api`).
- Status constants: `APPLIED | SELECTED | ACTIVE | COMPLETED`; `certificateEligible` boolean; certificate `PENDING | VERIFIED`.
- Credential verification rule: new credentials start `PENDING`; only admin VERIFIED credentials expose PII on public verify. Unguessable credential IDs (64-bit crypto hex).
- New intern credential format: `NEX-INT-<16 uppercase hex>`.
- Do not commit the untracked Course-Catalog WIP that lives in the main checkout. This worktree is clean — keep it clean.
- Commit style: `type(scope): summary (#102)`.
- Files are relative to the worktree root `/home/abhi/repo/.worktrees/internship-certificates`.

---

### Task 1: Prisma schema — Internship model + CertificateRecord extension

**Files:**
- Modify: `backend/prisma/schema.prisma`

**Interfaces:**
- Produces: Prisma client with `prisma.internship` and extended `CertificateRecord` (`certificateType`, nullable `courseId`, `internshipId`, `internship` relation), `User.internships`.

- [ ] **Step 1: Add the User back-relation.** In `model User`, after the `certificates CertificateRecord[]` line add:
```prisma
  internships       Internship[]
```

- [ ] **Step 2: Extend `CertificateRecord`.** Replace the whole `model CertificateRecord { ... }` block with:
```prisma
model CertificateRecord {
  id                 String    @id @default(uuid())
  userId             Int
  courseId           String? // null when certificateType = INTERNSHIP
  internshipId       String? // set when certificateType = INTERNSHIP
  certificateType    String    @default("TRAINING") // TRAINING | INTERNSHIP (issue #102)
  verificationCode   String    @unique
  verificationStatus String    @default("PENDING") // PENDING | VERIFIED — admin-controlled (issue #101)
  verifiedAt         DateTime?
  createdAt          DateTime  @default(now())
  user               User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  internship         Internship? @relation(fields: [internshipId], references: [id], onDelete: Restrict)

  @@index([userId])
  @@index([internshipId])
}
```

- [ ] **Step 3: Append the `Internship` model.** Add this model immediately after the `CertificateRecord` block (inside `generator`-free model region):
```prisma
model Internship {
  id                  String    @id @default(cuid())
  userId              Int
  programTitle        String
  domain              String
  role                String
  startDate           DateTime?
  endDate             DateTime?
  duration            String?
  institution         String?
  branch              String?
  session             String?
  mentorName          String?
  projectTitle        String?
  performanceGrade    String?
  completionNotes     String?
  remarks             String?
  status              String    @default("APPLIED") // APPLIED | SELECTED | ACTIVE | COMPLETED
  certificateEligible Boolean   @default(false)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  certificate         CertificateRecord?

  @@index([userId])
  @@index([status])
}
```

- [ ] **Step 4: Validate + regenerate the client**

Run (from the worktree `backend` dir):
```
npm install          # only if node_modules is missing in this worktree
npx prisma validate
npx prisma generate
```
Expected: `validate` reports "Schema is up to date"; `generate` exits 0. `tsc` will fail until Task 3 unless you guard — expected, do not build yet.

- [ ] **Step 5: Commit**

```bash
git add backend/prisma/schema.prisma
git commit -m "feat(db): add Internship model and certificateType to CertificateRecord (#102)"
```

---

### Task 2: Additive migration SQL

**Files:**
- Create: `backend/prisma/migrations/20260904160000_add_internship_certificates/migration.sql`

**Interfaces:**
- Produces: a migration folder the prod Docker `prisma migrate deploy` replays. No data touched; existing rows get `certificateType='TRAINING'` from the column default automatically (no `UPDATE`).

- [ ] **Step 1: Write the migration file** (mirror the comment style of `20260812000000_add_certificate_verification/migration.sql`):
```sql
-- Add Internship entity + certificateType discriminator (issue #102).
-- Additive-only: existing CertificateRecord rows keep courseId/verificationCode/status.
-- The certificateType column default TRAINING tags every pre-existing credential as a
-- Training Certificate without rewriting any row.

-- New Internship table
CREATE TABLE "Internship" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "programTitle" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "duration" TEXT,
    "institution" TEXT,
    "branch" TEXT,
    "session" TEXT,
    "mentorName" TEXT,
    "projectTitle" TEXT,
    "performanceGrade" TEXT,
    "completionNotes" TEXT,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'APPLIED',
    "certificateEligible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Internship_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Internship_userId_idx" ON "Internship"("userId");
CREATE INDEX "Internship_status_idx" ON "Internship"("status");

ALTER TABLE "Internship" ADD CONSTRAINT "Internship_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CertificateRecord: allow internship certificates (no course)
ALTER TABLE "CertificateRecord" ALTER COLUMN "courseId" DROP NOT NULL;

ALTER TABLE "CertificateRecord" ADD COLUMN "certificateType" TEXT NOT NULL DEFAULT 'TRAINING';
ALTER TABLE "CertificateRecord" ADD COLUMN "internshipId" TEXT;

ALTER TABLE "CertificateRecord" ADD CONSTRAINT "CertificateRecord_internshipId_fkey"
    FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "CertificateRecord_internshipId_idx" ON "CertificateRecord"("internshipId");
```

- [ ] **Step 2: Sanity-check the SQL is syntactically valid** (optional if no DB is reachable — do not create/alter anything on a real data DB):
```bash
# Only if a scratch Postgres is available (e.g. the local pg server):
#   createdb scratch_internship_mig 2>/dev/null
#   PGPASSWORD=... psql -d scratch_internship_mig -f backend/prisma/migrations/20260904160000_add_internship_certificates/migration.sql
# Expected: no errors. Drop the scratch db afterwards. Never point at a data DB.
```

- [ ] **Step 3: Commit**

```bash
git add backend/prisma/migrations/20260904160000_add_internship_certificates/
git commit -m "feat(db): additive migration for internship certificates (#102)"
```

---

### Task 3: InternshipService (CRUD + completion)

**Files:**
- Create: `backend/src/services/internshipService.ts`

**Interfaces:**
- Consumes: `prisma` (`../lib/prisma`), `AppError` (`../middleware/errorHandler`). Schema from Task 1.
- Produces:
  - `InternshipService.list({ search?, domain?, status?, certificate?, page, limit, sort })` → `{ internships, total, page, limit }`
  - `InternshipService.getById(id)` → internship incl. `user` and `certificate`
  - `InternshipService.listMine(userId)`
  - `InternshipService.create(data, { userId?, email? })` → created internship (duplicate guard → 409)
  - `InternshipService.update(id, data, opts?)` → updated (sensitive-field gate)
  - `InternshipService.remove(id)` → void (blocks if certificate exists)
  - `InternshipService.complete(id)` → sets COMPLETED + certificateEligible true
  - `InternshipService.CERT_STATUS_*` constants used by the route for the `certificate` filter.

- [ ] **Step 1: Write the service**

```ts
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
    const [rows, total] = await Promise.all([
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
    ]);

    let internships = rows;
    if (certificate) {
      internships = rows.filter((r) => {
        const has = Boolean(r.certificate);
        if (certificate === CERT_FILTERS.ISSUED) return has;
        if (certificate === CERT_FILTERS.NONE) return !has;
        if (certificate === CERT_FILTERS.PENDING) return has && r.certificate!.verificationStatus !== 'VERIFIED';
        return true;
      });
    }

    return { internships, total, page, limit };
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

    const dup = await prisma.internship.findFirst({
      where: {
        userId,
        programTitle: data.programTitle,
        domain: data.domain,
        role: data.role,
      },
    });
    if (dup) {
      throw new AppError('Duplicate internship record: this candidate already has the same program/domain/role.', 409);
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
```

- [ ] **Step 2: Verify it compiles**

```
npx tsc --noEmit
```
Expected: no errors in this file (pre-existing errors elsewhere are out of scope; report them if any appear).

- [ ] **Step 3: Commit**

```bash
git add backend/src/services/internshipService.ts
git commit -m "feat(internships): add InternshipService CRUD and completion (#102)"
```

---

### Task 4: CertificateService — internship issue, type-aware verify, display payload

**Files:**
- Modify: `backend/src/services/certificateService.ts`

**Interfaces:**
- Consumes: `prisma`, `crypto`, `AppError` (already imported). Internship schema from Task 1.
- Produces:
  - `CertificateService.generateInternshipCertificate(internshipId)` → merged payload (issue/reuse, PENDING)
  - `CertificateService.getInternshipCertificateDisplay(internshipId, viewerUserId, viewerRole)`
  - `verifyCertificate()` now returns internship-shaped data for INTERNSHIP records; TRAINING output unchanged.

- [ ] **Step 1: Add an intern credential-ID generator.** Inside `class CertificateService`, add:
```ts
  private static generateInternshipCredentialId() {
    const randomPart = crypto.randomBytes(8).toString('hex').toUpperCase();
    return `NEX-INT-${randomPart}`;
  }
```

- [ ] **Step 2: Make `verifyIssuedCredential` type-aware.** Replace the body of `verifyIssuedCredential` with:
```ts
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
```

- [ ] **Step 3: Add the internship verifier** (private static, placed after `verifyIssuedCredential`):
```ts
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
```

- [ ] **Step 4: Add issue + display methods.** Add these public static methods inside the class (before the closing brace):
```ts
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
```

- [ ] **Step 5: Compile**

```
npx tsc --noEmit
```
Expected: no new errors in `certificateService.ts`.

- [ ] **Step 6: Commit**

```bash
git add backend/src/services/certificateService.ts
git commit -m "feat(certificate): internship issuance and type-aware verification (#102)"
```

---

### Task 5: Internship routes + mount

**Files:**
- Create: `backend/src/routes/internships.ts`
- Modify: `backend/src/index.ts`

**Interfaces:**
- Consumes: `InternshipService`, `CertificateService`, middleware `authenticateToken`, `isAdmin` from `../middleware/auth`, `AppError` if needed.
- Produces: router mounted at `/api/internships`. Note `/mine` must be declared before `/:id`.

- [ ] **Step 1: Write the router**

```ts
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { InternshipService, CERT_FILTERS } from '../services/internshipService';
import { CertificateService } from '../services/certificateService';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Admin list with filters (search, domain, status, certificate state, pagination, sort)
router.get('/', authenticateToken, isAdmin, async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = await InternshipService.list({
      search: (req.query.search as string) || undefined,
      domain: (req.query.domain as string) || undefined,
      status: (req.query.status as string) || undefined,
      certificate: (req.query.certificate as string) || undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sort: (req.query.sort as 'asc' | 'desc') || 'desc',
    });
    res.json(result);
  } catch (error) { next(error); }
});

// Admin create
router.post('/', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, email, ...data } = req.body;
    const internship = await InternshipService.create(data, { userId, email });
    res.status(201).json(internship);
  } catch (error) { next(error); }
});

// Student: own internships (must be declared before GET /:id)
router.get('/mine', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const internships = await InternshipService.listMine(req.user.id);
    res.json(internships);
  } catch (error) { next(error); }
});

// Admin-or-owner read
router.get('/:id', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const internship = await InternshipService.getById(req.params.id);
    if (req.user.role !== 'ADMIN' && internship.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    res.json(internship);
  } catch (error) { next(error); }
});

// Admin update
router.put('/:id', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const internship = await InternshipService.update(req.params.id, req.body, { confirm: req.body.confirm });
    res.json(internship);
  } catch (error) { next(error); }
});

// Admin delete
router.delete('/:id', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await InternshipService.remove(req.params.id);
    res.json({ success: true });
  } catch (error) { next(error); }
});

// Admin: mark completed + certificate-eligible (never auto-issues a certificate)
router.post('/:id/complete', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const internship = await InternshipService.complete(req.params.id);
    res.json({ success: true, internship });
  } catch (error) { next(error); }
});

// Admin: issue (or reuse) an internship certificate -> PENDING
router.post('/:id/certificate', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = await CertificateService.generateInternshipCertificate(req.params.id);
    res.json(payload);
  } catch (error) { next(error); }
});

export default router;
```

- [ ] **Step 2: Mount in `backend/src/index.ts`.** After the certificate import block add:
```ts
import internshipRoutes from './routes/internships';
```
and next to the other mounts add:
```ts
app.use('/api/internships', internshipRoutes);
```

- [ ] **Step 3: Compile**

```
npx tsc --noEmit
```
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add backend/src/routes/internships.ts backend/src/index.ts
git commit -m "feat(internships): add admin/student API routes (#102)"
```

---

### Task 6: Certificate routes — internship display endpoint

**Files:**
- Modify: `backend/src/routes/certificate.ts`

**Interfaces:**
- Consumes: `CertificateService.getInternshipCertificateDisplay`.
- Produces: `GET /api/certificate/internship/:internshipId` (owner or admin). Must be registered **before** the generic `GET /:userId/:courseId` route so `internship` is not swallowed as `userId`.

- [ ] **Step 1: Insert the route.** Place this directly above the existing `router.get('/:userId/:courseId', ...)` block:
```ts
// GET /api/certificate/internship/:internshipId - Internship certificate page data.
// Owner-or-admin. Declared before /:userId/:courseId so "internship" is not
// treated as a userId.
router.get('/internship/:internshipId', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const payload = await CertificateService.getInternshipCertificateDisplay(
      req.params.internshipId,
      req.user.id,
      req.user.role
    );
    res.json(payload);
  } catch (error) { next(error); }
});
```

- [ ] **Step 2: Compile**

```
npx tsc --noEmit
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/certificate.ts
git commit -m "feat(certificate): internship certificate display endpoint (#102)"
```

---

### Task 7: Frontend — InternshipCertificate page (exact training design)

**Files:**
- Create: `frontend/src/pages/InternshipCertificate.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Consumes: `GET /api/certificate/internship/:internshipId`, auth context `useAuth`, react-router.
- Produces: route `/internship-certificate?internshipId=<id>`.

- [ ] **Step 1: Read the training template.** Open `frontend/src/pages/Certificate.tsx` in full. You must reproduce its **entire** visual system: the `<style>` block (`.certificate-container`, `.cert-body-style`, `.corner`, gold `#d4af37` accents, navy gradient `#0a1128→#020617`, Cinzel/Montserrat imports), frame, print `@media` rules, `QRCodeSVG`, badge `<img src="/logo.png">`, signature `<img src="/Vinayak_sign-removebg-preview.png">` with "Vinayak Singh / CEO & Co-Founder, EduNexus Pro", and the no-print action row + download-instructions banner.

- [ ] **Step 2: Write `InternshipCertificate.tsx`.** Copy the template 1:1, then change only:
- Component name and the fetch: read `internshipId` from the query string, call `api.get('/certificate/internship/' + internshipId)`.
- Loading/error copy: keep the training styling; use text "Verifying internship credentials and rendering certified credentials...".
- Certificate content (issue §2). Replace the header/body/details with:
  - `.cert-title`: `EDUNEXUS PRO` stays in `.logo-area`; `.cert-title` becomes `INTERNSHIP COMPLETION CERTIFICATE`; `.conferred-text` becomes `This is proudly conferred upon`.
  - `.student-name`: `displayData.name`
  - `.details-text` body (exact wording from issue §2):
    ```
    This is to certify that [NAME], son/daughter of [FATHER] of [COLLEGE], [BRANCH],
    has successfully completed the [DOMAIN] Internship with EduNexus Pro during
    [START] to [END].
    ```
    Render structured rows below it inside a bordered box for: Internship Domain, Role, Duration, Internship Period, Certificate ID, Issue Date (use the `endDate` as Issue Date to mirror training's completion-date convention unless the payload carries an explicit issue date).
  - `.course-box` → replace with the same gold box showing `displayData.programTitle` (or `domain + ' Internship'`).
  - Footer: reuse the exact `.footer-section` / `.credential-info` / `.qr-code` / `.signature-block` markup — QR value stays `` `${window.location.origin}/verify?id=${displayData.credentialId}` ``, and the verification-status chip logic (VERIFIED green / PENDING amber) is copied unchanged.
  - Performance/grade text: if `displayData.performanceGrade` is present, show `PERFORMANCE REVIEW: {grade}` in the same amber span; otherwise render the internship wording "successfully completed the prescribed internship program".
- Add a comment at the top of the file: `// Issue #102: internship template. Mirrors Certificate.tsx (training) exactly — keep both visually in sync.`
- Also add a matching pointer comment at the top of `Certificate.tsx`? Do NOT modify Certificate.tsx — instead put the pointer only in the new file.

- [ ] **Step 3: Register the route in `frontend/src/App.tsx`.** Add an import near the other page imports and a route mirroring the existing `/certificate` entry:
```tsx
const InternshipCertificate = React.lazy(() => import('./pages/InternshipCertificate'));
```
Then inside the same `<Routes>` block that contains `<Route path="/certificate" ...>`:
```tsx
<Route path="/internship-certificate" element={<ProtectedRoute><InternshipCertificate /></ProtectedRoute>} />
```
Match how the app wraps lazy pages with `<Suspense>` elsewhere (check the file; if other lazy pages have no Suspense wrapper, match that pattern).

- [ ] **Step 4: Build**

From `frontend` dir:
```
npm run build
```
Expected: exit 0 (TS + Vite). If the query-string/param or lazy-Suspense pattern differs, adapt to the existing convention and re-run.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/InternshipCertificate.tsx frontend/src/App.tsx
git commit -m "feat(certificate): internship certificate page (training design parity) (#102)"
```

---

### Task 8: Frontend — type-aware public `/verify`

**Files:**
- Modify: `frontend/src/pages/Verify.tsx`

**Interfaces:**
- Consumes: verify response shape from Task 4 (`verified`, `certificateType`, `credentialTitle`, `candidateName`, `programTitle`, `domain`, `role`, `duration`, `startDate`, `endDate`, `issuedBy`, `credentialId`). PENDING internship = no PII fields.
- Produces: internship verification panel; training rendering unchanged.

- [ ] **Step 1: Locate the data flow.** In `Verify.tsx` find where the verified result is fetched (around `api.get('/certificate/verify/...')`) and where a successful result triggers the extra course lookup `api.get('/courses/' + courseId + '/public')`.

- [ ] **Step 2: Skip the course lookup for internships.** Guard the course-enrichment call so it only runs when the result is a training credential:
```tsx
if (res.data?.verified && (!res.data.certificateType || res.data.certificateType === 'TRAINING') && res.data.courseId) {
  // existing /courses/:courseId/public enrichment
}
```

- [ ] **Step 3: Render the internship success panel.** In the success branch (currently rendering `result.candidateName`, `result.courseName`, etc.), add a sibling branch rendered when `result.certificateType === 'INTERNSHIP'`, styled to match the existing panels, showing:
- Certificate Type: `Internship Completion Certificate`
- Status: `VERIFIED`
- Candidate: `result.candidateName`
- Internship: `${result.programTitle}` and Domain: `${result.domain}`
- Role: `${result.role}`
- Duration: `${result.duration}`
- Internship Period: `${result.startDate} – ${result.endDate}`
- Issued By: `EduNexus Pro`
- Credential ID: the credential id being verified
Keep the same panel containers/colors used by the training success card.

- [ ] **Step 4: PENDING internship shows no PII.** In the existing pending/unverified branch, when `result.certificateType === 'INTERNSHIP'` show only the generic message + `auditStatus` and the label `Internship Completion Certificate` — no candidate/domain/role (the backend already omits them; do not fabricate them).

- [ ] **Step 5: Build + lint**

From `frontend`:
```
npm run build && npm run lint
```
Expected: exit 0. Fix any lint errors introduced.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/Verify.tsx
git commit -m "feat(verify): type-aware public verification for internship credentials (#102)"
```

---

### Task 9: Frontend — Admin Internship Management tab

**Files:**
- Create: `frontend/src/components/admin/InternshipAdmin.tsx`
- Modify: `frontend/src/pages/AdminDashboard.tsx`

**Interfaces:**
- Consumes: `api` axios client (`/internships`, `/internship` relative to base `/api`), `useUI()` hook from `AdminDashboard`'s module or the app's UI context for `confirmDialog`/`addToast` (verify the import path used by AdminDashboard). lucide-react icons.
- Produces: `activeTab === 'internships'` renders `<InternshipAdmin />`.

- [ ] **Step 1: Extend `AdminTab`.** In `AdminDashboard.tsx` change the union type (line ~59):
```ts
type AdminTab = 'transactions' | 'cms' | 'users' | 'analytics' | 'referrals' | 'messages' | 'settings' | 'review' | 'internships';
```

- [ ] **Step 2: Add the tab button.** In the tab-bar array (around line 876) add an entry; match sibling formatting, pick an unused icon (e.g. `Briefcase`):
```tsx
{ id: 'internships' as const, label: 'Internship Mgmt', icon: <Briefcase size={20} className="shrink-0" /> },
```
Add `Briefcase` to the existing lucide-react import in that file.

- [ ] **Step 3: Render the component.** Add a body block next to the other `{activeTab === '...' && (...)}` blocks:
```tsx
{activeTab === 'internships' && <InternshipAdmin />}
```
Import `InternshipAdmin` at the top of `AdminDashboard.tsx`:
```tsx
import InternshipAdmin from '../components/admin/InternshipAdmin';
```
`handleTabClick` (line ~614) just switches `activeTab`; the component self-fetches on mount, so no extra wiring is needed unless you want lazy loading — if you add lazy loading, load it like the page-level lazy components and wrap in `<Suspense>`.

- [ ] **Step 4: Write `InternshipAdmin.tsx`.** A self-contained component styled with the same Tailwind slate palette used across AdminDashboard. Required behavior:
- State: internships, total, page, limit (20), filters `{ search, domain, status, certificate }`, sort `'desc'`, loading/error, modal open/editing internship, form state, actions in-flight flags.
- `fetchList()` → `api.get('/internships', { params: { ...filters, page, limit, sort } })`, store `res.data.internships` + `res.data.total`.
- Summary cards (Total / Active / Completed / Certificates Issued / Pending Verification) computed from `res.data` (add a lightweight `stats` object to the backend list response OR compute client-side from a count call — simplest: return counts from the same list response in Task 3 by adding `stats`; if you prefer, compute card counts by requesting `limit=1&page=1` plus a separate light count route — do NOT add more endpoints unless needed; computing from `total` per filter is enough for Total/Active/Completed via three quick queries OR extend Task 3's `list` to also return `stats`).
  - To keep Task 3 output stable, in this task extend `InternshipService.list` to also return `stats: { total, active, completed, issued, pending }` (four extra `count` queries, cheap) and thread it through the route. Do that here if the Task-3 version was committed without it.
- Table columns: Candidate | Domain | Role | Start | End | Status | Certificate | Actions.
- Row actions: Edit, Mark Completed, Generate/Regenerate, View (window.open `/internship-certificate?internshipId=...`), Verify / Un-verify (only when a cert exists), Copy Link (clipboard copy of `.../verify?id=credentialId`), Delete (confirm dialog; disabled note when a certificate exists).
- Create/Edit modal: fields programTitle, domain, role, startDate, endDate, duration, institution, branch, session, mentorName, projectTitle, performanceGrade, status, certificateEligible (toggle), and for create: an existing-user picker — search `api.get('/users?...')` per the pattern AdminDashboard's user selector uses (or reuse an already-loaded user list passed as a prop; simplest is to reuse AdminDashboard's existing `/users` fetch only if in the same module — otherwise implement a small searchable select that calls the users endpoint with a `search` query). Never create a user here.
- For a sensitive edit when a certificate exists, call PUT with `{ ...form, confirm: true }` and surface a confirmation via `confirmDialog` first (title/message matching existing dialogs).
- Dangerous actions (Delete, Un-verify) go through `confirmDialog`.
- Status/eligibility display chips: APPLIED slate, SELECTED indigo, ACTIVE amber, COMPLETED emerald; cert states PENDING amber, VERIFIED emerald, none slate.

- [ ] **Step 5: Build + lint**

From `frontend`:
```
npm run build && npm run lint
```
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/admin/InternshipAdmin.tsx frontend/src/pages/AdminDashboard.tsx backend/src/services/internshipService.ts backend/src/routes/internships.ts
git commit -m "feat(admin): internship management console with lifecycle actions (#102)"
```

---

### Task 10: Frontend — student Dashboard "My Internship"

**Files:**
- Modify: `frontend/src/pages/Dashboard.tsx`

**Interfaces:**
- Consumes: `GET /api/internships/mine`, `useAuth`.
- Produces: a distinct "My Internship" section.

- [ ] **Step 1: Locate an insertion point.** In `Dashboard.tsx` find the section that lists the student's enrolled courses / activity cards and the imports block. Add state + fetch inside the component:
```tsx
const [myInternships, setMyInternships] = useState<any[]>([]);
useEffect(() => {
  api.get('/internships/mine')
    .then((r) => setMyInternships(r.data))
    .catch(() => setMyInternships([]));
}, []);
```
Match the file's existing `api` import path and `useState/useEffect` usage. If `Dashboard.tsx` doesn't import `api` yet, add it the same way other pages do (`import api from '../api'`).

- [ ] **Step 2: Render the section.** Add a card/section titled **My Internship** (visually separate from the course cards — e.g. a distinct bordered panel with an internship icon from lucide). For each internship render: program, domain, role, duration, start–end, status chip, and, only when a certificate is present and VERIFIED-capable, a button **View Internship Certificate** that opens `/internship-certificate?internshipId=${internship.id}` in a new tab. Empty state: "No internships yet." Label the section clearly as an internship area (not mixed with training certificates).

- [ ] **Step 3: Build + lint**

From `frontend`:
```
npm run build && npm run lint
```
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/Dashboard.tsx
git commit -m "feat(dashboard): show My Internship with certificate access (#102)"
```

---

### Task 11: Full validation + regression + PR prep

**Files:** none (verification only).

- [ ] **Step 1: Backend build**

From `backend`:
```
npm run build
```
Expected: exit 0.

- [ ] **Step 2: Prisma sanity**

```
npx prisma validate
npx prisma generate
```
Expected: both exit 0. Diff review of the migration SQL: confirm only additive DDL and no `UPDATE`/`DELETE`.

- [ ] **Step 3: Frontend build + lint**

From `frontend`:
```
npm run build && npm run lint
```
Expected: exit 0.

- [ ] **Step 4: Static regression audit (manual).** Grep-confirm training paths are unmodified in behavior:
```
git diff origin/master -- frontend/src/pages/Certificate.tsx frontend/src/routes/certificate.ts 2>/dev/null | head
```
- `frontend/src/pages/Certificate.tsx` must be absent from the diff (untouched).
- `backend/src/routes/certificate.ts` diff must be limited to the added `/internship/:internshipId` block.
- `backend/src/services/certificateService.ts` diff must show only the new methods and the type-aware branch in `verifyIssuedCredential` (TRAINING branch text unchanged).

- [ ] **Step 5: Commit any remaining fixes, then show the log**
```bash
git log --oneline origin/master..HEAD
```

- [ ] **Step 6: Push + open PR (deploy-on-merge is live from `master`).** Push the branch and open a PR against `master`; do **not** merge. Present the branch + PR to the user and confirm before merging (merging ships to prod and the additive migration will auto-apply on container start).

---

## Self-review notes

- Spec coverage: data model (T1–T2), backend CRUD/rules (T3–T6), admin console (T9), internship cert page + design parity (T7), type-aware verify + privacy (T8, T4), student My Internship (T10), regression/acceptance (T11). Issue sections §1–§22 map across these tasks.
- No placeholders: every code-bearing step has concrete code or a precise mirror-from-file instruction with the exact file to mirror and the fields to swap.
- Type consistency: `InternshipService.list` returns `{ internships, total, page, limit }` (Task 3) — Task 9 may extend it to add `stats`; if so it must update the route and the consumer together (single commit flagged in Task 9). Credential shapes share the `verificationStatus`/`verificationCode` field names already used by the codebase.
