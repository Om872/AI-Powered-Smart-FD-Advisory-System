import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Investment Plans', to: '/#fd-plans', isAnchor: true },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()

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
          {/* Admin Panel link — always visible in navbar */}
          <Link
            to={isAuthenticated ? '/admin' : '/login'}
            className={`hidden items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition sm:inline-flex ${
              pathname.startsWith('/admin') || pathname.startsWith('/login')
                ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {isAuthenticated ? 'Admin Panel' : 'Admin Login'}
          </Link>

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
            <li className="pt-2 space-y-2">
              <Link
                to={isAuthenticated ? '/admin' : '/login'}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                {isAuthenticated ? 'Admin Panel' : 'Admin Login'}
              </Link>
              <Link
                to="/customer-input"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-center text-sm font-semibold text-white"
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

