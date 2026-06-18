import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingBag, FaShoppingCart, FaUser, FaSignOutAlt, FaStore, FaCog, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" fixed="top" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FaShoppingBag className="me-2" />
          ShopEZ
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <span style={{ color: 'white', fontSize: '1.2rem' }}>☰</span>
        </Navbar.Toggle>

        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
          </Nav>

          <Nav className="align-items-center">
            {user ? (
              <>
                {/* Cart Icon */}
                <Nav.Link as={Link} to="/cart" className="position-relative me-2">
                  <FaShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="navbar-cart-badge">{cartCount}</span>
                  )}
                </Nav.Link>

                {/* Orders */}
                <Nav.Link as={Link} to="/orders">
                  <FaClipboardList size={16} className="me-1" /> Orders
                </Nav.Link>

                {/* Seller Dashboard */}
                {user.role === 'seller' && (
                  <Nav.Link as={Link} to="/seller/dashboard">
                    <FaStore size={16} className="me-1" /> Seller
                  </Nav.Link>
                )}

                {/* Admin Dashboard */}
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin/dashboard">
                    <FaCog size={16} className="me-1" /> Admin
                  </Nav.Link>
                )}

                {/* User Dropdown */}
                <NavDropdown
                  title={
                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>
                      <FaUser size={14} className="me-1" />
                      {user.name?.split(' ')[0]}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <FaUser className="me-2" /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                <Link to="/register" className="btn btn-primary-custom btn-sm">
                  Register
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
