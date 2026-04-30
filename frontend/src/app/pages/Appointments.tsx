import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Car,
  Heart,
  ChevronDown,
  ChevronUp,
  ListChecks,
  CheckCircle2,
  Circle,
  CalendarPlus,
  MessageCircleQuestion,
} from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import type { Appointment } from '../data/types';

function buildICS(apt: Appointment, patientName: string): string {
  const start = apt.dateISO ? parseISO(apt.dateISO) : null;
  if (!start || !isValid(start)) return '';
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CareToHome//EN',
    'BEGIN:VEVENT',
    `UID:${apt.id}@caretohome`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${apt.specialty} - ${patientName}`,
    `LOCATION:${apt.location ?? ''}`,
    `DESCRIPTION:${apt.doctor ?? ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);
}

export function Appointments() {
  const { lang } = useLanguage();
  const { patient } = usePatient();
  const dateLocale = lang === 'es' ? es : enUS;

  const [showWhy, setShowWhy] = useState(false);
  const [showPrep, setShowPrep] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [prep, setPrep] = useState<Record<string, boolean>>({});

  const prepKey = patient ? `cth.apptPrep.${patient.id}` : null;

  useEffect(() => {
    if (!prepKey) return;
    try {
      const raw = localStorage.getItem(prepKey);
      setPrep(raw ? JSON.parse(raw) : {});
    } catch {
      setPrep({});
    }
  }, [prepKey]);

  const togglePrep = (id: string) => {
    setPrep((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        if (prepKey) localStorage.setItem(prepKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (!patient) return null;

  const copy = {
    en: {
      title: 'Appointments',
      subtitle: 'Follow-up visits',
      needRide: 'I need a ride',
      noAppts: 'No upcoming appointments',
      whyTitle: 'Why follow-ups matter',
      whySub: 'The number-one reason kids return to the hospital',
      whyBody:
        'Follow-up visits catch problems early — slow healing, side effects, or new symptoms. Missing them is the most common reason a child ends up back in the hospital. Going to every visit keeps your child safer and saves time, money, and worry later.',
      prepTitle: 'Before the appointment',
      prepSub: 'Bring these things',
      prepItems: [
        'Insurance card and photo ID',
        'List of current medicines',
        'Notes about new symptoms',
        'Questions you want to ask',
        'Snack and water for your child',
      ],
      countOne: '1 appointment scheduled',
      countMany: (n: number) => `${n} appointments scheduled`,
      countNone: 'No appointments scheduled',
      askTitle: 'What to say at the visit',
      askSub: 'Helpful prompts and questions',
      askItems: [
        '"My child has been feeling…"',
        '"What should I watch for at home?"',
        '"When should I call you next?"',
        '"Can you write down the next steps?"',
        '"Is there anything we should stop doing?"',
      ],
      addCal: 'Add to calendar',
    },
    es: {
      title: 'Citas',
      subtitle: 'Visitas de seguimiento',
      needRide: 'Necesito transporte',
      noAppts: 'No hay citas próximas',
      whyTitle: 'Por qué importan las citas de seguimiento',
      whySub: 'La razón #1 por la que los niños regresan al hospital',
      whyBody:
        'Las citas de seguimiento detectan problemas a tiempo — sanación lenta, efectos secundarios o síntomas nuevos. No ir es la razón más común por la que un niño regresa al hospital. Ir a cada visita mantiene a su hijo/a más seguro/a y ahorra tiempo, dinero y preocupación.',
      prepTitle: 'Antes de la cita',
      prepSub: 'Lleva estas cosas',
      prepItems: [
        'Tarjeta de seguro e identificación',
        'Lista de medicinas actuales',
        'Notas sobre síntomas nuevos',
        'Preguntas que quieres hacer',
        'Snack y agua para tu hijo/a',
      ],
      countOne: '1 cita programada',
      countMany: (n: number) => `${n} citas programadas`,
      countNone: 'No hay citas programadas',
      askTitle: 'Qué decir en la cita',
      askSub: 'Frases y preguntas útiles',
      askItems: [
        '"Mi hijo/a se ha estado sintiendo…"',
        '"¿Qué debo vigilar en casa?"',
        '"¿Cuándo debo llamarle de nuevo?"',
        '"¿Puede escribir los próximos pasos?"',
        '"¿Hay algo que debamos dejar de hacer?"',
      ],
      addCal: 'Añadir al calendario',
    },
  }[lang];

  const checkedCount = copy.prepItems.filter((_, i) => prep[`p-${i}`]).length;
  const checkPct = Math.round((checkedCount / copy.prepItems.length) * 100);

  return (
    <div className="flex flex-col h-full bg-paper-raised pb-28">
      <div className="bg-paper-raised px-5 py-6 border-b border-hairline sticky top-0 z-10">
        <h1 className="font-display text-3xl font-bold text-ink tracking-tight">{copy.title}</h1>
        <p className="text-base font-medium text-ink-soft mt-1">{copy.subtitle}</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-brand-soft border border-hairline px-3 py-1.5 rounded-full">
          <Calendar className="w-4 h-4 text-brand" strokeWidth={1.75} aria-hidden="true" />
          <span className="text-sm font-bold text-brand tabular">
            {patient.appointments.length === 0
              ? copy.countNone
              : patient.appointments.length === 1
              ? copy.countOne
              : copy.countMany(patient.appointments.length)}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Why follow-ups matter (collapsible) */}
        <div className="bg-accent-warm-soft border-2 border-accent-warm/40 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowWhy((v) => !v)}
            className="w-full flex items-center justify-between p-4 active:bg-accent-warm-soft"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-ink" strokeWidth={2.5} />
              <div className="text-left">
                <div className="font-bold text-ink text-base leading-tight">
                  {copy.whyTitle}
                </div>
                <div className="text-xs font-bold text-ink">{copy.whySub}</div>
              </div>
            </div>
            {showWhy ? (
              <ChevronUp className="w-5 h-5 text-ink" />
            ) : (
              <ChevronDown className="w-5 h-5 text-ink" />
            )}
          </button>
          {showWhy && (
            <div className="px-4 pb-4 pt-2 border-t border-accent-warm/40 text-sm font-medium text-ink leading-relaxed">
              {copy.whyBody}
            </div>
          )}
        </div>

        {/* Pre-appointment checklist */}
        <div className="bg-paper-raised border border-hairline rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowPrep((v) => !v)}
            className="w-full flex items-center justify-between p-4 active:bg-paper-sunken/60"
          >
            <div className="flex items-center gap-3">
              <ListChecks className="w-6 h-6 text-brand" strokeWidth={2.5} />
              <div className="text-left">
                <div className="font-bold text-ink text-base leading-tight">
                  {copy.prepTitle}
                </div>
                <div className="text-xs font-bold text-ink-soft">{copy.prepSub}</div>
              </div>
            </div>
            {showPrep ? (
              <ChevronUp className="w-5 h-5 text-ink-soft" />
            ) : (
              <ChevronDown className="w-5 h-5 text-ink-soft" />
            )}
          </button>
          {showPrep && (
            <div className="px-4 pb-4 pt-3 border-t border-hairline">
              <div className="h-2 bg-paper-sunken rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-brand transition-all"
                  style={{ width: `${checkPct}%` }}
                />
              </div>
              <ul className="space-y-2">
                {copy.prepItems.map((item, i) => {
                  const id = `p-${i}`;
                  const done = !!prep[id];
                  return (
                    <li key={id}>
                      <button
                        onClick={() => togglePrep(id)}
                        className={`w-full text-left rounded-2xl p-3 flex items-center gap-3 border-2 active:scale-[0.99] ${
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
          )}
        </div>

        {/* What to say */}
        <div className="bg-paper-raised border border-hairline rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowAsk((v) => !v)}
            className="w-full flex items-center justify-between p-4 active:bg-paper-sunken/60"
          >
            <div className="flex items-center gap-3">
              <MessageCircleQuestion className="w-6 h-6 text-info" strokeWidth={2.5} />
              <div className="text-left">
                <div className="font-bold text-ink text-base leading-tight">
                  {copy.askTitle}
                </div>
                <div className="text-xs font-bold text-ink-soft">{copy.askSub}</div>
              </div>
            </div>
            {showAsk ? (
              <ChevronUp className="w-5 h-5 text-ink-soft" />
            ) : (
              <ChevronDown className="w-5 h-5 text-ink-soft" />
            )}
          </button>
          {showAsk && (
            <ul className="px-4 pb-4 pt-3 space-y-1.5 border-t border-hairline">
              {copy.askItems.map((q, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm font-bold text-ink bg-info-soft rounded-xl p-2.5 border border-blue-100"
                >
                  <MessageCircleQuestion className="w-4 h-4 text-info shrink-0 mt-0.5" />
                  {q}
                </li>
              ))}
            </ul>
          )}
        </div>

        {patient.appointments.length === 0 && (
          <div className="text-center text-ink-soft font-bold py-12">{copy.noAppts}</div>
        )}
        {patient.appointments.map((apt) => {
          const aptDate = apt.dateISO ? parseISO(apt.dateISO) : null;
          const validDate = aptDate && isValid(aptDate);
          const ics = buildICS(apt, patient.name);
          return (
            <div
              key={apt.id}
              className="bg-paper-raised rounded-2xl overflow-hidden  border border-hairline"
            >
              <div className="bg-brand px-6 py-4 flex items-center gap-4 text-white">
                <div className="bg-brand-hover p-3 rounded-2xl">
                  <Calendar className="w-9 h-9 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-fg/85 uppercase tracking-[0.12em]">
                    {validDate ? format(aptDate!, 'EEEE', { locale: dateLocale }) : ''}
                  </span>
                  <div className="text-2xl font-bold leading-tight">
                    {validDate ? format(aptDate!, 'MMMM d', { locale: dateLocale }) : 'Date TBD'}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-2xl text-ink mb-4 leading-tight">
                  {apt.specialty}
                </h3>

                <div className="space-y-3">
                  {validDate && (
                    <div className="flex items-center gap-3 text-ink-soft bg-paper-sunken/60 p-3 rounded-2xl border border-hairline">
                      <Clock className="w-7 h-7 text-brand" />
                      <span className="font-bold text-xl">{format(aptDate!, 'h:mm a')}</span>
                    </div>
                  )}
                  {apt.doctor && (
                    <div className="flex items-center gap-3 text-ink-soft bg-paper-sunken/60 p-3 rounded-2xl border border-hairline">
                      <User className="w-7 h-7 text-brand" />
                      <span className="font-bold text-lg">{apt.doctor}</span>
                    </div>
                  )}
                  {apt.location && (
                    <div className="flex items-start gap-3 text-ink-soft bg-paper-sunken/60 p-3 rounded-2xl border border-hairline">
                      <MapPin className="w-7 h-7 text-brand shrink-0" />
                      <span className="font-bold text-lg leading-snug">{apt.location}</span>
                    </div>
                  )}
                </div>

                {ics && (
                  <a
                    href={ics}
                    download={`${apt.specialty.replace(/\s+/g, '-')}.ics`}
                    className="mt-4 w-full bg-paper-raised text-brand font-bold text-base py-3 px-5 rounded-2xl flex items-center justify-center gap-3 border border-hairline active:scale-95"
                  >
                    <CalendarPlus className="w-5 h-5" /> {copy.addCal}
                  </a>
                )}

                <Link
                  to="/resources"
                  className="mt-2 w-full bg-green-600 text-white font-bold text-lg py-3 px-5 rounded-2xl flex items-center justify-center gap-3 border-b-4 border-green-800 active:scale-95 "
                >
                  <Car className="w-6 h-6" /> {copy.needRide}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
