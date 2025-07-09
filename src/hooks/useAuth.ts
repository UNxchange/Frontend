import { useState, useEffect } from 'react'
import { AuthService } from '../services/authService'
import { User } from '../types'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar
    const checkAuth = async () => {
      try {
        const authenticated = AuthService.isAuthenticated()
        setIsAuthenticated(authenticated)
        
        if (authenticated) {
          // Obtener información del usuario desde el token o la API
          const userData = await AuthService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService.login(username, password)
      AuthService.saveToken(response.access_token)
      
      // Obtener información del usuario después del login
      const userData = await AuthService.getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)
      
      return response
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
      throw error
    }
  }

  const logout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  const getToken = () => {
    return AuthService.getToken()
  }

  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getToken,
    hasRole,
    hasAnyRole
  }
}
