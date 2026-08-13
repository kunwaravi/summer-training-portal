# M-042 — DIALOG / MODAL FOUNDATION + OVERLAY MIGRATION — FINAL REPORT

Date: 2026-08-13 · Scope: `atoms/Dialog.tsx` (new primitive) + 9 overlay migrations + ConfirmDialog refactor. No code committed/deployed.

## 1. Files changed (7)

| File | Change |
|---|---|
| `frontend/src/components/atoms/Dialog.tsx` | **NEW** — accessible Dialog primitive (see §2). |
| `frontend/src/components/atoms/ConfirmDialog.tsx` | Refactored onto the Dialog primitive. Same props/behavior, now gets focus trap/scroll lock/initial focus. |
| `frontend/src/components/molecules/ExamResultsModal.tsx` | Migrated to Dialog (wrapper swap; inner content byte-identical). |
| `frontend/src/components/molecules/PeerSolutionsModal.tsx` | Migrated to Dialog; framer-motion import dropped (no inner motion elements). |
| `frontend/src/pages/AdminDashboard.tsx` | 5 modals migrated (Edit Candidate, Topic Editor, Quiz Editor, Create Course, Create Module). |
| `frontend/src/pages/Home.tsx` | 1 modal migrated (Syllabus Timelines Preview). |
| `frontend/src/index.css` | Added documented z-index layering scale (comment only — no CSS output change). |

**Not touched:** `Certificate.tsx` (0-line diff, verified), `CourseDetail.tsx`, backend, DB, payments, auth, and the 2 intentionally-unmigrated CourseDetail overlays (§4-J).

## 2. Dialog primitive — capabilities (map to requirement list)

| Requirement | Implementation |
|---|---|
| `role="dialog"`, `aria-modal="true"` | Set on the panel. |
| Accessible title/description | `aria-label={title}` (required prop); optional `aria-describedby` via `descriptionId`. |
| Focus trap | Document `keydown` handler cycles Tab between focusables inside the panel; wraps first↔last. |
| Initial focus | `[data-dialog-autofocus]` → first focusable → panel. Per-dialog opt-in (ConfirmDialog → Cancel button; admin forms → first field). |
| Focus restoration | Stores `document.activeElement` on open, restores on close. |
| Escape-to-close | `closeOnEscape` (default true); suppressed while `busy` (mirrors old ConfirmDialog). |
| Background scroll lock | `body overflow:hidden` via a **module-level counter** — nesting-safe (ConfirmDialog over a modal). |
| Overlay/backdrop | `backdropClassName` + `backdropOpacity` per overlay → exact dim/blur parity. Backdrop shares the dialog's z-index. |
| Size variants | `sm/md/lg/xl/full` → `max-w-sm/md/lg/2xl/5xl`. |
| Responsive | Positioning layer `overflow-y-auto`, panel `max-h-[88vh] flex-col overflow-hidden`; per-overlay internal scroll preserved. |
| Busy/loading | `busy` prop: opaque spinner overlay, blocks Esc + backdrop + (consumer) buttons. |
| Close-button accessibility | Close buttons live in children; each has an accessible name (verified per overlay, §4-I). |
| Keyboard accessibility | Focus trap + Esc + focus restore + global `:focus-visible` ring (foundation). |
| z-index layering | `zIndex` prop (default 50, ConfirmDialog 60); scale documented in `index.css`. Backdrop + panel share it. |
| No interaction behind | `fixed inset-0` backdrop + positioning layer capture all pointer events. |

Children own the visible header/body/footer markup (byte-identical to the originals), so screenshot parity is exact. A children **snapshot** keeps the full content mounted through the 200 ms exit animation even when a parent passes `{data && …}` that turns null on close.

## 3. Migration register — the 9 overlays

| # | Overlay | Size | Backdrop (parity) | Esc | Backdrop-click | Initial focus |
|---|---|---|---|---|---|---|
| 1 | ConfirmDialog | sm | black/60 + blur | ✓ | ✓ (was ✓) | Cancel (`data-dialog-autofocus`) |
| 2 | Exam Results | lg | black @ 0.75 | ✓ | **✗ (preserved)** | Close btn |
| 3 | Peer Solutions | xl | black @ 0.6 | ✓ | ✓ (was ✓) | Close btn |
| 4 | Edit Candidate Profile | lg | slate-950/80 + blur | ✓ | **✗ (preserved)** | Full Name |
| 5 | WYSIWYG Topic Editor | full (h-85vh) | black/90 + blur | ✓ | **✗ (preserved)** | Topic Title |
| 6 | Quiz Question CRUD | lg | black/90 + blur | ✓ | **✗ (preserved)** | Question stmt |
| 7 | Create Course Track | md | black/90 + blur | ✓ | **✗ (preserved)** | Course ID |
| 8 | Create Week Module | md | black/90 + blur | ✓ | **✗ (preserved)** | Week no. |
| 9 | Syllabus Preview (Home) | xl | black/80 + blur | ✓ | ✓ (was ✓) | Close btn |

Backdrop-click was added where the original had none (admin modals 4–8) only as **preserved=false** — the original deliberately did *not* close on backdrop click for forms, so accidental clicks can't discard input. It stays `false` for all five.

**Every overlay gained:** Esc-to-close (only ConfirmDialog had it), focus trap, scroll lock, focus restore, initial focus. All without touching a single line of inner form/markup.

## 4. Findings — A–L (CONFIRMED / POTENTIAL / RECOMMENDATION)

### A. Accessible dialog semantics — CONFIRMED
All 9 render `role="dialog" aria-modal="true" aria-label={title}`. Screen readers receive the title. `aria-modal` removes background content from the accessibility tree.

- **RECOMMENDATION:** `descriptionId` is implemented but unused by the 9. Wire it in a follow-up where a dedicated descriptive `<p>` exists (e.g. PeerSolutions subtitle).

### B. Focus management — CONFIRMED
Trap cycles Tab; initial focus lands on the safe/first element; close restores to the trigger.

- **POTENTIAL:** ConfirmDialog stacking over a z-50 modal — on confirm-close, focus returns to the underlying modal's trigger, and the scroll lock stays held until that modal also closes (counter handles it). Verified by construction; no dual-lock leak.

### C. Escape-to-close — CONFIRMED
Works on all 9; suppressed while `busy`. Matches the old ConfirmDialog exactly.

- **POTENTIAL:** Esc on the admin *editor* modals discards unsaved input (same as the "Discard"/"Cancel ✕" buttons, so behavior is consistent, not new). **RECOMMENDATION:** a `dirty`-form confirmation on close could be a future enhancement (M-041), not this task.

### D. Background scroll lock — CONFIRMED
`body` overflow locked on open, restored on close. Nesting-safe via counter. Page scroll position preserved.

### E. Backdrop / overlay behavior — CONFIRMED
Per-overlay dim/blur preserved exactly (0.75 exam, 0.6 peer, 1.0 rest; black/60, black, slate-950/80, black/90, black/80 + blurs). Backdrop now shares the dialog's z-index so a stacked ConfirmDialog always dims what's beneath (the old ConfirmDialog used `z-[60]` on both elements; preserved).

### F. Size variants — CONFIRMED
`sm`…`full` map correctly; Topic Editor uses `full` + `h-[85vh]` for its fixed two-pane workspace.

- **POTENTIAL:** PeerSolutions was `max-h-[85vh]`, now uniform `88vh` (≈3vh, ~25 px). Accepted as a deliberate uniform base; internal body scroll means no functional difference.

### G. Responsive behavior — CONFIRMED (with one gap)
Positioning layer scrolls; panels cap at 88vh; per-overlay `flex-1 overflow-y-auto` bodies preserved.

- **POTENTIAL:** The 5 admin form modals have no *internal* scroll — pre-existing. On very short viewports the tallest (Edit Candidate) bottom can clip. **RECOMMENDATION:** give that form `overflow-y-auto` in a follow-up.

### H. Busy/loading — CONFIRMED
`busy` renders an opaque spinner and blocks all close paths. ConfirmDialog wires it; the current promise flow closes immediately (`settleConfirm(true)`), so busy can't leave the dialog stuck — verified by construction.

- **POTENTIAL:** PeerSolutions keeps its own in-body loading spinner (not `busy`) — preserved intentionally; no overlay regression.

### I. Close-button accessibility — CONFIRMED
Every close trigger has an accessible name: `aria-label` on ConfirmDialog ("Close dialog"), ExamResults ("Close exam results"), PeerSolutions ("Close peer solutions"), Edit Candidate ("Close edit candidate dialog"), Home preview ("Close syllabus preview"); the Topic/Quiz/Course/Module editors close via visible-text buttons ("Cancel ✕" / "Discard"), which carry their own accessible names.

### J. z-index layering — CONFIRMED
Established and documented in `index.css`: overlays `50` → confirm `60` → FAB `9999` → toasts `10001`. Nothing was raised ad hoc; toasts stay above the FAB; ConfirmDialog stays above modals.

- **POTENTIAL (tracked):** the navbar is `sticky z-50`, equal to overlays. The overlay paints above it via later DOM order — intended. Flagged for the future theme rebuild (M-035).

### K. Keyboard accessibility — CONFIRMED
Tab trap + Esc + focus restore + global focus ring (foundation) cover the full keyboard path.

### L. No accidental interaction behind — CONFIRMED
The `fixed inset-0` positioning layer + opaque backdrop intercept all pointer/wheel events behind the dialog. `no-print` preserved on backdrop + panel.

## 5. Overlays intentionally NOT migrated (2)

| Overlay | Why |
|---|---|
| CourseDetail **Contextual Doubts side-drawer** | A slide-over panel, not a centered dialog. Different interaction model (right-edge dock, `x`-axis animation). Migrating it would change its UX; a `placement="side"` variant is a clean follow-up (RECOMMENDATION for M-041/M-044). |
| CourseDetail **Image Lightbox** | Non-interactive image viewer with no title/form/focusables; dialog semantics don't apply cleanly. **RECOMMENDATION:** add Esc + focus handling in a dedicated image-viewer pass. |

## 6. Behaviors preserved / intentionally changed

- **Preserved:** all 9 open/close flows, every form/API/handler, loading states, backdrop dim/blur per overlay, backdrop-click semantics per overlay, enter/exit animations (framer-motion + AnimatePresence + children snapshot).
- **Intentionally added (all a11y-required):** Esc, focus trap, scroll lock, initial focus, focus restore. Backdrop-click is the *only* thing intentionally kept OFF on the 5 admin forms (matches original).
- **No dependencies added.** No state library, no new packages. `framer-motion` + `lucide-react` were already in use.

## 7. Validation

| Check | Result |
|---|---|
| `tsc -b --noEmit` | 0 errors |
| `npm run lint` | 0 errors, 8 warnings — **all pre-existing** (ThemeContext, AuthContext, UIContext, AdminDashboard, PracticeArena, Verify, LeaderboardTab). Zero new. |
| `npm run build` | ✓ built in ~2.5 s |
| Dev server smoke | All 6 migrated modules transform `200`; HMR clean; no console errors |
| `Certificate.tsx` diff | 0 lines (untouched) |
| Backend | untouched (only pre-existing uncommitted M-001 files remain) |
| Tests | None exist in the FE (no test script) — flagged, not claimed. |

## 8. Manual verification checklist (browser pass recommended)

I could not drive a real browser in this environment, so a quick interactive pass is worth doing:

- [ ] **ConfirmDialog** — Dashboard → delete a course/module; check Esc cancels, Tab cycles, focus returns to the trigger button, body scroll locks.
- [ ] **Home syllabus preview** — "Preview Syllabus" on a course card; Esc + backdrop + ✕ close; scroll lock; accordion still animates.
- [ ] **Exam Results** — finish a quiz; verify score-ring animation, no backdrop-close (must use ✕/Return), Esc closes.
- [ ] **Peer Solutions** — open from a project; privacy toggle works; Esc/backdrop close.
- [ ] **Admin modals (5)** — open each; verify initial focus lands in the first field; Esc discards; backdrop click does *not* close; WYSIWYG two-pane still works; save/cancel flows unchanged.
- [ ] **Toasts + FAB** — trigger a toast; confirm it still renders above dialogs and the FAB; FAB stays tappable above closed overlays.
- [ ] **Reduced motion** — OS "reduce motion" on: modals appear without springy motion (global rule from foundation).

## 9. Known limitations / follow-ups

1. Admin form modals lack internal scroll on ultra-short viewports (pre-existing; §4-G).
2. `descriptionId` unused by the 9 (RECOMMENDATION, §4-A).
3. CourseDetail drawer + lightbox unmigrated (see §5).
4. `max-h-[88vh]` uniform base vs. PeerSolutions' original 85vh (accepted, §4-F).

## Commit / deployment status

All M-042 changes are **uncommitted**, sitting alongside the pre-existing uncommitted FE files and the M-001/M-034 work. Nothing committed or deployed.
