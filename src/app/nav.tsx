export function Nav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-accent flex items-center justify-center">
            <span className="text-bg font-black text-sm tracking-tighter">R</span>
          </div>
          <span className="font-black tracking-tight text-ink text-lg">
            REP<span className="text-accent">IQ</span>
          </span>
        </a>

        <div className="flex items-center gap-1">
          <a
            href="/upload"
            className="px-4 h-9 inline-flex items-center text-xs font-bold uppercase tracking-wider text-bg bg-accent hover:bg-accent-2 transition-colors"
          >
            New Quiz
          </a>
        </div>
      </div>
    </nav>
  );
}
