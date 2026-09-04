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

-- 1:1 with Internship: internshipId is @unique in the schema, so this is a UNIQUE
-- index (Prisma's _key naming), not a plain index.
CREATE UNIQUE INDEX "CertificateRecord_internshipId_key" ON "CertificateRecord"("internshipId");
