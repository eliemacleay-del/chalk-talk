export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium tracking-wide uppercase text-mcgill border border-mcgill/30 rounded-full bg-mcgill/5">
        AI-Powered Study Tool
      </div>

      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
        Turn Your Playbook Into a{" "}
        <span className="text-mcgill">Quiz in Seconds</span>
      </h1>
      <p className="mt-6 text-lg text-muted max-w-xl">
        Upload your play notes, and AI instantly generates interactive quizzes
        so you can study smarter and perform better on game day.
      </p>
      <a
        href="/upload"
        className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 text-lg font-semibold bg-mcgill hover:bg-mcgill-light rounded-xl transition-colors"
      >
        Start Studying
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </a>

      <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="p-6 rounded-2xl bg-surface border border-border hover:border-border-light transition-colors">
          <div className="w-10 h-10 rounded-lg bg-mcgill/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-mcgill" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-1">Upload Notes</h3>
          <p className="text-sm text-muted">
            Paste text or upload PDFs of your play diagrams and notes.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-surface border border-border hover:border-border-light transition-colors">
          <div className="w-10 h-10 rounded-lg bg-mcgill/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-mcgill" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-1">AI Quiz Generation</h3>
          <p className="text-sm text-muted">
            AI reads your material and creates targeted multiple-choice questions.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-surface border border-border hover:border-border-light transition-colors">
          <div className="w-10 h-10 rounded-lg bg-mcgill/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-mcgill" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-1">Track Your Score</h3>
          <p className="text-sm text-muted">
            See how well you know your plays and improve before the big game.
          </p>
        </div>
      </div>
    </main>
  );
}
