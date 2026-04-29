import React from 'react';
import { Link } from 'react-router';
import { Calendar, Clock, MapPin, User, Car } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';

export function Appointments() {
  const { lang } = useLanguage();
  const { patient } = usePatient();
  const dateLocale = lang === 'es' ? es : enUS;

  if (!patient) return null;

  const copy = {
    en: { title: 'Appointments', subtitle: 'Follow-up visits', needRide: 'I need a ride', noAppts: 'No upcoming appointments' },
    es: { title: 'Citas', subtitle: 'Visitas de seguimiento', needRide: 'Necesito transporte', noAppts: 'No hay citas próximas' },
  }[lang];

  return (
    <div className="flex flex-col h-full bg-white pb-28">
      <div className="bg-white px-5 py-6 border-b-2 border-gray-100 sticky top-0 z-10">
        <h1 className="text-3xl font-black text-gray-900">{copy.title}</h1>
        <p className="text-lg font-bold text-gray-500 mt-1">{copy.subtitle}</p>
      </div>

      <div className="p-5 space-y-5">
        {patient.appointments.length === 0 && (
          <div className="text-center text-gray-500 font-bold py-12">{copy.noAppts}</div>
        )}
        {patient.appointments.map((apt) => {
          const aptDate = apt.dateISO ? parseISO(apt.dateISO) : null;
          const validDate = aptDate && isValid(aptDate);
          return (
            <div key={apt.id} className="bg-white rounded-3xl overflow-hidden shadow-md border-2 border-gray-200">
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
                <h3 className="font-black text-2xl text-gray-900 mb-4 leading-tight">{apt.specialty}</h3>

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

                <Link
                  to="/resources"
                  className="mt-4 w-full bg-green-600 text-white font-black text-lg py-3 px-5 rounded-2xl flex items-center justify-center gap-3 border-b-4 border-green-800 active:scale-95 shadow-md"
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
