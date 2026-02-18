import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiAutoRepair } from 'react-icons/gi';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'customer',
    phone: '', businessName: '', businessLicense: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 animate-fadeIn">
      <div className="card p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <GiAutoRepair className="text-primary-500 text-4xl mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-steel-800 dark:text-gray-200">📝 Create Account</h1>
          <p className="text-steel-500 dark:text-gray-400 text-sm">Join SparePartsHub today — it's free! 🔧</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="flex gap-4">
            {['customer', 'wholesaler'].map((role) => (
              <label key={role} className={`flex-1 text-center py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                form.role === role ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-steel-200 dark:border-gray-600 hover:border-steel-300 dark:hover:border-gray-500 dark:text-gray-300'
              }`}>
                <input type="radio" name="role" value={role} checked={form.role === role} onChange={update('role')} className="hidden" />
                <span className="font-medium capitalize">{role === 'customer' ? '🛒 Customer' : '🏪 Wholesaler'}</span>
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
              <input type="tel" className="input-field" value={form.phone} onChange={update('phone')} />
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

          {form.role === 'wholesaler' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-accent-50 dark:bg-gray-700 rounded-lg animate-slideDown">
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🏢 Business Name</label>
                <input type="text" className="input-field" value={form.businessName} onChange={update('businessName')} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📄 Business License</label>
                <input type="text" className="input-field" value={form.businessLicense} onChange={update('businessLicense')} />
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
