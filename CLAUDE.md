# CLAUDE.md — Care to Home Companion

Project guidance for Claude when working in this repo. Read before making changes.

---

## 1. Project context

**What it is:** Care to Home Companion — a web POC built for the Pediatric and Lifespan Data Science Conference Hackathon (7-hour build). Converts pediatric hospital discharge plans into plain-language guidance for caregivers and connects them to social-needs resources (food, transportation, therapy, housing).

**Two product surfaces, one app:**
1. **Discharge Companion** — plain-language "what happened," daily care checklist, medications with purpose, appointments, warning signs, education materials.
2. **Social Needs Support** — find/eligibility-check/recommend community programs based on patient need + zip + language + household.

**Status:** Frontend scaffold lives in `discharge-planner/frontend/` (Vite + React 18 + React Router v7 + Tailwind v4 + shadcn/Radix + Lucide). Mobile-first, max-w-md layout, EN/ES toggle. Currently wired to `src/app/data/mockData.ts` — we are replacing that with the real CSVs.

**Data sources (authoritative):**
- `discharge-planner/data/discharge_instructions_combined.csv` — 20 synthetic pediatric patients with full discharge fields (dx, meds, appointments, seek-attention triggers, education materials, allergies, PCP, etc.).
- `discharge-planner/data/programs_directory.csv` — 200+ Orange County programs across food / transportation / therapy / housing with eligibility, hours, languages, simulated availability.

---

## 2. The user we are designing for — Maria Rodriguez

**Every feature decision is filtered through Maria.** If Maria can't use it, it doesn't ship.

- 34, single mother of two (ages 4 and 7)
- Spanish is her primary language; limited English
- ~6th-grade reading level
- Smartphone-only — no desktop, sometimes spotty data
- High stress, post-discharge, juggling work + childcare

**Pain points the app must solve:**
- Discharge paperwork is too complex and clinical
- Forgets 40–80% of verbal instructions given at hospital
- Fears making a medication dosing mistake
- No reliable transportation to follow-ups
- Needs bilingual support that actually works (not just a Google Translate widget)

**Two questions before any feature/UI/copy decision:**
1. *Would Maria understand this?*
2. *Does this solve one of Maria's pain points?*

If either answer is "no" or "kind of," cut it or simplify it. See `DESIGN.md` for the full design rules that fall out of this persona.

---

## 3. Repo layout

```
choc-hackathon/
├── CLAUDE.md                      ← this file
├── DESIGN.md                      ← Maria-driven design rules
└── discharge-planner/
    ├── Care-to-Home-Companion-PRD.md
    ├── data/
    │   ├── discharge_instructions_combined.csv
    │   └── programs_directory.csv
    ├── sample_discharges/         ← reference PDFs
    └── frontend/          ← the actual app
        ├── src/app/
        │   ├── App.tsx, routes.tsx
        │   ├── components/        (Layout + shadcn/ui/*)
        │   ├── context/           (LanguageContext)
        │   ├── data/mockData.ts   ← being replaced
        │   └── pages/             (Dashboard, Medications, Appointments, WarningSigns, Resources)
        ├── package.json           (vite, react 18, react-router 7, tailwind 4)
        └── vite.config.ts
```

Working directory for the app is `discharge-planner/frontend/`.

---

## 4. Engineering practices

This is a 7-hour hackathon build, not a long-lived production system. Bias toward shipping a working demo that holds up under a live walkthrough.

### What to do
- **Get to a runnable demo first.** Static data in, screens render, happy path works. Polish after.
- **Edit existing files instead of creating new ones.** The scaffold is mostly fine; replace data, adjust pages.
- **Type the data layer once, use the types everywhere.** Define `Patient`, `Medication`, `Appointment`, `Program` once and import them. The CSVs have stable shapes — encode them.
- **Keep components dumb.** Pages read from a typed data module; data module owns CSV parsing + normalization. No fetch logic inside pages.
- **Mobile-first, always.** The Layout is `max-w-md`. Don't break that. Tap targets ≥ 44px. Test in narrow viewport.
- **Use what's already installed.** Radix, shadcn, Lucide, date-fns, sonner, recharts are all in `package.json`. Don't add deps for things that already work.
- **Run the dev server and click through the flow** before declaring a task done. Type-checking ≠ feature-correct.

### What not to do
- Don't add backwards-compat shims, feature flags, or "in case we need it later" abstractions. We won't.
- Don't add error handling for things that can't happen. CSVs are bundled at build time — they're either there or the build fails.
- Don't add comments that just narrate code. Comment only non-obvious *why*.
- Don't introduce new state-management libs, new CSS systems, or new routers. Tailwind + React state + Router 7 is enough.
- Don't write docs (`*.md`) unless explicitly asked.
- Don't refactor unrelated code while fixing something. One change at a time.
- **Don't ship a feature Maria can't use.** Re-read § 2 before adding anything.

### Data handling
- Bundle the CSVs at build time (Vite's `?raw` import + PapaParse, or pre-converted JSON). No runtime backend for the hackathon.
- Treat the CSVs as the single source of truth. If a field exists in the CSV but isn't surfaced, that's a UI gap to consider — not a reason to invent extra fields.
- Pipe-separated and semicolon-separated subfields (e.g., `home_medications`, `appointments`, `seek_medical_attention_for`) need parsers; centralize them in the data module.

### Bilingual content
- **UI chrome (labels, nav, buttons):** translated EN/ES via `LanguageContext` — extend the existing `ui` dictionary.
- **Dynamic CSV content (dx, meds, instructions):** English in the data, optionally translated at render with a small static dictionary for known clinical phrases. Don't block on full translation — Spanish-only rendering of medical jargon is worse than English with clear icons.
- Plain-language rewriting of clinical text (e.g., "Acute Gastroenteritis" → "Stomach bug") should live in a small mapping file, not be inferred at runtime, unless we wire an LLM call.

### Definition of done (per task)
1. Code compiles, no TS errors, no console errors.
2. Touched routes render correctly in the mobile viewport.
3. Both EN and ES toggle still work for any UI chrome you touched.
4. The demo flow (`/` → meds → appointments → warnings → resources) still works end-to-end.
5. Unrelated pages aren't visibly regressed.

---

## 5. The demo we are aiming at

A judge picks a patient (or one is preselected). The app shows:
1. **Who this is and what happened**, in plain language, with allergies and condition flagged.
2. **What to do today / this week** — checklist mixing meds + appointments + activities.
3. **Meds** — name, why, dose, when, with visual cues (pill count, with-food, drowsy).
4. **Appointments** — when, where, with whom, with a "I need a ride" path into Resources.
5. **Warning signs** — when to call the doctor vs. 911, derived from the patient's `seek_medical_attention_for`.
6. **Resources** — programs filtered by patient need + zip + language, with eligibility + simulated availability.
7. **Bilingual toggle** that visibly works.

Anything outside this is a stretch goal.
