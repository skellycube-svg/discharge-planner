const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const lines = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === '\n' && !inQuotes) {
      lines.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current.trim());

  const headers = parseCSVLine(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const values = parseCSVLine(lines[i]);
    const record = {};
    headers.forEach((h, idx) => {
      record[h] = values[idx] || '';
    });
    records.push(record);
  }
  return records;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Convert discharge instructions
const dischargePath = path.join(__dirname, '../../data/discharge_instructions_combined.csv');
const dischargeText = fs.readFileSync(dischargePath, 'utf-8');
const patients = parseCSV(dischargeText);

const patientsJson = patients.map(p => ({
  patient_id: parseInt(p.patient_id),
  patient_name: p.patient_name,
  mrn: p.mrn,
  weight_kg: parseFloat(p.weight_kg),
  preferred_language: p.preferred_language,
  allergies: p.allergies,
  admission_date: p.admission_date,
  discharge_date: p.discharge_date,
  admitting_diagnosis: p.admitting_diagnosis,
  discharge_diagnosis: p.discharge_diagnosis,
  condition_on_discharge: p.condition_on_discharge,
  primary_care_physician: p.primary_care_physician,
  consulting_physicians: p.consulting_physicians,
  discharge_authenticated_by: p.discharge_authenticated_by,
  diet: p.diet,
  seek_medical_attention_for: p.seek_medical_attention_for,
  special_instructions: p.special_instructions,
  procedures: p.procedures,
  educational_forms_given: p.educational_forms_given,
  home_medications: p.home_medications,
  new_prescriptions: p.new_prescriptions,
  appointments: p.appointments
}));

// Convert programs directory
const programsPath = path.join(__dirname, '../../data/programs_directory.csv');
const programsText = fs.readFileSync(programsPath, 'utf-8');
const programs = parseCSV(programsText);

const programsJson = programs.map(p => ({
  id: p.ID,
  name: p.Name,
  category: p.Category,
  subcategory: p.Subcategory,
  address: p.Address,
  phone: p.Phone,
  website: p.Website,
  zip_codes_served: p['Zip Codes Served'],
  languages: p.Languages ? p.Languages.split('; ').map(l => l.trim()) : [],
  hours: {
    mon: p['Hours (Mon)'],
    tue: p['Hours (Tue)'],
    wed: p['Hours (Wed)'],
    thu: p['Hours (Thu)'],
    fri: p['Hours (Fri)'],
    sat: p['Hours (Sat)'],
    sun: p['Hours (Sun)']
  },
  service_delivery: p['Service Delivery'],
  cost: parseInt(p.Cost) || 0,
  accepted_insurance: p['Accepted Insurance'] ? p['Accepted Insurance'].split('; ').map(i => i.trim()) : [],
  copay: parseInt(p.Copay) || 0,
  ada_accessible: p['ADA Accessible'] === 'true',
  transportation_assistance: p['Transportation Assistance'] === 'true',
  child_friendly: p['Child Friendly'] === 'true',
  income_limit_fpl: p['Income Limit (% FPL)'] ? parseInt(p['Income Limit (% FPL)']) : null,
  household_size_min: parseInt(p['Household Size Min']) || 1,
  age_min: p['Age Min'] ? parseInt(p['Age Min']) : null,
  age_max: p['Age Max'] ? parseInt(p['Age Max']) : null,
  residency_required: p['Residency Required'],
  insurance_required: p['Insurance Required'] === 'true',
  documentation_required: p['Documentation Required'] ? p['Documentation Required'].split('; ').map(d => d.trim()) : [],
  availability_status: p['Availability Status'],
  available_slots: parseInt(p['Available Slots']) || 0,
  wait_time_days: parseInt(p['Wait Time (Days)']) || 0,
  next_available: p['Next Available'] || null
}));

const outDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'patients.json'), JSON.stringify(patientsJson, null, 2));
fs.writeFileSync(path.join(outDir, 'programs.json'), JSON.stringify(programsJson, null, 2));

console.log(`Converted ${patientsJson.length} patients and ${programsJson.length} programs.`);
