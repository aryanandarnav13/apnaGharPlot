import React, { useState, useEffect } from 'react';
import { plotsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import MediaUpload from '../../components/MediaUpload';
import BackButton from '../../components/BackButton';
import { useTranslation } from 'react-i18next';

const AdminPlots = () => {
  const { t, i18n } = useTranslation();
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [formData, setFormData] = useState({
    plot_number: '',
    location: '',
    size: '',
    price: '',
    status: 'available',
    image: '',
    images: [],
    videos: [],
    description: '',
    features: '',
    map_url: '',
    map_lat: '',
    map_lng: '',
    show_price: true,
    price_display: 'exact',
    contact_phone: '',
    contact_email: '',
    contact_whatsapp: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const plotsRes = await plotsAPI.getAll();
      setPlots(plotsRes.data.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        // Automatically set main image to first image in array (for cards/listings)
        image: formData.images && formData.images.length > 0 ? formData.images[0] : formData.image,
        features: formData.features ? JSON.stringify(formData.features.split(',').map(f => f.trim())) : null,
        images: formData.images && formData.images.length > 0 ? JSON.stringify(formData.images) : null,
        videos: formData.videos && formData.videos.length > 0 ? JSON.stringify(formData.videos) : null
      };

      if (editingPlot) {
        await plotsAPI.update(editingPlot.id, submitData);
        toast.success('Plot updated successfully');
      } else {
        await plotsAPI.create(submitData);
        toast.success('Plot created successfully');
      }
      fetchData();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plot?')) {
      try {
        await plotsAPI.delete(id);
        toast.success('Plot deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete plot');
      }
    }
  };

  const openModal = (plot = null) => {
    if (plot) {
      setEditingPlot(plot);
      setFormData({
        ...plot,
        features: plot.features ? JSON.parse(plot.features).join(', ') : '',
        images: plot.images ? JSON.parse(plot.images) : (plot.image ? [plot.image] : []),
        videos: plot.videos ? JSON.parse(plot.videos) : [],
        map_url: plot.map_url || '',
        map_lat: plot.map_lat || '',
        map_lng: plot.map_lng || '',
        show_price: plot.show_price !== undefined ? plot.show_price : true,
        price_display: plot.price_display || 'exact',
        contact_phone: plot.contact_phone || '',
        contact_email: plot.contact_email || '',
        contact_whatsapp: plot.contact_whatsapp || ''
      });
    } else {
      setEditingPlot(null);
      setFormData({
        plot_number: '',
        location: '',
        size: '',
        price: '',
        status: 'available',
        image: '',
        images: [],
        videos: [],
        description: '',
        features: '',
        map_url: '',
        map_lat: '',
        map_lng: '',
        show_price: true,
        price_display: 'exact',
        contact_phone: '',
        contact_email: '',
        contact_whatsapp: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlot(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Show what users see on the website
  const getPriceDisplayForUser = (plot) => {
    if (!plot.show_price || plot.price_display === 'hidden') {
      return i18n.language === 'hi' ? 'मूल्य के लिए संपर्क करें' : 'Contact for Price';
    }

    if (plot.price_display === 'masked') {
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
      
      const significantPart = priceStr.substring(0, significantEnd);
      const trailingZeros = priceStr.substring(significantEnd);
      const masked = 'x'.repeat(significantPart.length) + trailingZeros;
      
      return `₹${masked}`;
    }

    return formatPrice(plot.price);
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
      <div className="container mx-auto px-4 py-12">
        <BackButton to="/admin" label={t('admin.backToDashboard')} />
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>{t('admin.managePlots')}</h1>
          <button onClick={() => openModal()} className={`btn-primary flex items-center ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
            <FaPlus className="mr-2" />
            {t('admin.addPlot')}
          </button>
        </div>

        <div className="card overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.plotNumber')}</th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.location')}</th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.size')}</th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.price')}</th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? 'यूज़र को दिखाया जाता है' : 'User Sees'}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.status')}</th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plots.map((plot) => (
                <tr key={plot.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{plot.plot_number}</td>
                  <td className="px-6 py-4">{plot.location}</td>
                  <td className="px-6 py-4">{plot.size}</td>
                  <td className="px-6 py-4">{formatPrice(plot.price)}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded whitespace-nowrap">
                      {getPriceDisplayForUser(plot)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      plot.status === 'available' ? 'badge-success' :
                      plot.status === 'booked' ? 'badge-warning' : 'badge-danger'
                    } capitalize`}>
                      {plot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(plot)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(plot.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className={`text-2xl font-bold mb-6 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {editingPlot ? (i18n.language === 'hi' ? 'प्लॉट संपादित करें' : 'Edit Plot') : (i18n.language === 'hi' ? 'नया प्लॉट जोड़ें' : 'Add New Plot')}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.plotNumber')} *</label>
                      <input
                        type="text"
                        value={formData.plot_number}
                        onChange={(e) => setFormData({ ...formData, plot_number: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.location')} *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                        placeholder={i18n.language === 'hi' ? "उदा: सेक्टर 45, पटना, बिहार" : "e.g., Sector 45, Patna, Bihar"}
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.size')} *</label>
                      <input
                        type="text"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                        placeholder={i18n.language === 'hi' ? "उदा: 1200 वर्ग फीट" : "e.g., 1200 sq ft"}
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.price')} *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.status')}</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                      >
                        <option value="available">{i18n.language === 'hi' ? 'उपलब्ध' : 'Available'}</option>
                        <option value="booked">{i18n.language === 'hi' ? 'बुक किया हुआ' : 'Booked'}</option>
                        <option value="sold">{i18n.language === 'hi' ? 'बिक गया' : 'Sold'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Price Display Settings */}
                  <div className="mt-6 mb-4">
                    <h3 className={`text-lg font-bold mb-3 text-primary ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? '💰 मूल्य प्रदर्शन सेटिंग्स' : '💰 Price Display Settings'}
                    </h3>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                        {i18n.language === 'hi' ? 'मूल्य कैसे दिखाएं?' : 'How to Display Price?'}
                      </label>
                      <select
                        value={formData.price_display}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ 
                            ...formData, 
                            price_display: value,
                            show_price: value !== 'hidden' // Auto-set show_price based on selection
                          });
                        }}
                        className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                      >
                        <option value="exact">{i18n.language === 'hi' ? '✅ सटीक मूल्य दिखाएं (जैसे: ₹25,00,000)' : '✅ Show Exact Price (e.g., ₹25,00,000)'}</option>
                        <option value="masked">{i18n.language === 'hi' ? '🔒 मास्क किया हुआ मूल्य (जैसे: ₹25xxxxx)' : '🔒 Masked Price (e.g., ₹25xxxxx)'}</option>
                        <option value="hidden">{i18n.language === 'hi' ? '❌ मूल्य छुपाएं (संपर्क करें दिखाएं)' : '❌ Hide Price (Show "Contact for Price")'}</option>
                      </select>
                      <p className={`text-xs text-gray-500 mt-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                        {i18n.language === 'hi' 
                          ? 'ग्राहक वेबसाइट पर यह देखेंगे'
                          : 'This is what customers will see on the website'}
                      </p>
                    </div>
                  </div>

                  {/* Contact Information (Optional per Plot) */}
                  <div className="mt-6 mb-4">
                    <h3 className={`text-lg font-bold mb-3 text-primary ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? '📞 संपर्क जानकारी (वैकल्पिक)' : '📞 Contact Information (Optional)'}
                    </h3>
                    <p className={`text-sm text-gray-600 mb-3 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'यदि खाली छोड़ा जाता है, तो मालिक संपर्क का उपयोग किया जाएगा' : 'If left empty, owner contact will be used'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                          {i18n.language === 'hi' ? 'फ़ोन' : 'Phone'}
                        </label>
                        <input
                          type="text"
                          value={formData.contact_phone}
                          onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                          {i18n.language === 'hi' ? 'ईमेल' : 'Email'}
                        </label>
                        <input
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                          placeholder="contact@example.com"
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                          {i18n.language === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'}
                        </label>
                        <input
                          type="text"
                          value={formData.contact_whatsapp}
                          onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                          placeholder="+919876543210"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <MediaUpload
                        existingMedia={{ images: formData.images, videos: formData.videos }}
                        onMediaChange={(media) => setFormData({ ...formData, images: media.images, videos: media.videos })}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.description')}</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="md:col-span-2">
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.features')} ({i18n.language === 'hi' ? 'अल्पविराम से अलग करें' : 'comma-separated'})</label>
                      <input
                        type="text"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                        placeholder={i18n.language === 'hi' ? "उदा: कोने की जमीन, पानी कनेक्शन, बिजली" : "e.g., Corner Plot, Water Connection, Electricity"}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.mapUrl')}</label>
                      <input
                        type="text"
                        value={formData.map_url}
                        onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder={i18n.language === 'hi' ? "गूगल मैप्स URL यहां पेस्ट करें" : "Paste Google Maps embed URL"}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.mapLatitude')}</label>
                      <input
                        type="number"
                        step="any"
                        value={formData.map_lat}
                        onChange={(e) => setFormData({ ...formData, map_lat: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder={i18n.language === 'hi' ? "उदा: 25.5941" : "e.g., 25.5941"}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.mapLongitude')}</label>
                      <input
                        type="number"
                        step="any"
                        value={formData.map_lng}
                        onChange={(e) => setFormData({ ...formData, map_lng: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="e.g., 85.1376"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={closeModal} className={`btn-outline flex items-center ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      <FaTimes className="mr-2" />
                      {t('admin.cancel')}
                    </button>
                    <button type="submit" className={`btn-primary flex items-center ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      <FaSave className="mr-2" />
                      {i18n.language === 'hi' ? 'प्लॉट सहेजें' : 'Save Plot'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlots;

