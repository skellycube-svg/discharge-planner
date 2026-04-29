import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Pill,
  Calendar,
  AlertTriangle,
  HeartHandshake,
  Phone,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Circle,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  CalendarDays,
  Clock,
  Sparkles,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { plainDiagnosis, plainWhatHappened } from '../data/plainLanguage';
import type { TodoCategory } from '../data/types';

const CATEGORY_ICON: Record<TodoCategory, typeof Heart> = {
  followup: CalendarDays,
  medication: Pill,
  safety: ShieldCheck,
  care: Heart,
};

const CATEGORY_TINT: Record<TodoCategory, string> = {
  followup: 'text-purple-600',
  medication: 'text-blue-600',
  safety: 'text-red-600',
  care: 'text-green-600',
};

export function Dashboard() {
  const { lang } = useLanguage();
  const { patient } = usePatient();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [showStay, setShowStay] = useState(false);

  const storageKey = patient ? `cth.todos.${patient.id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      setDone(raw ? JSON.parse(raw) : {});
    } catch {
      setDone({});
    }
  }, [storageKey]);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const copy = {
    en: {
      caringFor: 'Caring for',
      whatHappened: 'What happened',
      visitSummary: 'Visit summary',
      admitted: 'Admitted',
      went: 'Home',
      stay: (n: number) => (n === 1 ? '1 day stay' : `${n} day stay`),
      condition: 'Condition',
      proceduresCount: (n: number) => (n === 1 ? '1 procedure' : `${n} procedures`),
      allergyBanner: 'Allergy alert',
      noAllergy: 'No known allergies',
      todoTitle: 'What to do',
      todoSub: (done: number, total: number) => `${done} of ${total} done`,
      todoEmpty: 'No special instructions for this visit.',
      callDoctor: 'Call the doctor',
      sections: 'Discharge Plan',
      meds: 'Medicines',
      medsSub: (n: number) => `${n} to give`,
      appts: 'Appointments',
      apptsSub: (n: number) => `${n} upcoming`,
      warnings: 'Warning Signs',
      warningsSub: 'When to call for help',
      resources: 'Help & Services',
      resourcesSub: 'Rides, food & more',
      aboutStay: 'About this stay',
      procedures: 'What was done in the hospital',
      forms: 'Information sheets given to you',
    },
    es: {
      caringFor: 'Cuidando a',
      whatHappened: 'Qué pasó',
      visitSummary: 'Resumen de la visita',
      admitted: 'Ingreso',
      went: 'Alta',
      stay: (n: number) => (n === 1 ? '1 día de estancia' : `${n} días de estancia`),
      condition: 'Estado',
      proceduresCount: (n: number) => (n === 1 ? '1 procedimiento' : `${n} procedimientos`),
      allergyBanner: 'Alerta de alergia',
      noAllergy: 'Sin alergias conocidas',
      todoTitle: 'Qué debes hacer',
      todoSub: (done: number, total: number) => `${done} de ${total} hechos`,
      todoEmpty: 'No hay instrucciones especiales para esta visita.',
      callDoctor: 'Llamar al doctor',
      sections: 'Plan de Alta',
      meds: 'Medicinas',
      medsSub: (n: number) => `${n} para dar`,
      appts: 'Citas',
      apptsSub: (n: number) => `${n} próximas`,
      warnings: 'Señales de Alerta',
      warningsSub: 'Cuándo pedir ayuda',
      resources: 'Ayuda y Servicios',
      resourcesSub: 'Transporte, comida y más',
      aboutStay: 'Sobre esta estancia',
      procedures: 'Lo que se hizo en el hospital',
      forms: 'Hojas de información que le dieron',
    },
  }[lang];

  if (!patient) return null;

  const totalTodos = patient.todos.length;
  const doneCount = patient.todos.filter((t) => done[t.id]).length;
  const progressPct = totalTodos === 0 ? 0 : Math.round((doneCount / totalTodos) * 100);

  const sections = [
    { to: '/medications', icon: Pill, title: copy.meds, sub: copy.medsSub(patient.medications.length), color: 'bg-blue-500', border: 'border-blue-700' },
    { to: '/appointments', icon: Calendar, title: copy.appts, sub: copy.apptsSub(patient.appointments.length), color: 'bg-purple-500', border: 'border-purple-700' },
    { to: '/warnings', icon: AlertTriangle, title: copy.warnings, sub: copy.warningsSub, color: 'bg-red-500', border: 'border-red-700' },
    { to: '/resources', icon: HeartHandshake, title: copy.resources, sub: copy.resourcesSub, color: 'bg-green-600', border: 'border-green-800' },
  ];

  return (
    <div className="flex flex-col gap-5 pb-28 px-5 pt-5">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg">
        <div className="text-indigo-200 font-bold text-sm uppercase tracking-widest mb-1">
          {copy.caringFor}
        </div>
        <h1 className="font-black text-3xl leading-tight mb-3">{patient.name}</h1>

        <div className="bg-white/15 rounded-2xl p-4">
          <div className="text-indigo-100 font-bold text-xs uppercase tracking-wider mb-1">
            {copy.whatHappened}
          </div>
          <div className="font-black text-xl leading-snug">
            {plainDiagnosis(patient.dischargeDiagnosis, lang)}
          </div>
          <p className="text-indigo-50 font-medium text-base mt-2 leading-snug">
            {plainWhatHappened(patient.dischargeDiagnosis, lang)}
          </p>
        </div>
      </div>

      {/* Visit Summary chips */}
      <div>
        <h2 className="font-black text-sm uppercase tracking-widest text-gray-500 mb-2 px-1">
          {copy.visitSummary}
        </h2>
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
            label="Length"
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
      </div>

      {/* Allergy banner */}
      {patient.hasAllergies ? (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
          <div>
            <div className="font-black text-red-800 text-sm uppercase tracking-wider">{copy.allergyBanner}</div>
            <div className="font-black text-red-900 text-xl leading-tight">{patient.allergies}</div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3 flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-green-600 shrink-0" />
          <div className="font-bold text-green-800">{copy.noAllergy}</div>
        </div>
      )}

      {/* TO-DO checklist */}
      {totalTodos > 0 ? (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-indigo-700" strokeWidth={2.5} />
              <h2 className="font-black text-xl text-gray-900">{copy.todoTitle}</h2>
            </div>
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              {copy.todoSub(doneCount, totalTodos)}
            </span>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <ul className="space-y-2">
            {patient.todos.map((t) => {
              const isDone = !!done[t.id];
              const Icon = CATEGORY_ICON[t.category];
              return (
                <li key={t.id}>
                  <button
                    onClick={() => toggle(t.id)}
                    className={`w-full text-left rounded-2xl p-3 flex items-start gap-3 border-2 transition-colors active:scale-[0.99] ${
                      isDone
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-7 h-7 text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                    ) : (
                      <Circle className="w-7 h-7 text-gray-300 shrink-0 mt-0.5" strokeWidth={2.5} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Icon className={`w-4 h-4 ${CATEGORY_TINT[t.category]}`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${CATEGORY_TINT[t.category]}`}>
                          {t.category}
                        </span>
                      </div>
                      <div className={`font-bold text-base leading-snug ${isDone ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                        {lang === 'es' ? t.textEs : t.textEn}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* Call doctor quick action */}
      <a
        href={`tel:${patient.pcpPhone.replace(/[^0-9+]/g, '')}`}
        className="bg-white border-2 border-indigo-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-transform"
      >
        <div className="bg-indigo-100 p-3 rounded-2xl">
          <Phone className="w-7 h-7 text-indigo-700" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <div className="font-black text-gray-900 text-lg leading-tight">{copy.callDoctor}</div>
          <div className="font-bold text-gray-500 text-sm">{patient.pcp} · {patient.pcpPhone}</div>
        </div>
      </a>

      {/* Section grid */}
      <div>
        <h2 className="font-black text-xl text-gray-900 mb-3 px-1">{copy.sections}</h2>
        <div className="grid grid-cols-2 gap-3">
          {sections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className={`${s.color} ${s.border} border-b-4 rounded-2xl p-5 flex flex-col gap-3 shadow-md active:scale-95 transition-transform aspect-square justify-between`}
            >
              <s.icon className="text-white w-12 h-12" strokeWidth={2.5} />
              <div>
                <div className="font-black text-white leading-tight text-lg">{s.title}</div>
                <div className="text-white/90 font-medium text-sm mt-1">{s.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* About this stay - collapsible */}
      {(patient.procedures.length > 0 || patient.educationalForms.length > 0) && (
        <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
          <button
            onClick={() => setShowStay((v) => !v)}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Stethoscope className="w-6 h-6 text-gray-500" />
              <span className="font-black text-gray-900 text-base">{copy.aboutStay}</span>
            </div>
            {showStay ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {showStay && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
              {patient.procedures.length > 0 && (
                <div>
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
                <div>
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
            </div>
          )}
        </div>
      )}
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
