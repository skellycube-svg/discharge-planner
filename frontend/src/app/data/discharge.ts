import csvText from './discharge.csv?raw';
import { parseCSV } from './csvParser';
import type { Patient, Medication, Appointment, WarningItem, TodoItem, TodoCategory } from './types';
import { plainDiagnosis, plainWhatHappened, plainSymptom, classifyWarning } from './plainLanguage';

const DEFAULT_PCP_PHONE = '(555) 123-4567';

function splitMulti(s: string, sep: RegExp = /\s*[|;]\s*/): string[] {
  return s
    .split(sep)
    .map((x) => x.trim())
    .filter(Boolean);
}

function inferIcon(raw: string): Medication['iconType'] {
  const s = raw.toLowerCase();
  if (s.includes('cream') || s.includes('topical') || s.includes('ointment')) return 'topical';
  if (s.includes('inhaler') || s.includes('hfa') || s.includes('puff')) return 'inhaler';
  if (s.includes('with food') || s.includes('before breakfast')) return 'food';
  if (s.includes('suspension') || s.includes('solution') || s.includes('drops') || s.includes('syrup')) return 'water';
  return 'pill';
}

function inferTimeOfDay(raw: string): Medication['timeOfDay'] {
  const s = raw.toLowerCase();
  if (s.includes('bedtime') || s.includes('evening') || s.includes('night')) return 'evening';
  if (s.includes('breakfast') || s.includes('morning')) return 'morning';
  if (s.includes('prn') || s.includes('as needed') || s.includes('when indicated')) return 'asNeeded';
  if (s.includes('twice daily') || s.includes('bid')) return 'morning';
  if (s.includes('three times') || s.includes('tid')) return 'morning';
  return 'morning';
}

function inferAmount(raw: string): number {
  const m = raw.match(/(\d+)\s*(puff|pill|tablet|application)/i);
  if (m) return parseInt(m[1], 10);
  return 1;
}

function inferColor(idx: number): Medication['color'] {
  const palette: Medication['color'][] = ['orange', 'blue', 'indigo', 'green', 'red'];
  return palette[idx % palette.length];
}

function buildPlainMedNote(raw: string): string {
  const s = raw.toLowerCase();
  const notes: string[] = [];
  if (s.includes('with food')) notes.push('Take with food.');
  if (s.includes('drowsy') || s.includes('sleepy')) notes.push('Makes you sleepy.');
  if (s.includes('every 4-6 hours')) notes.push('Every 4 to 6 hours when needed.');
  if (s.includes('every 6-8 hours')) notes.push('Every 6 to 8 hours when needed.');
  if (s.includes('every 6 hours')) notes.push('Every 6 hours.');
  if (s.includes('every 8 hours')) notes.push('Every 8 hours.');
  if (s.includes('twice daily')) notes.push('Two times a day.');
  if (s.includes('three times daily')) notes.push('Three times a day.');
  if (s.includes('once daily')) notes.push('One time a day.');
  if (s.includes('topical')) notes.push('Put on the skin.');
  if (s.includes('inhalation') || s.includes('puff')) notes.push('Breathe in through the inhaler.');
  if (s.includes('subcutaneous')) notes.push('Inject under the skin.');
  if (s.includes('rectum')) notes.push('Use only for a long seizure.');
  if (s.includes('prn')) notes.push('Only when needed.');
  return notes.length ? notes.join(' ') : 'Follow the doctor\'s directions.';
}

function parseMedications(homeMeds: string, newRx: string): Medication[] {
  const list: Medication[] = [];
  const seen = new Set<string>();

  const push = (raw: string, isPrescription: boolean) => {
    const trimmed = raw.trim();
    if (!trimmed || /no new prescription|none|n\/a/i.test(trimmed)) return;
    if (seen.has(trimmed)) return;
    seen.add(trimmed);

    const nameMatch = trimmed.match(/^([^(]+)/);
    const rawName = (nameMatch ? nameMatch[1] : trimmed).trim();
    const plainName = simplifyMedName(rawName);
    const detailMatch = trimmed.match(/\(([^)]*)\)/);
    const detail = detailMatch ? detailMatch[1] : '';

    list.push({
      id: `${list.length + 1}-${rawName.slice(0, 12)}`,
      rawName,
      plainName,
      dose: detail.split(',')[0]?.trim() ?? '',
      route: detail.split(',')[1]?.trim() ?? '',
      frequency: detail.split(',').slice(2).join(',').trim(),
      isPrescription,
      iconType: inferIcon(trimmed),
      timeOfDay: inferTimeOfDay(trimmed),
      amount: inferAmount(trimmed),
      color: inferColor(list.length),
      notePlain: buildPlainMedNote(trimmed),
    });
  };

  splitMulti(homeMeds, /\s*\|\s*/).forEach((m) => push(m, false));
  splitMulti(newRx, /\s*\|\s*/).forEach((m) => push(m, true));
  return list;
}

function simplifyMedName(name: string): string {
  const map: Record<string, string> = {
    Acetaminophen: 'Pain & fever medicine (Tylenol)',
    Ibuprofen: 'Pain & swelling medicine (Motrin)',
    Amoxicillin: 'Antibiotic',
    Azithromycin: 'Antibiotic',
    Prednisolone: 'Steroid medicine',
    Ondansetron: 'Anti-nausea medicine',
    Diphenhydramine: 'Allergy medicine (Benadryl)',
    Cetirizine: 'Allergy medicine',
    'Albuterol HFA': 'Rescue inhaler',
    Fluticasone: 'Daily inhaler',
    'Insulin glargine': 'Long-acting insulin',
    'Insulin lispro': 'Mealtime insulin',
    EpiPen: 'Allergy emergency shot',
    Diastat: 'Seizure rescue medicine',
    Omeprazole: 'Acid reducer',
    'Polyethylene glycol': 'Stool softener',
    hydrocortisone: 'Skin cream for itching',
    'Children\'s Multivitamin': 'Daily vitamin',
    'Vitamin D3': 'Vitamin D drops',
  };
  for (const key of Object.keys(map)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return map[key];
  }
  return name;
}

function parseAppointments(raw: string): Appointment[] {
  if (!raw || /no scheduled/i.test(raw)) return [];
  return raw.split('|').map((chunk, idx) => {
    const text = chunk.trim();
    const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{4})\s+(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
    const dateISO = dateMatch ? toISO(dateMatch[1], dateMatch[2]) : '';
    const afterDate = dateMatch ? text.slice(dateMatch[0].length).replace(/^[\s-]*/, '') : text;
    const withMatch = afterDate.match(/^(.*?)\s+with\s+(.*?)\s+at\s+(.*)$/i);
    return {
      id: `apt-${idx}`,
      rawText: text,
      dateISO,
      specialty: (withMatch?.[1] ?? afterDate).trim(),
      doctor: (withMatch?.[2] ?? '').trim(),
      location: (withMatch?.[3] ?? '').trim(),
    };
  });
}

function toISO(mmddyyyy: string, time: string): string {
  const [mm, dd, yyyy] = mmddyyyy.split('/');
  const [hhmm, ampm] = time.trim().split(/\s+/);
  let [hh, mn] = hhmm.split(':').map((n) => parseInt(n, 10));
  if (/pm/i.test(ampm) && hh !== 12) hh += 12;
  if (/am/i.test(ampm) && hh === 12) hh = 0;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${yyyy}-${pad(parseInt(mm, 10))}-${pad(parseInt(dd, 10))}T${pad(hh)}:${pad(mn)}:00`;
}

function parseWarnings(raw: string): WarningItem[] {
  return splitMulti(raw, /,(?![^()]*\))/).map((s, idx) => {
    const symptom = s.trim();
    return {
      id: `w-${idx}`,
      level: classifyWarning(symptom),
      symptom,
      symptomPlain: plainSymptom(symptom, 'en'),
    };
  });
}

interface InstructionRule {
  match: RegExp;
  category: TodoCategory;
  en: string;
  es: string;
}

const INSTRUCTION_RULES: InstructionRule[] = [
  { match: /follow up with pediatrician/i, category: 'followup', en: 'Call your pediatrician for a check-up visit', es: 'Llame al pediatra para una visita de control' },
  { match: /follow up.*(orthopedics|orthopedic)/i, category: 'followup', en: 'Go to the bone doctor (orthopedics) follow-up visit', es: 'Vaya a la cita con el doctor de los huesos (ortopedia)' },
  { match: /follow up.*(allergy specialist)/i, category: 'followup', en: 'Go to the allergy specialist follow-up visit', es: 'Vaya a la cita con el especialista de alergias' },
  { match: /follow up.*(endocrinology|endocrinologist)/i, category: 'followup', en: 'Go to the diabetes doctor (endocrinology) visit', es: 'Vaya a la cita con el doctor de diabetes (endocrinología)' },
  { match: /follow up.*(pulmonology|pulmonologist)/i, category: 'followup', en: 'Go to the lung doctor (pulmonology) visit', es: 'Vaya a la cita con el doctor de los pulmones (pulmonología)' },
  { match: /follow up.*(surgery)/i, category: 'followup', en: 'Go to the surgery follow-up visit', es: 'Vaya a la cita de seguimiento de la cirugía' },
  { match: /follow up.*(developmental specialists?)/i, category: 'followup', en: 'Go to the developmental specialist visits', es: 'Vaya a las citas con los especialistas en desarrollo' },
  { match: /follow up.*(subspecialists)/i, category: 'followup', en: 'Go to the specialist follow-up visits', es: 'Vaya a las citas con los especialistas' },
  { match: /chest x.?ray.*4-?6\s*weeks/i, category: 'followup', en: 'Get a chest X-ray in 4 to 6 weeks if your doctor asks for one', es: 'Hágase una radiografía del pecho en 4 a 6 semanas si el doctor lo pide' },
  { match: /complete (full )?course of antibiotics/i, category: 'medication', en: 'Finish all the antibiotic medicine, even if your child feels better', es: 'Termine todo el antibiótico, aunque su hijo/a se sienta mejor' },
  { match: /use rescue inhaler/i, category: 'medication', en: 'Use the rescue inhaler exactly as the doctor said', es: 'Use el inhalador de rescate exactamente como dijo el doctor' },
  { match: /monitor blood sugar/i, category: 'care', en: 'Check the blood sugar like the doctor showed you', es: 'Revise el azúcar en la sangre como le mostró el doctor' },
  { match: /carry epipen/i, category: 'safety', en: 'Carry the EpiPen with you at all times', es: 'Lleve el EpiPen con usted en todo momento' },
  { match: /avoid known allergens/i, category: 'safety', en: 'Stay away from foods or things your child is allergic to', es: 'Evite los alimentos o cosas a las que su hijo/a es alérgico/a' },
  { match: /no heavy lifting/i, category: 'care', en: 'No heavy lifting for 2 weeks', es: 'No cargue cosas pesadas por 2 semanas' },
  { match: /keep incision sites clean/i, category: 'care', en: 'Keep the surgery cuts clean and dry', es: 'Mantenga las heridas de la cirugía limpias y secas' },
  { match: /keep cast.*dry/i, category: 'care', en: 'Keep the cast or splint dry', es: 'Mantenga el yeso o la férula seco' },
  { match: /elevate extremity/i, category: 'care', en: 'Lift the arm or leg up to help the swelling go down', es: 'Levante el brazo o la pierna para que baje la hinchazón' },
  { match: /encourage oral rehydration/i, category: 'care', en: 'Give your child small sips of fluids often', es: 'Déle a su hijo/a tragos pequeños de líquidos seguido' },
  { match: /brat diet/i, category: 'care', en: 'Try the BRAT diet (bananas, rice, applesauce, toast)', es: 'Pruebe la dieta BRAT (plátano, arroz, puré de manzana, pan tostado)' },
  { match: /bulb suction.*saline/i, category: 'care', en: 'Use saline drops and bulb suction for a stuffy nose', es: 'Use gotas salinas y la perilla para limpiar la nariz' },
  { match: /small frequent feedings/i, category: 'care', en: 'Feed in small amounts more often', es: 'Dé de comer en cantidades pequeñas más seguido' },
  { match: /cool mist humidifier/i, category: 'care', en: 'Use a cool-mist humidifier in the room', es: 'Use un humidificador de aire frío en el cuarto' },
  { match: /continue therapy services/i, category: 'followup', en: 'Keep going to therapy as the team told you', es: 'Siga yendo a las terapias como le dijeron' },
];

function parseTodos(specialInstructions: string, meds: Medication[]): TodoItem[] {
  const todos: TodoItem[] = [];
  const seen = new Set<string>();

  const sentences = specialInstructions
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const sentence of sentences) {
    const rule = INSTRUCTION_RULES.find((r) => r.match.test(sentence));
    if (rule && !seen.has(rule.en)) {
      seen.add(rule.en);
      todos.push({
        id: `todo-${todos.length}-${rule.category}`,
        category: rule.category,
        textEn: rule.en,
        textEs: rule.es,
      });
    } else if (!rule) {
      const cleaned = sentence.replace(/\.$/, '').trim();
      if (cleaned.length > 6 && !seen.has(cleaned)) {
        seen.add(cleaned);
        todos.push({
          id: `todo-${todos.length}-care`,
          category: 'care',
          textEn: cleaned,
          textEs: cleaned,
        });
      }
    }
  }

  meds.filter((m) => m.isPrescription).forEach((m) => {
    const key = `pickup-${m.rawName}`;
    if (seen.has(key)) return;
    seen.add(key);
    todos.push({
      id: `todo-${todos.length}-medication`,
      category: 'medication',
      textEn: `Pick up the new prescription: ${m.plainName}`,
      textEs: `Recoger la receta nueva: ${m.plainName}`,
    });
  });

  return todos;
}

function daysBetween(a: string, b: string): number {
  const parse = (s: string) => {
    const [mm, dd, yyyy] = s.split('/').map((n) => parseInt(n, 10));
    return new Date(yyyy, mm - 1, dd).getTime();
  };
  if (!a || !b) return 0;
  const ms = parse(b) - parse(a);
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function rowToPatient(row: Record<string, string>): Patient {
  const dx = row.discharge_diagnosis || row.admitting_diagnosis;
  const allergies = row.allergies || 'NKA';
  const meds = parseMedications(row.home_medications || '', row.new_prescriptions || '');
  const todos = parseTodos(row.special_instructions || '', meds);
  const los = daysBetween(row.admission_date || '', row.discharge_date || '');
  return {
    id: row.patient_id,
    name: row.patient_name,
    mrn: row.mrn,
    weightKg: parseFloat(row.weight_kg) || 0,
    preferredLanguage: row.preferred_language,
    allergies,
    hasAllergies: !/^NKA$/i.test(allergies),
    admissionDate: row.admission_date,
    dischargeDate: row.discharge_date,
    admittingDiagnosis: row.admitting_diagnosis,
    dischargeDiagnosis: dx,
    diagnosisPlain: plainDiagnosis(dx, 'en'),
    whatHappenedPlain: plainWhatHappened(dx, 'en'),
    conditionOnDischarge: row.condition_on_discharge,
    pcp: row.primary_care_physician,
    pcpPhone: DEFAULT_PCP_PHONE,
    consultingPhysicians: row.consulting_physicians,
    dischargeAuthenticatedBy: row.discharge_authenticated_by,
    diet: row.diet,
    specialInstructions: row.special_instructions,
    procedures: splitMulti(row.procedures || '', /;/),
    educationalForms: splitMulti(row.educational_forms_given || '', /;/),
    medications: meds,
    warnings: parseWarnings(row.seek_medical_attention_for || ''),
    appointments: parseAppointments(row.appointments || ''),
    todos,
    lengthOfStayDays: los,
  };
}

const rows = parseCSV(csvText);
export const patients: Patient[] = rows.map(rowToPatient);

export function getPatient(id: string | null | undefined): Patient | undefined {
  if (!id) return undefined;
  return patients.find((p) => p.id === id);
}
