import React, { useState, useMemo } from 'react';
import {
  Phone,
  ExternalLink,
  MapPin,
  Utensils,
  Car,
  Brain,
  Home,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Languages,
  Baby,
  Accessibility,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { recommendedFor, programsByCategory, scoreProgramFor } from '../data/programs';
import type { Program, ProgramCategory, ProgramScore } from '../data/types';

type TabKey = 'recommended' | ProgramCategory;

const CATEGORY_META: Record<ProgramCategory, { icon: typeof Utensils; bg: string; text: string; chip: string }> = {
  food: { icon: Utensils, bg: 'bg-orange-100', text: 'text-orange-700', chip: 'bg-orange-50 border-orange-200' },
  transportation: { icon: Car, bg: 'bg-blue-100', text: 'text-blue-700', chip: 'bg-blue-50 border-blue-200' },
  therapy: { icon: Brain, bg: 'bg-purple-100', text: 'text-purple-700', chip: 'bg-purple-50 border-purple-200' },
  housing: { icon: Home, bg: 'bg-green-100', text: 'text-green-700', chip: 'bg-green-50 border-green-200' },
};

export function Resources() {
  const { lang } = useLanguage();
  const { patient } = usePatient();
  const [tab, setTab] = useState<TabKey>('recommended');

  if (!patient) return null;

  const copy = {
    en: {
      title: 'Help & Services',
      subtitle: 'Free and low-cost programs near you',
      recommended: 'For you',
      food: 'Food',
      transportation: 'Rides',
      therapy: 'Therapy',
      housing: 'Housing',
      pickedFor: 'Picked for ' + patient.name.split(' ')[0],
      whyMatch: 'Why this fits',
      languageMatch: 'Speaks ' + patient.preferredLanguage,
      open: 'Open today',
      limited: 'Limited spots',
      full: 'Waitlist',
      free: 'Free',
      callNow: 'Call',
      directions: 'Directions',
      website: 'Website',
      childFriendly: 'Kid-friendly',
      ada: 'Wheelchair access',
      noPrograms: 'No programs in this category yet.',
      slots: 'spots open',
      wait: 'day wait',
      waitMany: 'days wait',
    },
    es: {
      title: 'Ayuda y Servicios',
      subtitle: 'Programas gratis o de bajo costo cerca de usted',
      recommended: 'Para ti',
      food: 'Comida',
      transportation: 'Transporte',
      therapy: 'Terapia',
      housing: 'Vivienda',
      pickedFor: 'Elegido para ' + patient.name.split(' ')[0],
      whyMatch: 'Por qué te sirve',
      languageMatch: 'Habla ' + patient.preferredLanguage,
      open: 'Abierto hoy',
      limited: 'Pocos lugares',
      full: 'Lista de espera',
      free: 'Gratis',
      callNow: 'Llamar',
      directions: 'Cómo llegar',
      website: 'Sitio web',
      childFriendly: 'Para niños',
      ada: 'Acceso para silla',
      noPrograms: 'No hay programas en esta categoría todavía.',
      slots: 'lugares',
      wait: 'día de espera',
      waitMany: 'días de espera',
    },
  }[lang];

  const recommended = useMemo(() => recommendedFor(patient, 6), [patient]);
  const list: ProgramScore[] = useMemo(() => {
    if (tab === 'recommended') return recommended;
    return programsByCategory(tab as ProgramCategory, patient).slice(0, 30);
  }, [tab, patient, recommended]);

  const tabs: { key: TabKey; label: string; icon: typeof Utensils }[] = [
    { key: 'recommended', label: copy.recommended, icon: Sparkles },
    { key: 'food', label: copy.food, icon: Utensils },
    { key: 'transportation', label: copy.transportation, icon: Car },
    { key: 'therapy', label: copy.therapy, icon: Brain },
    { key: 'housing', label: copy.housing, icon: Home },
  ];

  return (
    <div className="flex flex-col h-full bg-white pb-28">
      <div className="bg-white px-5 py-6 border-b-2 border-gray-100 sticky top-0 z-10">
        <h1 className="text-3xl font-black text-gray-900">{copy.title}</h1>
        <p className="text-base font-bold text-gray-500 mt-1">{copy.subtitle}</p>

        <div className="flex gap-2 mt-4 -mx-5 px-5 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm border-2 active:scale-95 transition-transform ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-700'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {tab === 'recommended' && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-4 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-indigo-600 shrink-0" />
            <div>
              <div className="font-black text-indigo-900 text-base leading-tight">{copy.pickedFor}</div>
              <div className="text-sm font-bold text-indigo-700 leading-snug">
                {patient.preferredLanguage} · {patient.diagnosisPlain}
              </div>
            </div>
          </div>
        )}

        {list.length === 0 && (
          <div className="text-center text-gray-500 font-bold py-12">{copy.noPrograms}</div>
        )}

        {list.map((entry) => (
          <ProgramCard key={entry.program.id} entry={entry} patient={patient} copy={copy} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function ProgramCard({
  entry,
  patient,
  copy,
  lang,
}: {
  entry: ProgramScore;
  patient: ReturnType<typeof usePatient>['patient'];
  copy: any;
  lang: 'en' | 'es';
}) {
  const p = entry.program;
  const meta = CATEGORY_META[p.category];
  const Icon = meta.icon;

  // Always recompute reasons in current language so toggling re-renders correctly
  const liveReasons = patient ? scoreProgramFor(p, patient).reasons : entry.reasons;

  const tel = p.phone.replace(/[^0-9+]/g, '');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`;

  return (
    <div className={`rounded-3xl p-5 border-2 shadow-sm ${meta.chip}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`${meta.bg} p-3 rounded-2xl shrink-0`}>
          <Icon className={`w-7 h-7 ${meta.text}`} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-black uppercase tracking-widest ${meta.text}`}>
            {p.subcategory.replace(/_/g, ' ')}
          </div>
          <h3 className="font-black text-xl text-gray-900 leading-tight mt-0.5">{p.name}</h3>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <AvailabilityBadge status={p.availabilityStatus} slots={p.availableSlots} waitDays={p.waitDays} copy={copy} />
        {p.cost === 0 && (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-black text-xs px-3 py-1.5 rounded-full border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> {copy.free}
          </span>
        )}
        {p.languages.length > 0 && p.languages.some((l) => l !== 'en') && (
          <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 font-black text-xs px-3 py-1.5 rounded-full border border-indigo-200">
            <Languages className="w-3.5 h-3.5" /> {p.languages.slice(0, 4).join(' · ')}
          </span>
        )}
        {p.childFriendly && (
          <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 font-black text-xs px-3 py-1.5 rounded-full border border-pink-200">
            <Baby className="w-3.5 h-3.5" /> {copy.childFriendly}
          </span>
        )}
        {p.adaAccessible && (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-black text-xs px-3 py-1.5 rounded-full border border-blue-200">
            <Accessibility className="w-3.5 h-3.5" /> {copy.ada}
          </span>
        )}
      </div>

      {/* Why this fits */}
      {liveReasons.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-3">
          <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">{copy.whyMatch}</div>
          <ul className="space-y-1">
            {liveReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /> {r[lang]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Address */}
      {p.address && (
        <div className="flex items-start gap-2 text-gray-600 text-sm font-bold mb-3">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-snug">{p.address}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {p.phone && (
          <a
            href={`tel:${tel}`}
            className="w-full bg-green-600 text-white font-black text-lg py-3 px-5 rounded-2xl flex items-center justify-center gap-3 border-b-4 border-green-800 active:scale-95 shadow-md"
          >
            <Phone className="w-6 h-6" strokeWidth={2.5} /> {copy.callNow} {p.phone}
          </a>
        )}
        <div className="flex gap-2">
          {p.address && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white text-gray-800 font-bold text-sm py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 border-2 border-gray-200 active:scale-95"
            >
              <MapPin className="w-4 h-4" /> {copy.directions}
            </a>
          )}
          {p.website && (
            <a
              href={p.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white text-gray-800 font-bold text-sm py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 border-2 border-gray-200 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" /> {copy.website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function AvailabilityBadge({
  status,
  slots,
  waitDays,
  copy,
}: {
  status: Program['availabilityStatus'];
  slots: number;
  waitDays: number;
  copy: any;
}) {
  if (status === 'open') {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-black text-xs px-3 py-1.5 rounded-full border border-green-200">
        <CheckCircle2 className="w-3.5 h-3.5" /> {copy.open}
        {slots > 0 ? ` · ${slots} ${copy.slots}` : ''}
      </span>
    );
  }
  if (status === 'limited') {
    return (
      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 font-black text-xs px-3 py-1.5 rounded-full border border-yellow-200">
        <Clock className="w-3.5 h-3.5" /> {copy.limited}
        {waitDays > 0 ? ` · ${waitDays} ${waitDays === 1 ? copy.wait : copy.waitMany}` : ''}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-black text-xs px-3 py-1.5 rounded-full border border-red-200">
      <XCircle className="w-3.5 h-3.5" /> {copy.full}
      {waitDays > 0 ? ` · ${waitDays} ${waitDays === 1 ? copy.wait : copy.waitMany}` : ''}
    </span>
  );
}
