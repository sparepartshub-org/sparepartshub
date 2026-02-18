import React, { useEffect, useState } from 'react';
import orderService from '../../services/order.service';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = () => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    orderService.getAllOrders(params)
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]); // eslint-disable-line

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, { status });
      toast.success(`Order ${status}`);
      fetchOrders();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-steel-800 mb-6">All Orders</h1>

      <div className="mb-6">
        <select className="input-field w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-steel-100 text-steel-600">
              <th className="text-left p-3">Order #</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Items</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Total</th>
              <th className="text-right p-3">Date</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-steel-100 hover:bg-steel-50">
                <td className="p-3 font-medium">{order.orderNumber}</td>
                <td className="p-3">{order.customer?.name}</td>
                <td className="p-3 text-steel-500">{order.items.length}</td>
                <td className="p-3"><StatusBadge status={order.status} /></td>
                <td className="p-3 text-right font-semibold">₹{order.totalAmount.toLocaleString()}</td>
                <td className="p-3 text-right text-steel-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  <select
                    className="text-xs border rounded px-2 py-1"
                    value=""
                    onChange={(e) => e.target.value && handleStatusUpdate(order._id, e.target.value)}
                  >
                    <option value="">Update...</option>
                    {order.status === 'placed' && <option value="confirmed">Confirm</option>}
                    {order.status === 'confirmed' && <option value="shipped">Ship</option>}
                    {order.status === 'shipped' && <option value="delivered">Deliver</option>}
                    {['placed', 'confirmed'].includes(order.status) && <option value="cancelled">Cancel</option>}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
