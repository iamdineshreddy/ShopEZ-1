import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found d-flex align-items-center justify-content-center text-center py-5">
      <Container className="animate-fadeInUp">
        <h1 className="display-1 fw-bold mb-3 text-gradient" style={{ fontSize: '8rem' }}>404</h1>
        <h2 className="fw-bold mb-3">Oops! Page not found</h2>
        <p className="text-muted fs-5 mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button as={Link} to="/" className="btn-primary-custom px-4 py-2 fs-5">
          Back to Home
        </Button>
      </Container>
    </div>
  );
};

export default NotFoundPage;
