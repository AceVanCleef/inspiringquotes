import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20 pt-12 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-slate-900 tracking-tight">inspiringquotes.ch</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              A curated refuge of wisdom. Handpicked with Swiss precision to foster clarity and growth.
            </p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-1 rounded w-fit">
              Swiss Quality Curation
            </span>
          </div>

          {/* Nav Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Discover</h4>
            <nav className="flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/about" className="hover:text-rose-500 transition-colors">About the Project</Link>
              <Link href="/authors" className="hover:text-rose-500 transition-colors">Authors Index</Link>
            </nav>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Legal</h4>
            <nav className="flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/impressum" className="hover:text-rose-500 transition-colors">Impressum</Link>
              <Link href="/privacy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-rose-500 transition-colors">Terms of Service</Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 uppercase tracking-widest">
          <p>© {currentYear} inspiringquotes.ch. All rights reserved.</p>
          <p>Developed with intent by <span className="text-slate-600 font-bold underline cursor-help" title="Great Impact Studio">Great Impact Studio</span></p>
        </div>
      </div>
    </footer>
  );
}