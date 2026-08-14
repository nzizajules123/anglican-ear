import { doc, setDoc } from 'firebase/firestore'
import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import { db } from '../../lib/firebase'
import { roleLabels, roles, type Role } from '../../types/roles'

export function CompleteProfilePage() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.displayName ?? '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '')
  const [requestedRole, setRequestedRole] = useState<Role>('member')
  const [error, setError] = useState('')
  if (loading) return <p className="p-8">Loading your account…</p>
  if (!user) return <Navigate to="/login" replace />
  if (profile) return <Navigate to="/dashboard" replace />
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!db || !user.email) return setError('Firebase is not configured correctly.')
    try {
      await setDoc(doc(db, 'users', user.uid), { uid: user.uid, displayName: name.trim(), email: user.email, phoneNumber: phoneNumber.trim(), role: 'member', requestedRole })
      navigate('/dashboard')
    } catch { setError('We could not save your profile. Please try again or contact the church office.') }
  }
  return <section className="mx-auto max-w-md px-6 py-16"><h1 className="font-serif text-4xl font-bold">Complete your profile</h1><p className="mt-3 text-stone-600">Tell us a little about yourself. Church leaders review requested roles before access is granted.</p><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm font-medium">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded border border-stone-300 px-3 py-2" /></label><label className="block text-sm font-medium">Phone number<input required type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} className="mt-1 w-full rounded border border-stone-300 px-3 py-2" /></label><label className="block text-sm font-medium">Requested role<select value={requestedRole} onChange={(event) => setRequestedRole(event.target.value as Role)} className="mt-1 w-full rounded border border-stone-300 px-3 py-2">{roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></label><button className="w-full rounded bg-brand-700 px-5 py-3 font-semibold text-white">Save profile</button></form>{error && <p className="mt-4 text-sm text-red-700">{error}</p>}</section>
}
