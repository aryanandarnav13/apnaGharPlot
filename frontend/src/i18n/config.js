import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationHI from './locales/hi.json';
import translationEN from './locales/en.json';

const resources = {
  hi: {
    translation: translationHI
  },
  en: {
    translation: translationEN
  }
};

// Check if user has explicitly set their language preference
const userSetLanguage = localStorage.getItem('user_set_language');

// If user has NOT set a preference, clear the old i18nextLng to fetch fresh from backend
if (!userSetLanguage) {
  localStorage.removeItem('i18nextLng');
}

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: userSetLanguage ? localStorage.getItem('i18nextLng') || 'hi' : 'hi',
    fallbackLng: 'hi',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Fetch default language from backend if user hasn't explicitly set their preference
const fetchAndApplyDefaultLanguage = async () => {
  // Only fetch default if user hasn't set their own preference
  if (!userSetLanguage) {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/settings/default_language`);
      const data = await response.json();
      
      if (data.success && data.data.value) {
        i18n.changeLanguage(data.data.value);
        localStorage.setItem('i18nextLng', data.data.value);
      }
    } catch (error) {
      console.log('Using hardcoded default language (hi)');
    }
  }
};

// Only fetch if user hasn't set preference
if (!userSetLanguage) {
  fetchAndApplyDefaultLanguage();
}

export default i18n;

