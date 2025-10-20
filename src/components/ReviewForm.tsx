/**
 * ⭐ Formulario para Crear/Editar Reseña
 */

import React, { useState, useEffect } from 'react';
import { ReviewCreateInput, ReviewUpdateInput } from '../services/reviewsService';
import StarRating from '../atoms/StarRating';
import Button from '../atoms/Button';
import './styles/ReviewForm.css';

interface ReviewFormProps {
  convocatoriaId: string;
  initialData?: {
    rating: number;
    content: string;
  };
  onSubmit: (data: ReviewCreateInput | ReviewUpdateInput) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  convocatoriaId,
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [rating, setRating] = useState<number>(initialData?.rating || 0);
  const [content, setContent] = useState<string>(initialData?.content || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating);
      setContent(initialData.content);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    if (rating === 0) {
      setError('Por favor, selecciona una calificación');
      return false;
    }

    if (!content.trim()) {
      setError('Por favor, escribe tu reseña');
      return false;
    }

    if (content.trim().length < 10) {
      setError('La reseña debe tener al menos 10 caracteres');
      return false;
    }

    if (content.length > 2000) {
      setError('La reseña no puede exceder 2000 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = isEdit
        ? { rating, content }
        : { convocatoria_id: convocatoriaId, rating, content };

      await onSubmit(data);

      // Limpiar formulario si es creación exitosa
      if (!isEdit) {
        setRating(0);
        setContent('');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al guardar la reseña. Intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = content.length;
  const characterLimit = 2000;
  const isNearLimit = characterCount > characterLimit * 0.9;

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">
        {isEdit ? 'Editar Reseña' : 'Escribe tu Reseña'}
      </h3>

      {error && (
        <div className="review-form__error" role="alert">
          ⚠️ {error}
        </div>
      )}

      <div className="review-form__field">
        <label className="review-form__label">
          Calificación <span className="review-form__required">*</span>
        </label>
        <StarRating
          rating={rating}
          onChange={setRating}
          size="large"
          showLabel
        />
        <p className="review-form__hint">
          Selecciona de 1 a 5 estrellas según tu experiencia
        </p>
      </div>

      <div className="review-form__field">
        <label className="review-form__label" htmlFor="review-content">
          Tu Reseña <span className="review-form__required">*</span>
        </label>
        <textarea
          id="review-content"
          className="review-form__textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comparte tu experiencia con esta convocatoria..."
          rows={6}
          maxLength={characterLimit}
          disabled={isSubmitting}
        />
        <div className="review-form__character-count">
          <span className={isNearLimit ? 'review-form__character-count--warning' : ''}>
            {characterCount} / {characterLimit} caracteres
          </span>
        </div>
        <p className="review-form__hint">
          Mínimo 10 caracteres. Sé específico y constructivo.
        </p>
      </div>

      <div className="review-form__actions">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || rating === 0 || !content.trim()}
        >
          {isSubmitting
            ? (isEdit ? 'Guardando...' : 'Publicando...')
            : (isEdit ? 'Guardar Cambios' : 'Publicar Reseña')}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
