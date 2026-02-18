import React, { useEffect, useState } from 'react';
import categoryService from '../../services/category.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', vehicleType: 'both' });
  const [editId, setEditId] = useState(null);

  const fetchCategories = () => {
    categoryService.getCategories()
      .then(({ data }) => setCategories(data.categories))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await categoryService.updateCategory(editId, form);
        toast.success('Category updated ✅');
      } else {
        await categoryService.createCategory(form);
        toast.success('Category created ✅');
      }
      setForm({ name: '', description: '', vehicleType: 'both' });
      setEditId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, description: cat.description || '', vehicleType: cat.vehicleType });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      toast.success('Deleted ✅');
      fetchCategories();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200 mb-6">🏷️ Manage Categories</h1>

      <form onSubmit={handleSubmit} className="card p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">Name</label>
          <input type="text" className="input-field" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">Description</label>
          <input type="text" className="input-field" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">Type</label>
          <select className="input-field" value={form.vehicleType}
            onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}>
            <option value="both">🔧 Both</option>
            <option value="bike">🏍️ Bike</option>
            <option value="car">🚗 Car</option>
          </select>
        </div>
        <button type="submit" className="btn-primary flex items-center gap-1">
          <FiPlus /> {editId ? 'Update' : 'Add'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm({ name: '', description: '', vehicleType: 'both' }); }} className="btn-secondary">Cancel</button>
        )}
      </form>

      <div className="space-y-2">
        {categories.map((cat, i) => (
          <div key={cat._id} className="card p-4 flex items-center justify-between hover:shadow-md transition-all duration-300 animate-slideUp" style={{ animationDelay: `${i * 50}ms` }}>
            <div>
              <h3 className="font-semibold text-steel-800 dark:text-gray-200">⚙️ {cat.name}</h3>
              <p className="text-xs text-steel-500 dark:text-gray-400">{cat.vehicleType === 'bike' ? '🏍️' : cat.vehicleType === 'car' ? '🚗' : '🔧'} {cat.vehicleType} • {cat.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:text-blue-700 transition"><FiEdit2 /></button>
              <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700 transition"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
