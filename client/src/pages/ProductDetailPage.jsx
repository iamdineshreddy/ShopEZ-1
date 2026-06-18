import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Badge, Button, Form, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await productService.getProductById(id);
      setProduct(data || null);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleQtyChange = (val) => {
    if (val < 1 || val > product.stock) return;
    setQuantity(val);
  };

  const handleAddToCart = async () => {
    if (!user) {
      return toast.warning('Please log in to add items to your cart');
    }
    try {
      await addToCart(product._id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return toast.warning('Please enter a comment');

    setReviewLoading(true);
    try {
      await productService.addReview(product._id, { rating, comment });
      toast.success('Review added successfully!');
      setComment('');
      setRating(5);
      fetchProduct(); // reload product reviews
    } catch (error) {
      console.error('Add review error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>Product not found</h2>
        <Button as={Link} to="/products" className="btn-primary-custom mt-3">
          Back to Products
        </Button>
      </Container>
    );
  }

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Container className="py-5">
      <Row className="g-5 animate-fadeInUp">
        {/* Product Image */}
        <Col md={6}>
          <div className="product-image-container p-3 bg-white rounded shadow-sm text-center">
            <Image 
              src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/600x400?text=No+Image'} 
              alt={product.name}
              fluid 
              className="rounded"
              style={{ maxHeight: '450px', objectFit: 'contain', width: '100%' }}
            />
          </div>
        </Col>

        {/* Product Details */}
        <Col md={6}>
          <div className="product-info-section">
            <Badge bg="secondary" className="mb-2 fs-6 py-1 px-3">
              {product.category?.name || 'General'}
            </Badge>
            <h1 className="fw-bold mb-2">{product.name}</h1>
            
            <div className="d-flex align-items-center gap-2 mb-3">
              <StarRating rating={product.ratings} numReviews={product.numReviews} showCount={true} size={18} />
              <span className="text-muted">|</span>
              <span className="text-muted">Seller: {product.seller?.name || 'ShopEZ Seller'}</span>
            </div>

            {/* Price display */}
            <div className="d-flex align-items-center gap-3 mb-4">
              {product.discountPrice ? (
                <>
                  <h2 className="text-primary fw-bold mb-0">${product.discountPrice}</h2>
                  <h4 className="text-muted text-decoration-line-through mb-0">${product.price}</h4>
                  <Badge bg="danger" className="fs-6 py-1 px-2">
                    {discountPercent}% OFF
                  </Badge>
                </>
              ) : (
                <h2 className="text-primary fw-bold mb-0">${product.price}</h2>
              )}
            </div>

            <p className="text-muted mb-4 fs-5" style={{ whiteSpace: 'pre-wrap' }}>
              {product.description}
            </p>

            <div className="border-top border-bottom py-3 my-4">
              <Row className="align-items-center">
                <Col xs={4}>
                  <span className="fw-semibold text-muted">Availability:</span>
                </Col>
                <Col xs={8}>
                  {product.stock > 0 ? (
                    <Badge bg="success" className="fs-6 py-1 px-3">In Stock ({product.stock})</Badge>
                  ) : (
                    <Badge bg="danger" className="fs-6 py-1 px-3">Out Of Stock</Badge>
                  )}
                </Col>
              </Row>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {product.stock > 0 && (
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-semibold text-muted">Quantity:</span>
                  <div className="d-flex align-items-center border rounded">
                    <Button 
                      variant="light" 
                      onClick={() => handleQtyChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="border-0 bg-transparent py-1 px-3 font-weight-bold"
                    >
                      -
                    </Button>
                    <span className="px-3 fw-bold">{quantity}</span>
                    <Button 
                      variant="light" 
                      onClick={() => handleQtyChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="border-0 bg-transparent py-1 px-3 font-weight-bold"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleAddToCart} 
                  className="btn-primary-custom py-2 fs-5 d-flex align-items-center justify-content-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Reviews Section */}
      <Row className="mt-5 pt-4 animate-fadeInUp">
        <Col md={7}>
          <h3 className="fw-bold mb-4">Customer Reviews</h3>
          {product.reviews && product.reviews.length === 0 ? (
            <p className="text-muted">No reviews yet for this product. Be the first to review!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {product.reviews && product.reviews.map((rev) => (
                <Card key={rev._id} className="border-0 shadow-sm review-card p-3 rounded">
                  <Card.Body className="p-0">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            background: 'linear-gradient(45deg, var(--primary), var(--secondary))' 
                          }}
                        >
                          {rev.user?.name ? rev.user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{rev.user?.name || 'Anonymous User'}</h6>
                          <small className="text-muted">{new Date(rev.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                      <StarRating rating={rev.rating} showCount={false} />
                    </div>
                    <p className="text-muted mb-0">{rev.comment}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>

        {/* Add Review Form */}
        <Col md={5} className="mt-4 mt-md-0">
          <Card className="border-0 shadow-sm p-4 rounded">
            <h4 className="fw-bold mb-3">Add a Review</h4>
            {user ? (
              <Form onSubmit={handleReviewSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Rating</Form.Label>
                  <Form.Select 
                    value={rating} 
                    onChange={(e) => setRating(parseInt(e.target.value))}
                  >
                    <option value="5">5 Stars — Excellent</option>
                    <option value="4">4 Stars — Good</option>
                    <option value="3">3 Stars — Average</option>
                    <option value="2">2 Stars — Poor</option>
                    <option value="1">1 Star — Terrible</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Review Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Tell us what you liked or disliked about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  className="btn-primary-custom w-100 py-2 fw-semibold"
                  disabled={reviewLoading}
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Form>
            ) : (
              <div className="text-center py-3">
                <p className="text-muted">You must be logged in to post a review.</p>
                <Button as={Link} to="/login" variant="outline-primary">
                  Login Now
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
