import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n/config'; // Initialize i18n

// Context
import { AuthProvider } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Plots from './pages/Plots';
import PlotDetail from './pages/PlotDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserInquiries from './pages/UserInquiries';
import AdminDashboard from './pages/AdminDashboard';
import AdminPlots from './pages/admin/AdminPlots';
import AdminHouseDesigns from './pages/admin/AdminHouseDesigns';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminOwnerInfo from './pages/admin/AdminOwnerInfo';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plots" element={<Plots />} />
              <Route path="/plots/:id" element={<PlotDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected User Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/my-inquiries" element={
                <PrivateRoute>
                  <UserInquiries />
                </PrivateRoute>
              } />
              <Route path="/my-bookings" element={
                <PrivateRoute>
                  <UserInquiries />
                </PrivateRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/plots" element={
                <AdminRoute>
                  <AdminPlots />
                </AdminRoute>
              } />
              <Route path="/admin/house-designs" element={
                <AdminRoute>
                  <AdminHouseDesigns />
                </AdminRoute>
              } />
              <Route path="/admin/inquiries" element={
                <AdminRoute>
                  <AdminInquiries />
                </AdminRoute>
              } />
              <Route path="/admin/owner-info" element={
                <AdminRoute>
                  <AdminOwnerInfo />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
}

export default App;

