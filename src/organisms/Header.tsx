import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../atoms/Button'
import { useAuth } from '../hooks/useAuth'
import NotificationBell from '../components/NotificationBell'

const Header: React.FC = () => {
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    console.log('Cerrando sesión...')
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-md">
      <nav>
        <ul className="flex items-center p-4 m-0 list-none">
          <li id="brand-container">
            <div className="brand-container">
              <div className="column" id="logo">
                <img 
                  src="https://cdiac.manizales.unal.edu.co/imagenes/LogosMini/un.png" 
                  alt="Logo Un Intercambio" 
                  id="logoIntercambio" 
                  className="h-10 w-auto max-w-[120px] object-contain block"
                />
              </div>
            </div>
          </li>
          
          <li className="ml-6">
            <Link 
              to="/convenios" 
              className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded transition-colors no-underline"
            >
              Convenios
            </Link>
          </li>
          
          <li className="ml-2">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded transition-colors no-underline"
            >
              Analytics
            </Link>
          </li>
          
          <li className="ml-auto">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Button 
                  onClick={handleLogout}
                  variant="danger"
                  className="px-4 py-2 ml-4"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button 
                  variant="primary"
                  className="px-4 py-2"
                >
                  Log In
                </Button>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
