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
    <div className="flex flex-col h-full bg-paper-raised pb-28">
      <div className="bg-paper-raised px-5 py-6 border-b border-hairline sticky top-0 z-10 flex items-center gap-4">
        <Link to="/" className="p-2 -ml-2 rounded-full bg-paper-sunken/60 border border-hairline">
          <ArrowLeft className="w-7 h-7 text-ink-soft" strokeWidth={2.5} />
        </Link>
        <div className="flex items-center gap-2">
          <Stethoscope className="w-7 h-7 text-brand" />
          <div>
            <h1 className="text-3xl font-bold text-ink">{copy.title}</h1>
            <p className="text-base font-bold text-ink-soft mt-0.5">{copy.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-2">
          <SummaryChip
            icon={CalendarDays}
            label={copy.admitted}
            value={patient.admissionDate}
            tint="text-brand bg-brand-soft border-hairline"
          />
          <SummaryChip
            icon={CalendarDays}
            label={copy.went}
            value={patient.dischargeDate}
            tint="text-ok bg-ok-soft border-green-100"
          />
          <SummaryChip
            icon={Clock}
            label={copy.length}
            value={copy.stay(patient.lengthOfStayDays)}
            tint="text-warn bg-warn-soft border-amber-100"
          />
          <SummaryChip
            icon={Activity}
            label={copy.condition}
            value={patient.conditionOnDischarge}
            tint="text-ok bg-ok-soft border-emerald-100"
          />
        </div>

        {patient.hasAllergies ? (
          <div className="bg-danger-soft border-2 border-red-300 rounded-2xl p-4 flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-danger shrink-0" />
            <div>
              <div className="font-bold text-ink text-sm uppercase tracking-[0.1em]">
                {copy.allergyBanner}
              </div>
              <div className="font-bold text-red-900 text-xl leading-tight">
                {patient.allergies}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-ok-soft border border-ok/30 rounded-2xl p-3 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-ok shrink-0" />
            <div className="font-bold text-green-800">{copy.noAllergy}</div>
          </div>
        )}

        {patient.procedures.length > 0 && (
          <div className="bg-paper-raised border border-hairline rounded-2xl p-4">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft mb-2">
              {copy.procedures} · {copy.proceduresCount(patient.procedures.length)}
            </div>
            <ul className="space-y-1.5">
              {patient.procedures.map((proc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-bold text-ink">
                  <Sparkles className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                  {proc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {patient.educationalForms.length > 0 && (
          <div className="bg-paper-raised border border-hairline rounded-2xl p-4">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft mb-2">
              {copy.forms}
            </div>
            <ul className="space-y-1.5">
              {patient.educationalForms.map((form, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-bold text-ink">
                  <ListChecks className="w-4 h-4 text-accent-warm shrink-0 mt-0.5" />
                  {form}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-paper-raised border border-hairline rounded-2xl p-4">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft mb-1">
            {copy.pcp}
          </div>
          <div className="font-bold text-ink text-base leading-tight">{patient.pcp}</div>
          <div className="text-sm font-bold text-ink-soft mt-0.5">{patient.pcpPhone}</div>
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
        <span className="text-xs font-bold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <div className="font-bold text-base leading-tight">{value}</div>
    </div>
  );
}
