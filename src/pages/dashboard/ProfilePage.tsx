import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import { auth } from '../../lib/firebase'
import { roleLabels } from '../../types/roles'

export function ProfilePage() {
  const { profile, user } = useAuth(); const navigate = useNavigate()
  return <section><p className="eyebrow">Your account</p><h1 className="page-title">Profile</h1><article className="milk-card mt-6 max-w-2xl p-6"><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Name</dt><dd className="mt-1 font-semibold">{profile?.displayName}</dd></div><div><dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Role</dt><dd className="mt-1 font-semibold">{profile ? roleLabels[profile.role] : ''}</dd></div><div><dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Email</dt><dd className="mt-1">{user?.email}</dd></div><div><dt className="text-xs font-bold uppercase tracking-wider text-stone-500">Phone</dt><dd className="mt-1">{profile?.phoneNumber}</dd></div></dl><button onClick={async () => { if (auth) await signOut(auth); navigate('/') }} className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">Sign out</button></article></section>
}
