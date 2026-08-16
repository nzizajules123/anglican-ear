import { X, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react'
import { Notification } from '../../hooks/useNotifications'

interface NotificationDisplayProps {
  notification: Notification
  onDismiss: (id: string) => void
}

const typeConfig: Record<Notification['type'], { label: string; icon: typeof CheckCircle2; badge: string; iconColor: string }> = {
  success: { label: 'Success', icon: CheckCircle2, badge: 'bg-green-500', iconColor: 'text-white' },
  error: { label: 'Error', icon: XCircle, badge: 'bg-red-500', iconColor: 'text-white' },
  warning: { label: 'Warning', icon: AlertTriangle, badge: 'bg-amber-500', iconColor: 'text-white' },
  info: { label: 'Notice', icon: Info, badge: 'bg-blue-500', iconColor: 'text-white' },
}

export function NotificationDisplay({ notification, onDismiss }: NotificationDisplayProps) {
  const config = typeConfig[notification.type]
  const Icon = config.icon

  return (
    <div
      role="status"
      onClick={() => notification.dismissible && onDismiss(notification.id)}
      className={`notification-banner notification-noise relative flex w-[92vw] max-w-sm cursor-pointer items-start gap-3 overflow-hidden rounded-2xl border border-white/60 bg-white/75 p-3.5 shadow-[0_12px_32px_rgba(20,20,20,0.18)] backdrop-blur-2xl ${notification.leaving ? 'is-leaving' : ''}`}
    >
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${config.badge}`}>
        <Icon className={config.iconColor} size={19} strokeWidth={2.4} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[13px] font-bold uppercase tracking-wide text-stone-900">
            {notification.title || config.label}
          </p>
          <span className="flex-shrink-0 text-[11px] font-medium text-stone-500">now</span>
        </div>
        <p className="mt-0.5 text-sm leading-snug text-stone-700">{notification.message}</p>
      </div>

      {notification.dismissible && (
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(notification.id) }}
          aria-label="Dismiss notification"
          className="mt-0.5 flex-shrink-0 rounded-full p-1 text-stone-400 hover:bg-black/5 hover:text-stone-700"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}

interface NotificationContainerProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function NotificationContainer({ notifications, onDismiss }: NotificationContainerProps) {
  if (notifications.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 px-4"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationDisplay notification={notification} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}