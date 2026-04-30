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
} from 'lucide-react';
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
    <div className="bg-white p-3 rounded-xl border border-gray-100 mt-2">
      <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
        Dose range
      </div>
      <div className="flex items-center gap-2">
        <span className="font-black text-gray-900 text-sm">{low}{unit}</span>
        <div className="flex-1 h-3 bg-gradient-to-r from-green-300 via-yellow-300 to-orange-400 rounded-full relative">
          {Array.from({ length: ticks }).map((_, i) => (
            <span
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/70"
              style={{ left: `${(i / (ticks - 1)) * 100}%` }}
            />
          ))}
        </div>
        <span className="font-black text-gray-900 text-sm">{high}{unit}</span>
      </div>
      <div className="text-xs font-bold text-gray-500 mt-1.5">
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
      agentHelp: 'Talk to the pharmacy assistant',
      agentHelpSub: 'AI helper (coming soon)',
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
      moreInfo: 'More about this medicine',
      moreInfoBody: 'Detailed drug info coming soon. For now, follow the dose and timing above.',
    },
    es: {
      title: 'Medicinas',
      subtitle: 'Qué dar y cuándo',
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
      agentHelp: 'Hablar con el asistente de farmacia',
      agentHelpSub: 'Ayudante IA (próximamente)',
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
      moreInfo: 'Más sobre esta medicina',
      moreInfoBody: 'Información detallada próximamente. Por ahora sigue la dosis y el horario de arriba.',
    },
  }[lang];

  const upcoming = patient.medications.filter((m) => m.isPrescription);

  const checklistItems = copy.checklistItems;
  const checkedCount = checklistItems.filter((_, i) => checklist[`item-${i}`]).length;
  const checkPct = Math.round((checkedCount / checklistItems.length) * 100);

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

        {/* All medications quick list (collapsible) */}
        {patient.medications.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full flex items-center justify-between p-4 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <ListChecks className="w-6 h-6 text-indigo-600" />
                <div className="text-left">
                  <div className="font-black text-gray-900 text-base leading-tight">
                    {copy.allMeds}
                  </div>
                  <div className="text-xs font-bold text-gray-500">
                    {copy.allMedsSub(patient.medications.length)}
                  </div>
                </div>
              </div>
              {showAll ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {showAll && (
              <ul className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-1.5">
                {patient.medications.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-start gap-2 text-sm font-bold text-gray-800"
                  >
                    <Pill
                      className={`w-4 h-4 ${pillByColor[m.color] ?? 'text-gray-500'} shrink-0 mt-0.5`}
                      fill="currentColor"
                    />
                    <span className="flex-1">
                      {m.plainName}{' '}
                      <span className="text-xs font-medium text-gray-500">({m.rawName})</span>
                    </span>
                    {m.isPrescription && (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white px-2 py-0.5 rounded-full">
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
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-6 h-6 text-amber-700" strokeWidth={2.5} />
              <div>
                <div className="font-black text-amber-900 text-base leading-tight">
                  {copy.upcoming}
                </div>
                <div className="text-xs font-bold text-amber-700">{copy.upcomingSub}</div>
              </div>
            </div>
            <ul className="space-y-2">
              {upcoming.map((m) => (
                <li
                  key={m.id}
                  className="bg-white rounded-2xl p-3 border border-amber-200 flex items-center gap-3"
                >
                  <Pill
                    className={`w-6 h-6 ${pillByColor[m.color] ?? 'text-gray-500'} shrink-0`}
                    fill="currentColor"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-gray-900 text-base leading-tight truncate">
                      {m.plainName}
                    </div>
                    <div className="text-xs font-bold text-gray-500 truncate">{m.rawName}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pickup support (collapsible) */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
          <button
            onClick={() => setShowPickupSupport((v) => !v)}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Languages className="w-6 h-6 text-indigo-600" />
              <div className="text-left">
                <div className="font-black text-gray-900 text-base leading-tight">
                  {copy.pickupSupport}
                </div>
                <div className="text-xs font-bold text-gray-500">{copy.pickupSupportSub}</div>
              </div>
            </div>
            {showPickupSupport ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {showPickupSupport && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
              <button
                type="button"
                disabled
                className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3 flex items-center gap-3 opacity-90"
              >
                <MessageCircleQuestion className="w-6 h-6 text-indigo-700" strokeWidth={2.5} />
                <div className="text-left">
                  <div className="font-black text-indigo-900 text-sm">{copy.agentHelp}</div>
                  <div className="text-xs font-bold text-indigo-700">{copy.agentHelpSub}</div>
                </div>
              </button>

              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                  {copy.askPharmacist}
                </div>
                <ul className="space-y-1.5">
                  {copy.pharmacistAsk.map((q, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-bold text-gray-800 bg-gray-50 rounded-xl p-2.5 border border-gray-200"
                    >
                      <MessageCircleQuestion className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                  {copy.translation}
                </div>
                <ul className="space-y-1.5">
                  {copy.phrases.map((p, i) => (
                    <li
                      key={i}
                      className="bg-blue-50 border border-blue-200 rounded-xl p-2.5"
                    >
                      <div className="text-xs font-bold text-blue-700">EN</div>
                      <div className="font-bold text-blue-900 text-sm">{p.en}</div>
                      <div className="text-xs font-bold text-blue-700 mt-1.5">ES</div>
                      <div className="font-bold text-blue-900 text-sm">{p.es}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Pickup checklist */}
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-indigo-700" strokeWidth={2.5} />
              <h2 className="font-black text-base text-gray-900">{copy.checklist}</h2>
            </div>
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              {copy.checklistSub(checkedCount, checklistItems.length)}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
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
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" strokeWidth={2.5} />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 shrink-0" strokeWidth={2.5} />
                    )}
                    <span
                      className={`font-bold text-base ${
                        done ? 'text-green-900 line-through' : 'text-gray-900'
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
              className={`rounded-3xl p-6 border-2 ${bgByColor[med.color] ?? 'bg-gray-50'} shadow-sm`}
            >
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
                    <Pill
                      key={i}
                      className={`w-8 h-8 ${pillByColor[med.color] ?? 'text-gray-500'}`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <span className="font-black text-lg text-gray-800">= {med.amount}</span>
              </div>

              {med.dose && (
                <div className="bg-white p-3 rounded-xl border border-gray-100 font-bold text-gray-800 text-base mb-2">
                  {med.dose}
                </div>
              )}

              {range && <DoseRangeBar low={range.low} high={range.high} unit={range.unit} />}

              <div className="flex items-start gap-3 text-gray-800 bg-white p-3 rounded-xl border border-gray-100 mt-2">
                <IconForMed med={med} />
                <span className="font-bold text-base leading-snug">{med.notePlain}</span>
              </div>

              {med.frequency && (
                <div className="flex items-start gap-3 text-red-800 bg-red-50 p-3 rounded-xl border border-red-200 mt-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-bold text-base leading-snug">{med.frequency}</span>
                </div>
              )}

              {/* How to use dropdown */}
              <button
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, [med.id]: !prev[med.id] }))
                }
                className="mt-3 w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 active:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span className="font-black text-sm text-gray-800">{copy.howToUse}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {isOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded-xl p-3 space-y-2 text-sm font-medium text-gray-800 leading-relaxed">
                  {med.route && (
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                        Route
                      </span>
                      <div className="font-bold text-gray-800">{med.route}</div>
                    </div>
                  )}
                  {med.frequency && (
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                        Frequency
                      </span>
                      <div className="font-bold text-gray-800">{med.frequency}</div>
                    </div>
                  )}
                  <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-2.5">
                    <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">
                      {copy.moreInfo}
                    </div>
                    <div className="text-gray-600 leading-snug">{copy.moreInfoBody}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
