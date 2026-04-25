import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DashboardShell from '../components/DashboardShell'

function getRiskStyle(riskLevel) {
  if (riskLevel === 'High') return 'bg-rose-100 text-rose-700'
  if (riskLevel === 'Low') return 'bg-emerald-100 text-emerald-700'
  return 'bg-amber-100 text-amber-700'
}

function buildDashboardData(customer) {
  const fallback = {
    name: 'Guest Customer',
    age: 30,
    income: 65000,
    savings: 220000,
    riskLevel: 'Medium',
  }
  const profile = customer || fallback

  const conversionProbability = Math.min(
    96,
    Math.max(
      28,
      Math.round(
        35 + profile.savings / 18000 + profile.income / 12000 + (profile.age > 26 ? 8 : 0),
      ),
    ),
  )
  const recommendedPlan =
    profile.riskLevel === 'Low'
      ? 'Callable FD — 12 Months'
      : profile.riskLevel === 'High'
        ? 'Non-Callable FD — 60 Months'
        : 'Callable FD — 36 Months'

  const rateMap = {
    'Callable FD — 12 Months': 6.25,
    'Callable FD — 36 Months': 7.25,
    'Non-Callable FD — 60 Months': 9.50,
  }
  const activeRate = rateMap[recommendedPlan] || 7.25
  const estimatedAnnualReturn = Math.round(profile.savings * (activeRate / 100))

  const investmentGrowth = [
    { month: 'Jan', amount: profile.savings },
    { month: 'Feb', amount: profile.savings * (1 + activeRate / 1200) },
    { month: 'Mar', amount: profile.savings * (1 + (activeRate / 1200) * 2) },
    { month: 'Apr', amount: profile.savings * (1 + (activeRate / 1200) * 3) },
    { month: 'May', amount: profile.savings * (1 + (activeRate / 1200) * 4) },
    { month: 'Jun', amount: profile.savings * (1 + (activeRate / 1200) * 5) },
  ].map((point) => ({ ...point, amount: Math.round(point.amount) }))

  const interestTrends = [
    { tenure: 'FD 6M', rate: 6.10 },
    { tenure: 'FD 12M', rate: 6.25 },
    { tenure: 'FD 36M', rate: 7.25 },
    { tenure: 'NCFD 36M', rate: 8.50 },
    { tenure: 'NCFD 60M', rate: 9.50 },
    { tenure: 'NCFD 120M', rate: 11.50 },
  ]

  const customerInsights = [
    { name: 'Savings Capacity', value: Math.max(5, Math.round(profile.savings / 25000)) },
    { name: 'Income Stability', value: Math.max(5, Math.round(profile.income / 10000)) },
    {
      name: 'Risk Appetite',
      value: profile.riskLevel === 'High' ? 26 : profile.riskLevel === 'Low' ? 12 : 18,
    },
  ]

  return {
    profile,
    conversionProbability,
    recommendedPlan,
    estimatedAnnualReturn,
    investmentGrowth,
    interestTrends,
    customerInsights,
  }
}

function AnalysisPage() {
  const location = useLocation()
  const customer = location.state?.customer
  const apiData = location.state?.apiData

  // ── Guard: redirect to form if no customer data ──────────────────────────
  if (!customer) {
    return <Navigate to="/customer-input" replace />
  }

  const {
    profile,
    conversionProbability,
    recommendedPlan,
    estimatedAnnualReturn,
    investmentGrowth,
    interestTrends,
    customerInsights,
  } = buildDashboardData(customer)
  const backendProbability = apiData?.prediction?.conversion_probability
  const backendPlan = apiData?.recommendation?.recommended_plan
  const backendEstimatedReturn = apiData?.recommendation?.estimated_annual_return
  const backendRationale = apiData?.recommendation?.rationale
  const backendWillInvest = apiData?.prediction?.will_invest_fd
  const backendConfidenceBand = apiData?.prediction?.confidence_band
  const activeProbability = backendProbability ?? conversionProbability
  const activePlan = backendPlan ?? recommendedPlan
  const activeEstimatedReturn = backendEstimatedReturn ?? estimatedAnnualReturn
  const pieColors = ['#1E3A8A', '#3B82F6', '#10B981']
  const [simIncome, setSimIncome] = useState(profile.income)
  const [simSavings, setSimSavings] = useState(profile.savings)

  const simulation = useMemo(() => {
    // Extract rate from plan name or use default
    const planRates = {
      'Callable FD — 6 Months': 6.10, 'Callable FD — 12 Months': 6.25,
      'Callable FD — 24 Months': 6.75, 'Callable FD — 36 Months': 7.25,
      'Callable FD — 60 Months': 7.90, 'Callable FD — 120 Months': 8.90,
      'Non-Callable FD — 18 Months': 8.00, 'Non-Callable FD — 24 Months': 8.25,
      'Non-Callable FD — 36 Months': 8.50, 'Non-Callable FD — 60 Months': 9.50,
      'Non-Callable FD — 72 Months': 10.50, 'Non-Callable FD — 120 Months': 11.50,
      'Recurring Deposit — 36 Months': 7.25, 'Daily Deposit — 1825 Days': 9.00,
    }
    const baseRate = planRates[activePlan] || 7.25
    const projectedReturn = Math.round((simSavings * baseRate) / 100)
    const affordabilityScore = Math.min(100, Math.round((simIncome / 150000) * 100))
    return { baseRate, projectedReturn, affordabilityScore }
  }, [activePlan, simIncome, simSavings])

  return (
    <DashboardShell
      title="AI Advisory Dashboard"
      subtitle="AI-driven conversion prediction, personalized deposit recommendation, risk profiling, and trend analysis based on Shubhanjana schemes."
    >

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-slate-500">FD Conversion Probability</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {activeProbability}%
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Confidence: {backendConfidenceBand || 'Estimated'}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-slate-500">Recommended FD Plan</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{activePlan}</p>
            <p className="mt-2 text-xs text-slate-500">Based on income, savings, risk</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-slate-500">Risk Level Indicator</p>
            <div className="mt-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${getRiskStyle(profile.riskLevel)}`}
              >
                {profile.riskLevel}
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500">Dynamic customer risk profile</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-sm text-slate-500">Estimated Annual Return</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              INR {Math.round(activeEstimatedReturn).toLocaleString('en-IN')}
            </p>
            <p className="mt-2 text-xs text-slate-500">Projection for recommended plan</p>
          </article>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Investment Growth</h2>
            <p className="mb-4 text-sm text-slate-500">Projected growth over next months</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={investmentGrowth}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#1E3A8A"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Interest Trends</h2>
            <p className="mb-4 text-sm text-slate-500">Current rate comparison by tenure</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interestTrends}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="tenure" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Customer Summary Panel</h2>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <p className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-700">Name:</span> {profile.name}
              </p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-700">Age:</span> {profile.age}
              </p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-700">Income:</span> INR{' '}
                {profile.income.toLocaleString('en-IN')}
              </p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-700">Savings:</span> INR{' '}
                {profile.savings.toLocaleString('en-IN')}
              </p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="font-semibold text-slate-700">Risk Level:</span>{' '}
                {profile.riskLevel}
              </p>
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                {backendWillInvest === false
                  ? 'Lower conversion likelihood detected. Consider lower-risk advisory approach.'
                  : `Customer appears suitable for ${activePlan} recommendation.`}
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Customer Insights</h2>
            <p className="mb-4 text-sm text-slate-500">Composite score distribution</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerInsights}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label
                  >
                    {customerInsights.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Projected FD Interest Curve</h2>
          <p className="mb-4 text-sm text-slate-500">
            Area trend showing expected interest accumulation
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={investmentGrowth}>
                <defs>
                  <linearGradient id="interestCurve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#interestCurve)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recommendation Explainability</h2>
          <p className="mt-2 text-sm text-slate-600">
            {backendRationale ||
              'Plan selection is based on income stability, savings strength, risk profile, and model confidence.'}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <p className="font-semibold text-slate-800">Liquidity Fit</p>
              <p className="mt-1 text-slate-600">
                Savings corpus indicates suitability for {activePlan}.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <p className="font-semibold text-slate-800">Risk Alignment</p>
              <p className="mt-1 text-slate-600">
                {profile.riskLevel} risk profile matched with tenure duration.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <p className="font-semibold text-slate-800">Model Confidence</p>
              <p className="mt-1 text-slate-600">
                {activeProbability}% conversion likelihood, confidence {backendConfidenceBand || 'Estimated'}.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">What-If Simulator</h2>
            <p className="mb-4 text-sm text-slate-500">
              Tune income and savings to see live advisory impact.
            </p>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Monthly Income</span>
                  <span>INR {Math.round(simIncome).toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="300000"
                  step="1000"
                  value={simIncome}
                  onChange={(event) => setSimIncome(Number(event.target.value))}
                  className="w-full accent-[#1E3A8A]"
                />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Total Savings</span>
                  <span>INR {Math.round(simSavings).toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="3000000"
                  step="5000"
                  value={simSavings}
                  onChange={(event) => setSimSavings(Number(event.target.value))}
                  className="w-full accent-[#10B981]"
                />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Action Center</h2>
            <p className="mb-4 text-sm text-slate-500">
              Advisor-ready actions based on simulation
            </p>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-800">Projected Return</p>
                <p className="text-slate-600">
                  INR {simulation.projectedReturn.toLocaleString('en-IN')} yearly at {simulation.baseRate}% p.a.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-800">Affordability Score</p>
                <p className="text-slate-600">{simulation.affordabilityScore}/100 for recommended tenure.</p>
              </div>
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
                Suggest customer to start with {activePlan} and review quarterly for upsell to longer tenure.
              </div>
            </div>
          </article>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/customer-input"
            className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Edit Customer Inputs
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
            Print Report
          </button>
          <Link
            to="/"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Go to Landing Page
          </Link>
        </div>
    </DashboardShell>
  )
}

export default AnalysisPage
