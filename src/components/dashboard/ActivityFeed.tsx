import { Activity } from '../../hooks/useRecentActivity'
import { Link } from 'react-router-dom'

const typeColors: Record<Activity['type'], { bg: string; text: string; label: string }> = {
  announcement: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Announcement' },
  event: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Event' },
  sermon: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Sermon' },
  prayer_request: { bg: 'bg-pink-50', text: 'text-pink-700', label: 'Prayer' },
  ministry: { bg: 'bg-green-50', text: 'text-green-700', label: 'Ministry' },
  user_joined: { bg: 'bg-slate-50', text: 'text-slate-700', label: 'Member' },
}

const collectionRoutes: Record<string, string> = {
  announcements: '/dashboard/announcements',
  events: '/dashboard/events',
  sermons: '/dashboard/sermons',
  prayerRequests: '/dashboard/prayer-requests',
  ministries: '/dashboard/ministries',
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function ActivityFeed({ activities, loading }: { activities: Activity[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="milk-card p-6">
        <h2 className="font-serif text-2xl font-bold text-brand-900">Recent activity</h2>
        <div className="mt-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded bg-stone-200" />
          ))}
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="milk-card p-6">
        <h2 className="font-serif text-2xl font-bold text-brand-900">Recent activity</h2>
        <p className="mt-4 text-stone-500">No activity yet. Start by adding an announcement or event.</p>
      </div>
    )
  }

  return (
    <div className="milk-card p-6">
      <h2 className="font-serif text-2xl font-bold text-brand-900">Recent activity</h2>
      <div className="mt-4 space-y-3">
        {activities.map((activity) => {
          const colors = typeColors[activity.type]
          const route = collectionRoutes[activity.collectionName]

          return (
            <Link
              key={`${activity.collectionName}-${activity.id}`}
              to={route || '#'}
              className={`block rounded-lg p-3 transition-colors hover:opacity-80 ${colors.bg}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                    {colors.label}
                  </p>
                  <p className="mt-1 truncate font-semibold text-stone-900">{activity.title}</p>
                  {activity.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-stone-700">{activity.description}</p>
                  )}
                </div>
                <p className="text-xs text-stone-500 whitespace-nowrap">
                  {formatTime(activity.createdAt)}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
