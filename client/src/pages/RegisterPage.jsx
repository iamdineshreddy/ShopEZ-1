import React, { useState } from 'react';
import { Container, Form, Button, Card, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaUser, FaEnvelope, FaLock, FaStore } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'seller'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validations
    if (!name || !email || !password || !confirmPassword) {
      return toast.warning('Please fill in all fields');
    }
    if (password.length < 6) {
      return toast.warning('Password must be at least 6 characters long');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await register({ name, email, password, role });
      toast.success('Registration successful! Welcome to ShopEZ!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center py-5">
      <Card className="auth-card p-4 shadow-lg border-0 animate-fadeInUp" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <div className="brand-logo mb-2 text-primary" style={{ fontSize: '3rem' }}>
              <FaShoppingBag />
            </div>
            <h2 className="fw-bold">Create an Account</h2>
            <p className="text-muted">Join ShopEZ today to buy or sell products</p>
          </div>

          <Form onSubmit={handleSubmit}>
            {/* Role Selector styled as clickable cards */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Register as:</Form.Label>
              <Row className="g-3">
                <Col xs={6}>
                  <Card 
                    className={`text-center p-3 cursor-pointer border-2 role-card ${role === 'user' ? 'border-primary bg-light-primary text-primary' : 'border-light'}`}
                    onClick={() => setRole('user')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fs-3 mb-2"><FaUser /></div>
                    <div className="fw-bold">Buyer</div>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card 
                    className={`text-center p-3 cursor-pointer border-2 role-card ${role === 'seller' ? 'border-primary bg-light-primary text-primary' : 'border-light'}`}
                    onClick={() => setRole('seller')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fs-3 mb-2"><FaStore /></div>
                    <div className="fw-bold">Seller</div>
                  </Card>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Full Name</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-end-0">
                  <FaUser className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-start-0"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-end-0">
                  <FaEnvelope className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-start-0"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-end-0">
                  <FaLock className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-start-0"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-end-0">
                  <FaLock className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-start-0"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="btn-primary-custom w-100 py-2 fs-5 mb-3"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p className="mb-0 text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Login here
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterPage;
