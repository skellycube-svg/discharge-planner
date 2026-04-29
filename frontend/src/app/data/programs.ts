import csvText from './programs.csv?raw';
import { parseCSV } from './csvParser';
import type { Program, ProgramCategory, AvailabilityStatus, Patient } from './types';

function splitList(s: string): string[] {
  return s
    .split(/\s*;\s*/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function toBool(v: string): boolean {
  return /^true$/i.test(v.trim());
}

function toNumOrNull(v: string): number | null {
  if (!v || v.trim() === '') return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function toNum(v: string, fallback = 0): number {
  const n = toNumOrNull(v);
  return n ?? fallback;
}

function rowToProgram(row: Record<string, string>): Program {
  const zips = row['Zip Codes Served'] ?? '';
  const servesAll = /all_orange_county/i.test(zips);
  return {
    id: row.ID,
    name: row.Name,
    category: (row.Category as ProgramCategory) ?? 'food',
    subcategory: row.Subcategory ?? '',
    address: row.Address ?? '',
    phone: row.Phone ?? '',
    website: row.Website ?? '',
    zipCodesServed: servesAll ? [] : splitList(zips),
    servesAllOC: servesAll,
    languages: splitList(row.Languages ?? ''),
    serviceDelivery: row['Service Delivery'] ?? '',
    cost: toNum(row.Cost),
    insurance: splitList(row['Accepted Insurance'] ?? ''),
    copay: toNum(row.Copay),
    adaAccessible: toBool(row['ADA Accessible'] ?? ''),
    transportationAssistance: toBool(row['Transportation Assistance'] ?? ''),
    childFriendly: toBool(row['Child Friendly'] ?? ''),
    ageMin: toNumOrNull(row['Age Min']),
    ageMax: toNumOrNull(row['Age Max']),
    documentationRequired: splitList(row['Documentation Required'] ?? ''),
    availabilityStatus: ((row['Availability Status'] || 'open').toLowerCase() as AvailabilityStatus),
    availableSlots: toNum(row['Available Slots']),
    waitDays: toNum(row['Wait Time (Days)']),
    nextAvailable: row['Next Available'] ?? '',
    utilization: toNum(row['Simulated Utilization (%)']),
  };
}

export const programs: Program[] = parseCSV(csvText).map(rowToProgram);

export const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  English: 'en',
  Spanish: 'es',
  Vietnamese: 'vi',
  Mandarin: 'zh',
  Cantonese: 'zh',
  Chinese: 'zh',
  Korean: 'ko',
  Tagalog: 'tl',
  Filipino: 'tl',
  Farsi: 'fa',
  Persian: 'fa',
  Arabic: 'ar',
  Armenian: 'hy',
  Khmer: 'km',
};

export function patientLanguageCode(patient: Patient): string {
  return LANGUAGE_NAME_TO_CODE[patient.preferredLanguage] ?? 'en';
}

const DIAGNOSIS_TO_SUBCATEGORIES: Record<string, string[]> = {
  'Type 1 Diabetes - New Onset': ['nutrition_support', 'infant_nutrition'],
  'Autism Spectrum Disorder - Evaluation': ['developmental_therapy', 'aba_therapy', 'autism_support', 'behavioral_health', 'early_intervention'],
  'Seizure Disorder': ['neuropsychology', 'developmental_therapy', 'family_therapy'],
  'Asthma Exacerbation': ['nutrition_support', 'rideshare_voucher', 'nemt'],
  'Acute Gastroenteritis': ['nutrition_support', 'food_pantry', 'home_delivered_meals'],
  'Allergic Reaction': ['food_pantry', 'nutrition_support'],
  'Fracture - Upper Extremity': ['physical_therapy', 'occupational_therapy', 'rideshare_voucher'],
  'Appendectomy - Post-operative': ['pain_management', 'home_delivered_meals', 'nutrition_support'],
  Pneumonia: ['nutrition_support', 'home_delivered_meals'],
  Bronchiolitis: ['infant_nutrition', 'nutrition_support', 'home_delivered_meals'],
};

export interface ProgramScore {
  program: Program;
  score: number;
  reasons: { en: string; es: string }[];
}

export function scoreProgramFor(program: Program, patient: Patient): ProgramScore {
  const reasons: { en: string; es: string }[] = [];
  let score = 0;

  const code = patientLanguageCode(patient);
  if (program.languages.includes(code)) {
    score += 4;
    if (code !== 'en') {
      reasons.push({
        en: `Speaks ${patient.preferredLanguage}`,
        es: `Habla ${patient.preferredLanguage}`,
      });
    }
  }

  const dxSubs = DIAGNOSIS_TO_SUBCATEGORIES[patient.dischargeDiagnosis] ?? [];
  if (dxSubs.includes(program.subcategory)) {
    score += 5;
    reasons.push({
      en: 'Matches your child\'s care needs',
      es: 'Coincide con las necesidades de su hijo/a',
    });
  }

  if (program.category === 'transportation' && patient.appointments.length > 0) {
    score += 2;
    if (program.subcategory === 'hospital_transport' || program.subcategory === 'nemt' || program.subcategory === 'rideshare_voucher') {
      reasons.push({
        en: 'Helps you get to follow-up visits',
        es: 'Le ayuda a llegar a las citas',
      });
    }
  }

  if (program.availabilityStatus === 'open') score += 2;
  else if (program.availabilityStatus === 'limited') score += 1;
  else score -= 2;

  if (program.cost === 0) score += 1;
  if (program.childFriendly) score += 1;
  if (program.adaAccessible) score += 0.5;

  return { program, score, reasons };
}

export function recommendedFor(patient: Patient, limit = 4): ProgramScore[] {
  return programs
    .map((p) => scoreProgramFor(p, patient))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function programsByCategory(category: ProgramCategory, patient: Patient): ProgramScore[] {
  return programs
    .filter((p) => p.category === category)
    .map((p) => scoreProgramFor(p, patient))
    .sort((a, b) => b.score - a.score);
}
