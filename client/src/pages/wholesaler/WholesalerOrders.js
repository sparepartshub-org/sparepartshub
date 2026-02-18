import React, { useEffect, useState } from 'react';
import orderService from '../../services/order.service';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const WholesalerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    orderService.getWholesalerOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, { status });
      toast.success(`Order ${status.replace('_', ' ')} ✅`);
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200 mb-6">📦 Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-steel-500 dark:text-gray-400">No orders yet. 📦</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={order._id} className="card p-5 hover:shadow-md transition-all duration-300 animate-slideUp" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex flex-wrap items-center justify-between mb-3">
                <div>
                  <span className="font-bold text-steel-800 dark:text-gray-200">🧾 #{order.orderNumber}</span>
                  <span className="ml-3 text-sm text-steel-400 dark:text-gray-500">📅 {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="font-bold text-primary-500">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <p className="text-sm text-steel-500 dark:text-gray-400 mb-1">👤 Customer: {order.customer?.name} ({order.customer?.email})</p>
              <p className="text-sm text-steel-500 dark:text-gray-400 mb-3">💵 Payment: Cash on Delivery</p>
              <div className="text-sm text-steel-600 dark:text-gray-400 mb-3">
                🔧 {order.items.map((item, i) => (
                  <span key={i}>{item.name} ×{item.quantity}{i < order.items.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {order.status === 'placed' && (
                  <button onClick={() => handleStatusUpdate(order._id, 'confirmed')} className="btn-primary text-sm py-1.5 px-4">✅ Confirm</button>
                )}
                {order.status === 'confirmed' && (
                  <button onClick={() => handleStatusUpdate(order._id, 'packed')} className="btn-primary text-sm py-1.5 px-4">📦 Mark Packed</button>
                )}
                {order.status === 'packed' && (
                  <button onClick={() => handleStatusUpdate(order._id, 'shipped')} className="btn-primary text-sm py-1.5 px-4">🚚 Mark Shipped</button>
                )}
                {order.status === 'shipped' && (
                  <button onClick={() => handleStatusUpdate(order._id, 'out_for_delivery')} className="btn-primary text-sm py-1.5 px-4">🏃 Out for Delivery</button>
                )}
                {order.status === 'out_for_delivery' && (
                  <button onClick={() => handleStatusUpdate(order._id, 'delivered')} className="btn-primary text-sm py-1.5 px-4">🏠 Mark Delivered</button>
                )}
                {['placed', 'confirmed'].includes(order.status) && (
                  <button onClick={() => handleStatusUpdate(order._id, 'cancelled')} className="btn-danger text-sm py-1.5 px-4">❌ Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WholesalerOrders;
