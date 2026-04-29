export type WarningLevel = 'emergency' | 'warning';

export type TodoCategory = 'followup' | 'medication' | 'safety' | 'care';

export interface TodoItem {
  id: string;
  category: TodoCategory;
  textEn: string;
  textEs: string;
}

export interface Medication {
  id: string;
  rawName: string;
  plainName: string;
  dose: string;
  route: string;
  frequency: string;
  isPrescription: boolean;
  iconType: 'food' | 'water' | 'topical' | 'inhaler' | 'pill';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'asNeeded';
  amount: number;
  color: 'orange' | 'blue' | 'indigo' | 'green' | 'red';
  notePlain: string;
}

export interface Appointment {
  id: string;
  rawText: string;
  dateISO: string;
  specialty: string;
  doctor: string;
  location: string;
}

export interface WarningItem {
  id: string;
  level: WarningLevel;
  symptom: string;
  symptomPlain: string;
}

export type ProgramCategory = 'food' | 'transportation' | 'therapy' | 'housing';
export type AvailabilityStatus = 'open' | 'limited' | 'full';

export interface Program {
  id: string;
  name: string;
  category: ProgramCategory;
  subcategory: string;
  address: string;
  phone: string;
  website: string;
  zipCodesServed: string[];
  servesAllOC: boolean;
  languages: string[];
  serviceDelivery: string;
  cost: number;
  insurance: string[];
  copay: number;
  adaAccessible: boolean;
  transportationAssistance: boolean;
  childFriendly: boolean;
  ageMin: number | null;
  ageMax: number | null;
  documentationRequired: string[];
  availabilityStatus: AvailabilityStatus;
  availableSlots: number;
  waitDays: number;
  nextAvailable: string;
  utilization: number;
}

export interface Patient {
  id: string;
  name: string;
  mrn: string;
  weightKg: number;
  preferredLanguage: string;
  allergies: string;
  hasAllergies: boolean;
  admissionDate: string;
  dischargeDate: string;
  admittingDiagnosis: string;
  dischargeDiagnosis: string;
  diagnosisPlain: string;
  whatHappenedPlain: string;
  conditionOnDischarge: string;
  pcp: string;
  pcpPhone: string;
  consultingPhysicians: string;
  dischargeAuthenticatedBy: string;
  diet: string;
  specialInstructions: string;
  procedures: string[];
  educationalForms: string[];
  medications: Medication[];
  warnings: WarningItem[];
  appointments: Appointment[];
  todos: TodoItem[];
  lengthOfStayDays: number;
}
