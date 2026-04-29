import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, ChevronRight, Search } from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';
import { plainDiagnosis } from '../data/plainLanguage';

export function Login() {
  const { allPatients, selectPatient } = usePatient();
  const { lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const copy = {
    en: {
      title: 'Welcome',
      subtitle: 'Choose the child you are caring for',
      search: 'Search by name or MRN',
      mrn: 'MRN',
      reason: 'Reason at hospital',
    },
    es: {
      title: 'Bienvenida',
      subtitle: 'Elige al niño/a que estás cuidando',
      search: 'Buscar por nombre o MRN',
      mrn: 'MRN',
      reason: 'Razón en el hospital',
    },
  }[lang];

  const filtered = allPatients.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q)
    );
  });

  const handleSelect = (id: string) => {
    selectPatient(id);
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

        <div className="px-5 -mt-6 mb-4">
          <div className="bg-white rounded-2xl shadow-md flex items-center gap-3 px-4 py-3 border-2 border-gray-100">
            <Search className="w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.search}
              className="flex-1 outline-none text-lg font-medium text-gray-900"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className="w-full text-left bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-transform flex items-center gap-4 hover:border-indigo-300"
            >
              <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 font-black text-xl flex items-center justify-center shrink-0">
                {p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-xl text-gray-900 truncate">{p.name}</div>
                <div className="text-sm font-bold text-gray-500">
                  {copy.mrn}: {p.mrn} · {p.preferredLanguage}
                </div>
                <div className="text-base font-bold text-indigo-700 mt-1 truncate">
                  {plainDiagnosis(p.dischargeDiagnosis, lang)}
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
