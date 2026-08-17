import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { UserProfile, Role } from '../types/roles'

export interface UserWithStats extends UserProfile {
  itemsCreated?: number
  lastActive?: Date
  joinedDate?: Date
  status?: 'active' | 'inactive'
}

export function useUserManagement(role?: string, searchTerm?: string) {
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db) {
      setUsers([])
      setLoading(false)
      setError('Firebase not initialized')
      return
    }

    const firestore = db
    const constraints: any[] = []
    if (role) {
      constraints.push(where('role', '==', role))
    }

    const q = constraints.length > 0 ? query(collection(firestore, 'users'), ...constraints) : collection(firestore, 'users')

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let userList = snapshot.docs.map((doc) => ({
          ...(doc.data() as UserProfile),
          itemsCreated: 0,
          status: 'active' as const,
        }))

        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase()
          userList = userList.filter(
            (user) =>
              user.displayName.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower)
          )
        }
        setUsers(userList)
        setError(null)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching users:', err)
        setUsers([])
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [role, searchTerm])

  return { users, loading, error }
}