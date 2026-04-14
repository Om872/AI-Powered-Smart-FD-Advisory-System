import { useEffect, useState } from 'react'
import DashboardShell from '../components/DashboardShell'
import { API_BASE_URL, fetchCustomers } from '../services/api'

function CustomersPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 15

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const result = await fetchCustomers(page, pageSize)
        setData(result)
      } catch {
        setError('Unable to load customer history. Make sure backend is running.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0

  function getRiskBadge(level) {
    const map = {
      Low: 'bg-emerald-100 text-emerald-700',
      Medium: 'bg-amber-100 text-amber-700',
      High: 'bg-rose-100 text-rose-700',
    }
    return map[level] || 'bg-slate-100 text-slate-700'
  }

  return (
    <DashboardShell
      title="Customer History"
      subtitle="All analyzed customer records with pagination. Track customer pipeline performance."
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Customer Records
        </p>
        <a
          href={`${API_BASE_URL}/customers/export`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </a>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && !error && data ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {data.customers.length} of {data.total} customers
            </p>
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="px-2 font-semibold text-slate-700">
                {page} / {totalPages || 1}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Age</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Income</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Savings</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Risk</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.customers.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-b border-slate-100 transition hover:bg-blue-50/50 ${
                      i % 2 === 0 ? '' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">#{c.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.age}</td>
                    <td className="px-4 py-3 text-slate-600">
                      ₹{Math.round(c.income).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      ₹{Math.round(c.savings).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskBadge(
                          c.risk_level,
                        )}`}
                      >
                        {c.risk_level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}

                {data.customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-slate-400">
                      No customer records found. Start by analyzing a customer.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </DashboardShell>
  )
}

export default CustomersPage
