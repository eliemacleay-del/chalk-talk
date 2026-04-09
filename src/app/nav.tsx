export function Nav() {
  return (
    <nav className="border-b border-border bg-bg">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-14">
        <a href="/" className="flex items-baseline">
          <span className="display text-2xl text-ink">RepIQ</span>
          <span className="display text-2xl text-ink">.</span>
        </a>

        <a
          href="/upload"
          className="px-5 h-9 inline-flex items-center text-[11px] font-bold uppercase tracking-[0.12em] text-bg bg-ink hover:bg-ink/90 transition-colors"
        >
          New Session
        </a>
      </div>
    </nav>
  );
}
