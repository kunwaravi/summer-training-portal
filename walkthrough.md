# Walkthrough - Admin CMS, Certificate & User Management Upgrades

I have successfully implemented the Admin Course Syllabus CMS fix, added security-gated certificate retrieval for administrators, added a comprehensive User Management dashboard, and deployed all updates to the Hostinger VPS.

## Changes Made

### Frontend Changes
1. **Admin Syllabus CMS Fix:**
   - Modified `fetchCmsCourses` in [AdminDashboard.tsx](file:///home/abhi/repo/summer-training-portal/frontend/src/pages/AdminDashboard.tsx) to map over the backend course array directly.
2. **Student Payment Logs Upgrade:**
   - Added a new `Certificate` column to the "Student Verification & Checkout Registry" table in [AdminPaymentTable.tsx](file:///home/abhi/repo/summer-training-portal/frontend/src/components/organisms/AdminPaymentTable.tsx).
   - Displayed a `View / Issue` button for each student row pointing to `/certificate?courseId=${t.courseId}&userId=${t.user.id}`.
   - Updated the `Transaction` TypeScript interface to include `id?: number` inside `user`.
3. **Certificate Page Integration:**
   - Modified [Certificate.tsx](file:///home/abhi/repo/summer-training-portal/frontend/src/pages/Certificate.tsx) to parse an optional `userId` query parameter.
   - If `userId` is present, it fetches the certificate details for that user and course using the secure backend admin endpoint.
4. **User Management Dashboard Tab:**
   - Added a new **User Management** tab to the Admin Dashboard ([AdminDashboard.tsx](file:///home/abhi/repo/summer-training-portal/frontend/src/pages/AdminDashboard.tsx)).
   - Renders a responsive list of all registered candidates in the system (showing name, email, college, branch, role, and registration date).
   - Added a trash button to permanently delete any candidate's account (protected with a confirm modal).

### Backend Changes
1. **Certificate Service Admin Bypass & Stable Duration:**
   - Enhanced `generateCertificate` in [certificateService.ts](file:///home/abhi/repo/summer-training-portal/backend/src/services/certificateService.ts) with an `isAdmin` boolean flag.
   - If `isAdmin` is `true`, it bypasses the course week completion (4 weeks) and payment status checks.
   - Calculations use the user's registration date (`user.createdAt`) as `startDate` and add exactly 28 days (4 weeks) to compute a stable `endDate` and `completionDate`. This ensures any student can download their certificate anytime, and it always displays the exact 4-week duration.
   - Included `startDate` and `endDate` fields in the generated payload to populate certificate metadata on the frontend.
2. **Certificate Routes & Access Control:**
   - Updated [certificate.ts](file:///home/abhi/repo/summer-training-portal/backend/src/routes/certificate.ts).
   - Added `GET /api/certificate/:courseId` for standard users to fetch their own certificates.
   - Gated `GET /api/certificate/:userId/:courseId` to prevent unauthorized users from viewing others' certificates (now only accessible by `ADMIN` or the user themselves), and forwarded their admin status to the service layer.
3. **User Management Directory & Account Deletion:**
   - Updated `getAllUsers` and added `deleteUser` inside [authService.ts](file:///home/abhi/repo/summer-training-portal/backend/src/services/authService.ts) to select detailed candidate profiles and handle deletions.
   - Added `DELETE /api/auth/admin/users/:userId` endpoint inside [auth.ts](file:///home/abhi/repo/summer-training-portal/backend/src/routes/auth.ts) to process student deletion requests with safeguards to block self-deletion.

---

## Validation Results

- Both frontend and backend builds successfully completed locally.
- Seeding and container rebuild on Hostinger VPS (`edunexus.kibm.in`) completed with zero errors.
- Verified that all five co-tenant environments on the VPS remain fully operational.

