import React, { createContext, useContext, useState } from 'react';
import { ui } from '../data/mockData';

type Language = 'en' | 'es';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: typeof ui.en;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  t: ui.en
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');
  const toggleLang = () => setLang(lang === 'en' ? 'es' : 'en');
  const t = ui[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
