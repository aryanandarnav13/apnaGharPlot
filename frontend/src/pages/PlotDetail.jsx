import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { plotsAPI, inquiriesAPI, houseDesignsAPI, settingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaRulerCombined, FaCheckCircle, FaPhone, FaEnvelope, FaWhatsapp, FaTimes } from 'react-icons/fa';
import MediaSlider from '../components/MediaSlider';
import BackButton from '../components/BackButton';

const PlotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const [plot, setPlot] = useState(null);
  const [houseDesigns, setHouseDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [ownerContact, setOwnerContact] = useState(null);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    fetchPlot();
    fetchHouseDesigns();
    fetchOwnerContact();
  }, [id]);

  const fetchPlot = async () => {
    try {
      const response = await plotsAPI.getOne(id);
      setPlot(response.data.data);
    } catch (error) {
      console.error('Error fetching plot:', error);
      toast.error('Failed to load plot details');
    } finally {
      setLoading(false);
    }
  };

  const fetchHouseDesigns = async () => {
    try {
      const response = await houseDesignsAPI.getAll({ plot_id: id });
      setHouseDesigns(response.data.data);
    } catch (error) {
      console.error('Error fetching house designs:', error);
    }
  };

  const fetchOwnerContact = async () => {
    try {
      const response = await settingsAPI.getAll();
      
      if (response.data.success) {
        const settings = response.data.data;
        
        const defaultContact = {
          phone: settings.default_contact_phone || '+91 9876543210',
          email: settings.default_contact_email || 'contact@apnagharplots.com',
          whatsapp: settings.default_contact_whatsapp || '+919876543210'
        };
        
        setOwnerContact(defaultContact);
      }
    } catch (error) {
      console.error('Error fetching default contact:', error);
      // Fallback contact
      setOwnerContact({
        phone: '+91 9876543210',
        email: 'contact@apnagharplots.com',
        whatsapp: '+919876543210'
      });
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    
    // No login required - just submit the inquiry with provided details
    setInquiryLoading(true);
    try {
      await inquiriesAPI.create({
        plot_id: plot.id,
        name: inquiryData.name,
        phone: inquiryData.phone,
        message: inquiryData.message || null
      });

      toast.success(i18n.language === 'hi' ? 'पूछताछ सफलतापूर्वक सबमिट की गई!' : 'Inquiry submitted successfully!');
      setShowInquiryForm(false);
      setShowContactModal(true);
    } catch (error) {
      console.error('Error creating inquiry:', error);
      toast.error(error.response?.data?.message || (i18n.language === 'hi' ? 'पूछताछ सबमिट करने में विफल' : 'Failed to submit inquiry'));
    } finally {
      setInquiryLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPriceDisplay = () => {
    if (!plot) return '';
    
    if (!plot.show_price || plot.price_display === 'hidden') {
      return i18n.language === 'hi' ? 'मूल्य के लिए संपर्क करें' : 'Contact for Price';
    }

    if (plot.price_display === 'masked') {
      // Convert to integer to remove any decimals
      const priceInt = Math.floor(parseFloat(plot.price));
      const priceStr = priceInt.toString();
      
      // Find where trailing zeros start
      let significantEnd = priceStr.length;
      for (let i = priceStr.length - 1; i >= 0; i--) {
        if (priceStr[i] !== '0') {
          significantEnd = i + 1;
          break;
        }
      }
      
      // Mask the significant part, keep trailing zeros
      const significantPart = priceStr.substring(0, significantEnd);
      const trailingZeros = priceStr.substring(significantEnd);
      const masked = 'x'.repeat(significantPart.length) + trailingZeros;
      
      return `₹${masked}`;
    }

    return formatPrice(plot.price);
  };

  const getContactInfo = () => {
    if (!plot) return null;
    
    // Use plot-specific contact if available (trim and check for empty), otherwise use owner contact
    const plotPhone = plot.contact_phone?.trim();
    const plotEmail = plot.contact_email?.trim();
    const plotWhatsapp = plot.contact_whatsapp?.trim();
    
    return {
      phone: (plotPhone && plotPhone.length > 0) ? plotPhone : (ownerContact?.phone || '+91 9876543210'),
      email: (plotEmail && plotEmail.length > 0) ? plotEmail : (ownerContact?.email || 'contact@apnagharplots.com'),
      whatsapp: (plotWhatsapp && plotWhatsapp.length > 0) ? plotWhatsapp : (ownerContact?.whatsapp || plotPhone || '+919876543210')
    };
  };

  // Format WhatsApp number for wa.me link
  const formatWhatsAppLink = (number) => {
    if (!number) return '';
    // Remove all non-numeric characters
    let cleaned = number.replace(/[^0-9]/g, '');
    // If number doesn't start with country code (91 for India), add it
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    return `https://wa.me/${cleaned}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'badge-success';
      case 'booked':
        return 'badge-warning';
      case 'sold':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className={`text-2xl font-bold text-primary ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
          {i18n.language === 'hi' ? 'प्लॉट नहीं मिला' : 'Plot not found'}
        </h2>
      </div>
    );
  }

  const contact = getContactInfo();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <BackButton to="/plots" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plot Details */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden mb-6 p-4">
              <MediaSlider 
                media={(() => {
                  const mediaItems = [];
                  
                  if (plot.images) {
                    try {
                      const images = JSON.parse(plot.images);
                      images.forEach(img => mediaItems.push({ type: 'image', url: img }));
                    } catch (e) {
                      console.error('Error parsing images:', e);
                    }
                  } else if (plot.image) {
                    mediaItems.push({ type: 'image', url: plot.image });
                  }
                  
                  if (plot.videos) {
                    try {
                      const videos = JSON.parse(plot.videos);
                      videos.forEach(vid => mediaItems.push({ type: 'video', url: vid }));
                    } catch (e) {
                      console.error('Error parsing videos:', e);
                    }
                  }
                  
                  return mediaItems.length > 0 ? mediaItems : [{ type: 'image', url: 'https://via.placeholder.com/800x600' }];
                })()}
              />
            </div>

            <div className="card p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className={`text-3xl font-bold text-neutral-800 mb-2 ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
                    {t('plot.plotNumber')} {plot.plot_number}
                  </h1>
                  <span className={`badge ${getStatusColor(plot.status)} capitalize`}>
                    {t(`plot.${plot.status}`)}
                  </span>
                </div>
                <div className="text-right">
                  <p className={`text-sm text-gray-500 mb-1 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    {t('plot.price')}
                  </p>
                  <p className={`${(!plot.show_price || plot.price_display === 'hidden') ? 'text-sm' : 'text-3xl'} font-bold text-primary ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    {getPriceDisplay()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-3 text-secondary text-xl" />
                  <div>
                    <p className={`text-sm text-gray-500 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('plot.location')}</p>
                    <p className={`font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{plot.location}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaRulerCombined className="mr-3 text-secondary text-xl" />
                  <div>
                    <p className={`text-sm text-gray-500 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('plot.size')}</p>
                    <p className={`font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{plot.size}</p>
                  </div>
                </div>
              </div>

              {plot.description && (
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-3 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    {i18n.language === 'hi' ? 'विवरण' : 'Description'}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    {plot.description}
                  </p>
                </div>
              )}

              {plot.features && (
                <div>
                  <h3 className={`text-xl font-bold mb-3 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    {i18n.language === 'hi' ? 'विशेषताएं' : 'Features'}
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {JSON.parse(plot.features).map((feature, index) => (
                      <li key={index} className={`flex items-center text-gray-700 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                        <FaCheckCircle className="text-secondary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* House Designs for this Plot */}
            {houseDesigns.length > 0 && (
              <div className="card p-6 mb-6">
                <h3 className={`text-2xl font-bold mb-4 text-primary ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? '🏡 अपने सपनों का घर देखें' : '🏡 Visualize Your Dream Home'}
                </h3>
                <p className={`text-gray-600 mb-6 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' 
                    ? 'इस जमीन पर घर कैसा दिखेगा देखें। ये डिज़ाइन सिर्फ विचार हैं।'
                    : 'See how your home could look on this land. These designs are for inspiration.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {houseDesigns.map((design) => {
                    const designImages = design.images ? JSON.parse(design.images) : (design.image ? [design.image] : []);
                    
                    return (
                      <div key={design.id} className="bg-white rounded-lg overflow-hidden border-2 border-neutral-200 hover:border-primary transition">
                        <MediaSlider media={designImages.map(img => ({ type: 'image', url: img }))} />
                        
                        <div className="p-4">
                          <p className={`text-secondary font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                            {i18n.language === 'hi' ? 'अनुमानित निर्माण लागत' : 'Estimated Construction Cost'}
                          </p>
                          <p className={`text-2xl font-bold text-primary ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                            {formatPrice(design.estimated_construction_cost)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Map */}
            {plot.map_url && (
              <div className="card p-6 mb-6">
                <h3 className={`text-2xl font-bold mb-4 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? 'स्थान' : 'Location'}
                </h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={plot.map_url}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Inquiry Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-4">
              <h3 className={`text-2xl font-bold mb-4 text-primary ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                {i18n.language === 'hi' ? 'रुचि है?' : 'Interested?'}
              </h3>
              
              <p className={`text-gray-600 mb-6 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                {i18n.language === 'hi' 
                  ? 'संपर्क विवरण प्राप्त करने के लिए पूछताछ करें'
                  : 'Submit an inquiry to get contact details'}
              </p>

              {!showInquiryForm ? (
                <button
                  onClick={() => {
                    setInquiryData({
                      name: user?.name || '',
                      phone: user?.phone || '',
                      message: ''
                    });
                    setShowInquiryForm(true);
                  }}
                  className={`w-full btn-primary text-lg py-3 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                >
                  {i18n.language === 'hi' ? '📞 पूछताछ करें' : '📞 Enquire Now'}
                </button>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'नाम' : 'Name'} *
                    </label>
                    <input
                      type="text"
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                      placeholder={i18n.language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'फ़ोन' : 'Phone'} *
                    </label>
                    <input
                      type="tel"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                      placeholder={i18n.language === 'hi' ? 'अपना फ़ोन नंबर दर्ज करें' : 'Enter your phone number'}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'संदेश (वैकल्पिक)' : 'Message (Optional)'}
                    </label>
                    <textarea
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                      rows="3"
                      placeholder={i18n.language === 'hi' ? 'कोई विशेष जानकारी चाहिए?' : 'Any specific requirements?'}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className={`w-full btn-primary text-lg py-3 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                  >
                    {inquiryLoading 
                      ? (i18n.language === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting...') 
                      : (i18n.language === 'hi' ? 'पूछताछ सबमिट करें' : 'Submit Inquiry')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInquiryForm(false)}
                    className={`w-full btn-outline text-sm py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                  >
                    {i18n.language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </form>
              )}

              {/* Why Choose Us */}
              <div className="mt-8 pt-6 border-t">
                <h4 className={`font-bold mb-4 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? 'हमें क्यों चुनें?' : 'Why Choose Us?'}
                </h4>
                <ul className="space-y-3">
                  <li className={`flex items-start text-sm ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    <FaCheckCircle className="text-secondary mr-2 mt-1 flex-shrink-0" />
                    {i18n.language === 'hi' ? 'सत्यापित कागजात' : 'Verified Documents'}
                  </li>
                  <li className={`flex items-start text-sm ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    <FaCheckCircle className="text-secondary mr-2 mt-1 flex-shrink-0" />
                    {i18n.language === 'hi' ? 'कानूनी बिक्री समझौता' : 'Legal Sale Agreement'}
                  </li>
                  <li className={`flex items-start text-sm ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                    <FaCheckCircle className="text-secondary mr-2 mt-1 flex-shrink-0" />
                    {i18n.language === 'hi' ? 'घर के डिज़ाइन विचार' : 'House Design Ideas'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-2xl font-bold text-primary ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? '✅ पूछताछ सबमिट हो गई!' : '✅ Inquiry Submitted!'}
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <p className={`text-gray-600 mb-6 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                {i18n.language === 'hi' 
                  ? 'आप हमसे इन विवरणों पर संपर्क कर सकते हैं:'
                  : 'You can reach us at:'}
              </p>

              <div className="space-y-4">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition"
                >
                  <FaPhone className="mr-4 text-xl" />
                  <div>
                    <p className={`text-sm font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'फ़ोन' : 'Phone'}
                    </p>
                    <p className="font-bold">{contact.phone}</p>
                  </div>
                </a>

                <a
                  href={formatWhatsAppLink(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"
                >
                  <FaWhatsapp className="mr-4 text-xl" />
                  <div>
                    <p className={`text-sm font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}
                    </p>
                    <p className="font-bold">{contact.whatsapp}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center p-4 border-2 border-secondary rounded-lg hover:bg-secondary hover:text-white transition"
                >
                  <FaEnvelope className="mr-4 text-xl" />
                  <div>
                    <p className={`text-sm font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'ईमेल' : 'Email'}
                    </p>
                    <p className="font-bold">{contact.email}</p>
                  </div>
                </a>
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className={`w-full mt-6 btn-outline py-3 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
              >
                {i18n.language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotDetail;

