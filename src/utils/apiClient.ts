import Cookies from 'js-cookie';

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  withCredentials?: boolean;
  requiresAuth?: boolean;
}

export class ApiClient {
  private baseURL: string;
  private tokenKey: string;

  constructor(baseURL: string, tokenKey: string = 'access_token') {
    this.baseURL = baseURL;
    this.tokenKey = tokenKey;
  }

  private getToken(): string | null {
    // Intentar obtener el token de localStorage primero
    let token = localStorage.getItem(this.tokenKey);
    
    // Si no está en localStorage, intentar obtenerlo de las cookies
    if (!token) {
      token = Cookies.get(this.tokenKey) || null;
    }
    
    return token;
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    // También guardarlo en cookies para compatibilidad
    Cookies.set(this.tokenKey, token, { 
      expires: 7, // 7 días
      secure: location.protocol === 'https:',
      sameSite: 'strict'
    });
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    Cookies.remove(this.tokenKey);
  }

  private getDefaultHeaders(config: RequestConfig = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    };

    // Agregar token de autenticación si existe y se requiere
    if (config.requiresAuth !== false) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: this.getDefaultHeaders(options),
      credentials: options.withCredentials ? 'include' : 'same-origin',
    };

    try {
      const response = await fetch(url, config);

      // Manejar respuestas no exitosas
      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          this.removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = (import.meta as any).env.VITE_LOGIN_PATH || '/login';
          }
          throw new Error('Session expired. Please login again.');
        }
        
        // Intentar obtener mensaje de error del response
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch {
          errorMessage = await response.text() || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Intentar parsear como JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // Si no es JSON, retornar como texto
      return await response.text() as unknown as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async postForm<T>(endpoint: string, formData: URLSearchParams | FormData, config: RequestConfig = {}): Promise<T> {
    const headers = { ...config.headers };
    
    // No establecer Content-Type para FormData, el navegador lo hará automáticamente
    if (formData instanceof URLSearchParams) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      // Para FormData, eliminar Content-Type para que el navegador lo establezca
      delete headers['Content-Type'];
    }

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      headers,
      body: formData instanceof URLSearchParams ? formData.toString() : formData,
    });
  }

  // Métodos para manejo de tokens
  setToken(token: string): void {
    this.saveToken(token);
  }

  clearToken(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
