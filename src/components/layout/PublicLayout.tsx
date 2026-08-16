import { Link, Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="relative z-10 border-b border-white/80 bg-white/55 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-serif text-2xl font-bold text-brand-900">Anglican <span className="font-normal">Church</span></Link>
          <div className="flex gap-5 text-sm font-semibold text-brand-900">
            <Link to="/about">About</Link><Link to="/events">Events</Link><Link to="/sermons">Sermons</Link>
            <Link to="/dashboard" className="text-brand-700">Dashboard</Link>
          </div>
        </nav>
      </header>
      <main><Outlet /></main>
      <footer className="mt-16 border-t border-white/70 bg-white/45 px-6 py-8 text-center text-sm text-stone-600 backdrop-blur">© {new Date().getFullYear()} Grace Community Church</footer>
    </div>
  )
}
