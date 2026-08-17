import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Church, Menu, X, ArrowRight, User } from 'lucide-react'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/80 bg-white/70 backdrop-blur-xl shadow-xs">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-800 text-amber-300 shadow-xs">
              <Church size={20} />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-brand-900">
                Anglican <span className="font-normal text-brand-700">Church</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-brand-900">
            <NavLink to="/about" className={({ isActive }) => `transition hover:text-brand-700 ${isActive ? 'text-brand-700 font-bold' : ''}`}>
              About
            </NavLink>
            <NavLink to="/events" className={({ isActive }) => `transition hover:text-brand-700 ${isActive ? 'text-brand-700 font-bold' : ''}`}>
              Events
            </NavLink>
            <NavLink to="/sermons" className={({ isActive }) => `transition hover:text-brand-700 ${isActive ? 'text-brand-700 font-bold' : ''}`}>
              Sermons
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `transition hover:text-brand-700 ${isActive ? 'text-brand-700 font-bold' : ''}`}>
              Contact
            </NavLink>
            <Link
              to="/dashboard"
              className="rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800 active:scale-95 flex items-center gap-1.5"
            >
              <User size={14} /> Parish Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white/80 text-brand-900 shadow-xs md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile Dropdown Nav Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-brand-100 bg-white/95 px-6 py-5 md:hidden shadow-lg backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col gap-3 text-sm font-semibold text-brand-900">
              <NavLink to="/about" className="py-2 border-b border-stone-100 flex items-center justify-between">
                <span>About</span> <ArrowRight size={14} className="text-stone-400" />
              </NavLink>
              <NavLink to="/events" className="py-2 border-b border-stone-100 flex items-center justify-between">
                <span>Events & Services</span> <ArrowRight size={14} className="text-stone-400" />
              </NavLink>
              <NavLink to="/sermons" className="py-2 border-b border-stone-100 flex items-center justify-between">
                <span>Sermons & Liturgy</span> <ArrowRight size={14} className="text-stone-400" />
              </NavLink>
              <NavLink to="/contact" className="py-2 border-b border-stone-100 flex items-center justify-between">
                <span>Contact Office</span> <ArrowRight size={14} className="text-stone-400" />
              </NavLink>
              <Link
                to="/dashboard"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-bold text-white shadow-md text-center"
              >
                <User size={16} /> Enter Parish Portal Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/70 bg-white/45 px-6 py-8 text-center text-xs text-stone-600 backdrop-blur">
        <p className="font-semibold text-brand-900">Anglican Church of the Epiphany</p>
        <p className="mt-1 text-stone-500">© {new Date().getFullYear()} Anglican Church. Dedicated to worship, fellowship, and parish care.</p>
      </footer>
    </div>
  )
}