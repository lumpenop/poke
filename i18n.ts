import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import koTranslation from './locales/ko/translation.json';
import enTranslation from './locales/en/translation.json';
import jaTranslation from './locales/ja/translation.json';
import './src/types/translation'; // 타입 정의 import

i18n.use(initReactI18next).init({
  lng: 'ko',
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
  ns: ['translation'],
  defaultNS: 'translation',
  resources: {
    ko: {
      translation: koTranslation,
    },
    en: {
      translation: enTranslation,
    },
    ja: {
      translation: jaTranslation,
    },
  },
});

export default i18n;
