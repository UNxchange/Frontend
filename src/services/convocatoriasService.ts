import getConvocatorias from './getConvocatorias';
import { ApplicationDetails } from '../types';

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
};
