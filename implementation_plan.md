# Implementation Plan - Admin CMS Fix & Certificate Access

We will address the two primary issues:
1. Fix the blank screen in the Admin Dashboard "Course Syllabus CMS" tab.
2. Grant administrators access to view/generate certificates for any student/course by bypassing standard completion/payment checks, and fix the certificate routing mismatch/vulnerabilities.

## Proposed Changes

### Frontend Component & Page Updates

#### [MODIFY] [AdminDashboard.tsx](file:///home/abhi/repo/summer-training-portal/frontend/src/pages/AdminDashboard.tsx)
- Modify `fetchCmsCourses` to format courses from the backend directly mapping over the response array instead of calling `Object.keys()` on it (which treated the array as an object and caused a rendering crash).

#### [MODIFY] [AdminPaymentTable.tsx](file:///home/abhi/repo/summer-training-portal/frontend/src/components/organisms/AdminPaymentTable.tsx)
- Add a new "Certificate" column to the table.
- Display a "View Certificate" button/link that redirects to `/certificate?courseId=${t.courseId}&userId=${t.user.id}`.

#### [MODIFY] [Certificate.tsx](file:///home/abhi/repo/summer-training-portal/frontend/src/pages/Certificate.tsx)
- Extract the `userId` query parameter in addition to `courseId`.
- Call `GET /api/certificate/:userId/:courseId` if `userId` is provided, otherwise default to `GET /api/certificate/:courseId` (for own certificate).

---

### Backend Service & Route Updates

#### [MODIFY] [certificateService.ts](file:///home/abhi/repo/summer-training-portal/backend/src/services/certificateService.ts)
- Update `generateCertificate(userId, courseId, isAdmin)` to take an `isAdmin` flag.
- If `isAdmin` is `true`, bypass `progress` and `payment` checks.
- Handle undefined progress record (i.e. if a student hasn't started the course) by falling back to `user.createdAt` for `startDate` and today's date for `endDate`.
- Set returned `startDate` and `endDate` fields in the generated certificate payload to populate the frontend rendering properly.

#### [MODIFY] [certificate.ts](file:///home/abhi/repo/summer-training-portal/backend/src/routes/certificate.ts)
- Define a new endpoint: `GET /api/certificate/:courseId`. Calls `CertificateService.generateCertificate` with `req.user.id` and the current user's admin privilege.
- Update `GET /api/certificate/:userId/:courseId`.
  - Add access controls: Reject requests if the logged-in user is NOT an admin and `req.user.id !== targetUserId`.
  - Calls `CertificateService.generateCertificate` with `targetUserId` and the current user's admin privilege.

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside `frontend/` to verify there are no TypeScript compilation errors.
- Run `npm run build` inside `backend/` to verify there are no compile/type errors.

### Manual Verification
- Verify the Admin Dashboard "Course Syllabus CMS" tab loads properly and displays curriculum details.
- Verify clicking on "View Certificate" in the payment audits table correctly displays the student's certificate with their credentials.
- Verify that a regular student cannot access `/api/certificate/:userId/:courseId` for other users (returns 403).
