import React from 'react'
import { APP_CONFIG } from '../config/api'
import { AuthService } from '../services/authService'

const TestAuthButton: React.FC = () => {
  const handleTestAuth = async () => {
    console.log('=== TESTING AUTHENTICATION ===')
    
    // 1. Verificar token en localStorage
    const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY)
    console.log('Token key:', APP_CONFIG.TOKEN_KEY)
    console.log('Token exists:', !!token)
    console.log('Token value:', token)
    
    // 2. Verificar método isAuthenticated
    const isAuth = AuthService.isAuthenticated()
    console.log('AuthService.isAuthenticated():', isAuth)
    
    // 3. Intentar obtener usuario actual
    try {
      const user = await AuthService.getCurrentUser()
      console.log('Current user:', user)
    } catch (error) {
      console.error('Error getting current user:', error)
    }
    
    // 4. Verificar configuración de las URLs
    console.log('Auth base URL:', (import.meta as any).env.VITE_AUTH_BASE_URL)
    console.log('Convocatorias base URL:', (import.meta as any).env.VITE_CONVOCATORIAS_BASE_URL)
  }

  const handleTestBackendConnection = async () => {
    console.log('=== TESTING BACKEND CONNECTION ===')
    
    try {
      // Test auth service
      const authResponse = await fetch('http://localhost:8080/api/v1/auth/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(APP_CONFIG.TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Auth service response status:', authResponse.status)
      console.log('Auth service response ok:', authResponse.ok)
      
      // Test convocatorias service
      const convResponse = await fetch('http://localhost:8008/convocatorias', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(APP_CONFIG.TOKEN_KEY)}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('Convocatorias service response status:', convResponse.status)
      console.log('Convocatorias service response ok:', convResponse.ok)
      
      if (!convResponse.ok) {
        const errorText = await convResponse.text()
        console.log('Convocatorias error response:', errorText)
      }
      
    } catch (error) {
      console.error('Error testing backend connection:', error)
    }
  }

  const handleViewStoredLogs = () => {
    const logs = localStorage.getItem('convocatoria_debug_logs')
    if (logs) {
      console.log('=== LOGS GUARDADOS DE CONVOCATORIA ===')
      console.log(logs)
      alert('Logs encontrados! Revisa la consola para ver los detalles.')
    } else {
      alert('No hay logs guardados. Intenta crear una convocatoria primero.')
    }
  }

  const handleClearLogs = () => {
    localStorage.removeItem('convocatoria_debug_logs')
    alert('Logs eliminados.')
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Pruebas de Autenticación (Solo para Debug)</h3>
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={handleTestAuth}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Auth Status
        </button>
        <button
          onClick={handleTestBackendConnection}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Backend Connection
        </button>
      </div>
      <div>
        <button
          onClick={handleViewStoredLogs}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ver Logs Guardados
        </button>
        <button
          onClick={handleClearLogs}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Limpiar Logs
        </button>
      </div>
      <small style={{ display: 'block', marginTop: '10px', color: '#666' }}>
        Los logs de convocatorias se guardan automáticamente y puedes verlos incluso después de un logout
      </small>
    </div>
  )
}

export default TestAuthButton