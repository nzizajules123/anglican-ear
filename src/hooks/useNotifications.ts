import { useState, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  duration?: number
  dismissible?: boolean
}

const notificationStore: Map<string, Notification> = new Map()
let notificationId = 0
const listeners: Set<() => void> = new Set()

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

function addNotification(notification: Omit<Notification, 'id'>): string {
  const id = `notification-${notificationId++}`
  const fullNotification: Notification = {
    ...notification,
    id,
    duration: notification.duration ?? 5000,
    dismissible: notification.dismissible ?? true,
  }

  notificationStore.set(id, fullNotification)
  notifyListeners()

  if (fullNotification.duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, fullNotification.duration)
  }

  return id
}

function removeNotification(id: string) {
  notificationStore.delete(id)
  notifyListeners()
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(
    Array.from(notificationStore.values())
  )

  const subscribe = useCallback(() => {
    const handleUpdate = () => {
      setNotifications(Array.from(notificationStore.values()))
    }
    listeners.add(handleUpdate)
    return () => listeners.delete(handleUpdate)
  }, [])

  useCallback(() => {
    subscribe()
  }, [subscribe])

  const notify = (message: string, type: NotificationType = 'info', duration?: number) => {
    return addNotification({ message, type, duration })
  }

  const success = (message: string, duration?: number) => notify(message, 'success', duration)
  const error = (message: string, duration?: number) => notify(message, 'error', duration)
  const warning = (message: string, duration?: number) => notify(message, 'warning', duration)
  const info = (message: string, duration?: number) => notify(message, 'info', duration)

  const dismiss = (id: string) => removeNotification(id)
  const dismissAll = () => {
    notificationStore.clear()
    notifyListeners()
  }

  return {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  }
}
