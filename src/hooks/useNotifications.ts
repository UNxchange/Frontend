import { useState, useEffect, useCallback } from 'react'
import { NotificationService, Notification } from '../services/notificationService'
import { useAuth } from './useAuth'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  refreshNotifications: () => Promise<void>
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: number) => Promise<void>
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshNotifications = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const [allNotifications, unreadNotifications] = await Promise.all([
        NotificationService.getNotifications(user.id),
        NotificationService.getUnreadNotifications(user.id)
      ])
      
      setNotifications(allNotifications)
      setUnreadCount(unreadNotifications.length)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar notificaciones'
      setError(errorMessage)
      console.error('Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const markAsRead = useCallback(async (notificationId: number) => {
    if (!user?.id) return

    try {
      await NotificationService.markAsRead(notificationId)
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar como leída'
      setError(errorMessage)
      console.error('Error marking notification as read:', err)
    }
  }, [user?.id])

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return

    try {
      await NotificationService.markAllAsRead(user.id)
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      )
      setUnreadCount(0)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar todas como leídas'
      setError(errorMessage)
      console.error('Error marking all notifications as read:', err)
    }
  }, [user?.id])

  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      await NotificationService.deleteNotification(notificationId)
      
      // Update local state
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId)
        if (notification && !notification.isRead) {
          setUnreadCount(count => Math.max(0, count - 1))
        }
        return prev.filter(n => n.id !== notificationId)
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar notificación'
      setError(errorMessage)
      console.error('Error deleting notification:', err)
    }
  }, [])

  // Load notifications on mount and when user changes
  useEffect(() => {
    refreshNotifications()
  }, [refreshNotifications])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshNotifications()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [refreshNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
