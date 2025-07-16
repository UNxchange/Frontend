import getConvocatorias from './getConvocatorias';
import { ApplicationDetails, ConvocatoriaCreate, ConvocatoriaResponse } from '../types';
import { ApiClient } from '../utils/apiClient';

// Configuración del API
const CONVOCATORIAS_BASE_URL = (import.meta as any).env.VITE_CONVOCATORIAS_BASE_URL || 'http://localhost:8000';
const apiClient = new ApiClient(CONVOCATORIAS_BASE_URL);

export const ConvocatoriasService = {
    async getConvocatorias(): Promise<ApplicationDetails[]> {
        try {
            const data = await getConvocatorias();
            return data;
        } catch (error) {
            console.error('Error fetching convocatorias:', error);
            throw error;
        }
    },

    async getConvocatoriasMini(): Promise<ApplicationDetails[]> {
        const data = await this.getConvocatorias();
        return data.slice(0, 5);
    },

    async getConvocatoriasSmall(): Promise<ApplicationDetails[]> {
        const data = await this.getConvocatorias();
        return data.slice(0, 10);
    },

    async getConvocatoriasFull(): Promise<ApplicationDetails[]> {
        return await this.getConvocatorias();
    },

    // Crear nueva convocatoria
    async createConvocatoria(convocatoriaData: ConvocatoriaCreate): Promise<ConvocatoriaResponse> {
        try {
            // Debug: Verificar token antes de enviar
            const token = localStorage.getItem('access_token');
            console.log('Token disponible:', token ? 'SÍ' : 'NO');
            console.log('Datos a enviar:', convocatoriaData);
            
            const response = await apiClient.request<ConvocatoriaResponse>('convocatorias/', {
                method: 'POST',
                body: JSON.stringify(convocatoriaData),
                requiresAuth: true,
                withCredentials: true
            });
            
            console.log('Convocatoria creada exitosamente:', response);
            return response;
        } catch (error) {
            console.error('Error creating convocatoria:', error);
            
            // Manejo específico de errores
            if (error instanceof Error) {
                // Si el error contiene información de respuesta HTTP
                const errorMessage = error.message;
                
                if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
                    throw new Error('No tienes permisos para crear convocatorias. Verifica que estés autenticado.');
                } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                    throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                } else if (errorMessage.includes('422')) {
                    throw new Error('Los datos enviados no son válidos. Verifica todos los campos.');
                } else if (errorMessage.includes('500')) {
                    throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
                } else {
                    throw new Error(errorMessage || 'Error al crear la convocatoria');
                }
            }
            
            throw new Error('Error inesperado al crear la convocatoria');
        }
    },
};
