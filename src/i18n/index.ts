import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    fallbackLng: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
