const express = require('express');
const {
  getSellerProducts,
  getSellerOrders,
  getSellerStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

// Seller-specific routes
router.get('/seller/products', protect, authorize('seller'), getSellerProducts);
router.get('/seller/orders', protect, authorize('seller'), getSellerOrders);
router.get('/seller/stats', protect, authorize('seller'), getSellerStats);

module.exports = router;
