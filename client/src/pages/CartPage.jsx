import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/AuthContext'; // wait! let's verify if useCart is imported from CartContext or AuthContext.
// Ah! In CartContext.jsx: `export const useCart = () => useContext(CartContext)`.
// Let's import from '../context/CartContext'.
import { useCart as useCartState } from '../context/CartContext';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    cartTotal, 
    loading, 
    updateQuantity, 
    removeItem 
  } = useCartState();

  const handleQtyChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      await updateQuantity(productId, newQty);
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Update quantity error:', error);
      toast.error('Failed to update item quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeItem(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Remove item error:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  if (loading) return <Loader />;

  // Calculate pricing summary details
  const subtotal = cartTotal;
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="page-header d-flex align-items-center mb-4 p-4 rounded bg-gradient-primary text-white shadow animate-fadeInUp">
        <h1 className="fw-bold mb-0">Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5 rounded animate-fadeInUp">
          <Card.Body>
            <div className="fs-1 text-muted mb-3">
              <FaShoppingCart />
            </div>
            <h4 className="fw-bold">Your cart is empty</h4>
            <p className="text-muted">Explore our catalog and find the best deals today.</p>
            <Button as={Link} to="/products" className="btn-primary-custom px-4 py-2 mt-2">
              Browse Products
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4 animate-fadeInUp">
          {/* Cart Items List */}
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;
                const activePrice = product.discountPrice || product.price;

                return (
                  <Card key={product._id} className="border-0 shadow-sm rounded p-3">
                    <Card.Body className="p-0">
                      <Row className="align-items-center g-3">
                        {/* Image */}
                        <Col xs={3} md={2}>
                          <Image
                            src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/100?text=No+Image'}
                            alt={product.name}
                            rounded
                            fluid
                            style={{ height: '70px', width: '70px', objectFit: 'contain' }}
                          />
                        </Col>

                        {/* Name and Seller */}
                        <Col xs={9} md={4}>
                          <h6 className="fw-bold mb-1">
                            <Link to={`/products/${product._id}`} className="text-dark text-decoration-none">
                              {product.name}
                            </Link>
                          </h6>
                          <small className="text-muted">Category: {product.category?.name || 'General'}</small>
                        </Col>

                        {/* Price & Quantity Controls */}
                        <Col xs={6} md={3} className="d-flex align-items-center gap-3">
                          <div className="d-flex align-items-center border rounded">
                            <Button
                              variant="light"
                              className="border-0 bg-transparent py-1 px-2 font-weight-bold"
                              onClick={() => handleQtyChange(product._id, item.quantity, -1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="px-2 fw-semibold">{item.quantity}</span>
                            <Button
                              variant="light"
                              className="border-0 bg-transparent py-1 px-2 font-weight-bold"
                              onClick={() => handleQtyChange(product._id, item.quantity, 1)}
                              disabled={item.quantity >= product.stock}
                            >
                              +
                            </Button>
                          </div>
                        </Col>

                        {/* Item Total & Remove */}
                        <Col xs={6} md={3} className="d-flex align-items-center justify-content-between">
                          <div className="text-end">
                            <div className="fw-bold text-primary">${(activePrice * item.quantity).toFixed(2)}</div>
                            <small className="text-muted">${activePrice.toFixed(2)} each</small>
                          </div>
                          <Button
                            variant="link"
                            className="text-danger p-0 border-0"
                            onClick={() => handleRemoveItem(product._id)}
                          >
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>

            <div className="mt-3">
              <Button as={Link} to="/products" variant="link" className="text-primary text-decoration-none p-0 d-flex align-items-center gap-2">
                <FaArrowLeft /> Continue Shopping
              </Button>
            </div>
          </Col>

          {/* Cart Summary */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm p-4 rounded">
              <Card.Title className="fw-bold mb-4">Order Summary</Card.Title>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Estimated Tax (10%)</span>
                <span className="fw-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                <span className="text-muted">Shipping</span>
                <span className="fw-semibold">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold mb-0">Total</h5>
                <h5 className="fw-bold text-primary mb-0">${total.toFixed(2)}</h5>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="btn-primary-custom w-100 py-3 fs-5"
              >
                Proceed to Checkout
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartPage;
