/**
 * ⭐ Componente de Lista de Reseñas
 * Muestra lista completa de reseñas con paginación y filtros
 */

import React, { useState, useEffect } from 'react';
import { ReviewsService, Review, ReviewStatistics } from '../services/reviewsService';
import { AuthService } from '../services/authService';
import ReviewCard from '../molecules/ReviewCard';
import ReviewForm from './ReviewForm';
import StarRating from '../atoms/StarRating';
import Button from '../atoms/Button';
import './styles/ReviewsList.css';

interface ReviewsListProps {
  convocatoriaId: string;
  showCreateForm?: boolean;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  convocatoriaId,
  showCreateForm = true,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadReviews();
    loadStatistics();
    loadCurrentUser();
  }, [convocatoriaId]);

  const loadCurrentUser = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await ReviewsService.getReviewsByConvocatoria(convocatoriaId, {
        limit: 100,
        skip: 0,
      });
      setReviews(response.reviews);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await ReviewsService.getStatistics(convocatoriaId);
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleCreateReview = async (data: any) => {
    try {
      await ReviewsService.createReview(data);
      await loadReviews();
      await loadStatistics();
    } catch (error) {
      throw error;
    }
  };

  const handleEditReview = async (data: any) => {
    if (!editingReview) return;

    try {
      await ReviewsService.updateReview(editingReview.id, data);
      setEditingReview(null);
      await loadReviews();
      await loadStatistics();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await ReviewsService.deleteReview(reviewId);
      await loadReviews();
      await loadStatistics();
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };

  const canModifyReview = (review: Review): boolean => {
    if (!currentUser) return false;
    return ReviewsService.canModifyReview(
      review,
      currentUser.email,
      currentUser.role
    );
  };

  if (loading) {
    return (
      <div className="reviews-list">
        <div className="reviews-list__loading">
          <div className="reviews-list__spinner" />
          <p>Cargando reseñas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      {/* Estadísticas */}
      {statistics && statistics.total_reviews > 0 && (
        <div className="reviews-list__statistics">
          <div className="reviews-list__stats-header">
            <h3>Calificación General</h3>
            <div className="reviews-list__overall-rating">
              <span className="reviews-list__rating-number">
                {statistics.average_rating.toFixed(1)}
              </span>
              <StarRating rating={statistics.average_rating} readOnly size="large" />
              <span className="reviews-list__total-reviews">
                ({statistics.total_reviews} reseña{statistics.total_reviews !== 1 ? 's' : ''})
              </span>
            </div>
          </div>

          {/* Distribución de ratings */}
          <div className="reviews-list__distribution">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = statistics.rating_distribution[rating] || 0;
              const percentage =
                statistics.total_reviews > 0
                  ? (count / statistics.total_reviews) * 100
                  : 0;

              return (
                <div key={rating} className="reviews-list__distribution-row">
                  <span className="reviews-list__distribution-label">
                    {rating} ★
                  </span>
                  <div className="reviews-list__distribution-bar">
                    <div
                      className="reviews-list__distribution-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="reviews-list__distribution-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Formulario de creación */}
      {showCreateForm && currentUser && !editingReview && (
        <div className="reviews-list__create-form">
          <ReviewForm
            convocatoriaId={convocatoriaId}
            onSubmit={handleCreateReview}
          />
        </div>
      )}

      {/* Formulario de edición */}
      {editingReview && (
        <div className="reviews-list__edit-form">
          <ReviewForm
            convocatoriaId={convocatoriaId}
            initialData={{
              rating: editingReview.rating,
              content: editingReview.content,
            }}
            onSubmit={handleEditReview}
            onCancel={() => setEditingReview(null)}
            isEdit
          />
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="reviews-list__items">
        <h3 className="reviews-list__items-title">
          {reviews.length > 0 ? `Reseñas (${reviews.length})` : 'Sin reseñas aún'}
        </h3>

        {error && (
          <div className="reviews-list__error">
            ⚠️ {error}
            <Button onClick={loadReviews} variant="secondary">
              Reintentar
            </Button>
          </div>
        )}

        {reviews.length === 0 && !error && (
          <div className="reviews-list__empty">
            <p>Aún no hay reseñas para esta convocatoria.</p>
            {currentUser && (
              <p>¡Sé el primero en compartir tu experiencia!</p>
            )}
          </div>
        )}

        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            canModify={canModifyReview(review)}
            onEdit={setEditingReview}
            onDelete={handleDeleteReview}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
