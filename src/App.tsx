import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './atoms/globals.css'

// Importar páginas
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Convenios from './pages/Convenios'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard - Solo para administrador, coordinator, profesional */}
          <Route 
            path="/dashboard" 
            element={
              /*<ProtectedRoute requiredRoles={['administrador', 'coordinator', 'profesional']}>*/
                <Dashboard />
              /*</ProtectedRoute>*/
            } 
          />
          
          {/* Convenios - Acceso para todos los roles autenticados */}
          <Route 
            path="/convenios" 
            element={
              <ProtectedRoute requiredRoles={['administrador', 'coordinator', 'profesional', 'estudiante']}>
                <Convenios />
              </ProtectedRoute>
            } 
          />
          
          {/* Analytics - Solo para administrador y coordinator */}
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute requiredRoles={['administrador', 'coordinator']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas futuras con roles específicos */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requiredRoles={['administrador']}>
                <div>Página de Usuarios (Solo Admin)</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute requiredRoles={['administrador', 'coordinator']}>
                <div>Página de Reportes</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute requiredRoles={['administrador']}>
                <div>Página de Configuración (Solo Admin)</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <div>Página de Perfil</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <div>Página de Notificaciones</div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/preferences" 
            element={
              <ProtectedRoute>
                <div>Página de Preferencias</div>
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta catch-all para páginas no encontradas */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
