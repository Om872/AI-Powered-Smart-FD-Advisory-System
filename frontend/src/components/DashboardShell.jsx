import Navbar from './Navbar'
import Footer from './Footer'

function DashboardShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-2 text-slate-600">{subtitle}</p> : null}
        </div>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default DashboardShell
