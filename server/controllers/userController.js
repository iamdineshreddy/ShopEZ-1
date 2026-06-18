const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get seller's own products
// @route   GET /api/users/seller/products
// @access  Private/Seller
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders containing seller's products
// @route   GET /api/users/seller/orders
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
  try {
    // Find all products by this seller
    const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
    const productIds = sellerProducts.map((p) => p._id);

    // Find orders containing seller's products
    const orders = await Order.find({
      'orderItems.product': { $in: productIds },
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get seller dashboard statistics
// @route   GET /api/users/seller/stats
// @access  Private/Seller
const getSellerStats = async (req, res) => {
  try {
    // Total products by seller
    const totalProducts = await Product.countDocuments({ seller: req.user._id });

    // Find seller's product IDs
    const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
    const productIds = sellerProducts.map((p) => p._id);

    // Orders containing seller's products
    const orders = await Order.find({
      'orderItems.product': { $in: productIds },
      orderStatus: { $ne: 'Cancelled' },
    });

    const totalOrders = orders.length;

    // Calculate revenue from seller's products only
    let totalRevenue = 0;
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (productIds.some((id) => id.toString() === item.product.toString())) {
          totalRevenue += item.price * item.quantity;
        }
      });
    });

    // Monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Order.aggregate([
      {
        $match: {
          'orderItems.product': { $in: productIds },
          createdAt: { $gte: sixMonthsAgo },
          orderStatus: { $ne: 'Cancelled' },
        },
      },
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.product': { $in: productIds } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: {
            $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        monthlyData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSellerProducts, getSellerOrders, getSellerStats };
