import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';

export function Login() {
  const { allPatients, selectPatient } = usePatient();
  const { lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [mrn, setMrn] = useState('');
  const [error, setError] = useState<string | null>(null);

  const copy = {
    en: {
      title: 'Sign in',
      subtitle: 'Enter the MRN from your discharge papers',
      label: 'Medical Record Number (MRN)',
      placeholder: 'e.g. MRN001',
      continue: 'Continue',
      privacy: 'For demo only — no real authentication.',
      notFound: 'No record found for that MRN.',
      empty: 'Please enter an MRN.',
    },
    es: {
      title: 'Iniciar sesión',
      subtitle: 'Ingresa el MRN de tus papeles de alta',
      label: 'Número de expediente médico (MRN)',
      placeholder: 'ej. MRN001',
      continue: 'Continuar',
      privacy: 'Solo para demostración — sin autenticación real.',
      notFound: 'No se encontró ningún registro para ese MRN.',
      empty: 'Por favor ingresa un MRN.',
    },
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = mrn.trim();
    if (!trimmed) {
      setError(copy.empty);
      return;
    }
    const match = allPatients.find(
      (p) => p.mrn.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!match) {
      setError(copy.notFound);
      return;
    }
    setError(null);
    selectPatient(match.id);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-paper-sunken flex justify-center">
      <div className="w-full max-w-md bg-paper min-h-screen flex flex-col border-x border-hairline">
        <div className="bg-brand text-brand-fg px-6 pt-8 pb-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-accent-warm" fill="currentColor" aria-hidden="true" />
              <span className="font-display font-bold text-lg tracking-tight">CareBridge</span>
            </div>
            <button
              onClick={toggleLang}
              className="bg-paper/15 hover:bg-paper/20 border border-paper/25 px-4 py-2 rounded-full text-sm font-semibold active:scale-95"
              aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
            >
              {lang === 'en' ? 'ESPAÑOL' : 'ENGLISH'}
            </button>
          </div>
          <h1 className="font-display font-bold text-4xl leading-[1.1] mb-3 tracking-tight">{copy.title}</h1>
          <p className="font-sans text-lg leading-snug" style={{ color: '#dceaf2' }}>{copy.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col px-5 pb-8 -mt-6"
        >
          <div className="bg-paper-raised rounded-2xl border border-hairline shadow-sm p-6">
            <label
              htmlFor="mrn"
              className="text-xs font-bold uppercase tracking-[0.12em] text-brand block mb-3"
            >
              {copy.label}
            </label>
            <input
              id="mrn"
              type="text"
              autoFocus
              autoComplete="off"
              value={mrn}
              onChange={(e) => {
                setMrn(e.target.value);
                if (error) setError(null);
              }}
              placeholder={copy.placeholder}
              className="w-full text-2xl font-bold tracking-[0.1em] text-ink bg-paper border border-hairline rounded-xl px-5 py-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 tabular"
              aria-describedby={error ? 'mrn-error' : undefined}
              aria-invalid={!!error}
            />
            {error && (
              <div id="mrn-error" role="alert" className="mt-3 flex items-center gap-2 text-danger font-semibold text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="mt-6 w-full bg-brand hover:bg-brand-hover text-brand-fg font-semibold text-lg py-4 px-5 rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-colors"
            >
              {copy.continue} <ArrowRight className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 flex items-start gap-2 text-ink-soft text-xs font-medium px-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} aria-hidden="true" />
            <span>{copy.privacy}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
