import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import complaintService from '../../services/complaint.service';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintService.getComplaint(id)
      .then(({ data }) => setComplaint(data.complaint))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!complaint) return <div className="text-center py-16">Complaint not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-steel-800">{complaint.subject}</h1>
          <div className="flex gap-2">
            <StatusBadge status={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>
        <p className="text-steel-600 mb-4">{complaint.description}</p>
        <div className="text-sm text-steel-400">
          <span>Type: {complaint.type?.replace('_', ' ')}</span>
          <span className="mx-2">•</span>
          <span>Filed: {new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Responses */}
      <div className="mt-6 space-y-4">
        <h3 className="font-bold text-steel-800">Responses</h3>
        {complaint.responses.length === 0 ? (
          <p className="text-steel-500 text-sm">No responses yet. We'll get back to you soon.</p>
        ) : (
          complaint.responses.map((r, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-steel-800">{r.user?.name || 'Support'}</span>
                <span className="badge bg-steel-100 text-steel-600">{r.user?.role}</span>
                <span className="text-xs text-steel-400 ml-auto">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-steel-600 text-sm">{r.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
