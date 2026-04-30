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
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white px-6 pt-8 pb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-7 h-7 text-pink-300" fill="currentColor" />
              <span className="font-black text-lg">Care to Home</span>
            </div>
            <button
              onClick={toggleLang}
              className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold active:scale-95"
            >
              {lang === 'en' ? 'ESPAÑOL' : 'ENGLISH'}
            </button>
          </div>
          <h1 className="font-black text-3xl leading-tight mb-2">{copy.title}</h1>
          <p className="text-indigo-100 font-medium text-lg">{copy.subtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col px-5 pb-8 -mt-6"
        >
          <div className="bg-white rounded-3xl shadow-md border-2 border-indigo-100 p-6">
            <label
              htmlFor="mrn"
              className="text-xs font-black uppercase tracking-widest text-indigo-700 block mb-2"
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
              className="w-full text-2xl font-black tracking-wider text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-400"
            />
            {error && (
              <div className="mt-3 flex items-center gap-2 text-red-700 font-bold text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="mt-5 w-full bg-indigo-600 text-white font-black text-xl py-4 px-5 rounded-2xl flex items-center justify-center gap-3 border-b-4 border-indigo-800 active:scale-[0.98] shadow-md"
            >
              {copy.continue} <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>

          <div className="mt-5 flex items-start gap-2 text-gray-500 text-xs font-bold px-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{copy.privacy}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
