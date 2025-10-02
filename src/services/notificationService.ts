import { gql } from '@apollo/client'
import { graphqlClient } from './graphqlClient'

// TypeScript interfaces
export interface Notification {
  id: number
  userId: number
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  readAt?: string
  metadata?: Record<string, any>
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

export interface NotificationInput {
  userId: number
  type: string
  title: string
  message: string
  metadata?: Record<string, any>
}

// GraphQL Queries
const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: Int!) {
    notifications(userId: $userId) {
      id
      userId
      type
      title
      message
      isRead
      createdAt
      readAt
      metadata
      user {
        id
        name
        email
        role
      }
    }
  }
`

const GET_UNREAD_NOTIFICATIONS = gql`
  query GetUnreadNotifications($userId: Int!) {
    unreadNotifications(userId: $userId) {
      id
      userId
      type
      title
      message
      isRead
      createdAt
      metadata
    }
  }
`

const GET_NOTIFICATION = gql`
  query GetNotification($notificationId: Int!) {
    notification(notificationId: $notificationId) {
      id
      userId
      type
      title
      message
      isRead
      createdAt
      readAt
      metadata
      user {
        id
        name
        email
        role
      }
    }
  }
`

// GraphQL Mutations
const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($notification: NotificationInput!) {
    createNotification(notification: $notification) {
      id
      userId
      type
      title
      message
      isRead
      createdAt
      metadata
    }
  }
`

const MARK_AS_READ = gql`
  mutation MarkAsRead($notificationId: Int!) {
    markAsRead(notificationId: $notificationId) {
      id
      isRead
      readAt
    }
  }
`

const MARK_ALL_AS_READ = gql`
  mutation MarkAllAsRead($userId: Int!) {
    markAllAsRead(userId: $userId)
  }
`

const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: Int!) {
    deleteNotification(notificationId: $notificationId)
  }
`

// Service class
export class NotificationService {
  /**
   * Get all notifications for a user
   */
  static async getNotifications(userId: number | string): Promise<Notification[]> {
    try {
      const { data } = await graphqlClient.query<{ notifications: Notification[] }>({
        query: GET_NOTIFICATIONS,
        variables: { userId: Number(userId) },
      })
      return data?.notifications || []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  /**
   * Get unread notifications for a user
   */
  static async getUnreadNotifications(userId: number | string): Promise<Notification[]> {
    try {
      const { data } = await graphqlClient.query<{ unreadNotifications: Notification[] }>({
        query: GET_UNREAD_NOTIFICATIONS,
        variables: { userId: Number(userId) },
      })
      return data?.unreadNotifications || []
    } catch (error) {
      console.error('Error fetching unread notifications:', error)
      throw error
    }
  }

  /**
   * Get a specific notification
   */
  static async getNotification(notificationId: number): Promise<Notification> {
    try {
      const { data } = await graphqlClient.query<{ notification: Notification }>({
        query: GET_NOTIFICATION,
        variables: { notificationId },
      })
      if (!data?.notification) {
        throw new Error('Notification not found')
      }
      return data.notification
    } catch (error) {
      console.error('Error fetching notification:', error)
      throw error
    }
  }

  /**
   * Create a new notification
   */
  static async createNotification(notification: NotificationInput): Promise<Notification> {
    try {
      const { data } = await graphqlClient.mutate<{ createNotification: Notification }>({
        mutation: CREATE_NOTIFICATION,
        variables: { notification },
      })
      return data!.createNotification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: number): Promise<Notification> {
    try {
      const { data } = await graphqlClient.mutate<{ markAsRead: Notification }>({
        mutation: MARK_AS_READ,
        variables: { notificationId },
      })
      return data!.markAsRead
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: number | string): Promise<boolean> {
    try {
      const { data } = await graphqlClient.mutate<{ markAllAsRead: boolean }>({
        mutation: MARK_ALL_AS_READ,
        variables: { userId: Number(userId) },
      })
      return data!.markAllAsRead
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: number): Promise<boolean> {
    try {
      const { data } = await graphqlClient.mutate<{ deleteNotification: boolean }>({
        mutation: DELETE_NOTIFICATION,
        variables: { notificationId },
      })
      return data!.deleteNotification
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: number | string): Promise<number> {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId)
      return unreadNotifications.length
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  }
}
