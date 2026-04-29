import React from 'react';
import { AlertTriangle, Phone, ArrowLeft, Octagon } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { plainSymptom } from '../data/plainLanguage';

export function WarningSigns() {
  const { lang } = useLanguage();
  const { patient } = usePatient();
  if (!patient) return null;

  const copy = {
    en: {
      title: 'Warning Signs',
      subtitle: 'When to get help',
      stop: 'STOP — Call 911',
      caution: 'CAUTION — Call doctor',
      call911: 'Call 911',
      callDoc: 'Call doctor',
    },
    es: {
      title: 'Señales de Alerta',
      subtitle: 'Cuándo pedir ayuda',
      stop: 'ALTO — Llame al 911',
      caution: 'CUIDADO — Llame al doctor',
      call911: 'Llamar al 911',
      callDoc: 'Llamar al doctor',
    },
  }[lang];

  const emergencies = patient.warnings.filter((w) => w.level === 'emergency');
  const warnings = patient.warnings.filter((w) => w.level === 'warning');
  const docTel = patient.pcpPhone.replace(/[^0-9+]/g, '');

  return (
    <div className="flex flex-col h-full bg-white pb-28">
      <div className="bg-white px-5 py-6 border-b-2 border-gray-100 sticky top-0 z-10 flex items-center gap-4">
        <Link to="/" className="p-2 -ml-2 rounded-full bg-gray-50 border border-gray-200">
          <ArrowLeft className="w-7 h-7 text-gray-700" strokeWidth={2.5} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900">{copy.title}</h1>
          <p className="text-base font-bold text-gray-500 mt-1">{copy.subtitle}</p>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {emergencies.length > 0 && (
          <div className="bg-red-50 p-5 rounded-3xl border-4 border-red-500 shadow-sm relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-10">
              <Octagon className="w-48 h-48 text-red-900" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black text-red-700 flex items-center gap-3 mb-5 relative z-10 uppercase tracking-wide">
              <Octagon className="w-9 h-9" fill="currentColor" />
              {copy.stop}
            </h2>
            <div className="space-y-3 relative z-10">
              {emergencies.map((w) => (
                <div key={w.id} className="bg-white border-2 border-red-200 rounded-2xl p-4 shadow-sm">
                  <h3 className="font-black text-xl text-red-900 mb-3 leading-snug">
                    {plainSymptom(w.symptom, lang)}
                  </h3>
                  <a
                    href="tel:911"
                    className="bg-red-600 text-white p-3 rounded-xl shadow-md flex items-center justify-center gap-3 w-full border-b-4 border-red-800 active:scale-95"
                  >
                    <Phone className="w-7 h-7" strokeWidth={2.5} />
                    <span className="font-black text-lg tracking-wide uppercase">{copy.call911}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="bg-yellow-50 p-5 rounded-3xl border-4 border-yellow-400 shadow-sm relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-20">
              <AlertTriangle className="w-48 h-48 text-yellow-600" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black text-yellow-800 flex items-center gap-3 mb-5 relative z-10 uppercase tracking-wide">
              <AlertTriangle className="w-9 h-9" fill="currentColor" />
              {copy.caution}
            </h2>
            <div className="space-y-3 relative z-10">
              {warnings.map((w) => (
                <div key={w.id} className="bg-white border-2 border-yellow-200 rounded-2xl p-4 shadow-sm">
                  <h3 className="font-black text-xl text-yellow-900 mb-3 leading-snug">
                    {plainSymptom(w.symptom, lang)}
                  </h3>
                  <a
                    href={`tel:${docTel}`}
                    className="bg-yellow-500 text-yellow-950 p-3 rounded-xl shadow-md flex items-center justify-center gap-3 w-full border-b-4 border-yellow-600 active:scale-95"
                  >
                    <Phone className="w-7 h-7" strokeWidth={2.5} />
                    <span className="font-black text-lg tracking-wide uppercase">
                      {copy.callDoc} · {patient.pcpPhone}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
