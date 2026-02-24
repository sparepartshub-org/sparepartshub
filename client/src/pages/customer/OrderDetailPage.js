import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import orderService from '../../services/order.service';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPackage, FiCheck, FiBox, FiTruck, FiMapPin, FiHome } from 'react-icons/fi';

const steps = [
  { key: 'placed', label: '📦 Order Placed', icon: <FiPackage />, description: 'Order has been placed' },
  { key: 'confirmed', label: '✅ Confirmed', icon: <FiCheck />, description: 'Order confirmed by dealer' },
  { key: 'packed', label: '📦 Packed', icon: <FiBox />, description: 'Order has been packed' },
  { key: 'shipped', label: '🚚 Shipped', icon: <FiTruck />, description: 'Order is on the way' },
  { key: 'out_for_delivery', label: '🏃 Out for Delivery', icon: <FiMapPin />, description: 'Order is out for delivery' },
  { key: 'delivered', label: '🏠 Delivered', icon: <FiHome />, description: 'Order delivered successfully' },
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
  if (!order) return <div className="text-center py-16 dark:text-gray-400">Order not found</div>;

  const currentStepIdx = steps.findIndex((s) => s.key === order.status);

  // Get timestamp for each tracking step
  const getTrackingTimestamp = (stepKey) => {
    const trackingStep = order.tracking?.find(t => t.status === stepKey);
    if (trackingStep) return new Date(trackingStep.timestamp).toLocaleString('en-IN');
    const historyStep = order.statusHistory?.find(h => h.status === stepKey);
    if (historyStep) return new Date(historyStep.timestamp).toLocaleString('en-IN');
    return null;
  };

  // WhatsApp link for first dealer
  const firstDealer = order.items?.[0]?.wholesaler;
  const dealerWhatsapp = firstDealer?.whatsappNumber;
  const whatsappLink = dealerWhatsapp
    ? `https://wa.me/${dealerWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I have a query about my order #${order.orderNumber} on SparePartsHub`)}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-steel-800 dark:text-gray-200">🧾 Order #{order.orderNumber}</h1>
        <StatusBadge status={order.status} />
      </div>

      {/* Visual Progress Tracker */}
      {order.status !== 'cancelled' && (
        <div className="card p-6 mb-6">
          <h3 className="font-bold text-steel-800 dark:text-gray-200 mb-6">📍 Order Tracking</h3>

          {/* Desktop horizontal stepper */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                      i <= currentStepIdx
                        ? 'bg-primary-500 text-white scale-110 shadow-lg shadow-primary-500/30'
                        : 'bg-steel-200 dark:bg-gray-700 text-steel-400 dark:text-gray-500'
                    }`}>
                      {i <= currentStepIdx ? '✓' : step.icon}
                    </div>
                    <span className={`text-xs mt-2 text-center max-w-[80px] ${
                      i <= currentStepIdx ? 'text-primary-500 font-semibold' : 'text-steel-400 dark:text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                    {getTrackingTimestamp(step.key) && (
                      <span className="text-[10px] text-steel-400 dark:text-gray-500 mt-0.5 text-center">
                        {getTrackingTimestamp(step.key)}
                      </span>
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 rounded transition-all duration-700 ${
                      i < currentStepIdx ? 'bg-primary-500' : 'bg-steel-200 dark:bg-gray-700'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mobile vertical stepper */}
          <div className="md:hidden space-y-4">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                    i <= currentStepIdx
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-steel-200 dark:bg-gray-700 text-steel-400 dark:text-gray-500'
                  }`}>
                    {i <= currentStepIdx ? '✓' : step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${i < currentStepIdx ? 'bg-primary-500' : 'bg-steel-200 dark:bg-gray-700'}`} />
                  )}
                </div>
                <div className="pt-1.5">
                  <p className={`font-medium text-sm ${i <= currentStepIdx ? 'text-primary-500' : 'text-steel-400 dark:text-gray-500'}`}>
                    {step.label}
                  </p>
                  {getTrackingTimestamp(step.key) && (
                    <p className="text-xs text-steel-400 dark:text-gray-500">{getTrackingTimestamp(step.key)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && order.status !== 'delivered' && (
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                🚚 Estimated Delivery: <span className="font-bold">{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cancelled banner */}
      {order.status === 'cancelled' && (
        <div className="card p-6 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-center text-red-600 dark:text-red-400 font-semibold text-lg">❌ This order has been cancelled</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="card p-6">
          <h3 className="font-bold text-steel-800 dark:text-gray-200 mb-4">🔧 Items</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-steel-800 dark:text-gray-200">{item.name}</p>
                  <p className="text-steel-500 dark:text-gray-400">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <span className="font-bold dark:text-gray-200">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <hr className="my-4 dark:border-gray-600" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-steel-500 dark:text-gray-400">Subtotal</span><span className="dark:text-gray-200">₹{order.itemsTotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-steel-500 dark:text-gray-400">🚚 Shipping</span><span className="dark:text-gray-200">{order.shippingCost === 0 ? 'FREE ✅' : `₹${order.shippingCost}`}</span></div>
            <div className="flex justify-between"><span className="text-steel-500 dark:text-gray-400">Tax</span><span className="dark:text-gray-200">₹{order.tax.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2"><span className="dark:text-gray-200">Total</span><span className="text-primary-500">₹{order.totalAmount.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-steel-800 dark:text-gray-200 mb-3">🏠 Shipping Address</h3>
            <p className="text-steel-600 dark:text-gray-400 text-sm">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode || order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-steel-800 dark:text-gray-200 mb-3">ℹ️ Order Info</h3>
            <div className="text-sm text-steel-600 dark:text-gray-400 space-y-1">
              <p className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                  order.isPaid
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {order.paymentMethod === 'cod' && '💵 Cash on Delivery'}
                  {order.paymentMethod === 'card' && `💳 Card Payment${order.isPaid ? ' — Paid ✅' : ' — Pending'}`}
                  {order.paymentMethod === 'upi' && `📱 UPI Payment${order.isPaid ? ' — Paid ✅' : ' — Pending'}`}
                  {order.paymentMethod === 'online' && `🌐 Online Payment${order.isPaid ? ' — Paid ✅' : ' — Pending'}`}
                </span>
              </p>
              <p>📅 Placed: {new Date(order.createdAt).toLocaleString('en-IN')}</p>
              {order.trackingNumber && <p>📍 Tracking: {order.trackingNumber}</p>}
              {order.estimatedDelivery && <p>🚚 Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>}
              {order.deliveredAt && <p>✅ Delivered: {new Date(order.deliveredAt).toLocaleString('en-IN')}</p>}
            </div>

            {/* WhatsApp Connect */}
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#25D366' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with Dealer on WhatsApp
              </a>
            )}
          </div>

          {/* Status History */}
          <div className="card p-6">
            <h3 className="font-bold text-steel-800 dark:text-gray-200 mb-3">📜 Status History</h3>
            <div className="space-y-2">
              {order.statusHistory?.map((h, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium dark:text-gray-200">{h.status.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-steel-400 dark:text-gray-500 text-xs">{new Date(h.timestamp).toLocaleString('en-IN')}</p>
                    {h.note && <p className="text-steel-500 dark:text-gray-400">{h.note}</p>}
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
