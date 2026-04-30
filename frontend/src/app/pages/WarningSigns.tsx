import React from 'react';
import { ArrowLeft, CalendarDays, Clock, Activity, ShieldAlert, Sparkles, ListChecks, Stethoscope } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';

export function WarningSigns() {
  const { lang } = useLanguage();
  const { patient } = usePatient();
  if (!patient) return null;

  const copy = {
    en: {
      title: 'Summary',
      subtitle: 'Visit, allergies, procedures',
      admitted: 'Admitted',
      went: 'Home',
      length: 'Length',
      stay: (n: number) => (n === 1 ? '1 day stay' : `${n} day stay`),
      condition: 'Condition',
      allergyBanner: 'Allergy alert',
      noAllergy: 'No known allergies',
      procedures: 'What was done in the hospital',
      proceduresCount: (n: number) => (n === 1 ? '1 procedure' : `${n} procedures`),
      forms: 'Information sheets given to you',
      pcp: 'Primary care doctor',
    },
    es: {
      title: 'Resumen',
      subtitle: 'Visita, alergias, procedimientos',
      admitted: 'Ingreso',
      went: 'Alta',
      length: 'Duración',
      stay: (n: number) => (n === 1 ? '1 día de estancia' : `${n} días de estancia`),
      condition: 'Estado',
      allergyBanner: 'Alerta de alergia',
      noAllergy: 'Sin alergias conocidas',
      procedures: 'Lo que se hizo en el hospital',
      proceduresCount: (n: number) => (n === 1 ? '1 procedimiento' : `${n} procedimientos`),
      forms: 'Hojas de información que le dieron',
      pcp: 'Médico de cabecera',
    },
  }[lang];

  return (
    <div className="flex flex-col h-full bg-white pb-28">
      <div className="bg-white px-5 py-6 border-b-2 border-gray-100 sticky top-0 z-10 flex items-center gap-4">
        <Link to="/" className="p-2 -ml-2 rounded-full bg-gray-50 border border-gray-200">
          <ArrowLeft className="w-7 h-7 text-gray-700" strokeWidth={2.5} />
        </Link>
        <div className="flex items-center gap-2">
          <Stethoscope className="w-7 h-7 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-black text-gray-900">{copy.title}</h1>
            <p className="text-base font-bold text-gray-500 mt-0.5">{copy.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-2">
          <SummaryChip
            icon={CalendarDays}
            label={copy.admitted}
            value={patient.admissionDate}
            tint="text-indigo-600 bg-indigo-50 border-indigo-100"
          />
          <SummaryChip
            icon={CalendarDays}
            label={copy.went}
            value={patient.dischargeDate}
            tint="text-green-700 bg-green-50 border-green-100"
          />
          <SummaryChip
            icon={Clock}
            label={copy.length}
            value={copy.stay(patient.lengthOfStayDays)}
            tint="text-amber-700 bg-amber-50 border-amber-100"
          />
          <SummaryChip
            icon={Activity}
            label={copy.condition}
            value={patient.conditionOnDischarge}
            tint="text-emerald-700 bg-emerald-50 border-emerald-100"
          />
        </div>

        {patient.hasAllergies ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
            <div>
              <div className="font-black text-red-800 text-sm uppercase tracking-wider">
                {copy.allergyBanner}
              </div>
              <div className="font-black text-red-900 text-xl leading-tight">
                {patient.allergies}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-green-600 shrink-0" />
            <div className="font-bold text-green-800">{copy.noAllergy}</div>
          </div>
        )}

        {patient.procedures.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-4">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              {copy.procedures} · {copy.proceduresCount(patient.procedures.length)}
            </div>
            <ul className="space-y-1.5">
              {patient.procedures.map((proc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-800">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  {proc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {patient.educationalForms.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-4">
            <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
              {copy.forms}
            </div>
            <ul className="space-y-1.5">
              {patient.educationalForms.map((form, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-800">
                  <ListChecks className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  {form}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white border-2 border-gray-200 rounded-3xl p-4">
          <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">
            {copy.pcp}
          </div>
          <div className="font-black text-gray-900 text-base leading-tight">{patient.pcp}</div>
          <div className="text-sm font-bold text-gray-500 mt-0.5">{patient.pcpPhone}</div>
        </div>
      </div>
    </div>
  );
}

function SummaryChip({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className={`rounded-2xl border-2 p-3 ${tint}`}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="font-black text-base leading-tight">{value}</div>
    </div>
  );
}
