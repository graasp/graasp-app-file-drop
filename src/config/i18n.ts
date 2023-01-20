import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import en from '../langs/en.json';
import fr from '../langs/fr.json';

export const defaultNS = 'translations';
export const resources = {
  en,
  fr,
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  // debug only when not in production
  debug: process.env.NODE_ENV !== 'production',
  ns: [defaultNS],
  defaultNS,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  returnNull: false,
});

export default i18n;
