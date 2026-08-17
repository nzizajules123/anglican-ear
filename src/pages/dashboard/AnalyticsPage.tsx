import { useAuth } from '../../features/auth/AuthProvider'
import { useCollectionStats, useAdvancedSearch } from '../../hooks'
import { useDashboardMetrics, getLastNDaysData } from '../../hooks/useDashboardMetrics'
import { ContentDistributionChart, ContentStatusChart, ActivityTrendChart } from '../../components/dashboard/DashboardCharts'
import { Link } from 'react-router-dom'
import { useMyContributions } from '../../hooks/useMyContributions'
import { can } from '../../lib/permissions'
import { roleLabels } from '../../types/roles'

export function AnalyticsPage() {
  const { user, profile } = useAuth()
  const stats = useCollectionStats()
  const metrics = useDashboardMetrics()
  const trendData = getLastNDaysData(7)

  // Only a super admin or pastor sees parish-wide numbers. Everyone else
  // analyses the records they created themselves.
  const siteWide = can(profile?.role, 'siteWideAnalytics')
  const mine = useMyContributions(user?.uid)

  if (!siteWide) {
    return (
      <section>
        <p className="eyebrow">My analytics</p>
        <h1 className="page-title">My contributions</h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          These figures cover only the records you created as {profile ? roleLabels[profile.role] : 'a member'}.
          Parish-wide analytics are reserved for the super admin and the pastor.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="milk-card rounded-lg p-6">
            <p className="text-sm font-medium text-brand-700">My total items</p>
            <p className="mt-2 text-3xl font-bold text-brand-900">{mine.loading ? '—' : mine.total}</p>
            <p className="mt-1 text-xs text-stone-500">Created by you</p>
          </div>
          {['announcements', 'events', 'sermons', 'ministries'].map((name) => (
            <div key={name} className="milk-card rounded-lg p-6">
              <p className="text-sm font-medium capitalize text-brand-700">My {name}</p>
              <p className="mt-2 text-3xl font-bold text-brand-900">{mine.loading ? '—' : mine.counts[name] ?? 0}</p>
              <Link to={`/dashboard/${name}`} className="mt-2 inline-block text-xs font-bold text-brand-600 hover:text-brand-700">
                Open →
              </Link>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <p className="eyebrow">Dashboard Analytics</p>
      <h1 className="page-title">Church Content Insights</h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Monitor your church's content, engagement, and community activity at a glance.
      </p>

      {/* Key Metrics Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="milk-card rounded-lg p-6">
          <p className="text-sm font-medium text-brand-700">Total Content</p>
          <p className="mt-2 text-3xl font-bold text-brand-900">{stats.announcements + stats.events + stats.sermons}</p>
          <p className="mt-1 text-xs text-stone-500">Across all collections</p>
        </div>

        <div className="milk-card rounded-lg p-6">
          <p className="text-sm font-medium text-blue-700">Announcements</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">{stats.announcements}</p>
          <Link to="/dashboard/announcements" className="mt-2 inline-block text-xs font-bold text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>

        <div className="milk-card rounded-lg p-6">
          <p className="text-sm font-medium text-purple-700">Events</p>
          <p className="mt-2 text-3xl font-bold text-purple-900">{stats.events}</p>
          <Link to="/dashboard/events" className="mt-2 inline-block text-xs font-bold text-purple-600 hover:text-purple-700">
            View all →
          </Link>
        </div>

        <div className="milk-card rounded-lg p-6">
          <p className="text-sm font-medium text-pink-700">Sermons</p>
          <p className="mt-2 text-3xl font-bold text-pink-900">{stats.sermons}</p>
          <Link to="/dashboard/sermons" className="mt-2 inline-block text-xs font-bold text-pink-600 hover:text-pink-700">
            View all →
          </Link>
        </div>
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Distribution Chart */}
        <div className="milk-card rounded-lg p-6">
          <h2 className="font-serif text-xl font-bold text-brand-900">Content Distribution</h2>
          <p className="mt-1 text-sm text-stone-600">Items by content type</p>
          <div className="mt-4">
            {metrics.loading ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-stone-500">Loading...</p>
              </div>
            ) : (
              <ContentDistributionChart data={metrics} />
            )}
          </div>
        </div>

        {/* Status Chart */}
        <div className="milk-card rounded-lg p-6">
          <h2 className="font-serif text-xl font-bold text-brand-900">Content Status</h2>
          <p className="mt-1 text-sm text-stone-600">Published vs draft vs archived</p>
          <div className="mt-4">
            <ContentStatusChart 
              published={stats.announcements} 
              draft={0}
              archived={0}
            />
          </div>
        </div>
      </div>

      {/* Activity Trend Chart */}
      <div className="mt-6 milk-card rounded-lg p-6">
        <h2 className="font-serif text-xl font-bold text-brand-900">Activity Trend</h2>
        <p className="mt-1 text-sm text-stone-600">New content added in the last 7 days</p>
        <div className="mt-4">
          <ActivityTrendChart data={trendData} />
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="milk-card rounded-lg p-6">
          <h2 className="font-serif text-lg font-bold text-brand-900">Quick Insights</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-sm font-medium text-green-900">✓ Active Community</p>
              <p className="mt-1 text-xs text-green-700">You have {stats.prayerRequests} active prayer requests</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-900">📅 Upcoming Events</p>
              <p className="mt-1 text-xs text-blue-700">{stats.events} events scheduled ahead</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-sm font-medium text-amber-900">📢 Recent Announcements</p>
              <p className="mt-1 text-xs text-amber-700">{stats.announcements} announcements published</p>
            </div>
          </div>
        </div>

        <div className="milk-card rounded-lg p-6">
          <h2 className="font-serif text-lg font-bold text-brand-900">Recommended Actions</h2>
          <div className="mt-4 space-y-2">
            <Link
              to="/dashboard/announcements"
              className="block rounded-lg bg-brand-50 p-3 text-sm font-medium text-brand-900 hover:bg-brand-100"
            >
              + Create new announcement
            </Link>
            <Link
              to="/dashboard/events"
              className="block rounded-lg bg-purple-50 p-3 text-sm font-medium text-purple-900 hover:bg-purple-100"
            >
              + Schedule an event
            </Link>
            <Link
              to="/dashboard/people"
              className="block rounded-lg bg-indigo-50 p-3 text-sm font-medium text-indigo-900 hover:bg-indigo-100"
            >
              + Manage members
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
