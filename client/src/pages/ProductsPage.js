/**
 * ProductsPage — browse all products with search and filters including Indian state/city
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../services/product.service';
import categoryService from '../services/category.service';
import ProductCard from '../components/common/ProductCard';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiSearch, FiFilter } from 'react-icons/fi';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    vehicleType: searchParams.get('vehicleType') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    dealerState: searchParams.get('dealerState') || '',
    dealerCity: searchParams.get('dealerCity') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.data.categories)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
        const { data } = await productService.getProducts(params);
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== '-createdAt' && k !== 'page') params[k] = v; });
    if (filters.page > 1) params.page = filters.page;
    setSearchParams(params);
  }, [filters]); // eslint-disable-line

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200 mb-2">⚙️ All Products</h1>
      <p className="text-steel-500 dark:text-gray-400 mb-6">Browse thousands of genuine spare parts for bikes 🏍️, cars 🚗, and tractors 🚜</p>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-3 text-steel-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="🔍 Search brake pads, oil filters, spark plugs, hydraulic pumps..."
            className="input-field pl-10"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center gap-2"
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-4 mb-6 space-y-4 animate-slideDown">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <select className="input-field" value={filters.vehicleType} onChange={(e) => updateFilter('vehicleType', e.target.value)}>
              <option value="">All Vehicles</option>
              <option value="bike">🏍️ Bike</option>
              <option value="car">🚗 Car</option>
              <option value="tractor">🚜 Tractor</option>
            </select>
            <select className="input-field" value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input type="text" placeholder="Brand (e.g. Bosch)" className="input-field" value={filters.brand} onChange={(e) => updateFilter('brand', e.target.value)} />
            <select className="input-field" value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="-createdAt">🆕 Newest</option>
              <option value="price">💰 Price: Low to High</option>
              <option value="-price">💎 Price: High to Low</option>
              <option value="name">🔤 Name: A-Z</option>
            </select>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <input type="number" placeholder="Min ₹" className="input-field" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} />
            <input type="number" placeholder="Max ₹" className="input-field" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} />
            <select className="input-field" value={filters.dealerState} onChange={(e) => updateFilter('dealerState', e.target.value)}>
              <option value="">📍 All States</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="text" placeholder="📍 Dealer City" className="input-field" value={filters.dealerCity} onChange={(e) => updateFilter('dealerCity', e.target.value)} />
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-steel-500 dark:text-gray-400 animate-fadeIn">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-lg">No products found. Try adjusting your filters.</p>
          <p className="text-sm mt-2">Tip: Try searching for "brake pad" or "hydraulic pump" 💡</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <div key={p._id} className="animate-slideUp" style={{ animationDelay: `${i * 50}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <Pagination page={filters.page} totalPages={totalPages} onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} />
        </>
      )}
    </div>
  );
};

export default ProductsPage;
