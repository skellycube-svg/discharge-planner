# Care to Home Companion — Product Requirements Document

**Version:** 1.0
**Date:** April 29, 2026
**Context:** Pediatric and Lifespan Data Science Conference Hackathon (7-hour build)
**Platform:** Mobile-First Web Application
**Build Tool:** Kiro (AI-assisted, no-code)

---

## 1. Problem Statement

Hospital discharge is a high-risk transition. Patients and caregivers often cannot recall or understand the discharge information conveyed to them. Research shows that patients forget 40–80% of verbal medical instructions, and the problem is compounded for caregivers with limited health literacy, language barriers, or cognitive impairment.

Currently, caregivers leave the hospital with dense, jargon-heavy paperwork they may not be able to read, medication schedules they're afraid to get wrong, and no clear guidance on when something is truly an emergency versus something that can wait. They have no easy way to find community resources — transportation to follow-up appointments, food assistance, housing support — that directly affect whether recovery succeeds or fails.

The Care to Home Companion solves this by converting hospital discharge plans into clear, plain-language guidance and connecting caregivers to the resources they need, all from their phone.

---

## 2. Primary User Persona

**Maria Rodriguez — The Overwhelmed Caregiver**

Maria is a 34-year-old single mother of two children (ages 4 and 7). Spanish is her primary language, and she reads at approximately a 6th-grade level. She accesses the internet exclusively through her smartphone and may have a limited data plan. She has just brought her child home from the hospital and is juggling care instructions, medications, her other child, and daily life — all while trying not to miss anything critical.

**Her pain points:**
Discharge documents are too complex and full of medical jargon. She forgets the majority of verbal instructions given at the hospital. She fears making medication dosing errors. She has no reliable transportation to follow-up appointments. She needs support in both Spanish and English.

**What success looks like for Maria:**
She can open the app, immediately understand what she needs to do today, feel confident about medication timing and dosing, know exactly when to call the doctor versus call 911, and find a ride to her child's follow-up appointment — all without needing to parse medical language or navigate a complicated interface.

---

## 3. Core Features

### 3.1 Discharge Companion

**3.1.1 Discharge Summary View**
Display patient information (name, date of discharge, care team) and a plain-language summary of the diagnosis and hospital stay. All text at a 6th-grade reading level or below. Medical terms are translated into everyday language, with the original term available on tap for reference.

**3.1.2 Plain-Language Care Instructions**
Step-by-step guidance for home care, written as short, direct sentences. Instructions are organized by time of day or activity (morning routine, meals, bedtime) rather than by medical category. Visual aids and icons accompany each instruction.

**3.1.3 Recovery Task Checklist**
An interactive checklist of daily and weekly recovery tasks the caregiver can mark as complete. Tasks reset daily where appropriate (medications, wound care) and persist where they're one-time actions (fill prescription, schedule follow-up). Progress is visible at a glance.

**3.1.4 Medication Reminders**
A visual medication schedule showing each medication with its name, photo/icon, dosage, timing, and purpose in plain language. Color-coded time blocks (morning, afternoon, evening, bedtime). Each medication card includes a checkbox to mark as taken.

**3.1.5 Follow-Up Appointment Reminders**
Calendar-style view of upcoming appointments with provider name, location, date/time, and purpose. Each appointment card links to the transportation resource finder (see Social Needs Support).

**3.1.6 Warning Signs Guide**
A color-coded symptom reference using a traffic-light system:
- **Red (call 911):** Life-threatening symptoms requiring immediate emergency response
- **Yellow (call doctor):** Concerning symptoms that need medical attention soon
- **Green (monitor at home):** Expected symptoms that are part of normal recovery

Each symptom is described in plain language with a clear action statement ("If you see this, do this").

### 3.2 Social Needs Support

**3.2.1 Social Needs Screening**
A short, conversational screening (3–5 questions) that identifies which categories of support the caregiver needs. Questions are phrased without stigma and use simple yes/no or multiple-choice answers. Categories include: transportation, food/nutrition, housing, financial assistance, childcare, and emotional/mental health support.

**3.2.2 Filtered Resource Results**
Based on screening answers, display a filtered list of relevant community resources. Resources are sorted by relevance and proximity when location data is available.

**3.2.3 Resource Cards**
Each resource displays as a card with: organization name, what they offer (in plain language), phone number (tap-to-call), address (tap for directions), hours of operation, eligibility notes, and available languages.

---

## 4. Design Principles

**Mobile-first and smartphone-only.** Every screen is designed for a phone held in one hand. No features require a desktop or tablet.

**Low literacy, high clarity.** All content targets a 6th-grade reading level. Use short sentences, common words, and visual aids. Icons and color-coding carry meaning alongside text, not as decoration.

**Large touch targets.** Buttons and interactive elements are at minimum 44x44px. Spacing between tappable elements prevents accidental taps.

**Minimal text entry.** Users interact through taps, toggles, checkboxes, and selections — not typing. Where text input is unavoidable, provide smart defaults and autocomplete.

**Bilingual support.** Spanish/English toggle accessible from every screen. The toggle persists across sessions. All content, labels, and instructions exist in both languages.

**High contrast and accessibility.** Meets WCAG AA contrast ratios at minimum. Supports screen readers. No information is conveyed by color alone (pair with icons or text labels).

**Culturally appropriate.** Considers diverse family structures, avoids assumptions about household composition, and uses inclusive imagery.

---

## 5. Information Architecture

```
Care to Home Companion
├── Home / Dashboard
│   ├── Patient summary card
│   ├── Today's tasks at a glance
│   ├── Next medication reminder
│   └── Quick-access buttons (Warning Signs, Resources)
│
├── Care Plan
│   ├── Discharge Summary
│   ├── Care Instructions (by time of day)
│   └── Recovery Checklist
│
├── Medications
│   ├── Today's Schedule (visual timeline)
│   ├── Medication Cards (detail view)
│   └── Mark as Taken
│
├── Appointments
│   ├── Upcoming Appointments
│   ├── Appointment Detail
│   └── Find Transportation (→ Resources)
│
├── Warning Signs
│   ├── Red: Call 911
│   ├── Yellow: Call Doctor
│   └── Green: Monitor at Home
│
├── Resources
│   ├── Needs Screening
│   ├── Filtered Results
│   └── Resource Detail Cards
│
└── Settings
    ├── Language Toggle (ES/EN)
    └── Patient Info
```

---

## 6. Sample Data Requirements

The app will use static sample data files to simulate a realistic experience for the demo. These files should cover:

- **Patient profile:** Maria's child (name, age, diagnosis, discharge date, care team)
- **Medications:** 3–4 medications with names, dosages, timing, purpose, and photo references
- **Care instructions:** 8–10 plain-language instructions organized by time of day
- **Checklist items:** Mix of daily recurring and one-time tasks
- **Appointments:** 2–3 follow-up appointments with different providers
- **Warning signs:** 3–4 symptoms per color category (red, yellow, green)
- **Community resources:** 8–10 local resources across transportation, food, housing, and other categories
- **Screening questions:** 3–5 social needs screening questions with response options

Data should be structured as JSON files, with one file per domain (medications.json, instructions.json, resources.json, etc.) to keep things modular and easy to connect in Kiro.

---

## 7. Applicable Lessons Learned (from Claude Code Lessons Learned v3)

The following patterns from the Lessons Learned document are directly relevant to this build and should be followed:

**Architecture and Organization**

- **Lesson #4 — One File Per Job.** Keep the project modular: separate files for each data domain (medications, instructions, resources, etc.) and each major UI section. This makes it easier to work on features independently and prevents accidental changes to unrelated parts of the app.

- **Lesson #2 — Single Source of Truth for Config.** Store shared values (color palette, reading level target, app name, language setting) in one central config file. Every component reads from this file rather than hardcoding values.

**UI and Design**

- **Lesson #50 — Use SVG Icons, Not Emojis.** Emojis render differently across Android, iOS, and desktop browsers. For Maria's smartphone, consistency matters. Use inline SVG icons with a consistent style (same viewBox, stroke width, and color system) for all iconography — medication types, warning levels, resource categories, navigation.

- **Lesson #51 — Reusable Visual Components.** Build one styled component for repeated UI elements and reuse it everywhere. A single "ResourceCard" component for all community resources. A single "MedicationCard" for all medications. A single "ChecklistItem" for all tasks. Change the design once, it updates everywhere.

- **Lesson #52 — Color-Code Categories.** This maps directly to the warning signs feature (red/yellow/green) and can extend to resource categories (transportation = blue, food = orange, housing = purple, etc.). Define the color palette as a constant so it's consistent across every screen.

- **Lesson #49 — Design Export as North Star.** If wireframes or mockups are created during the design phase, use them as screenshot references when prompting Kiro. "Make it look like this" is more effective than describing the layout in words.

**Data**

- **Lesson #22 — Build Fallback Data.** Design the app to work with sample data from the start. The demo should feel real and complete even without a live backend. All sample data should be clearly structured and realistic.

- **Lesson #35 — Confidence Levels.** While less critical for a hackathon demo, the principle applies: clearly distinguish between real and placeholder content. If some resources have verified phone numbers and others are illustrative, make that visible.

**Development Practices**

- **Lesson #30 — Graceful Degradation.** If one screen or feature has an issue, the rest of the app should still work. Navigation should never dead-end. Every screen should be reachable and functional independently.

- **Lesson #31 — Plain English Comments.** When building in Kiro, use clear, descriptive labels for every section and component. This makes it easier for any team member to understand and modify the project, not just the person who built it.

- **Lesson #34 — Commits as Restore Points.** Save working versions frequently. Before starting a new feature or major change in Kiro, make sure the current state is saved. This gives you a fallback if something breaks.

- **Lesson #10 — Read the Plan Before Saying Yes.** When Kiro proposes changes, review the plan before accepting. This is especially important in a time-pressured hackathon — catching a wrong direction early saves precious minutes.

---

## 8. Demo Requirements

The final demo is 15 minutes, structured as:

| Section | Time | Content |
|---|---|---|
| Problem Definition | ~5 min | Who is Maria? What challenge does she face at discharge? Why does this matter? |
| Solution Overview | ~3 min | What is Care to Home Companion and what does it do? |
| Live Demo | ~5 min | Walk through the happy path as Maria using the app for the first time |
| Success Measures & Business Value | ~2 min | What does success look like? What's the potential impact? |

**Required demo elements:**
- Discharge summary view with patient information
- Plain-language instructions and care guidance
- Recovery task checklist (interactive)
- Medication reminders
- Follow-up appointment reminders
- Social needs screening questions
- Filtered resource results based on screening
- Resource cards with actionable information (tap-to-call, tap-for-directions)

**Happy path for live demo:**
Maria opens the app → sees her child's dashboard with today's priorities → reviews the care instructions for the afternoon → checks off a completed task → sees the next medication reminder and marks it as taken → notices a yellow warning sign and sees clear guidance to call the doctor → goes to Resources → answers 3 screening questions → sees filtered results for transportation and food assistance → taps a resource card to call for a ride to tomorrow's appointment.

---

## 9. Success Criteria

The app succeeds if a caregiver like Maria can:

1. Open the app and immediately understand what she needs to do right now
2. Read and follow every care instruction without encountering medical jargon
3. Know exactly when to give each medication and in what dose
4. Distinguish between an emergency (call 911), something concerning (call doctor), and normal recovery (monitor)
5. Find and contact a community resource for transportation, food, or housing in under 60 seconds
6. Use the entire app in Spanish with a single toggle
7. Complete all core tasks using only taps — no typing required

---

## 10. Technical Constraints

- Must work on older smartphones with limited data plans
- Fast load times are essential (users may be in a crisis moment)
- Simple navigation — overwhelmed users cannot handle complexity or deep nesting
- Minimal text entry — buttons, toggles, dropdowns, and checkboxes over keyboards
- High contrast and large text — readability in any lighting condition
- Offline-capable where possible — core care instructions and warning signs should be accessible without an internet connection

---

## 11. Out of Scope (for this hackathon)

- Backend server or database (static sample data only)
- User authentication or accounts
- Real-time notifications or push alerts
- Integration with hospital EHR systems
- Natural language processing of actual discharge documents
- Multi-patient support
- Provider-facing features

---

## 12. Build Priorities (if time runs short)

If the team is running behind, prioritize in this order:

1. **Working, navigable UI** — all screens exist and link together
2. **Discharge Companion core** — summary, instructions, checklist, and medication view with sample data
3. **Warning Signs** — the color-coded guide is high-impact and visually compelling for the demo
4. **Social Needs flow** — screening → filtered results → resource cards
5. **Polish** — consistent styling, bilingual toggle, animations, and edge cases
6. **Demo narrative** — a clear, confident walkthrough beats a polished app with a shaky presentation

---

*This PRD is designed to be fed directly into Kiro at the start of the build phase. It provides enough structure to guide the AI while leaving room for design decisions during the build.*
