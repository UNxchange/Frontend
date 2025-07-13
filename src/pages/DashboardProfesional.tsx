import React, { useState } from 'react'
import NavigationBar from '../organisms/NavigationBar'
import CreateConvocatoriaForm from '../components/CreateConvocatoriaForm'

const DashboardProfesional: React.FC = () => {
  const [showForm, setShowForm] = useState(false)

  const handleFormSuccess = (convocatoria: any) => {
    console.log('Convocatoria creada:', convocatoria)
    // Aquí puedes agregar lógica adicional como actualizar una lista
  }

  return (
    <div className="dashboard-profesional">
      <NavigationBar />
      <main className="dashboard-content">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                Creación y Actualización de Convocatorias
              </h1>
              <p className="dashboard-subtitle">
                Panel de gestión para profesionales - Administra las convocatorias de intercambio
              </p>
            </div>
          </header>
          
          <div className="dashboard-main-content">
            {!showForm ? (
              <div className="dashboard-actions">
                <div className="welcome-section">
                  <h3>¿Qué deseas hacer?</h3>
                  <p>Utiliza las opciones a continuación para gestionar las convocatorias</p>
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="action-button primary"
                    onClick={() => setShowForm(true)}
                  >
                    <i className="fas fa-plus"></i>
                    <span>Crear Nueva Convocatoria</span>
                    <small>Agrega una nueva convocatoria al sistema</small>
                  </button>
                  
                  <button className="action-button secondary">
                    <i className="fas fa-list"></i>
                    <span>Ver Mis Convocatorias</span>
                    <small>Administra las convocatorias existentes</small>
                  </button>
                  
                  <button className="action-button secondary">
                    <i className="fas fa-chart-bar"></i>
                    <span>Estadísticas</span>
                    <small>Revisa métricas y estadísticas</small>
                  </button>
                </div>
              </div>
            ) : (
              <CreateConvocatoriaForm 
                onSuccess={handleFormSuccess}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardProfesional
