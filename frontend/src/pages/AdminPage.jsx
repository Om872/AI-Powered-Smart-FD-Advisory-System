import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Cell,
  Legend,
} from 'recharts'
import DashboardShell from '../components/DashboardShell'
import { API_BASE_URL, fetchCustomers, fetchEnhancedAnalytics, fetchMLStatus } from '../services/api'

const PIE_COLORS = { Low: '#10B981', Medium: '#3B82F6', High: '#EF4444' }
const AGE_COLORS = ['#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD']
const INCOME_COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0']

function AdminPage() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [analytics, setAnalytics] = useState(null)
  const [mlStatus, setMlStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Customer History state
  const [custData, setCustData] = useState(null)
  const [custLoading, setCustLoading] = useState(false)
  const [custError, setCustError] = useState('')
  const [custPage, setCustPage] = useState(1)
  const custPageSize = 15

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true)
        const [analyticsData, mlData] = await Promise.all([
          fetchEnhancedAnalytics(),
          fetchMLStatus(),
        ])
        setAnalytics(analyticsData)
        setMlStatus(mlData)
      } catch {
        setError('Unable to load analytics right now. Check backend server.')
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // Load customers when Customer History tab is active
  useEffect(() => {
    if (activeTab !== 'customers') return
    async function loadCustomers() {
      try {
        setCustLoading(true)
        const result = await fetchCustomers(custPage, custPageSize)
        setCustData(result)
      } catch {
        setCustError('Unable to load customer history. Make sure backend is running.')
      } finally {
        setCustLoading(false)
      }
    }
    loadCustomers()
  }, [activeTab, custPage])

  const riskChartData = useMemo(() => {
    if (!analytics) return []
    return [
      { name: 'Low', value: analytics.risk_distribution.Low || 0 },
      { name: 'Medium', value: analytics.risk_distribution.Medium || 0 },
      { name: 'High', value: analytics.risk_distribution.High || 0 },
    ]
  }, [analytics])

  const ageChartData = useMemo(() => {
    if (!analytics?.age_distribution) return []
    return Object.entries(analytics.age_distribution).map(([name, value]) => ({
      name,
      value,
    }))
  }, [analytics])

  const incomeChartData = useMemo(() => {
    if (!analytics?.income_bands) return []
    return Object.entries(analytics.income_bands).map(([name, value]) => ({
      name,
      value,
    }))
  }, [analytics])

  const featureImportanceData = useMemo(() => {
    if (!mlStatus?.feature_importance) return []
    return Object.entries(mlStatus.feature_importance).map(([name, value]) => ({
      name: name.replace('risk_level_', 'Risk: ').replace(/^./, str => str.toUpperCase()),
      value: Math.round(value * 100),
    }))
  }, [mlStatus])

  const kpis = [
    {
      title: 'Total Customers',
      value: analytics?.total_customers ?? 0,
      format: 'count',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      ),
    },
    {
      title: 'Predicted Conversion',
      value: analytics?.predicted_conversion_rate ?? 0,
      format: 'percent',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
      ),
    },
    {
      title: 'Average Income',
      value: analytics ? `INR ${Math.round(analytics.avg_income).toLocaleString('en-IN')}` : '-',
      format: 'raw',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
      ),
    },
    {
      title: 'Average Savings',
      value: analytics ? `INR ${Math.round(analytics.avg_savings).toLocaleString('en-IN')}` : '-',
      format: 'raw',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
      ),
    },
  ]

  function getRiskBadge(level) {
    const map = {
      Low: 'bg-emerald-100 text-emerald-700',
      Medium: 'bg-amber-100 text-amber-700',
      High: 'bg-rose-100 text-rose-700',
    }
    return map[level] || 'bg-slate-100 text-slate-700'
  }

  // Dynamic insights based on real data
  const insights = useMemo(() => {
    if (!analytics) return []
    const items = []

    // Risk insight
    const riskMax = Object.entries(analytics.risk_distribution).sort((a, b) => b[1] - a[1])[0]
    if (riskMax && riskMax[1] > 0) {
      items.push(`${riskMax[0]} risk customers form the largest cohort (${riskMax[1]} customers). ${riskMax[0] === 'Medium' ? 'These members are ideal for 3Y FD conversion campaigns.' : ''}`)
    }

    // Savings insight
    if (analytics.avg_savings > 200000) {
      items.push('Average savings above INR 2L indicates strong eligibility for 3-5 Year FD plans with higher returns.')
    } else if (analytics.avg_savings > 0) {
      items.push(`Average savings of INR ${Math.round(analytics.avg_savings).toLocaleString('en-IN')} suggests 1-3 Year FD plans are most suitable.`)
    }

    // Age insight
    if (analytics.avg_age) {
      items.push(`Average customer age is ${Math.round(analytics.avg_age)} years. ${analytics.avg_age > 35 ? 'Mature demographic favors conservative FD investments.' : 'Younger demographic - consider shorter tenures with growth incentives.'}`)
    }

    // Conversion insight
    if (analytics.predicted_conversion_rate > 60) {
      items.push(`High predicted conversion rate (${analytics.predicted_conversion_rate}%) - pipeline quality is excellent.`)
    } else if (analytics.predicted_conversion_rate > 0) {
      items.push(`Conversion rate at ${analytics.predicted_conversion_rate}% - focus AI nudges on lower-conversion segments.`)
    }

    return items
  }, [analytics])

  return (
    <DashboardShell
      title="Admin Panel"
      subtitle="Manage customer records, analytics, and AI model performance."
    >
      {/* Header + Tabs */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E3A8A]/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Control Center</p>
            <p className="text-xs text-slate-400">Shubhanjana Co-operative Intelligence</p>
          </div>
        </div>
        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'customers'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Customer Records
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="mt-4 h-7 w-20 rounded bg-slate-200" />
              <div className="mt-4 h-3 w-28 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <>
              {/* ML Model Status Banner */}
              {mlStatus ? (
                <section className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-5 text-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">ML Pipeline</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${mlStatus.pipeline_exists ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <p className="text-lg font-bold">{mlStatus.pipeline_exists ? 'Model Active' : 'Model Not Trained'}</p>
                      </div>
                    </div>
                    {mlStatus.model_accuracy ? (
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-400">{mlStatus.model_accuracy}%</p>
                          <p className="text-xs text-slate-300">Accuracy</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-400">{mlStatus.roc_auc}%</p>
                          <p className="text-xs text-slate-300">ROC-AUC</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-amber-400">{mlStatus.training_samples?.toLocaleString()}</p>
                          <p className="text-xs text-slate-300">Training Samples</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-300">{mlStatus.hint}</p>
                    )}
                  </div>
                </section>
              ) : null}

              {/* Detailed ML Insights */}
              {mlStatus?.feature_importance && mlStatus?.model_comparisons ? (
                <section className="mb-6 grid w-full gap-5 lg:grid-cols-3">
                  <article className="lg:col-span-1 min-w-0 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">AI Decision Drivers</h2>
                    <p className="mb-4 text-sm text-slate-500">Feature importance % (Random Forest)</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={featureImportanceData} layout="vertical" margin={{ left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Importance']} />
                          <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]}>
                            {featureImportanceData.map((_, i) => (
                              <Cell key={i} fill={['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'][i % 4]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </article>

                  <article className="lg:col-span-1 min-w-0 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Confusion Matrix</h2>
                    <p className="mb-4 text-sm text-slate-500">Test set evaluation</p>
                    <div className="flex h-64 items-center justify-center">
                      <div className="w-full max-w-sm rounded border border-slate-200">
                        <div className="grid grid-cols-3 text-center text-sm">
                          <div className="border-b border-r border-slate-200 bg-slate-50 p-2 text-slate-500">True \ Pred</div>
                          <div className="border-b border-r border-slate-200 bg-slate-50 p-2 font-medium text-slate-700">Not Invest</div>
                          <div className="border-b border-slate-200 bg-slate-50 p-2 font-medium text-slate-700">Invest</div>
                          <div className="border-b border-r border-slate-200 bg-slate-50 p-3 font-medium text-slate-700">Not Invest</div>
                          <div className="border-b border-r border-slate-200 bg-red-50 p-3 text-lg font-semibold text-red-700">{mlStatus.confusion_matrix[0][0]}</div>
                          <div className="border-b border-slate-200 p-3 text-lg text-slate-600">{mlStatus.confusion_matrix[0][1]}</div>
                          <div className="border-r border-slate-200 bg-slate-50 p-3 font-medium text-slate-700">Invest</div>
                          <div className="border-r border-slate-200 p-3 text-lg text-slate-600">{mlStatus.confusion_matrix[1][0]}</div>
                          <div className="bg-emerald-50 p-3 text-lg font-semibold text-emerald-700">{mlStatus.confusion_matrix[1][1]}</div>
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="lg:col-span-1 min-w-0 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">Model Comparison</h2>
                    <p className="mb-4 text-sm text-slate-500">Test accuracy</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mlStatus?.model_comparisons || []} margin={{ top: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="model" tick={{ fontSize: 11 }} />
                          <YAxis domain={['dataMin - 5', 'auto']} tick={{ fontSize: 11 }} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                          <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                            {(mlStatus?.model_comparisons || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.model.includes('Ensemble') ? '#3B82F6' : '#94A3B8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </article>
                </section>
              ) : null}

              {/* KPI Cards */}
              <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {kpis.map((kpi) => (
                  <article key={kpi.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">{kpi.icon}</div>
                    <p className="text-sm text-slate-500">{kpi.title}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {kpi.format === 'percent' ? `${kpi.value}%` : kpi.value}
                    </p>
                  </article>
                ))}
              </section>

              {/* Charts Row 1 */}
              <section className="mt-6 grid gap-5 lg:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Risk Segment Distribution</h2>
                  <p className="mb-4 text-sm text-slate-500">Portfolio spread across customer risk categories</p>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={riskChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                          {riskChartData.map((entry) => (<Cell key={entry.name} fill={PIE_COLORS[entry.name]} />))}
                        </Pie>
                        <Tooltip /><Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Age Distribution</h2>
                  <p className="mb-4 text-sm text-slate-500">Customer age demographic breakdown</p>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageChartData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                        <XAxis dataKey="name" /><YAxis /><Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {ageChartData.map((_, i) => (<Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </article>
              </section>

              {/* Charts Row 2 */}
              <section className="mt-6 grid gap-5 lg:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Income Band Distribution</h2>
                  <p className="mb-4 text-sm text-slate-500">Customer monthly income segmentation</p>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={incomeChartData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                        <XAxis dataKey="name" /><YAxis /><Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {incomeChartData.map((_, i) => (<Cell key={i} fill={INCOME_COLORS[i % INCOME_COLORS.length]} />))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                {/* Recent Customers */}
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Recent Customers</h2>
                  <p className="mb-4 text-sm text-slate-500">Last 5 analyzed customer profiles</p>
                  {analytics?.recent_customers?.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.recent_customers.map((c) => (
                        <div key={c.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                            <p className="text-xs text-slate-500">Age {c.age} &middot; INR {Math.round(c.income).toLocaleString('en-IN')}/mo &middot; INR {Math.round(c.savings).toLocaleString('en-IN')} savings</p>
                          </div>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskBadge(c.risk_level)}`}>{c.risk_level}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-sm text-slate-400">No customers yet. Start analyzing customers to see data here.</p>
                  )}
                </article>
              </section>

              {/* AI Insights */}
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Auto Insights</h2>
                <p className="mb-4 text-sm text-slate-500">AI-generated insights based on real customer data</p>
                {insights.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {insights.map((insight, i) => (
                      <p key={i} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{insight}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Add customer data to generate insights.</p>
                )}
              </section>
            </>
          )}

          {/* CUSTOMER HISTORY TAB */}
          {activeTab === 'customers' && (
            <section>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {custData ? `Showing ${custData.customers.length} of ${custData.total} customers` : ''}
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

              {custLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200" />))}
                </div>
              ) : custError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{custError}</div>
              ) : custData ? (
                <>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          {['ID', 'Name', 'Age', 'Income', 'Savings', 'Risk', 'Date'].map((h) => (
                            <th key={h} className="px-4 py-3 font-semibold text-slate-600">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {custData.customers.length === 0 ? (
                          <tr><td colSpan="7" className="px-4 py-12 text-center text-slate-400">No customer records found. Start by analyzing a customer.</td></tr>
                        ) : custData.customers.map((c, i) => (
                          <tr key={c.id} className={`border-b border-slate-100 transition hover:bg-blue-50/50 ${i % 2 !== 0 ? 'bg-slate-50/50' : ''}`}>
                            <td className="px-4 py-3 font-mono text-xs text-slate-400">#{c.id}</td>
                            <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                            <td className="px-4 py-3 text-slate-600">{c.age}</td>
                            <td className="px-4 py-3 text-slate-600">INR {Math.round(c.income).toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3 text-slate-600">INR {Math.round(c.savings).toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskBadge(c.risk_level)}`}>{c.risk_level}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-400">
                              {new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-4 flex justify-end gap-2 text-sm">
                    <button type="button" onClick={() => setCustPage((p) => Math.max(1, p - 1))} disabled={custPage <= 1}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">
                      â† Prev
                    </button>
                    <span className="flex items-center px-2 font-semibold text-slate-700">
                      {custPage} / {Math.ceil((custData.total || 1) / custPageSize) || 1}
                    </span>
                    <button type="button" onClick={() => setCustPage((p) => Math.min(Math.ceil(custData.total / custPageSize), p + 1))}
                      disabled={custPage >= Math.ceil(custData.total / custPageSize)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">
                      Next â†’
                    </button>
                  </div>
                </>
              ) : null}
            </section>
          )}
        </>
      ) : null}
    </DashboardShell>
  )
}

export default AdminPage
