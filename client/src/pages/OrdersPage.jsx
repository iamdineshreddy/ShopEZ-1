import React, { useState, useEffect } from 'react';
import { Container, Accordion, Card, Row, Col, Badge, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaRegCalendarAlt, FaCreditCard, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { orderService } from '../services/orderService';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await orderService.getMyOrders();
      // Sort newest first
      const sorted = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders(); // refresh
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-info text-white';
      case 'Shipped':
        return 'bg-warning text-dark';
      case 'Delivered':
        return 'bg-success text-white';
      case 'Cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  if (loading) return <Loader />;

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="page-header d-flex align-items-center mb-4 p-4 rounded bg-gradient-primary text-white shadow animate-fadeInUp">
        <h1 className="fw-bold mb-0">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5 rounded animate-fadeInUp">
          <Card.Body>
            <div className="fs-1 text-muted mb-3">
              <FaBoxOpen />
            </div>
            <h4 className="fw-bold">No orders yet</h4>
            <p className="text-muted">You haven't placed any orders yet. Start shopping now!</p>
            <Button as={Link} to="/products" className="btn-primary-custom px-4 py-2 mt-2">
              Shop Now
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Accordion className="animate-fadeInUp">
          {orders.map((order, index) => (
            <Card key={order._id} className="border-0 shadow-sm mb-3 rounded overflow-hidden">
              <Accordion.Item eventKey={index.toString()} className="border-0">
                <Accordion.Header className="order-accordion-header">
                  <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center pe-3 gap-2">
                    <div>
                      <span className="fw-bold text-primary">Order ID: #{order._id.substring(order._id.length - 8)}</span>
                      <div className="text-muted fs-7 d-flex align-items-center gap-1 mt-1">
                        <FaRegCalendarAlt /> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="fw-bold fs-5 text-dark">${order.totalPrice.toFixed(2)}</span>
                      <Badge bg="" className={`fs-6 py-1 px-3 ${getStatusBadgeClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </Badge>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="bg-light-50">
                  {/* Order Items */}
                  <h6 className="fw-bold border-bottom pb-2 mb-3">Items Ordered</h6>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {order.orderItems.map((item, idx) => (
                      <Row key={idx} className="align-items-center g-2 bg-white p-2 rounded shadow-2xs">
                        <Col xs={2} md={1}>
                          <Image
                            src={item.image ? item.image : 'https://via.placeholder.com/50'}
                            alt={item.name}
                            rounded
                            fluid
                            style={{ maxHeight: '50px', objectFit: 'contain' }}
                          />
                        </Col>
                        <Col xs={6} md={8}>
                          <div className="fw-bold">{item.name}</div>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </Col>
                        <Col xs={4} md={3} className="text-end fw-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Col>
                      </Row>
                    ))}
                  </div>

                  {/* Shipping & Payment info */}
                  <Row className="g-3">
                    <Col md={6}>
                      <Card className="border-0 shadow-2xs p-3 h-100">
                        <h6 className="fw-bold text-muted mb-2 d-flex align-items-center gap-2">
                          <FaMapMarkerAlt /> Shipping Address
                        </h6>
                        <p className="mb-0 fs-6">
                          {order.shippingAddress.street},<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode},<br />
                          {order.shippingAddress.country}
                        </p>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="border-0 shadow-2xs p-3 h-100">
                        <h6 className="fw-bold text-muted mb-2 d-flex align-items-center gap-2">
                          <FaCreditCard /> Payment Information
                        </h6>
                        <p className="mb-2 fs-6">
                          Method: <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Card Payment'}</strong>
                        </p>
                        <p className="mb-0">
                          Payment Status:{' '}
                          <Badge bg={order.paymentResult?.status === 'Paid' ? 'success' : 'secondary'}>
                            {order.paymentResult?.status || 'Pending'}
                          </Badge>
                        </p>
                      </Card>
                    </Col>
                  </Row>

                  {/* Cancel Button */}
                  {order.orderStatus === 'Processing' && (
                    <div className="text-end mt-4">
                      <Button 
                        variant="danger" 
                        onClick={() => handleCancelOrder(order._id)}
                        className="d-flex align-items-center gap-2 ms-auto"
                      >
                        <FaTimes /> Cancel Order
                      </Button>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default OrdersPage;
