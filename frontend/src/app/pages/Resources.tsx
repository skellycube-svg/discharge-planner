import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
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
  Wand2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { recommendedFor, programsByCategory, scoreProgramFor } from '../data/programs';
import type { Program, ProgramCategory, ProgramScore } from '../data/types';
import { PERSONALIZE_KEY, type PersonalizeAnswers } from './PersonalizeQuiz';

type TabKey = 'recommended' | ProgramCategory;

const CATEGORY_META: Record<ProgramCategory, { icon: typeof Utensils; bg: string; text: string; chip: string }> = {
  food: { icon: Utensils, bg: 'bg-orange-100', text: 'text-orange-700', chip: 'bg-orange-50 border-orange-200' },
  transportation: { icon: Car, bg: 'bg-blue-100', text: 'text-brand', chip: 'bg-info-soft border-info/30' },
  therapy: { icon: Brain, bg: 'bg-accent-warm-soft', text: 'text-ink', chip: 'bg-accent-warm-soft border-accent-warm/40' },
  housing: { icon: Home, bg: 'bg-green-100', text: 'text-ok', chip: 'bg-ok-soft border-ok/30' },
};

export function Resources() {
  const { lang } = useLanguage();
  const { patient } = usePatient();
  const [tab, setTab] = useState<TabKey>('recommended');
  const [answers, setAnswers] = useState<PersonalizeAnswers | null>(null);
  const [cardIdx, setCardIdx] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PERSONALIZE_KEY);
      if (raw) setAnswers(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

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
      personalize: 'Personalize results',
      personalizeSub: 'Answer 5 quick questions',
      personalized: 'Personalized for you',
      retake: 'Update answers',
      getRide: 'Get a ride',
      getRideSub: 'Free or low-cost transportation to appointments',
      previous: 'Previous program',
      next: 'Next program',
      ofLabel: 'of',
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
      personalize: 'Personalizar resultados',
      personalizeSub: 'Responde 5 preguntas rápidas',
      personalized: 'Personalizado para ti',
      retake: 'Actualizar respuestas',
      getRide: 'Conseguir transporte',
      getRideSub: 'Viajes gratis o de bajo costo a las citas',
      previous: 'Programa anterior',
      next: 'Programa siguiente',
      ofLabel: 'de',
    },
  }[lang];

  const zipMatches = (program: { zipCodesServed: string[]; servesAllOC: boolean }, zip: string) => {
    if (!zip) return true;
    if (program.servesAllOC) return true;
    return program.zipCodesServed.includes(zip);
  };

  const allowedCategories = useMemo<ProgramCategory[] | null>(() => {
    if (!answers) return null;
    const yes: ProgramCategory[] = [];
    if (answers.needsFood === 'yes') yes.push('food');
    if (answers.needsTransport === 'yes') yes.push('transportation');
    if (answers.needsTherapy === 'yes') yes.push('therapy');
    if (answers.needsHousing === 'yes') yes.push('housing');
    if (yes.length > 0) return yes;
    const anyAnswered =
      answers.needsFood || answers.needsTransport || answers.needsTherapy || answers.needsHousing;
    return anyAnswered ? [] : null;
  }, [answers]);

  const effectiveZip = answers?.zip ?? '';

  const recommended = useMemo(() => {
    const baseSize = answers ? 12 : 6;
    const list = recommendedFor(patient, 50);
    const filtered = list.filter((s) => {
      if (!zipMatches(s.program, effectiveZip)) return false;
      if (allowedCategories && !allowedCategories.includes(s.program.category)) return false;
      return true;
    });
    return filtered.slice(0, baseSize);
  }, [patient, answers, allowedCategories, effectiveZip]);

  const list: ProgramScore[] = useMemo(() => {
    if (tab === 'recommended') return recommended;
    return programsByCategory(tab as ProgramCategory, patient)
      .filter((s) => zipMatches(s.program, effectiveZip))
      .slice(0, 30);
  }, [tab, patient, recommended, effectiveZip]);

  useEffect(() => {
    setCardIdx(0);
  }, [tab, list.length]);

  const safeIdx = list.length === 0 ? 0 : Math.min(cardIdx, list.length - 1);
  const goPrev = () => setCardIdx((i) => (i - 1 + list.length) % list.length);
  const goNext = () => setCardIdx((i) => (i + 1) % list.length);

  const tabs: { key: TabKey; label: string; icon: typeof Utensils }[] = [
    { key: 'recommended', label: copy.recommended, icon: Sparkles },
    { key: 'food', label: copy.food, icon: Utensils },
    { key: 'transportation', label: copy.transportation, icon: Car },
    { key: 'therapy', label: copy.therapy, icon: Brain },
    { key: 'housing', label: copy.housing, icon: Home },
  ];

  return (
    <div className="flex flex-col h-full bg-paper-raised pb-28">
      <div className="bg-paper-raised px-5 py-6 border-b border-hairline sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-ink">{copy.title}</h1>
        <p className="text-base font-bold text-ink-soft mt-1">{copy.subtitle}</p>

        <div className="flex gap-2 mt-4 -mx-5 px-5 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border-2 active:scale-95 transition-transform ${
                  isActive
                    ? 'bg-brand text-white border-brand'
                    : 'bg-paper-raised text-ink-soft border-hairline'
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Get a ride — always visible CTA */}
        <Link
          to="/resources?tab=transportation"
          onClick={(e) => {
            e.preventDefault();
            setTab('transportation');
          }}
          className="bg-ok text-white rounded-2xl p-5 flex items-center gap-4 border-b-4 border-emerald-800 active:scale-[0.98] "
        >
          <div className="bg-white/20 p-3 rounded-2xl shrink-0">
            <Car className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-xl leading-tight">{copy.getRide}</div>
            <div className="text-sm font-bold text-emerald-50 leading-snug mt-0.5">
              {copy.getRideSub}
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-white/80 shrink-0" />
        </Link>

        {/* Personalize CTA — only shown when the user hasn't answered yet */}
        {!answers && (
          <Link
            to="/resources/personalize"
            className="bg-paper-raised border-2 border-dashed border-hairline-strong rounded-2xl p-4 flex items-center gap-3 active:bg-brand-soft"
          >
            <div className="bg-brand-soft p-2 rounded-xl shrink-0">
              <Wand2 className="w-5 h-5 text-brand" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-brand text-base leading-tight">
                {copy.personalize}
              </div>
              <div className="text-xs font-bold text-brand">{copy.personalizeSub}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-secondary shrink-0" aria-hidden="true" />
          </Link>
        )}

        {/* Picked-for panel — also doubles as the "update answers" entry once personalized */}
        {tab === 'recommended' && (
          answers ? (
            <Link
              to="/resources/personalize"
              className="bg-brand-soft border border-hairline rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98]"
              aria-label={`${copy.pickedFor} — ${copy.retake}`}
            >
              <Sparkles className="w-7 h-7 text-brand shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-brand text-base leading-tight">{copy.pickedFor}</div>
                <div className="text-sm font-bold text-brand leading-snug">
                  {patient.preferredLanguage} · {patient.diagnosisPlain}
                </div>
                <div className="text-xs font-semibold text-brand-secondary mt-1 inline-flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" /> {copy.retake}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-secondary shrink-0" aria-hidden="true" />
            </Link>
          ) : (
            <div className="bg-brand-soft border border-hairline rounded-2xl p-4 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-brand shrink-0" aria-hidden="true" />
              <div>
                <div className="font-bold text-brand text-base leading-tight">{copy.pickedFor}</div>
                <div className="text-sm font-bold text-brand leading-snug">
                  {patient.preferredLanguage} · {patient.diagnosisPlain}
                </div>
              </div>
            </div>
          )
        )}

        {list.length === 0 ? (
          <div className="text-center text-ink-soft font-bold py-12">{copy.noPrograms}</div>
        ) : (
          <div>
            {/* Carousel controls */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <button
                onClick={goPrev}
                disabled={list.length <= 1}
                aria-label={copy.previous}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-brand text-brand-fg active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={2.25} aria-hidden="true" />
              </button>
              <div
                className="font-display font-bold text-base text-ink tabular"
                aria-live="polite"
                aria-atomic="true"
              >
                {safeIdx + 1} <span className="text-ink-soft font-medium">{copy.ofLabel}</span> {list.length}
              </div>
              <button
                onClick={goNext}
                disabled={list.length <= 1}
                aria-label={copy.next}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-brand text-brand-fg active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={2.25} aria-hidden="true" />
              </button>
            </div>

            {/* Single visible card */}
            <ProgramCard
              key={list[safeIdx].program.id}
              entry={list[safeIdx]}
              patient={patient}
              copy={copy}
              lang={lang}
            />

            {/* Pagination dots — only when count is small enough to be readable */}
            {list.length > 1 && list.length <= 10 && (
              <div className="flex items-center justify-center gap-1.5 mt-4" role="tablist" aria-label="Program pages">
                {list.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === safeIdx}
                    aria-label={`${i + 1} ${copy.ofLabel} ${list.length}`}
                    onClick={() => setCardIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === safeIdx ? 'w-6 bg-brand' : 'w-2 bg-hairline-strong'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
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
    <div className={`rounded-2xl p-5 border-2  ${meta.chip}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`${meta.bg} p-3 rounded-2xl shrink-0`}>
          <Icon className={`w-7 h-7 ${meta.text}`} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-bold uppercase tracking-[0.12em] ${meta.text}`}>
            {p.subcategory.replace(/_/g, ' ')}
          </div>
          <h3 className="font-bold text-xl text-ink leading-tight mt-0.5">{p.name}</h3>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <AvailabilityBadge status={p.availabilityStatus} slots={p.availableSlots} waitDays={p.waitDays} copy={copy} />
        {p.cost === 0 && (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-bold text-xs px-3 py-1.5 rounded-full border border-ok/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> {copy.free}
          </span>
        )}
        {p.languages.length > 0 && p.languages.some((l) => l !== 'en') && (
          <span className="inline-flex items-center gap-1 bg-brand-soft text-brand font-bold text-xs px-3 py-1.5 rounded-full border border-hairline">
            <Languages className="w-3.5 h-3.5" /> {p.languages.slice(0, 4).join(' · ')}
          </span>
        )}
        {p.childFriendly && (
          <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-800 font-bold text-xs px-3 py-1.5 rounded-full border border-pink-200">
            <Baby className="w-3.5 h-3.5" /> {copy.childFriendly}
          </span>
        )}
        {p.adaAccessible && (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-bold text-xs px-3 py-1.5 rounded-full border border-info/30">
            <Accessibility className="w-3.5 h-3.5" /> {copy.ada}
          </span>
        )}
      </div>

      {/* Why this fits */}
      {liveReasons.length > 0 && (
        <div className="bg-paper-raised rounded-2xl border border-hairline p-3 mb-3">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft mb-1.5">{copy.whyMatch}</div>
          <ul className="space-y-1">
            {liveReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-bold text-ink">
                <CheckCircle2 className="w-4 h-4 text-ok shrink-0 mt-0.5" /> {r[lang]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Address */}
      {p.address && (
        <div className="flex items-start gap-2 text-ink-soft text-sm font-bold mb-3">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-snug">{p.address}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {p.phone && (
          <a
            href={`tel:${tel}`}
            className="w-full bg-green-600 text-white font-bold text-lg py-3 px-5 rounded-2xl flex items-center justify-center gap-3 border-b-4 border-green-800 active:scale-95 "
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
              className="flex-1 bg-paper-raised text-ink font-bold text-sm py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 border border-hairline active:scale-95"
            >
              <MapPin className="w-4 h-4" /> {copy.directions}
            </a>
          )}
          {p.website && (
            <a
              href={p.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-paper-raised text-ink font-bold text-sm py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 border border-hairline active:scale-95"
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
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-bold text-xs px-3 py-1.5 rounded-full border border-ok/30">
        <CheckCircle2 className="w-3.5 h-3.5" /> {copy.open}
        {slots > 0 ? ` · ${slots} ${copy.slots}` : ''}
      </span>
    );
  }
  if (status === 'limited') {
    return (
      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 font-bold text-xs px-3 py-1.5 rounded-full border border-yellow-200">
        <Clock className="w-3.5 h-3.5" /> {copy.limited}
        {waitDays > 0 ? ` · ${waitDays} ${waitDays === 1 ? copy.wait : copy.waitMany}` : ''}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-red-100 text-ink font-bold text-xs px-3 py-1.5 rounded-full border border-danger/30">
      <XCircle className="w-3.5 h-3.5" /> {copy.full}
      {waitDays > 0 ? ` · ${waitDays} ${waitDays === 1 ? copy.wait : copy.waitMany}` : ''}
    </span>
  );
}
