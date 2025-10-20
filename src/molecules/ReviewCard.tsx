/**
 * ⭐ Componente de Tarjeta de Reseña
 * Muestra una reseña individual con rating, contenido, autor y fecha
 */

import React, { useState } from 'react';
import { Review } from '../services/reviewsService';
import StarRating from '../atoms/StarRating';
import './styles/ReviewCard.css';

interface ReviewCardProps {
  review: Review;
  canModify?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  canModify = false,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      setIsDeleting(true);
      try {
        if (onDelete) {
          await onDelete(review.id);
        }
      } catch (error) {
        console.error('Error al eliminar reseña:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__author-info">
          <div className="review-card__author-avatar">
            {review.author_id.charAt(0).toUpperCase()}
          </div>
          <div className="review-card__author-details">
            <h4 className="review-card__author-name">{review.author_id}</h4>
            <p className="review-card__date">
              {formatDate(review.created_at)}
              {review.updated_at && review.updated_at !== review.created_at && (
                <span className="review-card__edited"> (editado)</span>
              )}
            </p>
          </div>
        </div>

        <div className="review-card__actions">
          <StarRating rating={review.rating} readOnly size="small" />
          
          {canModify && (
            <div className="review-card__menu">
              <button
                className="review-card__menu-button"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Opciones"
              >
                ⋮
              </button>
              {showMenu && (
                <div className="review-card__menu-dropdown">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (onEdit) onEdit(review);
                    }}
                    className="review-card__menu-item"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                    className="review-card__menu-item review-card__menu-item--danger"
                    disabled={isDeleting}
                  >
                    🗑️ {isDeleting ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="review-card__content">
        <p>{review.content}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
