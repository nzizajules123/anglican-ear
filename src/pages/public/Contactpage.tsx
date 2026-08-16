import { useState, type FormEvent } from 'react'
import { submitContactForm } from '../../lib/church-data'
import { hasFirebaseConfig } from '../../lib/firebase'

export function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const formData = new FormData(e.currentTarget)
      await submitContactForm({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        subject: (formData.get('subject') as string) || undefined,
        message: formData.get('message') as string,
      })
      setStatus('sent')
      e.currentTarget.reset()
    } catch {
      setStatus('error')
    }
  }

  return <>
    <section className="relative isolate px-6 py-24 text-center before:absolute before:inset-x-[-15%] before:top-[-13rem] before:-z-10 before:h-[37rem] before:rounded-[50%] before:bg-[radial-gradient(ellipse_at_center,rgba(214,234,173,.95),rgba(77,113,59,.85)_55%,rgba(35,57,28,1))] before:blur-2xl">
      <p className="eyebrow">Grace Community</p>
      <h1 className="page-title">Let's stay connected</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-stone-600">Questions, prayer requests, or just want to say hello? Reach out—we'd love to hear from you.</p>
    </section>

    <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 md:grid-cols-5">
      <div className="milk-card p-8 md:col-span-3">
        <h2 className="font-serif text-2xl font-bold text-brand-900">Send a message</h2>

        {!hasFirebaseConfig && (
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            Firebase is not configured yet, so messages can't be saved right now.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-brand-900">Name</span>
              <input name="name" type="text" required className="mt-1.5 w-full rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-stone-800 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-100" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-brand-900">Email</span>
              <input name="email" type="email" required className="mt-1.5 w-full rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-stone-800 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-100" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-semibold text-brand-900">Subject</span>
            <input name="subject" type="text" className="mt-1.5 w-full rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-stone-800 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-100" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-brand-900">Message</span>
            <textarea name="message" required rows={5} className="mt-1.5 w-full rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-stone-800 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-100" />
          </label>
          <button type="submit" disabled={status === 'submitting' || !hasFirebaseConfig} className="button-primary mt-2 justify-self-start px-6 py-3 disabled:opacity-60">
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'sent' && <p className="text-sm font-semibold text-brand-700">Thank you—your message has been sent.</p>}
          {status === 'error' && <p className="text-sm font-semibold text-red-700">Something went wrong. Please try again.</p>}
        </form>
      </div>

      <div className="grid gap-6 md:col-span-2">
        <article className="milk-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Visit us</p>
          <h2 className="mt-2 font-serif text-xl font-bold text-brand-900">Sunday Service</h2>
          <p className="mt-2 text-stone-600">123 Grace Avenue<br />Your City, ST 00000</p>
          <p className="mt-2 text-stone-600">Sundays at 9:00 & 11:00 AM</p>
        </article>
        <article className="milk-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Get in touch</p>
          <h2 className="mt-2 font-serif text-xl font-bold text-brand-900">Reach out directly</h2>
          <p className="mt-2 text-stone-600">hello@gracecommunity.org</p>
          <p className="mt-1 text-stone-600">(555) 123-4567</p>
        </article>
        <article className="milk-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Office hours</p>
          <h2 className="mt-2 font-serif text-xl font-bold text-brand-900">We're here for you</h2>
          <p className="mt-2 text-stone-600">Mon–Fri, 9:00 AM – 4:00 PM</p>
        </article>
      </div>
    </section>
  </>
}