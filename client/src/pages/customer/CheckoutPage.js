import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/order.service';
import paymentService from '../../services/payment.service';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad',
  'Ranchi', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai',
  'Raipur', 'Kochi', 'Chandigarh', 'Mysore', 'Guwahati', 'Hubli', 'Solapur', 'Tiruchirappalli',
  'Bareilly', 'Moradabad', 'Tiruppur', 'Dehradun', 'Noida', 'Gurugram',
];

const PAYMENT_METHODS = [
  {
    id: 'cod',
    label: 'Cash on Delivery (COD)',
    icon: '💵',
    description: 'Pay cash when you receive your order at your doorstep',
    tags: ['✅ No online payment required', '✅ Pay only when satisfied'],
    color: 'green',
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icon: '💳',
    description: 'Pay securely using Visa, Mastercard, RuPay or any debit/credit card',
    tags: ['🔒 Secured by Razorpay', '⚡ Instant confirmation'],
    color: 'blue',
  },
  {
    id: 'upi',
    label: 'UPI Payment',
    icon: '📱',
    description: 'Pay using Google Pay, PhonePe, Paytm, BHIM or any UPI app',
    tags: ['⚡ Instant payment', '📱 Pay from any UPI app'],
    color: 'purple',
  },
];

const colorClasses = {
  green: {
    border: 'border-green-500 dark:border-green-700',
    bg: 'bg-green-50 dark:bg-green-900/20',
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    title: 'text-green-700 dark:text-green-300',
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  },
  blue: {
    border: 'border-blue-500 dark:border-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    title: 'text-blue-700 dark:text-blue-300',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  },
  purple: {
    border: 'border-purple-500 dark:border-purple-700',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    title: 'text-purple-700 dark:text-purple-300',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  },
};

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pinCode: user?.address?.pinCode || '',
    country: 'India',
  });

  const shippingCost = cartTotal > 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shippingCost + tax;

  // Preload Razorpay script
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleCODOrder = async (orderData) => {
    const { data } = await orderService.createOrder(orderData);
    clearCart();
    toast.success('Order placed successfully! 🎉');
    navigate(`/orders/${data.order._id}`);
  };

  const handleOnlinePayment = async (orderData) => {
    // 1. Create the order first (unpaid)
    const { data } = await orderService.createOrder(orderData);
    const order = data.order;

    // 2. Create Razorpay order
    const { data: rzpData } = await paymentService.createRazorpayOrder(order._id);

    // 3. Load Razorpay
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway. Please try again.');
      return;
    }

    // 4. Open Razorpay checkout
    const options = {
      key: rzpData.keyId,
      amount: rzpData.amount,
      currency: rzpData.currency,
      name: 'SparePartsHub',
      description: `Order #${order.orderNumber}`,
      order_id: rzpData.razorpayOrderId,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#3B82F6',
      },
      modal: {
        ondismiss: () => {
          toast.error('Payment was cancelled. Your order is saved — you can pay later.');
          navigate(`/orders/${order._id}`);
        },
      },
      handler: async (response) => {
        try {
          // 5. Verify payment on server
          await paymentService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: order._id,
          });
          clearCart();
          toast.success('Payment successful! Order confirmed! 🎉');
          navigate(`/orders/${order._id}`);
        } catch (err) {
          toast.error('Payment verification failed. Contact support.');
          navigate(`/orders/${order._id}`);
        }
      },
    };

    // Set preferred method based on selection
    if (paymentMethod === 'upi') {
      options.config = {
        display: {
          blocks: {
            upi: { name: 'UPI Payment', instruments: [{ method: 'upi' }] },
          },
          sequence: ['block.upi'],
          preferences: { show_default_blocks: false },
        },
      };
    } else if (paymentMethod === 'card') {
      options.config = {
        display: {
          blocks: {
            card: { name: 'Card Payment', instruments: [{ method: 'card' }] },
          },
          sequence: ['block.card'],
          preferences: { show_default_blocks: false },
        },
      };
    }

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');
    if (!/^[0-9]{6}$/.test(address.pinCode)) return toast.error('PIN Code must be exactly 6 digits');
    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod,
      };

      if (paymentMethod === 'cod') {
        await handleCODOrder(orderData);
      } else {
        await handleOnlinePayment(orderData);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod);
  const selectedColor = colorClasses[selectedMethod?.color || 'green'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200 mb-6">📦 Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card p-6">
            <h3 className="font-bold text-lg text-steel-800 dark:text-gray-200 mb-4">🏠 Shipping Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">Street Address</label>
                <input type="text" className="input-field" required value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="e.g. 42, MG Road, Sector 15" />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">City</label>
                <input type="text" className="input-field" required value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })} list="cities-list" placeholder="e.g. Mumbai" />
                <datalist id="cities-list">
                  {INDIAN_CITIES.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">State</label>
                <select className="input-field" required value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">PIN Code</label>
                <input type="text" className="input-field" required value={address.pinCode}
                  onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                  pattern="[0-9]{6}" maxLength={6} placeholder="e.g. 400001" />
                <p className="text-xs text-steel-400 dark:text-gray-500 mt-1">6-digit Indian PIN Code</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">Country</label>
                <input type="text" className="input-field" value={address.country} disabled />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="card p-6">
            <h3 className="font-bold text-lg text-steel-800 dark:text-gray-200 mb-4">💳 Payment Method</h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const colors = colorClasses[method.color];
                const isSelected = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? `${colors.border} ${colors.bg}`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(method.id)}
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                      />
                      <div className={`w-12 h-12 ${colors.iconBg} rounded-full flex items-center justify-center text-2xl`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-lg ${isSelected ? colors.title : 'text-steel-800 dark:text-gray-200'}`}>
                          {method.label}
                        </p>
                        <p className={`text-sm ${isSelected ? colors.text : 'text-steel-500 dark:text-gray-400'}`}>
                          {method.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-3 ml-7 flex items-center gap-2 text-sm flex-wrap">
                        {method.tags.map((tag, i) => (
                          <span key={i} className={colors.text}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h3 className="font-bold text-lg text-steel-800 dark:text-gray-200 mb-4">📋 Order Summary</h3>
          <div className="space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="flex justify-between text-sm">
                <span className="text-steel-600 dark:text-gray-400 line-clamp-1 flex-1">{product.name} × {quantity}</span>
                <span className="ml-2 font-medium dark:text-gray-200">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <hr className="my-3 dark:border-gray-600" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-steel-500 dark:text-gray-400">Subtotal</span><span className="dark:text-gray-200">₹{cartTotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-steel-500 dark:text-gray-400">🚚 Shipping</span><span className="dark:text-gray-200">{shippingCost === 0 ? 'FREE ✅' : `₹${shippingCost}`}</span></div>
            <div className="flex justify-between"><span className="text-steel-500 dark:text-gray-400">Tax (GST 18%)</span><span className="dark:text-gray-200">₹{tax.toLocaleString('en-IN')}</span></div>
            <hr className="my-3 dark:border-gray-600" />
            <div className="flex justify-between font-bold text-lg"><span className="dark:text-gray-200">Total</span><span className="text-primary-500">₹{total.toLocaleString('en-IN')}</span></div>
          </div>

          {/* Selected Payment Badge */}
          <div className={`mt-3 ${selectedColor.bg} border ${selectedColor.border} rounded-lg p-2 text-center`}>
            <span className={`text-sm font-medium ${selectedColor.title}`}>
              {selectedMethod?.icon} {selectedMethod?.label}
            </span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-4 disabled:opacity-50">
            {loading
              ? '⏳ Processing...'
              : paymentMethod === 'cod'
                ? `🚀 Place Order — ₹${total.toLocaleString('en-IN')}`
                : `🔒 Pay ₹${total.toLocaleString('en-IN')}`
            }
          </button>

          {paymentMethod !== 'cod' && (
            <p className="text-xs text-center text-steel-400 dark:text-gray-500 mt-2">
              🔒 Secured by Razorpay — 100% safe & encrypted
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
