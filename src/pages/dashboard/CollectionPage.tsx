import { useAuth } from '../../features/auth/AuthProvider'
import { CollectionManager } from '../../components/dashboard/CollectionManager'
import type { ChurchCollection } from '../../lib/church-data'
import type { Role } from '../../types/roles'

export function CollectionPage({ collection, editors, amount, memberCreate = false, memberRead = true }: { collection: ChurchCollection; editors: Role[]; amount?: boolean; memberCreate?: boolean; memberRead?: boolean }) {
  const { profile } = useAuth()
  const canManage = Boolean(profile && editors.includes(profile.role))
  return <CollectionManager collection={collection} includeAmount={amount} canManage={canManage} canCreate={canManage || memberCreate} canRead={canManage || memberRead} />
}
