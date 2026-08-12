-- Add admin-controlled credential verification status to CertificateRecord (issue #101).
-- New records default to PENDING and require admin verification from the
-- Certificate Access Console before their QR scan reports "Verified".

-- Add columns
ALTER TABLE "CertificateRecord" ADD COLUMN "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "CertificateRecord" ADD COLUMN "verifiedAt" TIMESTAMP(3);

-- Backfill: every credential issued before this feature was verifiable by
-- derivation (completion + VERIFIED payment), so preserve that status quo —
-- mark them all VERIFIED. Admin can un-verify any of them from the console.
UPDATE "CertificateRecord" SET "verificationStatus" = 'VERIFIED';
