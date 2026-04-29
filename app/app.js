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
let chatMessages = [];
let faqOpenState = {};

/* ── Initialize App ── */
function initApp() {
  DATA.checklist.forEach(item => { checklistState[item.id] = item.done; });
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
      <button class="more-info-btn" onclick="toggleDiagnosisDetail('home')">
        ${ICONS.helpCircle} <span id="home-detail-btn-text">${s.moreInfo}</span>
      </button>
      <div class="diagnosis-detail hidden" id="home-diagnosis-detail">
        ${p.diagnosisDetail[currentLang]}
      </div>
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

/* ── Care Plan Screen ── */
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
      <button class="more-info-btn" onclick="toggleDiagnosisDetail('careplan')">
        ${ICONS.helpCircle} <span id="careplan-detail-btn-text">${s.moreInfo}</span>
      </button>
      <div class="diagnosis-detail hidden" id="careplan-diagnosis-detail">
        ${p.diagnosisDetail[currentLang]}
      </div>
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
  const sc = DATA.slidingScale;
  html += `
    <div class="sliding-scale-card">
      <div class="sliding-scale-title">${sc.title[currentLang]}</div>
      <div class="sliding-scale-subtitle">${sc.subtitle[currentLang]}</div>
      <table class="sliding-scale-table">
        <thead>
          <tr>
            <th>${s.bloodSugarRange}</th>
            <th>${s.humalogDose}</th>
          </tr>
        </thead>
        <tbody>
          ${sc.rows.map(row => `
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
  DATA.appointments.forEach(appt => { html += renderAppointmentCard(appt, currentLang); });

  // Print for doctor visit button
  html += `
    <button class="print-doctor-btn" onclick="printDoctorSummary()">
      ${ICONS.printer}
      <span>${s.printForDoctor}</span>
    </button>`;

  document.getElementById('screen-appts').innerHTML = html;
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

/* ── FAQ Screen ── */
function renderFAQ() {
  const s = DATA.strings[currentLang];
  let html = `<div class="section-title">${s.faqTitle}</div>`;
  DATA.faq.forEach(item => { html += renderFAQItem(item, currentLang); });

  // Contact bar at bottom
  html += `
    <div class="contact-bar mt-16">
      <a href="tel:${CONFIG.hospital.nurseLine}" class="contact-btn">
        ${ICONS.phone} ${s.nurseLine}
      </a>
    </div>`;

  document.getElementById('screen-faq').innerHTML = html;
}

function toggleFAQ(id) {
  faqOpenState[id] = !faqOpenState[id];
  const answer = document.getElementById('faq-answer-' + id);
  const chevron = document.getElementById('faq-chevron-' + id);
  if (answer) {
    answer.classList.toggle('hidden', !faqOpenState[id]);
    chevron.innerHTML = faqOpenState[id] ? ICONS.chevronUp : ICONS.chevronDown;
  }
}

/* ── Social Resources Screen ── */
function renderSocial() {
  const s = DATA.strings[currentLang];
  let html = `<div class="section-title">${s.socialTitle}</div>`;
  DATA.socialResources.forEach(r => { html += renderSocialResourceCard(r, currentLang); });
  document.getElementById('screen-social').innerHTML = html;
}

/* ── Chatbot ── */
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
    // Show greeting on first open
    if (chatMessages.length === 0) {
      const s = DATA.strings[currentLang];
      chatMessages.push({ text: s.chatGreeting, isUser: false });
      renderChatMessages();
    }
    document.getElementById('chat-input').focus();
    document.getElementById('chat-title').textContent = DATA.strings[currentLang].chatAssistant;
    document.getElementById('chat-input').placeholder = DATA.strings[currentLang].askPlaceholder;
  }
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  container.innerHTML = chatMessages.map(m => renderChatMessage(m.text, m.isUser)).join('');
  container.scrollTop = container.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const query = input.value.trim();
  if (!query) return;

  chatMessages.push({ text: query, isUser: true });
  input.value = '';

  const answer = searchAppData(query);
  chatMessages.push({ text: answer, isUser: false });
  renderChatMessages();
}

function searchAppData(query) {
  const q = query.toLowerCase();
  const s = DATA.strings[currentLang];
  const results = [];

  // Search medications
  const medKeywords = ['medicine', 'medication', 'med', 'insulin', 'lantus', 'humalog', 'vitamin', 'dose', 'dosage', 'medicin', 'insulina', 'vitamina', 'dosis'];
  if (medKeywords.some(k => q.includes(k))) {
    DATA.medications.forEach(med => {
      if (q.includes(med.namePlain[currentLang].toLowerCase()) || q.includes(med.id.toLowerCase()) || medKeywords.some(k => q.includes(k))) {
        results.push(`<strong>${med.namePlain[currentLang]}</strong>: ${med.dosePlain[currentLang]} — ${med.purpose[currentLang]}`);
      }
    });
    if (results.length === 0) {
      DATA.medications.forEach(med => {
        results.push(`<strong>${med.namePlain[currentLang]}</strong>: ${med.dosePlain[currentLang]}`);
      });
    }
  }

  // Search appointments
  const apptKeywords = ['appointment', 'visit', 'doctor', 'follow-up', 'followup', 'schedule', 'next', 'cita', 'visita', 'médico', 'doctor', 'programar'];
  if (apptKeywords.some(k => q.includes(k))) {
    DATA.appointments.forEach(appt => {
      const dateObj = new Date(appt.date + 'T00:00:00');
      const dateStr = dateObj.toLocaleDateString(currentLang === 'es' ? 'es-US' : 'en-US', { month: 'long', day: 'numeric' });
      results.push(`<strong>${appt.type[currentLang]}</strong>: ${dateStr} at ${appt.time} — ${appt.provider}, ${appt.location}`);
    });
  }

  // Search warnings / blood sugar
  const warnKeywords = ['warning', 'danger', 'emergency', '911', 'call', 'blood sugar', 'low', 'high', 'ketone', 'alerta', 'emergencia', 'azúcar', 'bajo', 'alto', 'cetona'];
  if (warnKeywords.some(k => q.includes(k))) {
    if (q.includes('low') || q.includes('bajo') || q.includes('hypo')) {
      DATA.lowBloodSugarSteps.forEach((step, i) => {
        results.push(`Step ${i + 1}: ${step[currentLang]}`);
      });
    } else {
      DATA.warnings.red.items.slice(0, 2).forEach(w => {
        results.push(`<span style="color:var(--red-dark)">⚠ ${w.text[currentLang]}</span> — ${w.action[currentLang]}`);
      });
      results.push(currentLang === 'en' ? 'See the Warning Signs section for the full list.' : 'Vea la sección de Señales de Alerta para la lista completa.');
    }
  }

  // Search diet
  const dietKeywords = ['diet', 'food', 'eat', 'meal', 'snack', 'dieta', 'comida', 'comer'];
  if (dietKeywords.some(k => q.includes(k))) {
    results.push(`${currentLang === 'en' ? 'Diet' : 'Dieta'}: ${DATA.patient.diet[currentLang]}`);
    DATA.sickDayRules.forEach(rule => results.push(rule[currentLang]));
  }

  // Search FAQ
  const faqKeywords = ['school', 'store', 'afford', 'cost', 'insurance', 'escuela', 'costo', 'seguro'];
  if (faqKeywords.some(k => q.includes(k)) || results.length === 0) {
    DATA.faq.forEach(faq => {
      const qText = faq.question[currentLang].toLowerCase();
      const aText = faq.answer[currentLang].toLowerCase();
      if (q.split(' ').some(word => word.length > 3 && (qText.includes(word) || aText.includes(word)))) {
        results.push(`<strong>${faq.question[currentLang]}</strong><br>${faq.answer[currentLang]}`);
      }
    });
  }

  // Search pharmacy
  const pharmKeywords = ['pharmacy', 'refill', 'rite aid', 'farmacia', 'recarga'];
  if (pharmKeywords.some(k => q.includes(k))) {
    results.push(`${CONFIG.pharmacy.name} — ${CONFIG.pharmacy.phone} (${CONFIG.pharmacy.refills} ${s.refillsLeft})`);
  }

  if (results.length > 0) {
    return results.join('<br><br>');
  }
  return s.chatNoResults;
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

  // Main tabs
  currentSubScreen = null;
  currentTab = tab;
  document.getElementById('screen-' + tab).classList.add('active');
  document.querySelector('.bottom-nav').classList.remove('hidden');

  // Render tab-specific content on demand
  if (tab === 'faq') renderFAQ();
  if (tab === 'social') renderSocial();

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
      ${ICONS.users}
      <span>${s.socialResources}</span>
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
  const detail = document.getElementById(screen + '-diagnosis-detail');
  const btnText = document.getElementById(screen + '-detail-btn-text');
  const s = DATA.strings[currentLang];
  if (detail) {
    const isHidden = detail.classList.contains('hidden');
    detail.classList.toggle('hidden', !isHidden);
    btnText.textContent = isHidden ? s.lessInfo : s.moreInfo;
  }
}

/* ── Checklist Toggle (synced with meds) ── */
function toggleChecklist(id) {
  checklistState[id] = !checklistState[id];

  // If this checklist item maps to a medication, sync the med state
  const mappedMedId = DATA.checklistMedMap[id];
  if (mappedMedId) {
    medTakenState[mappedMedId] = checklistState[id];
  }

  renderHome();
  renderCarePlan();
  renderMeds();
}

/* ── Medication Taken Toggle (synced with checklist) ── */
function toggleMedTaken(id) {
  medTakenState[id] = !medTakenState[id];

  // Sync back to any checklist items that map to this medication
  Object.entries(DATA.checklistMedMap).forEach(([ckId, medId]) => {
    if (medId === id) {
      checklistState[ckId] = medTakenState[id];
    }
  });

  // Re-render everything to keep states in sync
  renderHome();
  renderCarePlan();
  renderMeds();
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

/* ── Helpers ── */
function formatDate(dateStr, lang) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
}

/* ── Print Doctor Visit Summary ── */
function printDoctorSummary() {
  const s = DATA.strings[currentLang];
  const p = DATA.patient;
  const sc = DATA.slidingScale;

  // Build 7-day date headers
  const today = new Date();
  const dateHeaders = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dateHeaders.push(d.toLocaleDateString(currentLang === 'es' ? 'es-US' : 'en-US', { month: 'short', day: 'numeric' }));
  }

  const logRows = dateHeaders.map(dh => `
    <tr>
      <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;">${dh}</td>
      <td style="padding:6px 8px;border:1px solid #ccc;"></td>
      <td style="padding:6px 8px;border:1px solid #ccc;"></td>
      <td style="padding:6px 8px;border:1px solid #ccc;"></td>
      <td style="padding:6px 8px;border:1px solid #ccc;"></td>
      <td style="padding:6px 8px;border:1px solid #ccc;"></td>
    </tr>`).join('');

  // Medication table rows
  const medRows = DATA.medications.map(med => `
    <tr>
      <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;font-weight:600;">${med.namePlain[currentLang]}</td>
      <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;">${med.dosePlain[currentLang]}</td>
      <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;">${med.frequency[currentLang]}</td>
      <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;">${med.route[currentLang]}</td>
    </tr>`).join('');

  // Sliding scale rows
  const scaleRows = sc.rows.map(row => {
    let bg = '#fff';
    if (row.level === 'low' || row.level === 'high') bg = '#FEE2E2';
    else if (row.level === 'normal') bg = '#DCFCE7';
    else if (row.level === 'watch') bg = '#FEF3C7';
    return `
      <tr style="background:${bg};">
        <td style="padding:5px 8px;border:1px solid #ccc;font-size:12px;">${row.range[currentLang]}</td>
        <td style="padding:5px 8px;border:1px solid #ccc;font-size:12px;">${row.dose[currentLang]}</td>
      </tr>`;
  }).join('');

  // Appointments
  const apptRows = DATA.appointments.map(appt => {
    const dateObj = new Date(appt.date + 'T00:00:00');
    const dateStr = dateObj.toLocaleDateString(currentLang === 'es' ? 'es-US' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return `
      <tr>
        <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;">${dateStr}, ${appt.time}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;">${appt.type[currentLang]}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;">${appt.provider}</td>
        <td style="padding:6px 8px;border:1px solid #ccc;font-size:12px;">${appt.location}</td>
      </tr>`;
  }).join('');

  // Question lines
  const questionLines = Array(5).fill('').map(() =>
    `<div style="border-bottom:1px solid #ccc;height:28px;margin-bottom:4px;"></div>`
  ).join('');

  // Caregiver notes lines
  const noteLines = Array(4).fill('').map(() =>
    `<div style="border-bottom:1px solid #ccc;height:28px;margin-bottom:4px;"></div>`
  ).join('');

  const printHTML = `
    <!DOCTYPE html>
    <html lang="${currentLang}">
    <head>
      <meta charset="UTF-8">
      <title>${s.printTitle} - ${p.name[currentLang]}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, Helvetica, sans-serif; color: #111; line-height: 1.4; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 20px; text-align: center; margin-bottom: 4px; color: #1E40AF; }
        .print-subtitle { text-align: center; font-size: 12px; color: #666; margin-bottom: 16px; }
        h2 { font-size: 14px; font-weight: 700; color: #1E40AF; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #2563EB; padding-bottom: 4px; margin: 16px 0 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        th { background: #EEF2FF; padding: 6px 8px; border: 1px solid #ccc; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; text-align: left; color: #3730A3; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin-bottom: 12px; }
        .info-item { font-size: 13px; padding: 3px 0; }
        .info-label { font-weight: 600; color: #444; }
        .section { page-break-inside: avoid; margin-bottom: 8px; }
        .footer { text-align: center; font-size: 10px; color: #999; margin-top: 20px; padding-top: 8px; border-top: 1px solid #ddd; }
        .hospital-header { text-align: center; margin-bottom: 4px; }
        .hospital-name { font-size: 14px; font-weight: 700; color: #1E40AF; }
        .hospital-contact { font-size: 11px; color: #666; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="hospital-header">
        <div class="hospital-name">${CONFIG.hospital.name}</div>
        <div class="hospital-contact">${CONFIG.hospital.address} | ${CONFIG.hospital.nurseLine}</div>
      </div>
      <h1>${s.printTitle}</h1>
      <div class="print-subtitle">${currentLang === 'en' ? 'Printed' : 'Impreso'}: ${new Date().toLocaleDateString(currentLang === 'es' ? 'es-US' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>

      <div class="section">
        <h2>${s.printPatientInfo}</h2>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">${currentLang === 'en' ? 'Name' : 'Nombre'}:</span> ${p.name[currentLang]}</div>
          <div class="info-item"><span class="info-label">${s.printAge}:</span> ${p.age}</div>
          <div class="info-item"><span class="info-label">${s.printMRN}:</span> ${p.mrn}</div>
          <div class="info-item"><span class="info-label">${s.printAllergies}:</span> ${p.allergies[currentLang]}</div>
          <div class="info-item"><span class="info-label">${s.printDiagnosis}:</span> ${p.diagnosis[currentLang]}</div>
          <div class="info-item"><span class="info-label">${s.printDischargeDate}:</span> ${formatDate(p.dischargeDate, currentLang)}</div>
          <div class="info-item"><span class="info-label">${s.printPCP}:</span> ${p.pcp}</div>
          <div class="info-item"><span class="info-label">${currentLang === 'en' ? 'Weight' : 'Peso'}:</span> ${p.weight}</div>
        </div>
      </div>

      <div class="section">
        <h2>${s.printCurrentMeds}</h2>
        <table>
          <thead>
            <tr>
              <th>${s.printMedName}</th>
              <th>${s.printDose}</th>
              <th>${s.printFrequency}</th>
              <th>${s.printRoute}</th>
            </tr>
          </thead>
          <tbody>${medRows}</tbody>
        </table>
      </div>

      <div class="section">
        <h2>${s.printSlidingScale}</h2>
        <table>
          <thead>
            <tr>
              <th>${s.bloodSugarRange}</th>
              <th>${s.humalogDose}</th>
            </tr>
          </thead>
          <tbody>${scaleRows}</tbody>
        </table>
      </div>

      <div class="section">
        <h2>${s.printBloodSugarLog}</h2>
        <table>
          <thead>
            <tr>
              <th>${s.printDate}</th>
              <th>${s.printBreakfast}</th>
              <th>${s.printLunch}</th>
              <th>${s.printDinner}</th>
              <th>${s.printBedtime}</th>
              <th>${s.printNotes}</th>
            </tr>
          </thead>
          <tbody>${logRows}</tbody>
        </table>
      </div>

      <div class="section">
        <h2>${s.printUpcoming}</h2>
        <table>
          <thead>
            <tr>
              <th>${s.printDate}</th>
              <th style="min-width:120px;">${currentLang === 'en' ? 'Type' : 'Tipo'}</th>
              <th>${currentLang === 'en' ? 'Provider' : 'Médico'}</th>
              <th>${currentLang === 'en' ? 'Location' : 'Ubicación'}</th>
            </tr>
          </thead>
          <tbody>${apptRows}</tbody>
        </table>
      </div>

      <div class="section">
        <h2>${s.printQuestions}</h2>
        ${questionLines}
      </div>

      <div class="section">
        <h2>${s.printCaregiverNotes}</h2>
        ${noteLines}
      </div>

      <div class="footer">${s.printFooter} | ${CONFIG.hospital.name} | ${new Date().toLocaleDateString()}</div>

      <div class="no-print" style="text-align:center;margin-top:20px;">
        <button onclick="window.print()" style="padding:12px 32px;font-size:16px;font-weight:600;background:#2563EB;color:white;border:none;border-radius:8px;cursor:pointer;">
          ${s.printForDoctor}
        </button>
      </div>
    </body>
    </html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  }
}

/* ── Start the app when DOM is ready ── */
document.addEventListener('DOMContentLoaded', initApp);
