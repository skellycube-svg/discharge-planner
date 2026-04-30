import React, { useState, useEffect } from 'react';
import {
  Pill,
  Utensils,
  Droplets,
  AlertCircle,
  Wind,
  Hand,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ListChecks,
  ShoppingBag,
  Languages,
  MessageCircleQuestion,
  CheckCircle2,
  Circle,
  Info,
  Mic,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import type { Medication } from '../data/types';
import { getMedInfo } from '../data/medInfo';

const bgByColor: Record<string, string> = {
  orange: 'bg-warn-soft border-warn/30',
  blue: 'bg-info-soft border-info/30',
  indigo: 'bg-brand-soft border-hairline',
  green: 'bg-ok-soft border-ok/30',
  red: 'bg-danger-soft border-danger/30',
};
const pillByColor: Record<string, string> = {
  orange: 'text-warn',
  blue: 'text-info',
  indigo: 'text-brand',
  green: 'text-ok',
  red: 'text-danger',
};

function IconForMed({ med }: { med: Medication }) {
  if (med.iconType === 'food') return <Utensils className="w-6 h-6 text-warn" strokeWidth={1.75} aria-hidden="true" />;
  if (med.iconType === 'water') return <Droplets className="w-6 h-6 text-info" strokeWidth={1.75} aria-hidden="true" />;
  if (med.iconType === 'inhaler') return <Wind className="w-6 h-6 text-info" strokeWidth={1.75} aria-hidden="true" />;
  if (med.iconType === 'topical') return <Hand className="w-6 h-6 text-accent-warm" strokeWidth={1.75} aria-hidden="true" />;
  return <Pill className="w-6 h-6 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />;
}

const timeOfDayLabel: Record<string, { en: string; es: string }> = {
  morning: { en: 'Morning', es: 'Mañana' },
  afternoon: { en: 'Afternoon', es: 'Tarde' },
  evening: { en: 'Evening', es: 'Noche' },
  asNeeded: { en: 'As Needed', es: 'Cuando se necesite' },
};

// Parse "5-10 mL" or "2.5–5 mg" -> [low, high] for range visual
function parseDoseRange(dose: string): { low: number; high: number; unit: string } | null {
  const m = dose.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
  if (!m) return null;
  const low = parseFloat(m[1]);
  const high = parseFloat(m[2]);
  if (!Number.isFinite(low) || !Number.isFinite(high) || low >= high) return null;
  return { low, high, unit: m[3] ?? '' };
}

function DoseRangeBar({ low, high, unit }: { low: number; high: number; unit: string }) {
  const ticks = 5;
  return (
    <div className="bg-paper-raised p-3 rounded-lg border border-hairline mt-2">
      <div className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft mb-2">
        Dose range
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-ink text-sm tabular">{low}{unit}</span>
        <div className="flex-1 h-3 bg-paper-sunken rounded-full relative border border-hairline">
          <div className="absolute inset-y-0 left-0 right-0 bg-brand-soft rounded-full" />
          {Array.from({ length: ticks }).map((_, i) => (
            <span
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-hairline-strong"
              style={{ left: `${(i / (ticks - 1)) * 100}%` }}
            />
          ))}
        </div>
        <span className="font-bold text-ink text-sm tabular">{high}{unit}</span>
      </div>
      <div className="text-xs font-medium text-ink-soft mt-1.5">
        Start at the lower dose. Go higher only if your doctor says so.
      </div>
    </div>
  );
}

export function Medications() {
  const { lang } = useLanguage();
  const { patient } = usePatient();
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showPickupSupport, setShowPickupSupport] = useState(false);
  const [showLiveSupport, setShowLiveSupport] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const checklistKey = patient ? `cth.pickupChecklist.${patient.id}` : null;

  useEffect(() => {
    if (!checklistKey) return;
    try {
      const raw = localStorage.getItem(checklistKey);
      setChecklist(raw ? JSON.parse(raw) : {});
    } catch {
      setChecklist({});
    }
  }, [checklistKey]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        if (checklistKey) localStorage.setItem(checklistKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (!patient) return null;

  const copy = {
    en: {
      title: 'Medicines',
      subtitle: 'What to give and when',
      medNameLabel: 'Medicine name',
      new: 'New prescription',
      home: 'Take at home',
      allMeds: 'All medications',
      allMedsSub: (n: number) => `${n} total`,
      howToUse: 'How to use',
      upcoming: 'Pickups coming up',
      upcomingSub: 'New prescriptions to pick up',
      pickupSupport: 'Pickup support',
      pickupSupportSub: 'Help at the pharmacy',
      askPharmacist: 'What to ask the pharmacist',
      pharmacistAsk: [
        'Are there any side effects to watch for?',
        'Can I give this with food?',
        'What if I miss a dose?',
        'Do you have free phone translation?',
      ],
      translation: 'Translation phrases',
      phrases: [
        { en: 'I need an interpreter, please.', es: 'Necesito un intérprete, por favor.' },
        { en: 'Can you speak slower?', es: '¿Puede hablar más despacio?' },
        { en: 'Please write it down.', es: 'Por favor, escríbalo.' },
      ],
      agentHelp: 'Click here to launch a live AI voice assistant',
      agentHelpSub: 'Talk to it like a person — answers in your language',
      comingSoonTitle: 'Coming soon',
      comingSoonBody: 'Live phone and chat support is in the works. Check back soon — for now, call your pharmacy directly using the number on your prescription bottle.',
      close: 'Close',
      checklist: 'Pickup checklist',
      checklistSub: (done: number, total: number) => `${done} of ${total} done`,
      checklistItems: [
        'Insurance card',
        'Photo ID',
        'Prescription number',
        'List of current medicines',
        'Pen for instructions',
      ],
      noPickups: 'No new prescriptions to pick up.',
      purpose: 'What it does',
      withFoodLabel: 'How to give it',
      sideEffectsLabel: 'Side effects to watch',
      schoolNoteLabel: 'At school',
    },
    es: {
      title: 'Medicinas',
      subtitle: 'Qué dar y cuándo',
      medNameLabel: 'Nombre de la medicina',
      new: 'Receta nueva',
      home: 'Tomar en casa',
      allMeds: 'Todas las medicinas',
      allMedsSub: (n: number) => `${n} en total`,
      howToUse: 'Cómo usar',
      upcoming: 'Recogidas próximas',
      upcomingSub: 'Recetas nuevas para recoger',
      pickupSupport: 'Ayuda con la recogida',
      pickupSupportSub: 'Ayuda en la farmacia',
      askPharmacist: 'Qué preguntarle al farmacéutico',
      pharmacistAsk: [
        '¿Hay efectos secundarios que vigilar?',
        '¿Puedo darlo con comida?',
        '¿Qué pasa si me salto una dosis?',
        '¿Tienen traducción telefónica gratis?',
      ],
      translation: 'Frases de traducción',
      phrases: [
        { en: 'I need an interpreter, please.', es: 'Necesito un intérprete, por favor.' },
        { en: 'Can you speak slower?', es: '¿Puede hablar más despacio?' },
        { en: 'Please write it down.', es: 'Por favor, escríbalo.' },
      ],
      agentHelp: 'Toca aquí para iniciar un asistente de voz con IA',
      agentHelpSub: 'Háblale como a una persona — te responde en tu idioma',
      comingSoonTitle: 'Próximamente',
      comingSoonBody: 'El soporte en vivo por teléfono y chat viene en camino. Vuelve pronto — por ahora, llama directamente a la farmacia con el número del frasco de la receta.',
      close: 'Cerrar',
      checklist: 'Lista de recogida',
      checklistSub: (done: number, total: number) => `${done} de ${total} hechos`,
      checklistItems: [
        'Tarjeta de seguro',
        'Identificación con foto',
        'Número de receta',
        'Lista de medicinas actuales',
        'Pluma para anotar',
      ],
      noPickups: 'No hay recetas nuevas para recoger.',
      purpose: 'Para qué sirve',
      withFoodLabel: 'Cómo darlo',
      sideEffectsLabel: 'Efectos a vigilar',
      schoolNoteLabel: 'En la escuela',
    },
  }[lang];

  const upcoming = patient.medications.filter((m) => m.isPrescription);

  const checklistItems = copy.checklistItems;
  const checkedCount = checklistItems.filter((_, i) => checklist[`item-${i}`]).length;
  const checkPct = Math.round((checkedCount / checklistItems.length) * 100);

  return (
    <div className="flex flex-col h-full bg-paper pb-28">
      {showLiveSupport && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-6"
          onClick={() => setShowLiveSupport(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-paper-raised rounded-2xl p-6 max-w-sm w-full border border-hairline "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="bg-brand-soft p-3 rounded-xl">
                <Mic className="w-7 h-7 text-brand" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <button
                onClick={() => setShowLiveSupport(false)}
                aria-label={copy.close}
                className="p-2 rounded-full bg-paper-sunken active:scale-95"
              >
                <X className="w-5 h-5 text-ink-soft" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
            <h3 className="font-display font-bold text-2xl text-ink leading-tight tracking-tight">
              {copy.comingSoonTitle}
            </h3>
            <p className="text-sm font-medium text-ink-soft leading-relaxed mt-2">
              {copy.comingSoonBody}
            </p>
            <button
              onClick={() => setShowLiveSupport(false)}
              className="mt-5 w-full bg-brand hover:bg-brand-hover text-brand-fg font-semibold text-base py-3 rounded-xl active:scale-95 transition-colors"
            >
              {copy.close}
            </button>
          </div>
        </div>
      )}

      <div className="bg-paper-raised px-5 py-6 border-b border-hairline sticky top-0 z-10">
        <h1 className="font-display font-bold text-3xl text-ink tracking-tight">{copy.title}</h1>
        <p className="text-base font-medium text-ink-soft mt-1">{copy.subtitle}</p>
      </div>

      <div className="p-5 space-y-5">
        {patient.medications.length === 0 && (
          <div className="text-center text-ink-soft font-bold py-12">No medications listed.</div>
        )}

        {/* All medications quick list (collapsible) */}
        {patient.medications.length > 0 && (
          <div className="bg-paper-raised border border-hairline rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full flex items-center justify-between p-4 active:bg-paper-sunken/60"
            >
              <div className="flex items-center gap-3">
                <ListChecks className="w-6 h-6 text-brand" />
                <div className="text-left">
                  <div className="font-bold text-ink text-base leading-tight">
                    {copy.allMeds}
                  </div>
                  <div className="text-xs font-bold text-ink-soft">
                    {copy.allMedsSub(patient.medications.length)}
                  </div>
                </div>
              </div>
              {showAll ? (
                <ChevronUp className="w-5 h-5 text-ink-soft" />
              ) : (
                <ChevronDown className="w-5 h-5 text-ink-soft" />
              )}
            </button>
            {showAll && (
              <ul className="px-4 pb-4 border-t border-hairline pt-3 space-y-1.5">
                {patient.medications.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-start gap-2 text-sm font-bold text-ink"
                  >
                    <Pill
                      className={`w-4 h-4 ${pillByColor[m.color] ?? 'text-ink-soft'} shrink-0 mt-0.5`}
                      fill="currentColor"
                    />
                    <span className="flex-1">
                      {m.plainName}{' '}
                      <span className="text-xs font-medium text-ink-soft">({m.rawName})</span>
                    </span>
                    {m.isPrescription && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] bg-brand text-white px-2 py-0.5 rounded-full">
                        {copy.new}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Upcoming pickups */}
        {upcoming.length > 0 && (
          <div className="bg-warn-soft border border-warn/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-6 h-6 text-warn" strokeWidth={2.5} />
              <div>
                <div className="font-bold text-ink text-base leading-tight">
                  {copy.upcoming}
                </div>
                <div className="text-xs font-bold text-warn">{copy.upcomingSub}</div>
              </div>
            </div>
            <ul className="space-y-2">
              {upcoming.map((m) => (
                <li
                  key={m.id}
                  className="bg-paper-raised rounded-2xl p-3 border border-warn/30 flex items-center gap-3"
                >
                  <Pill
                    className={`w-6 h-6 ${pillByColor[m.color] ?? 'text-ink-soft'} shrink-0`}
                    fill="currentColor"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink text-base leading-tight truncate">
                      {m.plainName}
                    </div>
                    <div className="text-xs font-bold text-ink-soft truncate">{m.rawName}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pickup support (collapsible) */}
        <div className="bg-paper-raised border border-hairline rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowPickupSupport((v) => !v)}
            className="w-full flex items-center justify-between p-4 active:bg-paper-sunken/60"
          >
            <div className="flex items-center gap-3">
              <Languages className="w-6 h-6 text-brand" />
              <div className="text-left">
                <div className="font-bold text-ink text-base leading-tight">
                  {copy.pickupSupport}
                </div>
                <div className="text-xs font-bold text-ink-soft">{copy.pickupSupportSub}</div>
              </div>
            </div>
            {showPickupSupport ? (
              <ChevronUp className="w-5 h-5 text-ink-soft" />
            ) : (
              <ChevronDown className="w-5 h-5 text-ink-soft" />
            )}
          </button>
          {showPickupSupport && (
            <div className="px-4 pb-4 space-y-4 border-t border-hairline pt-4">
              <button
                type="button"
                onClick={() => setShowLiveSupport(true)}
                className="w-full bg-brand border border-brand rounded-2xl p-3 flex items-center gap-3 active:scale-[0.98] "
              >
                <div className="bg-white/20 p-2 rounded-xl">
                  <Mic className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-sm">{copy.agentHelp}</div>
                  <div className="text-xs font-bold text-brand-fg/85">{copy.agentHelpSub}</div>
                </div>
              </button>

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft mb-2">
                  {copy.askPharmacist}
                </div>
                <ul className="space-y-1.5">
                  {copy.pharmacistAsk.map((q, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-bold text-ink bg-paper-sunken/60 rounded-xl p-2.5 border border-hairline"
                    >
                      <MessageCircleQuestion className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft mb-2">
                  {copy.translation}
                </div>
                <ul className="space-y-1.5">
                  {copy.phrases.map((p, i) => (
                    <li
                      key={i}
                      className="bg-info-soft border border-info/30 rounded-xl p-2.5"
                    >
                      <div className="font-bold text-ink text-sm">{p[lang]}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Pickup checklist */}
        <div className="bg-paper-raised border border-hairline rounded-2xl p-5 ">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-brand" strokeWidth={2.5} />
              <h2 className="font-bold text-base text-ink">{copy.checklist}</h2>
            </div>
            <span className="text-xs font-bold text-brand bg-brand-soft border border-hairline px-3 py-1 rounded-full">
              {copy.checklistSub(checkedCount, checklistItems.length)}
            </span>
          </div>
          <div className="h-2 bg-paper-sunken rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-brand transition-all"
              style={{ width: `${checkPct}%` }}
            />
          </div>
          <ul className="space-y-2">
            {checklistItems.map((item, i) => {
              const id = `item-${i}`;
              const done = !!checklist[id];
              return (
                <li key={id}>
                  <button
                    onClick={() => toggleCheck(id)}
                    className={`w-full text-left rounded-2xl p-3 flex items-center gap-3 border-2 transition-colors active:scale-[0.99] ${
                      done
                        ? 'bg-ok-soft border-ok/30'
                        : 'bg-paper-sunken/60 border-hairline'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-6 h-6 text-ok shrink-0" strokeWidth={2.5} />
                    ) : (
                      <Circle className="w-6 h-6 text-hairline-strong shrink-0" strokeWidth={2.5} />
                    )}
                    <span
                      className={`font-bold text-base ${
                        done ? 'text-ink line-through' : 'text-ink'
                      }`}
                    >
                      {item}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Per-medication cards with how-to-use dropdown */}
        {patient.medications.map((med) => {
          const isOpen = !!expanded[med.id];
          const range = parseDoseRange(med.dose);
          return (
            <div
              key={med.id}
              className={`rounded-2xl p-6 border-2 ${bgByColor[med.color] ?? 'bg-paper-sunken/60'} `}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="bg-paper-raised px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.1em] text-ink  border border-hairline">
                  {timeOfDayLabel[med.timeOfDay][lang]}
                </span>
                {med.isPrescription && (
                  <span className="bg-brand text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.1em] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {copy.new}
                  </span>
                )}
              </div>

              <div className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft mb-1">
                {copy.medNameLabel}
              </div>
              <h3 className="font-display font-bold text-2xl text-ink leading-tight tracking-tight">{med.plainName}</h3>
              <p className="text-sm font-medium text-ink-soft mt-1 mb-4">{med.rawName}</p>

              {med.dose && (
                <div className="bg-paper-raised p-3 rounded-xl border border-hairline font-bold text-ink text-base mb-2">
                  {med.dose}
                </div>
              )}

              {range && <DoseRangeBar low={range.low} high={range.high} unit={range.unit} />}

              <div className="flex items-start gap-3 text-ink bg-paper-raised p-3 rounded-xl border border-hairline mt-2">
                <IconForMed med={med} />
                <span className="font-bold text-base leading-snug">{med.notePlain}</span>
              </div>

              {med.frequency && (
                <div className="flex items-start gap-3 text-ink bg-danger-soft p-3 rounded-xl border border-danger/30 mt-2">
                  <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <span className="font-bold text-base leading-snug">{med.frequency}</span>
                </div>
              )}

              {/* How to use dropdown */}
              <button
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, [med.id]: !prev[med.id] }))
                }
                className="mt-3 w-full flex items-center justify-between bg-paper-raised border border-hairline rounded-xl px-3 py-2.5 active:bg-paper-sunken/60"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-brand" />
                  <span className="font-bold text-sm text-ink">{copy.howToUse}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-ink-soft" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-ink-soft" />
                )}
              </button>
              {isOpen && (() => {
                const info = getMedInfo(med.rawName, med.plainName, lang);
                return (
                  <div className="mt-2 bg-paper-raised border border-hairline rounded-xl p-3 space-y-2 text-sm font-medium text-ink leading-relaxed">
                    <MedInfoBlock label={copy.purpose} body={info.purpose} tint="indigo" />
                    <MedInfoBlock label={copy.withFoodLabel} body={info.withFood} tint="amber" />
                    <MedInfoBlock label={copy.sideEffectsLabel} body={info.sideEffects} tint="red" />
                    <MedInfoBlock label={copy.schoolNoteLabel} body={info.schoolNote} tint="purple" />
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MED_TINT: Record<string, string> = {
  indigo: 'bg-brand-soft border-hairline text-brand',
  amber: 'bg-warn-soft border-warn/30 text-warn',
  red: 'bg-danger-soft border-danger/30 text-danger',
  purple: 'bg-accent-warm-soft border-accent-warm/40 text-ink',
};

function MedInfoBlock({ label, body, tint }: { label: string; body: string; tint: string }) {
  const cls = MED_TINT[tint] ?? MED_TINT.indigo;
  const sentenceCount = (body.match(/[.!?](?:\s|$)/g) ?? []).length;
  const collapsible = sentenceCount > 1;
  const [open, setOpen] = useState(false);

  if (!collapsible) {
    return (
      <div className={`border rounded-xl p-2.5 ${cls}`}>
        <div className="text-xs font-bold uppercase tracking-[0.12em] mb-0.5">{label}</div>
        <div className="font-medium text-ink leading-snug">{body}</div>
      </div>
    );
  }

  return (
    <div className={`border rounded-xl ${cls} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-2.5 py-2 flex items-center justify-between active:opacity-80"
      >
        <span className="text-xs font-bold uppercase tracking-[0.12em]">{label}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 opacity-70" />
        ) : (
          <ChevronDown className="w-4 h-4 opacity-70" />
        )}
      </button>
      {open && (
        <div className="px-2.5 pb-2.5 font-medium text-ink leading-snug">{body}</div>
      )}
    </div>
  );
}
