'use client';

import { useState, createContext, useContext, useCallback, type ReactNode } from 'react';

type Language = 'en' | 'af';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (en: string, af: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLanguage: () => {},
  t: (en) => en,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'af' : 'en'));
  }, []);

  const t = useCallback(
    (en: string, af: string) => (lang === 'en' ? en : af),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      aria-label={lang === 'en' ? 'Switch to Afrikaans' : 'Skakel na Engels'}
      title={lang === 'en' ? 'Switch to Afrikaans' : 'Skakel na Engels'}
    >
      <span className="text-base">{lang === 'en' ? '🇿🇦' : '🇬🇧'}</span>
      <span>{lang === 'en' ? 'AF' : 'EN'}</span>
    </button>
  );
}
