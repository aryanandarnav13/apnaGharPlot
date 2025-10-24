import React, { useState, useEffect } from 'react';
import { ownerInfoAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaUser, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import ImageUpload from '../../components/ImageUpload';
import BackButton from '../../components/BackButton';
import { useTranslation } from 'react-i18next';

const AdminOwnerInfo = () => {
  const { t, i18n } = useTranslation();
  const [ownerInfoList, setOwnerInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInfo, setEditingInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    name_hi: '',
    designation: '',
    designation_hi: '',
    bio: '',
    bio_hi: '',
    photo: '',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await ownerInfoAPI.getAll({ show_all: true });
      setOwnerInfoList(response.data.data);
    } catch (error) {
      toast.error('Failed to load owner info');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInfo) {
        await ownerInfoAPI.update(editingInfo.id, formData);
        toast.success('Owner info updated successfully');
      } else {
        await ownerInfoAPI.create(formData);
        toast.success('Owner info created successfully');
      }
      fetchData();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this owner info?')) {
      try {
        await ownerInfoAPI.delete(id);
        toast.success('Owner info deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete owner info');
      }
    }
  };

  const toggleActive = async (info) => {
    try {
      await ownerInfoAPI.update(info.id, { ...info, is_active: !info.is_active });
      toast.success(`Owner info ${!info.is_active ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openModal = (info = null) => {
    if (info) {
      setEditingInfo(info);
      setFormData({
        name: info.name,
        name_hi: info.name_hi || '',
        designation: info.designation || '',
        designation_hi: info.designation_hi || '',
        bio: info.bio,
        bio_hi: info.bio_hi || '',
        photo: info.photo || '',
        order: info.order,
        is_active: info.is_active
      });
    } else {
      setEditingInfo(null);
      setFormData({
        name: '',
        name_hi: '',
        designation: '',
        designation_hi: '',
        bio: '',
        bio_hi: '',
        photo: '',
        order: 0,
        is_active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingInfo(null);
    setFormData({
      name: '',
      designation: '',
      bio: '',
      photo: '',
      order: 0,
      is_active: true
    });
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
                {t('admin.manageOwnerInfo')}
              </h1>
              <p className={`text-xl text-white/90 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                {i18n.language === 'hi' ? 'वेबसाइट पर दिखाए गए टीम सदस्य प्रोफाइल प्रबंधित करें' : 'Manage team member profiles displayed on the website'}
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className={`bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 flex items-center shadow-lg ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
            >
              <FaPlus className="mr-2" /> {t('admin.addNew')}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <BackButton to="/admin" label={t('admin.backToDashboard')} />
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.photo')}</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.name')}</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.designation')}</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.displayOrder')}</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ownerInfoList.map((info) => (
                  <tr key={info.id} className={!info.is_active ? 'opacity-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {info.photo ? (
                        <img
                          src={info.photo.startsWith('/uploads') ? `http://localhost:5000${info.photo}` : info.photo}
                          alt={info.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{info.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{info.designation || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{info.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(info)}
                        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                          info.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {info.is_active ? <FaToggleOn /> : <FaToggleOff />}
                        <span>{info.is_active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(info)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(info.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingInfo ? 'Edit Owner Info' : 'Add New Owner Info'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* English Fields */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">English Content</h3>
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                    Designation (English)
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="e.g., Founder & CEO"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Biography (English) *
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
              </div>

        {/* Hindi Fields */}
        <div className="bg-orange-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Hindi Content (हिंदी) - <span className="text-sm text-gray-600 font-normal">Optional - Leave empty to use English text</span>
          </h3>
                
                <div className="mb-4">
                  <label htmlFor="name_hi" className="block text-sm font-medium text-gray-700">
                    Name (Hindi)
                  </label>
                  <input
                    type="text"
                    id="name_hi"
                    name="name_hi"
                    value={formData.name_hi}
                    onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-hindi"
                    placeholder="उदाहरण: दीपक कुमार सिंह"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="designation_hi" className="block text-sm font-medium text-gray-700">
                    Designation (Hindi)
                  </label>
                  <input
                    type="text"
                    id="designation_hi"
                    name="designation_hi"
                    value={formData.designation_hi}
                    onChange={(e) => setFormData({ ...formData, designation_hi: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-hindi"
                    placeholder="उदाहरण: संस्थापक और सीईओ"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="bio_hi" className="block text-sm font-medium text-gray-700">
                    Biography (Hindi)
                  </label>
                  <textarea
                    id="bio_hi"
                    name="bio_hi"
                    rows="4"
                    value={formData.bio_hi}
                    onChange={(e) => setFormData({ ...formData, bio_hi: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-hindi"
                    placeholder="हिंदी में जीवनी लिखें..."
                  />
                </div>
              </div>

              <div className="mb-4">
                <ImageUpload
                  label="Photo"
                  onImagesChange={(image) => {
                    setFormData({ ...formData, photo: image || '' });
                  }}
                  existingImages={formData.photo ? [formData.photo] : []}
                  multiple={false}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                  Display Order (lower appears first)
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (Show on website)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200 flex items-center"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition duration-200 flex items-center"
                >
                  <FaSave className="mr-2" /> {editingInfo ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOwnerInfo;

