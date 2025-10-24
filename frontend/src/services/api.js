import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Plots API
export const plotsAPI = {
  getAll: (params) => api.get('/plots', { params }),
  getOne: (id) => api.get(`/plots/${id}`),
  create: (data) => api.post('/plots', data),
  update: (id, data) => api.put(`/plots/${id}`, data),
  delete: (id) => api.delete(`/plots/${id}`),
};

// House Designs API
export const houseDesignsAPI = {
  getAll: (params) => api.get('/house-designs', { params }),
  getOne: (id) => api.get(`/house-designs/${id}`),
  create: (data) => api.post('/house-designs', data),
  update: (id, data) => api.put(`/house-designs/${id}`, data),
  delete: (id) => api.delete(`/house-designs/${id}`),
};

// Inquiries API (replaces Bookings)
export const inquiriesAPI = {
  getAll: () => api.get('/inquiries'),
  getOne: (id) => api.get(`/inquiries/${id}`),
  create: (data) => api.post('/inquiries', data),
  update: (id, data) => api.put(`/inquiries/${id}`, data),
  delete: (id) => api.delete(`/inquiries/${id}`),
  getStats: () => api.get('/inquiries/stats/dashboard'),
};

// Owner Info API
export const ownerInfoAPI = {
  getAll: (params) => api.get('/owner-info', { params }),
  getOne: (id) => api.get(`/owner-info/${id}`),
  create: (data) => api.post('/owner-info', data),
  update: (id, data) => api.put(`/owner-info/${id}`, data),
  delete: (id) => api.delete(`/owner-info/${id}`),
};

// Settings API
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  getOne: (key) => api.get(`/settings/${key}`),
  update: (key, data) => api.put(`/settings/${key}`, data),
};

export default api;

