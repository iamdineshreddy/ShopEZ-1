import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaShoppingBag } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <h5>
              <FaShoppingBag className="me-2" />
              ShopEZ
            </h5>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
              Your one-stop destination for effortless online shopping. Discover amazing
              products at the best prices with fast delivery and secure checkout.
            </p>
            <div className="social-icons mt-3">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h5>Quick Links</h5>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/products" className="footer-link">Products</Link>
            <Link to="/cart" className="footer-link">Cart</Link>
            <Link to="/orders" className="footer-link">My Orders</Link>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h5>Customer Service</h5>
            <Link to="#" className="footer-link">Help Center</Link>
            <Link to="#" className="footer-link">Shipping & Delivery</Link>
            <Link to="#" className="footer-link">Returns & Refunds</Link>
            <Link to="#" className="footer-link">Privacy Policy</Link>
            <Link to="#" className="footer-link">Terms of Service</Link>
          </Col>

          <Col lg={3} md={6} className="mb-4">
            <h5>Contact Us</h5>
            <p className="footer-link">📧 support@shopez.com</p>
            <p className="footer-link">📞 +1 (555) 123-4567</p>
            <p className="footer-link">📍 123 Commerce St, Tech City</p>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p className="mb-0">
            © {new Date().getFullYear()} ShopEZ. All rights reserved. Made with ❤️
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
