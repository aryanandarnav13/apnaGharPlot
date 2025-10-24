import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import BackButton from '../components/BackButton';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate(isAdmin() ? '/admin' : '/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);
    
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <BackButton to="/" />
        <div className="text-center mb-8">
          <h2 className={`text-4xl font-bold text-bihar-red mb-2 drop-shadow ${i18n.language === 'hi' ? 'font-hindi' : 'font-montserrat'}`}>
            {t('auth.login')}
          </h2>
          <p className={`text-gray-700 font-semibold ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
            {i18n.language === 'hi' ? 'अपने खाते में लॉगिन करें' : 'Login to your account'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 border-2 border-transparent hover:border-bihar-yellow transition">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className={`block text-sm font-semibold text-bihar-red mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-bihar-yellow bg-white text-gray-900"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-semibold text-bihar-red mb-2 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-bihar-yellow bg-white text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary ${i18n.language === 'hi' ? 'font-hindi' : ''}`}
            >
              {loading ? (i18n.language === 'hi' ? 'लॉगिन हो रहा है...' : 'Logging in...') : t('auth.loginButton')}
            </button>
          </form>

          <div className="mt-6">
            <p className={`text-center text-gray-700 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register" className="text-bihar-red font-bold hover:underline hover:text-bihar-green">
                {t('auth.registerHere')}
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-bihar-yellow/30">
            <p className={`text-sm text-bihar-red font-semibold text-center mb-3 ${i18n.language === 'hi' ? 'font-hindi' : ''}`}>
              {i18n.language === 'hi' ? 'एडमिन क्रेडेंशियल्स:' : 'Admin Credentials:'}
            </p>
            <div className="text-xs text-gray-700 text-center bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded">
              <p><strong>Admin:</strong> admin@example.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

