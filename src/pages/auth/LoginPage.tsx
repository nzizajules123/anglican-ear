import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import { auth, hasFirebaseConfig } from '../../lib/firebase'

export function LoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'sign-in' | 'register'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  if (user) return <Navigate to="/dashboard" replace />

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!auth) return
    setError('')
    try {
      if (mode === 'register') await createUserWithEmailAndPassword(auth, email, password)
      else await signInWithEmailAndPassword(auth, email, password)
      navigate(mode === 'register' ? '/complete-profile' : '/dashboard')
    } catch { setError(mode === 'register' ? 'We could not create your account. Check the details and Firebase Authentication settings.' : 'We could not sign you in. Check your email and password.') }
  }
  const google = async () => {
    if (!auth) return
    setError('')
    try { await signInWithPopup(auth, new GoogleAuthProvider()); navigate('/complete-profile') }
    catch { setError('Google sign-in could not be completed. Check Firebase Authentication settings.') }
  }

  return <section className="mx-auto max-w-md px-6 py-16"><h1 className="font-serif text-4xl font-bold">{mode === 'register' ? 'Create your account' : 'Church portal'}</h1><p className="mt-3 text-stone-600">{mode === 'register' ? 'Register to request access to your church dashboard.' : 'Sign in to access your church dashboard.'}</p>
    {!hasFirebaseConfig ? <p className="mt-8 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Firebase is not configured yet. Copy <code>.env.example</code> to <code>.env.local</code> and add the project values.</p> : <>
      <button onClick={google} className="mt-8 w-full rounded border border-stone-300 bg-white px-5 py-3 font-semibold">Continue with Google</button>
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-stone-400"><span className="h-px flex-1 bg-stone-200" />or<span className="h-px flex-1 bg-stone-200" /></div>
      <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded border border-stone-300 px-3 py-2" /></label><label className="block text-sm font-medium">Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded border border-stone-300 px-3 py-2" /></label><button className="w-full rounded bg-brand-700 px-5 py-3 font-semibold text-white">{mode === 'register' ? 'Create account' : 'Sign in'}</button></form>
      <button onClick={() => { setMode(mode === 'register' ? 'sign-in' : 'register'); setError('') }} className="mt-5 text-sm font-medium text-brand-700">{mode === 'register' ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>
    </>}{error && <p className="mt-4 text-sm text-red-700">{error}</p>}</section>
}
