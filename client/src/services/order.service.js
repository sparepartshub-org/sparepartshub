import api from './api';

const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  getOrderTracking: (id) => api.get(`/orders/${id}/tracking`),
  getWholesalerOrders: (params) => api.get('/orders/wholesaler/my', { params }),
  getAllOrders: (params) => api.get('/orders/all', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

export default orderService;
