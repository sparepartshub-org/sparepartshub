import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiAutoRepair } from 'react-icons/gi';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form);
      toast.success('Welcome back!');
      const routes = { admin: '/admin/dashboard', wholesaler: '/wholesaler/dashboard', customer: '/products' };
      navigate(routes[data.user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <GiAutoRepair className="text-primary-500 text-4xl mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-steel-800">Welcome Back</h1>
          <p className="text-steel-500 text-sm">Sign in to your SparePartsHub account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-steel-700 mb-1">Email</label>
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
            <label className="block text-sm font-medium text-steel-700 mb-1">Password</label>
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-steel-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 font-semibold hover:underline">Register</Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 p-3 bg-steel-50 rounded-lg text-xs text-steel-500">
          <p className="font-semibold mb-1">Demo Accounts:</p>
          <p>Admin: admin@sparepartshub.com / admin123</p>
          <p>Wholesaler: wholesaler@sparepartshub.com / wholesaler123</p>
          <p>Customer: customer@sparepartshub.com / customer123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
