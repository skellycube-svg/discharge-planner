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
    <div className="flex flex-col h-full bg-white pb-28">
      <div className="bg-white px-5 py-6 border-b-2 border-gray-100 sticky top-0 z-10">
        <h1 className="text-3xl font-black text-gray-900">{copy.title}</h1>
        <p className="text-lg font-bold text-gray-500 mt-1">{copy.subtitle}</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Why follow-ups matter (collapsible) */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl overflow-hidden">
          <button
            onClick={() => setShowWhy((v) => !v)}
            className="w-full flex items-center justify-between p-4 active:bg-purple-100"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-purple-700" strokeWidth={2.5} />
              <div className="text-left">
                <div className="font-black text-purple-900 text-base leading-tight">
                  {copy.whyTitle}
                </div>
                <div className="text-xs font-bold text-purple-700">{copy.whySub}</div>
              </div>
            </div>
            {showWhy ? (
              <ChevronUp className="w-5 h-5 text-purple-700" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-700" />
            )}
          </button>
          {showWhy && (
            <div className="px-4 pb-4 pt-2 border-t border-purple-200 text-sm font-medium text-purple-900 leading-relaxed">
              {copy.whyBody}
            </div>
          )}
        </div>

        {/* Pre-appointment checklist */}
        <div className="bg-white border-2 border-indigo-200 rounded-3xl overflow-hidden">
          <button
            onClick={() => setShowPrep((v) => !v)}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <ListChecks className="w-6 h-6 text-indigo-600" strokeWidth={2.5} />
              <div className="text-left">
                <div className="font-black text-gray-900 text-base leading-tight">
                  {copy.prepTitle}
                </div>
                <div className="text-xs font-bold text-gray-500">{copy.prepSub}</div>
              </div>
            </div>
            {showPrep ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {showPrep && (
            <div className="px-4 pb-4 pt-3 border-t border-gray-100">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
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
          )}
        </div>

        {/* What to say */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
          <button
            onClick={() => setShowAsk((v) => !v)}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <MessageCircleQuestion className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
              <div className="text-left">
                <div className="font-black text-gray-900 text-base leading-tight">
                  {copy.askTitle}
                </div>
                <div className="text-xs font-bold text-gray-500">{copy.askSub}</div>
              </div>
            </div>
            {showAsk ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {showAsk && (
            <ul className="px-4 pb-4 pt-3 space-y-1.5 border-t border-gray-100">
              {copy.askItems.map((q, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm font-bold text-gray-800 bg-blue-50 rounded-xl p-2.5 border border-blue-100"
                >
                  <MessageCircleQuestion className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  {q}
                </li>
              ))}
            </ul>
          )}
        </div>

        {patient.appointments.length === 0 && (
          <div className="text-center text-gray-500 font-bold py-12">{copy.noAppts}</div>
        )}
        {patient.appointments.map((apt) => {
          const aptDate = apt.dateISO ? parseISO(apt.dateISO) : null;
          const validDate = aptDate && isValid(aptDate);
          const ics = buildICS(apt, patient.name);
          return (
            <div
              key={apt.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-gray-200"
            >
              <div className="bg-indigo-600 px-6 py-4 flex items-center gap-4 text-white">
                <div className="bg-indigo-800 p-3 rounded-2xl">
                  <Calendar className="w-9 h-9 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
                    {validDate ? format(aptDate!, 'EEEE', { locale: dateLocale }) : ''}
                  </span>
                  <div className="text-2xl font-black leading-tight">
                    {validDate ? format(aptDate!, 'MMMM d', { locale: dateLocale }) : 'Date TBD'}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-black text-2xl text-gray-900 mb-4 leading-tight">
                  {apt.specialty}
                </h3>

                <div className="space-y-3">
                  {validDate && (
                    <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <Clock className="w-7 h-7 text-indigo-600" />
                      <span className="font-bold text-xl">{format(aptDate!, 'h:mm a')}</span>
                    </div>
                  )}
                  {apt.doctor && (
                    <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <User className="w-7 h-7 text-indigo-600" />
                      <span className="font-bold text-lg">{apt.doctor}</span>
                    </div>
                  )}
                  {apt.location && (
                    <div className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <MapPin className="w-7 h-7 text-indigo-600 shrink-0" />
                      <span className="font-bold text-lg leading-snug">{apt.location}</span>
                    </div>
                  )}
                </div>

                {ics && (
                  <a
                    href={ics}
                    download={`${apt.specialty.replace(/\s+/g, '-')}.ics`}
                    className="mt-4 w-full bg-white text-indigo-700 font-bold text-base py-3 px-5 rounded-2xl flex items-center justify-center gap-3 border-2 border-indigo-200 active:scale-95"
                  >
                    <CalendarPlus className="w-5 h-5" /> {copy.addCal}
                  </a>
                )}

                <Link
                  to="/resources"
                  className="mt-2 w-full bg-green-600 text-white font-black text-lg py-3 px-5 rounded-2xl flex items-center justify-center gap-3 border-b-4 border-green-800 active:scale-95 shadow-md"
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
