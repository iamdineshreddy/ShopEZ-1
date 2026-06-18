const express = require('express');
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  getDashboardStats,
  getAllProducts,
  toggleProductStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.get('/stats', getDashboardStats);
router.get('/products', getAllProducts);
router.put('/products/:id/toggle', toggleProductStatus);

module.exports = router;
