export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
        Turn Your Playbook Into a{" "}
        <span className="text-emerald-400">Quiz in Seconds</span>
      </h1>
      <p className="mt-6 text-lg text-gray-400 max-w-xl">
        Upload your play notes, and AI instantly generates interactive quizzes
        so you can study smarter and perform better on game day.
      </p>
      <a
        href="/upload"
        className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 text-lg font-semibold bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors"
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

      <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full">
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-semibold text-lg mb-1">Upload Notes</h3>
          <p className="text-sm text-gray-400">
            Paste text or upload PDFs and images of your play diagrams.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-semibold text-lg mb-1">AI Quiz Generation</h3>
          <p className="text-sm text-gray-400">
            Our AI reads your material and creates targeted multiple-choice
            questions.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
          <div className="text-3xl mb-3">🏆</div>
          <h3 className="font-semibold text-lg mb-1">Track Your Score</h3>
          <p className="text-sm text-gray-400">
            See how well you know your plays and improve before the big game.
          </p>
        </div>
      </div>
    </main>
  );
}
