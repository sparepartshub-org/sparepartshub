import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/product.service';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiMinus, FiPlus, FiTruck, FiShield } from 'react-icons/fi';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    productService.getProduct(id)
      .then(({ data }) => setProduct(data.product))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!product) return <div className="text-center py-16 dark:text-gray-400">Product not found</div>;

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!user) return toast.error('Please login first');
    if (user.role !== 'customer') return toast.error('Only customers can purchase');
    addToCart(product, quantity);
    toast.success('Added to cart! 🛒');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card p-4">
          <div className="bg-steel-100 dark:bg-gray-700 rounded-lg h-80 flex items-center justify-center overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="max-h-full object-contain hover:scale-110 transition-transform duration-500" />
            ) : (
              <span className="text-8xl">🔧</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <span className={`badge mb-3 ${product.vehicleType === 'bike' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}`}>
            {product.vehicleType === 'bike' ? '🏍️ Bike Part' : '🚗 Car Part'}
          </span>
          <h1 className="text-2xl font-bold text-steel-800 dark:text-gray-200 mb-2">{product.name}</h1>
          <p className="text-steel-500 dark:text-gray-400 mb-1">Brand: <span className="font-semibold">{product.brand}</span></p>
          {product.vehicleMake && <p className="text-steel-500 dark:text-gray-400 mb-1">🚘 Vehicle: {product.vehicleMake} {product.vehicleModel}</p>}
          {product.partNumber && <p className="text-steel-500 dark:text-gray-400 mb-1">🔩 Part #: {product.partNumber}</p>}
          <p className="text-steel-500 dark:text-gray-400 mb-4">🏪 Sold by: <Link to={`/products?wholesaler=${product.wholesaler?._id}`} className="text-primary-500 hover:underline">{product.wholesaler?.businessName || product.wholesaler?.name}</Link></p>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary-500">₹{product.price.toLocaleString()}</span>
            {product.comparePrice && (
              <>
                <span className="text-lg text-steel-400 dark:text-gray-500 line-through">₹{product.comparePrice.toLocaleString()}</span>
                <span className="badge bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">🔥 {discount}% OFF</span>
              </>
            )}
          </div>

          {/* Stock */}
          <p className={`mb-6 font-medium ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
            {product.stock > 0 ? `✅ ${product.stock} in stock — Ready to ship!` : '❌ Out of stock'}
          </p>

          {/* Quantity + Add to Cart */}
          {user?.role === 'customer' && product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-steel-300 dark:border-gray-600 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-steel-100 dark:hover:bg-gray-700 transition"><FiMinus /></button>
                <span className="px-4 py-2 font-semibold dark:text-gray-200">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 hover:bg-steel-100 dark:hover:bg-gray-700 transition"><FiPlus /></button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2">
                <FiShoppingCart /> Add to Cart 🛒
              </button>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-steel-600 dark:text-gray-400">
              <FiTruck className="text-primary-500" /> 🚚 Free shipping over ₹2000
            </div>
            <div className="flex items-center gap-2 text-sm text-steel-600 dark:text-gray-400">
              <FiShield className="text-primary-500" /> ✅ Genuine product guarantee
            </div>
          </div>

          {/* Description */}
          <div className="card p-4">
            <h3 className="font-semibold text-steel-800 dark:text-gray-200 mb-2">📋 Description</h3>
            <p className="text-steel-600 dark:text-gray-400 text-sm leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
