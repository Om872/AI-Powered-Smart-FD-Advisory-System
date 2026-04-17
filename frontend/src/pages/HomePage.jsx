import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FDCard from '../components/FDCard'
import FeatureHighlights from '../components/FeatureHighlights'
import Footer from '../components/Footer'

const depositCategories = [
  { key: 'fd', label: 'Fixed Deposit' },
  { key: 'ncfd', label: 'Non-Callable FD' },
  { key: 'rd', label: 'Recurring Deposit' },
  { key: 'dd', label: 'Daily Deposit' },
]

const allPlans = {
  fd: [
    {
      name: 'Short Term FD',
      subtitle: 'Callable Fixed Deposit',
      tag: 'Callable',
      description: 'Ideal for short-term savings with premature withdrawal facility. Earn steady returns with full liquidity.',
      rateRange: '6.10% – 6.25% p.a.',
      seniorBonus: true,
      rates: [
        { tenure: '6 Months', rate: '6.10%' },
        { tenure: '12 Months', rate: '6.25%' },
      ],
    },
    {
      name: 'Medium Term FD',
      subtitle: 'Callable Fixed Deposit',
      tag: 'Callable',
      description: 'Balanced growth with medium-term commitment. Withdraw anytime with competitive returns.',
      rateRange: '6.75% – 7.25% p.a.',
      seniorBonus: true,
      featured: true,
      rates: [
        { tenure: '24 Months', rate: '6.75%' },
        { tenure: '36 Months', rate: '7.25%' },
      ],
    },
    {
      name: 'Long Term FD',
      subtitle: 'Callable Fixed Deposit',
      tag: 'Callable',
      description: 'Maximize your returns with long-term compounding. Best for surplus funds and financial security.',
      rateRange: '7.90% – 8.90% p.a.',
      seniorBonus: true,
      rates: [
        { tenure: '60 Months', rate: '7.90%' },
        { tenure: '120 Months', rate: '8.90%' },
      ],
    },
  ],
  ncfd: [
    {
      name: 'Standard NCFD',
      subtitle: 'Non-Callable Fixed Deposit',
      tag: 'Non-Callable',
      description: 'Higher returns in exchange for a lock-in period. No premature withdrawal allowed.',
      rateRange: '8.00% – 8.75% p.a.',
      seniorBonus: true,
      rates: [
        { tenure: '18 Months', rate: '8.00%' },
        { tenure: '24 Months', rate: '8.25%' },
        { tenure: '36 Months', rate: '8.50%' },
        { tenure: '42 Months', rate: '8.75%' },
      ],
    },
    {
      name: 'Premium NCFD',
      subtitle: 'Non-Callable Fixed Deposit',
      tag: 'Non-Callable',
      description: 'Premium long-term deposits with exceptional rates. Ideal for serious wealth building.',
      rateRange: '9.00% – 9.75% p.a.',
      seniorBonus: true,
      featured: true,
      rates: [
        { tenure: '48 Months', rate: '9.00%' },
        { tenure: '54 Months', rate: '9.25%' },
        { tenure: '60 Months', rate: '9.50%' },
        { tenure: '66 Months', rate: '9.75%' },
      ],
    },
    {
      name: 'Elite NCFD',
      subtitle: 'Non-Callable Fixed Deposit',
      tag: 'Non-Callable',
      description: 'Highest returns offered. Lock in your funds for maximum compoundable growth.',
      rateRange: '10.50% – 11.50% p.a.',
      seniorBonus: true,
      rates: [
        { tenure: '72 Months', rate: '10.50%' },
        { tenure: '120 Months', rate: '11.50%' },
      ],
    },
  ],
  rd: [
    {
      name: 'Short Term RD',
      subtitle: 'Recurring Deposit',
      tag: 'Monthly Savings',
      description: 'Build a savings habit with small monthly contributions. Great for short-term goals.',
      rateRange: '6.10% – 6.25% p.a.',
      seniorBonus: true,
      rates: [
        { tenure: '6 Months', rate: '6.10%' },
        { tenure: '12 Months', rate: '6.25%' },
      ],
    },
    {
      name: 'Medium Term RD',
      subtitle: 'Recurring Deposit',
      tag: 'Monthly Savings',
      description: 'Steady monthly savings for medium-term financial planning with attractive rates.',
      rateRange: '6.75% – 7.25% p.a.',
      seniorBonus: true,
      featured: true,
      rates: [
        { tenure: '24 Months', rate: '6.75%' },
        { tenure: '36 Months', rate: '7.25%' },
      ],
    },
    {
      name: 'Long Term RD',
      subtitle: 'Recurring Deposit',
      tag: 'Monthly Savings',
      description: 'Long-term disciplined saving with high returns. Ideal for children\'s education or retirement.',
      rateRange: '7.90% – 8.90% p.a.',
      seniorBonus: true,
      rates: [
        { tenure: '60 Months', rate: '7.90%' },
        { tenure: '120 Months', rate: '8.90%' },
      ],
    },
  ],
  dd: [
    {
      name: '1 Year Daily Deposit',
      subtitle: 'Daily Deposit Scheme',
      tag: 'Daily Savings',
      description: 'Perfect for daily wage earners and traders. Small daily amounts build big savings.',
      rateRange: '5.00% p.a.',
      seniorBonus: false,
      rates: [
        { tenure: '356 Days', rate: '5.00%' },
      ],
    },
    {
      name: '3 Year Daily Deposit',
      subtitle: 'Daily Deposit Scheme',
      tag: 'Daily Savings',
      description: 'Commit to daily savings for 3 years and watch your wealth grow steadily.',
      rateRange: '6.00% – 7.00% p.a.',
      seniorBonus: false,
      featured: true,
      rates: [
        { tenure: '730 Days (2 Yr)', rate: '6.00%' },
        { tenure: '1095 Days (3 Yr)', rate: '7.00%' },
      ],
    },
    {
      name: '5 Year Daily Deposit',
      subtitle: 'Daily Deposit Scheme',
      tag: 'Daily Savings',
      description: 'Maximum returns on daily deposits. Designed for long-term wealth creation.',
      rateRange: '8.00% – 9.00% p.a.',
      seniorBonus: false,
      rates: [
        { tenure: '1460 Days (4 Yr)', rate: '8.00%' },
        { tenure: '1825 Days (5 Yr)', rate: '9.00%' },
      ],
    },
  ],
}

function HomePage() {
  const [activeCategory, setActiveCategory] = useState('fd')
  const currentPlans = allPlans[activeCategory]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main>
        <Hero />

        <section id="fd-plans" className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
          <div className="mb-8">
            <p className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Shubhanjana Deposit Schemes
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Choose a savings plan aligned to your goals
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              All rates are per annum. Senior Citizens & Freedom Fighters get an additional 0.5% on applicable schemes.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {depositCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-[#1E3A8A] text-white shadow-md shadow-blue-500/20'
                    : 'border border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {currentPlans.map((plan) => (
              <FDCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>

        <FeatureHighlights />

        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Shubhanjana Impact
            </p>
            <h3 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Numbers that show consistency
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Happy Customers', value: '4,612+' },
                { label: 'Branches Served', value: '4+' },
                { label: 'Years of Experience', value: '7+' },
                { label: 'Loans Disbursed', value: '922+' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-bold text-[#1E3A8A]">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
          <div className="rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-8 py-10 text-white shadow-xl">
            <h3 className="text-2xl font-semibold md:text-3xl">
              Ready to launch AI-driven FD advisory?
            </h3>
            <p className="mt-3 max-w-2xl text-blue-100">
              Begin customer profiling and activate the AI recommendation pipeline today to provide personalized insights.
            </p>
            <Link
              to="/customer-input"
              className="mt-6 inline-flex rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Continue to AI Analysis Setup
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-2 inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Need Help
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                Talk to our team for the right deposit plan
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Get guidance on FD, RD, DDS, and savings options aligned to your
                goals. Our AI advisory and branch team work together for transparent
                financial support.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://shubhanjana.com/contact"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Contact Us
                </a>
                <a
                  href="https://shubhanjana.com/faq"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                  View FAQ
                </a>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Frequently Asked
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                Common member questions
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-800">
                    Which plan is better for disciplined daily saving?
                  </p>
                  <p className="mt-1">DDS (Daily Deposit) works best for small daily contributions.</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-800">
                    How can I choose between FD and RD?
                  </p>
                  <p className="mt-1">FD is good for lump-sum deposits, RD is ideal for monthly savings.</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-800">
                    Is KYC update mandatory?
                  </p>
                  <p className="mt-1">Yes, KYC compliance is required for secure and seamless services.</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
