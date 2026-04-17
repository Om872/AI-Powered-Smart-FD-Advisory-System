function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm md:grid-cols-4 md:px-10">
        <div className="md:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E3A8A] font-bold text-white shadow-sm">
              S
            </div>
            <p className="text-lg font-bold tracking-tight text-slate-800">Shubhanjana</p>
          </div>
          <p className="font-semibold text-slate-700">
            Built for Shubhanjana Co-operative Society
          </p>
          <p className="mt-2 text-slate-500">
            Built on trust, driven by discipline, powered by AI intelligence.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-800">Quick Links</p>
          <div className="mt-3 flex flex-col gap-2 text-slate-500">
            <a
              href="https://shubhanjana.com/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#1E3A8A]"
            >
              Official Website
            </a>
            <a
              href="https://shubhanjana.com/contact"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#1E3A8A]"
            >
              Contact Support
            </a>
            <a
              href="https://shubhanjana.com/faq"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#1E3A8A]"
            >
              FAQ & Help
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="font-semibold text-slate-800">About the AI Advisory</p>
          <p className="mt-3 leading-relaxed text-slate-500">
            The AI-Powered FD Advisory System is a sophisticated digital platform designed
            specifically for the members and staff of Shubhanjana Co-operative Society. By
            leveraging advanced algorithms, it predicts fixed deposit conversion probabilities and
            recommends tailored financial products based on individual demographics, ensuring
            optimal financial growth.
          </p>
        </div>
      </div>

      <div className="w-full border-t border-slate-100 bg-slate-50 px-6 py-6">
        <div className="mx-auto max-w-7xl md:px-10">
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs font-medium leading-relaxed text-amber-900">
              <span className="font-bold uppercase tracking-wider text-amber-950">
                Financial Disclaimer:{' '}
              </span>
              This platform utilizes Artificial Intelligence to generate investment recommendations
              based on historical data patterns. Recommendations are predictive and advisory in
              nature. They do not constitute binding financial, legal, or tax advice. Interest rates
              are subject to change without prior notice. Depositors are advised to carefully read
              all scheme-related documents and terms before investing.
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-400 md:flex-row">
            <p>Sahi Disha, Sahi Samriddhi.</p>
            <p>© 2026 Shubhanjana Co-operative. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
