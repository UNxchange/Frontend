/**
 * ⭐ Reviews Service
 * Servicio para gestionar reseñas de convocatorias
 * A través del API Gateway (v2.0)
 */

import { API_CONFIG } from '../config/api';
import { HttpClient } from '../utils/httpClient';

// ==========================================
// 📝 Interfaces TypeScript
// ==========================================

export interface Review {
  id: string;
  author_id: string;
  convocatoria_id: string;
  rating: number; // 1-5
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface ReviewCreateInput {
  convocatoria_id: string;
  rating: number; // 1-5
  content: string;
}

export interface ReviewUpdateInput {
  rating?: number;
  content?: string;
}

export interface ReviewListResponse {
  total: number;
  limit: number;
  skip: number;
  reviews: Review[];
}

export interface ReviewStatistics {
  convocatoria_id: string;
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    [key: number]: number; // número de estrellas -> cantidad de reviews
  };
  recent_reviews: Review[];
}

export interface ReviewFilters {
  convocatoria_id?: string;
  author_id?: string;
  min_rating?: number;
  max_rating?: number;
  limit?: number;
  skip?: number;
  sort_by?: 'created_at' | 'rating' | 'updated_at';
  sort_order?: 1 | -1; // 1 = ascendente, -1 = descendente
}

// ==========================================
// 🛠 Servicio de Reviews
// ==========================================

export class ReviewsService {
  /**
   * Obtener todas las reseñas con filtros opcionales
   */
  static async getReviews(filters?: ReviewFilters): Promise<ReviewListResponse> {
    try {
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `${API_CONFIG.ENDPOINTS.REVIEWS.LIST}?${queryString}`
        : API_CONFIG.ENDPOINTS.REVIEWS.LIST;
      
      console.log('Fetching reviews:', endpoint);
      
      const response = await HttpClient.request<ReviewListResponse>(endpoint, {
        method: 'GET',
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  /**
   * Obtener reseñas de una convocatoria específica
   */
  static async getReviewsByConvocatoria(
    convocatoriaId: string,
    options?: { limit?: number; skip?: number }
  ): Promise<ReviewListResponse> {
    return this.getReviews({
      convocatoria_id: convocatoriaId,
      sort_by: 'created_at',
      sort_order: -1, // más recientes primero
      ...options,
    });
  }

  /**
   * Obtener una reseña específica por ID
   */
  static async getReview(id: string): Promise<Review> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.REVIEWS.DETAIL(id);
      console.log('Fetching review:', endpoint);
      
      const response = await HttpClient.request<Review>(endpoint, {
        method: 'GET',
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error;
    }
  }

  /**
   * Crear nueva reseña
   */
  static async createReview(reviewData: ReviewCreateInput): Promise<Review> {
    try {
      // Validaciones
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error('La calificación debe estar entre 1 y 5 estrellas');
      }
      
      if (!reviewData.content || reviewData.content.trim().length === 0) {
        throw new Error('El contenido de la reseña no puede estar vacío');
      }
      
      if (reviewData.content.length < 10) {
        throw new Error('La reseña debe tener al menos 10 caracteres');
      }
      
      console.log('Creating review:', reviewData);
      
      const response = await HttpClient.request<Review>(
        API_CONFIG.ENDPOINTS.REVIEWS.CREATE,
        {
          method: 'POST',
          body: JSON.stringify(reviewData),
        }
      );
      
      console.log('Review created successfully:', response);
      return response;
    } catch (error) {
      console.error('Error creating review:', error);
      
      // Manejo específico de errores
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
          throw new Error('No tienes permisos para crear reseñas.');
        } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          throw new Error('Debes iniciar sesión para crear una reseña.');
        } else if (errorMessage.includes('409') || errorMessage.includes('Conflict')) {
          throw new Error('Ya has dejado una reseña para esta convocatoria.');
        } else if (errorMessage.includes('404')) {
          throw new Error('La convocatoria no existe.');
        } else if (errorMessage.includes('422')) {
          throw new Error('Los datos de la reseña no son válidos.');
        }
      }
      
      throw error;
    }
  }

  /**
   * Actualizar reseña existente
   */
  static async updateReview(id: string, updateData: ReviewUpdateInput): Promise<Review> {
    try {
      // Validaciones
      if (updateData.rating !== undefined) {
        if (updateData.rating < 1 || updateData.rating > 5) {
          throw new Error('La calificación debe estar entre 1 y 5 estrellas');
        }
      }
      
      if (updateData.content !== undefined) {
        if (updateData.content.trim().length === 0) {
          throw new Error('El contenido de la reseña no puede estar vacío');
        }
        
        if (updateData.content.length < 10) {
          throw new Error('La reseña debe tener al menos 10 caracteres');
        }
      }
      
      console.log('Updating review:', id, updateData);
      
      const endpoint = API_CONFIG.ENDPOINTS.REVIEWS.UPDATE(id);
      const response = await HttpClient.request<Review>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      console.log('Review updated successfully:', response);
      return response;
    } catch (error) {
      console.error('Error updating review:', error);
      
      // Manejo específico de errores
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
          throw new Error('Solo puedes editar tus propias reseñas.');
        } else if (errorMessage.includes('404')) {
          throw new Error('La reseña no existe.');
        }
      }
      
      throw error;
    }
  }

  /**
   * Eliminar reseña
   */
  static async deleteReview(id: string): Promise<void> {
    try {
      console.log('Deleting review:', id);
      
      const endpoint = API_CONFIG.ENDPOINTS.REVIEWS.DELETE(id);
      await HttpClient.request<void>(endpoint, {
        method: 'DELETE',
      });
      
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      
      // Manejo específico de errores
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
          throw new Error('Solo puedes eliminar tus propias reseñas.');
        } else if (errorMessage.includes('404')) {
          throw new Error('La reseña no existe.');
        }
      }
      
      throw error;
    }
  }

  /**
   * Obtener estadísticas de reseñas por convocatoria
   */
  static async getStatistics(convocatoriaId: string): Promise<ReviewStatistics> {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.REVIEWS.STATISTICS(convocatoriaId);
      console.log('Fetching review statistics:', endpoint);
      
      const response = await HttpClient.request<ReviewStatistics>(endpoint, {
        method: 'GET',
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching review statistics:', error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario puede editar/eliminar una reseña
   * (debe ser el autor o un administrador)
   */
  static canModifyReview(review: Review, userEmail: string, userRole?: string): boolean {
    // Los administradores pueden modificar cualquier reseña
    if (userRole === 'admin' || userRole === 'administrator') {
      return true;
    }
    
    // Los usuarios solo pueden modificar sus propias reseñas
    return review.author_id === userEmail;
  }

  /**
   * Calcular promedio de calificación de un array de reseñas
   */
  static calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // redondear a 1 decimal
  }

  /**
   * Obtener distribución de calificaciones de un array de reseñas
   */
  static getRatingDistribution(reviews: Review[]): { [key: number]: number } {
    const distribution: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    
    return distribution;
  }

  /**
   * Formatear fecha de creación/actualización
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `hace ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
      }
      return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
      return 'ayer';
    } else if (diffDays < 7) {
      return `hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `hace ${weeks} semana${weeks !== 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  }
}

// Exportar por defecto para compatibilidad
export default ReviewsService;
