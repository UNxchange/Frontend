/**
 * ⭐ Componente de Calificación con Estrellas
 * Muestra y permite seleccionar rating de 1-5 estrellas
 */

import React from 'react';
import '../styles/StarRating.css';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  readOnly = false,
  size = 'medium',
  showLabel = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number>(0);

  const handleClick = (value: number) => {
    if (!readOnly && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readOnly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`star-rating star-rating--${size}`}>
      <div className="star-rating__stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className={`star-rating__star ${
              value <= displayRating ? 'star-rating__star--filled' : 'star-rating__star--empty'
            } ${!readOnly ? 'star-rating__star--interactive' : ''}`}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            aria-label={`${value} estrella${value !== 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
      {showLabel && (
        <span className="star-rating__label">
          {rating > 0 ? `${rating.toFixed(1)} / 5.0` : 'Sin calificación'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
