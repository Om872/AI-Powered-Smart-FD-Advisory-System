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
    <section id="home" className="relative overflow-hidden bg-slate-950 pb-20 pt-24 lg:pt-32">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-500/20 blur-[100px]" />
      <div className="absolute top-40 left-10 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 md:px-10 lg:grid-cols-2">
        <div className="z-10 text-center lg:text-left">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-blue-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            Next-Gen Financial Intelligence
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:leading-tight">
            AI-powered <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">FD Advisory</span> System
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400 lg:mx-0">
            Transform ordinary customer interactions into highly personalized deposits. 
            Harness the power of predictive AI to suggest the perfect FD plans and significantly boost conversion rates.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              to="/customer-input"
              className="group relative inline-flex items-center justify-center justify-between gap-3 overflow-hidden rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.7)]"
            >
              <span className="relative z-10">Try Now</span>
              <svg className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path></svg>
              <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>
            <a
              href="#fd-plans"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 px-8 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-md transition-all hover:border-slate-500 hover:bg-slate-700 hover:text-white"
            >
              Explore Features
            </a>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-4 border-t border-slate-800 pt-8 lg:justify-start">
             <div className="flex -space-x-3">
                {[
                  { letter: 'R', color: 'bg-blue-600' },
                  { letter: 'S', color: 'bg-emerald-600' },
                  { letter: 'P', color: 'bg-violet-600' },
                  { letter: 'A', color: 'bg-amber-600' },
                ].map((av) => (
                  <div key={av.letter} className={`h-9 w-9 rounded-full border-2 border-slate-950 ${av.color} flex items-center justify-center text-xs font-bold text-white`}>
                    {av.letter}
                  </div>
                ))}
             </div>
             <p className="text-sm text-slate-400"><span className="font-bold text-white">4,600+</span> members across Shubhanjana branches.</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          {/* Dashboard Glass Mockup */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-wider text-blue-400">LIVE DASHBOARD</p>
                  <h3 className="text-2xl font-bold text-white">AI Engine Status</h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="M22 4L12 14.01l-3-3"></path></svg>
                </div>
              </div>
              
              <div className="mt-8 grid gap-4 grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-slate-800/80 p-5 shadow-inner transition-transform hover:-translate-y-1">
                  <p className="text-sm font-medium text-slate-400">Predicted Conversion</p>
                  <p className="mt-2 text-3xl font-extrabold text-white">
                    <AnimatedNumber end={conversionRate} suffix="%" decimals={1} />
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-slate-800/80 p-5 shadow-inner transition-transform hover:-translate-y-1">
                  <p className="text-sm font-medium text-slate-400">Training Samples</p>
                  <p className="mt-2 text-3xl font-extrabold text-white">
                    {totalCustomers > 0 ? (
                      <AnimatedNumber end={totalCustomers} />
                    ) : (
                      '—'
                    )}
                  </p>
                </div>
                <div className="col-span-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Top Recommendation</p>
                      <p className="mt-1 text-lg font-bold text-emerald-50">3 Year Balanced FD (7.4%)</p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative floating elements */}
          <div className="absolute -left-8 -top-8 h-24 w-24 animate-bounce rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/30 to-blue-600/10 backdrop-blur-md" style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-10 -right-4 h-32 w-32 animate-bounce rounded-full border border-white/10 bg-gradient-to-br from-emerald-500/30 to-teal-600/10 backdrop-blur-md" style={{ animationDuration: '6s' }} />
        </div>
      </div>
    </section>
  )
}

export default Hero
