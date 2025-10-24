import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaShieldAlt, FaCreditCard, FaHome } from 'react-icons/fa';
import { plotsAPI, ownerInfoAPI } from '../services/api';
import PlotSlider from '../components/PlotSlider';
import { toast } from 'react-toastify';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [featuredPlots, setFeaturedPlots] = useState([]);
  const [ownerInfo, setOwnerInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const plotsRes = await plotsAPI.getAll({ status: 'available' });
      setFeaturedPlots(plotsRes.data.data); // Show all available plots
      
      // Fetch active owner info
      const ownerRes = await ownerInfoAPI.getAll();
      setOwnerInfo(ownerRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern Design */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-7xl mx-auto">
            {/* Left: Hero Text - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6 animate-fade-in">
                <h1 className={`text-6xl md:text-7xl font-extrabold leading-tight ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
                  {t('hero.title')}
                </h1>
                <p className={`text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl ${i18n.language === 'hi' ? 'font-hindi' : 'font-lato'}`}>
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/plots" className="group relative px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <span className="relative z-10">Explore Plots</span>
                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Owner Info - Compact Card */}
            {ownerInfo.length > 0 && (
              <div className="flex justify-center lg:justify-end">
                {ownerInfo.map((info) => (
                  <div key={info.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 max-w-sm">
                    <div className="flex items-center gap-4 mb-4">
                      {info.photo && (
                        <div className="relative">
                          <img
                            src={info.photo.startsWith('/uploads') ? `http://localhost:5000${info.photo}` : info.photo}
                            alt={info.name}
                            className="w-20 h-20 rounded-xl object-cover ring-4 ring-white/30"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className={`text-base font-bold text-white ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
                          {i18n.language === 'hi' && info.name_hi ? info.name_hi : info.name}
                        </h3>
                        {info.designation && (
                          <p className={`text-xs text-white/80 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                            {i18n.language === 'hi' && info.designation_hi ? info.designation_hi : info.designation}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className={`text-xs text-white/75 leading-relaxed ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' && info.bio_hi ? info.bio_hi : info.bio}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Modern Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 48C480 42.7 600 45.3 720 50.7C840 56 960 64 1080 66.7C1200 69.3 1320 66.7 1380 65.3L1440 64V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Trust Badges - Modern Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:border-secondary overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
                <h3 className={`font-bold text-xl mb-3 text-neutral-800 group-hover:text-secondary transition-colors ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
                  {t('trustBadges.verifiedLand')}
                </h3>
                <p className={`text-neutral-600 text-sm leading-relaxed ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('trustBadges.verifiedLandDesc')}
                </p>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:border-primary overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FaShieldAlt className="text-white text-2xl" />
                </div>
                <h3 className={`font-bold text-xl mb-3 text-neutral-800 group-hover:text-primary transition-colors ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
                  {t('trustBadges.legalAgreement')}
                </h3>
                <p className={`text-neutral-600 text-sm leading-relaxed ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('trustBadges.legalAgreementDesc')}
                </p>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:border-secondary overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <FaHome className="text-white text-2xl" />
                </div>
                <h3 className={`font-bold text-xl mb-3 text-neutral-800 group-hover:text-secondary transition-colors ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
                  {t('trustBadges.houseDesigns')}
                </h3>
                <p className={`text-neutral-600 text-sm leading-relaxed ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('trustBadges.houseDesignsDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plots - Modern Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-extrabold text-neutral-900 mb-6 ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
              {t('featuredPlots.title')}
            </h2>
            <p className={`text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              {t('featuredPlots.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-primary/20"></div>
              </div>
            </div>
          ) : (
            <>
              <PlotSlider plots={featuredPlots} />

              <div className="text-center mt-12">
                <Link to="/plots" className={`group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  <span>{t('featuredPlots.viewAll')}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;

