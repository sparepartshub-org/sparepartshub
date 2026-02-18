import api from './api';

const complaintService = {
  createComplaint: (data) => api.post('/complaints', data),
  getMyComplaints: () => api.get('/complaints/my'),
  getWholesalerComplaints: () => api.get('/complaints/wholesaler/my'),
  getAllComplaints: (params) => api.get('/complaints/all', { params }),
  getComplaint: (id) => api.get(`/complaints/${id}`),
  respond: (id, data) => api.post(`/complaints/${id}/respond`, data),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
};

export default complaintService;
