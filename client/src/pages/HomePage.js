import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/product.service';
import categoryService from '../services/category.service';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiTruck, FiShield, FiHeadphones, FiTag, FiStar } from 'react-icons/fi';

const categoryEmojis = ['🔧', '🛞', '🔋', '💡', '🛢️', '🔩', '⚙️', '🏎️'];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts({ limit: 8, sort: '-createdAt' }),
          categoryService.getCategories(),
        ]);
        setFeaturedProducts(prodRes.data.products);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 dark:from-gray-800 dark:via-gray-900 dark:to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">⚙️</div>
          <div className="absolute bottom-10 right-10 text-9xl">🔧</div>
          <div className="absolute top-1/2 left-1/2 text-9xl transform -translate-x-1/2 -translate-y-1/2">🏎️</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28 relative z-10">
          <div className="max-w-2xl animate-fadeIn">
            <div className="inline-block bg-accent-400 text-steel-900 text-sm font-bold px-4 py-1.5 rounded-full mb-4 animate-bounce-subtle">
              🏁 India's #1 Auto Parts Marketplace
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Premium Spare Parts<br />
              <span className="text-accent-300">Delivered Fast 🚚</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 dark:text-gray-300 mb-8 leading-relaxed">
              🔧 Find genuine OEM & aftermarket parts for your bike and car.
              Trusted wholesalers, competitive prices, and nationwide delivery.
              From brake pads to engine components — we've got you covered! ⚙️
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products?vehicleType=bike" className="btn-accent text-lg px-8 py-3 hover:scale-105 transition-transform">
                🏍️ Shop Bike Parts
              </Link>
              <Link to="/products?vehicleType=car" className="bg-white text-primary-500 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-all text-lg hover:scale-105">
                🚗 Shop Car Parts
              </Link>
            </div>
            <div className="flex gap-8 mt-8 text-sm text-blue-200 dark:text-gray-400">
              <span>✅ 10,000+ Parts</span>
              <span>✅ 500+ Wholesalers</span>
              <span>✅ Free Shipping*</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🚚', title: 'Fast Delivery', desc: 'Nationwide shipping in 3-5 days', color: 'from-blue-500 to-blue-600' },
            { icon: '✅', title: 'Genuine Parts', desc: 'OEM & verified aftermarket parts', color: 'from-green-500 to-green-600' },
            { icon: '💰', title: 'Wholesale Prices', desc: 'Direct from wholesalers, save 30%+', color: 'from-amber-500 to-amber-600' },
            { icon: '🤖', title: '24/7 AI Support', desc: 'Smart chatbot always ready to help', color: 'from-purple-500 to-purple-600' },
          ].map((f, i) => (
            <div key={i} className="card p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-steel-800 dark:text-gray-200">{f.title}</h3>
              <p className="text-sm text-steel-500 dark:text-gray-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-steel-800 dark:text-gray-200">🏷️ Shop by Category</h2>
          <p className="text-steel-500 dark:text-gray-400 mt-2">Find the exact parts you need for your vehicle</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="card p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                {categoryEmojis[i % categoryEmojis.length]}
              </div>
              <h3 className="font-bold text-steel-800 dark:text-gray-200 group-hover:text-primary-500 transition-colors">{cat.name}</h3>
              <p className="text-xs text-steel-400 dark:text-gray-500 mt-1">{cat.description || 'Browse parts'}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-steel-100 dark:bg-gray-800 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-steel-800 dark:text-gray-200">🏆 Why Choose SparePartsHub?</h2>
            <p className="text-steel-500 dark:text-gray-400 mt-2">Thousands of mechanics and car enthusiasts trust us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🔍',
                title: 'Easy Part Finder',
                desc: 'Search by vehicle make, model, or part number. Our smart filters help you find exactly what you need in seconds.',
              },
              {
                emoji: '🤝',
                title: 'Verified Wholesalers',
                desc: 'Every wholesaler is verified and approved. Buy with confidence knowing you\'re getting genuine, quality parts.',
              },
              {
                emoji: '🛡️',
                title: 'Buyer Protection',
                desc: 'File complaints, track orders in real-time, and get full support. Your satisfaction is our top priority.',
              },
            ].map((item, i) => (
              <div key={i} className="card p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-bold text-steel-800 dark:text-gray-200 mb-3">{item.title}</h3>
                <p className="text-steel-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-steel-800 dark:text-gray-200">🆕 Latest Products</h2>
            <p className="text-steel-500 dark:text-gray-400 mt-1">Fresh arrivals from our top wholesalers</p>
          </div>
          <Link to="/products" className="btn-primary flex items-center gap-2">
            View All ⚙️
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product, i) => (
            <div key={product._id} className="animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-gray-800 dark:to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">⭐ What Our Customers Say</h2>
            <p className="text-blue-200 dark:text-gray-400 mt-2">Join thousands of satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rajesh Kumar',
                role: 'Mechanic, Delhi',
                text: 'SparePartsHub saved my workshop! I find genuine Honda and Bajaj parts at wholesale prices. Delivery is always on time. 🏍️',
                rating: 5,
              },
              {
                name: 'Priya Sharma',
                role: 'Car Enthusiast, Mumbai',
                text: 'Finally a reliable platform for car parts! Got brake pads for my Maruti at 40% less than local shops. Amazing quality! 🚗',
                rating: 5,
              },
              {
                name: 'Amit Wholesaler',
                role: 'Auto Parts Dealer, Pune',
                text: 'As a wholesaler, this platform has expanded my reach across India. The dashboard is intuitive and orders keep flowing! 📦',
                rating: 5,
              },
            ].map((t, i) => (
              <div key={i} className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 dark:hover:bg-gray-800/70 transition-all duration-300">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-accent-300">⭐</span>
                  ))}
                </div>
                <p className="text-blue-100 dark:text-gray-300 mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-blue-200 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="card p-12 text-center bg-gradient-to-r from-accent-50 to-accent-100 dark:from-gray-800 dark:to-gray-700 border-accent-200 dark:border-gray-600">
          <h2 className="text-3xl font-bold text-steel-800 dark:text-gray-200 mb-4">🔧 Ready to Find Your Parts?</h2>
          <p className="text-steel-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
            Join SparePartsHub today and get access to thousands of genuine spare parts
            at wholesale prices. Whether you're a mechanic, car owner, or bike enthusiast — we've got you! 🏁
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary text-lg px-8 py-3">
              🛒 Start Shopping
            </Link>
            <Link to="/register" className="btn-accent text-lg px-8 py-3">
              📝 Register Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
