import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../atoms/login-atoms.css'
import '../molecules/login-form.css'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación
    console.log('Login attempt:', { username, password })
    // Por ahora, redirigir directamente al dashboard
    navigate('/dashboard')
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
          <input 
            type="text" 
            className="input-field" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
          <input 
            type="password" 
            className="input-field" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <a href="#" className="forgot-password">Forgot Password?</a>
          
          <button type="submit" className="login-button">Log In</button>
        </form>
        
        <Link to="/signup" className="signup-link">
          Aún no tienes cuenta ? Registrate aquí
        </Link>
      </div>
    </div>
  )
}

export default Login
