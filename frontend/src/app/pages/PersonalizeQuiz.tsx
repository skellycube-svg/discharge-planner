import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PERSONALIZE_KEY = 'cth.personalize';

export interface PersonalizeAnswers {
  zip: string;
  needsTransport: 'yes' | 'no' | '';
  needsFood: 'yes' | 'no' | '';
  needsTherapy: 'yes' | 'no' | '';
  needsHousing: 'yes' | 'no' | '';
}

const EMPTY: PersonalizeAnswers = {
  zip: '',
  needsTransport: '',
  needsFood: '',
  needsTherapy: '',
  needsHousing: '',
};

type StepKey = keyof PersonalizeAnswers;

const STEPS: StepKey[] = ['zip', 'needsTransport', 'needsFood', 'needsTherapy', 'needsHousing'];

export function PersonalizeQuiz() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<PersonalizeAnswers>(EMPTY);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PERSONALIZE_KEY);
      if (raw) setAnswers({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const copy = {
    en: {
      title: 'Personalize results',
      subtitle: 'A few quick questions so we show what fits',
      back: 'Back',
      next: 'Next',
      save: 'Save & see results',
      skip: 'Skip',
      yes: 'Yes',
      no: 'No',
      questions: {
        zip: { q: 'What ZIP code do you live in?', sub: 'We use this to find programs near you.', placeholder: 'e.g. 92704' },
        needsTransport: { q: 'Do you need help getting to appointments?', sub: 'Free or low-cost rides for medical visits.' },
        needsFood: { q: 'Is buying groceries hard right now?', sub: "We'll show food banks and meal programs." },
        needsTherapy: { q: 'Could your child use therapy or counseling?', sub: 'Speech, physical, or mental-health support.' },
        needsHousing: { q: 'Do you need housing help?', sub: 'Rental aid, utility assistance, shelter.' },
      },
    },
    es: {
      title: 'Personalizar resultados',
      subtitle: 'Unas preguntas rápidas para mostrarte lo que sirve',
      back: 'Atrás',
      next: 'Siguiente',
      save: 'Guardar y ver resultados',
      skip: 'Saltar',
      yes: 'Sí',
      no: 'No',
      questions: {
        zip: { q: '¿En qué código postal vives?', sub: 'Lo usamos para encontrar programas cerca de ti.', placeholder: 'ej. 92704' },
        needsTransport: { q: '¿Necesitas ayuda para llegar a las citas?', sub: 'Transporte gratis o de bajo costo a visitas médicas.' },
        needsFood: { q: '¿Es difícil comprar comida ahora?', sub: 'Te mostraremos bancos de comida y programas de alimentos.' },
        needsTherapy: { q: '¿Tu hijo/a podría necesitar terapia o consejería?', sub: 'Apoyo de habla, físico o de salud mental.' },
        needsHousing: { q: '¿Necesitas ayuda con la vivienda?', sub: 'Ayuda de renta, servicios públicos, refugio.' },
      },
    },
  }[lang];

  const stepKey = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const progress = Math.round(((stepIdx + 1) / STEPS.length) * 100);

  const setField = <K extends StepKey>(k: K, v: PersonalizeAnswers[K]) => {
    setAnswers((a) => ({ ...a, [k]: v }));
  };

  const save = () => {
    try {
      localStorage.setItem(PERSONALIZE_KEY, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
    navigate('/resources');
  };

  const handleNext = () => {
    if (isLast) save();
    else setStepIdx((i) => i + 1);
  };

  const renderQuestion = () => {
    if (stepKey === 'zip') {
      const q = copy.questions.zip;
      return (
        <div>
          <h2 className="font-black text-2xl text-gray-900 leading-tight">{q.q}</h2>
          <p className="text-base font-bold text-gray-500 mt-1 mb-5">{q.sub}</p>
          <input
            type="text"
            inputMode="numeric"
            value={answers.zip}
            onChange={(e) => setField('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder={q.placeholder}
            className="w-full text-2xl font-black text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-400"
            autoFocus
          />
        </div>
      );
    }
    const q = copy.questions[stepKey];
    const val = answers[stepKey] as 'yes' | 'no' | '';
    return (
      <div>
        <h2 className="font-black text-2xl text-gray-900 leading-tight">{q.q}</h2>
        <p className="text-base font-bold text-gray-500 mt-1 mb-5">{q.sub}</p>
        <div className="grid grid-cols-2 gap-3">
          {(['yes', 'no'] as const).map((opt) => {
            const selected = val === opt;
            return (
              <button
                key={opt}
                onClick={() => setField(stepKey, opt)}
                className={`rounded-2xl border-2 p-5 font-black text-xl active:scale-95 transition-transform ${
                  selected
                    ? 'bg-indigo-600 text-white border-indigo-700'
                    : 'bg-white text-gray-800 border-gray-200'
                }`}
              >
                {selected && <Check className="w-5 h-5 inline mr-1.5" />}
                {opt === 'yes' ? copy.yes : copy.no}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white pb-28">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white px-5 pt-6 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-xs font-black uppercase tracking-widest text-indigo-100">
            {copy.title}
          </span>
        </div>
        <p className="font-bold text-indigo-100">{copy.subtitle}</p>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-yellow-300 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs font-black mt-1.5 text-indigo-100">
          {stepIdx + 1} / {STEPS.length}
        </div>
      </div>

      <div className="p-5 flex-1">{renderQuestion()}</div>

      <div className="p-5 flex gap-2 border-t border-gray-100 bg-white">
        <button
          onClick={() => (stepIdx === 0 ? navigate('/resources') : setStepIdx((i) => i - 1))}
          className="flex-1 bg-white text-gray-700 font-bold text-base py-3 rounded-2xl border-2 border-gray-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> {stepIdx === 0 ? copy.skip : copy.back}
        </button>
        <button
          onClick={handleNext}
          className="flex-[2] bg-indigo-600 text-white font-black text-base py-3 rounded-2xl border-b-4 border-indigo-800 active:scale-95 flex items-center justify-center gap-2 shadow-md"
        >
          {isLast ? copy.save : copy.next}
          {!isLast && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
