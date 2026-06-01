import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

export const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
  const data = error.response?.data;

  if (data?.details && typeof data.details === 'object') {
    return Object.entries(data.details)
      .map(([field, message]) => `${field}: ${message}`)
      .join(', ');
  }

  if (data?.message) return data.message;
  if (error.message === 'Network Error') return 'Cannot reach the backend. Check that Spring Boot is running and CORS is enabled.';
  return fallback;
};

export const productApi = {
  getProducts: ({ page = 0, size = 8, keyword = '' } = {}) =>
    api.get('/api/products', { params: { page, size, keyword } }),
  getProduct: (id) => api.get(`/api/products/${id}`),
  createProduct: (payload) => api.post('/api/products', payload),
  updateProduct: (id, payload) => api.put(`/api/products/${id}`, payload),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
  uploadImage: (formData) =>
    api.post('/api/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const orderApi = {
  createOrder: (payload) => api.post('/api/orders', payload),
  getOrders: () => api.get('/api/orders'),
  getOrder: (id) => api.get(`/api/orders/${id}`),
};

export default api;
