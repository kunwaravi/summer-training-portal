# EduNexus Pro — Backlog Clearance & UX Roadmap

**Date:** 2026-08-10
**Owner:** kunwaravi (with Claude Code)
**Status:** Approved by user — implementation in progress

## Context

GitHub scan found **32 open issues**. Code verification shows a large fraction were already fixed in
commit `19f58fc` (issues #64-76) but **never closed on GitHub**. Goal: close stale issues with
evidence, fix the real remaining bugs, then apply the approved UX redesign phase by phase.

**Hard constraint (user-mandated):** the **Certificate page must remain untouched**.
**Standing requirement (user-mandated):** every screen must be **desktop AND mobile friendly**.

---

## Phase 0 — Housekeeping: verify + close already-fixed issues

For each issue: re-verify the fix exists in current code, comment evidence, then close.

| Issue | Claim | Code evidence |
|-------|-------|---------------|
| #64 | Quiz submit has no auth | `backend/src/routes/quiz.ts:44` — `authenticateToken` on `POST /submit` |
| #65 | Hardcoded webhook/JWT secret | `paymentService.ts:7` `getRequiredEnv('PAYMENT_WEBHOOK_SECRET')`; `index.ts:26` fail-fast on missing `JWT_SECRET` |
| #66 | Guessable credential ID | `certificateService.ts:14` — `crypto.randomBytes(8)` |
| #67 | Grade meaningless (no fail bands) | verify `calculateGrade` has fail bands before closing |
| #68 | Referral 100% free exploit | `paymentService.ts:67-69` — capped at 50% |
| #69 | Forum no enrollment check | `forum.ts:143-151` — enrollment gate on POST |
| #70 | Progress hardcoded /20 | `quizService.ts:33` — dynamic module count |
| #71 | Real code execution | `CodePlayground.tsx` + `backend/src/routes/sandbox.ts` `POST /run` |
| #72 | Run Tests pass/fail | `backend/src/routes/challenge.ts:47` `POST /:id/run-test` |
| #73 | Visual progress map | `ProgressMap.tsx` + `SkillRadar.tsx` |
| #74 | Daily challenge + streak | committed `f075551` |
| #75 | Peer solution viewer | `PeerSolutionsModal.tsx` |
| #76 | Exam results modal | `ExamResultsModal.tsx` |
| #58-60, #62 | Topic quizzes + progression | commit `a2f6b22` |
| #61 | Topic progression lock | verify before closing |
| #63 | Admin candidate edit | commit `76fb6d1` |

**Exit criteria:** open issues 32 → ~15.

---

## Phase 1 — Critical bugs (real remaining work)

| Issue | Priority | Fix |
|-------|----------|-----|
| #86 | 🔴 HIGH | **Forgot Password 404** — frontend `POST /auth/forgot-password` has no backend route. Add route (lookup user, generate reset token, send via email/config; match existing ResetPassword flow). |
| #84 | 🔴 HIGH | **Light mode invisible** — ThemeContext toggles `.light` but components use dark-only classes. Establish theme-aware tokens (Phase 2) and fix the worst offenders. |
| #83 | 🔴 HIGH | **Syllabus text overflows card** — fix `overflow`/line-clamp in course syllabus rendering. |
| #85 | 🟡 MED | **Certificate 'Return to Console'** opens course page, should go to Dashboard. |

---

## Phase 2 — Design foundation (#77)

- Tailwind theme: Inter font, named color tokens (light: indigo `#6366F1` / dark: cyan `#22D3EE`, slate surfaces).
- Typography scale: kill all `text-[8px]`/`text-[9px]` (21 files), floor is 11px for labels.
- Shared component polish: buttons, status badges, avatar chips.
- **This is the base every redesign depends on.**

---

## Phase 3 — Light screens redesign

- #78 Dashboard (daily challenge, skill matrix, milestone submissions, course cards)
- #87 Login/Register + Show Password toggle
- #88 Navbar (contextual links, profile dropdown, animated mobile drawer)
- #89 Admin tabs/icons
- #80 Practice Arena
- #82 Admin review queue

## Phase 4 — Dark screens redesign

- #79 Course Detail (hero, chapter sidebar, code playground)
- #81 Quiz results + Peer Solutions modal polish

## Phase 5 — UX polish + mobile audit (UX-engineer additions)

- Skeleton loaders (perceived speed)
- Quiz timer visual cue (red/pulse in last 60s)
- Empty states (friendly, with CTA)
- **Full mobile responsiveness audit** (admin table, peer solutions, dashboard grid)
- Accessibility: focus rings, contrast, aria-labels
- Standard ConfirmDialog for destructive actions
- Branded 404 page

---

## Execution order

Phase 0 → 1 → 2 → 3 → 4 → 5. Certificate untouched throughout.
