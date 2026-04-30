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
  SendHorizonal,
  Bot,
  Info,
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
  const [showSummary, setShowSummary] = useState(false);
  const [showCondition, setShowCondition] = useState(false);
  const [showTodos, setShowTodos] = useState(false);

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
      visitSummarySub: 'Dates, allergies, procedures',
      admitted: 'Admitted',
      went: 'Home',
      stay: (n: number) => (n === 1 ? '1 day stay' : `${n} day stay`),
      condition: 'Condition',
      proceduresCount: (n: number) => (n === 1 ? '1 procedure' : `${n} procedures`),
      allergyBanner: 'Allergy alert',
      noAllergy: 'No known allergies',
      todoTitle: 'To-Do',
      todoSub: (done: number, total: number) => `${done} of ${total} done`,
      todoEmpty: 'No special instructions for this visit.',
      callDoctor: 'Call the doctor',
      sections: 'Discharge Plan',
      meds: 'Medicines',
      medsSub: (n: number) => `${n} to give`,
      appts: 'Appointments',
      apptsSub: (n: number) => `${n} upcoming`,
      warnings: 'Summary',
      warningsSub: 'Visit, allergies, procedures',
      resources: 'Help & Services',
      resourcesSub: 'Rides, food & more',
      aboutStay: 'About this stay',
      procedures: 'What was done in the hospital',
      forms: 'Information sheets given to you',
      askLabel: 'AI Assistant',
      askPlaceholder: 'Ask a question about your care…',
      askChip1: 'Can my child eat with this medicine?',
      askChip2: 'When should I worry?',
      conditionTitle: 'About this condition',
      conditionSub: 'Plain-language details',
      moreInfo: 'More about this condition',
      moreInfoBody:
        'Detailed condition info coming soon. For now, see "What happened" above and the Warning Signs page.',
      diet: 'Diet at home',
      special: 'Special instructions',
      print: 'Print summary for doctor',
    },
    es: {
      caringFor: 'Cuidando a',
      whatHappened: 'Qué pasó',
      visitSummary: 'Resumen de la visita',
      visitSummarySub: 'Fechas, alergias, procedimientos',
      admitted: 'Ingreso',
      went: 'Alta',
      stay: (n: number) => (n === 1 ? '1 día de estancia' : `${n} días de estancia`),
      condition: 'Estado',
      proceduresCount: (n: number) => (n === 1 ? '1 procedimiento' : `${n} procedimientos`),
      allergyBanner: 'Alerta de alergia',
      noAllergy: 'Sin alergias conocidas',
      todoTitle: 'Tareas',
      todoSub: (done: number, total: number) => `${done} de ${total} hechos`,
      todoEmpty: 'No hay instrucciones especiales para esta visita.',
      callDoctor: 'Llamar al doctor',
      sections: 'Plan de Alta',
      meds: 'Medicinas',
      medsSub: (n: number) => `${n} para dar`,
      appts: 'Citas',
      apptsSub: (n: number) => `${n} próximas`,
      warnings: 'Resumen',
      warningsSub: 'Visita, alergias, procedimientos',
      resources: 'Ayuda y Servicios',
      resourcesSub: 'Transporte, comida y más',
      aboutStay: 'Sobre esta estancia',
      procedures: 'Lo que se hizo en el hospital',
      forms: 'Hojas de información que le dieron',
      askLabel: 'Asistente IA',
      askPlaceholder: 'Haz una pregunta sobre el cuidado…',
      askChip1: '¿Puede comer con esta medicina?',
      askChip2: '¿Cuándo debo preocuparme?',
      conditionTitle: 'Sobre esta condición',
      conditionSub: 'Detalles en lenguaje sencillo',
      moreInfo: 'Más sobre esta condición',
      moreInfoBody:
        'Información detallada próximamente. Por ahora, mira "Qué pasó" arriba y la página de Señales de Alerta.',
      diet: 'Dieta en casa',
      special: 'Instrucciones especiales',
      print: 'Imprimir resumen para el doctor',
    },
  }[lang];

  if (!patient) return null;

  const totalTodos = patient.todos.length;
  const doneCount = patient.todos.filter((t) => done[t.id]).length;
  const progressPct = totalTodos === 0 ? 0 : Math.round((doneCount / totalTodos) * 100);

  const hasSummary =
    patient.procedures.length > 0 ||
    patient.educationalForms.length > 0 ||
    patient.hasAllergies ||
    !!patient.allergies;

  return (
    <div className="flex flex-col gap-5 pb-28 px-5 pt-5 print:pb-0">
      {/* What happened — slim hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-3xl p-5 shadow-lg print:bg-white print:text-black print:shadow-none print:border print:border-gray-300">
        <div className="text-indigo-100 font-bold text-xs uppercase tracking-widest mb-1 print:text-gray-600">
          {copy.whatHappened}
        </div>
        <div className="font-black text-xl leading-snug">
          {plainDiagnosis(patient.dischargeDiagnosis, lang)}
        </div>
        <p className="text-indigo-50 font-medium text-base mt-1.5 leading-snug print:text-gray-700">
          {plainWhatHappened(patient.dischargeDiagnosis, lang)}
        </p>
        <Link
          to="/warnings"
          className="mt-3 inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:scale-95 transition-transform text-white font-bold text-sm px-3 py-1.5 rounded-full border border-white/20 print:hidden"
        >
          {copy.warnings} →
        </Link>
      </div>

      {/* AI Assistant chat box (UI only) */}
      <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-sm p-4 print:hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-indigo-100 p-1.5 rounded-full">
            <Bot className="w-4 h-4 text-indigo-700" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-700">
            {copy.askLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5">
          <input
            type="text"
            placeholder={copy.askPlaceholder}
            className="flex-1 bg-transparent outline-none text-base font-medium text-gray-900 placeholder-gray-400"
          />
          <button
            type="button"
            disabled
            aria-label="Send"
            className="bg-indigo-600 text-white p-2 rounded-xl opacity-70"
          >
            <SendHorizonal className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full">
            {copy.askChip1}
          </span>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full">
            {copy.askChip2}
          </span>
        </div>
      </div>

      {/* About this condition (collapsible, closed by default) */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
        <button
          onClick={() => setShowCondition((v) => !v)}
          className="w-full flex items-center justify-between p-4 active:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <div className="font-black text-gray-900 text-base leading-tight">
                {copy.conditionTitle}
              </div>
              <div className="text-xs font-bold text-gray-500">{copy.conditionSub}</div>
            </div>
          </div>
          {showCondition ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {showCondition && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-4 text-sm font-medium text-gray-800 leading-relaxed">
            <p className="leading-snug">{plainWhatHappened(patient.dischargeDiagnosis, lang)}</p>

            {patient.diet && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-1">
                  {copy.diet}
                </div>
                <div className="font-bold text-amber-900">{patient.diet}</div>
              </div>
            )}

            {patient.specialInstructions && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-1">
                  {copy.special}
                </div>
                <div className="font-bold text-blue-900 leading-snug">
                  {patient.specialInstructions}
                </div>
              </div>
            )}

            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-3">
              <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">
                {copy.moreInfo}
              </div>
              <div className="font-medium text-gray-600 leading-snug">{copy.moreInfoBody}</div>
            </div>
          </div>
        )}
      </div>

      {/* TO-DO checklist (collapsible, closed by default) */}
      {totalTodos > 0 ? (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowTodos((v) => !v)}
            className="w-full p-5 active:bg-indigo-50/40"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ListChecks className="w-6 h-6 text-indigo-700 shrink-0" strokeWidth={2.5} />
                <h2 className="font-black text-xl text-gray-900 leading-tight truncate text-left">
                  {copy.todoTitle}{' '}
                  <span className="text-indigo-600">
                    {new Date().toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  {copy.todoSub(doneCount, totalTodos)}
                </span>
                {showTodos ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </button>

          {showTodos && (
          <ul className="space-y-2 px-5 pb-5">
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
          )}
        </div>
      ) : null}

      {/* Print-only sections (rendered hidden on screen) */}
      <PrintOnlySummary patient={patient} lang={lang} />
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

function PrintOnlySummary({
  patient,
  lang,
}: {
  patient: NonNullable<ReturnType<typeof usePatient>['patient']>;
  lang: 'en' | 'es';
}) {
  const labels = {
    en: {
      meds: 'Medications',
      appts: 'Appointments',
      warnings: 'Warning Signs',
      pcp: 'Primary Care',
      allergies: 'Allergies',
      mrn: 'MRN',
    },
    es: {
      meds: 'Medicinas',
      appts: 'Citas',
      warnings: 'Señales de Alerta',
      pcp: 'Médico de Cabecera',
      allergies: 'Alergias',
      mrn: 'MRN',
    },
  }[lang];

  return (
    <div className="hidden print:block text-black">
      <div className="text-sm mb-3">
        <strong>{labels.mrn}:</strong> {patient.mrn} · <strong>{labels.pcp}:</strong> {patient.pcp} ({patient.pcpPhone})
        {patient.hasAllergies && (
          <>
            {' · '}
            <strong>{labels.allergies}:</strong> {patient.allergies}
          </>
        )}
      </div>

      {patient.medications.length > 0 && (
        <section className="mb-4">
          <h2 className="font-bold text-lg border-b border-black mb-1">{labels.meds}</h2>
          <ul className="text-sm">
            {patient.medications.map((m) => (
              <li key={m.id}>
                • <strong>{m.plainName}</strong> ({m.rawName}) — {m.dose} {m.frequency}
              </li>
            ))}
          </ul>
        </section>
      )}

      {patient.appointments.length > 0 && (
        <section className="mb-4">
          <h2 className="font-bold text-lg border-b border-black mb-1">{labels.appts}</h2>
          <ul className="text-sm">
            {patient.appointments.map((a) => (
              <li key={a.id}>
                • {a.specialty} — {a.dateISO} {a.doctor && `· ${a.doctor}`} {a.location && `· ${a.location}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {patient.warnings.length > 0 && (
        <section className="mb-4">
          <h2 className="font-bold text-lg border-b border-black mb-1">{labels.warnings}</h2>
          <ul className="text-sm">
            {patient.warnings.map((w) => (
              <li key={w.id}>
                • [{w.level === 'emergency' ? '911' : 'Doctor'}] {w.symptomPlain}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
