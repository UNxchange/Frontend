import { MenuItem, NavigationConfig } from '../types'

// Configuración de elementos de navegación principal
export const NAVIGATION_CONFIG: NavigationConfig = {
  menuItems: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'chart-bar',
      roles: ['administrador', 'coordinator', 'profesional']
    },
    {
      id: 'convenios',
      label: 'Convenios',
      path: '/convenios',
      icon: 'document-text',
      roles: ['administrador', 'coordinator', 'profesional', 'estudiante']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/analytics',
      icon: 'chart-line',
      roles: ['administrador', 'coordinator']
    },
    {
      id: 'users',
      label: 'Usuarios',
      path: '/users',
      icon: 'users',
      roles: ['administrador']
    },
    {
      id: 'reports',
      label: 'Reportes',
      path: '/reports',
      icon: 'document-report',
      roles: ['administrador', 'coordinator']
    },
    {
      id: 'settings',
      label: 'Configuración',
      path: '/settings',
      icon: 'cog',
      roles: ['administrador']
    }
  ],
  userMenuItems: [
    {
      id: 'profile',
      label: 'Mi Perfil',
      path: '/profile',
      icon: 'user',
      roles: ['administrador', 'coordinator', 'profesional', 'estudiante']
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      path: '/notifications',
      icon: 'bell',
      roles: ['administrador', 'coordinator', 'profesional', 'estudiante']
    },
    {
      id: 'preferences',
      label: 'Preferencias',
      path: '/preferences',
      icon: 'adjustments',
      roles: ['administrador', 'coordinator', 'profesional', 'estudiante']
    }
  ]
}

// Función para filtrar elementos de menú por rol
export const filterMenuByRole = (menuItems: MenuItem[], userRole: string): MenuItem[] => {
  return menuItems.filter(item => 
    item.roles.includes(userRole) || item.roles.includes('*')
  )
}

// Función para verificar si un usuario tiene acceso a una ruta
export const hasAccess = (path: string, userRole: string): boolean => {
  const allMenuItems = [...NAVIGATION_CONFIG.menuItems, ...NAVIGATION_CONFIG.userMenuItems]
  const menuItem = allMenuItems.find(item => item.path === path)
  
  if (!menuItem) return false
  
  return menuItem.roles.includes(userRole) || menuItem.roles.includes('*')
}

// Función para obtener la configuración de navegación filtrada por rol
export const getNavigationForRole = (userRole: string): NavigationConfig => {
  return {
    menuItems: filterMenuByRole(NAVIGATION_CONFIG.menuItems, userRole),
    userMenuItems: filterMenuByRole(NAVIGATION_CONFIG.userMenuItems, userRole)
  }
}
