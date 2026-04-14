function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 text-sm text-slate-500 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-semibold text-slate-700">Shubhanjana Co-operative</p>
          <p className="mt-2">Built on trust, driven by discipline, powered by AI intelligence.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-700">Quick Links</p>
          <div className="mt-2 flex flex-col gap-1">
            <a href="https://shubhanjana.com/contact" target="_blank" rel="noreferrer">
              Contact
            </a>
            <a href="https://shubhanjana.com/faq" target="_blank" rel="noreferrer">
              FAQ
            </a>
            <a href="https://shubhanjana.com/" target="_blank" rel="noreferrer">
              Official Website
            </a>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-700">Brand Line</p>
          <p className="mt-2">Sahi Disha, Sahi Samriddhi.</p>
          <p className="mt-2 text-xs text-slate-400">
            2026 Shubhanjana Co-operative Advisory Suite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
