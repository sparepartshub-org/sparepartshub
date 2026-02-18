import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

const vehicleEmoji = (type) => {
  switch (type) {
    case 'bike': return '🏍️ Bike';
    case 'car': return '🚗 Car';
    case 'tractor': return '🚜 Tractor';
    default: return '🔧';
  }
};

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const shippingCost = cartTotal > 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <FiShoppingBag className="text-6xl text-steel-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-steel-700 dark:text-gray-300 mb-2">🛒 Your cart is empty</h2>
        <p className="text-steel-500 dark:text-gray-400 mb-6">Add some spare parts to get started! 🔧</p>
        <Link to="/products" className="btn-primary">⚙️ Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200 mb-6">🛒 Shopping Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="card p-4 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-steel-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-2xl">🔧</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product._id}`} className="font-semibold text-steel-800 dark:text-gray-200 hover:text-primary-500 line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-sm text-steel-500 dark:text-gray-400">{product.brand} • {vehicleEmoji(product.vehicleType)}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-steel-300 dark:border-gray-600 rounded-lg">
                    <button onClick={() => updateQuantity(product._id, quantity - 1)} className="px-2 py-1 hover:bg-steel-100 dark:hover:bg-gray-700 transition"><FiMinus size={14} /></button>
                    <span className="px-3 py-1 text-sm font-semibold dark:text-gray-200">{quantity}</span>
                    <button onClick={() => updateQuantity(product._id, Math.min(product.stock, quantity + 1))} className="px-2 py-1 hover:bg-steel-100 dark:hover:bg-gray-700 transition"><FiPlus size={14} /></button>
                  </div>
                  <span className="font-bold text-primary-500">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(product._id)} className="text-red-400 hover:text-red-600 self-start transition">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h3 className="font-bold text-lg text-steel-800 dark:text-gray-200 mb-4">📋 Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-steel-500 dark:text-gray-400">Subtotal</span><span className="dark:text-gray-200">₹{cartTotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-steel-500 dark:text-gray-400">🚚 Shipping</span><span className="dark:text-gray-200">{shippingCost === 0 ? <span className="text-green-600 dark:text-green-400">FREE ✅</span> : `₹${shippingCost}`}</span></div>
            <div className="flex justify-between"><span className="text-steel-500 dark:text-gray-400">Tax (18% GST)</span><span className="dark:text-gray-200">₹{tax.toLocaleString('en-IN')}</span></div>
            <hr className="my-3 dark:border-gray-600" />
            <div className="flex justify-between font-bold text-lg"><span className="dark:text-gray-200">Total</span><span className="text-primary-500">₹{total.toLocaleString('en-IN')}</span></div>
          </div>

          {/* COD Badge */}
          <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 text-center">
            <span className="text-sm font-medium text-green-700 dark:text-green-300">💵 Cash on Delivery</span>
          </div>

          {cartTotal < 2000 && (
            <p className="text-xs text-steel-400 dark:text-gray-500 mt-2">💡 Add ₹{(2000 - cartTotal).toLocaleString('en-IN')} more for free shipping!</p>
          )}
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-4">
            🚀 Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
