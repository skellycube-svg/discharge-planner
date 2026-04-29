/* Care to Home Companion - Reusable Component Renderers (LL #51)
   Each function returns an HTML string for a single component type.
   All icons are inline SVG (LL #50: no emojis, consistent across devices). */

const ICONS = {
  syringe: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 3l4 4m-2-2l-9.5 9.5a2 2 0 01-1 .5L5 16l.5-3.5a2 2 0 01.5-1L15.5 2M9 7l8 8"/><path d="M7 17l-4 4"/></svg>',
  droplet: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>',
  map: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
  calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  car: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zM19 17a2 2 0 100 4 2 2 0 000-4z"/></svg>',
  alert: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>',
  list: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  pill: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.5 1.5H8A6.5 6.5 0 001.5 8v8A6.5 6.5 0 008 22.5h8a6.5 6.5 0 006.5-6.5v-2.5"/><path d="M12 2v10M7 7h10"/></svg>',
  calendarNav: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  chevron: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>',
};

/* Plain English: Returns an HTML string for a single checklist item with a checkbox */
function renderChecklistItem(item, lang) {
  const doneClass = item.done ? ' done' : '';
  const badgeClass = item.recurring ? 'badge-daily' : 'badge-onetime';
  const badgeText = item.recurring ? DATA.strings[lang].daily : DATA.strings[lang].oneTime;
  return `
    <div class="checklist-item${doneClass}" data-id="${item.id}" onclick="toggleChecklist('${item.id}')">
      <div class="checkbox">${ICONS.check}</div>
      <span class="checklist-text">${item.text[lang]}</span>
      <span class="checklist-badge ${badgeClass}">${badgeText}</span>
    </div>`;
}

/* Plain English: Returns an HTML string for a medication card with dosing info and take button */
function renderMedicationCard(med, lang) {
  const timeClass = 'time-' + med.timeBlock;
  const timeLabel = med.timeBlock === 'meals'
    ? (lang === 'en' ? 'Before meals' : 'Antes de comer')
    : DATA.strings[lang][med.timeBlock] || med.timeBlock;

  let slidingNote = '';
  if (med.slidingScale) {
    slidingNote = `<div class="sliding-scale-note">${DATA.strings[lang].slidingScaleNote}</div>`;
  }

  return `
    <div class="med-card" data-id="${med.id}">
      <div class="med-header">
        <div>
          <div class="med-name">${med.namePlain[lang]}</div>
          <div class="med-dose">${med.dosePlain[lang]} &middot; ${med.route[lang]}</div>
        </div>
        <span class="med-time-badge ${timeClass}">${timeLabel}</span>
      </div>
      <div class="med-purpose">${med.purpose[lang]}</div>
      ${slidingNote}
      <div class="med-details">
        <span class="med-detail-chip">${med.pharmacy}</span>
        <span class="med-detail-chip">${med.refills} ${DATA.strings[lang].refillsLeft}</span>
      </div>
      <button class="med-action-btn btn-take" id="med-btn-${med.id}" onclick="toggleMedTaken('${med.id}')">
        ${DATA.strings[lang].markAsTaken}
      </button>
    </div>`;
}

/* Plain English: Returns an HTML string for an appointment card with actions */
function renderAppointmentCard(appt, lang) {
  const dateObj = new Date(appt.date + 'T00:00:00');
  const dateStr = dateObj.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const bringItems = (appt.bringItems[lang] || []).map(item =>
    `<div class="appt-bring-item">${item}</div>`
  ).join('');

  return `
    <div class="appt-card">
      <div class="appt-date">${dateStr} &middot; ${appt.time}</div>
      <div class="appt-type">${appt.type[lang]}</div>
      <div class="appt-provider">${appt.provider}</div>
      <div class="appt-location mt-8">${appt.location}</div>
      <div class="appt-address">${appt.address}</div>
      <div class="appt-bring mt-12">
        <div class="appt-bring-title">${DATA.strings[lang].whatToBring}</div>
        ${bringItems}
      </div>
      <div class="appt-actions">
        <a href="tel:${CONFIG.hospital.schedulingPhone}" class="appt-action-btn">
          ${ICONS.phone} ${DATA.strings[lang].callToSchedule}
        </a>
        <a href="https://maps.google.com/?q=${encodeURIComponent(appt.address)}" target="_blank" class="appt-action-btn">
          ${ICONS.map} ${DATA.strings[lang].getDirections}
        </a>
      </div>
      <div class="appt-actions mt-8">
        <button class="appt-action-btn" onclick="navigateTo('resources')">
          ${ICONS.car} ${DATA.strings[lang].getARide}
        </button>
        <button class="appt-action-btn">
          ${ICONS.calendar} ${DATA.strings[lang].addToCalendar}
        </button>
      </div>
    </div>`;
}

/* Plain English: Returns an HTML string for a resource card with call and directions buttons */
function renderResourceCard(resource, lang) {
  const catClass = 'cat-' + resource.category;
  const catLabel = resource.category.charAt(0).toUpperCase() + resource.category.slice(1);

  const langTags = resource.languages.map(l =>
    `<span class="resource-lang-tag">${l}</span>`
  ).join('');

  const addressRow = resource.address
    ? `<div class="resource-info-row">${ICONS.map} ${resource.address}</div>` : '';

  const directionsBtn = resource.address
    ? `<a href="https://maps.google.com/?q=${encodeURIComponent(resource.address)}" target="_blank" class="resource-action-btn btn-directions">${ICONS.map} ${DATA.strings[lang].getDirections}</a>`
    : '';

  return `
    <div class="resource-card">
      <div class="resource-header">
        <div class="resource-name">${resource.name}</div>
        <span class="resource-category-chip ${catClass}">${catLabel}</span>
      </div>
      <div class="resource-desc">${resource.description[lang]}</div>
      <div class="resource-info">
        <div class="resource-info-row">${ICONS.phone} ${resource.phone}</div>
        ${addressRow}
        <div class="resource-info-row">${ICONS.clock} ${resource.hours[lang]}</div>
        <div class="resource-info-row">
          ${ICONS.globe}
          <div class="resource-languages">${langTags}</div>
        </div>
      </div>
      <div class="resource-actions">
        <a href="tel:${resource.phone.replace(/[^0-9+]/g, '')}" class="resource-action-btn btn-call">
          ${ICONS.phone} ${DATA.strings[lang].callNow}
        </a>
        ${directionsBtn}
      </div>
    </div>`;
}

/* Plain English: Returns HTML for a warning sign item with symptom and action */
function renderWarningItem(item, lang) {
  return `
    <div class="warning-item">
      <div class="warning-text">${item.text[lang]}</div>
      <div class="warning-action">${item.action[lang]}</div>
    </div>`;
}

/* Plain English: Returns HTML for a care instruction item */
function renderInstructionCard(instr, lang) {
  return `
    <div class="instruction-card">
      <div class="instruction-text">${instr.text[lang]}</div>
      <div class="instruction-detail">${instr.detail[lang]}</div>
    </div>`;
}
