import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/product.service';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiMinus, FiPlus, FiTruck, FiShield } from 'react-icons/fi';

const vehicleBadge = (type) => {
  switch (type) {
    case 'bike': return { label: '🏍️ Bike Part', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' };
    case 'car': return { label: '🚗 Car Part', bg: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' };
    case 'tractor': return { label: '🚜 Tractor Part', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' };
    default: return { label: '🔧 Part', bg: 'bg-steel-100 text-steel-700 dark:bg-gray-700 dark:text-gray-300' };
  }
};

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

  const badge = vehicleBadge(product.vehicleType);

  // WhatsApp link for the dealer
  const dealerWhatsapp = product.wholesaler?.whatsappNumber;
  const whatsappLink = dealerWhatsapp
    ? `https://wa.me/${dealerWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} on SparePartsHub`)}`
    : null;

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
          <span className={`badge mb-3 ${badge.bg}`}>
            {badge.label}
          </span>
          <h1 className="text-2xl font-bold text-steel-800 dark:text-gray-200 mb-2">{product.name}</h1>
          <p className="text-steel-500 dark:text-gray-400 mb-1">Brand: <span className="font-semibold">{product.brand}</span></p>
          {product.vehicleMake && <p className="text-steel-500 dark:text-gray-400 mb-1">🚘 Vehicle: {product.vehicleMake} {product.vehicleModel}</p>}
          {product.partNumber && <p className="text-steel-500 dark:text-gray-400 mb-1">🔩 Part #: {product.partNumber}</p>}
          <p className="text-steel-500 dark:text-gray-400 mb-1">🏪 Sold by: <Link to={`/products?wholesaler=${product.wholesaler?._id}`} className="text-primary-500 hover:underline">{product.wholesaler?.businessName || product.wholesaler?.name}</Link></p>
          {(product.dealerCity || product.dealerState) && (
            <p className="text-steel-500 dark:text-gray-400 mb-4">📍 Dealer Location: {[product.dealerCity, product.dealerState].filter(Boolean).join(', ')}</p>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary-500">₹{product.price.toLocaleString('en-IN')}</span>
            {product.comparePrice && (
              <>
                <span className="text-lg text-steel-400 dark:text-gray-500 line-through">₹{product.comparePrice.toLocaleString('en-IN')}</span>
                <span className="badge bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">🔥 {discount}% OFF</span>
              </>
            )}
          </div>

          {/* COD Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-medium px-3 py-1.5 rounded-lg">
              💵 Cash on Delivery Available
            </span>
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

          {/* WhatsApp Connect with Dealer */}
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
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
