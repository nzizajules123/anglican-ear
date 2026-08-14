import { collection, onSnapshot, query, updateDoc, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { roleLabels, roles, type UserProfile } from '../../types/roles'

export function PeoplePage() {
  const [people, setPeople] = useState<UserProfile[]>([])
  const [error, setError] = useState('')
  useEffect(() => { if (!db) return; return onSnapshot(query(collection(db, 'users')), (snapshot) => setPeople(snapshot.docs.map((item) => item.data() as UserProfile)), () => setError('Your role does not have permission to view the member directory.')) }, [])
  const changeRole = async (person: UserProfile, role: UserProfile['role']) => { if (!db) return; try { await updateDoc(doc(db, 'users', person.uid), { role }) } catch { setError('Role could not be updated. Only a super admin may assign roles.') } }
  return <section><p className="eyebrow">Church family</p><h1 className="page-title">People & roles</h1><p className="mt-2 text-stone-600">Review membership details and assign responsibility with care.</p>{!db && <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Connect Firebase to view and manage your actual member directory.</p>}{error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="mt-6 overflow-hidden rounded-3xl border border-white/70 bg-white/70"><table className="w-full text-left text-sm"><thead className="bg-brand-50 text-brand-900"><tr><th className="p-4">Name</th><th className="p-4">Contact</th><th className="p-4">Requested</th><th className="p-4">Assigned role</th></tr></thead><tbody>{people.map((person) => <tr key={person.uid} className="border-t border-stone-100"><td className="p-4 font-medium">{person.displayName}</td><td className="p-4 text-stone-600">{person.email}<br />{person.phoneNumber}</td><td className="p-4">{person.requestedRole ? roleLabels[person.requestedRole] : '—'}</td><td className="p-4"><select value={person.role} onChange={(event) => changeRole(person, event.target.value as UserProfile['role'])} className="field py-1.5">{roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></td></tr>)}</tbody></table></div></section>
}
