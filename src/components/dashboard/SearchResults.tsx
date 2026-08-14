import { Link } from 'react-router-dom'
import { SearchResult } from '../../hooks/useAdvancedSearch'
import { Loader } from 'lucide-react'

const typeColors: Record<string, { bg: string; text: string }> = {
  announcements: { bg: 'bg-blue-50', text: 'text-blue-700' },
  events: { bg: 'bg-purple-50', text: 'text-purple-700' },
  sermons: { bg: 'bg-amber-50', text: 'text-amber-700' },
  prayerRequests: { bg: 'bg-pink-50', text: 'text-pink-700' },
  ministries: { bg: 'bg-green-50', text: 'text-green-700' },
  giving: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
}

const collectionRoutes: Record<string, (id: string) => string> = {
  announcements: (id) => `/dashboard/announcements/${id}`,
  events: (id) => `/dashboard/events/${id}`,
  sermons: (id) => `/dashboard/sermons/${id}`,
  prayerRequests: (id) => `/dashboard/prayer-requests/${id}`,
  ministries: (id) => `/dashboard/ministries/${id}`,
  giving: (id) => `/dashboard/giving/${id}`,
}

export function SearchResults({
  results,
  loading,
  error,
  emptyMessage = 'No results found',
}: {
  results: SearchResult[]
  loading: boolean
  error: string | null
  emptyMessage?: string
}) {
  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm font-medium text-red-900">Error: {error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="animate-spin text-brand-500" />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="rounded-lg bg-stone-50 p-8 text-center">
        <p className="text-stone-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {results.map((result) => {
        const colors = typeColors[result.collectionName] || typeColors.announcements
        const getRoute = collectionRoutes[result.collectionName] || (() => '#')
        const route = getRoute(result.id)

        return (
          <Link
            key={`${result.collectionName}-${result.id}`}
            to={route}
            className={`block rounded-lg p-4 transition-all hover:shadow-md ${colors.bg}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                    {result.collectionName.replace('Requests', '')}
                  </span>
                  {result.status && (
                    <span className="inline-block rounded px-2 py-0.5 bg-white text-xs font-medium text-stone-600">
                      {result.status}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 truncate font-semibold text-stone-900">{result.title}</h3>
                {result.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-stone-700">{result.description}</p>
                )}
                {result.createdBy && (
                  <p className="mt-2 text-xs text-stone-600">
                    By {result.createdBy}
                    {result.createdAt && ` • ${result.createdAt.toLocaleDateString()}`}
                  </p>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
