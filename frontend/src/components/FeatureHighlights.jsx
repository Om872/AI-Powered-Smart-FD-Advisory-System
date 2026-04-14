const features = [
  {
    title: 'FD & DDS Conversion Prediction',
    description:
      'Predict which members are likely to invest in FD or Daily Deposit schemes with confidence scores.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    color: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Members-First Advisory Dashboard',
    description:
      'Monitor risk profile, growth trajectory, and member segments with transparent insights.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'Co-operative Intelligence Assistant',
    description:
      'Answer member queries on FD returns, KYC reminders, and savings guidance instantly.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: 'bg-violet-100 text-violet-700',
  },
]

function FeatureHighlights() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
      <div className="mb-8">
        <p className="mb-2 inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Shubhanjana Capabilities
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Built on trust, designed for growth
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} transition group-hover:scale-110`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeatureHighlights

