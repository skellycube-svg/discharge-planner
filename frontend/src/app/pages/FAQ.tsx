import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FAQS: { q: { en: string; es: string }; a: { en: string; es: string } }[] = [
  {
    q: { en: 'What if my child misses a dose?', es: '¿Qué pasa si mi hijo/a se salta una dosis?' },
    a: {
      en: 'Give it as soon as you remember. If it is almost time for the next dose, skip the missed one. Never give two doses at once.',
      es: 'Dáselo en cuanto lo recuerdes. Si ya casi es hora de la siguiente dosis, sáltate la dosis olvidada. Nunca des dos dosis a la vez.',
    },
  },
  {
    q: { en: 'How do I know when to call 911?', es: '¿Cómo sé cuándo llamar al 911?' },
    a: {
      en: 'Call 911 right away for trouble breathing, blue lips, seizure, or if your child is hard to wake up. The Warning Signs page lists every red-flag symptom.',
      es: 'Llama al 911 de inmediato por dificultad para respirar, labios azules, convulsiones o si es difícil despertar a tu hijo/a. La página de Señales de Alerta lista todos los síntomas de alarma.',
    },
  },
  {
    q: { en: 'Can I get help with a ride?', es: '¿Puedo conseguir ayuda con un viaje?' },
    a: {
      en: 'Yes. Open Resources and tap "Get a ride." We list free and low-cost transportation programs near you.',
      es: 'Sí. Abre Recursos y toca "Conseguir un viaje". Listamos programas gratuitos y de bajo costo cerca de ti.',
    },
  },
  {
    q: { en: 'What does "with food" really mean?', es: '¿Qué significa "con comida"?' },
    a: {
      en: 'Give the medicine during a meal or right after. Even crackers and milk count. This protects the stomach and helps the medicine work.',
      es: 'Dale la medicina durante una comida o justo después. Galletas y leche también cuentan. Esto protege el estómago y ayuda a que la medicina funcione.',
    },
  },
  {
    q: { en: 'My child speaks a language I do not — can the pharmacy help?', es: '¿Mi hijo/a habla otro idioma — puede ayudarme la farmacia?' },
    a: {
      en: 'Yes. Most pharmacies have free phone translation. Ask: "Do you have an interpreter line?" The Medications page has phrases you can show the pharmacist.',
      es: 'Sí. La mayoría de las farmacias tienen traducción telefónica gratis. Pregunta: "¿Tienen línea de intérprete?". La página de Medicinas tiene frases que puedes mostrarle al farmacéutico.',
    },
  },
  {
    q: { en: 'Why are follow-up appointments important?', es: '¿Por qué son importantes las citas de seguimiento?' },
    a: {
      en: 'Follow-ups catch problems early — slow healing, side effects, or new symptoms. Missing them is the most common reason kids end up back in the hospital.',
      es: 'Las citas de seguimiento detectan problemas a tiempo — sanación lenta, efectos secundarios o síntomas nuevos. No ir es la razón más común por la que los niños regresan al hospital.',
    },
  },
];

export function FAQ() {
  const { lang } = useLanguage();
  const [expanded, setExpanded] = useState<number | null>(0);

  const copy = {
    en: { title: 'FAQ', subtitle: 'Quick answers to common questions' },
    es: { title: 'Preguntas frecuentes', subtitle: 'Respuestas rápidas a preguntas comunes' },
  }[lang];

  return (
    <div className="flex flex-col h-full bg-white pb-28">
      <div className="bg-white px-5 py-6 border-b-2 border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-indigo-600" />
          <h1 className="text-3xl font-black text-gray-900">{copy.title}</h1>
        </div>
        <p className="text-base font-bold text-gray-500 mt-1">{copy.subtitle}</p>
      </div>

      <ul className="p-5 space-y-2">
        {FAQS.map((item, i) => {
          const isOpen = expanded === i;
          return (
            <li key={i} className="bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full text-left px-4 py-3.5 flex items-start gap-3 active:bg-gray-100"
              >
                <span className="flex-1 font-black text-gray-900 text-base leading-snug">
                  {item.q[lang]}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm font-medium text-gray-700 leading-relaxed border-t border-gray-200 pt-3">
                  {item.a[lang]}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
