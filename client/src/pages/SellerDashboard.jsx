import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { 
  FaBox, 
  FaClipboardList, 
  FaDollarSign, 
  FaStar, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaChevronRight 
} from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { sellerService } from '../services/sellerService';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

// Register Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null for add, product object for edit
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [featured, setFeatured] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
        sellerService.getSellerStats(),
        sellerService.getSellerProducts(),
        sellerService.getSellerOrders(),
        productService.getCategories()
      ]);

      setStats(statsRes.data.stats || null);
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching seller dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setDiscountPrice('');
    setCategory(categories[0]?._id || '');
    setStock('');
    setFeatured(false);
    setImageFiles([]);
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditProduct(product);
    setName(product.name || '');
    setDescription(product.description || '');
    setPrice(product.price || '');
    setDiscountPrice(product.discountPrice || '');
    setCategory(product.category?._id || product.category || '');
    setStock(product.stock || '');
    setFeatured(product.featured || false);
    setImageFiles([]); // Images must be re-uploaded if editing and replacing
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Delete product error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleFileChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      return toast.warning('Please select a category');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (discountPrice) formData.append('discountPrice', discountPrice);
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('featured', featured);

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }

    setModalLoading(true);
    try {
      if (editProduct) {
        await productService.updateProduct(editProduct._id, formData);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created successfully!');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Submit product error:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchData();
    } catch (error) {
      console.error('Update status error:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) return <Loader />;

  // Calculate Average Rating
  const validRatedProducts = products.filter(p => p.ratings > 0);
  const avgRating = validRatedProducts.length > 0
    ? (validRatedProducts.reduce((sum, p) => sum + p.ratings, 0) / validRatedProducts.length).toFixed(1)
    : 'N/A';

  // 1. Chart Data: Monthly Revenue
  // Format labels and revenue points from stats.monthlyData
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartLabels = [];
  const chartRevenue = [];

  if (stats && stats.monthlyData && stats.monthlyData.length > 0) {
    stats.monthlyData.forEach(item => {
      chartLabels.push(`${months[item._id.month - 1]} ${item._id.year}`);
      chartRevenue.push(item.revenue);
    });
  } else {
    // fallback placeholder
    chartLabels.push('No Sales Data');
    chartRevenue.push(0);
  }

  const revenueChartData = {
    labels: chartLabels,
    datasets: [
      {
        fill: true,
        label: 'Monthly Revenue ($)',
        data: chartRevenue,
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.15)',
        tension: 0.3
      }
    ]
  };

  // 2. Chart Data: Status Distribution
  const statusCounts = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0
  };

  orders.forEach(order => {
    if (statusCounts[order.orderStatus] !== undefined) {
      statusCounts[order.orderStatus]++;
    }
  });

  const doughnutChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ['#17a2b8', '#ffc107', '#28a745', '#dc3545'],
        hoverBackgroundColor: ['#138496', '#e0a800', '#218838', '#c82333'],
        borderWidth: 1
      }
    ]
  };

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-4 rounded bg-gradient-primary text-white shadow animate-fadeInUp">
        <div>
          <h1 className="fw-bold mb-1">Seller Dashboard</h1>
          <p className="mb-0">Manage your shop catalog, monitor orders, and view sales insights</p>
        </div>
        <Button onClick={handleOpenAddModal} variant="light" className="text-primary fw-bold px-4 py-2 mt-3 mt-md-0 d-flex align-items-center gap-2">
          <FaPlus /> Add New Product
        </Button>
      </div>

      {/* Stats Cards Row */}
      <Row className="g-4 mb-5 animate-fadeInUp">
        <Col xs={12} sm={6} lg={3}>
          <div className="stats-card stats-card-purple h-100 p-4 rounded shadow-sm d-flex align-items-center gap-3 bg-white border-start border-4 border-primary">
            <div className="stats-card-icon text-primary fs-1"><FaBox /></div>
            <div>
              <div className="stats-card-value fw-bold fs-3 text-dark">{stats?.totalProducts || 0}</div>
              <div className="stats-card-label text-muted fs-7 text-uppercase">Total Products</div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <div className="stats-card stats-card-coral h-100 p-4 rounded shadow-sm d-flex align-items-center gap-3 bg-white border-start border-4 border-warning">
            <div className="stats-card-icon text-warning fs-1"><FaClipboardList /></div>
            <div>
              <div className="stats-card-value fw-bold fs-3 text-dark">{stats?.totalOrders || 0}</div>
              <div className="stats-card-label text-muted fs-7 text-uppercase">Total Orders</div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <div className="stats-card stats-card-teal h-100 p-4 rounded shadow-sm d-flex align-items-center gap-3 bg-white border-start border-4 border-success">
            <div className="stats-card-icon text-success fs-1"><FaDollarSign /></div>
            <div>
              <div className="stats-card-value fw-bold fs-3 text-dark">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
              <div className="stats-card-label text-muted fs-7 text-uppercase">Revenue</div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <div className="stats-card stats-card-blue h-100 p-4 rounded shadow-sm d-flex align-items-center gap-3 bg-white border-start border-4 border-info">
            <div className="stats-card-icon text-info fs-1"><FaStar /></div>
            <div>
              <div className="stats-card-value fw-bold fs-3 text-dark">{avgRating}</div>
              <div className="stats-card-label text-muted fs-7 text-uppercase">Avg Rating</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-5 animate-fadeInUp">
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 rounded h-100">
            <Card.Title className="fw-bold mb-4">Revenue Trend (Last 6 Months)</Card.Title>
            <div style={{ position: 'relative', height: '300px' }}>
              <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 rounded h-100">
            <Card.Title className="fw-bold mb-4">Order Status Distribution</Card.Title>
            <div style={{ position: 'relative', height: '300px' }} className="d-flex align-items-center justify-content-center">
              {orders.length === 0 ? (
                <div className="text-muted text-center">No orders received yet.</div>
              ) : (
                <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Catalog & Products Table */}
      <Card className="border-0 shadow-sm rounded mb-5 animate-fadeInUp">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold mb-4">My Products Catalog</Card.Title>
          {products.length === 0 ? (
            <div className="text-center py-4 text-muted">
              You haven't listed any products yet. Click "Add New Product" to list one.
            </div>
          ) : (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/40'} 
                        alt={product.name} 
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                        className="rounded bg-light"
                      />
                    </td>
                    <td className="fw-bold">{product.name}</td>
                    <td>
                      {product.discountPrice ? (
                        <>
                          <span className="text-primary fw-semibold">${product.discountPrice}</span>
                          <span className="text-muted text-decoration-line-through ms-2 fs-7">${product.price}</span>
                        </>
                      ) : (
                        <span>${product.price}</span>
                      )}
                    </td>
                    <td>
                      {product.stock > 0 ? (
                        <span className="text-success fw-bold">{product.stock} in Stock</span>
                      ) : (
                        <span className="text-danger fw-bold">Out of Stock</span>
                      )}
                    </td>
                    <td>
                      <Badge bg={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button variant="link" onClick={() => handleOpenEditModal(product)} className="text-warning p-1 me-2 border-0">
                        <FaEdit />
                      </Button>
                      <Button variant="link" onClick={() => handleDeleteProduct(product._id)} className="text-danger p-1 border-0">
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Recent Orders Table */}
      <Card className="border-0 shadow-sm rounded animate-fadeInUp">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold mb-4">Recent Orders</Card.Title>
          {orders.length === 0 ? (
            <div className="text-center py-4 text-muted">No orders received yet.</div>
          ) : (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items Count</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th className="text-end">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="fw-bold text-primary">#{order._id.substring(order._id.length - 8)}</td>
                    <td>{order.user?.name || 'Anonymous Customer'}</td>
                    <td>{order.orderItems.length} item(s)</td>
                    <td className="fw-semibold">${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <Badge bg={
                        order.orderStatus === 'Delivered' ? 'success' : 
                        order.orderStatus === 'Shipped' ? 'warning text-dark' : 
                        order.orderStatus === 'Cancelled' ? 'danger' : 'info'
                      }>
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td className="text-end">
                      {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' ? (
                        <Form.Select 
                          size="sm" 
                          style={{ width: '150px', display: 'inline-block' }}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </Form.Select>
                      ) : (
                        <span className="text-muted fs-7">Completed / Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{editProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3" controlId="prodName">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Premium Laptop"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="prodCat">
                  <Form.Label>Category</Form.Label>
                  <Form.Select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="prodDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the product"
                required
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={4}>
                <Form.Group className="mb-3" controlId="prodPrice">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99.99"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="prodDiscount">
                  <Form.Label>Discount Price ($)</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={discountPrice} 
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="79.99 (Optional)"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="prodStock">
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control 
                    type="number" 
                    min="0"
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="10"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                id="prodFeatured"
                label="Featured Product (displays on home page)"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="prodImages">
              <Form.Label>Product Images {editProduct && <span className="text-warning fs-7">(leave empty to keep existing images)</span>}</Form.Label>
              <Form.Control 
                type="file" 
                multiple 
                onChange={handleFileChange}
                required={!editProduct}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-primary-custom" disabled={modalLoading}>
              {modalLoading ? 'Saving...' : 'Save Product'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SellerDashboard;
