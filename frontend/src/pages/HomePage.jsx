import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FDCard from '../components/FDCard'
import FeatureHighlights from '../components/FeatureHighlights'
import Footer from '../components/Footer'

function HomePage() {
  const fdPlans = [
    {
      tenure: '1 Year FD Plan',
      interestRate: '6.75% p.a.',
      minimumAmount: 'INR 10,000',
      riskTag: 'Low Risk',
      description: 'Best for short-term stability with quick liquidity options.',
    },
    {
      tenure: '3 Year FD Plan',
      interestRate: '7.40% p.a.',
      minimumAmount: 'INR 25,000',
      riskTag: 'Balanced',
      description: 'Smart choice for balanced growth and medium-term goals.',
      featured: true,
    },
    {
      tenure: '5 Year FD Plan',
      interestRate: '7.95% p.a.',
      minimumAmount: 'INR 50,000',
      riskTag: 'Growth Focused',
      description: 'Ideal for long-term compounding with higher potential returns.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main>
        <Hero />

        <section id="fd-plans" className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Investment Plans
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                Choose an FD plan aligned to your goals
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {fdPlans.map((plan) => (
              <FDCard key={plan.tenure} plan={plan} />
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
