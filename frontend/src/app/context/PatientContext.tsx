import React, { createContext, useContext, useEffect, useState } from 'react';
import { getPatient, patients } from '../data/discharge';
import type { Patient } from '../data/types';

interface PatientContextType {
  patient: Patient | undefined;
  selectPatient: (id: string) => void;
  clearPatient: () => void;
  allPatients: Patient[];
}

const PatientContext = createContext<PatientContextType>({
  patient: undefined,
  selectPatient: () => {},
  clearPatient: () => {},
  allPatients: [],
});

export const usePatient = () => useContext(PatientContext);

const STORAGE_KEY = 'cth.selectedPatientId';

export const PatientProvider = ({ children }: { children: React.ReactNode }) => {
  const [id, setId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, [id]);

  const value: PatientContextType = {
    patient: getPatient(id),
    selectPatient: (newId) => setId(newId),
    clearPatient: () => setId(null),
    allPatients: patients,
  };

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
};
