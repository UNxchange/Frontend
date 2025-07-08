import { useState, useEffect } from 'react'
import { AuthService } from '../services/authService'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar
    const checkAuth = () => {
      const authenticated = AuthService.isAuthenticated()
      setIsAuthenticated(authenticated)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService.login(username, password)
      AuthService.saveToken(response.access_token)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      setIsAuthenticated(false)
      throw error
    }
  }

  const logout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
  }

  const getToken = () => {
    return AuthService.getToken()
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken
  }
}
