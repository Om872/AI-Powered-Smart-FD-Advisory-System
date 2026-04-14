function FDCard({ plan }) {
  return (
    <article
      className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        plan.featured
          ? 'border-blue-300 ring-2 ring-blue-100'
          : 'border-slate-200'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-900">{plan.tenure}</h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {plan.riskTag}
        </span>
      </div>

      <p className="text-sm text-slate-600">{plan.description}</p>

      <div className="mt-6 space-y-3 text-sm">
        <p className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <span className="text-slate-500">Interest Rate</span>
          <span className="font-semibold text-slate-900">{plan.interestRate}</span>
        </p>
        <p className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <span className="text-slate-500">Minimum Amount</span>
          <span className="font-semibold text-slate-900">
            {plan.minimumAmount}
          </span>
        </p>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        Select Plan
      </button>
    </article>
  )
}

export default FDCard
