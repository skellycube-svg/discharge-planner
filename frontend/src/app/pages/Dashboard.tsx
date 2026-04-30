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
import { getConditionInfo } from '../data/conditionInfo';
import type { TodoCategory } from '../data/types';

const CATEGORY_ICON: Record<TodoCategory, typeof Heart> = {
  followup: CalendarDays,
  medication: Pill,
  safety: ShieldCheck,
  care: Heart,
};

const CATEGORY_TINT: Record<TodoCategory, string> = {
  followup: 'text-brand',
  medication: 'text-info',
  safety: 'text-danger',
  care: 'text-ok',
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
      whatItIs: 'What it is',
      recovery: 'Recovery at home',
      callDoctor: 'When to call the doctor',
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
      whatItIs: 'Qué es',
      recovery: 'Recuperación en casa',
      callDoctor: 'Cuándo llamar al doctor',
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
      <div className="bg-brand text-brand-fg rounded-2xl p-6 print:bg-white print:text-black print:border print:border-gray-300">
        <div className="font-bold text-xs uppercase tracking-[0.12em] mb-2 print:text-ink-soft" style={{ color: '#dceaf2' }}>
          {copy.whatHappened}
        </div>
        <div className="font-display font-bold text-2xl leading-[1.2] tracking-tight">
          {plainDiagnosis(patient.dischargeDiagnosis, lang)}
        </div>
        <p className="font-sans font-medium text-base mt-2 leading-snug print:text-ink-soft" style={{ color: '#e8f0f5' }}>
          {plainWhatHappened(patient.dischargeDiagnosis, lang)}
        </p>
        <Link
          to="/warnings"
          className="mt-4 inline-flex items-center gap-1.5 bg-paper/15 hover:bg-paper/20 active:scale-95 transition-transform text-brand-fg font-semibold text-sm px-4 py-2 rounded-full border border-paper/25 print:hidden"
        >
          {copy.warnings} →
        </Link>
      </div>

      {/* AI Assistant chat box (UI only) */}
      <div className="bg-paper-raised rounded-xl border border-hairline p-4 print:hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-brand-soft p-1.5 rounded-full">
            <Bot className="w-4 h-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand">
            {copy.askLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-paper border border-hairline rounded-xl px-3 py-2.5">
          <input
            type="text"
            placeholder={copy.askPlaceholder}
            className="flex-1 bg-transparent outline-none text-base font-medium text-ink placeholder-ink-mute"
            aria-label={copy.askLabel}
          />
          <button
            type="button"
            disabled
            aria-label="Send"
            className="bg-brand text-brand-fg p-2 rounded-lg opacity-70"
          >
            <SendHorizonal className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs font-semibold bg-brand-soft text-brand border border-hairline px-3 py-1.5 rounded-full">
            {copy.askChip1}
          </span>
          <span className="text-xs font-semibold bg-brand-soft text-brand border border-hairline px-3 py-1.5 rounded-full">
            {copy.askChip2}
          </span>
        </div>
      </div>

      {/* About this condition (collapsible, closed by default) */}
      <div className="bg-paper-raised border border-hairline rounded-xl overflow-hidden">
        <button
          onClick={() => setShowCondition((v) => !v)}
          className="w-full flex items-center justify-between p-4 active:bg-paper-sunken/40"
          aria-expanded={showCondition}
        >
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-brand-secondary" strokeWidth={1.75} aria-hidden="true" />
            <div className="text-left">
              <div className="font-display font-semibold text-ink text-base leading-tight">
                {copy.conditionTitle}
              </div>
              <div className="text-xs font-medium text-ink-soft mt-0.5">{copy.conditionSub}</div>
            </div>
          </div>
          {showCondition ? (
            <ChevronUp className="w-5 h-5 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
        {showCondition && (() => {
          const info = getConditionInfo(patient.dischargeDiagnosis, lang);
          return (
            <div className="px-4 pb-4 space-y-3 border-t border-hairline pt-4 text-sm font-medium text-ink leading-relaxed">
              <InfoBlock title={copy.whatItIs} body={info.whatItIs} tint="info" />
              <InfoBlock title={copy.recovery} body={info.recovery} tint="ok" />
              <InfoBlock title={copy.callDoctor} body={info.callDoctor} tint="danger" />

              {patient.diet && (
                <div className="bg-warn-soft border border-warn/30 rounded-xl p-3">
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-warn mb-1">
                    {copy.diet}
                  </div>
                  <div className="font-semibold text-ink">{patient.diet}</div>
                </div>
              )}

              {patient.specialInstructions && (
                <div className="bg-info-soft border border-info/30 rounded-xl p-3">
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-brand mb-1">
                    {copy.special}
                  </div>
                  <div className="font-semibold text-ink leading-snug">
                    {patient.specialInstructions}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* TO-DO checklist (collapsible, closed by default) */}
      {totalTodos > 0 ? (
        <div className="bg-paper-raised border border-hairline rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTodos((v) => !v)}
            className="w-full p-5 active:bg-paper-sunken/40"
            aria-expanded={showTodos}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ListChecks className="w-6 h-6 text-brand shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <h2 className="font-display font-bold text-xl text-ink leading-tight truncate text-left tracking-tight">
                  {copy.todoTitle}{' '}
                  <span className="text-brand">
                    {new Date().toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-brand bg-brand-soft border border-hairline px-3 py-1 rounded-full tabular">
                  {copy.todoSub(doneCount, totalTodos)}
                </span>
                {showTodos ? (
                  <ChevronUp className="w-5 h-5 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
                )}
              </div>
            </div>

            <div
              className="h-2 bg-paper-sunken rounded-full overflow-hidden mt-3"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-brand transition-all"
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
                    aria-pressed={isDone}
                    className={`w-full text-left rounded-xl p-3 flex items-start gap-3 border transition-colors active:scale-[0.99] ${
                      isDone
                        ? 'bg-ok-soft border-ok/30'
                        : 'bg-paper border-hairline hover:border-brand/40'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-7 h-7 text-ok shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <Circle className="w-7 h-7 text-hairline-strong shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Icon className={`w-4 h-4 ${CATEGORY_TINT[t.category]}`} strokeWidth={1.75} aria-hidden="true" />
                        <span className={`text-xs font-bold uppercase tracking-[0.12em] ${CATEGORY_TINT[t.category]}`}>
                          {t.category}
                        </span>
                      </div>
                      <div className={`font-semibold text-base leading-snug ${isDone ? 'text-ink-soft line-through' : 'text-ink'}`}>
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

const TINT_STYLES: Record<string, string> = {
  info: 'bg-info-soft border-info/30 text-brand',
  ok: 'bg-ok-soft border-ok/30 text-ok',
  danger: 'bg-danger-soft border-danger/30 text-danger',
  warn: 'bg-warn-soft border-warn/30 text-warn',
};

function InfoBlock({ title, body, tint }: { title: string; body: string; tint: string }) {
  const cls = TINT_STYLES[tint] ?? TINT_STYLES.info;
  const sentenceCount = (body.match(/[.!?](?:\s|$)/g) ?? []).length;
  const collapsible = sentenceCount > 1;
  const [open, setOpen] = useState(false);

  if (!collapsible) {
    return (
      <div className={`border rounded-xl p-3 ${cls}`}>
        <div className="text-xs font-bold uppercase tracking-[0.12em] mb-1">{title}</div>
        <div className="font-medium text-ink leading-snug">{body}</div>
      </div>
    );
  }

  return (
    <div className={`border rounded-xl ${cls} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2.5 flex items-center justify-between active:opacity-80"
        aria-expanded={open}
      >
        <span className="text-xs font-bold uppercase tracking-[0.12em]">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 opacity-70" strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 opacity-70" strokeWidth={1.75} aria-hidden="true" />
        )}
      </button>
      {open && (
        <div className="px-3 pb-3 font-medium text-ink leading-snug">{body}</div>
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
    <div className={`rounded-xl border p-3 ${tint}`}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <div className="font-display font-bold text-base leading-tight">{value}</div>
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
