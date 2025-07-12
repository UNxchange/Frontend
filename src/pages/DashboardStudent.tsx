import React from 'react'
import NavigationBar from '../organisms/NavigationBar'
import StudentDataTable from '../components/dashboardStudentTable'
import '../atoms/navigation.css'

const DashboardStudent: React.FC = () => {
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
            }}>
              Tablero Convocatorias Estudiantes
            </h1>
            <div style={{
              fontSize: '14px',
              color: '#6c757d',
              fontWeight: '500'
            }}>
              Bienvenido, Estudiante
            </div>
          </div>
          
          <div style={{
            padding: '20px'
          }}>
            {/* Sección de Convocatorias Disponibles */}
            <div style={{
              marginBottom: '30px'
            }}>
              <StudentDataTable />
            </div>

            {/* Sección de Mis Aplicaciones */}
            <div style={{
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '16px'
              }}>
                Mis Aplicaciones
              </h2>
              
              <div style={{
                padding: '20px',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                backgroundColor: '#f8f9fa',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '10px'
                }}>
                  📋
                </div>
                <p style={{
                  margin: 0,
                  color: '#6c757d',
                  fontSize: '16px'
                }}>
                  Aquí podrás ver el estado de tus aplicaciones
                </p>
              </div>
            </div>

            {/* Sección de Próximas Fechas */}
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '16px'
              }}>
                Próximas Fechas Importantes
              </h2>
              
              <div style={{
                padding: '20px',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                backgroundColor: '#f8f9fa',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '10px'
                }}>
                  📅
                </div>
                <p style={{
                  margin: 0,
                  color: '#6c757d',
                  fontSize: '16px'
                }}>
                  Fechas límite de aplicaciones y eventos importantes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStudent
