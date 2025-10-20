/**
 * ⭐ Componente de Estadísticas de Reseñas
 * Muestra estadísticas agregadas y distribución de calificaciones
 */

import React, { useState, useEffect } from 'react';
import { ReviewsService, ReviewStatistics } from '../services/reviewsService';
import StarRating from '../atoms/StarRating';
import './styles/ReviewStatistics.css';

interface ReviewStatisticsProps {
  convocatoriaId: string;
  compact?: boolean; // Modo compacto para mostrar solo lo esencial
}

export const ReviewStatisticsComponent: React.FC<ReviewStatisticsProps> = ({
  convocatoriaId,
  compact = false,
}) => {
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStatistics();
  }, [convocatoriaId]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const stats = await ReviewsService.getStatistics(convocatoriaId);
      setStatistics(stats);
      setError('');
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`review-statistics ${compact ? 'review-statistics--compact' : ''}`}>
        <div className="review-statistics__loading">
          <div className="review-statistics__spinner" />
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className={`review-statistics ${compact ? 'review-statistics--compact' : ''}`}>
        <div className="review-statistics__error">
          {error || 'No hay estadísticas disponibles'}
        </div>
      </div>
    );
  }

  if (statistics.total_reviews === 0) {
    return (
      <div className={`review-statistics ${compact ? 'review-statistics--compact' : ''}`}>
        <div className="review-statistics__empty">
          <p>Sin calificaciones aún</p>
        </div>
      </div>
    );
  }

  // Modo compacto: solo muestra rating y total
  if (compact) {
    return (
      <div className="review-statistics review-statistics--compact">
        <div className="review-statistics__compact-content">
          <StarRating rating={statistics.average_rating} readOnly size="small" />
          <span className="review-statistics__compact-rating">
            {statistics.average_rating.toFixed(1)}
          </span>
          <span className="review-statistics__compact-count">
            ({statistics.total_reviews})
          </span>
        </div>
      </div>
    );
  }

  // Modo completo: muestra distribución
  return (
    <div className="review-statistics">
      <div className="review-statistics__header">
        <h3 className="review-statistics__title">Calificaciones</h3>
      </div>

      <div className="review-statistics__overall">
        <div className="review-statistics__overall-rating">
          <span className="review-statistics__rating-number">
            {statistics.average_rating.toFixed(1)}
          </span>
          <div className="review-statistics__stars-wrapper">
            <StarRating rating={statistics.average_rating} readOnly size="medium" />
          </div>
        </div>
        <p className="review-statistics__total">
          Basado en {statistics.total_reviews} reseña
          {statistics.total_reviews !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="review-statistics__distribution">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = statistics.rating_distribution[rating] || 0;
          const percentage =
            statistics.total_reviews > 0
              ? (count / statistics.total_reviews) * 100
              : 0;

          return (
            <div key={rating} className="review-statistics__bar-row">
              <span className="review-statistics__bar-label">{rating} ★</span>
              <div className="review-statistics__bar-container">
                <div
                  className="review-statistics__bar-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getRatingColor(rating),
                  }}
                />
              </div>
              <span className="review-statistics__bar-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper para obtener color según rating
const getRatingColor = (rating: number): string => {
  const colors: Record<number, string> = {
    5: '#10B981', // Verde
    4: '#59C9A5', // Verde claro
    3: '#F59E0B', // Amarillo/Naranja
    2: '#F97316', // Naranja
    1: '#EF4444', // Rojo
  };
  return colors[rating] || '#9CA3AF';
};

export default ReviewStatisticsComponent;
