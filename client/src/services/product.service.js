import api from './api';

const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/detail/${id}`),
  getMyProducts: (params) => api.get('/products/wholesaler/my', { params }),
  createProduct: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id, formData) => api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default productService;
