import React from 'react'
import { Link } from 'react-router-dom'
import NavigationBar from '../organisms/NavigationBar'
import '../atoms/navigation.css'

const Dashboard: React.FC = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <NavigationBar />
      
      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        minHeight: 'calc(100vh - 72px)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#333',
              margin: 0
            }}>Analytics Dashboard</h1>
            <Link 
              to="/convenios" 
              style={{
                color: '#007bff',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Ver Convenios
            </Link>
          </div>
          
          <div style={{ padding: '20px' }}>
            <p>Bienvenido al Dashboard de Analytics. Aquí podrás ver estadísticas y reportes del sistema.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
