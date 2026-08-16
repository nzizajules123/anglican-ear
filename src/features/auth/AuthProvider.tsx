import { onAuthStateChanged, type User } from 'firebase/auth'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'
import type { UserProfile } from '../../types/roles'

type AuthContextValue = {
  user: User | null
  profile: UserProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [authLoading, setAuthLoading] = useState(Boolean(auth))
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!user || !db) {
      setProfile(null)
      setProfileLoading(false)
      return
    }
    setProfileLoading(true)
    return onSnapshot(
      doc(db, 'users', user.uid),
      (snapshot) => {
        setProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null)
        setProfileLoading(false)
      },
      () => {
        // Permission-denied or offline: don't get stuck loading forever.
        setProfile(null)
        setProfileLoading(false)
      }
    )
  }, [user])

  // Stay "loading" until we know both auth state AND (if signed in) the profile —
  // otherwise ProtectedRoute can briefly see user-set/profile-null and misroute
  // a real returning user to /complete-profile for one render.
  const loading = authLoading || (Boolean(user) && profileLoading)
  const value = useMemo(() => ({ user, profile, loading }), [user, profile, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)