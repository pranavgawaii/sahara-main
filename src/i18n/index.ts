import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from './locales/en/common.json';
import enProblems from './locales/en/problems.json';
import enUI from './locales/en/ui.json';

import hiCommon from './locales/hi/common.json';
import hiProblems from './locales/hi/problems.json';
import hiUI from './locales/hi/ui.json';

import urCommon from './locales/ur/common.json';
import urProblems from './locales/ur/problems.json';
import urUI from './locales/ur/ui.json';

const resources = {
  en: {
    common: enCommon,
    problems: enProblems,
    ui: enUI,
  },
  hi: {
    common: hiCommon,
    problems: hiProblems,
    ui: hiUI,
  },
  ur: {
    common: urCommon,
    problems: urProblems,
    ui: urUI,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;