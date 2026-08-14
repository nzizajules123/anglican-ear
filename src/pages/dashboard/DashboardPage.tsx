import { useAuth } from '../../features/auth/AuthProvider'
import { roleLabels } from '../../types/roles'
import { StatCard } from '../../components/dashboard/StatCard'
import { ActivityFeed } from '../../components/dashboard/ActivityFeed'
import { useCollectionStats, useRecentActivity } from '../../hooks'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const { profile } = useAuth()
  const stats = useCollectionStats()
  const { activities, loading: activitiesLoading } = useRecentActivity()
  const canPublish = ['super_admin', 'pastor', 'secretary', 'event_manager'].includes(profile?.role ?? '')
  
  return (
    <section>
      <p className="eyebrow">Church dashboard</p>
      <h1 className="page-title">
        Good to see you{profile ? `, ${profile.displayName.split(' ')[0]}` : ''}.
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Your role: <span className="font-semibold text-brand-700">
          {profile ? roleLabels[profile.role] : 'Member'}
        </span>. Keep your ministry, people, and plans flowing from one calm place.
      </p>

      {canPublish && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/dashboard/announcements" className="button-primary">
            + Add announcement
          </Link>
          <Link to="/dashboard/events" className="rounded-xl border border-brand-500 bg-white/60 px-4 py-2.5 text-sm font-bold text-brand-700">
            + Add event
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          label="Upcoming events" 
          value={stats.events} 
          caption="Plan and schedule" 
          loading={stats.loading}
        />
        <StatCard 
          label="Announcements" 
          value={stats.announcements} 
          caption="Keep everyone informed" 
          loading={stats.loading}
        />
        <StatCard 
          label="Prayer requests" 
          value={stats.prayerRequests} 
          caption="Care for your community" 
          loading={stats.loading}
        />
        <StatCard 
          label="Sermons" 
          value={stats.sermons} 
          caption="Spiritual resources" 
          loading={stats.loading}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ActivityFeed activities={activities} loading={activitiesLoading} />
        
        <article className="milk-card p-6 lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold text-brand-900">Next steps</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-brand-50 p-4">
              <p className="font-semibold text-brand-900">Complete your profile</p>
              <p className="mt-1 text-sm text-brand-700">Make sure your information is up to date.</p>
              <Link to="/dashboard/profile" className="mt-2 inline-block text-sm font-bold text-brand-600 hover:text-brand-700">
                View profile →
              </Link>
            </div>
            
            {canPublish && (
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="font-semibold text-blue-900">Post content</p>
                <p className="mt-1 text-sm text-blue-700">Share announcements, events, or sermons with the community.</p>
                <Link to="/dashboard/announcements" className="mt-2 inline-block text-sm font-bold text-blue-600 hover:text-blue-700">
                  Create content →
                </Link>
              </div>
            )}

            <div className="rounded-lg bg-purple-50 p-4">
              <p className="font-semibold text-purple-900">Community engagement</p>
              <p className="mt-1 text-sm text-purple-700">Submit prayer requests and connect with your church family.</p>
              <Link to="/dashboard/prayer-requests" className="mt-2 inline-block text-sm font-bold text-purple-600 hover:text-purple-700">
                Explore →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
