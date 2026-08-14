import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import type { Role } from '../../types/roles'

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <p className="p-8 text-stone-600">Loading your account…</p>
  if (!user) return <Navigate to="/login" replace />
  if (!profile) return <Navigate to="/complete-profile" replace />
  if (allowedRoles && !allowedRoles.includes(profile.role)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
