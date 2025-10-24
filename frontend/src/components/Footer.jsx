import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white border-t-4 border-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* About */}
          <div>
            <h3 className={`text-lg font-bold mb-3 text-secondary ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
              {t('footer.aboutTitle')}
            </h3>
            <p className={`text-gray-400 mb-2 text-sm ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              {t('footer.aboutText')}
            </p>
            <p className={`text-secondary mb-3 font-semibold text-sm ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              {t('footer.foundedBy')} {t('footer.founderName')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-secondary transition transform hover:scale-110">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary transition transform hover:scale-110">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-bold mb-3 text-secondary ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-1">
              <li>
                <Link to="/" className={`text-gray-400 hover:text-secondary transition ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/plots" className={`text-gray-400 hover:text-secondary transition ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('nav.projects')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className={`text-lg font-bold mb-3 text-secondary ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
              {t('footer.whyChooseUs')}
            </h3>
            <ul className={`space-y-1 text-gray-400 text-sm ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              <li className="hover:text-secondary transition">✓ {t('trustBadges.verifiedLand')}</li>
              <li className="hover:text-secondary transition">✓ {t('trustBadges.legalAgreement')}</li>
              <li className="hover:text-secondary transition">✓ {t('trustBadges.houseDesigns')}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-lg font-bold mb-3 text-secondary ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                <span>Sector 45, Gurgaon, Haryana, India</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 flex-shrink-0" />
                <span>info@apnagharplots.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-primary/30 text-center text-gray-400">
          <p className={`text-sm ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
            &copy; {currentYear} {t('footer.aboutTitle')} - {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

