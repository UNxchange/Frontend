import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getNavigationForRole } from '../config/navigation'
import { MenuItem } from '../types'
import Button from '../atoms/Button'
import NotificationBell from '../components/NotificationBell'
import '../atoms/navbar.css'

interface NavigationBarProps {
  className?: string
}

const NavigationBar: React.FC<NavigationBarProps> = ({ className = '' }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [navigationConfig, setNavigationConfig] = useState<{ menuItems: MenuItem[], userMenuItems: MenuItem[] }>({
    menuItems: [],
    userMenuItems: []
  })

  // Actualizar configuración de navegación cuando cambie el usuario
  useEffect(() => {
    if (user) {
      const config = getNavigationForRole(user.role)
      setNavigationConfig(config)
    }
  }, [user])

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowUserMenu(false)
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  // Función para obtener la ruta del dashboard según el rol
  const getDashboardRoute = () => {
    if (!user) return '/dashboard'
    
    switch (user.role) {
      case 'profesional':
        return '/dashboard/profesional'
      case 'estudiante':
        return '/dashboard/estudiante'
      default:
        return '/dashboard'
    }
  }

  const renderMenuItem = (item: MenuItem) => (
    <Link
      key={item.id}
      to={item.path}
      className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
    >
      {item.icon && <i className={`icon icon-${item.icon}`} />}
      {item.label}
    </Link>
  )

  if (!isAuthenticated) {
    return (
      <nav className={`navbar navbar-minimal ${className}`}>
        <div className="navbar-container">
          <Link to="/login" className="navbar-brand">
            <img 
              src="https://cdiac.manizales.unal.edu.co/imagenes/LogosMini/un.png" 
              alt="UN Intercambio" 
              className="navbar-logo"
            />
          </Link>
          <div className="navbar-actions">
            <Link to="/login">
              <Button variant="primary">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`navbar ${className}`}>
      <div className="navbar-container">
        {/* Logo y marca */}
        <Link to={getDashboardRoute()} className="navbar-brand">
          <img 
            src="https://cdiac.manizales.unal.edu.co/imagenes/LogosMini/un.png" 
            alt="UN Intercambio" 
            className="navbar-logo"
          />
          <span className="navbar-title">UN Intercambio</span>
        </Link>

        {/* Menú principal - Desktop */}
        <div className="navbar-menu desktop-menu">
          {navigationConfig.menuItems.map(renderMenuItem)}
        </div>

        {/* Acciones del usuario */}
        <div className="navbar-actions">
          {/* Campana de notificaciones */}
          <NotificationBell />

          {/* Información del usuario */}
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>

          {/* Menú de usuario */}
          <div className="user-menu-container">
            <button
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <i className="icon icon-chevron-down" />
            </button>

            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <div className="user-menu-info">
                    <div className="user-menu-name">{user?.name}</div>
                    <div className="user-menu-email">{user?.email}</div>
                  </div>
                </div>
                
                <div className="user-menu-items">
                  <div className="user-menu-item">
                    <i className="icon icon-user" />
                    Mi Perfil
                  </div>
                </div>
                
                <button className="user-menu-logout" onClick={handleLogout}>
                  <i className="icon icon-logout" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar
