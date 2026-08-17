import { useAuth } from '../../features/auth/AuthProvider'
import { can } from '../../lib/permissions'
import { EventManager } from '../../components/dashboard/EventManager'

export function EventsPage() {
  const { profile } = useAuth()
  return <EventManager canManage={can(profile?.role, 'manageEvents')} />
}
