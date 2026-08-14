import { UserWithStats } from '../../hooks/useUserManagement'
import { roleLabels, roles } from '../../types/roles'
import { useRoleManagement } from '../../hooks/useRoleManagement'
import { useState } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'

interface UserManagementTableProps {
  users: UserWithStats[]
  onUserUpdate?: () => void
}

export function UserManagementTable({ users, onUserUpdate }: UserManagementTableProps) {
  const { updateUserRole, loading, error } = useRoleManagement()
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({})

  const handleRoleChange = async (userId: string, newRole: string) => {
    const success = await updateUserRole(userId, newRole)
    if (success) {
      setExpandedUserId(null)
      onUserUpdate?.()
    }
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg bg-stone-50 p-8 text-center">
        <p className="text-stone-600">No users found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-900 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-stone-200">
            <th className="px-4 py-3 text-left font-semibold text-stone-700">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-stone-700">Email</th>
            <th className="px-4 py-3 text-left font-semibold text-stone-700">Current Role</th>
            <th className="px-4 py-3 text-left font-semibold text-stone-700">Status</th>
            <th className="px-4 py-3 text-center font-semibold text-stone-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.uid}
              className="border-b border-stone-200 hover:bg-stone-50"
            >
              <td className="px-4 py-3">{user.displayName}</td>
              <td className="px-4 py-3 text-stone-600">{user.email}</td>
              <td className="px-4 py-3">
                <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-900">
                  {roleLabels[user.role]}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-900'
                      : 'bg-stone-100 text-stone-900'
                  }`}
                >
                  {user.status || 'Active'}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => setExpandedUserId(expandedUserId === user.uid ? null : user.uid)}
                  className="inline-flex items-center gap-1 rounded-lg bg-stone-200 px-3 py-1.5 text-xs font-medium text-stone-900 hover:bg-stone-300"
                >
                  <ChevronDown size={14} />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Expandable role selector */}
      {expandedUserId && (
        <div className="border-t-2 border-stone-200 bg-stone-50 p-6">
          {users
            .filter((u) => u.uid === expandedUserId)
            .map((user) => (
              <div key={user.uid}>
                <h3 className="font-semibold text-stone-900">Change role for {user.displayName}</h3>
                <p className="mt-1 text-sm text-stone-600">Current role: {roleLabels[user.role]}</p>

                <div className="mt-4 space-y-2">
                  {roles.map((role) => (
                    <label key={role} className="flex items-center gap-3 rounded-lg p-3 hover:bg-white">
                      <input
                        type="radio"
                        name={`role-${user.uid}`}
                        value={role}
                        checked={selectedRole[user.uid] === role}
                        onChange={(e) => setSelectedRole({ ...selectedRole, [user.uid]: e.target.value })}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium text-stone-900">{roleLabels[role]}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      if (selectedRole[user.uid]) {
                        handleRoleChange(user.uid, selectedRole[user.uid])
                      }
                    }}
                    disabled={loading || !selectedRole[user.uid]}
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Role'}
                  </button>
                  <button
                    onClick={() => setExpandedUserId(null)}
                    className="rounded-lg bg-stone-300 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
