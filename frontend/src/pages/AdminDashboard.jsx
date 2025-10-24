import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inquiriesAPI, settingsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaHome, FaClipboardList, FaChartLine, FaCog, FaUserTie, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaultLanguage, setDefaultLanguage] = useState('hi');
  const [savingLanguage, setSavingLanguage] = useState(false);
  const [contactSettings, setContactSettings] = useState({
    phone: '',
    email: '',
    whatsapp: ''
  });
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchDefaultLanguage();
    fetchContactSettings();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await inquiriesAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultLanguage = async () => {
    try {
      const response = await settingsAPI.getOne('default_language');
      if (response.data.success) {
        setDefaultLanguage(response.data.data.value);
      }
    } catch (error) {
      console.error('Error fetching default language:', error);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    setSavingLanguage(true);
    try {
      await settingsAPI.update('default_language', {
        value: newLanguage,
        description: 'Default language for the website (hi = Hindi, en = English)'
      });
      setDefaultLanguage(newLanguage);
      
      // Clear admin's own language preference and apply the new default
      localStorage.removeItem('user_set_language');
      localStorage.setItem('i18nextLng', newLanguage);
      i18n.changeLanguage(newLanguage);
      
      toast.success(i18n.language === 'hi' 
        ? 'डिफ़ॉल्ट भाषा सफलतापूर्वक अपडेट की गई!' 
        : 'Default language updated successfully!');
      
      // Reload to ensure all components reflect the new language
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error updating default language:', error);
      toast.error(i18n.language === 'hi' 
        ? 'डिफ़ॉल्ट भाषा अपडेट करने में विफल' 
        : 'Failed to update default language');
    } finally {
      setSavingLanguage(false);
    }
  };

  const fetchContactSettings = async () => {
    try {
      const response = await settingsAPI.getAll();
      if (response.data.success) {
        const settings = response.data.data;
        setContactSettings({
          phone: settings.default_contact_phone || '',
          email: settings.default_contact_email || '',
          whatsapp: settings.default_contact_whatsapp || ''
        });
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    }
  };

  const handleSaveContact = async () => {
    setSavingContact(true);
    try {
      await Promise.all([
        settingsAPI.update('default_contact_phone', { value: contactSettings.phone }),
        settingsAPI.update('default_contact_email', { value: contactSettings.email }),
        settingsAPI.update('default_contact_whatsapp', { value: contactSettings.whatsapp })
      ]);
      
      toast.success(i18n.language === 'hi'
        ? 'संपर्क जानकारी सफलतापूर्वक अपडेट की गई!'
        : 'Contact information updated successfully!');
    } catch (error) {
      console.error('Error updating contact settings:', error);
      toast.error(i18n.language === 'hi'
        ? 'संपर्क जानकारी अपडेट करने में विफल'
        : 'Failed to update contact information');
    } finally {
      setSavingContact(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
                {t('admin.dashboard')}
              </h1>
              <p className={`text-xl text-white/90 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                {i18n.language === 'hi' ? 'प्लॉट, बुकिंग्स और वेबसाइट सामग्री प्रबंधित करें' : 'Manage your plots, bookings, and website content'}
              </p>
            </div>
            <FaCog className="text-6xl text-white/20" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Total Plots */}
          <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <FaHome className="text-4xl opacity-80" />
              <span className="text-2xl font-bold">{stats?.plots.total || 0}</span>
            </div>
            <h3 className={`text-lg font-semibold mb-1 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.totalPlots')}</h3>
            <p className={`text-sm opacity-80 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              {stats?.plots.available || 0} {i18n.language === 'hi' ? 'उपलब्ध' : 'available'}, {stats?.plots.sold || 0} {i18n.language === 'hi' ? 'बिके' : 'sold'}
            </p>
          </div>

          {/* Total Inquiries */}
          <div className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <FaClipboardList className="text-4xl opacity-80" />
              <span className="text-2xl font-bold">{stats?.inquiries.total || 0}</span>
            </div>
            <h3 className={`text-lg font-semibold mb-1 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{i18n.language === 'hi' ? 'कुल पूछताछ' : 'Total Inquiries'}</h3>
            <p className={`text-sm opacity-80 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              {stats?.inquiries.inquired || 0} {i18n.language === 'hi' ? 'नई' : 'new'}, {stats?.inquiries.in_progress || 0} {i18n.language === 'hi' ? 'प्रगति में' : 'in progress'}
            </p>
          </div>

          {/* Performance */}
          <div className="card p-6 bg-gradient-to-br from-secondary to-secondary-dark text-white">
            <div className="flex items-center justify-between mb-4">
              <FaChartLine className="text-4xl opacity-80" />
              <span className="text-2xl font-bold">
                {stats?.plots.total > 0 
                  ? Math.round(((stats.plots.sold + stats.plots.booked) / stats.plots.total) * 100)
                  : 0}%
              </span>
            </div>
            <h3 className={`text-lg font-semibold mb-1 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{i18n.language === 'hi' ? 'बुकिंग दर' : 'Occupancy Rate'}</h3>
            <p className={`text-sm opacity-80 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{i18n.language === 'hi' ? 'बिके और बुक किए गए प्लॉट' : 'Sold & Booked plots'}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6 mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>{t('admin.quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/plots"
              className="p-6 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition text-center"
            >
              <FaChartLine className="text-3xl mx-auto mb-3" />
              <h3 className={`font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.managePlots')}</h3>
            </Link>
            <Link
              to="/admin/house-designs"
              className="p-6 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition text-center"
            >
              <FaHome className="text-3xl mx-auto mb-3" />
              <h3 className={`font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.manageHouseDesigns')}</h3>
            </Link>
            <Link
              to="/admin/inquiries"
              className="p-6 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition text-center"
            >
              <FaClipboardList className="text-3xl mx-auto mb-3" />
              <h3 className={`font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{i18n.language === 'hi' ? 'पूछताछ प्रबंधित करें' : 'Manage Inquiries'}</h3>
            </Link>
            <Link
              to="/admin/owner-info"
              className="p-6 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition text-center"
            >
              <FaUserTie className="text-3xl mx-auto mb-3" />
              <h3 className={`font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.manageOwnerInfo')}</h3>
            </Link>
          </div>
        </div>

        {/* Website Settings */}
        <div className="card p-6">
          <h2 className={`text-2xl font-bold mb-6 flex items-center ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
            <FaGlobe className="mr-3 text-primary" />
            {i18n.language === 'hi' ? 'वेबसाइट सेटिंग्स' : 'Website Settings'}
          </h2>
          
          <div className="space-y-6">
            {/* Default Language Setting */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className={`font-semibold text-lg mb-1 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? 'डिफ़ॉल्ट भाषा' : 'Default Language'}
                </h3>
                <p className={`text-sm text-gray-600 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' 
                    ? 'नए विज़िटर्स के लिए डिफ़ॉल्ट भाषा चुनें' 
                    : 'Choose the default language for new visitors'}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleLanguageChange('hi')}
                  disabled={savingLanguage}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    defaultLanguage === 'hi'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${savingLanguage ? 'opacity-50 cursor-not-allowed' : ''} ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  disabled={savingLanguage}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    defaultLanguage === 'en'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${savingLanguage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Default Contact Information */}
            <div className="p-4 bg-gray-50 rounded-lg mt-6">
              <div className="mb-4">
                <h3 className={`font-semibold text-lg mb-1 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? 'डिफ़ॉल्ट संपर्क जानकारी' : 'Default Contact Information'}
                </h3>
                <p className={`text-sm text-gray-600 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' 
                    ? 'प्लॉट-विशिष्ट संपर्क नहीं होने पर यह संपर्क दिखाया जाएगा' 
                    : 'This contact will be shown when plot-specific contact is not provided'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    {i18n.language === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={contactSettings.phone}
                    onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    {i18n.language === 'hi' ? 'ईमेल' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={contactSettings.email}
                    onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="contact@apnagharplots.com"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    {i18n.language === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    value={contactSettings.whatsapp}
                    onChange={(e) => setContactSettings({ ...contactSettings, whatsapp: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="+919876543210"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveContact}
                disabled={savingContact}
                className={`bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition ${
                  savingContact ? 'opacity-50 cursor-not-allowed' : ''
                } ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
              >
                {savingContact 
                  ? (i18n.language === 'hi' ? 'सहेजा जा रहा है...' : 'Saving...') 
                  : (i18n.language === 'hi' ? 'संपर्क सहेजें' : 'Save Contact')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

