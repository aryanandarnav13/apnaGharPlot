import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BackButton = ({ to, label }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center space-x-2 text-gray-600 hover:text-bihar-red transition-colors mb-4 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
    >
      <FaArrowLeft />
      <span>{label || (i18n.language === 'hi' ? 'वापस जाएं' : 'Go Back')}</span>
    </button>
  );
};

export default BackButton;

