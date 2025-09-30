export const API_CONFIG = {
  // Auth service - Using environment variable with proxy fallback for containers
  AUTH_BASE_URL: (import.meta as any).env.VITE_AUTH_BASE_URL || 
                 (window.location.hostname === 'localhost' && window.location.port === '3000' ? 
                  'http://localhost:3000' : 'http://localhost:8000'),
  // Convocatorias service - Using environment variable with proxy fallback for containers  
  CONVOCATORIAS_BASE_URL: (import.meta as any).env.VITE_CONVOCATORIAS_BASE_URL || 
                          (window.location.hostname === 'localhost' && window.location.port === '3000' ? 
                           'http://localhost:3000' : 'http://localhost:8008'),
  // Legacy BASE_URL for auth compatibility
  BASE_URL: (import.meta as any).env.VITE_AUTH_BASE_URL || 
           (window.location.hostname === 'localhost' && window.location.port === '3000' ? 
            'http://localhost:3000' : 'http://localhost:8000'),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      USERS: '/api/v1/auth/users',
      USER_BY_EMAIL: '/api/v1/auth/user',
      ME: '/api/v1/auth/me'
    },
    CONVENIOS: {
      LIST: '/api/v1/convenios',
      DETAIL: (id: string | number) => `/api/v1/convenios/${id}`,
      CREATE: '/api/v1/convenios',
      UPDATE: (id: string | number) => `/api/v1/convenios/${id}`,
      DELETE: (id: string | number) => `/api/v1/convenios/${id}`
    },
    CONVOCATORIAS: {
      LIST: '/convocatorias',
      DETAIL: (id: string | number) => `/convocatorias/${id}`,
      CREATE: '/convocatorias',
      UPDATE: (id: string | number) => `/convocatorias/${id}`,
      DELETE: (id: string | number) => `/convocatorias/${id}`
    }
  }
}

export const APP_CONFIG = {
  TOKEN_KEY: (import.meta as any).env.VITE_TOKEN_KEY || 'access_token',
  DEFAULT_REDIRECT: (import.meta as any).env.VITE_DEFAULT_REDIRECT || '/dashboard',
  LOGIN_PATH: (import.meta as any).env.VITE_LOGIN_PATH || '/login'
}
