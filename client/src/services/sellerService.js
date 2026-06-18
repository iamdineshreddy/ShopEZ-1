import api from './api';

export const sellerService = {
  getSellerProducts: () => api.get('/users/seller/products'),
  getSellerOrders: () => api.get('/users/seller/orders'),
  getSellerStats: () => api.get('/users/seller/stats'),
};
