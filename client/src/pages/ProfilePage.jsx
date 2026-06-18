import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit, FaTimes, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Populate form with current user info
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress({
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      });
    }
  }, [user, isEditing]);

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authService.updateProfile({ name, phone, address });
      updateUser(data.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader />;

  return (
    <Container className="py-5">
      {/* Page Header */}
      <div className="page-header d-flex align-items-center mb-4 p-4 rounded bg-gradient-primary text-white shadow animate-fadeInUp">
        <h1 className="fw-bold mb-0">My Profile</h1>
      </div>

      <Row className="g-4 animate-fadeInUp">
        {/* Left Card: Info Summary */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm text-center p-4 rounded h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <div 
                className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold mb-3 shadow"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  fontSize: '3.5rem',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))' 
                }}
              >
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <h3 className="fw-bold mb-1">{user.name}</h3>
              <p className="text-muted mb-3">{user.email}</p>
              <Badge 
                bg={user.role === 'admin' ? 'danger' : user.role === 'seller' ? 'warning text-dark' : 'success'} 
                className="fs-6 py-1 px-3 mb-3 text-uppercase"
              >
                {user.role}
              </Badge>
              <div className="text-muted d-flex align-items-center gap-2 mt-2 fs-7">
                <FaCalendarAlt /> Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Card: Details Form */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm p-4 rounded">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h4 className="fw-bold mb-0">Account Details</h4>
              {!isEditing ? (
                <Button 
                  variant="outline-primary" 
                  onClick={() => setIsEditing(true)}
                  className="d-flex align-items-center gap-2"
                >
                  <FaEdit /> Edit Profile
                </Button>
              ) : (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setIsEditing(false)}
                  className="d-flex align-items-center gap-2"
                >
                  <FaTimes /> Cancel
                </Button>
              )}
            </div>

            <Form onSubmit={handleSubmit}>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label className="fw-semibold text-muted">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="phone">
                    <Form.Label className="fw-semibold text-muted">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h5 className="fw-bold mt-4 mb-3 text-secondary">Address Information</h5>
              <Form.Group className="mb-3" controlId="street">
                <Form.Label className="fw-semibold text-muted">Street Address</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="123 Main St"
                />
              </Form.Group>

              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId="city">
                    <Form.Label className="fw-semibold text-muted">City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      disabled={!isEditing}
                      placeholder="New York"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="state">
                    <Form.Label className="fw-semibold text-muted">State / Province</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      disabled={!isEditing}
                      placeholder="NY"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Form.Group controlId="zipCode">
                    <Form.Label className="fw-semibold text-muted">Zip / Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      disabled={!isEditing}
                      placeholder="10001"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="country">
                    <Form.Label className="fw-semibold text-muted">Country</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      disabled={!isEditing}
                      placeholder="United States"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {isEditing && (
                <Button 
                  type="submit" 
                  className="btn-primary-custom d-flex align-items-center gap-2"
                  disabled={loading}
                >
                  <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
