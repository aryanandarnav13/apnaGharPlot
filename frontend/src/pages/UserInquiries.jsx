import React, { useState, useEffect } from 'react';
import { inquiriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import BackButton from '../components/BackButton';

const UserInquiries = () => {
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
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
        <BackButton to="/dashboard" />
        <h1 className="text-3xl font-bold font-montserrat mb-8">My Inquiries</h1>

        {inquiries.length > 0 ? (
          <div className="grid gap-6">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Plot {inquiry.plot?.plot_number}
                    </h3>
                    <p className="text-gray-600">{inquiry.plot?.location}</p>
                  </div>
                  <span className={`${getStatusColor(inquiry.status)} capitalize`}>
                    {inquiry.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-semibold">{inquiry.plot?.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold">{formatPrice(inquiry.plot?.price)}</p>
                  </div>
                </div>

                {inquiry.message && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Your Message</p>
                    <p className="text-gray-700">{inquiry.message}</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t">
                  <span>Submitted on: {new Date(inquiry.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(inquiry.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-600 mb-4">You haven't submitted any inquiries yet</p>
            <a href="/plots" className="btn-primary inline-block">
              Browse Available Plots
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInquiries;

