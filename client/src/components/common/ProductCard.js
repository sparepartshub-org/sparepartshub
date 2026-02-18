/**
 * ProductCard — reusable product display card with animations
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to add items to cart');
    if (user.role !== 'customer') return toast.error('Only customers can add to cart');
    if (product.stock <= 0) return toast.error('Out of stock');
    addToCart(product, 1);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 bg-steel-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="text-steel-400 dark:text-gray-500 text-4xl">🔧</div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse-slow">
            🔥 -{discount}%
          </span>
        )}
        <span className={`absolute top-2 right-2 badge ${product.vehicleType === 'bike' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}`}>
          {product.vehicleType === 'bike' ? '🏍️ Bike' : '🚗 Car'}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-steel-400 dark:text-gray-500 mb-1">{product.brand}</p>
        <h3 className="font-semibold text-steel-800 dark:text-gray-200 text-sm line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary-500">₹{product.price.toLocaleString()}</span>
          {product.comparePrice && (
            <span className="text-sm text-steel-400 dark:text-gray-500 line-through">₹{product.comparePrice.toLocaleString()}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
          </span>
          {user?.role === 'customer' && product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <FiShoppingCart />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
