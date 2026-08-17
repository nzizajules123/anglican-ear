import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import { roleLabels } from '../../types/roles'
import {
  LayoutDashboard,
  TrendingUp,
  Bell,
  Calendar,
  BookOpen,
  HeartHandshake,
  Users,
  DollarSign,
  Mail,
  UserCheck,
  User,
  ArrowLeft,
  Church,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

export function DashboardLayout() {
  const { profile } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const role = profile?.role || 'member'
  const can = (...roles: string[]) => Boolean(role && roles.includes(role))

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const links = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, visible: true, end: true },
    { label: 'Analytics', to: '/dashboard/analytics', icon: TrendingUp, visible: can('super_admin', 'pastor', 'secretary') },
    { label: 'Announcements', to: '/dashboard/announcements', icon: Bell, visible: true },
    { label: 'Events & Services', to: '/dashboard/events', icon: Calendar, visible: true },
    { label: 'Sermons Vault', to: '/dashboard/sermons', icon: BookOpen, visible: true },
    { label: 'Pastoral Prayer Care', to: '/dashboard/prayer-requests', icon: HeartHandshake, visible: true },
    { label: 'Parish Ministries', to: '/dashboard/ministries', icon: Users, visible: can('super_admin', 'pastor', 'choir_president', 'youth_leader') },
    { label: 'Giving & Stewardship', to: '/dashboard/giving', icon: DollarSign, visible: can('super_admin', 'finance', 'pastor') },
    { label: 'Contact Messages', to: '/dashboard/contact-submissions', icon: Mail, visible: can('super_admin', 'pastor', 'secretary') },
    { label: 'People & Roles', to: '/dashboard/people', icon: UserCheck, visible: can('super_admin', 'pastor', 'secretary') },
    { label: 'My Profile', to: '/dashboard/profile', icon: User, visible: true },
  ]

  const getInitials = (name?: string) => {
    if (!name) return 'AC'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="dashboard-shell min-h-screen md:flex">
      {/* Mobile Sticky Header Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-brand-800/10 bg-brand-900/95 px-4 py-3 text-white backdrop-blur-md md:hidden shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
          >
            <Menu size={20} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-amber-200">
              <Church size={17} />
            </div>
            <div>
              <span className="font-serif text-base font-bold text-white leading-tight block">Anglican Church</span>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">Parish Portal</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-[11px] font-bold text-amber-200 border border-amber-400/30">
            {profile ? roleLabels[profile.role] : 'Member'}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-xs font-bold text-white border border-white/20">
            {getInitials(profile?.displayName)}
          </div>
        </div>
      </header>

      {/* Mobile Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Drawer */}
          <div className="fixed inset-y-0 left-0 flex w-4/5 max-w-xs flex-col justify-between bg-gradient-to-b from-[#182a13] via-[#243d1c] to-[#1d2b19] p-5 text-white shadow-2xl animate-slide-in">
            <div className="overflow-y-auto">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-amber-200">
                    <Church size={20} />
                  </div>
                  <div>
                    <span className="font-serif text-lg font-bold text-white">Anglican Church</span>
                    <p className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">Parish Portal</p>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Profile Info */}
              <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 font-bold text-white border border-white/20">
                    {getInitials(profile?.displayName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white">
                      {profile?.displayName || 'Anglican Parishioner'}
                    </p>
                    <span className="inline-block rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                      {profile ? roleLabels[profile.role] : 'Congregation Member'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Links List */}
              <nav className="mt-5 space-y-1">
                {links
                  .filter((l) => l.visible)
                  .map(({ label, to, icon: Icon, end }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition ${
                          isActive
                            ? 'bg-white/20 text-white shadow-xs'
                            : 'text-brand-50 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={17} className="text-amber-300/90" />
                        <span>{label}</span>
                      </span>
                      <ChevronRight size={14} className="text-white/40" />
                    </NavLink>
                  ))}
              </nav>
            </div>

            {/* Drawer Footer Link */}
            <div className="pt-4 border-t border-white/10">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-brand-100 transition hover:text-white py-2"
              >
                <ArrowLeft size={15} />
                Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar Navigation */}
      <aside className="dashboard-nav hidden md:sticky md:top-0 md:h-screen md:w-72 md:flex md:flex-col md:justify-between px-5 py-6 text-white overflow-y-auto shrink-0 shadow-2xl">
        <div>
          {/* Church Branding Header */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-amber-200 backdrop-blur-md shadow-xs">
              <Church size={22} />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Anglican <span className="font-light text-brand-100">Church</span>
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-bold">Parish Portal</p>
            </div>
          </Link>

          {/* User Profile Summary Card */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 font-bold text-white shadow-xs border border-white/20">
                {getInitials(profile?.displayName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">
                  {profile?.displayName || 'Anglican Parishioner'}
                </p>
                <span className="inline-block rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                  {profile ? roleLabels[profile.role] : 'Congregation Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1 text-xs">
            {links
              .filter((l) => l.visible)
              .map(({ label, to, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-medium transition ${
                      isActive
                        ? 'bg-white/20 text-white font-bold shadow-xs'
                        : 'text-brand-50 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={16} className="shrink-0 text-amber-300/90" />
                  <span>{label}</span>
                </NavLink>
              ))}
          </nav>
        </div>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-brand-100 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Return to Public Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 sm:px-6 md:p-10 max-w-7xl overflow-x-hidden min-w-0">
        <Outlet />
      </main>
    </div>
  )
}