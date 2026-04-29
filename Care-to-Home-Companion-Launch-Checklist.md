# Care to Home Companion — Launch Checklist

**Hackathon Timeline:** 7 hours
**Build Tool:** Kiro
**Demo:** 15 minutes

Items marked with **[LL #__]** reference a specific lesson from the Claude Code Lessons Learned document.

---

## Phase 1: Team Setup & Alignment (first 15–20 min)

- [ ] Assign team roles: Project Lead, Designer, Builder, Storyteller
- [ ] Agree on a Kiro driver rotation schedule (who drives during which phase)
- [ ] Open a shared notes doc for queuing prompts, tracking decisions, and logging things to fix later
- [ ] Review the Maria Rodriguez persona as a full team — make sure everyone understands who you're building for
- [ ] Agree on scope: what's in for the demo, what gets cut if time is tight
- [ ] Designate a timekeeper to call phase transitions

---

## Phase 2: Design Phase (30–45 min)

### Persona & Problem
- [ ] Confirm the core problem statement the team will present: caregivers leave the hospital overwhelmed, confused, and under-resourced
- [ ] Identify 2–3 specific moments in Maria's day that the app solves (e.g., "it's 2pm — is it time for the medication?", "my child has a fever — is this an emergency?")

### Hero Workflow (Happy Path)
- [ ] Map the primary user journey from app open to completing a key task
- [ ] Suggested happy path: Home dashboard → Care instructions → Mark task complete → Medication reminder → Warning signs check → Social needs screening → Find a resource → Tap to call
- [ ] Confirm the happy path covers both required features (Discharge Companion + Social Needs Support)

### Information Architecture
- [ ] Define the main navigation sections: Home, Care Plan, Medications, Appointments, Warning Signs, Resources, Settings
- [ ] Decide on navigation pattern (bottom tab bar recommended for mobile-first)
- [ ] Keep navigation flat — no more than 2 taps to reach any feature **[LL #30 — Graceful Degradation: every screen should be reachable independently]**

### Wireframes / Sketches
- [ ] Sketch or discuss the Home/Dashboard screen (patient card, today's priorities, quick-access buttons)
- [ ] Sketch or discuss the Medication Schedule screen (visual timeline, medication cards)
- [ ] Sketch or discuss the Warning Signs screen (red/yellow/green sections)
- [ ] Sketch or discuss the Resource Cards screen (filtered list with tap-to-call, tap-for-directions)
- [ ] Save any sketches or mockups as image files — use them as visual references when prompting Kiro **[LL #49 — Design Export as North Star: "make it look like this" is more effective than describing layout in words]**

### Design Decisions to Lock In
- [ ] Color palette: define primary, secondary, and the red/yellow/green warning colors **[LL #52 — Color-Code Categories: define the palette as a constant so it's consistent everywhere]**
- [ ] Decide on icon style (outline, filled, etc.) — use SVG icons, not emojis **[LL #50 — Emojis render differently across devices and can't be styled; SVG icons are consistent on every phone Maria might use]**
- [ ] Font size minimums (recommend 16px body, 20px+ headings for low-literacy users)
- [ ] Touch target size (minimum 44x44px)
- [ ] Language toggle placement (recommend top-right corner, persistent on every screen)

### Ready to Build?
- [ ] Team has reviewed the persona and understands who they're building for
- [ ] Hero workflow (happy path) is defined
- [ ] Information architecture is outlined
- [ ] Key screens have been sketched or discussed
- [ ] Everyone agrees on what's being built

---

## Phase 3: Build Phase — UI (1.5–2 hours)

### Project Setup
- [ ] Create the Kiro project
- [ ] Set up modular file structure: separate files/components for each major feature **[LL #4 — One File Per Job: smaller files are easier to edit and prevent accidental changes to unrelated code]**
- [ ] Create a central config or constants file for colors, font sizes, app name, and language setting **[LL #2 — Single Source of Truth: when a color or value changes, change it in one place and it flows everywhere]**
- [ ] Save a working baseline before adding features **[LL #34 — Commits as Restore Points: save before starting each major feature so you can roll back if something breaks]**

### Core Screens to Build
- [ ] **Home / Dashboard** — patient summary card, today's task count, next medication, quick-access buttons for Warning Signs and Resources
- [ ] **Care Plan — Discharge Summary** — patient name, discharge date, diagnosis in plain language, care team
- [ ] **Care Plan — Instructions** — step-by-step guidance organized by time of day, visual aids, 6th-grade reading level
- [ ] **Care Plan — Recovery Checklist** — interactive checklist with daily and one-time tasks, tap to mark complete
- [ ] **Medications** — visual schedule with time blocks (morning/afternoon/evening/bedtime), medication cards with name, dose, purpose, checkbox
- [ ] **Appointments** — upcoming appointments with provider, location, date/time, link to transportation resources
- [ ] **Warning Signs** — color-coded sections (red = 911, yellow = call doctor, green = monitor), plain-language symptom + action pairs
- [ ] **Resources — Screening** — 3–5 simple questions (yes/no or multiple choice), no stigma in phrasing
- [ ] **Resources — Results** — filtered resource list based on screening answers
- [ ] **Resources — Detail Cards** — organization name, what they offer, phone (tap-to-call), address (tap-for-directions), hours, languages
- [ ] **Settings** — language toggle (Spanish/English)

### Reusable Components
- [ ] Build ONE medication card component and reuse for all medications **[LL #51 — Reusable Visual Components: change the design once, it updates everywhere]**
- [ ] Build ONE resource card component and reuse for all resources **[LL #51]**
- [ ] Build ONE checklist item component and reuse for all tasks **[LL #51]**
- [ ] Build ONE warning sign item component and reuse across red/yellow/green sections **[LL #51]**
- [ ] Build ONE appointment card component and reuse for all appointments **[LL #51]**

### Navigation
- [ ] Bottom tab bar or hamburger menu connecting all main sections
- [ ] Every screen is reachable — no dead-end screens **[LL #30 — Graceful Degradation: if one screen has an issue, the rest still work]**
- [ ] Back navigation works on every screen
- [ ] Active tab/section is visually highlighted

### Before Moving to Data Integration
- [ ] All core screens exist and are navigable
- [ ] Save a working version **[LL #34]**

---

## Phase 4: Build Phase — Data Integration (45 min–1 hour)

### Sample Data Files to Create
- [ ] `patient.json` — child's name, age, diagnosis, discharge date, care team info
- [ ] `medications.json` — 3–4 medications with name, dosage, timing, purpose, instructions
- [ ] `instructions.json` — 8–10 care instructions organized by time of day
- [ ] `checklist.json` — mix of daily recurring tasks and one-time tasks
- [ ] `appointments.json` — 2–3 follow-up appointments with different providers
- [ ] `warnings.json` — 3–4 symptoms per category (red, yellow, green) with plain-language descriptions and actions
- [ ] `resources.json` — 8–10 community resources across transportation, food, housing, financial, childcare categories
- [ ] `screening.json` — 3–5 social needs screening questions with response options

### Data Connection
- [ ] Connect patient data to the dashboard and discharge summary screens
- [ ] Connect medication data to the medication schedule and cards
- [ ] Connect instruction data to the care instructions screen
- [ ] Connect checklist data to the recovery checklist (make checkboxes interactive)
- [ ] Connect appointment data to the appointments screen
- [ ] Connect warning sign data to the warning signs screen (sorted by severity color)
- [ ] Connect screening questions to the screening flow
- [ ] Connect resource data to the filtered results (filtering logic based on screening answers)
- [ ] Verify data displays correctly — check for "undefined" or "null" showing on screen (common Kiro issue per troubleshooting guide)
- [ ] Verify lists loop through all items, not just the first one (common Kiro issue per troubleshooting guide)

### Data Quality
- [ ] All sample data is realistic and respectful (real-sounding names, plausible medications, actual resource types)
- [ ] All text is at a 6th-grade reading level — no medical jargon in user-facing content
- [ ] Data files are the single source of truth for all displayed content **[LL #22 — Build Fallback Data: the app should feel complete and real even with sample data]**
- [ ] Save a working version after data is connected **[LL #34]**

---

## Phase 5: Testing (20–30 min)

### Functional Testing
- [ ] Walk through the entire happy path end to end — does it flow?
- [ ] Tap every button — does each one go somewhere?
- [ ] Check every screen — does data display correctly?
- [ ] Test the checklist — can you mark items as complete and see the state change?
- [ ] Test the medication checkbox — can you mark medications as taken?
- [ ] Test the screening flow — do answers filter the resource results?
- [ ] Test the language toggle — does it switch content? (if implemented)
- [ ] Test tap-to-call on resource cards (verify phone number format)
- [ ] Test tap-for-directions on resource cards (verify address format)

### Cross-Device Check
- [ ] Test on at least one mobile phone (this is the primary platform)
- [ ] Check that SVG icons render consistently **[LL #50 — SVG icons look the same on every device; emojis don't]**
- [ ] Verify text is readable at the chosen font sizes on a small screen
- [ ] Verify touch targets are large enough to tap without accidentally hitting neighbors

### Edge Cases
- [ ] What happens if a user taps "back" from the first screen?
- [ ] What happens if there are no resources matching a screening result?
- [ ] Are long medication names or resource names truncated gracefully?

### Before Moving to Polish
- [ ] All core features work
- [ ] No dead-end screens or broken navigation
- [ ] Save a working version **[LL #34]**

---

## Phase 6: Polishing (30–45 min)

### Visual Consistency
- [ ] Colors match the defined palette across all screens **[LL #52 — Color palette defined as a constant, used consistently everywhere]**
- [ ] Icons are all the same style, weight, and size **[LL #50]**
- [ ] Font sizes are consistent (headings, body, labels)
- [ ] Spacing and padding are uniform across screens
- [ ] Cards and components look the same everywhere they appear **[LL #51]**

### Content Review
- [ ] All text is plain language — no jargon anywhere
- [ ] Instructions are written as short, direct sentences
- [ ] Warning sign descriptions include a clear action ("If you see this → do this")
- [ ] Resource cards have complete info (name, offering, phone, address, hours)
- [ ] Spanish content is accurate and complete (if bilingual toggle is implemented)

### Accessibility
- [ ] High contrast between text and background (WCAG AA minimum)
- [ ] No information conveyed by color alone — pair with icons or text labels
- [ ] Touch targets are 44x44px minimum
- [ ] Screen reader labels on interactive elements (if time allows)

### Final Saves
- [ ] Save the final working version **[LL #34]**
- [ ] Do NOT make major changes after this point — only fix-on-the-fly issues

---

## Phase 7: Demo Preparation (30–45 min)

### Structure (15 minutes total)
- [ ] **Problem Definition (~5 min):** Who is Maria? What happens at discharge? Why is this dangerous? Use a real-world stat (patients forget 40–80% of verbal instructions)
- [ ] **Solution Overview (~3 min):** What is Care to Home Companion? What does it do at a high level?
- [ ] **Live Demo (~5 min):** Walk the happy path as Maria — not a random click-through, a story
- [ ] **Success Measures & Business Value (~2 min):** What does success look like? What's the potential impact on readmission rates, caregiver confidence, health equity?

### Speaking Roles
- [ ] Assign the Storyteller — opens with the problem and Maria's story
- [ ] Assign the Navigator — drives the live demo, narrates what's on screen
- [ ] Assign the Closer — covers success measures, business value, and next steps
- [ ] Plan smooth handoffs between speakers

### Demo Script
- [ ] Write (or outline) the narrative arc: Maria comes home from the hospital → she's overwhelmed → she opens the app → she gets clarity → she finds help
- [ ] Map each demo click to a specific story beat
- [ ] Prepare a fallback plan: if something breaks during the demo, acknowledge it briefly and keep moving — "We have a few things to polish, but let me show you the core experience" (per presentation guide)

### Required Elements to Show
- [ ] Discharge summary with patient information
- [ ] Plain-language care instructions
- [ ] Recovery task checklist (interact with it live)
- [ ] Medication reminders
- [ ] Follow-up appointment reminders
- [ ] Social needs screening questions
- [ ] Filtered resource results based on screening
- [ ] Resource cards with tap-to-call / tap-for-directions

### Practice
- [ ] Run through the full demo at least twice as a team
- [ ] Time it — confirm it fits within 15 minutes
- [ ] Practice speaker transitions
- [ ] Anticipate 2–3 questions judges might ask and prepare brief answers
- [ ] Review the plan one more time before going live **[LL #10 — Read the Plan Before Saying Yes: catching a wrong direction early saves time, and this applies to demo rehearsals too]**

---

## Quick Reference: Lessons Learned Applied

| Lesson | Where It Applies |
|---|---|
| #2 — Single Source of Truth (Config) | Central config file for colors, fonts, app settings |
| #4 — One File Per Job | Separate files for each feature and each data domain |
| #10 — Read the Plan Before Saying Yes | Review Kiro's proposed changes before accepting; review demo script before presenting |
| #22 — Build Fallback Data | App works with sample data from the start; demo feels real |
| #30 — Graceful Degradation | No dead-end screens; every section works independently |
| #31 — Plain English Comments | Clear labels and descriptions on every component in Kiro |
| #34 — Commits as Restore Points | Save working versions before each major phase |
| #35 — Confidence Levels | Distinguish real content from placeholders in the data |
| #49 — Design as North Star | Use sketches/mockups as screenshot references for Kiro prompts |
| #50 — SVG Icons, Not Emojis | Consistent rendering on Maria's smartphone regardless of OS |
| #51 — Reusable Components | One card component per type, reused everywhere |
| #52 — Color-Code Categories | Warning signs (red/yellow/green), resource categories, medication time blocks |

---

*Print this checklist or keep it open during the hackathon. Check items off as you go. If you're running behind, jump to Phase 7 (Demo Prep) with at least 45 minutes remaining — a clear, confident demo beats a polished app with a shaky presentation.*
