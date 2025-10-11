import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const resources = {
  th: {
    translation: {
  "title": "Klick Drive",
  "desc": "เว็บไซต์เช่ารถมืออาชีพ รองรับ Desktop และ Mobile"
    }
  },
  en: {
    translation: {
  "title": "Klick Drive",
  "desc": "Professional car rental website for Desktop & Mobile"
    }
  }
};
i18n.use(initReactI18next).init({
  resources,
  lng: 'th',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});
export default i18n;
