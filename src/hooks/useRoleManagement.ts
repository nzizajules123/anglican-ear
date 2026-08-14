import { useState } from 'react'
import { db } from '../lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export function useRoleManagement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUserRole = async (userId: string, newRole: string): Promise<boolean> => {
    if (!db) {
      setError('Firebase not initialized')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        role: newRole,
        roleUpdatedAt: new Date(),
        roleUpdatedBy: 'admin', // This should come from auth context
      })
      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update role'
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }

  const requestRole = async (userId: string, requestedRole: string): Promise<boolean> => {
    if (!db) {
      setError('Firebase not initialized')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        requestedRole: requestedRole,
        roleRequestedAt: new Date(),
      })
      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to request role'
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    updateUserRole,
    requestRole,
    loading,
    error,
  }
}
