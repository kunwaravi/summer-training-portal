# Design — Internship Certificate Management System (issue #102)

> Date: 2026-09-04 · Status: Approved (brainstorming) · Branch: `feat/internship-certificates`
> GitHub issue: [kunwaravi/edunexuspro#102](https://github.com/kunwaravi/edunexuspro/issues/102)

## Objective

Add a distinct **Internship Completion Certificate** credential type to EduNexus Pro by
extending the existing certificate architecture. The existing **Training Certificate**
system — its design, generation logic, verification flow, working behavior, and stored
data — must remain **untouched and fully intact**.

### Hard constraints

1. **No data removal / no destructive change.** Migration is additive-only. Existing
   `CertificateRecord` rows keep their `verificationCode`, status, dates, and user links.
   No QR / verify URL breaks. No student certificate disappears.
2. **Training Certificate = visual source of truth.** Internship certificate reuses the
   exact same visual design/frame/logo/CEO-signature asset. No redesign.
3. **No parallel verification/certificate system.** Extend the existing
   `CertificateService`, credential registry, and `/verify` flow — do not build a second
   registry.
4. **No new framework / state library / unnecessary dependency.** Follow existing stack
   (React 19 + Vite, Express, Prisma, PostgreSQL) and existing code conventions.
5. **Internship certificates are never auto-issued** by status alone. Admin explicitly
   triggers issuance; records start `PENDING` and require admin verification (issue #101
   semantics) before a QR scan reports Verified.

---

## Current state (verified by inspection, 2026-09-04)

- `CertificateRecord` (backend/prisma/schema.prisma ~line 300) is minimal:
  `id, userId, courseId(String, required), verificationCode(String @unique),
  verificationStatus(String @default "PENDING"), verifiedAt?, createdAt`. `courseId` is a
  plain string (no FK relation) → making it nullable is safe and additive. No
  `certificateType`, no `internshipId`, no `metadata`.
- No `Internship` model exists anywhere (frontend `/internship` page is a public marketing
  page only — no backend, no collision).
- `CertificateService` (backend/src/services/certificateService.ts):
  - Credential IDs: `NEX-<16 hex uppercase>-<COURSE_KEY>_SYSTEMS` (64-bit crypto random).
  - Legacy predictable IDs parsed only for pre-fix certificates (never re-issued).
  - `generateCertificate(userId, courseId, isAdmin)` re-checks module completion + a
    VERIFIED payment for non-admin; admin can bypass. Reuses an existing CertificateRecord
    per (user, course) so regeneration keeps the already-printed ID.
  - `verifyCertificate(credentialId)` → new-format = unique record lookup; PENDING returns
    **no PII**; VERIFIED returns full data. Legacy path returns no PII (guessable IDs).
  - `setCredentialVerification(recordId, verified)` toggles PENDING/VERIFIED + verifiedAt.
  - Admin listing via `getAllCertificateRecords()`.
- Routes (backend/src/routes/certificate.ts): public
  `GET /certificate/verify/:credentialId` (rate-limited); admin
  `GET /certificate/admin/all`, `POST /certificate/admin/:recordId/verify`,
  `POST /certificate/admin/:recordId/unverify`; user
  `GET /certificate/:courseId`, `GET /certificate/:userId/:courseId`. Note the route-order
  rule already applied for `/admin/all` before `/:courseId`.
- Frontend:
  - `Certificate.tsx` = single self-contained 491-line component; entire design is an inline
    scoped `<style>` (navy radial gradient, gold borders, Cinzel/Montserrat, corner
    ornaments, QR via `qrcode.react`). Assets: `/logo.png` (badge), `/Vinayak_sign-removebg-preview.png`
    (CEO signature) + hardcoded "Vinayak Singh / CEO & Co-Founder, EduNexus Pro". QR →
    `${origin}/verify?id=<credentialId>`. A4-landscape print CSS.
  - `Verify.tsx` = public page keyed on `?id=`; on verified it also calls
    `/courses/:courseId/public` for the course title — this must be skipped for internship
    credentials (no course).
  - `AdminDashboard.tsx` (2850 lines) uses `type AdminTab = 'transactions'|'cms'|'users'|…`
    (line ~59) and a tab-bar array (~line 876) with `{activeTab === X && …}` body blocks.
    "Direct Certificate Access Console" (issue #101) generates a cert for a chosen student
    + course and toggles verify/unverify.
- Deploy: backend Docker container runs `prisma migrate deploy` on start (idempotent,
  DEPLOY.md:547). Live site deploys from GitHub `master`. Migration files committed →
  auto-applied at deploy; local (non-Prisma-managed) DB is never migrated.

---

## Data model (additive migration)

### New model: `Internship`

```prisma
model Internship {
  id                  String    @id @default(cuid())
  userId              Int
  programTitle        String
  domain              String
  role                String
  startDate           DateTime?
  endDate             DateTime?
  duration            String?        // e.g. "1 Month", "4 Weeks"
  institution         String?
  branch              String?        // student branch, e.g. "Electronics Engineering"
  session             String?        // e.g. "2025-26"
  mentorName          String?
  projectTitle        String?
  performanceGrade    String?        // optional; maps to cert grade text if present
  completionNotes     String?
  remarks             String?
  status              String    @default("APPLIED") // APPLIED | SELECTED | ACTIVE | COMPLETED
  certificateEligible Boolean   @default(false)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  user        User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  certificate CertificateRecord?

  @@index([userId])
  @@index([status])
}
```

- `status` lifecycle (string constants, matching existing string-status convention):
  `APPLIED → SELECTED → ACTIVE → COMPLETED`. "Certificate Eligible" is the boolean;
  "Certificate Issued" is the existence of a linked `CertificateRecord`.
- Duplicate-internship guard is **service-level** on `(userId, programTitle, startDate,
  endDate)` → 409 with a clear message (no DB unique constraint, so an explicit admin edge
  case can still be created by tweaking a field).
- `onDelete: Cascade` for user (matches User→CertificateRecord today).

### `CertificateRecord` extension (existing rows untouched)

```prisma
model CertificateRecord {
  id                 String    @id @default(uuid())
  userId             Int
  courseId           String?             // nullable now — null for INTERNSHIP
  internshipId       String?             // set for INTERNSHIP
  certificateType    String    @default("TRAINING") // "TRAINING" | "INTERNSHIP"
  verificationCode   String    @unique
  verificationStatus String    @default("PENDING")  // PENDING | VERIFIED
  verifiedAt         DateTime?
  createdAt          DateTime  @default(now())

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  internship Internship? @relation(fields: [internshipId], references: [id], onDelete: Restrict)

  @@index([userId])
  @@index([internshipId])
}
```

- Additive-only SQL: new table + `ALTER` to add `certificateType` (default `TRAINING` →
  existing rows auto-tagged, no rewrite), drop NOT NULL on `courseId`, add `internshipId`,
  add FK + indexes. `verificationCode` unique constraint untouched.
- `onDelete: Restrict` on internship → deleting an internship that has an issued
  certificate is blocked by the DB; the service surfaces a friendly 400 ("certificate
  issued; delete/void certificate first"). Internships without a certificate delete freely.

### Migration mechanics

- Migration authored without running against the real local (`nexus`) DB (not
  Prisma-managed; `migrate deploy` forbidden locally).
- Apply path: commit the migration folder → prod backend container `prisma migrate deploy`
  on next deploy. Prod DB is migration-managed; additive migrations only.
- Local dev gets the new columns/tables only if/when needed — confirmed with user before any
  local `migrate` run (likely a throwaway shadow DB, never `nexus`).

---

## Backend

### Files

- **New** `backend/src/services/internshipService.ts` — Internship CRUD, completion, status.
- **Extend** `backend/src/services/certificateService.ts` — internship-certificate issuance,
  type-aware verification, internship display payload.
- **New** `backend/src/routes/internships.ts` — mounted under `/api/internships`.
- **Extend** `backend/src/routes/certificate.ts` — internship display route (registered
  **before** the generic `/:userId/:courseId` route to avoid path swallowing).

### Rules enforced in the service (never trusted to the client)

- **Issuance gate:** `generateInternshipCertificate` requires `role === ADMIN` AND
  `internship.status === 'COMPLETED'` AND `internship.certificateEligible === true`.
- **No auto-issue:** `complete` only sets `status=COMPLETED` + `certificateEligible=true`;
  it never creates a certificate.
- **Idempotent / reuse:** if a `CertificateRecord` already exists for `internshipId`, return
  it (same `verificationCode`, preserved status) — regeneration reuses the printed ID
  (mirrors training issue #66). No duplicate certificate possible.
- **No payment required** for internship certificates (by design, issue §4).
- Ownership checks in every user-facing read.

### Endpoints

`/api/internships` (all except `/mine` = `authenticateToken` + `isAdmin`):

| Method | Path | Notes |
|---|---|---|
| GET | `/api/internships` | admin list: filters `search`(name/email), `domain`, `status`, `certificate`(ISSUED/PENDING/NONE), pagination, sort newest/oldest |
| POST | `/api/internships` | admin create; `userId` or `email` → resolve existing user (no duplicate-user creation); duplicate guard 409 |
| GET | `/api/internships/mine` | student: own internships + certificate status |
| GET | `/api/internships/:id` | admin or owner |
| PUT | `/api/internships/:id` | admin edit; if a certificate exists and sensitive display fields change → `confirm: true` required (per issue §10) |
| DELETE | `/api/internships/:id` | admin; blocked with 400 if a certificate exists |
| POST | `/api/internships/:id/complete` | admin: `status=COMPLETED`, `certificateEligible=true` |
| POST | `/api/internships/:id/certificate` | admin: issue (or reuse) INTERNSHIP certificate → PENDING |

`/api/certificate` extension:

| Method | Path | Notes |
|---|---|---|
| GET | `/api/certificate/internship/:internshipId` | authenticated; admin or the internship owner → merged display payload for the certificate page |
| GET | `/api/certificate/verify/:credentialId` | existing route now type-aware (below) |

Existing `/api/certificate/:courseId`, `/:userId/:courseId`, `/admin/all`,
`/admin/:recordId/verify`, `/admin/:recordId/unverify` behave exactly as today for
TRAINING records.

### Verification shape (type-aware)

`verifyCertificate(credentialId)` → record found → branch on `record.certificateType`:

- **TRAINING** → existing `verifyIssuedCredential` path. **Unchanged.**
- **INTERNSHIP**:
  - `verificationStatus !== 'VERIFIED'` → `{ verified: false, auditStatus: 'PENDING / AWAITING ADMIN VERIFICATION', certificateType: 'INTERNSHIP', credentialTitle: 'Internship Completion Certificate', message: '…awaiting official verification…' }` — **no PII**.
  - `VERIFIED` → `{ verified: true, auditStatus: 'ACTIVE / VERIFIED', certificateType: 'INTERNSHIP', credentialTitle: 'Internship Completion Certificate', candidateName, programTitle, domain, role, duration, startDate, endDate, issuedBy: 'EduNexus Pro', accreditationRegistry: 'EduNexus Pro Credential Registry' }` — PII is safe here because the credential ID is unguessable and admin-verified (same rule as training).

Legacy (pre-#66) format path is untouched and never returns PII.

### Internship certificate display payload (certificate page)

`getInternshipCertificateDisplay(userId, internshipId, isAdmin)` → user profile fields
(`name, fatherName, collegeName, branchName`) + internship fields
(`programTitle, domain, role, duration, startDate, endDate, performanceGrade`) + credential
fields (`credentialId, verificationStatus, verifiedAt`). Date formatting mirrors training
(long-form en-US). `performanceGrade` maps through the same grade-text function used on the
training cert when present.

---

## Frontend

### 1. Internship certificate page — design parity (Critical Rule)

- **New** `frontend/src/pages/InternshipCertificate.tsx` — self-contained page that mirrors
  `Certificate.tsx`'s exact visual design: identical inline `<style>` block (layout, colors,
  borders, corners, fonts, print CSS), same `/logo.png` badge, same
  `/Vinayak_sign-removebg-preview.png` CEO signature + "Vinayak Singh / CEO & Co-Founder,
  EduNexus Pro". **Content differs only:**
  - Heading: `INTERNSHIP COMPLETION CERTIFICATE`
  - Body per issue §2 (certifies `[NAME]` completed `[PROGRAM/DOMAIN]` Internship with
    EduNexus Pro during `[START]` to `[END]` …)
  - Details: Internship Domain, Role, Duration, Period, Credential ID, Issue Date
  - QR → `${origin}/verify?id=<credentialId>`; verification-status chip mirrors training.
- `Certificate.tsx` is **not modified**. The style lives in the new file as a controlled
  copy; both files carry a comment pointing at the other so future design changes update
  both.
- Route: **new protected route** `/internship-certificate?internshipId=<id>` rendering this
  page (avoids any change to the `/certificate` route/component). Fetches
  `/api/certificate/internship/:internshipId`.

### 2. Public `/verify` (type-aware)

`frontend/src/pages/Verify.tsx` — when a result carries `certificateType: 'INTERNSHIP'`:

- Do **not** call `/courses/:courseId/public` (there is no course).
- VERIFIED → "Internship Completion Certificate" panel: Certificate Type, Status VERIFIED,
  Candidate, Internship (program/domain), Role, Duration, Period, Issued By, Credential ID.
- PENDING → existing generic pending panel with no personal info, labelled as an internship
  credential.
- Training results render exactly as today.

### 3. Admin — Internship Management tab

- `AdminDashboard.tsx`:
  - Extend `type AdminTab` with `'internships'`.
  - Add tab-bar entry `{ id: 'internships', label: 'Internship Mgmt', icon: … }`.
  - Render `{activeTab === 'internships' && <InternshipAdmin />}`.
  - **New** `frontend/src/components/admin/InternshipAdmin.tsx` — self-contained component
    (matches the AdminDashboard Tailwind slate visual language) so the 2850-line file is not
    further bloated.
- Component features (issue §8–§12, §18):
  - Summary cards: Total / Active / Completed / Certificates Issued / Certificates Pending.
  - List table: Candidate | Domain | Role | Start | End | Status | Certificate | Actions.
  - Filters/search: candidate name, email, domain, status, certificate status; pagination;
    sort newest/oldest.
  - Add/Edit form (modal/drawer): candidate (searchable existing-user picker by name/email;
    candidate must be a registered user — no silent duplicate creation), program title,
    domain, role, dates, duration, institution, branch, session, mentor, project, status.
  - Detail drawer: candidate info, internship info, status/progress, completion info,
    certificate info.
  - Actions (clearly separated): Edit, Mark Completed, Generate/Regenerate Certificate,
    View (opens cert page), Verify, Unverify, Print, Copy verification link — dangerous
    actions use the existing confirmation-dialog util.
- Admin certificate console (#101) already lists every record; internship records appear
  there too with a certificate-type filter added carefully (issue §15: All / Training /
  Internship) without changing training behavior.

### 4. Student dashboard — "My Internship"

`frontend/src/pages/Dashboard.tsx` gets a **separate** "My Internship" section (visually
distinct from course cards):

- Lists the student's internships: program, domain, role, duration, start/end, status chips.
- When the internship is COMPLETED + eligible + a certificate is issued, show **View
  Internship Certificate** → `/internship-certificate?internshipId=<id>`.
- Backed by `GET /api/internships/mine`.
- Course (training) certificate entry points are untouched. Labels remain distinct
  ("Training Certificates" vs "Internship Certificates") wherever both are surfaced.

---

## Security / privacy (issue §17)

- Student may only read own internships (service-level ownership check).
- Student cannot create/edit/complete/issue/verify (role guard).
- Only ADMIN manages internships & certificates.
- Public flow is credential-ID/QR verification only; unverified/PENDING credentials expose
  no personal info (mirrors issue #101/#100 rules).
- Internal DB ids are not exposed publicly: credentialId is the public identity; the
  internship display route is auth-gated to owner/admin. The admin verify/unverify console
  already keys on internal record ids behind admin auth.
- Duplicate certificate generation and duplicate internship records are prevented
  server-side.

---

## Non-goals / out of scope

- No change to the Training Certificate model, UI, wording, or visuals.
- No new payment concept for internships (explicitly not required).
- No migration of legacy internships (none exist).
- Public marketing `/internship` page is untouched.

---

## Verification & acceptance

After implementation (on the feature branch):

1. `npx prisma validate` (schema) and confirm migration SQL is additive-only.
2. Backend + frontend `npm run build` and lint.
3. **Training regression:** generate / print / QR verify / admin verify-unverify still work,
   responses byte-for-byte for TRAINING.
4. **Internship happy path:** admin create → mark completed (eligible) → generate (PENDING)
   → verify → QR opens `/verify` → public shows "Internship Completion Certificate" with
   correct fields; student sees "My Internship" + View Certificate.
5. **Negative/security:** non-admin denied on admin endpoints; student cannot issue/verify;
   unverified credential shows no PII; duplicate issue reuses the same ID; duplicate
   internship create blocked.
6. Follow-up per repo convention: an M-052-style E2E harness + validation report pairing
   this implementation with browser evidence (write-free, DB-snapshot-safe).

---

## Final product flow

**Admin:** Admin Portal → Internship Mgmt → Add Internship (existing candidate) → Active →
Mark Completed → Generate Certificate (PENDING) → Verify → share credential link / QR.
**Student:** Dashboard → My Internship → Completed → View Internship Certificate → Print.
**Public:** Scan QR → `edunexus.kibm.in/verify?id=…` → Verified Internship Completion
Certificate (candidate, domain, role, period, credential ID).
