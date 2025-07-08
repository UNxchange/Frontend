import { AuthService } from '../services/authService'
import { API_CONFIG, APP_CONFIG } from '../config/api'

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export class HttpClient {
  private static baseURL = API_CONFIG.BASE_URL

  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // Agregar headers por defecto
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    // Agregar token de autenticación si existe
    const token = AuthService.getToken()
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    // Combinar headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Manejar respuestas no exitosas
      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          AuthService.logout()
          window.location.href = APP_CONFIG.LOGIN_PATH
          throw new Error('Session expired. Please login again.')
        }
        
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      // Intentar parsear como JSON
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      // Si no es JSON, retornar como texto
      return await response.text() as unknown as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  static async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Método especial para form data (como el login)
  static async postForm<T>(endpoint: string, formData: URLSearchParams): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
  }
}
