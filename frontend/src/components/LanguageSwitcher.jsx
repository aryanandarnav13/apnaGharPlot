import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    // Mark that user has explicitly set their language preference
    localStorage.setItem('user_set_language', 'true');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg border-2 border-white/20"
      title={i18n.language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
    >
      <FaGlobe className="text-lg" />
      <span className="font-hindi">{i18n.language === 'hi' ? 'English' : 'हिंदी'}</span>
    </button>
  );
};

export default LanguageSwitcher;

