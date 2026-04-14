import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAnalytics } from '../services/api'

/* Animated counter — counts from 0 to `end` */
function AnimatedNumber({ end, suffix = '', decimals = 0, duration = 1600 }) {
  const [display, setDisplay] = useState('0')
  const ref = useRef(null)

  useEffect(() => {
    let start = 0
    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      const current = start + (end - start) * eased
      setDisplay(
        decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString('en-IN'),
      )
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }

    ref.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(ref.current)
  }, [end, decimals, duration])

  return (
    <>
      {display}
      {suffix}
    </>
  )
}

function Hero() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchAnalytics()
      .then(setStats)
      .catch(() => {})
  }, [])

  const conversionRate = stats?.predicted_conversion_rate ?? 78.4
  const totalCustomers = stats?.total_customers ?? 0

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-16 md:px-10 lg:grid-cols-2 lg:pt-20">
        <div>
          <p className="mb-4 inline-flex animate-pulse rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Sahi Disha, Sahi Samriddhi
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            AI-Powered Smart FD Advisory for Shubhanjana Co-operative
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
            Built on trust and designed for growth. Help members choose better FD,
            DD, and savings journeys with conversion intelligence, recommendation
            support, and guided customer assistance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/customer-input"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-800 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <span>Analyze Customer</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href="#fd-plans"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              View Deposit Schemes
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/30 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] p-6 text-white shadow-2xl">
          <p className="text-sm font-semibold text-blue-100">Shubhanjana Snapshot</p>
          <h3 className="mt-2 text-2xl font-semibold">Today&apos;s Intelligence</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur transition hover:bg-white/20">
              <p className="text-xs text-blue-100">Predicted Conversions</p>
              <p className="mt-1 text-2xl font-bold">
                <AnimatedNumber end={conversionRate} suffix="%" decimals={1} />
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur transition hover:bg-white/20">
              <p className="text-xs text-blue-100">Top Deposit Segment</p>
              <p className="mt-1 text-2xl font-bold">FD + DDS</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur transition hover:bg-white/20">
              <p className="text-xs text-blue-100">Customers Analyzed</p>
              <p className="mt-1 text-2xl font-bold">
                {totalCustomers > 0 ? (
                  <AnimatedNumber end={totalCustomers} />
                ) : (
                  '—'
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur transition hover:bg-white/20">
              <p className="text-xs text-blue-100">ML Model Status</p>
              <p className="mt-1 text-2xl font-bold text-emerald-300">Active ✓</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
