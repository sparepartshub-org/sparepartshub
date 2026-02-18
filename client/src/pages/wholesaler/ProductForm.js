/**
 * ProductForm — create/edit product form for wholesalers
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../services/product.service';
import categoryService from '../../services/category.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', comparePrice: '',
    category: '', brand: '', vehicleType: 'bike',
    vehicleMake: '', vehicleModel: '', partNumber: '',
    stock: '', tags: '',
  });
  const [images, setImages] = useState(null);

  useEffect(() => {
    categoryService.getCategories().then(({ data }) => setCategories(data.categories)).catch(console.error);
    if (id) {
      productService.getProduct(id)
        .then(({ data }) => {
          const p = data.product;
          setForm({
            name: p.name, description: p.description,
            price: p.price, comparePrice: p.comparePrice || '',
            category: p.category?._id || '', brand: p.brand,
            vehicleType: p.vehicleType, vehicleMake: p.vehicleMake || '',
            vehicleModel: p.vehicleModel || '', partNumber: p.partNumber || '',
            stock: p.stock, tags: p.tags?.join(', ') || '',
          });
        })
        .catch(() => toast.error('Product not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') {
          const arr = v.split(',').map(t => t.trim()).filter(Boolean);
          arr.forEach(t => formData.append('tags', t));
        } else if (v !== '') {
          formData.append(k, v);
        }
      });
      if (images) {
        Array.from(images).forEach(f => formData.append('images', f));
      }

      if (id) {
        await productService.updateProduct(id, formData);
        toast.success('Product updated! ✅');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created! 🎉');
      }
      navigate('/wholesaler/products');
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0] || err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200 mb-6">{id ? '✏️ Edit' : '➕ Add'} Product</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🔧 Product Name *</label>
          <input type="text" className="input-field" required value={form.name} onChange={update('name')} placeholder="e.g. Bosch Brake Pad Set" />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📋 Description *</label>
          <textarea className="input-field" rows={3} required value={form.description} onChange={update('description')} placeholder="Detailed product description..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">💰 Price (₹) *</label>
            <input type="number" className="input-field" required min="0" value={form.price} onChange={update('price')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🏷️ Compare/MRP Price</label>
            <input type="number" className="input-field" min="0" value={form.comparePrice} onChange={update('comparePrice')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📂 Category *</label>
            <select className="input-field" required value={form.category} onChange={update('category')}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🚘 Vehicle Type *</label>
            <select className="input-field" required value={form.vehicleType} onChange={update('vehicleType')}>
              <option value="bike">🏍️ Bike</option>
              <option value="car">🚗 Car</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🏢 Brand *</label>
            <input type="text" className="input-field" required value={form.brand} onChange={update('brand')} placeholder="e.g. Bosch" />
          </div>
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🚘 Vehicle Make</label>
            <input type="text" className="input-field" value={form.vehicleMake} onChange={update('vehicleMake')} placeholder="e.g. Honda" />
          </div>
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📌 Vehicle Model</label>
            <input type="text" className="input-field" value={form.vehicleModel} onChange={update('vehicleModel')} placeholder="e.g. Civic" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📦 Stock *</label>
            <input type="number" className="input-field" required min="0" value={form.stock} onChange={update('stock')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🔩 Part Number</label>
            <input type="text" className="input-field" value={form.partNumber} onChange={update('partNumber')} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🏷️ Tags (comma-separated)</label>
          <input type="text" className="input-field" value={form.tags} onChange={update('tags')} placeholder="brake, honda, cbr, oem" />
        </div>

        <div>
          <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📸 Product Images</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)}
            className="w-full text-sm text-steel-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 dark:file:bg-gray-700 file:text-primary-500 dark:file:text-gray-300 file:font-semibold hover:file:bg-primary-100 dark:hover:file:bg-gray-600 transition" />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? '⏳ Saving...' : (id ? '✅ Update Product' : '🚀 Create Product')}
          </button>
          <button type="button" onClick={() => navigate('/wholesaler/products')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
