import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inquiriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaCalendar } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await inquiriesAPI.getAll();
      setInquiries(response.data.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
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

  const stats = {
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter(i => i.status === 'inquired').length,
    bookedInquiries: inquiries.filter(i => i.status === 'booked').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-montserrat font-bold mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-white/90">
            Manage your plot inquiries and profile
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              <h2 className="text-2xl font-montserrat font-bold text-center mb-6">
                {user?.name}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <FaEnvelope className="mr-3 text-primary" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center text-gray-700">
                    <FaPhone className="mr-3 text-primary" />
                    <span className="text-sm">{user?.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <FaCalendar className="mr-3 text-primary" />
                  <span className="text-sm">
                    Member since {new Date(user?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 mt-6">
              <h3 className="font-montserrat font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/plots" className="block w-full btn-primary text-center py-2">
                  Browse Plots
                </Link>
                <Link to="/my-inquiries" className="block w-full btn-outline text-center py-2">
                  View All Inquiries
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Total Inquiries</p>
                    <p className="text-3xl font-bold text-primary">{stats.totalInquiries}</p>
                  </div>
                  <FaHome className="text-4xl text-primary/20" />
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">New</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.newInquiries}</p>
                  </div>
                  <FaCalendar className="text-4xl text-yellow-600/20" />
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Booked</p>
                    <p className="text-3xl font-bold text-green-600">{stats.bookedInquiries}</p>
                  </div>
                  <FaHome className="text-4xl text-green-600/20" />
                </div>
              </div>
            </div>

            {/* Recent Inquiries */}
            <div className="card p-6">
              <h2 className="text-2xl font-montserrat font-bold mb-6">Recent Inquiries</h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.slice(0, 5).map((inquiry) => (
                    <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">
                          Plot {inquiry.plot?.plot_number}
                        </h3>
                        <span className={`${getStatusColor(inquiry.status)} capitalize`}>
                          {inquiry.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {inquiry.plot?.location && (
                        <p className="text-gray-600 text-sm mb-2">
                          {inquiry.plot.location}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Status: {inquiry.status.replace('_', ' ')}</span>
                        <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}

                  {inquiries.length > 5 && (
                    <Link to="/my-inquiries" className="block text-center text-primary hover:underline mt-4">
                      View All Inquiries
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaHome className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No inquiries yet</p>
                  <Link to="/plots" className="btn-primary inline-block">
                    Browse Available Plots
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

