# EduNexus Pro → freeCodeCamp-Class Learning Platform — Master Plan

**Date:** 2026-08-07
**Status:** Design Draft (superpowers:brainstorming)
**Author:** CEO-level synthesis (with EduNexus Pro team)
**Audience:** Implementation teams (sub-agents), stakeholders

---

## 0. Executive Summary

EduNexus Pro is a paid Indian ed-tech platform with **genuinely strong theory content** in C/C++/IoT/Embedded but a **fake, shallow delivery layer** (mock code runner, invisible challenges, no practice, no gamification, insecure backend). freeCodeCamp's strength is the opposite: **real, hands-on, practice-first learning** delivered on a clean, minimal, engineering-grade platform.

**Goal:** Transform EduNexus Pro into a freeCodeCamp-class learning platform — clone the *experience* (not the logo): interactive challenge engine, practice-first curriculum, certifications, profile/heatmap, forum — while **preserving all existing user data** and keeping the paid certificate model (₹799, admin-configurable).

**North-star metric:** *Challenges completed per enrolled student* (proxy for real learning). Secondary: certification completion rate, 7-day retention.

**Guiding principles (from audit):**
1. **Honesty over fakery** — delete/rebuild the fake CodePlayground; every "run" must actually run.
2. **Practice-first pedagogy** — freeCodeCamp's ~70% practice / 30% reading. Edunexus is currently 100/0.
3. **Data safety first** — every migration is non-destructive; existing users/payments/progress are never lost.
4. **Ship small, verify, deploy** — CI + tests before every deploy; the platform is live and paying users exist.
5. **FreeCodeCamp-clone feel** — dark-navy minimal design language, split-pane challenge editor, transparent learning map.

---

## 1. Product Vision & Positioning

### 1.1 One-line promise
> "Learn C, C++, IoT, Embedded, Web, Python & SQL the way freeCodeCamp teaches — by building real things, for ₹0, with an industry-verifiable certificate when you finish."

### 1.2 Free vs Paid (freemium, per user decision)
| Track | Free | Paid (certificate) |
|-------|------|--------------------|
| Curriculum reading | ✅ | ✅ |
| Interactive challenges | ✅ | ✅ |
| Quizzes & practice | ✅ | ✅ |
| Progress/streak/heatmap | ✅ | ✅ |
| Certificate (verified, QR) | ❌ | ✅ **₹799** |
| Project review (mentor) | ❌ | ✅ |
| Premium simulators/extra projects | ❌ | ✅ (later) |

**Pricing must be admin-configurable** (course-wise + adjustable over time). See §4.3. Default now: **₹799**.

### 1.3 Variable course durations (user decision)
Every course offers **4-week, 6-week, 8-week** training tracks. The student picks duration at enrollment; the curriculum map, progress math, and certificate reflect that choice. FreeCodeCamp has fixed paths; this is our Indian-market differentiator (aligned with "summer training / industrial training" positioning).

### 1.4 Personas
- **P1 College student** (18-24) — wants an industrial-training certificate, learns by doing, mobile-first, Hindi/Hinglish friendly.
- **P2 Working professional** — upskilling, needs verifiable credential + flexible pace.
- **P3 Admin** (EduNexus team) — needs content/price/student management without code.

---

## 2. Scope (Core Learning — per user decision)

### 2.1 In scope
1. Learning engine: curriculum tree, per-challenge locking, progress.
2. Interactive challenge runner with **real** sandbox execution + tests + hints + solutions.
3. Quizzes (timed, explanations), practice arena, final exam.
4. Certification: verified certs, QR, verification page, LinkedIn-ready.
5. Profile: heatmap, streaks, badges, XP, claimed certs.
6. Community forum (categories, solved markers, staff answers).
7. Analytics & observability.
8. Design system overhaul (freeCodeCamp-inspired).
9. Engineering hygiene: tests, CI, a11y, performance.

### 2.2 Out of scope (Phase 2+, not this plan)
- News/blog, donations infra, 30+ language translations, mobile apps, proctored exams, peer code review marketplace.
- (Noted as future roadmap items only.)

---

## 3. Architecture — Target State

### 3.1 High-level
```
[Browser: React 19 + Vite + TS]
        │  HTTPS
        ▼
[Nginx (existing, ports 8080/8090/5000)]
        │
        ├──► [Frontend SPA :8090]
        │        └─ design system, router, TanStack Query, auth (httpOnly cookie)
        │
        └──► [Backend API :5000]
                 ├─ Express 5 + Prisma (existing, refactored)
                 ├─ Auth (JWT → httpOnly cookie, security hotfixes)
                 ├─ Challenge Sandbox Gateway  ←──► Piston API (or Docker sandbox)
                 ├─ Payments (Razorpay) + admin pricing service
                 ├─ Analytics event sink (PostHog/Umami)
                 └─ Postgres (existing volume — PRESERVED)
```

### 3.2 Key architectural decisions
| Decision | Choice | Why |
|----------|--------|-----|
| Frontend framework | **React 19 + Vite + TS (keep)** | Already the stack; rebuild the app structure cleanly, keep infra |
| Data fetching | **TanStack Query** | Server-state cache, optimistic updates, retry — kills hand-rolled `useEffect` loading |
| State | Server-state (Query) + light Context | fCC doesn't need heavy global state; avoid Redux |
| Routing | React Router (keep) | Add nested route layout: `/learn/:course/:step`, `/challenges/:id`, `/profile` |
| Code sandbox | **Piston API (open-source, free, self-hostable)** | Executes C/C++/Python/JS/SQL safely in containers, returns stdout + exit codes. 10-min integration vs building own judge |
| Auth | JWT → **httpOnly cookie** (+ CSRF token) | Kill the XSS-stealable localStorage JWT (audit critical) |
| Payments | **Razorpay** (Indian market) | Real gateway replaces mock HMAC flow; webhook-verified |
| Analytics | **PostHog** (free tier / self-host) | Product analytics + session replay + feature flags; or Umami for lightweight |
| Errors | **Sentry** (free tier) | Frontend + backend error tracking |
| DB | Postgres via Prisma (keep volume) | Non-destructive migrations only (§4) |

### 3.3 Backend service refactor (incremental, no rewrite)
Keep existing `routes/` + `services/` but:
1. **Security hotfixes first** (§7.1) — quiz auth, rate limiting, JWT, coupon honesty.
2. Extract **ChallengeSandboxService** (routes to Piston).
3. Extract **AdminPricingService** (DB-driven prices + durations).
4. Move **payment verification** to webhook-trusted path.
5. Keep the deep handcrafted content in `curriculumData.ts` / `cadded_curriculum.json` untouched.

---

## 4. Data Model Changes (non-destructive — user data preserved)

### 4.1 Rule: additive-only migration strategy
- **Never `db push --force-reset`.** Use Prisma `migrate dev` additive migrations.
- New columns get sensible defaults so existing rows survive.
- New models are created empty and backfilled by seed scripts that **skip rows that already exist** (protect admin edits — current guard kept).
- Existing `Payment`, `CertificateRecord`, `User`, `Progress` tables: **untouched structurally** except additive fields.

### 4.2 New/changed models
| Model | Change | Type |
|-------|--------|------|
| `Course` | `+ durationOptions: Int[]` (default `[4,6,8]`), `+ basePrice Int` (default 799), `+ durationPriceAdjustment Json?` | additive |
| `Enrollment` (new) | `userId, courseId, durationWeeks, startedAt, plan` — explicit enrollment record | new |
| `CourseProgress` | `+ durationWeeks` (default 4), progress math scales to chosen duration | additive |
| `Coupon` (new) | `code, discountPct, fixedAmount?, expiresAt, maxUses, usedCount` — replaces hardcoded coupons | new |
| `Payment` | `+ amountPaid, + paymentMethod, + razorpayOrderId, + status` (enum) | additive + enum |
| `Challenge` | `+ hints Json[]`, `+ solutionPublic bool` | additive |
| `Streak` (new) | `userId, lastActiveDate, currentStreak` — replace fake `totalQuizzes*2+1` | new |
| `ActivityLog` (new) | `userId, date, challengesDone, xpGained, quizPassed` — powers heatmap | new |
| `Notification` (new) | `userId, type, payload, readAt` | new |
| `CourseReview` (new) | `userId, courseId, rating 1-5, text` | new |
| `Enums` (conversion) | `PaymentStatus`, `ChallengeType`, `SubmissionStatus` — from free strings | additive → swap |

### 4.3 Admin pricing (per user decision)
`AdminPricingService`:
- Admin panel: per-course `basePrice`, `durationPriceAdjustment` (e.g. 4wk=₹499, 6wk=₹799, 8wk=₹999), plus `coupon` management.
- All reads go through `getEffectivePrice(courseId, durationWeeks, couponCode)`.
- **Default now: ₹799** flat; adjustments are admin-time edits, not code deploys.
- Existing ₹499 coupons migrate into `Coupon` table (honored until expiry).

### 4.4 Durations 4/6/8 (per user decision)
- `CourseProgress.durationWeeks` drives: curriculum map renders N weeks, progress % = completed/chosen, certificate date math uses chosen duration.
- Seed content already exists for weeks 1-5 (Tier 1) and 1-20 (Tier 2). Strategy: **define a canonical deep core (Weeks 1-4)** that all durations share, then 6/8 extend with the existing modules — no content is lost, labels adjust.
- UI: enrollment step shows "Choose your training duration" → 4/6/8 weeks cards with price.

---

## 5. Design System (freeCodeCamp-inspired)

### 5.1 Visual language
freeCodeCamp's signature: **dark-navy engineering minimalism, high contrast, zero decoration** — content is king. We adopt the language, not the logo.

| Token | Value (fCC-inspired) | Usage |
|-------|---------------------|-------|
| `--navy-900` | `#0a0a23` | Primary/navbar/buttons |
| `--navy-800` | `#1b1b32` | Secondary panels |
| `--navy-700` | `#2a2a40` | Hover/active states |
| `--gray-bg` | `#f5f6f7` (light) / `#1b1b32` (dark) | Content background |
| `--yellow` | `#f1be32` | Accent / CTAs / highlights |
| `--green` | `#198eee`→ too blue; use `#228b22` | Success, tests pass |
| `--red` | `#d92626` | Failure |
| `--blue` | `#3b82f6` | Links |
| Font | Inter / Lato for UI; JetBrains Mono for code | Clean, loadable |
| Radius | 0-4px (fCC is sharp) | Minimal |

### 5.2 Layouts (fCC clone feel)
1. **Learn map** — left week/topic tree (like fCC curriculum sidebar), right content pane; progress dots per step.
2. **Challenge runner** — split pane: left instructions+hints+solution toggle, right editor+test output+run button. Mobile: stacked with tab switcher.
3. **Profile** — big heatmap (fCC signature), stats row, claimed certs.
4. **Certificate** — formal, QR + credential ID, LinkedIn-ready.
5. **Navbar** — minimal dark: logo · Learn · Practice · Forum · Profile · streak/XP chips.
6. **Admin** — separate routes, tables for students/payments/pricing/coupons/content.

### 5.3 Components (reusable, from atoms)
`Button` (variants), `StepList`, `ChallengePane`, `CodeEditor` (CodeMirror), `TestOutput`, `Heatmap`, `ProgressRing`, `CertCard`, `Modal` (a11y: focus trap), `Toast`, `EmptyState`.

### 5.4 Accessibility (was near-zero — audit)
- Focus management in all modals/drawers.
- Skip-to-content link, ARIA labels on all interactive elements.
- WCAG AA contrast (dark navy + light gray = safe).
- Keyboard navigable curriculum tree + challenge runner.

---

## 6. Content & Curriculum Strategy

### 6.1 Keep the gold, rebuild the shells
| Course | Current state | Strategy |
|--------|---------------|----------|
| C, C++, IoT, Embedded | Deep theory, **0 practice** | Keep text/code. Add 5-15 real challenges each (§6.2) |
| WebDesign, Python, SQL | Template filler + wrong C-code | **Rebuild** — real content authored fresh (§6.3) |
| CADDED Mech/Civil | Encyclopedic, no hands-on | Keep JSON; add practical exercises + simulators |

### 6.2 Challenge engine content (freeCodeCamp ratio)
- Every module gets **≥5 challenges** (read topic → solve → pass → unlock next).
- Each challenge: seed code, instructions, **assertion tests**, 2 hints, solution.
- Target bank: **9 courses × ~20 modules × 5 = ~900 challenges** (phased; start with Tier 1 courses).

### 6.3 WebDesign/Python/SQL rebuild
- Write 15-20 real topics per course with discipline-correct code + progressive difficulty.
- Remove the `${moduleTitle}` interpolation filler and wrong embedded-C blocks.
- Use the 80 handcrafted quiz questions as the **quality bar** for all new questions.

### 6.4 Assessments
- Replace auto-generated quiz templates with handcrafted (or human-AI-collaborative) questions per topic.
- **Final exam** becomes reachable: backend route + UI, 20-30 real questions aggregating the course.
- Practice bank: 5 → **100+** across categories/difficulties.

---

## 7. Engineering & QA

### 7.1 Security hotfixes (do first — live platform)
1. `POST /api/quiz/submit` — add auth, take `userId` from token (critical).
2. Quiz question endpoints — require auth.
3. Apply rate limiter to login/register/payment/quiz/contact.
4. `JWT_SECRET` → strong env value (generate random); move token to httpOnly cookie.
5. Stop exposing `correctAnswer` in quiz submit response.
6. ReactMarkdown/Quill → add DOMPurify / rehype-sanitize; add CSP header in nginx.
7. Real payments (Razorpay) replace mock HMAC self-verification.
8. Leaderboard: never return `email` in any response.
9. `CertificateRecord.verificationCode` → random UUID, not `userId`-derived.

### 7.2 Testing (from zero to green)
| Layer | Tool | Coverage |
|-------|------|----------|
| Unit (services) | Vitest (FE) / Jest+ts-jest (BE) | businessRules, pricing, grading |
| Integration | supertest | auth, quiz, challenge, payment, certificate |
| E2E | Playwright | register→enroll→challenge→quiz→cert happy path |
| Contract | (later) | API schemas |
CI: `.github/workflows/ci.yml` — enable the commented test step; add backend lint; keep build.

### 7.3 Observability
- Sentry: FE + BE error tracking.
- PostHog/Umami: events (`challenge_completed`, `quiz_submitted`, `certificate_claimed`, `page_view`), funnel (visit→register→enroll→complete).
- `/health` route → register at `/api/health` (alias) + docker healthchecks on backend/frontend.
- Cron the existing `backup_db.sh` (nightly) + off-server copy.

### 7.4 Performance
- Convert `edunexus_banner.png` (787KB) → WebP (~100KB); add `loading="lazy"`.
- Route-level lazy loading (exists) + memo heavy AdminDashboard.
- Bundle analyzer in CI.

---

## 8. Sub-Agent Task Distribution (user-requested)

Each sub-project is owned by a focused agent domain. Agents get **small, independent tasks** from the master task board and verify before handing back.

| # | Agent domain | Owns | Typical task (example) |
|---|--------------|------|------------------------|
| A1 | **Architect/Data** | migrations, schema, enums | "Add `Course.durationOptions` additive migration + backfill" |
| A2 | **Learning Engine** | curriculum tree UI, locking, progress | "Build `ChallengeRunner` component with CodeMirror + test output" |
| A3 | **Sandbox** | Piston integration, grading | "Implement `POST /api/challenges/:id/run` → Piston, return stdout/tests" |
| A4 | **Assessment** | quizzes, practice, final exam | "Add explanations to quiz results component" |
| A5 | **Gamification** | streaks, heatmap, badges, XP | "Add `ActivityLog` model + daily streak service" |
| A6 | **Cert & Payments** | admin pricing, durations, Razorpay | "Build admin price editor UI bound to `AdminPricingService`" |
| A7 | **Design System** | tokens, components, a11y | "Implement Button/Modal/Toast component library" |
| A8 | **QA/Infra** | tests, CI, healthchecks, Sentry | "Enable CI test step + write quiz integration tests" |
| A9 | **Analytics** | PostHog events, dashboards | "Instrument `challenge_completed` event" |
| A10 | **Content Writer** | course content, challenges, questions | "Write 5 challenges for C Week 3 (pointers)" |

**Operating rule:** one agent = one focused slice; results verified by QA agent before merge; non-destructive to user data.

---

## 9. Roadmap (phases → deliverables)

| Phase | Duration | Focus | Done when |
|-------|----------|-------|-----------|
| **P0 — Safe Foundation** | ~1 wk | Backup+test restore, additive migrations (durations, pricing, coupons), security hotfixes 1-9, /api/health, cron backup | Live site healthy; all critical vulns closed; data intact |
| **P1 — Learning Engine MVP** | 2-3 wk | Curriculum tree UI (4/6/8 aware), ChallengeRunner, Piston sandbox, hints/solutions, per-challenge locking | Student completes a real C challenge in-browser |
| **P2 — Assessment** | 1-2 wk | Quiz v2 (explanations), practice 100+, reachable final exam, anti-cheat (auth+rate-limit) | Quiz/practice/exam fully server-graded |
| **P3 — Gamification & Profile** | 1 wk | Real streaks, heatmap, badges, XP, profile page | Profile mirrors fCC feel with real data |
| **P4 — Certification & Payments** | 1-2 wk | Razorpay, admin pricing+coupons UI, durations at enrollment, cert verification hardening | Pay ₹799 → verified cert; admin edits price without deploy |
| **P5 — Community & Analytics** | 1-2 wk | Forum v2 (categories/solved/staff), PostHog, Sentry, dashboards | Team sees retention/completion funnels |
| **P6 — Polish** | ongoing | Design system full adoption, a11y, i18n (Hinglish), perf | Lighthouse ≥90, WCAG AA |

### 9.1 MVP definition (what "freeCodeCamp-clone feel" means in 4 weeks)
- User lands on fCC-style learn map → picks C → 4/6/8 weeks → reads → solves real challenges with live tests → weekly quiz → progress/heatmap updates → eligible for paid certificate.

---

## 10. Success Metrics

| Metric | Now | Target (3 months) |
|--------|-----|-------------------|
| Challenges completed/student | 0 | ≥20 |
| Quiz completion rate | ~0 | ≥60% |
| Certificate completion rate | low | ≥15% of enrolled |
| 7-day retention | unknown | ≥35% |
| Practice questions available | 5 | ≥100 |
| Automation coverage | 0% | ≥60% critical paths |
| Lighthouse performance | moderate | ≥90 |

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Breaking live data | Additive migrations, staging restore-test of backup first |
| Sandbox abuse (arbitrary code exec) | Piston containers w/ time+memory limits, rate-limit, no net access |
| Payment integration time | Razorpay test mode first; fall back to manual-verify while in transition |
| Content rebuild cost | Phase it: Tier-1 courses first (highest student value), AI-assisted drafting + human review |
| Scope creep | P0-P6 gates; each phase is independently shippable |

---

*Next step (per superpowers flow): user reviews this spec → writing-plans skill creates the phased implementation plan with the agent task board.*
