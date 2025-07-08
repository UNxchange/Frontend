export const API_CONFIG = {
  BASE_URL: 'https://unxchange-auth-backend-9208adf2339d.herokuapp.com',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      USERS: '/api/v1/auth/users',
      USER_BY_EMAIL: '/api/v1/auth/user'
    },
    CONVENIOS: {
      LIST: '/api/v1/convenios',
      DETAIL: (id: string | number) => `/api/v1/convenios/${id}`,
      CREATE: '/api/v1/convenios',
      UPDATE: (id: string | number) => `/api/v1/convenios/${id}`,
      DELETE: (id: string | number) => `/api/v1/convenios/${id}`
    }
  }
}

export const APP_CONFIG = {
  TOKEN_KEY: 'access_token',
  DEFAULT_REDIRECT: '/dashboard',
  LOGIN_PATH: '/login'
}
