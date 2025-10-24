import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { plotsAPI } from '../services/api';
import PlotCard from '../components/PlotCard';
import { toast } from 'react-toastify';
import { FaFilter, FaMapMarkerAlt } from 'react-icons/fa';
import BackButton from '../components/BackButton';

const Plots = () => {
  const { t, i18n } = useTranslation();
  const [plots, setPlots] = useState([]);
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [plots, statusFilter, priceFilter, locationFilter]);

  const fetchData = async () => {
    try {
      const plotsRes = await plotsAPI.getAll();
      setPlots(plotsRes.data.data);
    } catch (error) {
      console.error('Error fetching plots:', error);
      toast.error('Failed to load plots');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...plots];

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(plot => plot.location.includes(locationFilter));
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plot => plot.status === statusFilter);
    }

    // Price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'low':
          filtered = filtered.filter(plot => plot.price < 3000000);
          break;
        case 'medium':
          filtered = filtered.filter(plot => plot.price >= 3000000 && plot.price < 5000000);
          break;
        case 'high':
          filtered = filtered.filter(plot => plot.price >= 5000000);
          break;
        default:
          break;
      }
    }

    setFilteredPlots(filtered);
  };

  const uniqueLocations = [...new Set(plots.map(p => {
    // Extract city from location (e.g., "Sector 45, Patna, Bihar" -> "Patna")
    const parts = p.location.split(',');
    return parts.length >= 2 ? parts[parts.length - 2].trim() : p.location;
  }))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-madhubani"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className={`text-4xl font-bold mb-4 drop-shadow-lg ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
            {t('nav.projects')}
          </h1>
          <p className={`text-xl text-white/95 drop-shadow ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
            {t('plots.subtitle')}
          </p>
        </div>
      </section>

      {/* Filters & Plots */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <BackButton to="/" />
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="card p-6 sticky top-24">
                <h3 className="flex items-center text-lg font-montserrat font-bold mb-4 text-primary">
                  <FaFilter className="mr-2" />
                  Filters
                </h3>

                {/* Location Filter */}
                {uniqueLocations.length > 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-secondary" />
                      Location
                    </label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">All Locations</option>
                      {uniqueLocations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Status Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Prices</option>
                    <option value="low">Below ₹30 Lakhs</option>
                    <option value="medium">₹30 - ₹50 Lakhs</option>
                    <option value="high">Above ₹50 Lakhs</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setLocationFilter('all');
                    setStatusFilter('all');
                    setPriceFilter('all');
                  }}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white py-2 rounded-lg shadow-md hover:shadow-lg transition text-sm font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Plots Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-montserrat font-bold text-gray-800">
                  Available Plots
                  <span className="text-primary ml-2">({filteredPlots.length})</span>
                </h2>
              </div>

              {filteredPlots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlots.map((plot) => (
                    <PlotCard key={plot.id} plot={plot} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No plots found matching your criteria
                  </p>
                  <button
                    onClick={() => {
                      setLocationFilter('all');
                      setStatusFilter('all');
                      setPriceFilter('all');
                    }}
                    className="mt-4 text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Plots;

