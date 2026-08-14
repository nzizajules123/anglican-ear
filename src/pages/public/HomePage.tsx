import { Link } from 'react-router-dom'

export function HomePage() {
  return <>
    <section className="relative isolate px-6 py-28 text-center before:absolute before:inset-x-[-15%] before:top-[-13rem] before:-z-10 before:h-[37rem] before:rounded-[50%] before:bg-[radial-gradient(ellipse_at_center,rgba(214,234,173,.95),rgba(77,113,59,.85)_55%,rgba(35,57,28,1))] before:blur-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-700">Welcome home</p>
      <h1 className="mx-auto mt-4 max-w-4xl font-serif text-5xl font-bold leading-tight text-brand-900 md:text-7xl">A softer place to grow <em className="font-normal">together.</em></h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-brand-900">Faith, family, and community for every generation—rooted in grace and open to you.</p>
      <Link to="/events" className="button-primary mt-8 inline-block px-6 py-3">Find an event</Link>
    </section>
    <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
      {['Join us Sunday', 'Watch sermons', 'Serve with us'].map((title) => <article key={title} className="milk-card p-7"><div className="mb-6 h-10 w-10 rounded-full bg-brand-50" /><h2 className="font-serif text-2xl font-bold text-brand-900">{title}</h2><p className="mt-2 text-stone-600">Public content and ministry information will live here.</p></article>)}
    </section>
  </>
}
