import api from './api';

export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  getDashboardStats: () => api.get('/admin/stats'),
  getAllProducts: (params) => api.get('/admin/products', { params }),
  toggleProduct: (id) => api.put(`/admin/products/${id}/toggle`),
};
