import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthProvider'
import { useCollectionStats, useRecentActivity } from '../../../hooks'
import { useUserManagement } from '../../../hooks/useUserManagement'
import { useRoleManagement } from '../../../hooks/useRoleManagement'
import { useExport } from '../../../hooks/useExport'
import { roleLabels, roles, Role } from '../../../types/roles'
import { StatCard } from '../StatCard'
import { ActivityFeed } from '../ActivityFeed'
import {
  Users,
  Shield,
  DollarSign,
  Calendar,
  Bell,
  BookOpen,
  Mail,
  Download,
  Database,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Search,
  ArrowRight,
  TrendingUp,
  Activity as PulseActivity,
} from 'lucide-react'

export function SuperAdminDashboard() {
  const { profile } = useAuth()
  const stats = useCollectionStats()
  const { activities, loading: activitiesLoading } = useRecentActivity()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const { users, loading: usersLoading } = useUserManagement(roleFilter || undefined, searchTerm)
  const { updateUserRole, loading: updatingRole } = useRoleManagement()
  const { exportToCSV, exportToJSON } = useExport()
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Pending role approval requests
  const pendingRequests = users.filter((u) => u.requestedRole && u.requestedRole !== u.role)

  const handleApproveRole = async (userId: string, role: string) => {
    const success = await updateUserRole(userId, role)
    if (success) {
      setActionSuccess(`Successfully approved role as ${roleLabels[role as Role]}`)
      setTimeout(() => setActionSuccess(null), 4000)
    }
  }

  const handleExportUsers = () => {
    const data = users.map((u) => ({
      Name: u.displayName,
      Email: u.email,
      Phone: u.phoneNumber || 'N/A',
      Role: roleLabels[u.role],
      'Requested Role': u.requestedRole ? roleLabels[u.requestedRole] : 'None',
      Status: u.status || 'Active',
    }))
    exportToCSV(data, 'anglican-parish-directory')
  }

  const totalMembers = users.length
  const totalLeadership = users.filter((u) => u.role !== 'member').length

  return (
    <section className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Shield size={13} /> Diocesan & Parish Super Admin
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                Full Access Authority
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Parish Executive Command Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              Welcome, <span className="font-semibold text-white">{profile?.displayName || 'Administrator'}</span>. Complete administrative oversight across clergy, parish registry, liturgical ministries, finances, and communications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportUsers}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              <Download size={16} />
              Export Directory
            </button>
            <Link
              to="/dashboard/analytics"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500 active:scale-95"
            >
              <TrendingUp size={16} />
              Full Analytics
            </Link>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 border border-emerald-200 shadow-sm animate-fade-in">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Pending Role Approvals Alert */}
      {pendingRequests.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-200 p-2 text-amber-900">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  {pendingRequests.length} Pending Role Elevation Request{pendingRequests.length > 1 ? 's' : ''}
                </h3>
                <p className="mt-0.5 text-xs text-amber-800">
                  Parishioners have requested leadership or ministry roles awaiting your pastoral authorization.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/people"
              className="rounded-xl bg-amber-700 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-amber-800"
            >
              Review all
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.map((req) => (
              <div key={req.uid} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-xs border border-amber-100">
                <div>
                  <p className="text-xs font-bold text-stone-900">{req.displayName}</p>
                  <p className="text-[11px] text-stone-500">{req.email}</p>
                  <span className="mt-1 inline-block text-[10px] font-semibold text-amber-800">
                    Requested: <strong>{req.requestedRole ? roleLabels[req.requestedRole] : ''}</strong>
                  </span>
                </div>
                {req.requestedRole && (
                  <button
                    onClick={() => handleApproveRole(req.uid, req.requestedRole!)}
                    disabled={updatingRole}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <UserCheck size={13} />
                    Approve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Executive Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Parish Registry"
          value={totalMembers}
          caption={`${totalLeadership} active leaders & staff`}
          loading={usersLoading}
        />
        <StatCard
          label="Upcoming Services & Events"
          value={stats.events}
          caption="Liturgical calendar events"
          loading={stats.loading}
        />
        <StatCard
          label="Pastoral Care & Prayers"
          value={stats.prayerRequests}
          caption="Active prayer intercessions"
          loading={stats.loading}
        />
        <StatCard
          label="Financial Giving Records"
          value={stats.giving}
          caption="Verified stewardship batches"
          loading={stats.loading}
        />
      </div>

      {/* Quick Administrative Operations Hub */}
      <div className="milk-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-900">Parish Administration Hub</h2>
            <p className="mt-1 text-xs text-stone-600">Direct shortcuts to manage each area of parish ministry.</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            9 Ministries
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/dashboard/people"
            className="group flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white/80 p-5 transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-md"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-800 transition group-hover:bg-brand-700 group-hover:text-white">
                <Users size={20} />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-brand-900">People & Roles</h3>
              <p className="mt-1 text-xs text-stone-600">Assign clergy, leaders, staff roles, and directory data.</p>
            </div>
            <span className="mt-4 flex items-center text-xs font-bold text-brand-700 group-hover:text-brand-900">
              Manage members <ArrowRight size={13} className="ml-1 transition group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/dashboard/giving"
            className="group flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white/80 p-5 transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 transition group-hover:bg-emerald-700 group-hover:text-white">
                <DollarSign size={20} />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-emerald-950">Financial Stewardship</h3>
              <p className="mt-1 text-xs text-stone-600">Tithes, harvest pledges, and cathedral building fund ledger.</p>
            </div>
            <span className="mt-4 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
              View giving ledger <ArrowRight size={13} className="ml-1 transition group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/dashboard/announcements"
            className="group flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white/80 p-5 transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-md"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800 transition group-hover:bg-blue-700 group-hover:text-white">
                <Bell size={20} />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-blue-950">Parish Announcements</h3>
              <p className="mt-1 text-xs text-stone-600">Publish Sunday notices, circulars, and pastoral bulletins.</p>
            </div>
            <span className="mt-4 flex items-center text-xs font-bold text-blue-700 group-hover:text-blue-900">
              Publish notice <ArrowRight size={13} className="ml-1 transition group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            to="/dashboard/contact-submissions"
            className="group flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white/80 p-5 transition hover:-translate-y-1 hover:border-purple-500 hover:shadow-md"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-800 transition group-hover:bg-purple-700 group-hover:text-white">
                <Mail size={20} />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-purple-950">Inquiries & Office Desk</h3>
              <p className="mt-1 text-xs text-stone-600">Review public messages, baptism requests, and hall bookings.</p>
            </div>
            <span className="mt-4 flex items-center text-xs font-bold text-purple-700 group-hover:text-purple-900">
              Check inbox <ArrowRight size={13} className="ml-1 transition group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>

      {/* Member Directory & Role Assignment Quick Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="milk-card p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-900">Congregation & Staff Directory</h2>
              <p className="mt-1 text-xs text-stone-600">Manage user permissions and leadership assignments.</p>
            </div>
            <Link
              to="/dashboard/people"
              className="text-xs font-bold text-brand-700 hover:underline"
            >
              Full directory view →
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search member by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="field pl-9 text-xs"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="field w-auto text-xs"
            >
              <option value="">All Roles ({users.length})</option>
              {roles.map((r) => (
                <option key={r} value={r}>{roleLabels[r]}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-stone-50 text-stone-700 font-semibold">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Quick Assign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {users.slice(0, 6).map((u) => (
                  <tr key={u.uid} className="hover:bg-stone-50/80 transition">
                    <td className="p-3 font-semibold text-stone-900">{u.displayName}</td>
                    <td className="p-3 text-stone-500">{u.email}</td>
                    <td className="p-3">
                      <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 font-bold text-brand-800">
                        {roleLabels[u.role]}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => handleApproveRole(u.uid, e.target.value)}
                        disabled={updatingRole}
                        className="rounded-lg border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-medium text-stone-800 outline-none hover:bg-white focus:ring-1 focus:ring-brand-500"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>{roleLabels[r]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Stream & System Diagnostics */}
        <div className="space-y-6">
          <ActivityFeed activities={activities} loading={activitiesLoading} />

          <div className="milk-card p-5">
            <h3 className="font-serif text-lg font-bold text-brand-900 flex items-center gap-2">
              <Database size={18} className="text-brand-700" />
              Parish System Diagnostics
            </h3>
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-stone-50 p-2.5">
                <span className="text-stone-600">Database Engine</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active & Synchronized
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-stone-50 p-2.5">
                <span className="text-stone-600">Parish Identity</span>
                <span className="font-semibold text-brand-900">Anglican Church of the Epiphany</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-stone-50 p-2.5">
                <span className="text-stone-600">Role-Based Access Control</span>
                <span className="font-semibold text-emerald-700">9 Active Roles</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200/60 flex gap-2">
              <button
                onClick={() => exportToJSON(users, 'anglican-parish-backup')}
                className="flex-1 rounded-xl bg-stone-100 py-2 text-xs font-bold text-stone-800 hover:bg-stone-200 text-center"
              >
                Export JSON Backup
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
