import { Link, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const sideLinks = [
  { label: 'Customer Intake', to: '/customer-input' },
  { label: 'AI Dashboard', to: '/analysis' },
  { label: 'Customer History', to: '/customers' },
  { label: 'Admin Analytics', to: '/admin' },
]

function DashboardShell({ title, subtitle, children }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto flex max-w-7xl gap-6 px-6 py-10 md:px-10">
        <aside className="sticky top-24 hidden h-fit w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Workspace
          </p>
          <nav className="space-y-1 text-sm">
            {sideLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block rounded-lg px-3 py-2 font-medium transition hover:bg-slate-100 hover:text-[#1E3A8A] ${
                  pathname === link.to
                    ? 'bg-blue-50 text-[#1E3A8A]'
                    : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 flex-1 animate-page-enter">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{title}</h1>
            {subtitle ? <p className="mt-2 text-slate-600">{subtitle}</p> : null}
          </div>
          {children}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default DashboardShell

