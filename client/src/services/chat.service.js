import api from './api';

const chatService = {
  sendMessage: (data) => api.post('/chat', data),
  getHistory: (params) => api.get('/chat/history', { params }),
};

export default chatService;
