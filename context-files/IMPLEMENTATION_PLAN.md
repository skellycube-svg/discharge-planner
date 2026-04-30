Recon notes                                                                                           
                                                                                                        
  - Base (discharge-planner/frontend): React 18 + RR7 + Tailwind v4 + shadcn. Pages: Login, Dashboard,  
  Medications, Appointments, WarningSigns, Resources. LanguageContext (en/es), PatientContext           
  (selectPatient/clearPatient/allPatients), localStorage persistence. Layout is max-w-md, sticky bottom 
  nav with 4 tabs (Home / Meds / Visits / Help). Dashboard already has a setShowStay collapsible pattern
   I can mirror for the visit-summary dropdown.
  - dp2 "login": Not a real login — single hardcoded patient, "Good morning, {name}" greeting, no
  patient picker. So the "stick to dp2 login flow" really means: drop the 20-patient picker → simple    
  welcome/continue with persisted patient, default to first. Base already persists patient.id in
  cth.selectedPatientId, so this lines up.                                                              
  - dp4 intake quiz (templates/support.html): 7-question flow (zip, household, income, food, stress,
  safety, transport) with stepper + emoji option-pills, then results grouped by need (Food / Mental /   
  Safety / Transport / etc.) with one-tap call. Strong inspo for the optional "Personalize" flow.
  - dp4 medications: progress fill bar, section labels — useful for pickup checklist visual.            
  - dp4 pickup.html: progress bar + checklist pattern → reuse for med pickup checklist.                 
  - dp3 print-for-doctor: actually not implemented in src. I'll add window.print() + @media print       
  stylesheet on Dashboard.                                                                              
  - CSV (data/discharge_instructions_combined.csv) is already parsed into Patient with rich fields      
  (procedures, educationalForms, diet, specialInstructions, conditionOnDischarge, etc.). Per your #5    
  instruction: surface what's there, leave a labeled "More about this condition" placeholder where the
  CSV doesn't have content.                                                                             
                  
  Plan (in order I'd build)

  P0 — Login flow (#1)                                                                                  
  - Replace patient picker with dp2-style "welcome back, continue" screen: hero greeting, big primary
  CTA "Continue as {persisted name}" if stored, plus a "Switch child" affordance that then shows the    
  picker. First-run users see picker directly. No real auth.                                        
                                                                                                        
  P0 — Dashboard restructure (#2, #3)
  - Add AI-Assistant chat-style textbox above "Caring for" (label + placeholder + disabled send icon —  
  pure UI, no functionality).                                                                           
  - Collapse the entire Visit Summary block (admit/discharge/length/condition chips + allergy banner +  
  procedures + forms) into ONE dropdown, closed by default, with ChevronDown icon and a clear "Visit    
  summary" label. Keep the existing collapsible pattern (showStay state).                               
  - Hero, todo checklist, call-doctor, and section grid stay above the fold.
                                                                                                        
  P1 — Expanded condition/med info (#5)                                                                 
  - New ConditionDetail collapsible card on Dashboard sourcing dischargeDiagnosis, whatHappenedPlain,   
  specialInstructions, diet from CSV. Where CSV has nothing, render a "More info coming soon"           
  placeholder section.                                                                                  
  - Per-medication: add a "What it's for / How to use" expansion sourced from notePlain/frequency/route 
  with placeholder for missing context.                                                                
                                                                                                        
  P1 — Medications tab overhaul (#6)
  - Per-med "How to use" dropdown (collapsible, closed by default).                                     
  - Master "All medications" dropdown at top (quick list).                                              
  - "Upcoming pickups" section (mock — flag prescription meds with isPrescription).                     
  - "Pickup support" panel: agent helper button (UI-only), translation phrases card, "What to ask the   
  pharmacist" checklist.                                                                                
  - Pickup checklist with progress bar (dp4 pattern), localStorage-persisted.                           
  - Dosing visual for range-dose meds (parse "5–10 mL" → segmented bar).                                
                                                                                                        
  P1 — Appointments tab (#7)                                                                            
  - "Why follow-ups matter" intro card.                                                                 
  - Pre-appointment checklist (collapsible).                                                            
  - "What to say / ask" prompt list.                                                                    
  - "Add to calendar" → generate .ics data URL from dateISO + specialty + location.                     
                                                                                                        
  P1 — Resources intake (#4)                                                                            
  - Add an optional "Personalize results" card at the top of Resources (NOT a gate). Tap → modal/page   
  with the dp4-style 7-question quiz. Skip = current behavior.                                          
  - Persist answers to localStorage; results re-rank cards (zip → distance, transport=yes → boost       
  transportation).                                                                                      
  - Add a prominent "Get a ride" card at the top regardless of quiz state — links into transportation   
  tab.                                                                                               
                                                                                                        
  P2 — FAQ dropdown footer (#8)
  - Add a footer-level collapsible "FAQ" section (above the bottom nav, on every page OR just Dashboard 
  — confirm which) with static Q&A items in EN/ES. NOT a 5th nav tab. Keep the 2x2 grid on Dashboard    
  intact.                                                                                               
                                                                                                        
  P2 — Print for doctor (dp3 #3)
  - "Print summary for doctor" button on Dashboard. window.print() + @media print stylesheet that hides
  nav/chat box and lays out summary + meds + appointments + warnings cleanly.                           
                                                                             
  Open questions before I start coding                                                                  
                                                                                                        
  1. FAQ placement: dropdown that lives where exactly? Options: (a) a sticky collapsible just above the 
  bottom nav, on all pages; (b) only on Dashboard at the bottom; (c) a small "?" button in the top bar  
  that opens a sheet. Which?                                                                            
  2. AI-Assistant textbox: just the input + send-icon, or also one row of suggested-question chips below
   it (e.g. "Can I eat X with my meds?", "When is my next dose?")?                                      
  3. Personalize quiz: full-page route (/resources/personalize) or modal sheet? And do you want all 7
  dp4 questions, or trimmed to the ones that affect ranking (zip, transport, food, language)?           
  4. Print button: Dashboard only, or also a small print icon in top bar?
                                                                                                        
  Once you answer those four, I'll start with P0 (login + dashboard) and work down. 
  
ANSWERS: 1. In the footer button panel add an faq button. 2. Just a UI Textbox with a label that says AI-Assistant 3. Questions that help give more accurate "personalizaed" results using the given csv data columns. 4. Lets try both