import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/product.service';
import orderService from '../../services/order.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPackage, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';

const WholesalerDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          productService.getMyProducts({ limit: 1 }),
          orderService.getWholesalerOrders({ limit: 5 }),
        ]);
        setStats({ products: prodRes.data.total, orders: orderRes.data.total });
        setRecentOrders(orderRes.data.orders);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200 mb-6">🏪 Wholesaler Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl"><FiPackage /></div>
          <div>
            <p className="text-2xl font-bold text-steel-800 dark:text-gray-200">{stats.products}</p>
            <p className="text-sm text-steel-500 dark:text-gray-400">⚙️ My Products</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 text-xl"><FiShoppingBag /></div>
          <div>
            <p className="text-2xl font-bold text-steel-800 dark:text-gray-200">{stats.orders}</p>
            <p className="text-sm text-steel-500 dark:text-gray-400">📦 Orders Received</p>
          </div>
        </div>
        <Link to="/wholesaler/complaints" className="card p-6 flex items-center gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 text-xl"><FiAlertCircle /></div>
          <div>
            <p className="text-sm text-steel-500 dark:text-gray-400">📋 View Complaints</p>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Link to="/wholesaler/products" className="btn-primary">⚙️ Manage Products</Link>
        <Link to="/wholesaler/products/new" className="btn-secondary">➕ Add Product</Link>
        <Link to="/wholesaler/orders" className="btn-secondary">📦 View Orders</Link>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <h3 className="font-bold text-steel-800 dark:text-gray-200 mb-4">🆕 Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p className="text-steel-500 dark:text-gray-400">No orders yet. 📦</p>
        ) : (
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
                  <tr key={order._id} className="border-b border-steel-100 dark:border-gray-700 hover:bg-steel-50 dark:hover:bg-gray-800 transition">
                    <td className="py-3 font-medium dark:text-gray-200">{order.orderNumber}</td>
                    <td className="py-3 dark:text-gray-300">{order.customer?.name}</td>
                    <td className="py-3"><span className={`badge ${order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>{order.status}</span></td>
                    <td className="py-3 text-right font-semibold dark:text-gray-200">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="py-3 text-right text-steel-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WholesalerDashboard;
