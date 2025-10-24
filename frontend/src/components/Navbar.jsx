import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaHome, FaBuilding, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCog } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transform hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-sm">
              <FaHome className="text-white text-2xl" />
            </div>
            <span className={`text-2xl font-bold text-neutral-800 ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
              {i18n.language === 'hi' ? 'अपना घर प्लॉट्स' : 'ApnaGhar Plots'}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-neutral-700 hover:text-primary transition font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              {t('nav.home')}
            </Link>
            <Link to="/plots" className={`text-neutral-700 hover:text-primary transition font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              {t('nav.projects')}
            </Link>
            
            <LanguageSwitcher />
            
            {isAuthenticated() && isAdmin() && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center text-neutral-700 hover:text-primary transition font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                >
                  <FaCog className="mr-1" />
                  {t('nav.admin')}
                </Link>
                
                <div className="flex items-center space-x-4">
                  <span className={`text-neutral-700 font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    <FaUser className="inline mr-2" />
                    {user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`bg-secondary hover:bg-secondary-dark text-white py-2 px-4 rounded-lg font-semibold transition flex items-center ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                  >
                    <FaSignOutAlt className="mr-2" />
                    {t('nav.logout')}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-neutral-700 hover:text-primary transition"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 bg-white rounded-b-lg shadow-lg">
            <div className="p-4">
              <LanguageSwitcher />
            </div>
            <Link
              to="/"
              className={`block py-2 px-4 text-neutral-700 hover:bg-primary hover:text-white transition font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
              onClick={toggleMenu}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/plots"
              className={`block py-2 px-4 text-neutral-700 hover:bg-primary hover:text-white transition font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
              onClick={toggleMenu}
            >
              {t('nav.projects')}
            </Link>
            
            {isAuthenticated() && isAdmin() && (
              <>
                <Link
                  to="/admin"
                  className={`block py-2 px-4 text-neutral-700 hover:bg-primary hover:text-white transition font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                  onClick={toggleMenu}
                >
                  {t('nav.admin')}
                </Link>
                
                <div className={`py-2 px-4 text-neutral-700 font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  <FaUser className="inline mr-2" />
                  {user?.name}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className={`block w-full text-left py-2 px-4 text-neutral-700 hover:bg-secondary hover:text-white transition font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                >
                  <FaSignOutAlt className="inline mr-2" />
                  {t('nav.logout')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

