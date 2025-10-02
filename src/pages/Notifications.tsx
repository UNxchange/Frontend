import React from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { Notification } from '../services/notificationService'
import '../styles/notifications.css'

const NotificationItem: React.FC<{
  notification: Notification
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}> = ({ notification, onMarkAsRead, onDelete }) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'convocatoria':
        return '📢'
      case 'application':
        return '📝'
      case 'approval':
        return '✅'
      case 'rejection':
        return '❌'
      case 'reminder':
        return '⏰'
      case 'message':
        return '💬'
      default:
        return '🔔'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMinutes < 1) return 'Justo ahora'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInHours < 24) return `Hace ${diffInHours} h`
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
      <div className="notification-icon">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <h4 className="notification-title">{notification.title}</h4>
          <span className="notification-time">{formatDate(notification.createdAt)}</span>
        </div>
        <p className="notification-message">{notification.message}</p>
        {notification.metadata && Object.keys(notification.metadata).length > 0 && (
          <div className="notification-metadata">
            {Object.entries(notification.metadata).map(([key, value]) => (
              <span key={key} className="metadata-tag">
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="notification-actions">
        {!notification.isRead && (
          <button
            className="btn-mark-read"
            onClick={() => onMarkAsRead(notification.id)}
            title="Marcar como leída"
          >
            <i className="pi pi-check"></i>
          </button>
        )}
        <button
          className="btn-delete"
          onClick={() => onDelete(notification.id)}
          title="Eliminar"
        >
          <i className="pi pi-trash"></i>
        </button>
      </div>
    </div>
  )
}

const Notifications: React.FC = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()

  const [filter, setFilter] = React.useState<'all' | 'unread'>('all')

  const filteredNotifications = React.useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter(n => !n.isRead)
    }
    return notifications
  }, [notifications, filter])

  if (loading && notifications.length === 0) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          <p>Cargando notificaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-title">
          <h1>Notificaciones</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        
        <div className="header-actions">
          <button
            className="btn-refresh"
            onClick={refreshNotifications}
            disabled={loading}
            title="Actualizar"
          >
            <i className={`pi pi-refresh ${loading ? 'pi-spin' : ''}`}></i>
          </button>
          
          {unreadCount > 0 && (
            <button
              className="btn-mark-all-read"
              onClick={markAllAsRead}
            >
              <i className="pi pi-check-circle"></i>
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      <div className="notifications-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          No leídas ({unreadCount})
        </button>
      </div>

      {error && (
        <div className="notifications-error">
          <i className="pi pi-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={refreshNotifications}>Reintentar</button>
        </div>
      )}

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <i className="pi pi-bell" style={{ fontSize: '3rem', color: '#ccc' }}></i>
            <p>No tienes {filter === 'unread' ? 'notificaciones sin leer' : 'notificaciones'}</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Notifications
