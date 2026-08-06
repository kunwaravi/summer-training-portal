# Walkthrough - Legal Pages & Pricing Upgrades

I have successfully updated the Terms, Privacy, and Refund policies, added professional About Us and Contact Us pages, implemented the course price increase to ₹699, added 499 special coupon code overrides, and successfully deployed all changes to the Hostinger VPS.

## Changes Made

### Frontend Changes

1. **New Pages & Routes:**
   - **About Us Page:** Created [About.tsx](file:///home/abhi/repo/edunexuspro/frontend/src/pages/About.tsx) describing **EduNexus Pro's** 4-Week Industrial Training programs.
   - **Contact Us Page:** Created [Contact.tsx](file:///home/abhi/repo/edunexuspro/frontend/src/pages/Contact.tsx) with company metadata, support desk timings, and an interactive message form.
   - **App Routing & Navigation:** Updated [App.tsx](file:///home/abhi/repo/edunexuspro/frontend/src/App.tsx) to lazy-load these new routes and added links inside the footer component.

2. **Policy Page Updates:**
   - **Privacy Policy:** Updated [Privacy.tsx](file:///home/abhi/repo/edunexuspro/frontend/src/pages/Privacy.tsx) to outline collected data, purpose of usage, secure storage, no third-party sales, limited sharing with payment providers, cookie usage, and user rights.
   - **Terms & Conditions:** Updated [Terms.tsx](file:///home/abhi/repo/edunexuspro/frontend/src/pages/Terms.tsx) to specify acceptance of terms, account sharing prohibition, intellectual property protection, certification rules, and updates policy.
   - **Refund Policy:** Updated [Refund.tsx](file:///home/abhi/repo/edunexuspro/frontend/src/pages/Refund.tsx) to outline general non-refundability, duplicate payment resolution within 7-10 days, and technical access support.

3. **Pricing & Coupons Integration:**
   - Updated `BASE_PRICE` to `699` in [EnrollmentPanel.tsx](file:///home/abhi/repo/edunexuspro/frontend/src/components/organisms/EnrollmentPanel.tsx).
   - Added special discount codes `NEXUS499`, `EDU499`, and `SPECIAL499` to lower the price to ₹499.
   - Updated visual labels to dynamically output base prices and display custom success messages when the 499 coupons are applied.

### Backend Changes

1. **Coupon Validation:**
   - Updated [paymentService.ts](file:///home/abhi/repo/edunexuspro/backend/src/services/paymentService.ts) to match the frontend, adding validation logic for `NEXUS499`, `EDU499`, and `SPECIAL499` to apply a discount fraction equivalent to ₹200 off (reducing the price from 699 to 499).

2. **Database Course Seed:**
   - Updated course default pricing from 499 to 699 in [seed.ts](file:///home/abhi/repo/edunexuspro/backend/prisma/seed.ts).
   - Integrated the user's custom CADDED Mechanical (5 weeks) and Civil (5 weeks) syllabus structures (modules & topics names) directly into `seed.ts` as the codebase baseline.
   - Added dynamic module cleanup logic to automatically delete orphan weeks in the database that are no longer part of the seed configuration (cleaning up week 6 for CADDED Civil).
   - Added an automatic `existingTopicsCount` skip condition to protect dynamic CADDED curriculum modules from being overwritten or deleted on future seeder executions if they have manual admin modifications.
   - Re-executed database seeding on the VPS to update course values in the production PostgreSQL tables.

### Deployment & Infrastructure

1. **Compose env_file Support:**
   - Modified [docker-compose.yml](file:///home/abhi/repo/edunexuspro/docker-compose.yml) to add `env_file: .env` to the backend service. This resolves deployment startup issues by correctly loading database and JWT secrets from the system `.env` file without hardcoding keys in Git.
   - Verified that the frontend successfully binds to port `8090` without conflicting with port `8080` on the VPS.

---

## Validation & CADDED Restoration Results

1. **ChatGPT Curriculum Extraction:**
   - Parsed chat transcript `transcript.jsonl` to extract 60 structured topics (30 Civil + 30 Mechanical) from ChatGPT.
   - Compiled detailed curriculum bodies into `backend/prisma/cadded_curriculum.json`.
   - Programmed the database seeder [seed.ts](file:///home/abhi/repo/edunexuspro/backend/prisma/seed.ts) to load custom topics dynamically from this JSON, falling back to defaults if not present.

2. **Production Database Seeding:**
   - Overwrote existing placeholder/empty topics in the production PostgreSQL database.
   - Verified that all 30 custom topics for CADDED Mechanical and all 30 custom topics for CADDED Civil are successfully seeded and populated with rich markdown text bodies.

3. **Restored Edit Protection:**
   - Restored the protection check in `seed.ts` after the import to ensure that any future seeding does not overwrite or destroy manual edits that administrators make through the admin panel.

- Both frontend and backend builds completed successfully with zero TypeScript or bundling errors.
- Pulled updates to VPS, verified clean container boots, and ran database migrations.
- Verified that CADDED Mechanical and Civil are fully restored to exactly 5 modules and 30 customized topics.
- Verified that all other environments sharing the VPS (like nexustrade, mudra) remain unaffected.
