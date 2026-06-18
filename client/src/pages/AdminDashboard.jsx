import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Table, Button, Form, Badge } from 'react-bootstrap';
import { 
  FaUsers, 
  FaBox, 
  FaClipboardList, 
  FaDollarSign, 
  FaTrash, 
  FaToggleOn, 
  FaToggleOff,
  FaCalendarAlt 
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
import { adminService } from '../services/adminService';
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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUsers({ limit: 100 }), // Fetch list of users
        adminService.getAllProducts({ limit: 100 }), // Fetch list of products
        adminService.getAllOrders({ limit: 100 }) // Fetch list of orders
      ]);

      setStats(statsRes.data.stats || null);
      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Action: Change user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      fetchData();
    } catch (error) {
      console.error('Role update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  // Action: Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Action: Toggle product active status
  const handleToggleProduct = async (productId) => {
    try {
      await adminService.toggleProduct(productId);
      toast.success('Product status updated');
      fetchData();
    } catch (error) {
      console.error('Toggle product status error:', error);
      toast.error('Failed to update product status');
    }
  };

  // Action: Delete product
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

  // Action: Update order status
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchData();
    } catch (error) {
      console.error('Update order status error:', error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <Loader />;

  // 1. Chart Data: Monthly Revenue Trend
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartLabels = [];
  const chartRevenue = [];

  if (stats && stats.monthlyRevenue && stats.monthlyRevenue.length > 0) {
    stats.monthlyRevenue.forEach(item => {
      chartLabels.push(`${months[item._id.month - 1]} ${item._id.year}`);
      chartRevenue.push(item.revenue);
    });
  } else {
    chartLabels.push('No Sales Data');
    chartRevenue.push(0);
  }

  const revenueChartData = {
    labels: chartLabels,
    datasets: [
      {
        fill: true,
        label: 'Platform Revenue ($)',
        data: chartRevenue,
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.15)',
        tension: 0.3
      }
    ]
  };

  // 2. Chart Data: Order Status Distribution
  const distLabels = [];
  const distCounts = [];
  const distColors = [];

  if (stats && stats.orderStatusDist && stats.orderStatusDist.length > 0) {
    stats.orderStatusDist.forEach(item => {
      distLabels.push(item._id);
      distCounts.push(item.count);
      
      if (item._id === 'Processing') distColors.push('#17a2b8');
      else if (item._id === 'Shipped') distColors.push('#ffc107');
      else if (item._id === 'Delivered') distColors.push('#28a745');
      else if (item._id === 'Cancelled') distColors.push('#dc3545');
      else distColors.push('#6c757d');
    });
  }

  const doughnutChartData = {
    labels: distLabels,
    datasets: [
      {
        data: distCounts,
        backgroundColor: distColors,
        borderWidth: 1
      }
    ]
  };

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="page-header d-flex flex-column mb-4 p-4 rounded bg-gradient-primary text-white shadow animate-fadeInUp">
        <h1 className="fw-bold mb-1">Admin Dashboard</h1>
        <p className="mb-0">Global platform overview: users management, order distribution, catalog moderation, and revenue insights</p>
      </div>

      {/* Stats Cards Row */}
      <Row className="g-4 mb-5 animate-fadeInUp">
        <Col xs={12} sm={6} lg={3}>
          <div className="stats-card h-100 p-4 rounded shadow-sm d-flex align-items-center gap-3 bg-white border-start border-4 border-primary">
            <div className="stats-card-icon text-primary fs-1"><FaUsers /></div>
            <div>
              <div className="stats-card-value fw-bold fs-3 text-dark">{stats?.totalUsers || 0}</div>
              <div className="stats-card-label text-muted fs-7 text-uppercase">Total Users</div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <div className="stats-card h-100 p-4 rounded shadow-sm d-flex align-items-center gap-3 bg-white border-start border-4 border-warning">
            <div className="stats-card-icon text-warning fs-1"><FaBox /></div>
            <div>
              <div className="stats-card-value fw-bold fs-3 text-dark">{stats?.totalProducts || 0}</div>
              <div className="stats-card-label text-muted fs-7 text-uppercase">Total Products</div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <div className="stats-card h-100 p-4 rounded shadow-sm d-flex align-items-center gap-3 bg-white border-start border-4 border-success">
            <div className="stats-card-icon text-success fs-1"><FaClipboardList /></div>
            <div>
              <div className="stats-card-value fw-bold fs-3 text-dark">{stats?.totalOrders || 0}</div>
              <div className="stats-card-label text-muted fs-7 text-uppercase">Total Orders</div>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <div className="stats-card h-100 p-4 rounded shadow-sm d-flex align-items-center gap-3 bg-white border-start border-4 border-info">
            <div className="stats-card-icon text-info fs-1"><FaDollarSign /></div>
            <div>
              <div className="stats-card-value fw-bold fs-3 text-dark">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
              <div className="stats-card-label text-muted fs-7 text-uppercase">Platform Revenue</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-5 animate-fadeInUp">
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 rounded h-100">
            <Card.Title className="fw-bold mb-4">Platform Sales Trend (Last 6 Months)</Card.Title>
            <div style={{ position: 'relative', height: '300px' }}>
              <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 rounded h-100">
            <Card.Title className="fw-bold mb-4">Order Status Distribution</Card.Title>
            <div style={{ position: 'relative', height: '300px' }} className="d-flex align-items-center justify-content-center">
              {stats?.totalOrders === 0 ? (
                <div className="text-muted text-center">No orders placed on platform yet.</div>
              ) : (
                <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs Layout */}
      <Card className="border-0 shadow-sm rounded mb-5 animate-fadeInUp">
        <Card.Body className="p-4">
          <Tabs defaultActiveKey="users" id="admin-dashboard-tabs" className="mb-4">
            
            {/* Users Tab */}
            <Tab eventKey="users" title="Users Administration">
              {users.length === 0 ? (
                <div className="text-center py-4 text-muted">No users found.</div>
              ) : (
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined Date</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="fw-bold">{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <Form.Select 
                            size="sm" 
                            style={{ width: '130px' }}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </Form.Select>
                        </td>
                        <td>
                          <small className="text-muted d-flex align-items-center gap-1">
                            <FaCalendarAlt /> {new Date(u.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td className="text-end">
                          <Button 
                            variant="link" 
                            onClick={() => handleDeleteUser(u._id)} 
                            className="text-danger p-0 border-0"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>

            {/* Products Tab */}
            <Tab eventKey="products" title="Product Moderation">
              {products.length === 0 ? (
                <div className="text-center py-4 text-muted">No products found.</div>
              ) : (
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Seller</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <img 
                            src={p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/40'} 
                            alt={p.name} 
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            className="rounded bg-light"
                          />
                        </td>
                        <td className="fw-bold">{p.name}</td>
                        <td>
                          <div>{p.seller?.name || 'Seller'}</div>
                          <small className="text-muted fs-7">{p.seller?.email}</small>
                        </td>
                        <td>${p.price.toFixed(2)}</td>
                        <td>
                          <Badge bg={p.isActive ? 'success' : 'secondary'}>
                            {p.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button 
                            variant="link" 
                            onClick={() => handleToggleProduct(p._id)} 
                            className={`p-1 me-2 border-0 ${p.isActive ? 'text-success' : 'text-muted'}`}
                            title={p.isActive ? 'Deactivate Product' : 'Activate Product'}
                          >
                            {p.isActive ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                          </Button>
                          <Button 
                            variant="link" 
                            onClick={() => handleDeleteProduct(p._id)} 
                            className="text-danger p-1 border-0"
                            title="Delete Product"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab>

            {/* Orders Tab */}
            <Tab eventKey="orders" title="Order Tracking">
              {orders.length === 0 ? (
                <div className="text-center py-4 text-muted">No orders found.</div>
              ) : (
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="text-end">Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="fw-bold text-primary">#{order._id.substring(order._id.length - 8)}</td>
                        <td>
                          <div>{order.user?.name || 'Anonymous'}</div>
                          <small className="text-muted fs-7">{order.user?.email}</small>
                        </td>
                        <td className="fw-semibold">${order.totalPrice.toFixed(2)}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
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
                              onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
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
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
