import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import { roleLabels } from '../../types/roles'

export function DashboardLayout() {
  const { profile } = useAuth()
  const role = profile?.role
  const can = (...roles: string[]) => Boolean(role && roles.includes(role))
  const links: Array<[string, string, boolean]> = [
    ['Overview', '/dashboard', true], ['Analytics', '/dashboard/analytics', can('super_admin', 'pastor', 'secretary')], ['Announcements', '/dashboard/announcements', true], ['Events', '/dashboard/events', true], ['Sermons', '/dashboard/sermons', true], ['Prayer care', '/dashboard/prayer-requests', true],
    ['Ministries', '/dashboard/ministries', can('super_admin', 'pastor', 'choir_president', 'youth_leader')], ['Giving', '/dashboard/giving', can('super_admin', 'finance')], ['People & roles', '/dashboard/people', can('super_admin', 'pastor', 'secretary')], ['My profile', '/dashboard/profile', true],
  ]
  return (
    <div className="dashboard-shell min-h-screen md:flex">
      <aside className="dashboard-nav w-full px-5 py-6 text-white md:sticky md:top-0 md:h-screen md:w-72">
        <Link to="/" className="font-serif text-2xl font-bold">Grace <span className="font-normal text-brand-50">Community</span></Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-brand-50">{profile ? roleLabels[profile.role] : 'Church member'}</p>
        <nav className="mt-4 flex gap-1 overflow-x-auto text-sm md:flex-col md:overflow-visible">{links.filter(([, , visible]) => visible).map(([label, to]) => <NavLink key={to} to={to} end={to === '/dashboard'} className={({ isActive }) => `dashboard-link ${isActive ? 'dashboard-link-active' : ''}`}>{label}</NavLink>)}</nav>
        <Link to="/" className="mt-8 block text-sm text-brand-50 hover:text-white">← Public website</Link>
      </aside>
      <main className="flex-1 p-6 md:p-10"><Outlet /></main>
    </div>
  )
}
