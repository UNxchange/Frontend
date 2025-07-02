// Utilidades comunes del proyecto

import { Country } from '../types';

/**
 * Valida un email usando regex
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida que una contraseña sea segura
 */
export function isValidPassword(password: string): boolean {
    return password.length >= 8;
}

/**
 * Obtiene un elemento del DOM de forma type-safe
 */
export function getElement<T extends HTMLElement>(selector: string): T | null {
    return document.querySelector<T>(selector);
}

/**
 * Obtiene múltiples elementos del DOM de forma type-safe
 */
export function getElements<T extends HTMLElement>(selector: string): NodeListOf<T> {
    return document.querySelectorAll<T>(selector);
}

/**
 * Formatea una fecha para mostrar
 */
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Debounce function para optimizar eventos
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function(this: any, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Obtiene la URL de la bandera de un país
 */
export function getFlagUrl(countryCode: string): string {
    return `./assets/flags/${countryCode.toLowerCase()}.png`;
}

/**
 * Simula una llamada a API con delay
 */
export function mockApiCall<T>(data: T, delay: number = 1000): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), delay);
    });
}

/**
 * Manejo de errores para async functions
 */
export async function handleAsync<T>(
    promise: Promise<T>
): Promise<[T | null, Error | null]> {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        return [null, error as Error];
    }
}

/**
 * Clase para manejar el localStorage de forma type-safe
 */
export class LocalStorageManager {
    static setItem<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    static removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    static clear(): void {
        localStorage.clear();
    }
}
