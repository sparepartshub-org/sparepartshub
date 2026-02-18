import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/order.service';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-steel-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-steel-500 text-lg">No orders yet</p>
          <Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/customer/orders/${order._id}`} className="card p-5 block hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-steel-800">#{order.orderNumber}</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center justify-between text-sm text-steel-500">
                <span>{order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="font-bold text-primary-500 text-lg">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
