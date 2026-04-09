export default function Home() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative border-b border-border">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 bg-accent animate-pulse" />
            <span className="text-[10px] uppercase-display text-muted">
              AI Film Room • Live
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black tracking-tighter leading-[0.9] uppercase">
            Train your<br />
            football <span className="text-accent">IQ.</span>
          </h1>

          <p className="mt-8 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Drop in your playbook. Get AI-built quizzes that drill terminology,
            reads, and assignments — so you walk into the meeting room ahead.
          </p>

          <div className="mt-10 flex items-center gap-3">
            <a
              href="/upload"
              className="group inline-flex items-center gap-3 h-12 px-6 bg-accent hover:bg-accent-2 transition-colors"
            >
              <span className="text-bg font-black uppercase tracking-wider text-sm">
                Start a Rep
              </span>
              <svg
                className="w-4 h-4 text-bg group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="square" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/upload"
              className="inline-flex items-center h-12 px-6 border border-border-2 hover:border-border-3 transition-colors text-sm font-bold uppercase tracking-wider"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          <Stat label="Reps Run" value="∞" />
          <Stat label="Plays Decoded" value="ANY" />
          <Stat label="Difficulty" value="3 LVL" />
          <Stat label="Setup Time" value="0:30" />
        </div>
      </section>

      {/* How it works — feature cards */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] uppercase-display text-muted px-2">
            The Workflow
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          <FeatureCard
            num="01"
            title="Drop the Playbook"
            body="Paste notes or upload coaches' PDFs. Coverage rules, install sheets, anything text-based."
          />
          <FeatureCard
            num="02"
            title="AI Builds the Reps"
            body="A football-trained model writes 5 questions tuned to your level — recall, recognition, application, analysis."
          />
          <FeatureCard
            num="03"
            title="Lock It In"
            body="Hit reps until terminology is automatic. Walk into the film room sharper than the guy next to you."
          />
        </div>
      </section>

      {/* CTA bar */}
      <section className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="text-[10px] uppercase-display text-accent mb-2">
              Ready
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
              Run your first rep.
            </h2>
          </div>
          <a
            href="/upload"
            className="inline-flex items-center gap-3 h-12 px-6 bg-accent hover:bg-accent-2 transition-colors"
          >
            <span className="text-bg font-black uppercase tracking-wider text-sm">
              Generate Quiz
            </span>
            <svg
              className="w-4 h-4 text-bg"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="square" d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-6 py-6">
      <div className="text-[10px] uppercase-display text-muted mb-2">
        {label}
      </div>
      <div className="font-black text-3xl tabular tracking-tight text-ink">
        {value}
      </div>
    </div>
  );
}

function FeatureCard({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-bg p-8 hover:bg-surface transition-colors group">
      <div className="flex items-start justify-between mb-8">
        <span className="font-mono text-xs text-muted tabular">{num}</span>
        <div className="w-1.5 h-1.5 bg-accent group-hover:scale-150 transition-transform" />
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight mb-3">
        {title}
      </h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}
