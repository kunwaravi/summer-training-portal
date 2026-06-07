# Implementation Plan - Admin User Management Console

We will add a "User Management" tab to the Admin Dashboard allowing administrators to list all registered students and delete individual student accounts.

## Proposed Changes

### Frontend Updates

#### [MODIFY] [AdminDashboard.tsx](file:///home/abhi/repo/summer-training-portal/frontend/src/pages/AdminDashboard.tsx)
- Update tabs to support `transactions | cms | users`.
- Add a new tab option: "User Management" (using the `Users` icon).
- Render a responsive user list table showing:
  - Student Name & Role Badge
  - Email address
  - Academic Details (College & Branch)
  - Date of registration
  - Action column containing a delete button.
- On delete click, verify using a confirmation modal and then trigger a `DELETE /api/auth/admin/users/:userId` request.
- Ensure the admin cannot delete their own active account.

---

### Backend Updates

#### [MODIFY] [authService.ts](file:///home/abhi/repo/summer-training-portal/backend/src/services/authService.ts)
- Update `getAllUsers` to select complete student metadata (`id`, `name`, `email`, `role`, `createdAt`, `collegeName`, `branchName`).
- Add `deleteUser(userId: number)` database delete service.

#### [MODIFY] [auth.ts](file:///home/abhi/repo/summer-training-portal/backend/src/routes/auth.ts)
- Add a route: `DELETE /api/auth/admin/users/:userId` protected by `authenticateToken` and `isAdmin`.
- Prevent self-deletion by checking if `req.user.id === targetUserId`.

---

## Verification Plan

### Automated Tests
- Build frontend (`npm run build`) to ensure no TypeScript compilation or routing issues.
- Build backend (`npm run build`) to ensure no Express routing or type mismatch errors.

### Manual Verification
- Log in as administrator, go to Admin Dashboard, click the "User Management" tab.
- Verify that the users list loads correctly.
- Attempt to delete a student, verify the confirmation dialog appears, and confirm.
- Verify that the student is successfully deleted and disappears from the dashboard.
- Verify that deleting one's own account is blocked.
