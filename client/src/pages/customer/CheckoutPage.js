import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/order.service';
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

const CheckoutPage = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');
    if (!/^[0-9]{6}$/.test(address.pinCode)) return toast.error('PIN Code must be exactly 6 digits');
    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod: 'cod',
      };
      const { data } = await orderService.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data.order._id}`);
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

          {/* Payment Method — COD Only */}
          <div className="card p-6">
            <h3 className="font-bold text-lg text-steel-800 dark:text-gray-200 mb-4">💳 Payment Method</h3>
            <div className="p-4 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-2xl">
                  💵
                </div>
                <div>
                  <p className="font-bold text-green-700 dark:text-green-300 text-lg">Cash on Delivery (COD)</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Pay cash when you receive your order at your doorstep</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <span>✅ No online payment required</span>
                <span>•</span>
                <span>✅ Pay only when satisfied</span>
              </div>
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

          {/* COD Badge */}
          <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 text-center">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">💵 Cash on Delivery</span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-4 disabled:opacity-50">
            {loading ? '⏳ Placing Order...' : `🚀 Place Order — ₹${total.toLocaleString('en-IN')}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
