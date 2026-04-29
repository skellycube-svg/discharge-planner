/* Care to Home Companion - Main Application Logic
   Handles navigation, language toggle, checklist interaction,
   medication tracking, screening flow, chatbot, FAQ, social resources,
   sliding scale, diagnosis detail, print summary, and rendering.
   LL #30: Graceful Degradation - every screen works independently. */

let currentLang = 'en';
let currentTab = 'home';
let currentSubScreen = null;
let screeningAnswers = {};
let checklistState = {};
let medTakenState = {};
let chatMessages = [];
let faqOpenState = {};
let diagnosisDetailOpen = {};

/* ── Initialize App ── */
function initApp() {
  DATA.checklist.forEach(item => { checklistState[item.id] = item.done; });
  DATA.faq.forEach(item => { faqOpenState[item.id] = false; });
  renderAll();
  navigateTo('home');
}

/* ── Render Everything ── */
function renderAll() {
  renderHeader();
  renderHome();
  renderCarePlan();
  renderMeds();
  renderAppointments();
  renderFAQ();
  renderSocial();
  renderBottomNav();
}

/* ── Header ── */
function renderHeader() {
  const s = DATA.strings[currentLang];
  document.getElementById('header-greeting').textContent = s.goodMorning;
  document.getElementById('header-name').textContent = DATA.patient.name[currentLang];
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

/* ── Home Screen ── */
function renderHome() {
  const s = DATA.strings[currentLang];
  const p = DATA.patient;

  // Patient summary card with "More info" button
  const initials = p.name.en.split(' ').map(n => n[0]).join('');
  const detailOpen = diagnosisDetailOpen['home'];
  const detailSection = detailOpen
    ? `<div class="diagnosis-detail">${p.diagnosisDetail[currentLang]}</div>`
    : '';
  const toggleLabel = detailOpen ? s.lessInfo : s.moreInfo;
  const toggleIcon = detailOpen ? ICONS.chevronUp : ICONS.chevronDown;

  document.getElementById('home-patient').innerHTML = `
    <div class="card patient-card">
      <div class="patient-row">
        <div class="patient-avatar">${initials}</div>
        <div>
          <div class="patient-name">${p.name[currentLang]}, ${p.age}</div>
          <div class="patient-detail">${s.dischargeSummary} &middot; ${p.pcp}</div>
        </div>
      </div>
      <div class="patient-summary">${p.diagnosisPlain[currentLang]}</div>
      <button class="more-info-btn" onclick="toggleDiagnosisDetail('home')">${toggleIcon} ${toggleLabel}</button>
      ${detailSection}
    </div>`;

  // Today's checklist — ALL 12 items
  const doneCount = Object.values(checklistState).filter(Boolean).length;
  const totalCount = DATA.checklist.length;
  const pct = Math.round((doneCount / totalCount) * 100);
  const allItems = DATA.checklist.map(item => {
    const stateItem = { ...item, done: checklistState[item.id] };
    return renderChecklistItem(stateItem, currentLang);
  }).join('');

  document.getElementById('home-checklist').innerHTML = `
    <div class="card card-accent-green">
      <div class="progress-header">
        <div class="progress-title">${s.todayChecklist}</div>
        <div class="progress-count">${doneCount} / ${totalCount} ${s.done}</div>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      ${allItems}
    </div>`;

  // Quick access — warning signs only (community help removed)
  document.getElementById('home-quick-access').innerHTML = `
    <div class="quick-access" style="grid-template-columns: 1fr;">
      <button class="quick-btn quick-btn-warning" onclick="navigateTo('warnings')">
        <div class="quick-btn-icon">${ICONS.alert}</div>
        <div class="quick-btn-title">${s.warningSignsTitle}</div>
        <div class="quick-btn-sub">${s.warningSignsSubtitle}</div>
      </button>
    </div>`;
}

/* ── Care Plan Screen ── */
function renderCarePlan() {
  const s = DATA.strings[currentLang];
  const p = DATA.patient;
  let html = '';

  // Discharge summary with "More info" toggle
  const detailOpen = diagnosisDetailOpen['careplan'];
  const detailSection = detailOpen
    ? `<div class="diagnosis-detail">${p.diagnosisDetail[currentLang]}</div>`
    : '';
  const toggleLabel = detailOpen ? s.lessInfo : s.moreInfo;
  const toggleIcon = detailOpen ? ICONS.chevronUp : ICONS.chevronDown;

  html += `
    <div class="section-title">${s.dischargeSummary}</div>
    <div class="card card-accent-blue">
      <div style="font-size:15px;font-weight:600;margin-bottom:4px;">${p.diagnosis[currentLang]}</div>
      <div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">
        ${currentLang === 'en' ? 'Admitted' : 'Ingresado'}: ${formatDate(p.admissionDate, currentLang)} &mdash;
        ${currentLang === 'en' ? 'Discharged' : 'Alta'}: ${formatDate(p.dischargeDate, currentLang)}
      </div>
      <div style="font-size:14px;line-height:1.6;">${p.diagnosisPlain[currentLang]}</div>
      <div style="font-size:13px;color:var(--text-secondary);margin-top:8px;">
        ${currentLang === 'en' ? 'Diet' : 'Dieta'}: ${p.diet[currentLang]}
      </div>
      <button class="more-info-btn" onclick="toggleDiagnosisDetail('careplan')">${toggleIcon} ${toggleLabel}</button>
      ${detailSection}
    </div>`;

  // Care instructions by time of day
  html += `<div class="section-title mt-16">${s.careInstructions}</div>`;
  const times = ['morning', 'afternoon', 'evening', 'bedtime'];
  const dotClasses = { morning: 'time-dot-morning', afternoon: 'time-dot-afternoon', evening: 'time-dot-evening', bedtime: 'time-dot-bedtime' };

  times.forEach(time => {
    const instrs = DATA.instructions[time] || [];
    if (instrs.length === 0) return;
    html += `
      <div class="time-header">
        <div class="time-dot ${dotClasses[time]}"></div>
        <div class="time-label">${s[time]}</div>
      </div>`;
    instrs.forEach(instr => { html += renderInstructionCard(instr, currentLang); });
  });

  // Sick day rules
  html += `
    <div class="sick-day-card mt-16">
      <div class="sick-day-title">${s.sickDayRules}</div>
      ${DATA.sickDayRules.map(rule => `<div class="sick-day-rule">${rule[currentLang]}</div>`).join('')}
    </div>`;

  // Warning signs button
  html += `
    <button class="quick-btn quick-btn-warning" style="width:100%;margin-top:8px;" onclick="navigateTo('warnings')">
      <div class="quick-btn-icon">${ICONS.alert}</div>
      <div class="quick-btn-title">${s.warningSignsTitle}</div>
      <div class="quick-btn-sub">${s.warningSignsSubtitle}</div>
    </button>`;

  // NOTE: Checklist removed from Care Plan per user request — lives only on Home screen

  // Supplemental resources
  html += `
    <div class="supplemental-links">
      <div class="section-subtitle">${s.supplementalResources}</div>
      <div class="supplemental-link">${ICONS.pill} ${s.medSafety} ${ICONS.chevron}</div>
      <div class="supplemental-link">${ICONS.heart} ${s.comfortTips} ${ICONS.chevron}</div>
      <a href="https://${CONFIG.hospital.portalUrl}" target="_blank" class="supplemental-link">${ICONS.globe} ${s.hospitalPortal} ${ICONS.chevron}</a>
    </div>`;

  // Contact bar
  html += `
    <div class="contact-bar">
      <a href="tel:${CONFIG.hospital.nurseLine}" class="contact-btn">${ICONS.phone} ${s.nurseLine}</a>
      <a href="tel:${CONFIG.hospital.schedulingPhone}" class="contact-btn">${ICONS.phone} ${s.callToSchedule}</a>
    </div>`;

  document.getElementById('screen-careplan').innerHTML = html;
}

/* ── Meds Screen ── */
function renderMeds() {
  const s = DATA.strings[currentLang];
  let html = `<div class="section-title">${s.medications}</div>`;

  // Low blood sugar protocol - always visible
  html += `
    <div class="protocol-card">
      <div class="protocol-title">${ICONS.alert} ${s.lowBloodSugar}</div>
      ${DATA.lowBloodSugarSteps.map((step, i) => `
        <div class="protocol-step">
          <div class="protocol-number">${i + 1}</div>
          <div class="protocol-text">${step[currentLang]}</div>
        </div>`).join('')}
    </div>`;

  // Sliding scale chart
  const ss = DATA.slidingScale;
  html += `
    <div class="sliding-scale-card">
      <div class="sliding-scale-title">${s.slidingScaleTitle}</div>
      <div class="sliding-scale-subtitle">${ss.subtitle[currentLang]}</div>
      <table class="sliding-scale-table">
        <thead>
          <tr><th>${s.bloodSugarRange}</th><th>${s.humalogDose}</th></tr>
        </thead>
        <tbody>
          ${ss.rows.map(row => `
            <tr class="ss-row-${row.level}">
              <td>${row.range[currentLang]}</td>
              <td>${row.dose[currentLang]}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;

  // Medication cards
  DATA.medications.forEach(med => { html += renderMedicationCard(med, currentLang); });

  // Pharmacy info
  html += `
    <div class="pharmacy-card">
      <div class="pharmacy-name">${CONFIG.pharmacy.name}</div>
      <div class="pharmacy-detail">${CONFIG.pharmacy.refills} ${s.refillsLeft}</div>
      <a href="tel:${CONFIG.pharmacy.phone.replace(/[^0-9+]/g, '')}" class="pharmacy-call-btn">
        ${ICONS.phone} ${s.callPharmacy}
      </a>
    </div>`;

  document.getElementById('screen-meds').innerHTML = html;
}

/* ── Appointments Screen ── */
function renderAppointments() {
  const s = DATA.strings[currentLang];
  let html = `<div class="section-title">${s.appointments}</div>`;

  // Print for doctor button
  html += `
    <button class="print-doctor-btn" onclick="printDoctorSummary()">
      ${ICONS.printer} ${s.printForDoctor}
    </button>`;

  DATA.appointments.forEach(appt => { html += renderAppointmentCard(appt, currentLang); });
  document.getElementById('screen-appts').innerHTML = html;
}

/* ── FAQ Screen ── */
function renderFAQ() {
  const s = DATA.strings[currentLang];
  let html = `
    <div class="sub-header">
      <button class="back-btn" onclick="goBack()">${ICONS.back}</button>
      <div class="section-title" style="margin:0;padding:0;">${s.faqTitle}</div>
    </div>`;
  DATA.faq.forEach(item => { html += renderFAQItem(item, currentLang); });
  document.getElementById('screen-faq').innerHTML = html;
}

/* ── Social / Resources Screen ── */
function renderSocial() {
  const s = DATA.strings[currentLang];
  let html = `
    <div class="sub-header">
      <button class="back-btn" onclick="goBack()">${ICONS.back}</button>
      <div class="section-title" style="margin:0;padding:0;">${s.socialTitle}</div>
    </div>`;
  DATA.socialResources.forEach(resource => { html += renderSocialResourceCard(resource, currentLang); });
  document.getElementById('screen-social').innerHTML = html;
}

/* ── Warning Signs Sub-Screen ── */
function renderWarnings() {
  const s = DATA.strings[currentLang];
  let html = `
    <div class="sub-header">
      <button class="back-btn" onclick="goBack()">${ICONS.back}</button>
      <div class="section-title" style="margin:0;padding:0;">${s.warningSigns}</div>
    </div>`;

  // Red
  html += `
    <div class="warning-section warning-level-red">
      <div class="warning-level-header">${ICONS.alert} ${s.call911}</div>
      ${DATA.warnings.red.items.map(item => renderWarningItem(item, currentLang)).join('')}
    </div>`;

  // Yellow
  html += `
    <div class="warning-section warning-level-yellow">
      <div class="warning-level-header">${ICONS.phone} ${s.callDoctor}</div>
      ${DATA.warnings.yellow.items.map(item => renderWarningItem(item, currentLang)).join('')}
    </div>`;

  // Green
  html += `
    <div class="warning-section warning-level-green">
      <div class="warning-level-header">${ICONS.check} ${s.watchAtHome}</div>
      ${DATA.warnings.green.items.map(item => renderWarningItem(item, currentLang)).join('')}
    </div>`;

  // Emergency call buttons
  html += `
    <div class="contact-bar mt-16">
      <a href="tel:911" class="contact-btn" style="background:var(--red-light);color:var(--red-dark);border-color:var(--red);">
        ${ICONS.phone} ${s.call911}
      </a>
      <a href="tel:${CONFIG.hospital.nurseLine}" class="contact-btn">
        ${ICONS.phone} ${s.nurseLine}
      </a>
    </div>`;

  document.getElementById('screen-warnings').innerHTML = html;
}

/* ── Resources / Community Help Sub-Screen ── */
function renderResources() {
  const s = DATA.strings[currentLang];
  let html = `
    <div class="sub-header">
      <button class="back-btn" onclick="goBack()">${ICONS.back}</button>
      <div class="section-title" style="margin:0;padding:0;">${s.communityHelpTitle}</div>
    </div>`;

  const hasAnswers = Object.keys(screeningAnswers).length > 0;
  const allAnswered = DATA.screening.every(q => screeningAnswers[q.id] !== undefined);

  if (!hasAnswers || !allAnswered) {
    // Show screening questions
    html += `<div class="section-subtitle">${s.needsScreening}</div>`;
    DATA.screening.forEach(q => {
      const yesClass = screeningAnswers[q.id] === true ? ' selected-yes' : '';
      const noClass = screeningAnswers[q.id] === false ? ' selected-no' : '';
      html += `
        <div class="screening-question">
          <div class="screening-text">${q.question[currentLang]}</div>
          <div class="screening-options">
            <button class="screening-btn${yesClass}" onclick="answerScreening('${q.id}', true)">${s.yes}</button>
            <button class="screening-btn${noClass}" onclick="answerScreening('${q.id}', false)">${s.no}</button>
          </div>
        </div>`;
    });

    const allDone = DATA.screening.every(q => screeningAnswers[q.id] !== undefined);
    html += `<button class="screening-submit" ${allDone ? '' : 'disabled'} onclick="submitScreening()">${s.showResources}</button>`;
  } else {
    // Show filtered resources
    const neededCategories = DATA.screening
      .filter(q => screeningAnswers[q.id] === true)
      .map(q => q.category);

    if (neededCategories.length === 0) {
      html += `
        <div class="empty-state">
          <div class="empty-state-text">${currentLang === 'en'
            ? 'Great! It looks like you don\'t need any resources right now. You can always come back if that changes.'
            : 'Parece que no necesita recursos en este momento. Siempre puede volver si eso cambia.'}</div>
        </div>`;
    } else {
      const filtered = DATA.resources.filter(r => neededCategories.includes(r.category));
      filtered.forEach(r => { html += renderResourceCard(r, currentLang); });
    }

    html += `<button class="screening-reset" onclick="resetScreening()">${s.startOver}</button>`;
  }

  document.getElementById('screen-resources').innerHTML = html;
}

/* ── Navigation ── */
function navigateTo(tab) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  // Handle sub-screens (warnings, resources)
  if (tab === 'warnings') {
    currentSubScreen = 'warnings';
    document.getElementById('screen-warnings').classList.add('active');
    renderWarnings();
    document.querySelector('.bottom-nav').classList.add('hidden');
    window.scrollTo(0, 0);
    return;
  }

  if (tab === 'resources') {
    currentSubScreen = 'resources';
    document.getElementById('screen-resources').classList.add('active');
    renderResources();
    document.querySelector('.bottom-nav').classList.add('hidden');
    window.scrollTo(0, 0);
    return;
  }

  // FAQ and Social are sub-screens with back button
  if (tab === 'faq') {
    currentSubScreen = 'faq';
    document.getElementById('screen-faq').classList.add('active');
    renderFAQ();
    document.querySelector('.bottom-nav').classList.remove('hidden');
    // Keep nav visible but update active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === 'faq');
    });
    window.scrollTo(0, 0);
    return;
  }

  if (tab === 'social') {
    currentSubScreen = 'social';
    document.getElementById('screen-social').classList.add('active');
    renderSocial();
    document.querySelector('.bottom-nav').classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === 'social');
    });
    window.scrollTo(0, 0);
    return;
  }

  // Main tabs
  currentSubScreen = null;
  currentTab = tab;
  document.getElementById('screen-' + tab).classList.add('active');
  document.querySelector('.bottom-nav').classList.remove('hidden');

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });

  window.scrollTo(0, 0);
}

function goBack() {
  currentSubScreen = null;
  navigateTo(currentTab);
}

/* ── Bottom Nav ── */
function renderBottomNav() {
  const s = DATA.strings[currentLang];
  const nav = document.getElementById('bottom-nav');
  nav.innerHTML = `
    <button class="nav-item active" data-tab="home" onclick="navigateTo('home')">
      ${ICONS.home}
      <span>${s.home}</span>
    </button>
    <button class="nav-item" data-tab="careplan" onclick="navigateTo('careplan')">
      ${ICONS.list}
      <span>${s.carePlan}</span>
    </button>
    <button class="nav-item" data-tab="meds" onclick="navigateTo('meds')">
      ${ICONS.pill}
      <span>${s.medications}</span>
    </button>
    <button class="nav-item" data-tab="appts" onclick="navigateTo('appts')">
      ${ICONS.calendarNav}
      <span>${s.appointments}</span>
    </button>
    <button class="nav-item" data-tab="faq" onclick="navigateTo('faq')">
      ${ICONS.helpCircle}
      <span>${s.faq}</span>
    </button>
    <button class="nav-item" data-tab="social" onclick="navigateTo('social')">
      ${ICONS.heart}
      <span>${s.resources}</span>
    </button>`;
}

/* ── Language Toggle ── */
function setLanguage(lang) {
  currentLang = lang;
  renderAll();
  navigateTo(currentTab);
  if (currentSubScreen) navigateTo(currentSubScreen);
}

/* ── Diagnosis Detail Toggle ── */
function toggleDiagnosisDetail(screen) {
  diagnosisDetailOpen[screen] = !diagnosisDetailOpen[screen];
  if (screen === 'home') renderHome();
  else if (screen === 'careplan') renderCarePlan();
}

/* ── Checklist Toggle (with bidirectional med sync) ── */
function toggleChecklist(id) {
  checklistState[id] = !checklistState[id];

  // Sync: if this checklist item maps to a medication, update med state too
  const medId = DATA.checklistMedMap[id];
  if (medId) {
    medTakenState[medId] = checklistState[id];
    renderMeds();
  }

  renderHome();
}

/* ── Medication Taken Toggle (with bidirectional checklist sync) ── */
function toggleMedTaken(id) {
  medTakenState[id] = !medTakenState[id];
  const s = DATA.strings[currentLang];

  // Update med card button
  const medBtn = document.getElementById('med-btn-' + id);
  if (medBtn) {
    medBtn.classList.toggle('btn-taken', medTakenState[id]);
    medBtn.classList.toggle('btn-take', !medTakenState[id]);
    medBtn.textContent = medTakenState[id] ? s.taken : s.markAsTaken;
  }

  // Bidirectional sync: update any checklist items mapped to this med
  Object.keys(DATA.checklistMedMap).forEach(ckId => {
    if (DATA.checklistMedMap[ckId] === id) {
      checklistState[ckId] = medTakenState[id];
    }
  });

  renderHome();
}

/* ── FAQ Toggle ── */
function toggleFAQ(id) {
  faqOpenState[id] = !faqOpenState[id];
  const answer = document.getElementById('faq-answer-' + id);
  const chevron = document.getElementById('faq-chevron-' + id);
  if (answer) {
    answer.classList.toggle('hidden');
  }
  if (chevron) {
    chevron.innerHTML = faqOpenState[id] ? ICONS.chevronUp : ICONS.chevronDown;
  }
}

/* ── Chat ── */
function toggleChat() {
  const overlay = document.getElementById('chat-overlay');
  const fab = document.getElementById('chat-fab');
  const isOpen = !overlay.classList.contains('hidden');

  if (isOpen) {
    overlay.classList.add('hidden');
    fab.classList.remove('hidden');
  } else {
    overlay.classList.remove('hidden');
    fab.classList.add('hidden');
    // Show greeting if no messages
    if (chatMessages.length === 0) {
      chatMessages.push({ text: DATA.strings[currentLang].chatGreeting, isUser: false });
    }
    renderChatMessages();
    document.getElementById('chat-input').focus();
  }
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  container.innerHTML = chatMessages.map(msg => renderChatMessage(msg.text, msg.isUser)).join('');
  container.scrollTop = container.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  chatMessages.push({ text: text, isUser: true });
  input.value = '';

  // Search app data for answer
  const reply = searchAppData(text);
  chatMessages.push({ text: reply, isUser: false });
  renderChatMessages();
}

function searchAppData(query) {
  const s = DATA.strings[currentLang];
  const q = query.toLowerCase();

  // Search medications
  for (const med of DATA.medications) {
    if (q.includes(med.namePlain.en.toLowerCase()) || q.includes(med.namePlain.es.toLowerCase()) ||
        q.includes(med.name.toLowerCase())) {
      return `${med.namePlain[currentLang]}: ${med.dosePlain[currentLang]}. ${med.frequency[currentLang]}. ${med.purpose[currentLang]}`;
    }
  }

  // Blood sugar / sugar keywords
  if (q.includes('blood sugar') || q.includes('azucar') || q.includes('azúcar') || q.includes('glucose') || q.includes('glucosa')) {
    return currentLang === 'en'
      ? 'Target blood sugar is 70-180 mg/dL. Below 70: give juice, wait 15 min, recheck. Above 250: check ketones. Above 300: call the doctor.'
      : 'El azúcar objetivo es 70-180 mg/dL. Menos de 70: dé jugo, espere 15 min, revise. Más de 250: revise cetonas. Más de 300: llame al médico.';
  }

  // Sliding scale
  if (q.includes('sliding scale') || q.includes('escala') || q.includes('dose') || q.includes('dosis')) {
    return currentLang === 'en'
      ? 'The Humalog sliding scale: 70-150 = 0.5 units, 151-200 = 1 unit, 201-250 = 1.5 units, 251-300 = 2 units + check ketones, above 300 = 2 units + call doctor. Below 70: do NOT give insulin.'
      : 'Escala de Humalog: 70-150 = 0.5 unidades, 151-200 = 1 unidad, 201-250 = 1.5 unidades, 251-300 = 2 unidades + revise cetonas, más de 300 = 2 unidades + llame al médico. Menos de 70: NO dé insulina.';
  }

  // Appointments
  if (q.includes('appointment') || q.includes('cita') || q.includes('doctor') || q.includes('visit')) {
    const appt = DATA.appointments[0];
    return `${appt.type[currentLang]}: ${appt.date} ${appt.time} - ${appt.provider} @ ${appt.location}`;
  }

  // Warning / emergency
  if (q.includes('warning') || q.includes('emergency') || q.includes('alerta') || q.includes('emergencia') || q.includes('911')) {
    return currentLang === 'en'
      ? 'Call 911 if your child is unconscious, having a seizure, or confused and cannot drink. Call the doctor if blood sugar stays above 300, drops below 70, or if there are ketones.'
      : 'Llame al 911 si su hijo/a está inconsciente, tiene convulsiones o está confundido/a y no puede beber. Llame al médico si el azúcar se mantiene arriba de 300, baja de 70, o si hay cetonas.';
  }

  // Sick day
  if (q.includes('sick') || q.includes('enferm') || q.includes('eat') || q.includes('comer') || q.includes('vomit')) {
    return currentLang === 'en'
      ? 'Sick day rules: Never stop insulin even if not eating. Check blood sugar every 2-4 hours. Check ketones if above 250. Give extra water and clear fluids.'
      : 'Reglas para días de enfermedad: Nunca deje de dar insulina incluso si no come. Revise el azúcar cada 2-4 horas. Revise cetonas si está arriba de 250. Dé agua extra y líquidos claros.';
  }

  // Pharmacy
  if (q.includes('pharmacy') || q.includes('farmacia') || q.includes('refill') || q.includes('recarga')) {
    return `${CONFIG.pharmacy.name}: ${CONFIG.pharmacy.phone}. ${CONFIG.pharmacy.refills} ${s.refillsLeft}.`;
  }

  // Diet / food
  if (q.includes('diet') || q.includes('dieta') || q.includes('food') || q.includes('comida')) {
    return DATA.patient.diet[currentLang];
  }

  return s.chatNoResults;
}

/* ── Screening ── */
function answerScreening(id, answer) {
  screeningAnswers[id] = answer;
  renderResources();
}

function submitScreening() {
  renderResources();
}

function resetScreening() {
  screeningAnswers = {};
  renderResources();
}

/* ── Print Doctor Summary ── */
function printDoctorSummary() {
  const s = DATA.strings[currentLang];
  const p = DATA.patient;
  const ss = DATA.slidingScale;

  let medsRows = DATA.medications.map(med => `
    <tr>
      <td>${med.namePlain[currentLang]}</td>
      <td>${med.dosePlain[currentLang]}</td>
      <td>${med.frequency[currentLang]}</td>
      <td>${med.route[currentLang]}</td>
    </tr>`).join('');

  let ssRows = ss.rows.map(row => `
    <tr>
      <td>${row.range[currentLang]}</td>
      <td>${row.dose[currentLang]}</td>
    </tr>`).join('');

  // Blood sugar log (7 empty rows for manual fill-in)
  let logRows = '';
  for (let i = 0; i < 7; i++) {
    logRows += `<tr><td style="height:28px;"></td><td></td><td></td><td></td><td></td><td></td></tr>`;
  }

  let apptRows = DATA.appointments.map(appt => {
    const d = new Date(appt.date + 'T00:00:00');
    const dateStr = d.toLocaleDateString(currentLang === 'es' ? 'es-US' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `<tr><td>${dateStr} ${appt.time}</td><td>${appt.type[currentLang]}</td><td>${appt.provider}</td><td>${appt.location}</td></tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="${currentLang}">
<head>
<meta charset="UTF-8">
<title>${s.printTitle}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; color: #111; margin: 20px; }
  h1 { font-size: 18px; border-bottom: 2px solid #2563EB; padding-bottom: 6px; color: #1E40AF; margin-bottom: 12px; }
  h2 { font-size: 14px; margin: 16px 0 8px; color: #1E40AF; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; font-size: 11px; }
  th { background: #EEF2FF; font-weight: 600; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; margin-bottom: 12px; }
  .info-item { font-size: 12px; }
  .info-label { font-weight: 600; color: #374151; }
  .questions-box { border: 1px solid #ccc; padding: 16px; min-height: 120px; margin-bottom: 12px; border-radius: 4px; }
  .notes-box { border: 1px solid #ccc; padding: 16px; min-height: 80px; margin-bottom: 12px; border-radius: 4px; }
  .footer { text-align: center; font-size: 10px; color: #999; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 8px; }
  @media print { body { margin: 10px; } }
</style>
</head>
<body>
  <h1>${s.printTitle} — ${p.name[currentLang]}</h1>

  <h2>${s.printPatientInfo}</h2>
  <div class="info-grid">
    <div class="info-item"><span class="info-label">${s.printAge}:</span> ${p.age}</div>
    <div class="info-item"><span class="info-label">${s.printMRN}:</span> ${p.mrn}</div>
    <div class="info-item"><span class="info-label">${s.printDiagnosis}:</span> ${p.diagnosis[currentLang]}</div>
    <div class="info-item"><span class="info-label">${s.printAllergies}:</span> ${p.allergies[currentLang]}</div>
    <div class="info-item"><span class="info-label">${s.printDischargeDate}:</span> ${formatDate(p.dischargeDate, currentLang)}</div>
    <div class="info-item"><span class="info-label">${s.printPCP}:</span> ${p.pcp}</div>
  </div>

  <h2>${s.printCurrentMeds}</h2>
  <table>
    <thead><tr><th>${s.printMedName}</th><th>${s.printDose}</th><th>${s.printFrequency}</th><th>${s.printRoute}</th></tr></thead>
    <tbody>${medsRows}</tbody>
  </table>

  <h2>${s.printSlidingScale}</h2>
  <table>
    <thead><tr><th>${s.bloodSugarRange}</th><th>${s.humalogDose}</th></tr></thead>
    <tbody>${ssRows}</tbody>
  </table>

  <h2>${s.printBloodSugarLog}</h2>
  <table>
    <thead><tr><th>${s.printDate}</th><th>${s.printBreakfast}</th><th>${s.printLunch}</th><th>${s.printDinner}</th><th>${s.printBedtime}</th><th>${s.printNotes}</th></tr></thead>
    <tbody>${logRows}</tbody>
  </table>

  <h2>${s.printUpcoming}</h2>
  <table>
    <thead><tr><th>${s.printDate}</th><th>Type</th><th>Provider</th><th>Location</th></tr></thead>
    <tbody>${apptRows}</tbody>
  </table>

  <h2>${s.printWarningSigns}</h2>
  <div class="notes-box">${s.printNoneReported}</div>

  <h2>${s.printCaregiverNotes}</h2>
  <div class="notes-box"></div>

  <h2>${s.printQuestions}</h2>
  <div class="questions-box">${s.printWriteHere}</div>

  <div class="footer">${s.printFooter} — ${new Date().toLocaleDateString()}</div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  }
}

/* ── Helpers ── */
function formatDate(dateStr, lang) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
}

/* ── Start the app when DOM is ready ── */
document.addEventListener('DOMContentLoaded', initApp);
