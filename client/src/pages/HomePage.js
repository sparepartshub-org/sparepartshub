import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/product.service';
import categoryService from '../services/category.service';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiTruck, FiShield, FiHeadphones, FiTag } from 'react-icons/fi';

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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Quality Spare Parts<br />
              <span className="text-accent-300">Delivered Fast</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Your one-stop multi-vendor marketplace for bike and car spare parts.
              Genuine products from trusted wholesalers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products?vehicleType=bike" className="btn-accent">
                🏍️ Bike Parts
              </Link>
              <Link to="/products?vehicleType=car" className="bg-white text-primary-500 font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-50 transition-all">
                🚗 Car Parts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <FiTruck />, title: 'Fast Delivery', desc: 'Nationwide shipping' },
            { icon: <FiShield />, title: 'Genuine Parts', desc: 'Verified wholesalers' },
            { icon: <FiTag />, title: 'Best Prices', desc: 'Wholesale rates' },
            { icon: <FiHeadphones />, title: '24/7 Support', desc: 'AI-powered chat' },
          ].map((f, i) => (
            <div key={i} className="text-center p-4">
              <div className="text-primary-500 text-3xl mx-auto mb-2 flex justify-center">{f.icon}</div>
              <h3 className="font-semibold text-steel-800">{f.title}</h3>
              <p className="text-sm text-steel-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-steel-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="card p-4 text-center hover:shadow-md transition-shadow group"
            >
              <div className="text-3xl mb-2">🔩</div>
              <h3 className="font-semibold text-steel-800 group-hover:text-primary-500 transition-colors">{cat.name}</h3>
              <p className="text-xs text-steel-400 mt-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-steel-800">Latest Products</h2>
          <Link to="/products" className="text-primary-500 font-semibold hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
