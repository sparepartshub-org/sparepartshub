import React, { useEffect, useState } from 'react';
import complaintService from '../../services/complaint.service';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const WholesalerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseForm, setResponseForm] = useState({ id: null, message: '' });

  useEffect(() => {
    complaintService.getWholesalerComplaints()
      .then(({ data }) => setComplaints(data.complaints))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRespond = async (id) => {
    if (!responseForm.message.trim()) return;
    try {
      await complaintService.respond(id, { message: responseForm.message });
      toast.success('Response sent');
      setResponseForm({ id: null, message: '' });
      // Refresh
      const { data } = await complaintService.getWholesalerComplaints();
      setComplaints(data.complaints);
    } catch (err) {
      toast.error('Failed to respond');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-steel-800 mb-6">Complaints</h1>

      {complaints.length === 0 ? (
        <div className="text-center py-16 text-steel-500">No complaints. Keep up the good work! ✅</div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c._id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-steel-800">{c.subject}</h3>
                <div className="flex gap-2">
                  <StatusBadge status={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </div>
              <p className="text-sm text-steel-600 mb-2">{c.description}</p>
              <p className="text-xs text-steel-400 mb-3">By: {c.customer?.name} • {new Date(c.createdAt).toLocaleDateString()}</p>

              {/* Quick respond */}
              {responseForm.id === c._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Type your response..."
                    value={responseForm.message}
                    onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                  />
                  <button onClick={() => handleRespond(c._id)} className="btn-primary text-sm py-2 px-4">Send</button>
                  <button onClick={() => setResponseForm({ id: null, message: '' })} className="btn-secondary text-sm py-2 px-4">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setResponseForm({ id: c._id, message: '' })} className="btn-secondary text-sm py-1.5 px-4">
                  Respond
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WholesalerComplaints;
