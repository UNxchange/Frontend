import { HttpClient } from '../utils/httpClient'
import { API_CONFIG, APP_CONFIG } from '../config/api'

export interface LoginRequest {
  username: string
  password: string
  scope?: string
  client_id?: string
  client_secret?: string
}

export interface RegisterRequest {
  name: string
  email: string
  role: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface RegisterResponse {
  id: string
  name: string
  email: string
  role: string
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ValidationErrorResponse {
  detail: ValidationError[]
}

export class AuthService {
  static async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams()
    formData.append('grant_type', 'password')
    formData.append('username', username)
    formData.append('password', password)
    formData.append('scope', '')
    formData.append('client_id', '')
    formData.append('client_secret', '')

    try {
      const data = await HttpClient.postForm<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, formData)
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error - Please check your connection')
    }
  }

  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const data = await HttpClient.post<RegisterResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData)
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error - Please check your connection')
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const data = await HttpClient.get<User[]>(API_CONFIG.ENDPOINTS.AUTH.USERS)
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error - Please check your connection')
    }
  }

  static async getUserByEmail(email: string): Promise<User> {
    try {
      const data = await HttpClient.get<User>(`${API_CONFIG.ENDPOINTS.AUTH.USER_BY_EMAIL}?email=${encodeURIComponent(email)}`)
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error - Please check your connection')
    }
  }

  static saveToken(token: string): void {
    localStorage.setItem(APP_CONFIG.TOKEN_KEY, token)
  }

  static getToken(): string | null {
    return localStorage.getItem(APP_CONFIG.TOKEN_KEY)
  }

  static removeToken(): void {
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY)
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static logout(): void {
    this.removeToken()
  }
}
