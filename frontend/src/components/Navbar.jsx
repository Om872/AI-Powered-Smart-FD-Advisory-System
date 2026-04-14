import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Platform Home', to: '/' },
  { label: 'Investment Plans', to: '/#fd-plans', isAnchor: true },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  function isActive(to) {
    if (to === '/') return pathname === '/'
    return pathname.startsWith(to)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E3A8A] text-sm font-bold text-white shadow-md">
            FD
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">FD Intelligence</p>
            <p className="text-xs text-slate-500">AI Advisory Platform</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <li key={link.label}>
                <a
                  className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-[#1E3A8A]"
                  href={link.to}
                >
                  {link.label}
                </a>
              </li>
            ) : (
              <li key={link.label}>
                <Link
                  className={`rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-[#1E3A8A] ${
                    isActive(link.to) ? 'bg-blue-50 text-[#1E3A8A]' : ''
                  }`}
                  to={link.to}
                >
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/customer-input"
            className="hidden rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-500/25 sm:inline-flex"
          >
            Analyze Customer
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white px-6 pb-4 pt-2 md:hidden">
          <ul className="space-y-1 text-sm font-medium text-slate-600">
            {navLinks.map((link) =>
              link.isAnchor ? (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 transition hover:bg-slate-100"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 transition hover:bg-slate-100 ${
                      isActive(link.to) ? 'bg-blue-50 text-[#1E3A8A]' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
            <li className="pt-2">
              <Link
                to="/customer-input"
                onClick={() => setMobileOpen(false)}
                className="block mb-2 rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Analyze Customer
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar

