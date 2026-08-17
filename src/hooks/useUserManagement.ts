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

export const seedUsers: UserWithStats[] = [
  {
    uid: 'usr-admin-1',
    displayName: 'Sir Arthur Sterling',
    email: 'admin@anglicanchurch.org',
    phoneNumber: '+1 (555) 019-2831',
    role: 'super_admin',
    status: 'active',
    itemsCreated: 24,
  },
  {
    uid: 'usr-pastor-1',
    displayName: 'The Ven. David Williams (Vicar)',
    email: 'vicar.david@anglicanchurch.org',
    phoneNumber: '+1 (555) 014-9821',
    role: 'pastor',
    status: 'active',
    itemsCreated: 38,
  },
  {
    uid: 'usr-sec-1',
    displayName: 'Mrs. Beatrice Holloway',
    email: 'secretary@anglicanchurch.org',
    phoneNumber: '+1 (555) 018-7742',
    role: 'secretary',
    status: 'active',
    itemsCreated: 45,
  },
  {
    uid: 'usr-choir-1',
    displayName: 'Dr. Julian Bennett (Choir Master)',
    email: 'choir.president@anglicanchurch.org',
    phoneNumber: '+1 (555) 013-4411',
    role: 'choir_president',
    choirName: 'Anglican Parish Cathedral Choir',
    status: 'active',
    itemsCreated: 19,
  },
  {
    uid: 'usr-youth-1',
    displayName: 'Emmanuel Joshua Osei',
    email: 'youth.leader@anglicanchurch.org',
    phoneNumber: '+1 (555) 012-9900',
    role: 'youth_leader',
    status: 'active',
    itemsCreated: 15,
  },
  {
    uid: 'usr-fin-1',
    displayName: 'Florence Nightingale-Smythe',
    email: 'treasurer@anglicanchurch.org',
    phoneNumber: '+1 (555) 017-3320',
    role: 'finance',
    status: 'active',
    itemsCreated: 30,
  },
  {
    uid: 'usr-med-1',
    displayName: 'Lucas Vance',
    email: 'media@anglicanchurch.org',
    phoneNumber: '+1 (555) 016-5544',
    role: 'media',
    status: 'active',
    itemsCreated: 12,
  },
  {
    uid: 'usr-evt-1',
    displayName: 'Clara Oswald',
    email: 'events@anglicanchurch.org',
    phoneNumber: '+1 (555) 015-6677',
    role: 'event_manager',
    status: 'active',
    itemsCreated: 18,
  },
  {
    uid: 'usr-req-1',
    displayName: 'Samuel Adeyemi',
    email: 'samuel.ade@example.com',
    phoneNumber: '+1 (555) 011-8899',
    role: 'member',
    requestedRole: 'choir_president',
    choirName: 'Tenor Section',
    status: 'active',
    itemsCreated: 2,
  },
  {
    uid: 'usr-mem-2',
    displayName: 'Hannah Montgomery',
    email: 'hannah.m@example.org',
    phoneNumber: '+1 (555) 010-4433',
    role: 'member',
    status: 'active',
    itemsCreated: 1,
  },
]

export function useUserManagement(role?: string, searchTerm?: string) {
  const [users, setUsers] = useState<UserWithStats[]>(seedUsers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db) {
      let filtered = [...seedUsers]
      if (role) filtered = filtered.filter((u) => u.role === role)
      if (searchTerm) {
        const s = searchTerm.toLowerCase()
        filtered = filtered.filter((u) => u.displayName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))
      }
      setUsers(filtered)
      setLoading(false)
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
        if (snapshot.empty) {
          let filtered = [...seedUsers]
          if (role) filtered = filtered.filter((u) => u.role === role)
          if (searchTerm) {
            const s = searchTerm.toLowerCase()
            filtered = filtered.filter((u) => u.displayName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))
          }
          setUsers(filtered)
        } else {
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
        }
        setError(null)
        setLoading(false)
      },
      (err) => {
        console.warn('Error fetching users, using seed data:', err)
        let filtered = [...seedUsers]
        if (role) filtered = filtered.filter((u) => u.role === role)
        if (searchTerm) {
          const s = searchTerm.toLowerCase()
          filtered = filtered.filter((u) => u.displayName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s))
        }
        setUsers(filtered)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [role, searchTerm])

  return { users, loading, error }
}
