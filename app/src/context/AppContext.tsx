import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Patient, Program, Medication, Appointment, WarningSigns, ChecklistItem } from '../types';
import { parseMedications } from '../utils/parseMedications';
import { parseAppointments } from '../utils/parseAppointments';
import { categorizeWarnings } from '../utils/categorizeWarnings';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

const translations: Record<string, Record<string, string>> = { en, es };

interface AppState {
  isLoggedIn: boolean;
  patients: Patient[];
  programs: Program[];
  selectedPatient: Patient | null;
  medications: Medication[];
  appointments: Appointment[];
  warnings: WarningSigns;
  checklist: ChecklistItem[];
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  loginWithMRN: (mrn: string) => boolean;
  logout: () => void;
  selectPatient: (id: number) => void;
  toggleMedication: (id: string) => void;
  toggleChecklistItem: (id: string) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [warnings, setWarnings] = useState<WarningSigns>({ red: [], yellow: [], green: [] });
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [language, setLanguage] = useState<'en' | 'es'>(() => {
    return (localStorage.getItem('c2h_lang') as 'en' | 'es') || 'en';
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem('c2h_lang', language);
  }, [language]);

  useEffect(() => {
    Promise.all([
      fetch('/data/patients.json').then(r => r.json()),
      fetch('/data/programs.json').then(r => r.json()),
    ]).then(([p, pr]) => {
      setPatients(p);
      setPrograms(pr);
      setDataLoaded(true);

      const savedMrn = sessionStorage.getItem('c2h_mrn');
      if (savedMrn) {
        const patient = (p as Patient[]).find(pt => pt.mrn === savedMrn);
        if (patient) {
          setIsLoggedIn(true);
          selectPatientData(patient);
        }
      }
    });
  }, []);

  function loginWithMRN(mrn: string): boolean {
    if (!dataLoaded) return false;
    const patient = patients.find(p => p.mrn === mrn);
    if (!patient) return false;
    sessionStorage.setItem('c2h_mrn', mrn);
    setIsLoggedIn(true);
    selectPatientData(patient);
    return true;
  }

  function logout() {
    sessionStorage.removeItem('c2h_mrn');
    setIsLoggedIn(false);
    setSelectedPatient(null);
    setMedications([]);
    setAppointments([]);
    setWarnings({ red: [], yellow: [], green: [] });
    setChecklist([]);
  }

  function selectPatientData(patient: Patient) {
    setSelectedPatient(patient);

    const homeMeds = parseMedications(patient.home_medications, false);
    const newMeds = parseMedications(patient.new_prescriptions, true);

    const savedMeds = localStorage.getItem(`c2h_meds_${patient.patient_id}`);
    const savedTaken: Record<string, boolean> = savedMeds ? JSON.parse(savedMeds) : {};
    const allMeds = [...homeMeds, ...newMeds].map(m => ({
      ...m,
      taken: savedTaken[m.id] || false,
    }));
    setMedications(allMeds);

    setAppointments(parseAppointments(patient.appointments));
    setWarnings(categorizeWarnings(patient.seek_medical_attention_for));

    const items: ChecklistItem[] = [];
    if (patient.special_instructions) {
      patient.special_instructions.split('. ').filter(Boolean).forEach((inst, i) => {
        items.push({
          id: `inst-${i}`,
          text: inst.trim().replace(/\.$/, ''),
          completed: false,
          category: 'instruction',
        });
      });
    }
    allMeds.forEach(med => {
      items.push({
        id: `check-med-${med.id}`,
        text: `Give ${med.name} ${med.dosage} (${med.frequency || 'as directed'})`,
        completed: med.taken,
        category: 'medication',
      });
    });

    const savedChecklist = localStorage.getItem(`c2h_checklist_${patient.patient_id}`);
    const savedCompleted: Record<string, boolean> = savedChecklist ? JSON.parse(savedChecklist) : {};
    setChecklist(items.map(item => ({
      ...item,
      completed: savedCompleted[item.id] || item.completed,
    })));
  }

  function selectPatient(id: number) {
    const patient = patients.find(p => p.patient_id === id);
    if (patient) selectPatientData(patient);
  }

  function toggleMedication(id: string) {
    setMedications(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m);
      if (selectedPatient) {
        const taken: Record<string, boolean> = {};
        updated.forEach(m => { taken[m.id] = m.taken; });
        localStorage.setItem(`c2h_meds_${selectedPatient.patient_id}`, JSON.stringify(taken));
      }
      return updated;
    });
    setChecklist(prev =>
      prev.map(item =>
        item.id === `check-med-${id}`
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }

  function toggleChecklistItem(id: string) {
    setChecklist(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
      if (selectedPatient) {
        const completed: Record<string, boolean> = {};
        updated.forEach(item => { completed[item.id] = item.completed; });
        localStorage.setItem(`c2h_checklist_${selectedPatient.patient_id}`, JSON.stringify(completed));
      }
      return updated;
    });
  }

  function t(key: string): string {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  }

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      patients,
      programs,
      selectedPatient,
      medications,
      appointments,
      warnings,
      checklist,
      language,
      setLanguage,
      loginWithMRN,
      logout,
      selectPatient,
      toggleMedication,
      toggleChecklistItem,
      t,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
