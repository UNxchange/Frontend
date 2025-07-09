export const API_CONFIG = {
  // Auth service on Heroku
  AUTH_BASE_URL: 'https://unxchange-auth-backend-9208adf2339d.herokuapp.com',
  // Convocatorias service local
  CONVOCATORIAS_BASE_URL: 'http://127.0.0.1:8000',
  // Legacy BASE_URL for auth compatibility
  BASE_URL: 'https://unxchange-auth-backend-9208adf2339d.herokuapp.com',
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
  TOKEN_KEY: 'access_token',
  DEFAULT_REDIRECT: '/dashboard',
  LOGIN_PATH: '/login'
}
