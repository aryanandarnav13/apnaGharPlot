import React, { useState, useEffect } from 'react';
import { inquiriesAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaEdit, FaSave, FaTimes, FaEye } from 'react-icons/fa';
import BackButton from '../../components/BackButton';
import { useTranslation } from 'react-i18next';

const AdminInquiries = () => {
  const { t, i18n } = useTranslation();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await inquiriesAPI.getAll();
      setInquiries(response.data.data);
    } catch (error) {
      toast.error(i18n.language === 'hi' ? 'पूछताछ लोड करने में विफल' : 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await inquiriesAPI.update(selectedInquiry.id, { 
        status: newStatus,
        admin_notes: adminNotes
      });
      toast.success(i18n.language === 'hi' ? 'स्थिति अपडेट हो गई' : 'Status updated successfully');
      fetchInquiries();
      closeModal();
    } catch (error) {
      toast.error(i18n.language === 'hi' ? 'स्थिति अपडेट करने में विफल' : 'Failed to update status');
    }
  };

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setNewStatus(inquiry.status);
    setAdminNotes(inquiry.admin_notes || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInquiry(null);
    setNewStatus('');
    setAdminNotes('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'inquired':
        return 'badge-info';
      case 'in_progress':
        return 'badge-warning';
      case 'booked':
        return 'badge-success';
      case 'closed':
        return 'badge';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge';
    }
  };

  const getStatusLabel = (status) => {
    if (i18n.language === 'hi') {
      const hindiLabels = {
        'inquired': 'नई पूछताछ',
        'in_progress': 'प्रगति में',
        'booked': 'बुक किया हुआ',
        'closed': 'बंद',
        'cancelled': 'रद्द'
      };
      return hindiLabels[status] || status;
    }
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(b => b.status === filter);

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
          <h1 className={`text-3xl font-bold ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
            {i18n.language === 'hi' ? 'पूछताछ प्रबंधित करें' : 'Manage Inquiries'}
          </h1>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${i18n.language === 'hi' ? 'font-hindi' : ''} ${
                filter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i18n.language === 'hi' ? 'सभी' : 'All'} ({inquiries.length})
            </button>
            <button
              onClick={() => setFilter('inquired')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${i18n.language === 'hi' ? 'font-hindi' : ''} ${
                filter === 'inquired' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i18n.language === 'hi' ? 'नई' : 'New'} ({inquiries.filter(b => b.status === 'inquired').length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${i18n.language === 'hi' ? 'font-hindi' : ''} ${
                filter === 'in_progress' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i18n.language === 'hi' ? 'प्रगति में' : 'In Progress'} ({inquiries.filter(b => b.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setFilter('booked')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${i18n.language === 'hi' ? 'font-hindi' : ''} ${
                filter === 'booked' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i18n.language === 'hi' ? 'बुक किया हुआ' : 'Booked'} ({inquiries.filter(b => b.status === 'booked').length})
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${i18n.language === 'hi' ? 'font-hindi' : ''} ${
                filter === 'closed' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i18n.language === 'hi' ? 'बंद' : 'Closed'} ({inquiries.filter(b => b.status === 'closed').length})
            </button>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  ID
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? 'यूजर' : 'User'}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? 'प्लॉट' : 'Plot'}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('admin.status')}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? 'तिथि' : 'Date'}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">#{inquiry.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-sm">{inquiry.name}</p>
                      <p className="text-xs text-gray-500">{inquiry.phone}</p>
                      {inquiry.email && <p className="text-xs text-gray-500">{inquiry.email}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-sm">{inquiry.plot?.plot_number}</p>
                      <p className="text-xs text-gray-500">{inquiry.plot?.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getStatusColor(inquiry.status)} capitalize ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {getStatusLabel(inquiry.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openModal(inquiry)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title={i18n.language === 'hi' ? 'संपादित करें' : 'Edit'}
                    >
                      <FaEdit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInquiries.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-gray-500 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                {i18n.language === 'hi' ? 'कोई पूछताछ नहीं मिली' : 'No inquiries found'}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className={`text-2xl font-bold mb-6 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                  {i18n.language === 'hi' ? 'पूछताछ विवरण' : 'Inquiry Details'}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className={`font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'ग्राहक जानकारी' : 'Customer Information'}
                    </h3>
                    <p className="text-sm"><strong>{t('admin.name')}:</strong> {selectedInquiry.name}</p>
                    <p className="text-sm"><strong>{t('admin.phone')}:</strong> {selectedInquiry.phone}</p>
                    {selectedInquiry.email && <p className="text-sm"><strong>{t('admin.email')}:</strong> {selectedInquiry.email}</p>}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className={`font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'प्लॉट विवरण' : 'Plot Details'}
                    </h3>
                    <p className="text-sm"><strong>{i18n.language === 'hi' ? 'प्लॉट नंबर' : 'Plot'}:</strong> {selectedInquiry.plot?.plot_number}</p>
                    <p className="text-sm"><strong>{t('admin.location')}:</strong> {selectedInquiry.plot?.location}</p>
                    <p className="text-sm"><strong>{t('admin.price')}:</strong> {formatPrice(selectedInquiry.plot?.price)}</p>
                  </div>

                  {selectedInquiry.message && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className={`font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                        {i18n.language === 'hi' ? 'ग्राहक संदेश' : 'Customer Message'}
                      </h3>
                      <p className="text-sm">{selectedInquiry.message}</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleUpdateStatus}>
                  <div className="mb-4">
                    <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'स्थिति अपडेट करें' : 'Update Status'}
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                      required
                    >
                      <option value="inquired">{i18n.language === 'hi' ? 'नई पूछताछ' : 'New Inquiry'}</option>
                      <option value="in_progress">{i18n.language === 'hi' ? 'प्रगति में' : 'In Progress'}</option>
                      <option value="booked">{i18n.language === 'hi' ? 'बुक किया हुआ' : 'Booked'}</option>
                      <option value="closed">{i18n.language === 'hi' ? 'बंद' : 'Closed'}</option>
                      <option value="cancelled">{i18n.language === 'hi' ? 'रद्द' : 'Cancelled'}</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className={`block text-sm font-semibold mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                      {i18n.language === 'hi' ? 'एडमिन टिप्पणियां' : 'Admin Notes'}
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                      rows="3"
                      placeholder={i18n.language === 'hi' ? 'आंतरिक नोट्स...' : 'Internal notes for tracking...'}
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className={`px-4 py-2 border rounded-lg hover:bg-gray-50 transition ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                    >
                      <FaTimes className="inline mr-2" />
                      {t('admin.cancel')}
                    </button>
                    <button
                      type="submit"
                      className={`btn-primary flex items-center ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
                    >
                      <FaSave className="mr-2" />
                      {t('admin.save')}
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

export default AdminInquiries;

