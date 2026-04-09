import Image from "next/image";
import { imagery } from "@/lib/imagery";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative border-b border-border overflow-hidden">
        {/* photo */}
        <div className="absolute inset-0">
          <Image
            src={imagery.hero.helmet}
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/60 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-32">
          <div className="stat-label mb-6">Built by a player</div>

          <h1 className="display text-[clamp(3.5rem,11vw,8rem)] text-ink max-w-4xl">
            Get your<br />
            reps in.
          </h1>

          <p className="mt-8 text-base sm:text-lg text-ink/80 max-w-md leading-relaxed">
            Drop the playbook. Run your reps. Out-think the dude across from you.
          </p>

          <div className="mt-10 flex items-center gap-2">
            <a
              href="/upload"
              className="group inline-flex items-center gap-3 h-12 px-7 bg-ink hover:bg-ink/90 transition-colors"
            >
              <span className="display-up text-bg text-lg">Run It</span>
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
          </div>
        </div>
      </section>

      {/* MULTI-TOOL DASHBOARD */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="stat-label mb-2">The Facility</div>
              <h2 className="display text-4xl sm:text-5xl text-ink">
                Three rooms.<br />One playbook.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            <ToolCard
              num="01"
              title="Quiz Mode"
              body="Drop your install sheet. Get 5 questions tuned to your level. Lock in the terms."
              status="LIVE"
              live
              href="/upload"
            />
            <ToolCard
              num="02"
              title="Film Room"
              body="Break down route concepts and coverages with AI. Frame-by-frame walkthroughs."
              status="Soon"
            />
            <ToolCard
              num="03"
              title="Playbook"
              body="Build your own install sheet. Tag plays, reads, and tendencies."
              status="Soon"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — NCAA STAT STRIP */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="stat-label mb-8">The Workflow</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
            <Step num="01" label="Drop the playbook" body="Paste notes or upload a coach's PDF." />
            <Step num="02" label="AI builds the reps" body="5 questions, recall to analysis." />
            <Step num="03" label="Lock it in" body="Review, retry, walk into the meeting sharp." />
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <h2 className="display text-4xl sm:text-5xl text-ink">
            Time to run it.
          </h2>
          <a
            href="/upload"
            className="inline-flex items-center gap-3 h-12 px-7 bg-ink hover:bg-ink/90 transition-colors"
          >
            <span className="display-up text-bg text-lg">Start Session</span>
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

function ToolCard({
  num,
  title,
  body,
  status,
  live,
  href,
}: {
  num: string;
  title: string;
  body: string;
  status: string;
  live?: boolean;
  href?: string;
}) {
  const Wrapper = live && href
    ? ({ children }: { children: React.ReactNode }) => (
        <a href={href} className="block h-full bg-bg p-8 hover:bg-surface transition-colors group">
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="h-full bg-bg p-8 group">{children}</div>
      );

  return (
    <Wrapper>
      <div className="flex items-start justify-between mb-8">
        <span className="font-mono tabular text-xs text-muted">{num}</span>
        <div
          className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 ${
            live
              ? "bg-ink text-bg"
              : "border border-border-2 text-muted"
          }`}
        >
          {status}
        </div>
      </div>
      <h3 className="display-up text-3xl mb-3 text-ink">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
      {live && (
        <div className="mt-6 flex items-center gap-2 text-ink text-xs font-bold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
          Open
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="square" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </Wrapper>
  );
}

function Step({
  num,
  label,
  body,
}: {
  num: string;
  label: string;
  body: string;
}) {
  return (
    <div className="bg-bg p-6">
      <div className="font-mono tabular text-3xl font-black text-ink mb-3">
        {num}
      </div>
      <div className="display-up text-xl text-ink mb-2">{label}</div>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}
