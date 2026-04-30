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
  {
    q: { en: 'When can my child go back to school?', es: '¿Cuándo puede mi hijo/a volver a la escuela?' },
    a: {
      en: 'Most kids can return after they have been fever-free for 24 hours without medicine, can eat and drink normally, and have enough energy for a full school day. For surgery or broken bones, ask the doctor at the follow-up visit. The Summary page shows your child\'s condition — when in doubt, call the doctor before sending them back.',
      es: 'La mayoría puede volver cuando lleva 24 horas sin fiebre (sin medicina), come y bebe normal y tiene energía para todo el día escolar. Para cirugía o fracturas, pregunta al doctor en la cita de seguimiento. La página de Resumen muestra el estado de tu hijo/a — si tienes dudas, llama al doctor antes de mandarlo/a.',
    },
  },
  {
    q: { en: 'What does the school need to give medicine?', es: '¿Qué necesita la escuela para darle la medicina?' },
    a: {
      en: 'Most schools require: (1) a signed Medication Authorization form from the doctor, (2) the medicine in its original pharmacy bottle with your child\'s name, and (3) written instructions matching the bottle. Drop everything at the school nurse\'s office — never let your child carry medicine in their backpack unless the doctor signed a self-carry form (often for inhalers or EpiPens). Ask the office for the form on the first day back.',
      es: 'La mayoría de las escuelas piden: (1) una autorización médica firmada por el doctor, (2) la medicina en su frasco original de la farmacia con el nombre de tu hijo/a, y (3) instrucciones escritas que coincidan con el frasco. Lleva todo a la enfermera de la escuela — no dejes que el niño/a la lleve en la mochila a menos que el doctor firme un permiso (común para inhaladores o EpiPens). Pídele el formulario a la oficina el primer día de regreso.',
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
    <div className="flex flex-col h-full bg-paper pb-28">
      <div className="bg-paper-raised px-5 py-6 border-b border-hairline sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-brand" strokeWidth={1.75} aria-hidden="true" />
          <h1 className="font-display text-3xl font-bold text-ink tracking-tight">{copy.title}</h1>
        </div>
        <p className="text-base font-medium text-ink-soft mt-1">{copy.subtitle}</p>
      </div>

      <ul className="p-5 space-y-2">
        {FAQS.map((item, i) => {
          const isOpen = expanded === i;
          return (
            <li key={i} className="bg-paper-sunken/60 rounded-2xl border border-hairline overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full text-left px-4 py-3.5 flex items-start gap-3 active:bg-paper-sunken"
              >
                <span className="flex-1 font-bold text-ink text-base leading-snug">
                  {item.q[lang]}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-ink-soft shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ink-soft shrink-0 mt-0.5" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm font-medium text-ink-soft leading-relaxed border-t border-hairline pt-3">
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
