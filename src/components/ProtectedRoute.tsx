import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { hasAccess } from '../config/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div>Verificando autenticación...</div>
      </div>
    )
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Verificar roles específicos si se proporcionaron
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role)
    if (!hasRequiredRole) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '400px',
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#fef2f2'
          }}>
            <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Acceso Denegado</h2>
            <p style={{ marginBottom: '0.5rem' }}>No tienes permisos para acceder a esta página.</p>
            <p style={{ marginBottom: '0.5rem' }}>Rol requerido: {requiredRoles.join(', ')}</p>
            <p style={{ marginBottom: '1.5rem' }}>Tu rol actual: {user.role}</p>
            <button 
              onClick={() => window.history.back()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Volver
            </button>
          </div>
        </div>
      )
    }
  }

  // Verificar acceso basado en la configuración de navegación
  if (user && !hasAccess(location.pathname, user.role)) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          backgroundColor: '#fef2f2'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Acceso Denegado</h2>
          <p style={{ marginBottom: '0.5rem' }}>No tienes permisos para acceder a esta página.</p>
          <p style={{ marginBottom: '1.5rem' }}>Tu rol actual: {user.role}</p>
          <button 
            onClick={() => window.history.back()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
