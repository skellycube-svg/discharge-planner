export interface Patient {
  patient_id: number;
  patient_name: string;
  mrn: string;
  weight_kg: number;
  preferred_language: string;
  allergies: string;
  admission_date: string;
  discharge_date: string;
  admitting_diagnosis: string;
  discharge_diagnosis: string;
  condition_on_discharge: string;
  primary_care_physician: string;
  consulting_physicians: string;
  discharge_authenticated_by: string;
  diet: string;
  seek_medical_attention_for: string;
  special_instructions: string;
  procedures: string;
  educational_forms_given: string;
  home_medications: string;
  new_prescriptions: string;
  appointments: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  form: string;
  instructions: string;
  route: string;
  frequency: string;
  is_prn: boolean;
  prn_condition?: string;
  is_new: boolean;
  taken: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  description: string;
  provider: string;
  location: string;
  is_past: boolean;
}

export interface WarningItem {
  symptom: string;
  action: string;
  severity: 'red' | 'yellow' | 'green';
}

export interface WarningSigns {
  red: WarningItem[];
  yellow: WarningItem[];
  green: WarningItem[];
}

export interface Program {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  address: string;
  phone: string;
  website: string;
  zip_codes_served: string;
  languages: string[];
  hours: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  service_delivery: string;
  cost: number;
  accepted_insurance: string[];
  copay: number;
  ada_accessible: boolean;
  transportation_assistance: boolean;
  child_friendly: boolean;
  income_limit_fpl: number | null;
  household_size_min: number;
  age_min: number | null;
  age_max: number | null;
  residency_required: string;
  insurance_required: boolean;
  documentation_required: string[];
  availability_status: string;
  available_slots: number;
  wait_time_days: number;
  next_available: string | null;
}

export interface ScreeningResult {
  needs_food: boolean;
  needs_transportation: boolean;
  needs_therapy: boolean;
  needs_housing: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'medication' | 'appointment' | 'instruction' | 'general';
}
