import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/order.service';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const shippingCost = cartTotal > 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shippingCost + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod,
      };
      const { data } = await orderService.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/customer/orders/${data.order._id}`);
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-steel-800 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card p-6">
            <h3 className="font-bold text-lg text-steel-800 mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-steel-700 mb-1">Street Address</label>
                <input type="text" className="input-field" required value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-1">City</label>
                <input type="text" className="input-field" required value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-1">State</label>
                <input type="text" className="input-field" required value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-1">ZIP Code</label>
                <input type="text" className="input-field" required value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-700 mb-1">Country</label>
                <input type="text" className="input-field" value={address.country} disabled />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h3 className="font-bold text-lg text-steel-800 mb-4">Payment Method</h3>
            <div className="space-y-3">
              {[
                { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when you receive the order' },
                { value: 'online', label: '💳 Online Payment', desc: 'Pay securely online (coming soon)' },
              ].map((method) => (
                <label key={method.value} className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                  paymentMethod === method.value ? 'border-primary-500 bg-primary-50' : 'border-steel-200'
                }`}>
                  <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1" />
                  <div>
                    <p className="font-semibold">{method.label}</p>
                    <p className="text-sm text-steel-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h3 className="font-bold text-lg text-steel-800 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="flex justify-between text-sm">
                <span className="text-steel-600 line-clamp-1 flex-1">{product.name} × {quantity}</span>
                <span className="ml-2 font-medium">₹{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr className="my-3" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-steel-500">Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-steel-500">Shipping</span><span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
            <div className="flex justify-between"><span className="text-steel-500">Tax (GST 18%)</span><span>₹{tax.toLocaleString()}</span></div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary-500">₹{total.toLocaleString()}</span></div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-4 disabled:opacity-50">
            {loading ? 'Placing Order...' : `Place Order — ₹${total.toLocaleString()}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
