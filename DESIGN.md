# DESIGN.md — Care to Home Companion

Design rules for the app. Derived from the Maria Rodriguez persona and the hackathon scope. Read alongside `CLAUDE.md`.

---

## 1. Who we design for

**Maria Rodriguez** — 34, single mother of two (4 and 7), Spanish-primary, ~6th-grade reading level, smartphone-only, post-discharge stress.

She forgets most of what was said at discharge, fears medication mistakes, and has no reliable transportation. She is the only user that matters for design decisions. If a screen works for Maria, it works for everyone.

**Two-question gate before shipping anything:**
1. Would Maria understand this on a stressed Tuesday night?
2. Does this directly solve a Maria pain point (meds, warnings, transport, language, memory)?

If either answer is "no" or "kind of," cut it.

---

## 2. Design principles

### 2.1 Plain language, always
- Aim for ~6th-grade reading level. Short sentences. One idea per line.
- Replace clinical terms with everyday words: *"Acute Gastroenteritis"* → *"Stomach bug."* *"Antipyretic"* → *"Medicine for fever."*
- Lead with the action, not the explanation: *"Give 1 spoon every 6 hours"* before *"This medicine reduces fever."*
- Numbers and units are explicit. *"5 mL = 1 teaspoon."* No abbreviations Maria has to decode (PRN, PO, BID).

### 2.2 Visual first
- Every list item gets an icon. Icons reinforce meaning, never replace it.
- Use color as a meaning channel, not decoration:
  - **Red** = stop / emergency / 911
  - **Yellow** = caution / call the doctor
  - **Green** = good / done / safe
  - **Blue / indigo** = neutral information / navigation
  - **Orange** = medication / take with food
- Pill counts are *drawn* (N pill icons) before they are written ("= 2"). Maria should be able to count them.
- Photos and pictographs > paragraphs.

### 2.3 Big touch, big text
- Minimum tap target: 44×44 px. Buttons stretch full width on most actions.
- Body text minimum 16 px; primary actions 18–20 px and bold.
- One primary action per screen. Secondary actions are visually quieter.
- Avoid horizontal scrolling. Avoid two-column layouts on mobile.

### 2.4 Bilingual by default
- Language toggle is always visible (top bar).
- Toggling switches *all* UI chrome instantly, no reload.
- Spanish is treated as a first-class language, not an afterthought translation.
- For dynamic clinical content we don't have ES for, render EN with strong icons and visuals so Maria can still navigate.

### 2.5 Forgiving and reassuring
- Maria forgets things. The app remembers for her: today's meds, next appointment, what's already done.
- Never use scolding language ("You missed a dose"). Use neutral framing ("Take this when you can").
- Confirmation before destructive actions; undo where it's cheap to provide.
- Phone numbers are tappable (`tel:`). Addresses link to maps. Don't make Maria copy/paste anything.

### 2.6 Trust signals
- When showing an emergency number, it's huge, red, and one tap.
- When recommending a community program, show *why*: language match, distance, availability. Don't make Maria guess.
- Source clinical info from the discharge data — don't hallucinate. If the CSV doesn't say it, the app doesn't show it.

---

## 3. Information hierarchy

For each screen, in order of importance:

### Dashboard / Home
1. Who the patient is + what happened (one line, plain language)
2. What to do *right now* (next med, next appointment)
3. Emergency button (always visible, one tap to 911)
4. Navigation to the four pillars: Meds / Appointments / Warnings / Resources

### Medications
1. Time of day grouping (Morning / Afternoon / Evening)
2. Per med: drawn pill count → name → why → with food/water → drowsy warning → refill state
3. "Why am I giving this?" line in plain language
4. Tap → larger detail / read-aloud (stretch)

### Appointments
1. Next appointment, big, with day-of-week and date
2. Doctor + location + time, each with its own icon
3. "I need a ride" → routes into Resources transportation filter
4. Past/upcoming sections only if there's more than one

### Warnings (from `seek_medical_attention_for`)
1. **STOP — Call 911** block (red, top): life-threatening signs
2. **CAUTION — Call doctor** block (yellow): non-emergency signs
3. Each item: short symptom phrase + one-tap call button
4. Doctor's number comes from the patient's PCP field

### Resources (Social Needs)
1. Filter context up top (zip / language / category) — pre-filled from patient data when possible
2. Each card: program name → category icon → why-recommended → availability badge (open/limited/full) → call button + directions
3. Eligibility surfaced honestly: green check for "you likely qualify," yellow for "may qualify," gray for "missing info"
4. Phone tappable; address opens maps

---

## 4. Component patterns to keep

The current Tailwind/Radix scaffold already enforces most of this; preserve these patterns:

- `max-w-md` mobile shell with sticky bottom nav (Home / Meds / Visits / Help)
- Rounded-3xl cards with thick 2-4px borders for category color-coding
- `font-black` for headings, `font-bold` for body emphasis (Maria-friendly weight)
- Sticky page header with title + subtitle in EN/ES
- `active:scale-95` press feedback on every interactive element

---

## 5. What NOT to do

- ❌ No dense tables. No data grids. No tooltips that hide critical info.
- ❌ No medical abbreviations in user-facing copy.
- ❌ No light gray text on white. Contrast ratio ≥ 4.5:1.
- ❌ No required form fields beyond what's needed for the demo flow.
- ❌ No modals stacked on modals.
- ❌ No "hover-only" states. This is a phone.
- ❌ No icon without a label, except the universal back arrow and language toggle.
- ❌ Don't surface raw clinical fields untranslated (e.g., raw `discharge_diagnosis: "Acute Gastroenteritis"`). Run it through the plain-language layer.

---

## 6. Accessibility checklist (lightweight, per screen)

- [ ] Tap targets ≥ 44 px
- [ ] Body text ≥ 16 px, headings ≥ 20 px
- [ ] Color is never the only signal (icon or text reinforces)
- [ ] Phone numbers, addresses, and emergency actions are tappable
- [ ] Both EN and ES toggle correctly
- [ ] Renders correctly at 360 px wide (smallest common Android)
- [ ] Works with one thumb (primary actions in the lower two-thirds)

---

## 7. Demo storyboard (the "happy Maria path")

This is the flow we tune the design for. Anything that doesn't support it is a stretch goal.

1. Maria opens the app → sees her child's name and a one-line plain summary of why they were hospitalized.
2. The home screen tells her: *"Right now: give the morning pill with food."* She taps it, sees 1 pill drawn, with a fork icon, and "Take with food."
3. She switches to ES — everything switches.
4. She taps **Warnings**, sees the red 911 block and the yellow "call the doctor" block. The doctor's number is right there.
5. She taps **Appointments**, sees the next visit. Taps "I need a ride" → lands in **Resources** filtered to transportation in her zip, in Spanish, with availability badges.
6. She taps a green "Open" program → call button dials directly.

If a judge can follow this path on a phone in under 90 seconds without explanation, the design has done its job.
