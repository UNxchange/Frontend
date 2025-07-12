import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const RootRedirect: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth()

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Cargando...
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirigir según el rol del usuario
  const getRedirectPath = (): string => {
    if (!user) return '/login'
    
    switch (user.role) {
      case 'estudiante':
        return '/dashboard/estudiante'
      case 'profesional':
      case 'administrador':
        return '/dashboard'
      case 'coordinator':
        return '/analytics'
      default:
        return '/dashboard'
    }
  }

  return <Navigate to={getRedirectPath()} replace />
}

export default RootRedirect
