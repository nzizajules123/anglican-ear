import { useState } from 'react'
import { useAuth } from '../../features/auth/AuthProvider'
import { Role } from '../../types/roles'
import { RolePreviewSwitcher } from '../../components/dashboard/RolePreviewSwitcher'
import { canPreviewRoles } from '../../lib/permissions'
import { SuperAdminDashboard } from '../../components/dashboard/roles/SuperAdminDashboard'
import { PastorDashboard } from '../../components/dashboard/roles/PastorDashboard'
import { SecretaryDashboard } from '../../components/dashboard/roles/SecretaryDashboard'
import { ChoirPresidentDashboard } from '../../components/dashboard/roles/ChoirPresidentDashboard'
import { YouthLeaderDashboard } from '../../components/dashboard/roles/YouthLeaderDashboard'
import { FinanceDashboard } from '../../components/dashboard/roles/FinanceDashboard'
import { MediaDashboard } from '../../components/dashboard/roles/MediaDashboard'
import { EventManagerDashboard } from '../../components/dashboard/roles/EventManagerDashboard'
import { MemberDashboard } from '../../components/dashboard/roles/MemberDashboard'

export function DashboardPage() {
  const { profile } = useAuth()
  const currentRole: Role = profile?.role || 'member'
  const [simulatedRole, setSimulatedRole] = useState<Role | null>(null)

  // Only a super admin or a pastor may preview the site as another role.
  const canPreview = canPreviewRoles(profile)
  const effectiveRole: Role = (canPreview && simulatedRole) || currentRole

  const renderRoleDashboard = () => {
    switch (effectiveRole) {
      case 'super_admin':
        return <SuperAdminDashboard />
      case 'pastor':
        return <PastorDashboard />
      case 'secretary':
        return <SecretaryDashboard />
      case 'choir_president':
        return <ChoirPresidentDashboard />
      case 'youth_leader':
        return <YouthLeaderDashboard />
      case 'finance':
        return <FinanceDashboard />
      case 'media':
        return <MediaDashboard />
      case 'event_manager':
        return <EventManagerDashboard />
      case 'member':
      default:
        return <MemberDashboard />
    }
  }

  return (
    <div className="w-full">
      {/* Role Preview & Simulation Switcher — super admin and pastor only */}
      {canPreview && (
        <RolePreviewSwitcher
          currentRole={currentRole}
          effectiveRole={effectiveRole}
          onSelectRole={(newRole) => setSimulatedRole(newRole)}
          onReset={() => setSimulatedRole(null)}
        />
      )}

      {/* Render the specialized Role Dashboard */}
      {renderRoleDashboard()}
    </div>
  )
}
