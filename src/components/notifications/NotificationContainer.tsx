import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { Notification } from '../../hooks/useNotifications'

interface NotificationDisplayProps {
  notification: Notification
  onDismiss: (id: string) => void
}

const typeConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    textColor: 'text-green-900',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-900',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
  },
}

export function NotificationDisplay({ notification, onDismiss }: NotificationDisplayProps) {
  const config = typeConfig[notification.type]
  const Icon = config.icon

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border ${config.bg} ${config.border} p-4`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
      <p className={`flex-1 text-sm font-medium ${config.textColor}`}>{notification.message}</p>
      {notification.dismissible && (
        <button
          onClick={() => onDismiss(notification.id)}
          className="ml-2 rounded-lg p-1 hover:bg-black/10"
        >
          <X size={16} className={config.iconColor} />
        </button>
      )}
    </div>
  )
}

interface NotificationContainerProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function NotificationContainer({
  notifications,
  onDismiss,
}: NotificationContainerProps) {
  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationDisplay
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}
