import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import orderService from '../../services/order.service';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPackage, FiCheck, FiTruck, FiHome } from 'react-icons/fi';

const steps = [
  { key: 'placed', label: 'Placed', icon: <FiPackage /> },
  { key: 'confirmed', label: 'Confirmed', icon: <FiCheck /> },
  { key: 'shipped', label: 'Shipped', icon: <FiTruck /> },
  { key: 'delivered', label: 'Delivered', icon: <FiHome /> },
];

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrder(id)
      .then(({ data }) => setOrder(data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!order) return <div className="text-center py-16">Order not found</div>;

  const currentStepIdx = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-steel-800">Order #{order.orderNumber}</h1>
        <StatusBadge status={order.status} />
      </div>

      {/* Progress Tracker */}
      {order.status !== 'cancelled' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    i <= currentStepIdx ? 'bg-primary-500 text-white' : 'bg-steel-200 text-steel-400'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs mt-2 ${i <= currentStepIdx ? 'text-primary-500 font-semibold' : 'text-steel-400'}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${i < currentStepIdx ? 'bg-primary-500' : 'bg-steel-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="card p-6">
          <h3 className="font-bold text-steel-800 mb-4">Items</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-steel-800">{item.name}</p>
                  <p className="text-steel-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                </div>
                <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-steel-500">Subtotal</span><span>₹{order.itemsTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-steel-500">Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span></div>
            <div className="flex justify-between"><span className="text-steel-500">Tax</span><span>₹{order.tax.toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span className="text-primary-500">₹{order.totalAmount.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-steel-800 mb-3">Shipping Address</h3>
            <p className="text-steel-600 text-sm">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-steel-800 mb-3">Order Info</h3>
            <div className="text-sm text-steel-600 space-y-1">
              <p>Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
              <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
              {order.trackingNumber && <p>Tracking: {order.trackingNumber}</p>}
              {order.estimatedDelivery && <p>Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>}
            </div>
          </div>

          {/* Status History */}
          <div className="card p-6">
            <h3 className="font-bold text-steel-800 mb-3">Status History</h3>
            <div className="space-y-2">
              {order.statusHistory?.map((h, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{h.status.toUpperCase()}</p>
                    <p className="text-steel-400 text-xs">{new Date(h.timestamp).toLocaleString()}</p>
                    {h.note && <p className="text-steel-500">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
