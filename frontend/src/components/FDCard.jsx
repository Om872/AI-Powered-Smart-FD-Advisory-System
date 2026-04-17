import { Link } from 'react-router-dom'

const tagColors = {
  'Callable': 'bg-blue-100 text-blue-700',
  'Non-Callable': 'bg-amber-100 text-amber-700',
  'Monthly Savings': 'bg-emerald-100 text-emerald-700',
  'Daily Savings': 'bg-purple-100 text-purple-700',
}

function FDCard({ plan }) {
  const tagClass = tagColors[plan.tag] || 'bg-slate-100 text-slate-700'

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        plan.featured
          ? 'border-blue-300 ring-2 ring-blue-200/60'
          : 'border-slate-200'
      }`}
    >
      {plan.featured && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-blue-600 px-3 py-1 text-xs font-bold text-white">
          Most Popular
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{plan.subtitle}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${tagClass}`}>
          {plan.tag}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">{plan.description}</p>

      {/* Interest Rate Highlight */}
      <div className="mt-5 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Interest Rate Range</p>
        <p className="mt-1 text-2xl font-extrabold text-[#1E3A8A]">{plan.rateRange}</p>
        {plan.seniorBonus && (
          <p className="mt-1 text-xs font-medium text-emerald-600">+0.5% extra for Senior Citizens & Freedom Fighters</p>
        )}
      </div>

      {/* Rate Table */}
      <div className="mt-4 space-y-1.5 text-sm">
        {plan.rates.map((r) => (
          <div key={r.tenure} className="flex items-center justify-between rounded-lg px-3 py-1.5 odd:bg-slate-50">
            <span className="text-slate-500">{r.tenure}</span>
            <span className="font-semibold text-slate-800">{r.rate}</span>
          </div>
        ))}
      </div>

      <Link
        to="/customer-input"
        className="mt-6 block w-full rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        Get Started
      </Link>
    </article>
  )
}

export default FDCard
