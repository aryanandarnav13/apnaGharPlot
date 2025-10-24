import React, { useState, useEffect } from 'react';
import { houseDesignsAPI, plotsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaRupeeSign, FaHome } from 'react-icons/fa';
import ImageUpload from '../../components/ImageUpload';
import BackButton from '../../components/BackButton';
import { useTranslation } from 'react-i18next';

const AdminHouseDesigns = () => {
  const { t, i18n } = useTranslation();
  const [designs, setDesigns] = useState([]);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [formData, setFormData] = useState({
    plot_id: '',
    estimated_construction_cost: '',
    image: '',
    images: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [designsRes, plotsRes] = await Promise.all([
        houseDesignsAPI.getAll(),
        plotsAPI.getAll()
      ]);
      setDesigns(designsRes.data.data);
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
        images: formData.images && formData.images.length > 0 ? JSON.stringify(formData.images) : null
      };

      if (editingDesign) {
        await houseDesignsAPI.update(editingDesign.id, submitData);
        toast.success('House design updated successfully');
      } else {
        await houseDesignsAPI.create(submitData);
        toast.success('House design created successfully');
      }
      fetchData();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this house design?')) {
      try {
        await houseDesignsAPI.delete(id);
        toast.success('House design deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete house design');
      }
    }
  };

  const openModal = (design = null) => {
    if (design) {
      setEditingDesign(design);
      setFormData({
        plot_id: design.plot_id,
        estimated_construction_cost: design.estimated_construction_cost,
        image: design.image || '',
        images: design.images ? JSON.parse(design.images) : (design.image ? [design.image] : [])
      });
    } else {
      setEditingDesign(null);
      setFormData({
        plot_id: '',
        estimated_construction_cost: '',
        image: '',
        images: []
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDesign(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImagesChange = (newImages) => {
    setFormData({
      ...formData,
      images: newImages,
      image: newImages.length > 0 ? newImages[0] : ''
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
                {t('admin.manageHouseDesigns')}
              </h1>
              <p className={`text-xl text-white/90 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                {i18n.language === 'hi' ? 'हर प्लॉट के लिए घर डिज़ाइन विकल्प प्रबंधित करें' : 'Manage house design options for each plot'}
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className={`bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center space-x-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
            >
              <FaPlus />
              <span>{t('admin.addHouseDesign')}</span>
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
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>ID</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{i18n.language === 'hi' ? 'प्लॉट' : 'Plot'}</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.image')}</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.estimatedCost')}</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{i18n.language === 'hi' ? 'फोटो संख्या' : 'Images Count'}</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {designs.map((design) => (
                  <tr key={design.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{design.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaHome className="text-primary mr-2" />
                        <div>
                          <div className="font-medium">{design.plot?.plot_number}</div>
                          <div className="text-sm text-gray-500">{design.plot?.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {design.image && (
                        <img
                          src={design.image}
                          alt="House Design"
                          className="h-16 w-24 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-green-600 font-semibold">
                        <FaRupeeSign className="mr-1" />
                        {parseFloat(design.estimated_construction_cost).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {design.images ? JSON.parse(design.images).length : 0} images
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(design)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(design.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {designs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No house designs found. Add your first design!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-montserrat font-bold">
                  {editingDesign ? 'Edit House Design' : 'Add House Design'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Plot Selection */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Select Plot <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="plot_id"
                    value={formData.plot_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a plot...</option>
                    {plots.map((plot) => (
                      <option key={plot.id} value={plot.id}>
                        {plot.plot_number} - {plot.location} ({plot.size})
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Select which plot this house design is for
                  </p>
                </div>

                {/* Estimated Construction Cost */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Estimated Construction Cost (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="estimated_construction_cost"
                    value={formData.estimated_construction_cost}
                    onChange={handleChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 3500000"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Estimated cost to build this house design on the plot
                  </p>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    House Design Images
                  </label>
                  <ImageUpload
                    existingImages={formData.images}
                    onImagesChange={handleImagesChange}
                    multiple={true}
                    label="House Design Images"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload multiple images of the house design (floor plans, renders, etc.)
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <FaTimes className="inline mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
                  >
                    <FaSave className="inline mr-2" />
                    {editingDesign ? 'Update Design' : 'Create Design'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHouseDesigns;
