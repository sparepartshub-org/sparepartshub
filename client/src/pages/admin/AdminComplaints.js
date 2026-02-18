import React, { useEffect, useState } from 'react';
import complaintService from '../../services/complaint.service';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseForm, setResponseForm] = useState({ id: null, message: '' });

  const fetchComplaints = () => {
    complaintService.getAllComplaints()
      .then(({ data }) => setComplaints(data.complaints))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleRespond = async (id) => {
    if (!responseForm.message.trim()) return;
    try {
      await complaintService.respond(id, { message: responseForm.message });
      toast.success('Response sent');
      setResponseForm({ id: null, message: '' });
      fetchComplaints();
    } catch { toast.error('Failed'); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await complaintService.updateStatus(id, { status });
      toast.success('Status updated');
      fetchComplaints();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-steel-800 mb-6">All Complaints</h1>

      {complaints.length === 0 ? (
        <div className="text-center py-16 text-steel-500">No complaints. Everything is running smoothly! ✅</div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                <h3 className="font-semibold text-steel-800">{c.subject}</h3>
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.priority} />
                  <StatusBadge status={c.status} />
                  <select
                    className="text-xs border rounded px-2 py-1"
                    value=""
                    onChange={(e) => e.target.value && handleStatusUpdate(c._id, e.target.value)}
                  >
                    <option value="">Change status...</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-steel-600 mb-2">{c.description}</p>
              <p className="text-xs text-steel-400 mb-3">
                By: {c.customer?.name} ({c.customer?.email}) • {c.type?.replace('_', ' ')} • {new Date(c.createdAt).toLocaleDateString()}
                {c.wholesaler && ` • Against: ${c.wholesaler.businessName || c.wholesaler.name}`}
              </p>

              {/* Existing responses */}
              {c.responses?.length > 0 && (
                <div className="mb-3 space-y-2">
                  {c.responses.map((r, i) => (
                    <div key={i} className="bg-steel-50 p-2 rounded text-sm">
                      <span className="font-medium">{r.user?.name}:</span> {r.message}
                    </div>
                  ))}
                </div>
              )}

              {/* Respond form */}
              {responseForm.id === c._id ? (
                <div className="flex gap-2">
                  <input type="text" className="input-field flex-1" placeholder="Type response..."
                    value={responseForm.message} onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })} />
                  <button onClick={() => handleRespond(c._id)} className="btn-primary text-sm py-2 px-4">Send</button>
                  <button onClick={() => setResponseForm({ id: null, message: '' })} className="btn-secondary text-sm py-2 px-4">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setResponseForm({ id: c._id, message: '' })} className="btn-secondary text-sm py-1.5 px-4">Respond</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
