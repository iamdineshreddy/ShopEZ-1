import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, numReviews, showCount = true, size = 14 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="star-filled" size={size} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="star-filled" size={size} />);
    } else {
      stars.push(<FaRegStar key={i} className="star-empty" size={size} />);
    }
  }

  return (
    <span className="star-rating">
      {stars}
      {showCount && numReviews !== undefined && (
        <span className="rating-count">({numReviews})</span>
      )}
    </span>
  );
};

export default StarRating;
