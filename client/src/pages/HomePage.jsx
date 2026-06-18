import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaLaptop, 
  FaTshirt, 
  FaHome, 
  FaBook, 
  FaFootballBall, 
  FaSpa, 
  FaTruck, 
  FaShieldAlt, 
  FaHeadset 
} from 'react-icons/fa';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await productService.getFeaturedProducts();
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        toast.error('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const categories = [
    { name: 'Electronics', icon: <FaLaptop />, key: 'electronics' },
    { name: 'Fashion', icon: <FaTshirt />, key: 'fashion' },
    { name: 'Home & Kitchen', icon: <FaHome />, key: 'home' },
    { name: 'Books', icon: <FaBook />, key: 'books' },
    { name: 'Sports', icon: <FaFootballBall />, key: 'sports' },
    { name: 'Beauty', icon: <FaSpa />, key: 'beauty' }
  ];

  const handleCategoryClick = (categoryKey) => {
    navigate(`/products?category=${categoryKey}`);
  };

  return (
    <div className="homepage-wrapper">
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center animate-fadeInUp">
        <Container>
          <h1 className="display-3 fw-bold mb-3">Shop Smarter with ShopEZ</h1>
          <p className="lead mb-4 fs-4">Your one-stop destination for effortless online shopping and selling.</p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/products" className="btn-primary-custom px-4 py-2 fs-5">
              Shop Now
            </Button>
            <Button as={Link} to="/register" variant="outline-light" className="px-4 py-2 fs-5">
              Sell on ShopEZ
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured Categories */}
      <section className="py-5 animate-fadeInUp">
        <Container>
          <h2 className="text-center mb-4 fw-bold">Featured Categories</h2>
          <Row className="g-4">
            {categories.map((cat, idx) => (
              <Col key={idx} xs={6} md={4} lg={2}>
                <Card 
                  className="h-100 text-center border-0 shadow-sm category-card cursor-pointer"
                  onClick={() => handleCategoryClick(cat.name)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                >
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="fs-1 text-primary mb-3">{cat.icon}</div>
                    <Card.Title className="fs-6 fw-semibold mb-0">{cat.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-light animate-fadeInUp">
        <Container>
          <h2 className="text-center mb-4 fw-bold">Featured Products</h2>
          {loading ? (
            <Loader />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center text-muted">No featured products found.</div>
          ) : (
            <Row className="g-4">
              {featuredProducts.map((product) => (
                <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Why Choose ShopEZ */}
      <section className="py-5 animate-fadeInUp">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Why Choose ShopEZ?</h2>
          <Row className="g-4 text-center">
            <Col md={4}>
              <div className="mb-3 fs-1 text-primary">
                <FaTruck />
              </div>
              <h4>Fast Delivery</h4>
              <p className="text-muted">Get your products delivered to your doorstep in no time, with real-time tracking.</p>
            </Col>
            <Col md={4}>
              <div className="mb-3 fs-1 text-primary">
                <FaShieldAlt />
              </div>
              <h4>Secure Payments</h4>
              <p className="text-muted">Shop with peace of mind using our highly secure and encrypted simulated payment flow.</p>
            </Col>
            <Col md={4}>
              <div className="mb-3 fs-1 text-primary">
                <FaHeadset />
              </div>
              <h4>24/7 Support</h4>
              <p className="text-muted">Our dedicated customer support team is always here to assist you with any questions.</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
