import React from 'react';
import { Pill, Utensils, Droplets, AlertCircle, Wind, Hand, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import type { Medication } from '../data/types';

const bgByColor: Record<string, string> = {
  orange: 'bg-orange-50 border-orange-200',
  blue: 'bg-blue-50 border-blue-200',
  indigo: 'bg-indigo-50 border-indigo-200',
  green: 'bg-green-50 border-green-200',
  red: 'bg-red-50 border-red-200',
};
const pillByColor: Record<string, string> = {
  orange: 'text-orange-500',
  blue: 'text-blue-500',
  indigo: 'text-indigo-500',
  green: 'text-green-600',
  red: 'text-red-500',
};

function IconForMed({ med }: { med: Medication }) {
  const cls = 'w-6 h-6 text-orange-600';
  if (med.iconType === 'food') return <Utensils className={cls} />;
  if (med.iconType === 'water') return <Droplets className="w-6 h-6 text-blue-600" />;
  if (med.iconType === 'inhaler') return <Wind className="w-6 h-6 text-cyan-600" />;
  if (med.iconType === 'topical') return <Hand className="w-6 h-6 text-pink-600" />;
  return <Pill className="w-6 h-6 text-gray-600" />;
}

const timeOfDayLabel: Record<string, { en: string; es: string }> = {
  morning: { en: 'Morning', es: 'Mañana' },
  afternoon: { en: 'Afternoon', es: 'Tarde' },
  evening: { en: 'Evening', es: 'Noche' },
  asNeeded: { en: 'As Needed', es: 'Cuando se necesite' },
};

export function Medications() {
  const { lang, t } = useLanguage();
  const { patient } = usePatient();
  if (!patient) return null;

  const copy = {
    en: { title: 'Medicines', subtitle: 'What to give and when', new: 'New prescription', home: 'Take at home' },
    es: { title: 'Medicinas', subtitle: 'Qué dar y cuándo', new: 'Receta nueva', home: 'Tomar en casa' },
  }[lang];

  return (
    <div className="flex flex-col h-full bg-white pb-28">
      <div className="bg-white px-5 py-6 border-b-2 border-gray-100 sticky top-0 z-10">
        <h1 className="text-3xl font-black text-gray-900">{copy.title}</h1>
        <p className="text-lg font-bold text-gray-500 mt-1">{copy.subtitle}</p>
      </div>

      <div className="p-5 space-y-5">
        {patient.medications.length === 0 && (
          <div className="text-center text-gray-500 font-bold py-12">No medications listed.</div>
        )}
        {patient.medications.map((med) => (
          <div key={med.id} className={`rounded-3xl p-6 border-2 ${bgByColor[med.color] ?? 'bg-gray-50'} shadow-sm`}>
            <div className="flex justify-between items-center mb-3">
              <span className="bg-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-gray-800 shadow-sm border border-gray-100">
                {timeOfDayLabel[med.timeOfDay][lang]}
              </span>
              {med.isPrescription && (
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {copy.new}
                </span>
              )}
            </div>

            <h3 className="font-black text-2xl text-gray-900 leading-tight">{med.plainName}</h3>
            <p className="text-sm font-bold text-gray-500 mt-1 mb-4">{med.rawName}</p>

            <div className="flex items-center gap-4 bg-white/70 p-4 rounded-2xl mb-3">
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: Math.max(1, med.amount) }).map((_, i) => (
                  <Pill key={i} className={`w-8 h-8 ${pillByColor[med.color] ?? 'text-gray-500'}`} fill="currentColor" />
                ))}
              </div>
              <span className="font-black text-lg text-gray-800">= {med.amount}</span>
            </div>

            {med.dose && (
              <div className="bg-white p-3 rounded-xl border border-gray-100 font-bold text-gray-800 text-base mb-2">
                {med.dose}
              </div>
            )}

            <div className="flex items-start gap-3 text-gray-800 bg-white p-3 rounded-xl border border-gray-100">
              <IconForMed med={med} />
              <span className="font-bold text-base leading-snug">{med.notePlain}</span>
            </div>

            {med.frequency && (
              <div className="flex items-start gap-3 text-red-800 bg-red-50 p-3 rounded-xl border border-red-200 mt-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span className="font-bold text-base leading-snug">{med.frequency}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
