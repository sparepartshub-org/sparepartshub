import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiAutoRepair } from 'react-icons/gi';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleGoogleResponse = useCallback(async (response) => {
    if (!response.credential) return;
    setLoading(true);
    try {
      const data = await googleLogin(response.credential);
      toast.success('Welcome! 🔧');
      const routes = { admin: '/admin', wholesaler: '/wholesaler', customer: '/products' };
      navigate(routes[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  }, [googleLogin, navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const loadGoogleScript = () => {
      if (document.getElementById('google-gsi-script')) return;
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
          });
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-btn'),
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
              shape: 'rectangular',
              logo_alignment: 'center',
            }
          );
        }
      };
      document.body.appendChild(script);
    };

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'center',
        }
      );
    } else {
      loadGoogleScript();
    }
  }, [handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      toast.success('Welcome back! 🔧');
      const routes = { admin: '/admin', wholesaler: '/wholesaler', customer: '/products' };
      navigate(routes[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fadeIn">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <GiAutoRepair className="text-primary-500 text-4xl mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-steel-800 dark:text-gray-200">🔑 Welcome Back</h1>
          <p className="text-steel-500 dark:text-gray-400 text-sm">Sign in to your SparePartsHub account</p>
        </div>

        {/* Google Sign-In Button */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div id="google-signin-btn" className="flex justify-center mb-4"></div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-steel-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-steel-400 dark:text-gray-500">or sign in with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📧 Email</label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🔒 Password</label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-steel-500 dark:text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 font-semibold hover:underline">Register</Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 p-3 bg-steel-50 dark:bg-gray-700 rounded-lg text-xs text-steel-500 dark:text-gray-400">
          <p className="font-semibold mb-1">🧪 Demo Accounts:</p>
          <p>👑 Admin: admin@sparepartshub.com / admin123</p>
          <p>🏪 Dealer: wholesaler@sparepartshub.com / wholesaler123</p>
          <p>🛒 Customer: customer@sparepartshub.com / customer123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
