import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard: React.FC = () => {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      minHeight: '100vh'
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
            color: '#333'
          }}>
            Dashboard - Convocatorias
          </h1>
          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link 
              to="/convenios" 
              style={{
                textDecoration: 'none',
                color: '#3498db',
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #3498db',
                transition: 'all 0.3s'
              }}
            >
              Convenios
            </Link>
            <Link 
              to="/login" 
              style={{
                textDecoration: 'none',
                color: '#666',
                padding: '8px 16px'
              }}
            >
              Cerrar Sesión
            </Link>
          </nav>
        </div>
        
        <div style={{ padding: '20px' }}>
          <h2 style={{
            fontSize: '20px',
            marginBottom: '20px',
            color: '#333'
          }}>
            Bienvenido al Dashboard
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginBottom: '10px', color: '#3498db' }}>Convocatorias Activas</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>12</p>
            </div>
            
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginBottom: '10px', color: '#28a745' }}>Convenios Firmados</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>8</p>
            </div>
            
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginBottom: '10px', color: '#ffc107' }}>En Proceso</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>4</p>
            </div>
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Acciones Rápidas</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Crear Nueva Convocatoria
              </button>
              <Link 
                to="/convenios"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}
              >
                Ver Convenios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
