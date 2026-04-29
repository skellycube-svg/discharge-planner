# Care to Home Companion — Comprehensive Product Requirements Document

**Version:** 2.0
**Date:** April 29, 2026
**Author:** Daanesh Bogale
**Context:** Pediatric and Lifespan Data Science Conference Hackathon
**Platform:** Mobile-First Web Application (responsive, compatible on desktop)
**Build Tool:** Kiro (AI-assisted) + AWS backend services
**Status:** Draft

---

## 1. Executive Summary

Care to Home Companion is a mobile-first web application that transforms complex hospital discharge paperwork into clear, actionable guidance for caregivers with limited health literacy. The app bridges two critical gaps in the post-discharge experience: (1) understanding and following medical instructions, and (2) connecting to community resources that address social determinants of health.

The application ingests structured discharge data (patient demographics, medications, warning signs, appointments) and a directory of 148+ community programs across Orange County covering food, transportation, therapy, and housing. It presents this information through a plain-language, visually guided interface designed for a smartphone-only user reading at a 6th-grade level.

**Core value proposition:** Reduce preventable hospital readmissions by ensuring caregivers understand their care plan and can access the social support infrastructure around them.

---

## 2. Product Overview and Goals

### 2.1 Product Vision

A caregiver opens the app on their phone within minutes of leaving the hospital. Instead of 15 pages of medical jargon, they see today's tasks in plain language. They know what medication to give, when, and why. They know when to call the doctor versus calling 911. They find a free ride to tomorrow's follow-up appointment in under 60 seconds.

### 2.2 Goals

| Goal | Metric | Target |
|---|---|---|
| Reduce caregiver confusion at discharge | Time to first completed care task | < 2 minutes |
| Improve medication adherence | % of medication check-offs per day | > 80% |
| Connect families to resources | Time from screening to resource contact | < 60 seconds |
| Support low-literacy users | Flesch-Kincaid grade level of all content | <= 6th grade |
| Serve multilingual families | Language coverage | English + Spanish (MVP) |

### 2.3 Scope

**In scope (MVP):**
- Discharge summary display with plain-language translation
- Medication schedule with reminders and check-off
- Warning signs guide (red/yellow/green)
- Follow-up appointment tracking
- Recovery task checklist
- Social needs screening (3-5 questions)
- Filtered community resource results with tap-to-call/directions
- Spanish/English language toggle
- Patient selection from CSV dataset (20 patients)

**Out of scope (MVP):**
- User authentication / accounts
- Real-time push notifications
- EHR integration
- Multi-patient dashboards
- Provider-facing features
- Natural language processing of free-text discharge documents
- Offline-first with service workers (future phase)

---

## 3. User Research Summary

### 3.1 Primary Persona: Maria Rodriguez

| Attribute | Detail |
|---|---|
| Age | 34 |
| Role | Single mother of two (ages 4, 7), caregiver for hospitalized child |
| Language | Spanish primary, English second language |
| Literacy | 6th-grade reading level |
| Technology | Smartphone-only, limited data plan, no desktop |
| Work | Multiple part-time jobs, irregular schedule |
| Financial | Limited budget, relies on public assistance |
| Support network | Isolated, limited family support |

### 3.2 Key Pain Points (from persona research)

1. **Medical information overload** — 15+ pages of discharge paperwork in complex medical English
2. **Memory & retention** — Forgets 40-80% of verbal instructions given at discharge
3. **Medication management fear** — Terrified of dosing errors across multiple medications with different schedules
4. **Transportation barriers** — No car, limited knowledge of medical transport services
5. **Language & literacy barriers** — Most documents in English above her reading level
6. **Warning sign uncertainty** — Cannot distinguish emergency symptoms from normal recovery

### 3.3 Design Implications

| Constraint | Design Response |
|---|---|
| Smartphone-only | Mobile-first layout, thumb-reachable actions |
| 6th-grade literacy | Short sentences, common words, icons paired with text |
| Spanish primary | Persistent language toggle on every screen |
| High stress | Large touch targets (44x44px min), clear visual hierarchy |
| Limited data | Lightweight assets, minimal network requests |
| Multitasking | One-tap actions, no typing required for core flows |

---

## 4. User Journey Analysis

### 4.1 First-Time User Flow (Happy Path)

```
1. Receive Link (SMS/QR at discharge)
   └─> 2. Open App
       └─> 3. Welcome Screen (language selection)
           └─> 4. Select/Confirm Patient
               └─> 5. View Discharge Summary (plain language)
                   └─> 6. Review Medications (set up schedule)
                       └─> 7. Confirm Appointments
                           └─> 8. Review Warning Signs
                               └─> 9. Social Needs Screening (optional)
                                   └─> 10. View Filtered Resources
                                       └─> 11. Save to Home Screen
```

**Critical design rule:** Each step must complete in under 30 seconds. Total onboarding: under 5 minutes.

### 4.2 Daily Use Flow

```
1. Open App
   └─> 2. Dashboard (today's tasks, next medication, reminders)
       ├─> 3a. Check off completed tasks
       ├─> 3b. View medication detail → Mark as taken
       ├─> 3c. Review upcoming appointment
       └─> 3d. Quick action (Warning Signs / Call Doctor)
```

### 4.3 Emergency Flow

```
1. Notice concerning symptom
   └─> 2. Open App → Tap "Warning Signs" (quick action)
       └─> 3. See color-coded symptom list
           ├─> RED: "Call 911 now" → Tap to call
           ├─> YELLOW: "Call doctor" → Tap to call with talking points
           └─> GREEN: "Monitor at home" → Checklist of what to watch
```

**Critical:** Warning Signs must be reachable in 1 tap from any screen.

### 4.4 Social Needs Support Flow

```
1. Tap "Resources" or complete screening prompt
   └─> 2. Answer 3-5 screening questions (tap only, no typing)
       └─> 3. View filtered resource list (sorted by category + availability)
           └─> 4. Tap resource card
               ├─> 5a. Tap phone → Call
               ├─> 5b. Tap address → Directions
               └─> 5c. View hours, languages, eligibility
```

---

## 5. Information Architecture Overview

```
Care to Home Companion
│
├── [Tab 1] Home / Dashboard
│   ├── Patient summary card (name, diagnosis, discharge date)
│   ├── Today's progress (checklist completion %)
│   ├── Next medication reminder
│   ├── Upcoming appointment
│   └── Quick Actions
│       ├── Warning Signs (always prominent)
│       ├── Call Doctor
│       └── View Medications
│
├── [Tab 2] Care Plan
│   ├── Discharge Summary
│   │   ├── Patient info (name, MRN, weight, allergies)
│   │   ├── Diagnosis (plain language)
│   │   ├── Procedures performed
│   │   ├── Diet instructions
│   │   └── Special instructions
│   ├── Care Instructions (organized by time of day)
│   └── Recovery Checklist (interactive, daily + one-time tasks)
│
├── [Tab 3] Medications
│   ├── Today's Schedule (visual timeline: morning/afternoon/evening/bedtime)
│   ├── Home Medications (continuing)
│   ├── New Prescriptions
│   └── Medication Cards
│       ├── Name, dosage, route, frequency
│       ├── Purpose (plain language)
│       ├── Checkbox: "Taken"
│       └── Special instructions
│
├── [Tab 4] Warning Signs
│   ├── RED section — Call 911
│   │   └── Symptom + action pairs
│   ├── YELLOW section — Call Doctor
│   │   └── Symptom + action pairs
│   └── GREEN section — Monitor at Home
│       └── Symptom + action pairs
│
├── [Tab 5] Resources
│   ├── Social Needs Screening (3-5 questions)
│   ├── Filtered Results
│   │   ├── Filter by category (food, transportation, therapy, housing)
│   │   ├── Filter by language
│   │   ├── Filter by availability status
│   │   └── Sort by relevance / distance
│   └── Resource Detail Cards
│       ├── Organization name
│       ├── Category + subcategory
│       ├── Services offered
│       ├── Phone (tap-to-call)
│       ├── Address (tap-for-directions)
│       ├── Hours (by day of week)
│       ├── Languages served
│       ├── Cost / copay
│       ├── Insurance accepted
│       ├── Availability status + wait time
│       ├── Eligibility (income, age, residency)
│       └── Documentation required
│
├── Appointments (accessible from Dashboard + Care Plan)
│   ├── Upcoming appointments list
│   ├── Provider, location, date/time
│   └── Link to transportation resources
│
└── Settings
    ├── Language Toggle (ES/EN)
    └── Patient selector (demo mode)
```

### Navigation Pattern

- **Bottom tab bar** with 5 tabs: Home, Care Plan, Medications, Warning Signs, Resources
- **Quick Action FAB** for Warning Signs accessible from every screen
- Maximum depth: 2 taps to reach any feature
- Appointments accessible from both Dashboard and Care Plan

---

## 6. UI/UX Specifications

### 6.1 Layout Principles

| Principle | Specification |
|---|---|
| Grid | Single-column mobile layout, max-width 480px centered |
| Touch targets | Minimum 44x44px with 8px spacing between tappable elements |
| Font — body | 16px minimum, sans-serif (system font stack) |
| Font — headings | 20px+ bold |
| Font — labels | 14px, uppercase where appropriate |
| Spacing | 16px standard padding, 24px section spacing |
| Cards | Rounded corners (12px), subtle shadow, full-width |
| Bottom nav | Fixed, 56px height, icon + label for each tab |

### 6.2 Color System

| Token | Usage | Hex |
|---|---|---|
| `--color-danger` | RED warnings, 911 actions | #DC2626 |
| `--color-warning` | YELLOW warnings, call doctor | #F59E0B |
| `--color-success` | GREEN monitor, completed tasks | #16A34A |
| `--color-primary` | Primary actions, links, active tab | #2563EB |
| `--color-surface` | Card backgrounds | #FFFFFF |
| `--color-background` | Page background | #F3F4F6 |
| `--color-text-primary` | Body text | #111827 |
| `--color-text-secondary` | Labels, metadata | #6B7280 |

All color usage must be paired with icons or text labels. No information conveyed by color alone.

### 6.3 Iconography

- SVG icons only (no emoji — rendering varies across devices)
- Consistent style: 24px, 2px stroke, rounded caps
- Icon library: Lucide or Heroicons (open source, consistent style)
- Every icon paired with a text label

### 6.4 Component Library

| Component | Usage | Key Properties |
|---|---|---|
| `PatientCard` | Dashboard header | Name, age, diagnosis, discharge date |
| `MedicationCard` | Medication list | Name, dose, timing, purpose, checkbox |
| `WarningSignItem` | Warning signs list | Symptom text, action text, severity color |
| `ChecklistItem` | Recovery checklist | Task text, checkbox, recurrence badge |
| `AppointmentCard` | Appointments list | Provider, location, datetime, transport link |
| `ResourceCard` | Resource results | Org name, category, phone, address, status badge |
| `ScreeningQuestion` | Needs screening | Question text, response options (tap only) |
| `QuickActionButton` | Dashboard quick actions | Icon, label, tap handler |
| `ProgressBar` | Dashboard/checklist | Completed/total, percentage |
| `LanguageToggle` | Settings / header | ES/EN switch, persists across session |
| `BottomNavBar` | Global navigation | 5 tabs with icon + label |
| `SeverityBadge` | Warning signs, availability | Color-coded pill (red/yellow/green/gray) |

---

## 7. Functional Requirements

### 7.1 Priority Definitions

- **P0 (Must Have):** Required for MVP demo. App is incomplete without it.
- **P1 (Should Have):** Important for full experience. Build if time allows.
- **P2 (Nice to Have):** Enhances experience but not critical.

### 7.2 Requirements Table

| ID | Requirement | Priority | Category |
|---|---|---|---|
| FR-01 | Display patient discharge summary in plain language | P0 | Discharge |
| FR-02 | Parse and display medications with name, dose, timing, purpose | P0 | Medications |
| FR-03 | Display warning signs in red/yellow/green categories | P0 | Safety |
| FR-04 | Interactive medication checkbox (mark as taken) | P0 | Medications |
| FR-05 | Interactive recovery task checklist | P0 | Care Plan |
| FR-06 | Display follow-up appointments with provider and location | P0 | Appointments |
| FR-07 | Social needs screening with 3-5 tap-only questions | P0 | Resources |
| FR-08 | Filter community resources by screening answers | P0 | Resources |
| FR-09 | Resource cards with tap-to-call and tap-for-directions | P0 | Resources |
| FR-10 | Bottom tab navigation across all sections | P0 | Navigation |
| FR-11 | Dashboard with today's tasks, next med, quick actions | P0 | Dashboard |
| FR-12 | Patient selector (load different patients from dataset) | P0 | Data |
| FR-13 | Parse pipe-delimited medication strings from CSV | P0 | Data |
| FR-14 | Parse pipe-delimited appointment strings from CSV | P0 | Data |
| FR-15 | Parse comma-separated warning signs from CSV | P0 | Data |
| FR-16 | Spanish/English language toggle | P1 | i18n |
| FR-17 | Medication schedule grouped by time of day | P1 | Medications |
| FR-18 | Filter resources by category (food/transport/therapy/housing) | P1 | Resources |
| FR-19 | Filter resources by language availability | P1 | Resources |
| FR-20 | Display resource availability status and wait times | P1 | Resources |
| FR-21 | Link appointments to transportation resources | P1 | Cross-feature |
| FR-22 | Care instructions organized by time of day | P1 | Care Plan |
| FR-23 | Progress tracking across checklist items | P1 | Care Plan |
| FR-24 | Offline access to warning signs and medications | P2 | Performance |
| FR-25 | Resource availability API integration (real-time slots) | P2 | Resources |
| FR-26 | Push notification simulation for medication reminders | P2 | Medications |
| FR-27 | Educational forms reference links | P2 | Discharge |

---

## 8. Detailed Use Cases and User Stories

### UC-01: View Discharge Summary

**As** Maria, **I want** to see my child's hospital stay summarized in simple words **so that** I understand what happened and what to do next.

**Acceptance Criteria:**
- [ ] Patient name, age (derived from weight/context), and MRN are displayed
- [ ] Diagnosis is shown in plain language (not medical abbreviation)
- [ ] Admission and discharge dates are formatted as readable dates (e.g., "March 19, 2026")
- [ ] Primary care physician and consulting physicians are listed with names
- [ ] Allergies are prominently displayed (or "No Known Allergies" if NKA)
- [ ] Diet instructions are shown in plain language
- [ ] Special instructions are displayed as a bulleted list
- [ ] Procedures are listed with plain-language descriptions
- [ ] All text is at or below 6th-grade reading level

**Data source:** `discharge_instructions_combined.csv` — fields: `patient_name`, `mrn`, `weight_kg`, `allergies`, `admission_date`, `discharge_date`, `admitting_diagnosis`, `discharge_diagnosis`, `condition_on_discharge`, `primary_care_physician`, `consulting_physicians`, `diet`, `special_instructions`, `procedures`, `educational_forms_given`

---

### UC-02: Manage Medications

**As** Maria, **I want** to see exactly what medicine to give, when, and how much **so that** I don't make a mistake.

**Acceptance Criteria:**
- [ ] Home medications and new prescriptions are displayed separately
- [ ] Each medication card shows: name, dosage, route, frequency, and special instructions
- [ ] Medications are grouped by time of day where timing is specified (morning, afternoon, evening, bedtime)
- [ ] PRN medications are clearly labeled "As Needed" with the condition (e.g., "for pain")
- [ ] Each medication has a checkbox to mark as "Taken"
- [ ] Checked state persists within the session (localStorage)
- [ ] Pipe-delimited medication strings are correctly parsed (delimiter: ` | `)
- [ ] Medication purpose is translated to plain language

**Data source:** `discharge_instructions_combined.csv` — fields: `home_medications`, `new_prescriptions`

**Parsing rule:** Medications are pipe-delimited. Each medication follows the pattern:
`Name dosage form (instructions, Route, Frequency [PRN condition])`

Example: `Ibuprofen 100 mg/5 mL suspension (As directed by weight, Oral, Every 6-8 hours PRN for pain)`

---

### UC-03: Review Warning Signs

**As** Maria, **I want** to know which symptoms mean I should call 911 versus call the doctor versus just watch and wait **so that** I act correctly in an emergency.

**Acceptance Criteria:**
- [ ] Warning signs are displayed in three color-coded sections: RED (911), YELLOW (call doctor), GREEN (monitor)
- [ ] Each symptom has a clear action statement
- [ ] RED section appears first and is visually prominent
- [ ] One-tap "Call 911" and "Call Doctor" buttons are present in their respective sections
- [ ] Warning signs screen is reachable in 1 tap from any screen via quick action
- [ ] Comma-separated warning signs from CSV are parsed into individual items

**Data source:** `discharge_instructions_combined.csv` — field: `seek_medical_attention_for`

**Design note:** The CSV provides a single comma-separated list per patient. The app must categorize these into red/yellow/green tiers. For MVP, a mapping table keyed on diagnosis can assign severity levels. Example mappings:

| Diagnosis | RED (911) | YELLOW (Call Doctor) | GREEN (Monitor) |
|---|---|---|---|
| Pneumonia | Breathing Difficulties | Persistent Temp > 100.4 F, Worsening cough, Chest pain | Lethargy |
| Fracture | Fingers turning blue or white | Increased swelling, Numbness or tingling, Severe pain not relieved by medication | Cast damage |
| Type 1 Diabetes | Blood sugar > 300 or < 70, Rapid breathing | Persistent Vomiting, Fruity breath odor | Lethargy |

---

### UC-04: Track Appointments

**As** Maria, **I want** to see my child's follow-up appointments with dates, doctors, and locations **so that** I don't miss any.

**Acceptance Criteria:**
- [ ] All appointments are listed chronologically
- [ ] Each appointment shows: date/time, provider name, clinic location
- [ ] Appointments are parsed from the pipe-delimited string in CSV
- [ ] "No scheduled appointments" is handled gracefully
- [ ] Each appointment card has a "Find a Ride" link to the transportation resources section
- [ ] Past appointments (before today's date) are visually dimmed or hidden

**Data source:** `discharge_instructions_combined.csv` — field: `appointments`

**Parsing rule:** Appointments are pipe-delimited. Pattern:
`MM/DD/YYYY HH:MM AM/PM - Description with Dr. Name at Location`

---

### UC-05: Complete Recovery Checklist

**As** Maria, **I want** a daily checklist of care tasks **so that** I know I'm not forgetting anything.

**Acceptance Criteria:**
- [ ] Checklist items are generated from special_instructions, medication schedule, and appointment schedule
- [ ] Each item has a checkbox that toggles on tap
- [ ] Completed items show a strikethrough or check mark
- [ ] Progress bar shows X of Y tasks completed
- [ ] Daily tasks (medications) can be marked per day
- [ ] One-time tasks (fill prescription, schedule follow-up) persist when completed
- [ ] Checklist state is stored in localStorage

---

### UC-06: Social Needs Screening

**As** Maria, **I want** to answer a few simple questions about what kind of help I need **so that** the app shows me the right resources.

**Acceptance Criteria:**
- [ ] 3-5 screening questions are presented one at a time or as a short form
- [ ] Questions use plain, non-stigmatizing language
- [ ] All responses are tap-only (yes/no, multiple choice) — no typing
- [ ] Screening maps to resource categories: food, transportation, therapy, housing
- [ ] User can skip screening and browse all resources
- [ ] Screening can be retaken at any time

**Screening questions (suggested):**

1. "Do you need help getting food for your family?" → food
2. "Do you need a ride to doctor's appointments?" → transportation
3. "Does your child need therapy or counseling?" → therapy
4. "Do you need help with housing or paying rent?" → housing
5. "Do you need help in a language other than English?" → language filter

---

### UC-07: Browse and Contact Resources

**As** Maria, **I want** to find local organizations that can help with food, rides, therapy, or housing **so that** I can get the support my family needs.

**Acceptance Criteria:**
- [ ] Resources are loaded from programs_directory.csv (148+ programs)
- [ ] Results are filterable by category: food, transportation, therapy, housing
- [ ] Results are filterable by subcategory (food_bank, food_pantry, wic, snap, etc.)
- [ ] Results show availability status badge: open (green), limited (yellow), full (red)
- [ ] Each resource card displays: name, category, phone, address, hours, languages, cost
- [ ] Phone number is a `tel:` link (tap-to-call on mobile)
- [ ] Address links to Google Maps or Apple Maps (tap-for-directions)
- [ ] Resources with `es` in languages field are flagged as Spanish-available
- [ ] Wait time and next available date are shown when applicable
- [ ] Resources are sorted by availability status (open first) then by name

**Data source:** `programs_directory.csv` — 36 fields per program including:
- Identification: ID, Name, Category, Subcategory
- Contact: Address, Phone, Website
- Access: Zip Codes Served, Languages, Hours (Mon-Sun), Service Delivery, Cost, Insurance, Copay
- Accessibility: ADA Accessible, Transportation Assistance, Child Friendly
- Eligibility: Income Limit (% FPL), Household Size Min, Age Min/Max, Residency Required, Insurance Required, Documentation Required
- Availability: Available Slots, Wait Time (Days), Next Available, Availability Status

**Resource categories in dataset:**

| Category | Subcategories | Count |
|---|---|---|
| Food | food_bank, food_pantry, wic, snap, home_delivered_meals, community_fridge, school_meals, nutrition_support, infant_nutrition, community_garden | ~50 |
| Transportation | paratransit, nemt, rideshare_voucher, volunteer_driver, hospital_transport, transit_subsidy, shuttle, case_managed_transport, telehealth_support | ~25 |
| Therapy | behavioral_health, mental_health, early_intervention, developmental_therapy, physical_therapy, occupational_therapy, speech_therapy, aba_therapy, play_therapy, family_therapy, psychiatry, and more | ~25 |
| Housing | section_8, emergency_shelter, rapid_rehousing, transitional_housing, permanent_supportive, rental_assistance, hospital_housing_fund, motel_voucher, dv_shelter, utility_assistance, and more | ~48 |

---

### UC-08: Switch Language

**As** Maria, **I want** to switch the app to Spanish **so that** I can read everything in my primary language.

**Acceptance Criteria:**
- [ ] Language toggle is accessible from the app header or settings
- [ ] Toggle persists across page navigation (stored in localStorage)
- [ ] All UI labels, navigation text, and static content switch languages
- [ ] Patient-specific medical data remains in its original language (from CSV) with translated labels
- [ ] Screening questions are available in both languages
- [ ] Resource cards show which languages each organization supports

---

## 9. Technical Architecture

### 9.1 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Client (Browser)               │
│  React / Next.js SPA — Mobile-First Responsive  │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Router  │ │ State    │ │ localStorage     │  │
│  │ (tabs)  │ │ (Zustand)│ │ (checklist, meds)│  │
│  └─────────┘ └──────────┘ └──────────────────┘  │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS
┌──────────────────────┴──────────────────────────┐
│              AWS API Gateway (REST)              │
│         /patients  /resources  /screening        │
└──────┬──────────────┬───────────────┬───────────┘
       │              │               │
┌──────┴──────┐ ┌─────┴─────┐ ┌──────┴──────┐
│ Lambda:     │ │ Lambda:   │ │ Lambda:     │
│ Patients    │ │ Resources │ │ Screening   │
│ (discharge  │ │ (programs │ │ (filter     │
│  data)      │ │  directory│ │  logic)     │
└──────┬──────┘ └─────┬─────┘ └─────────────┘
       │              │
┌──────┴──────┐ ┌─────┴─────┐
│ DynamoDB:   │ │ DynamoDB: │
│ Patients    │ │ Programs  │
└─────────────┘ └───────────┘
```

### 9.2 AWS Service Recommendations

| Service | Purpose | Rationale |
|---|---|---|
| **Amazon S3 + CloudFront** | Host static web app (React build) | Low cost, global CDN for fast mobile loading, HTTPS by default |
| **Amazon API Gateway** | REST API layer | Managed, scalable, supports throttling and CORS |
| **AWS Lambda** | Serverless compute for API endpoints | Pay-per-request, no server management, auto-scales |
| **Amazon DynamoDB** | NoSQL database for patients and programs | Single-digit ms latency, scales to any load, schema-flexible |
| **Amazon Cognito** | Auth (future phase) | Managed user pools, social sign-in, not needed for MVP |
| **AWS Amplify** | Deployment & hosting pipeline | CI/CD from Git, preview deployments, custom domains |
| **Amazon Translate** | Dynamic content translation (future) | Neural machine translation, 75+ languages |
| **Amazon Comprehend Medical** | NLP for discharge docs (future) | Extract medications, conditions, dosages from free text |
| **AWS WAF** | Web application firewall | Protect API from abuse, bot filtering |
| **Amazon CloudWatch** | Monitoring and logging | Lambda metrics, API latency, error tracking |

### 9.3 MVP Simplification

For the hackathon demo, the architecture simplifies to:

```
Client (React SPA)
  ├── Static JSON files (loaded at build time or fetched from /public)
  │   ├── patients.json (parsed from CSV)
  │   └── programs.json (parsed from CSV)
  └── localStorage for session state (checklist, medication taken, language)
```

No backend required for MVP. Data is bundled with the app. The AWS architecture above is the production target.

---

## 10. Data Models

### 10.1 Patient Model

```typescript
interface Patient {
  patient_id: number;
  patient_name: string;
  mrn: string;
  weight_kg: number;
  preferred_language: string;
  allergies: string;
  admission_date: string;        // MM/DD/YYYY
  discharge_date: string;        // MM/DD/YYYY
  admitting_diagnosis: string;
  discharge_diagnosis: string;
  condition_on_discharge: string; // "Good" | "Stable" | "Improved"
  primary_care_physician: string;
  consulting_physicians: string;
  discharge_authenticated_by: string;
  diet: string;
  seek_medical_attention_for: string; // comma-separated symptoms
  special_instructions: string;
  procedures: string;               // semicolon-separated
  educational_forms_given: string;   // semicolon-separated
  home_medications: string;          // pipe-separated medication entries
  new_prescriptions: string;         // pipe-separated or "No New Prescription"
  appointments: string;              // pipe-separated or "No scheduled appointments"
}
```

### 10.2 Parsed Medication Model

```typescript
interface Medication {
  id: string;
  raw_text: string;
  name: string;            // e.g., "Ibuprofen"
  dosage: string;          // e.g., "100 mg/5 mL"
  form: string;            // e.g., "suspension"
  instructions: string;    // e.g., "As directed by weight"
  route: string;           // e.g., "Oral"
  frequency: string;       // e.g., "Every 6-8 hours"
  is_prn: boolean;
  prn_condition?: string;  // e.g., "for pain"
  is_new_prescription: boolean;
  taken: boolean;          // client state
}
```

### 10.3 Parsed Appointment Model

```typescript
interface Appointment {
  id: string;
  raw_text: string;
  date: string;       // ISO date
  time: string;       // formatted time
  description: string;
  provider: string;   // extracted doctor name
  location: string;   // extracted clinic name
  is_past: boolean;   // computed from current date
}
```

### 10.4 Warning Sign Model

```typescript
interface WarningSigns {
  red: WarningItem[];    // Call 911
  yellow: WarningItem[]; // Call Doctor
  green: WarningItem[];  // Monitor at Home
}

interface WarningItem {
  symptom: string;
  action: string;
  severity: 'red' | 'yellow' | 'green';
}
```

### 10.5 Program (Resource) Model

```typescript
interface Program {
  id: string;                     // "P001"
  name: string;
  category: string;               // "food" | "transportation" | "therapy" | "housing"
  subcategory: string;             // "food_bank" | "wic" | "paratransit" | etc.
  address: string;
  phone: string;
  website: string;
  zip_codes_served: string;       // "all_orange_county" or semicolon-separated zips
  languages: string[];            // parsed from semicolon-separated
  hours: {
    mon: string; tue: string; wed: string;
    thu: string; fri: string; sat: string; sun: string;
  };
  service_delivery: string;       // "in-person" | "telehealth" | "hybrid" | "home-delivered"
  cost: number;
  accepted_insurance: string[];
  copay: number;
  ada_accessible: boolean;
  transportation_assistance: boolean;
  child_friendly: boolean;
  eligibility: {
    income_limit_fpl: number | null;
    household_size_min: number;
    age_min: number | null;
    age_max: number | null;
    residency_required: string;
    insurance_required: boolean;
    documentation_required: string[];
  };
  availability: {
    status: 'open' | 'limited' | 'full';
    available_slots: number;
    wait_time_days: number;
    next_available: string | null;
    utilization_pct: number;
  };
  seasonal_notes: string;
}
```

### 10.6 Screening Model

```typescript
interface ScreeningQuestion {
  id: number;
  text: string;
  text_es: string;             // Spanish translation
  options: ScreeningOption[];
  maps_to_category: string;    // "food" | "transportation" | "therapy" | "housing"
}

interface ScreeningOption {
  label: string;
  label_es: string;
  value: boolean;
}

interface ScreeningResult {
  needs_food: boolean;
  needs_transportation: boolean;
  needs_therapy: boolean;
  needs_housing: boolean;
  preferred_language?: string;
}
```

---

## 11. API Design

### 11.1 REST Endpoints (Production Target)

| Method | Endpoint | Description | Response |
|---|---|---|---|
| GET | `/api/patients` | List all patients | `Patient[]` |
| GET | `/api/patients/:id` | Get single patient with parsed medications, appointments, warnings | `PatientDetail` |
| GET | `/api/resources` | List all programs with filters | `Program[]` |
| GET | `/api/resources?category=food&language=es&status=open` | Filtered resource list | `Program[]` |
| GET | `/api/resources/:id` | Single program detail | `Program` |
| GET | `/api/resources/:id/availability` | Real-time availability | `AvailabilityStatus` |
| POST | `/api/screening` | Submit screening answers, return filtered resources | `Program[]` |

### 11.2 Query Parameters for `/api/resources`

| Parameter | Type | Description |
|---|---|---|
| `category` | string | Filter by category (food, transportation, therapy, housing) |
| `subcategory` | string | Filter by subcategory |
| `language` | string | Filter by language code (en, es, vi, zh, ko, etc.) |
| `status` | string | Filter by availability (open, limited, full) |
| `zip` | string | Filter by zip code served |
| `child_friendly` | boolean | Filter for child-friendly programs |
| `ada_accessible` | boolean | Filter for ADA accessible programs |
| `cost` | string | Filter: "free" (cost=0) or "paid" |
| `sort` | string | Sort field: "name", "status", "wait_time" |
| `limit` | number | Pagination limit (default: 20) |
| `offset` | number | Pagination offset |

---

## 12. Non-Functional Requirements

### 12.1 Performance

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5 seconds on 3G |
| Time to Interactive (TTI) | < 3 seconds on 3G |
| Total bundle size | < 500KB gzipped |
| API response time | < 200ms (p95) |
| Image assets | WebP format, max 50KB per image |

### 12.2 Accessibility (WCAG 2.1 AA)

- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text (18px+)
- All interactive elements keyboard-navigable
- All images have alt text
- All form controls have associated labels
- Screen reader compatible (ARIA roles and labels)
- Touch targets minimum 44x44px
- No information conveyed by color alone

### 12.3 Security

- HTTPS everywhere (enforced by CloudFront)
- No PII stored in client-side storage beyond session
- API rate limiting via API Gateway (1000 req/min per IP)
- Input validation on all API parameters
- CSP headers to prevent XSS
- No secrets in client-side code
- HIPAA considerations for production: encrypt data at rest (DynamoDB encryption), audit logging, BAA with AWS

### 12.4 Internationalization

- All UI strings externalized to locale files (`en.json`, `es.json`)
- Date formatting respects locale (MM/DD/YYYY for en-US, DD/MM/YYYY for es)
- Right-to-left support not required for MVP (English/Spanish only)
- Number formatting follows locale conventions

### 12.5 Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome (Android) | 90+ |
| Safari (iOS) | 14+ |
| Samsung Internet | 15+ |
| Firefox (Android) | 90+ |
| Chrome (Desktop) | 90+ |
| Safari (Desktop) | 14+ |

---

## 13. Success Metrics

### 13.1 Primary KPIs

| Metric | Measurement | Target |
|---|---|---|
| Task completion rate | % of users who complete the happy path | > 90% |
| Medication check-off rate | % of scheduled meds marked as taken | > 80% |
| Resource contact rate | % of users who tap-to-call a resource | > 50% |
| Warning sign access time | Time from app open to warning signs view | < 5 seconds |
| Screening completion rate | % of users who complete the social needs screening | > 70% |

### 13.2 Secondary KPIs

| Metric | Measurement | Target |
|---|---|---|
| Session duration | Average time per daily visit | 2-5 minutes |
| Return rate | % of users who return within 24 hours | > 60% |
| Language toggle usage | % of sessions using Spanish | Track (no target) |
| Error rate | % of sessions with a JavaScript error | < 1% |
| Accessibility score | Lighthouse accessibility audit | > 95 |

### 13.3 Clinical Outcomes (Production Phase)

| Metric | Measurement | Target |
|---|---|---|
| 30-day readmission rate | Readmissions for app users vs. control | 20% reduction |
| Follow-up appointment attendance | % of scheduled appointments kept | > 85% |
| Caregiver confidence score | Pre/post survey (Likert scale) | Significant improvement |
| Social needs connection rate | % of identified needs matched to a resource | > 70% |

---

## 14. Data Parsing Specifications

The CSV dataset requires specific parsing logic. These specifications are critical for Kiro/AI agent implementation.

### 14.1 Medication Parsing

**Input:** `"Ibuprofen 100 mg/5 mL suspension (As directed by weight, Oral, Every 6-8 hours PRN for pain)"`

**Regex pattern:**
```
^(.+?)\s*\((.+?),\s*(.+?),\s*(.+?)(?:\s+PRN\s+(.+))?\)$
```

**Groups:** 1=name+dosage+form, 2=instructions, 3=route, 4=frequency, 5=PRN condition (optional)

**Multiple medications:** Split on ` | ` (space-pipe-space)

**Edge cases:**
- "No New Prescription" → empty array
- "See Instructions Note:" prefix in instructions → extract note text
- Topical medications with "TID" (three times daily) abbreviation

### 14.2 Appointment Parsing

**Input:** `"04/16/2026 10:49 AM - Autism Neurology Return with Dr. Dean at CHOC at Mission"`

**Regex pattern:**
```
^(\d{2}/\d{2}/\d{4}\s+\d{1,2}:\d{2}\s+[AP]M)\s*-\s*(.+?)\s+with\s+(Dr\.\s+\w+)\s+at\s+(.+)$
```

**Groups:** 1=datetime, 2=visit type, 3=provider, 4=location

**Multiple appointments:** Split on ` | ` (space-pipe-space)

**Edge case:** "No scheduled appointments" → empty array

### 14.3 Warning Sign Categorization

The CSV field `seek_medical_attention_for` provides a comma-separated list. A diagnosis-based mapping assigns severity:

```typescript
const severityMap: Record<string, Record<string, 'red' | 'yellow' | 'green'>> = {
  "Pneumonia": {
    "Breathing Difficulties": "red",
    "Persistent Temp > 100.4 F": "yellow",
    "Worsening cough": "yellow",
    "Chest pain": "yellow",
    "Lethargy": "green"
  },
  "Fracture - Upper Extremity": {
    "Fingers turning blue or white": "red",
    "Increased swelling": "yellow",
    "Numbness or tingling in fingers": "yellow",
    "Severe pain not relieved by medication": "yellow",
    "Cast damage": "green"
  },
  // ... additional diagnoses
};
```

**Fallback:** If diagnosis is not in the map, all symptoms default to YELLOW (call doctor).

### 14.4 Programs Directory Parsing

**Languages:** Semicolon-separated language codes → split into array
**Hours:** 7 separate columns (Mon-Sun), values like "8am-4pm", "closed", "9am-12pm"
**Zip codes:** "all_orange_county" or semicolon-separated zip codes
**Booleans:** "true"/"false" strings → parse to boolean
**Insurance:** Semicolon-separated or empty → split into array
**Documentation:** Semicolon-separated → split into array

---

## 15. Kiro / AI Agent Implementation Guidelines

### 15.1 File Structure

```
/care-to-home-companion
├── /public
│   └── /data
│       ├── patients.json          # Parsed from discharge_instructions_combined.csv
│       └── programs.json          # Parsed from programs_directory.csv
├── /src
│   ├── /components
│   │   ├── /layout
│   │   │   ├── BottomNavBar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── PageContainer.tsx
│   │   ├── /cards
│   │   │   ├── PatientCard.tsx
│   │   │   ├── MedicationCard.tsx
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── ResourceCard.tsx
│   │   │   ├── WarningSignItem.tsx
│   │   │   └── ChecklistItem.tsx
│   │   ├── /screening
│   │   │   └── ScreeningQuestion.tsx
│   │   └── /ui
│   │       ├── ProgressBar.tsx
│   │       ├── SeverityBadge.tsx
│   │       ├── QuickActionButton.tsx
│   │       └── LanguageToggle.tsx
│   ├── /pages (or /app for Next.js app router)
│   │   ├── Dashboard.tsx
│   │   ├── CarePlan.tsx
│   │   ├── Medications.tsx
│   │   ├── WarningSignsPage.tsx
│   │   ├── Resources.tsx
│   │   ├── Appointments.tsx
│   │   └── Settings.tsx
│   ├── /hooks
│   │   ├── usePatient.ts
│   │   ├── useMedications.ts
│   │   ├── useResources.ts
│   │   └── useLanguage.ts
│   ├── /utils
│   │   ├── parseMedications.ts
│   │   ├── parseAppointments.ts
│   │   ├── categorizeWarnings.ts
│   │   └── parsePrograms.ts
│   ├── /constants
│   │   ├── colors.ts
│   │   ├── warningMappings.ts
│   │   └── screeningQuestions.ts
│   ├── /i18n
│   │   ├── en.json
│   │   └── es.json
│   └── /types
│       ├── patient.ts
│       ├── medication.ts
│       ├── program.ts
│       └── screening.ts
```

### 15.2 Build Sequence for Kiro

1. **Project setup** — Initialize React/Next.js project, install dependencies, set up Tailwind CSS
2. **Constants and types** — Define color palette, TypeScript interfaces, warning mappings
3. **Data parsing utilities** — Build and test parseMedications, parseAppointments, categorizeWarnings, parsePrograms
4. **Data files** — Convert CSVs to JSON, validate parsing
5. **Layout components** — BottomNavBar, Header, PageContainer
6. **Card components** — Build each card component with sample data
7. **Dashboard page** — Assemble patient card, quick actions, today's tasks
8. **Medications page** — Medication list with time grouping and checkboxes
9. **Warning Signs page** — Three-section color-coded layout
10. **Care Plan page** — Discharge summary, instructions, checklist
11. **Resources page** — Screening flow, filtered results, resource cards
12. **Appointments page** — Chronological list with transport links
13. **Language toggle** — i18n infrastructure with locale files
14. **Navigation wiring** — Connect all tabs and cross-links
15. **Polish** — Consistent spacing, colors, iconography, edge cases

**Save a working version after steps 4, 7, 10, 12, and 15.**

### 15.3 Key Prompting Patterns for Kiro

- Reference wireframe images when available: "Make the dashboard look like this screenshot"
- One component per prompt: "Build a MedicationCard component that displays..."
- Specify data shape: "The medication object has these fields: name, dosage, route..."
- Reference the color constants: "Use the color-danger token for the RED warning section"
- Test data first: "Parse this sample medication string and show me the result"

---

## 16. Gap Analysis and Open Questions

### 16.1 Identified Gaps

| # | Gap | Impact | Recommendation |
|---|---|---|---|
| 1 | **Warning sign severity mapping is not in the CSV data.** The CSV provides a flat list of symptoms per patient but no red/yellow/green classification. | High — core safety feature depends on correct categorization | Build a mapping table keyed on `discharge_diagnosis`. For the 8 diagnoses in the dataset, manually define severity levels. Default unmapped symptoms to YELLOW. |
| 2 | **No plain-language translations of medical terms exist in the data.** Diagnoses like "Appendectomy - Post-operative" are medical terminology. | High — violates the 6th-grade reading level requirement | Create a `diagnoses_plain_language.json` mapping file. Example: "Appendectomy - Post-operative" → "Recovery after surgery to remove the appendix". |
| 3 | **Spanish translations are not provided for any content.** The PRD requires bilingual support, but all CSV data is in English. | Medium — P1 feature, but important for the persona | For MVP, translate UI labels and screening questions manually. Patient data remains in English with translated field labels. Use Amazon Translate for production. |
| 4 | **Care instructions are not structured by time of day in the CSV.** The `special_instructions` field is a single text block. | Medium — affects the Care Instructions screen layout | For MVP, display special_instructions as a single block. In production, use Comprehend Medical to extract and structure time-based instructions. |
| 5 | **Medication timing is inconsistent.** Some medications specify exact timing ("Once daily at bedtime"), others say "As directed." | Low — affects time-of-day grouping but all medications are still displayed | Parse what timing is available. Group medications with specific timing; show "As directed" medications in a separate "Flexible Timing" group. |
| 6 | **No geocoding for resource proximity filtering.** Programs have addresses but the dataset doesn't include lat/long coordinates. | Low — affects sorting by distance, which is a P2 feature | For MVP, sort by availability status. For production, geocode addresses using AWS Location Service. |
| 7 | **Programs directory has simulated utilization data.** Fields like `Simulated Utilization (%)` indicate this is synthetic data. | Low — acceptable for demo; flag for production replacement | Note in demo that real-time availability would connect to program APIs. |
| 8 | **Patient age is not in the dataset.** Only `weight_kg` is provided. | Low — age is useful for display but not critical | Infer approximate age from weight using pediatric growth charts, or omit age display. |

### 16.2 Open Questions

1. **Authentication model for production:** Should caregivers create accounts, or should the app use a discharge-linked token (SMS link with patient ID) for access?
2. **Data freshness for resources:** How often should program availability data be refreshed? Real-time API calls vs. nightly batch updates?
3. **Multi-language content ownership:** Who translates and maintains the Spanish (and future language) content? Manual vs. machine translation with human review?
4. **EHR integration scope:** Which EHR systems does CHOC use? What discharge data formats are available via API (HL7 FHIR, CDA, proprietary)?
5. **Notification channel:** For production medication reminders, should the app use web push notifications, SMS, or both?
6. **Privacy and consent:** What consent flow is required before displaying patient health information in the app? Does this fall under HIPAA?
7. **Caregiver vs. patient relationship:** The CSV doesn't model who the caregiver is. Should the app support multiple caregivers per patient?
8. **Offline requirements:** Which features are strictly required offline? Warning signs and medications are the strongest candidates.

---

## 17. Appendix: Dataset Summary

### 17.1 Patient Dataset (discharge_instructions_combined.csv)

- **Records:** 20 patients
- **Diagnoses represented:** Autism Spectrum Disorder Evaluation, Fracture - Upper Extremity, Pneumonia, Type 1 Diabetes - New Onset, Appendectomy Post-operative, Allergic Reaction, Seizure Disorder, Asthma Exacerbation, Acute Gastroenteritis, Bronchiolitis
- **Languages:** English (12), Spanish (5), Mandarin (2), Vietnamese (2), Korean (1)
- **Allergies:** NKA (14), Latex (3), Penicillin (2), Sulfa (2), Eggs (2), Peanuts (1)
- **Conditions on discharge:** Good (12), Stable (5), Improved (3)

### 17.2 Programs Dataset (programs_directory.csv)

- **Records:** 148+ programs
- **Categories:** Food (~50), Housing (~48), Transportation (~25), Therapy (~25)
- **Languages supported:** English, Spanish, Vietnamese, Korean, Mandarin (zh), Armenian, Tagalog, Farsi, Arabic, Khmer
- **Availability statuses:** open, limited, full
- **Service delivery modes:** in-person, telehealth, hybrid, home-delivered
- **Geographic coverage:** Orange County, CA (various zip codes and city-level)

---

*This PRD synthesizes all existing UX artifacts (persona, user flows, information architecture, wireframes), data assets (discharge instructions, programs directory), and the original launch checklist into a single developer-ready specification for AI agent implementation.*
