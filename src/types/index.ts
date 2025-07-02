// Tipos globales para el proyecto

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'professional' | 'admin';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData extends LoginCredentials {
    name: string;
    confirmPassword: string;
}

export interface Convenio {
    id: string;
    title: string;
    description: string;
    country: string;
    flag: string;
    institution: string;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'inactive' | 'pending';
}

export interface Convocatoria {
    id: string;
    title: string;
    description: string;
    convenioId: string;
    deadline: Date;
    requirements: string[];
    benefits: string[];
    status: 'open' | 'closed' | 'draft';
}

export interface Country {
    code: string;
    name: string;
    flag: string;
}

// Tipos para eventos del DOM
export type EventHandler<T extends Event = Event> = (event: T) => void;

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Tipos para configuración
export interface AppConfig {
    apiUrl: string;
    environment: 'development' | 'production';
    version: string;
}
