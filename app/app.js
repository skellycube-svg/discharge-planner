/* Care to Home Companion - Main Application Logic
   Handles navigation, language toggle, checklist interaction,
   medication tracking, screening flow, and rendering.
   LL #30: Graceful Degradation - every screen works independently. */

let currentLang = 'en';
let currentTab = 'home';
let currentSubScreen = null;
let screeningAnswers = {};
let checklistState = {};
let medTakenState = {};

/* ââ Initialize App ââ */
function initApp() {
  DATA.checklist.forEach(item => { checklistState[item.id] = item.done; });
  renderAll();
  navigateTo('home');
}

/* ââ Render Everything ââ */
function renderAll() {
  renderHeader();
  renderHome();
  renderCarePlan();
  renderMeds();
  renderAppointments();
  renderBottomNav();
}

/* ââ Header ââ */
function renderHeader() {
  const s = DATA.strings[currentLang];
  document.getElementById('header-greeting').textContent = s.goodMorning;
  document.getElementById('header-name').textContent = DATA.patient.name[currentLang];
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

/* ââ Home Screen ââ */
function renderHome() {
  const s = DATA.strings[currentLang];
  const p = DATA.patient;

  // Patient summary card
  const initials = p.name.en.split(' ').map(n => n[0]).join('');
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
    </div>`;

  // Today's checklist (top 5)
  const doneCount = Object.values(checklistState).filter(Boolean).length;
  const totalCount = DATA.checklist.length;
  const pct = Math.round((doneCount / totalCount) * 100);
  const topItems = DATA.checklist.slice(0, 5).map(item => {
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
      ${topItems}
    </div>`;

  // Next medication
  const nextMed = DATA.medications[0];
  const taken = medTakenState[nextMed.id];
  const btnClass = taken ? 'next-med-btn taken-btn' : 'next-med-btn';
  const btnText = taken ? s.taken : s.markAsTaken;
  document.getElementById('home-next-med').innerHTML = `
    <div class="card next-med-card">
      <div style="font-size:13px;font-weight:600;color:var(--purple);margin-bottom:8px;">${s.nextMedication}</div>
      <div class="next-med-row">
        <div>
          <div class="next-med-name">${nextMed.namePlain[currentLang]}</div>
          <div class="next-med-dose">${nextMed.dosePlain[currentLang]}</div>
        </div>
        <div>
          <div class="next-med-time">9:00 PM</div>
          <div class="next-med-countdown">${currentLang === 'en' ? 'at bedtime' : 'a la hora de dormir'}</div>
        </div>
      </div>
      <button class="${btnClass}" id="home-med-btn" onclick="toggleMedTaken('${nextMed.id}')">${btnText}</button>
    </div>`;

  // Quick access buttons
  document.getElementById('home-quick-access').innerHTML = `
    <div class="quick-access">
      <button class="quick-btn quick-btn-warning" onclick="navigateTo('warnings')">
        <div class="quick-btn-icon">${ICONS.alert}</div>
        <div class="quick-btn-title">${s.warningSignsTitle}</div>
        <div class="quick-btn-sub">${s.warningSignsSubtitle}</div>
      </button>
      <button class="quick-btn quick-btn-resources" onclick="navigateTo('resources')">
        <div class="quick-btn-icon">${ICONS.heart}</div>
        <div class="quick-btn-title">${s.communityHelpTitle}</div>
        <div class="quick-btn-sub">${s.communityHelpSubtitle}</div>
      </button>
    </div>`;
}

/* ââ Care Plan Screen ââ */
function renderCarePlan() {
  const s = DATA.strings[currentLang];
  const p = DATA.patient;
  let html = '';

  // Discharge summary
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

  // Full checklist
  html += `<div class="section-title mt-16">${s.recoveryChecklist}</div>`;
  const doneCount = Object.values(checklistState).filter(Boolean).length;
  const totalCount = DATA.checklist.length;
  const pct = Math.round((doneCount / totalCount) * 100);
  html += `
    <div class="progress-header">
      <div class="progress-count">${doneCount} / ${totalCount} ${s.done}</div>
    </div>
    <div class="progress-bar mb-8"><div class="progress-fill" style="width:${pct}%"></div></div>`;
  DATA.checklist.forEach(item => {
    const stateItem = { ...item, done: checklistState[item.id] };
    html += renderChecklistItem(stateItem, currentLang);
  });

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

/* ââ Meds Screen ââ */
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

/* ââ Appointments Screen ââ */
function renderAppointments() {
  const s = DATA.strings[currentLang];
  let html = `<div class="section-title">${s.appointments}</div>`;
  DATA.appointments.forEach(appt => { html += renderAppointmentCard(appt, currentLang); });
  document.getElementById('screen-appts').innerHTML = html;
}

/* ââ Warning Signs Sub-Screen ââ */
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

/* ââ Resources / Community Help Sub-Screen ââ */
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

/* ââ Navigation ââ */
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

/* ââ Bottom Nav ââ */
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
    </button>`;
}

/* ââ Language Toggle ââ */
function setLanguage(lang) {
  currentLang = lang;
  renderAll();
  navigateTo(currentTab);
  if (currentSubScreen) navigateTo(currentSubScreen);
}

/* ââ Checklist Toggle ââ */
function toggleChecklist(id) {
  checklistState[id] = !checklistState[id];
  renderHome();
  renderCarePlan();
}

/* ââ Medication Taken Toggle ââ */
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

  // Update home next-med button
  const homeBtn = document.getElementById('home-med-btn');
  if (homeBtn && DATA.medications[0].id === id) {
    homeBtn.classList.toggle('taken-btn', medTakenState[id]);
    homeBtn.textContent = medTakenState[id] ? s.taken : s.markAsTaken;
  }
}

/* ââ Screening ââ */
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

/* ââ Helpers ââ */
function formatDate(dateStr, lang) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
}

/* ââ Start the app when DOM is ready ââ */
document.addEventListener('DOMContentLoaded', initApp);
