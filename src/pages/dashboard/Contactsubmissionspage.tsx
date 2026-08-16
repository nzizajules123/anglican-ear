import { useAuth } from '../../features/auth/AuthProvider'
import { ContactSubmissionsManager } from '../../components/dashboard/ContactSubmissionsManager'
import type { Role } from '../../types/roles'

export function ContactSubmissionsPage({ editors }: { editors: Role[] }) {
  const { profile } = useAuth()
  const canManage = Boolean(profile && editors.includes(profile.role))
  return <ContactSubmissionsManager canManage={canManage} />
}