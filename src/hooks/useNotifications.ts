import { useState, useCallback, useEffect } from 'react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  message: string
  title?: string
  type: NotificationType
  duration?: number
  dismissible?: boolean
  leaving?: boolean
}

const EXIT_ANIMATION_MS = 320

const notificationStore: Map<string, Notification> = new Map()
let notificationId = 0
const listeners: Set<() => void> = new Set()

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

function addNotification(notification: Omit<Notification, 'id' | 'leaving'>): string {
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
      beginRemoveNotification(id)
    }, fullNotification.duration)
  }

  return id
}

// Marks a notification as leaving (so its exit animation can play), then removes
// it from the store shortly after — instead of deleting it immediately, which
// gave the UI no chance to animate anything out.
function beginRemoveNotification(id: string) {
  const existing = notificationStore.get(id)
  if (!existing || existing.leaving) return
  notificationStore.set(id, { ...existing, leaving: true })
  notifyListeners()
  setTimeout(() => {
    notificationStore.delete(id)
    notifyListeners()
  }, EXIT_ANIMATION_MS)
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(
    Array.from(notificationStore.values())
  )

  useEffect(() => {
    const handleUpdate = () => setNotifications(Array.from(notificationStore.values()))
    listeners.add(handleUpdate)
    handleUpdate()
    return () => { listeners.delete(handleUpdate) }
  }, [])

  const notify = (message: string, type: NotificationType = 'info', duration?: number, title?: string) => {
    return addNotification({ message, type, duration, title })
  }

  const success = (message: string, duration?: number, title?: string) => notify(message, 'success', duration, title)
  const error = (message: string, duration?: number, title?: string) => notify(message, 'error', duration, title)
  const warning = (message: string, duration?: number, title?: string) => notify(message, 'warning', duration, title)
  const info = (message: string, duration?: number, title?: string) => notify(message, 'info', duration, title)

  const dismiss = useCallback((id: string) => beginRemoveNotification(id), [])
  const dismissAll = useCallback(() => {
    Array.from(notificationStore.keys()).forEach((id) => beginRemoveNotification(id))
  }, [])

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