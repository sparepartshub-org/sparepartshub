/**
 * Admin Dashboard — analytics overview with charts
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/admin.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiAlertCircle, FiTruck } from 'react-icons/fi';

const COLORS = ['#1e40af', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#06b6d4', '#f97316'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!data) return <div className="text-center py-16 dark:text-gray-400">Failed to load dashboard</div>;

  const { stats, ordersByStatus, topProducts, recentOrders } = data;

  const statCards = [
    { label: '💰 Total Sales', value: `₹${stats.totalSales.toLocaleString('en-IN')}`, icon: <FiDollarSign />, color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
    { label: '📦 Total Orders', value: stats.totalOrders, icon: <FiShoppingBag />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' },
    { label: '👥 Total Users', value: stats.totalUsers, icon: <FiUsers />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' },
    { label: '⚙️ Products', value: stats.totalProducts, icon: <FiPackage />, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400' },
    { label: '🏪 Dealers', value: stats.totalWholesalers, icon: <FiTruck />, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' },
    { label: '🚨 Open Complaints', value: stats.openComplaints, icon: <FiAlertCircle />, color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200 mb-6">👑 Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="card p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slideUp" style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold text-steel-800 dark:text-gray-200">{s.value}</p>
            <p className="text-xs text-steel-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/admin/users" className="btn-primary">👥 Manage Users</Link>
        <Link to="/admin/orders" className="btn-secondary">📦 All Orders</Link>
        <Link to="/admin/complaints" className="btn-secondary">📋 Complaints</Link>
        <Link to="/admin/categories" className="btn-secondary">🏷️ Categories</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products Chart */}
        <div className="card p-6">
          <h3 className="font-bold text-steel-800 dark:text-gray-200 mb-4">📊 Top Products by Quantity Sold</h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalQty" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-steel-500 dark:text-gray-400 text-sm">No data yet</p>
          )}
        </div>

        {/* Orders by Status Pie */}
        <div className="card p-6">
          <h3 className="font-bold text-steel-800 dark:text-gray-200 mb-4">🥧 Orders by Status</h3>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={ordersByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({ _id, count }) => `${_id}: ${count}`}>
                  {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-steel-500 dark:text-gray-400 text-sm">No orders yet</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <h3 className="font-bold text-steel-800 dark:text-gray-200 mb-4">🆕 Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-steel-200 dark:border-gray-700 text-steel-500 dark:text-gray-400">
                <th className="text-left py-2">Order #</th>
                <th className="text-left py-2">Customer</th>
                <th className="text-left py-2">Status</th>
                <th className="text-right py-2">Total</th>
                <th className="text-right py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-steel-100 dark:border-gray-700">
                  <td className="py-3 font-medium dark:text-gray-200">{order.orderNumber}</td>
                  <td className="py-3 dark:text-gray-300">{order.customer?.name}</td>
                  <td className="py-3"><StatusBadge status={order.status} /></td>
                  <td className="py-3 text-right font-semibold dark:text-gray-200">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right text-steel-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
