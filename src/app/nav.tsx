export function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
      <a href="/" className="text-xl font-bold tracking-tight">
        <span className="text-mcgill">Chalk</span> Talk
      </a>
      <div className="flex items-center gap-3">
        <a
          href="/upload"
          className="px-4 py-2 text-sm font-medium bg-mcgill hover:bg-mcgill-light rounded-lg transition-colors"
        >
          New Quiz
        </a>
      </div>
    </nav>
  );
}
