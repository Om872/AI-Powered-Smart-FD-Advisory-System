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
import { fetchEnhancedAnalytics, fetchMLStatus } from '../services/api'

const PIE_COLORS = { Low: '#10B981', Medium: '#3B82F6', High: '#EF4444' }
const AGE_COLORS = ['#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD']
const INCOME_COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0']

function AdminPage() {
  const [analytics, setAnalytics] = useState(null)
  const [mlStatus, setMlStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      value: analytics ? `₹${Math.round(analytics.avg_income).toLocaleString('en-IN')}` : '—',
      format: 'raw',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
      ),
    },
    {
      title: 'Average Savings',
      value: analytics ? `₹${Math.round(analytics.avg_savings).toLocaleString('en-IN')}` : '—',
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
      items.push('Average savings above ₹2L indicates strong eligibility for 3-5 Year FD plans with higher returns.')
    } else if (analytics.avg_savings > 0) {
      items.push(`Average savings of ₹${Math.round(analytics.avg_savings).toLocaleString('en-IN')} suggests 1-3 Year FD plans are most suitable.`)
    }

    // Age insight
    if (analytics.avg_age) {
      items.push(`Average customer age is ${Math.round(analytics.avg_age)} years. ${analytics.avg_age > 35 ? 'Mature demographic favors conservative FD investments.' : 'Younger demographic — consider shorter tenures with growth incentives.'}`)
    }

    // Conversion insight
    if (analytics.predicted_conversion_rate > 60) {
      items.push(`High predicted conversion rate (${analytics.predicted_conversion_rate}%) — pipeline quality is excellent.`)
    } else if (analytics.predicted_conversion_rate > 0) {
      items.push(`Conversion rate at ${analytics.predicted_conversion_rate}% — focus AI nudges on lower-conversion segments.`)
    }

    return items
  }, [analytics])

  return (
    <DashboardShell
      title="Admin Analytics Panel"
      subtitle="Executive view for customer pipeline, conversion trends, and risk exposure."
    >
      <div className="mb-8">
        <p className="inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Control Center
        </p>
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
          {/* ML Model Status Banner */}
          {mlStatus ? (
            <section className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-5 text-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">ML Pipeline Status</p>
                  <p className="mt-1 text-lg font-bold">
                    {mlStatus.pipeline_exists ? '✅ Model Active' : '⚠️ Model Not Trained'}
                  </p>
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
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.model.includes('Ensemble') ? '#3B82F6' : '#94A3B8'} 
                          />
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
              <article
                key={kpi.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  {kpi.icon}
                </div>
                <p className="text-sm text-slate-500">{kpi.title}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {kpi.format === 'percent'
                    ? `${kpi.value}%`
                    : kpi.format === 'count'
                      ? kpi.value
                      : kpi.value}
                </p>
              </article>
            ))}
          </section>

          {/* Charts Row 1 — Risk + Age */}
          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Risk Segment Distribution</h2>
              <p className="mb-4 text-sm text-slate-500">Portfolio spread across customer risk categories</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {riskChartData.map((entry) => (
                        <Cell key={entry.name} fill={PIE_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
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
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {ageChartData.map((_, i) => (
                        <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          {/* Charts Row 2 — Income Bands */}
          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Income Band Distribution</h2>
              <p className="mb-4 text-sm text-slate-500">Customer monthly income segmentation</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeChartData}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {incomeChartData.map((_, i) => (
                        <Cell key={i} fill={INCOME_COLORS[i % INCOME_COLORS.length]} />
                      ))}
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
                        <p className="text-xs text-slate-500">
                          Age {c.age} · ₹{Math.round(c.income).toLocaleString('en-IN')}/mo · ₹{Math.round(c.savings).toLocaleString('en-IN')} savings
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskBadge(c.risk_level)}`}>
                        {c.risk_level}
                      </span>
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
            <h2 className="text-lg font-semibold text-slate-900">
              🧠 Auto Insights for Management
            </h2>
            <p className="mb-4 text-sm text-slate-500">AI-generated insights based on real customer data</p>
            {insights.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {insights.map((insight, i) => (
                  <p key={i} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {insight}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Add customer data to generate insights.</p>
            )}
          </section>
        </>
      ) : null}
    </DashboardShell>
  )
}

export default AdminPage
