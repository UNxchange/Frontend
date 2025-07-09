import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getNavigationForRole } from '../config/navigation'
import { MenuItem } from '../types'
import Button from '../atoms/Button'
import '../atoms/navbar.css'

interface NavigationBarProps {
  className?: string
}

const NavigationBar: React.FC<NavigationBarProps> = ({ className = '' }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-menu-container') && !target.closest('.mobile-menu-container')) {
        setShowUserMenu(false)
        setShowMobileMenu(false)
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

  const renderMenuItem = (item: MenuItem) => (
    <Link
      key={item.id}
      to={item.path}
      className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
      onClick={() => setShowMobileMenu(false)}
    >
      {item.icon && <i className={`icon icon-${item.icon}`} />}
      {item.label}
    </Link>
  )

  const renderUserMenuItem = (item: MenuItem) => (
    <Link
      key={item.id}
      to={item.path}
      className="user-menu-item"
      onClick={() => setShowUserMenu(false)}
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
        <Link to="/dashboard" className="navbar-brand">
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
                <div className="user-menu-divider" />
                <div className="user-menu-items">
                  {navigationConfig.userMenuItems.map(renderUserMenuItem)}
                </div>
                <div className="user-menu-divider" />
                <button className="user-menu-logout" onClick={handleLogout}>
                  <i className="icon icon-logout" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* Botón de menú móvil */}
          <button
            className="mobile-menu-trigger"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <i className="icon icon-menu" />
          </button>
        </div>

        {/* Menú móvil */}
        {showMobileMenu && (
          <div className="mobile-menu-container">
            <div className="mobile-menu">
              <div className="mobile-menu-header">
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="mobile-user-details">
                    <div className="mobile-user-name">{user?.name}</div>
                    <div className="mobile-user-role">{user?.role}</div>
                  </div>
                </div>
              </div>
              <div className="mobile-menu-divider" />
              <div className="mobile-menu-items">
                {navigationConfig.menuItems.map(renderMenuItem)}
              </div>
              <div className="mobile-menu-divider" />
              <div className="mobile-menu-user-items">
                {navigationConfig.userMenuItems.map(renderUserMenuItem)}
              </div>
              <div className="mobile-menu-divider" />
              <button className="mobile-menu-logout" onClick={handleLogout}>
                <i className="icon icon-logout" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavigationBar
