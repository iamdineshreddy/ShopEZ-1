import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Address State
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'SimulatedCard'

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();

    if (step === 1) {
      const { street, city, state, zipCode, country } = shippingAddress;
      if (!street || !city || !state || !zipCode || !country) {
        return toast.warning('Please fill in all shipping details');
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        shippingAddress,
        paymentMethod
      };
      await orderService.createOrder(orderData);
      toast.success('Order placed successfully!');
      await clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <Container className="py-5 text-center">
        <h2>Your cart is empty</h2>
        <p className="text-muted">You cannot proceed to checkout with an empty cart.</p>
        <Button onClick={() => navigate('/products')} className="btn-primary-custom mt-3">
          Go Shopping
        </Button>
      </Container>
    );
  }

  // Price calculations
  const subtotal = cartTotal;
  const tax = subtotal * 0.1;
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shippingPrice;

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="page-header d-flex align-items-center mb-4 p-4 rounded bg-gradient-primary text-white shadow animate-fadeInUp">
        <h1 className="fw-bold mb-0">Checkout</h1>
      </div>

      {/* Stepper Header */}
      <div className="checkout-stepper d-flex justify-content-between mb-5 border-bottom pb-3 animate-fadeInUp">
        <div className={`step-item ${step >= 1 ? 'text-primary fw-bold' : 'text-muted'}`}>
          1. Shipping Address
        </div>
        <div className={`step-item ${step >= 2 ? 'text-primary fw-bold' : 'text-muted'}`}>
          2. Payment Method
        </div>
        <div className={`step-item ${step >= 3 ? 'text-primary fw-bold' : 'text-muted'}`}>
          3. Review Order
        </div>
      </div>

      <Row className="g-4 animate-fadeInUp">
        {/* Main Step Content */}
        <Col lg={8}>
          {step === 1 && (
            <Card className="border-0 shadow-sm p-4 rounded">
              <h4 className="fw-bold mb-4">Shipping Address</h4>
              <Form onSubmit={handleNextStep}>
                <Form.Group className="mb-3" controlId="street">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="123 Main St"
                    required
                  />
                </Form.Group>
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        placeholder="New York"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="state">
                      <Form.Label>State / Province</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        placeholder="NY"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group controlId="zipCode">
                      <Form.Label>Zip / Postal Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleAddressChange}
                        placeholder="10001"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="country">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                        placeholder="United States"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" className="btn-primary-custom px-4 py-2">
                  Continue to Payment
                </Button>
              </Form>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-0 shadow-sm p-4 rounded">
              <h4 className="fw-bold mb-4">Payment Method</h4>
              <Form onSubmit={handleNextStep}>
                <Form.Group className="mb-4">
                  <Form.Check
                    type="radio"
                    id="cod"
                    label="Cash on Delivery (COD)"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mb-3 fw-semibold fs-5"
                  />
                  <Form.Check
                    type="radio"
                    id="card"
                    label="Simulated Card Payment"
                    name="paymentMethod"
                    value="SimulatedCard"
                    checked={paymentMethod === 'SimulatedCard'}
                    onChange={() => setPaymentMethod('SimulatedCard')}
                    className="fw-semibold fs-5"
                  />
                  <p className="text-muted ms-4 fs-7 mt-1">
                    (No real credentials required. Will be auto-charged on placement)
                  </p>
                </Form.Group>
                <div className="d-flex gap-3">
                  <Button variant="outline-secondary" onClick={handleBackStep} className="px-4 py-2">
                    Back
                  </Button>
                  <Button type="submit" className="btn-primary-custom px-4 py-2">
                    Review Order
                  </Button>
                </div>
              </Form>
            </Card>
          )}

          {step === 3 && (
            <div className="d-flex flex-column gap-4">
              <Card className="border-0 shadow-sm p-4 rounded">
                <h4 className="fw-bold mb-3">Order Details</h4>
                <div className="mb-3">
                  <h6 className="fw-bold text-muted mb-1">Shipping Address:</h6>
                  <p className="mb-0 fs-5">
                    {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}, {shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h6 className="fw-bold text-muted mb-1">Payment Method:</h6>
                  <p className="mb-0 fs-5">
                    {paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Simulated Card Payment'}
                  </p>
                </div>
              </Card>

              <Card className="border-0 shadow-sm p-4 rounded">
                <h4 className="fw-bold mb-3">Review Items</h4>
                <ListGroup variant="flush">
                  {cartItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    const activePrice = product.discountPrice || product.price;

                    return (
                      <ListGroup.Item key={product._id} className="px-0 py-3 border-bottom border-light">
                        <Row className="align-items-center g-2">
                          <Col xs={2}>
                            <Image
                              src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/50'}
                              alt={product.name}
                              rounded
                              fluid
                              style={{ maxHeight: '50px', objectFit: 'contain' }}
                            />
                          </Col>
                          <Col xs={6}>
                            <div className="fw-bold">{product.name}</div>
                            <small className="text-muted">
                              {item.quantity} x ${activePrice.toFixed(2)}
                            </small>
                          </Col>
                          <Col xs={4} className="text-end fw-bold text-primary">
                            ${(activePrice * item.quantity).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>

                <div className="d-flex gap-3 mt-4">
                  <Button variant="outline-secondary" onClick={handleBackStep} className="px-4 py-2">
                    Back to Payment
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder} 
                    className="btn-primary-custom px-4 py-2"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </Col>

        {/* Pricing Summary Sidebar */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 rounded position-sticky" style={{ top: '20px' }}>
            <Card.Title className="fw-bold mb-4">Summary</Card.Title>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Items Subtotal</span>
              <span className="fw-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tax (10%)</span>
              <span className="fw-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
              <span className="text-muted">Shipping</span>
              <span className="fw-semibold">
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <h5 className="fw-bold mb-0">Total</h5>
              <h5 className="fw-bold text-primary mb-0">${total.toFixed(2)}</h5>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
