import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const shippingCost = cartTotal > 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <FiShoppingBag className="text-6xl text-steel-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-steel-700 mb-2">Your cart is empty</h2>
        <p className="text-steel-500 mb-6">Add some spare parts to get started!</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-steel-800 mb-6">Shopping Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="card p-4 flex gap-4">
              <div className="w-20 h-20 bg-steel-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-2xl">🔧</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product._id}`} className="font-semibold text-steel-800 hover:text-primary-500 line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-sm text-steel-500">{product.brand} • {product.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-steel-300 rounded-lg">
                    <button onClick={() => updateQuantity(product._id, quantity - 1)} className="px-2 py-1 hover:bg-steel-100"><FiMinus size={14} /></button>
                    <span className="px-3 py-1 text-sm font-semibold">{quantity}</span>
                    <button onClick={() => updateQuantity(product._id, Math.min(product.stock, quantity + 1))} className="px-2 py-1 hover:bg-steel-100"><FiPlus size={14} /></button>
                  </div>
                  <span className="font-bold text-primary-500">₹{(product.price * quantity).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(product._id)} className="text-red-400 hover:text-red-600 self-start">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h3 className="font-bold text-lg text-steel-800 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-steel-500">Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-steel-500">Shipping</span><span>{shippingCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingCost}`}</span></div>
            <div className="flex justify-between"><span className="text-steel-500">Tax (18% GST)</span><span>₹{tax.toLocaleString()}</span></div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary-500">₹{total.toLocaleString()}</span></div>
          </div>
          {cartTotal < 2000 && (
            <p className="text-xs text-steel-400 mt-2">Add ₹{(2000 - cartTotal).toLocaleString()} more for free shipping!</p>
          )}
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-4">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
