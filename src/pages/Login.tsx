import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../atoms/login-atoms.css'
import '../molecules/login-form.css'
import { AuthService, ValidationErrorResponse } from '../services/authService'
import { APP_CONFIG } from '../config/api'
import SignupModal from '../components/SignupModal'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSignupModal, setShowSignupModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Obtener la ubicación desde donde se redirigió al login
  const from = (location.state as any)?.from?.pathname || APP_CONFIG.DEFAULT_REDIRECT

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!username || !password) {
      setError('Por favor, ingresa usuario y contraseña')
      setIsLoading(false)
      return
    }

    try {
      const response = await AuthService.login(username, password)
      
      // Guardar el token
      AuthService.saveToken(response.access_token)
      
      console.log('Login successful:', response)
      
      // Redirigir a la página original o al dashboard
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Login error:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('422')) {
          setError('Credenciales inválidas. Verifica tu usuario y contraseña.')
        } else if (error.message.includes('401') || error.message.includes('400')) {
          setError('Usuario o contraseña incorrectos.')
        } else {
          setError('Error de conexión. Intenta nuevamente.')
        }
      } else {
        setError('Error inesperado. Intenta nuevamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#f5f7fa',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <img 
          src="https://edu.ieee.org/co-unemb/wp-content/uploads/sites/195/escudoUnal_black.png" 
          alt="Universidad Nacional de Colombia" 
          style={{
            width: '280px',
            marginBottom: '30px'
          }}
        />
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '500',
          color: '#3498db',
          marginBottom: '30px'
        }}>
          Bienvenido
        </h1>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#ff6b6b',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <input 
            type="text" 
            className="input-field" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required 
          />
          <input 
            type="password" 
            className="input-field" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required 
          />
          
          <a href="#" className="forgot-password">Forgot Password?</a>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <a 
          href="#" 
          className="signup-link"
          onClick={(e) => {
            e.preventDefault()
            setShowSignupModal(true)
          }}
        >
          Aún no tienes cuenta ? Registrate aquí
        </a>
      </div>

      {/* Modal de Signup */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={() => {
          setShowSignupModal(false)
          // Opcionalmente mostrar un mensaje de éxito
          setError('')
        }}
      />
    </div>
  )
}

export default Login
