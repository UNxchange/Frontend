import React from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'
import '../styles/notification-bell.css'

const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications()

  return (
    <Link to="/notifications" className="notification-bell-container">
      <div className="notification-bell">
        <i className="pi pi-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
    </Link>
  )
}

export default NotificationBell
