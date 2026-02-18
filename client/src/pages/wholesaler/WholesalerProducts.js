import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/product.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const vehicleEmoji = (type) => {
  switch (type) {
    case 'bike': return '🏍️';
    case 'car': return '🚗';
    case 'tractor': return '🚜';
    default: return '🔧';
  }
};

const WholesalerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    productService.getMyProducts({ limit: 50 })
      .then(({ data }) => setProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted ✅');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200">⚙️ My Products</h1>
        <Link to="/wholesaler/products/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-steel-500 dark:text-gray-400">
          <p className="text-4xl mb-4">📦</p>
          <p>No products yet. Start by adding your first product! 🔧</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-steel-100 dark:bg-gray-700 text-steel-600 dark:text-gray-300">
                <th className="text-left p-3">Product</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Type</th>
                <th className="text-right p-3">Price</th>
                <th className="text-right p-3">Stock</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-steel-100 dark:border-gray-700 hover:bg-steel-50 dark:hover:bg-gray-800 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-steel-100 dark:bg-gray-700 rounded flex items-center justify-center text-lg">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded" /> : '🔧'}
                      </div>
                      <div>
                        <p className="font-medium text-steel-800 dark:text-gray-200">{p.name}</p>
                        <p className="text-xs text-steel-400 dark:text-gray-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-steel-600 dark:text-gray-400">{p.category?.name}</td>
                  <td className="p-3"><span className="badge bg-steel-100 text-steel-600 dark:bg-gray-700 dark:text-gray-300">{vehicleEmoji(p.vehicleType)} {p.vehicleType}</span></td>
                  <td className="p-3 text-right font-semibold dark:text-gray-200">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right">
                    <span className={p.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>{p.stock}</span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Link to={`/wholesaler/products/edit/${p._id}`} className="text-blue-500 hover:text-blue-700 transition"><FiEdit2 /></Link>
                      <button onClick={() => handleDelete(p._id, p.name)} className="text-red-500 hover:text-red-700 transition"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WholesalerProducts;
