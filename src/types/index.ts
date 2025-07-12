// Tipos globales para el proyecto

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'estudiante' | 'profesional' | 'administrador' | 'coordinator' | 'guest';
}

export interface MenuItem {
    id: string;
    label: string;
    path: string;
    icon?: string;
    roles: string[];
    isActive?: boolean;
    subItems?: MenuItem[];
}

export interface NavigationConfig {
    menuItems: MenuItem[];
    userMenuItems: MenuItem[];
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

export interface ApplicationDetails {
    id: string;
    subscriptionYear: string;
    country: string;
    institution: string;
    agreementType: string;
    validity: string;
    state: string;
    subscriptionLevel: string;
    languages: string[];
    dreLink: string;
    agreementLink: string;
    properties: string;
    internationalLink: string;
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
