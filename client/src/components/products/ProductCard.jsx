import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import StarRating from '../common/StarRating';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <Card
      className="product-card cursor-pointer"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="product-card-img-wrapper">
        {hasDiscount && (
          <span className="discount-badge">-{discountPercent}%</span>
        )}
        {product.featured && (
          <span className="featured-badge">★ Featured</span>
        )}
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={product.name}
          loading="lazy"
        />
      </div>

      <Card.Body className="product-card-body">
        <div className="mb-1">
          <small className="text-muted">
            {product.category?.name || 'Uncategorized'}
          </small>
        </div>

        <h6 className="product-card-title">{product.name}</h6>

        <StarRating
          rating={product.ratings}
          numReviews={product.numReviews}
          size={12}
        />

        <div className="price-wrapper d-flex align-items-center justify-content-between">
          <div>
            <span className="price-current">
              ${hasDiscount ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="price-original">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>

        <Button
          size="sm"
          className="btn-primary-custom w-100 mt-2 justify-content-center"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{ padding: '0.5rem', fontSize: '0.85rem' }}
        >
          <FaShoppingCart size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
