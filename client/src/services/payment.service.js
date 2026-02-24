import api from './api';

const paymentService = {
  getRazorpayKey: () => api.get('/payments/key'),
  createRazorpayOrder: (orderId) => api.post('/payments/create-order', { orderId }),
  verifyPayment: (data) => api.post('/payments/verify', data),
};

export default paymentService;
