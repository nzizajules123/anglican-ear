import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAnnouncementFeed } from '../../hooks/useAnnouncementFeed'

function formatWhen(seconds?: number) {
  if (!seconds) return 'just now'
  return new Date(seconds * 1000).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function NotificationBell({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { announcements, unreadCount, markAllRead } = useAnnouncementFeed()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((value) => !value)
          if (!open) markAllRead()
        }}
        aria-label={`Announcements${unreadCount ? `, ${unreadCount} unread` : ''}`}
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition ${
          tone === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'border border-stone-200 bg-white text-stone-700 shadow-sm hover:bg-stone-50'
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden="true" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Announcements</p>
              <Link to="/dashboard/announcements" onClick={() => setOpen(false)} className="text-xs font-bold text-brand-700 hover:text-brand-900">
                View all
              </Link>
            </div>
            <div className="max-h-80 divide-y divide-stone-100 overflow-y-auto">
              {announcements.length === 0 && <p className="px-4 py-6 text-sm text-stone-500">No announcements yet.</p>}
              {announcements.slice(0, 12).map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <p className="text-sm font-semibold text-stone-900">{item.title}</p>
                  <p className="mt-0.5 line-clamp-3 text-xs text-stone-600">{item.message}</p>
                  <p className="mt-1 text-[11px] text-stone-400">
                    {formatWhen(item.createdAt?.seconds)}
                    {item.createdByName ? ` · ${item.createdByName}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
