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
          <h2 className="font-display font-bold text-2xl text-ink leading-tight tracking-tight">{q.q}</h2>
          <p className="text-base font-medium text-ink-soft mt-2 mb-5">{q.sub}</p>
          <input
            type="text"
            inputMode="numeric"
            value={answers.zip}
            onChange={(e) => setField('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder={q.placeholder}
            className="w-full text-2xl font-bold text-ink bg-paper-raised border border-hairline rounded-xl px-5 py-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 tabular"
            autoFocus
            aria-label={q.q}
          />
        </div>
      );
    }
    const q = copy.questions[stepKey];
    const val = answers[stepKey] as 'yes' | 'no' | '';
    return (
      <div>
        <h2 className="font-display font-bold text-2xl text-ink leading-tight tracking-tight">{q.q}</h2>
        <p className="text-base font-medium text-ink-soft mt-2 mb-5">{q.sub}</p>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={q.q}>
          {(['yes', 'no'] as const).map((opt) => {
            const selected = val === opt;
            return (
              <button
                key={opt}
                onClick={() => setField(stepKey, opt)}
                role="radio"
                aria-checked={selected}
                className={`rounded-xl border p-5 font-semibold text-xl active:scale-95 transition-transform ${
                  selected
                    ? 'bg-brand text-brand-fg border-brand'
                    : 'bg-paper-raised text-ink border-hairline'
                }`}
              >
                {selected && <Check className="w-5 h-5 inline mr-1.5" strokeWidth={2.25} aria-hidden="true" />}
                {opt === 'yes' ? copy.yes : copy.no}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-paper pb-28">
      <div className="bg-brand text-brand-fg px-5 pt-6 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-accent-warm" strokeWidth={1.75} aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: '#dceaf2' }}>
            {copy.title}
          </span>
        </div>
        <p className="font-display font-semibold text-xl tracking-tight">{copy.subtitle}</p>
        <div
          className="h-2 bg-paper-raised/20 rounded-full overflow-hidden mt-5"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${stepIdx + 1} of ${STEPS.length}`}
        >
          <div
            className="h-full bg-accent-warm transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs font-bold mt-2 tabular" style={{ color: '#dceaf2' }}>
          {stepIdx + 1} / {STEPS.length}
        </div>
      </div>

      <div className="p-5 flex-1">{renderQuestion()}</div>

      <div className="p-5 flex gap-2 border-t border-hairline bg-paper-raised">
        <button
          onClick={() => (stepIdx === 0 ? navigate('/resources') : setStepIdx((i) => i - 1))}
          className="flex-1 bg-paper-raised text-ink-soft font-semibold text-base py-3 rounded-xl border border-hairline active:scale-95 flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" /> {stepIdx === 0 ? copy.skip : copy.back}
        </button>
        <button
          onClick={handleNext}
          className="flex-[2] bg-brand hover:bg-brand-hover text-brand-fg font-semibold text-base py-3 rounded-xl active:scale-95 flex items-center justify-center gap-2 transition-colors"
        >
          {isLast ? copy.save : copy.next}
          {!isLast && <ChevronRight className="w-5 h-5" strokeWidth={2} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
