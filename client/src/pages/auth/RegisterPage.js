import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiAutoRepair } from 'react-icons/gi';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

const RegisterPage = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'customer',
    phone: '', businessName: '', businessLicense: '', whatsappNumber: '',
    address: { street: '', city: '', state: '', pinCode: '', country: 'India' },
  });
  const [loading, setLoading] = useState(false);

  const handleGoogleResponse = useCallback(async (response) => {
    if (!response.credential) return;
    setLoading(true);
    try {
      const data = await googleLogin(response.credential);
      toast.success('Account created with Google! 🎉');
      const routes = { admin: '/admin', wholesaler: '/wholesaler', customer: '/products' };
      navigate(routes[data.user.role] || '/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-up failed');
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
          window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleResponse });
          window.google.accounts.id.renderButton(document.getElementById('google-signup-btn'), {
            theme: 'outline', size: 'large', width: '100%', text: 'signup_with', shape: 'rectangular', logo_alignment: 'center',
          });
        }
      };
      document.body.appendChild(script);
    };
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleResponse });
      window.google.accounts.id.renderButton(document.getElementById('google-signup-btn'), {
        theme: 'outline', size: 'large', width: '100%', text: 'signup_with', shape: 'rectangular', logo_alignment: 'center',
      });
    } else {
      loadGoogleScript();
    }
  }, [handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone && !/^\+91[0-9]{10}$/.test(form.phone)) {
      return toast.error('Phone must be in +91XXXXXXXXXX format');
    }
    if (form.address.pinCode && !/^[0-9]{6}$/.test(form.address.pinCode)) {
      return toast.error('PIN Code must be exactly 6 digits');
    }
    setLoading(true);
    try {
      const data = await register(form);
      toast.success('Registration successful! 🎉');
      if (data.user.role === 'wholesaler') {
        toast('Your account is pending admin approval. ⏳', { icon: '⏳' });
        navigate('/login');
      } else {
        navigate('/products');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const updateAddress = (field) => (e) => setForm({ ...form, address: { ...form.address, [field]: e.target.value } });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fadeIn">
      <div className="card p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <GiAutoRepair className="text-primary-500 text-4xl mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-steel-800 dark:text-gray-200">📝 Create Account</h1>
          <p className="text-steel-500 dark:text-gray-400 text-sm">Join SparePartsHub today — it's free! 🔧</p>
        </div>

        {/* Google Sign-Up Button */}
        {GOOGLE_CLIENT_ID && (
          <>
            <div id="google-signup-btn" className="flex justify-center mb-4"></div>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-steel-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-steel-400 dark:text-gray-500">or register with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex gap-4">
            {['customer', 'wholesaler'].map((role) => (
              <label key={role} className={`flex-1 text-center py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                form.role === role ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-steel-200 dark:border-gray-600 hover:border-steel-300 dark:hover:border-gray-500 dark:text-gray-300'
              }`}>
                <input type="radio" name="role" value={role} checked={form.role === role} onChange={update('role')} className="hidden" />
                <span className="font-medium capitalize">{role === 'customer' ? '🛒 Customer' : '🏪 Dealer'}</span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">👤 Full Name</label>
              <input type="text" className="input-field" value={form.name} onChange={update('name')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📱 Phone</label>
              <input type="tel" className="input-field" value={form.phone} onChange={update('phone')} placeholder="+91XXXXXXXXXX" />
              <p className="text-xs text-steel-400 dark:text-gray-500 mt-1">Indian mobile: +91 followed by 10 digits</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📧 Email</label>
            <input type="email" className="input-field" value={form.email} onChange={update('email')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🔒 Password</label>
            <input type="password" className="input-field" value={form.password} onChange={update('password')} required minLength={6} />
          </div>

          {/* Address Section */}
          <div className="space-y-4 p-4 bg-steel-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-semibold text-steel-700 dark:text-gray-300">📍 Address (Optional)</h4>
            <div>
              <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">Street</label>
              <input type="text" className="input-field" value={form.address.street} onChange={updateAddress('street')} placeholder="e.g. 42, MG Road, Near City Mall" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">City</label>
                <input type="text" className="input-field" value={form.address.city} onChange={updateAddress('city')} placeholder="e.g. Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">State</label>
                <select className="input-field" value={form.address.state} onChange={updateAddress('state')}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">PIN Code</label>
                <input type="text" className="input-field" value={form.address.pinCode} onChange={updateAddress('pinCode')} placeholder="e.g. 400001" maxLength={6} />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">Country</label>
                <input type="text" className="input-field" value="India" disabled />
              </div>
            </div>
          </div>

          {form.role === 'wholesaler' && (
            <div className="space-y-4 p-4 bg-accent-50 dark:bg-gray-700 rounded-lg animate-slideDown">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🏢 Business Name</label>
                  <input type="text" className="input-field" value={form.businessName} onChange={update('businessName')} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📄 Business License / GSTIN</label>
                  <input type="text" className="input-field" value={form.businessLicense} onChange={update('businessLicense')} placeholder="e.g. 27AABCU9603R1ZN" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">💬 WhatsApp Number</label>
                <input type="tel" className="input-field" value={form.whatsappNumber} onChange={update('whatsappNumber')} placeholder="+91XXXXXXXXXX" />
                <p className="text-xs text-steel-400 dark:text-gray-500 mt-1">Customers will use this to contact you on WhatsApp</p>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? '⏳ Creating account...' : '🚀 Register'}
          </button>
        </form>

        <p className="text-center text-sm text-steel-500 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
