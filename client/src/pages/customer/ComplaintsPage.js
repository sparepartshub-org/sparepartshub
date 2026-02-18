import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import complaintService from '../../services/complaint.service';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', type: 'other', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);

  const fetchComplaints = () => {
    complaintService.getMyComplaints()
      .then(({ data }) => setComplaints(data.complaints))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await complaintService.createComplaint(form);
      toast.success('Complaint filed successfully ✅');
      setShowForm(false);
      setForm({ subject: '', description: '', type: 'other', priority: 'medium' });
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to file complaint');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-steel-800 dark:text-gray-200">📋 My Complaints</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✖ Cancel' : '➕ New Complaint'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4 animate-slideDown">
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📝 Subject</label>
            <input type="text" className="input-field" required value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">🏷️ Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="product_quality">🔧 Product Quality</option>
                <option value="delivery">🚚 Delivery Issue</option>
                <option value="wrong_item">❌ Wrong Item</option>
                <option value="refund">💰 Refund Request</option>
                <option value="other">📌 Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">⚡ Priority</label>
              <select className="input-field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-steel-700 dark:text-gray-300 mb-1">📄 Description</label>
            <textarea className="input-field" rows={4} required value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? '⏳ Submitting...' : '📤 Submit Complaint'}
          </button>
        </form>
      )}

      {complaints.length === 0 ? (
        <div className="text-center py-16 text-steel-500 dark:text-gray-400">
          <p className="text-4xl mb-4">✅</p>
          <p>No complaints filed. That's great!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c, i) => (
            <Link key={c._id} to={`/complaints/${c._id}`} className="card p-5 block hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-slideUp" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-steel-800 dark:text-gray-200">{c.subject}</h3>
                <div className="flex gap-2">
                  <StatusBadge status={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </div>
              <p className="text-sm text-steel-500 dark:text-gray-400 line-clamp-1">{c.description}</p>
              <p className="text-xs text-steel-400 dark:text-gray-500 mt-2">📅 {new Date(c.createdAt).toLocaleDateString()} • 💬 {c.responses.length} response(s)</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;
