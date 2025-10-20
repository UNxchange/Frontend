// ==========================================
// 🚀 API Gateway Configuration (v2.0)
// ==========================================
// Todas las peticiones ahora pasan por el API Gateway (puerto 8080)
// El gateway se encarga de enrutar a los servicios backend correspondientes

const getAPIGatewayURL = () => {
  // Usar variable de entorno si está disponible
  const envURL = (import.meta as any).env.VITE_API_GATEWAY_URL;
  if (envURL) return envURL;
  
  // En producción a través de Nginx
  if (window.location.hostname === 'localhost' && window.location.port === '80') {
    return 'http://localhost';
  }
  
  // En desarrollo directo al API Gateway
  return 'http://localhost:8080';
};

export const API_CONFIG = {
  // 🌐 API Gateway - Punto de entrada único
  API_GATEWAY_URL: getAPIGatewayURL(),
  
  // Base URL para todos los servicios (a través del gateway)
  BASE_URL: getAPIGatewayURL(),
  
  // URLs legacy por compatibilidad (ahora apuntan al gateway)
  AUTH_BASE_URL: getAPIGatewayURL(),
  CONVOCATORIAS_BASE_URL: getAPIGatewayURL(),
  NOTIFICATIONS_BASE_URL: getAPIGatewayURL(),
  REVIEWS_BASE_URL: getAPIGatewayURL(),
  
  // 📍 Endpoints de servicios (todos a través del API Gateway)
  ENDPOINTS: {
    // 🔐 Auth & Roles Service
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      USERS: '/api/v1/auth/users',
      USER_BY_ID: (id: string | number) => `/api/v1/auth/users/${id}`,
      USER_BY_EMAIL: '/api/v1/auth/user',
      ME: '/api/v1/auth/me',
      UPDATE: (id: string | number) => `/api/v1/auth/users/${id}`,
      DELETE: (id: string | number) => `/api/v1/auth/users/${id}`
    },
    
    // 📚 Convocatorias Service (⚠️ Path actualizado: /convenios → /api/v1/convocatorias)
    CONVOCATORIAS: {
      LIST: '/api/v1/convocatorias',
      DETAIL: (id: string | number) => `/api/v1/convocatorias/${id}`,
      CREATE: '/api/v1/convocatorias',
      UPDATE: (id: string | number) => `/api/v1/convocatorias/${id}`,
      DELETE: (id: string | number) => `/api/v1/convocatorias/${id}`,
      SEARCH: '/api/v1/convocatorias/search'
    },
    
    // 📚 Convenios (alias legacy para compatibilidad - apunta a convocatorias)
    CONVENIOS: {
      LIST: '/api/v1/convocatorias',
      DETAIL: (id: string | number) => `/api/v1/convocatorias/${id}`,
      CREATE: '/api/v1/convocatorias',
      UPDATE: (id: string | number) => `/api/v1/convocatorias/${id}`,
      DELETE: (id: string | number) => `/api/v1/convocatorias/${id}`
    },
    
    // 📬 Notifications Service
    NOTIFICATIONS: {
      BASE: '/api/v1/notification',
      LIST: '/api/v1/notification',
      CREATE: '/api/v1/notification',
      DETAIL: (id: string | number) => `/api/v1/notification/${id}`,
      UPDATE: (id: string | number) => `/api/v1/notification/${id}`,
      DELETE: (id: string | number) => `/api/v1/notification/${id}`,
      MARK_READ: (id: string | number) => `/api/v1/notification/${id}/read`,
      MARK_ALL_READ: '/api/v1/notification/read-all',
      GRAPHQL: '/api/v1/notification/graphql'
    },
    
    // ⭐ Reviews Service (✨ NUEVO)
    REVIEWS: {
      BASE: '/api/v1/reviews',
      LIST: '/api/v1/reviews',
      CREATE: '/api/v1/reviews',
      DETAIL: (id: string | number) => `/api/v1/reviews/${id}`,
      UPDATE: (id: string | number) => `/api/v1/reviews/${id}`,
      DELETE: (id: string | number) => `/api/v1/reviews/${id}`,
      BY_CONVOCATORIA: (convocatoriaId: string | number) => 
        `/api/v1/reviews?convocatoria_id=${convocatoriaId}`,
      STATISTICS: (convocatoriaId: string | number) => 
        `/api/v1/reviews/convocatoria/${convocatoriaId}/statistics`
    }
  }
}

export const APP_CONFIG = {
  TOKEN_KEY: (import.meta as any).env.VITE_TOKEN_KEY || 'access_token',
  DEFAULT_REDIRECT: (import.meta as any).env.VITE_DEFAULT_REDIRECT || '/dashboard',
  LOGIN_PATH: (import.meta as any).env.VITE_LOGIN_PATH || '/login'
}
