import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionary } from '../locales/dictionary';

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('agrobrain_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agrobrain_lang', currentLang);
  }, [currentLang]);

  // Hook generating instantaneous string matches avoiding huge bundle packages
  const t = (key) => {
    if (!dictionary[key]) return key;
    return dictionary[key][currentLang] || dictionary[key]['en'];
  };

  const switchLanguage = (lang) => {
    setCurrentLang(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
