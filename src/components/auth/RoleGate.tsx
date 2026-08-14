import { Navigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import type { ReactNode } from 'react'
import type { Role } from '../../types/roles'

export function RoleGate({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { profile } = useAuth()
  return profile && roles.includes(profile.role) ? <>{children}</> : <Navigate to="/dashboard" replace />
}
