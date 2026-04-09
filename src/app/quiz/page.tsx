"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FieldDiagram } from "@/components/FieldDiagram";
import { RosterCard, AnswerRow } from "@/components/RosterCard";
import type { Question } from "@/lib/types";

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("quizQuestions");
    if (!stored) {
      router.push("/upload");
      return;
    }
    setQuestions(JSON.parse(stored));
  }, [router]);

  if (questions.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-ink animate-pulse" />
          <span className="stat-label">Loading Reps</span>
        </div>
      </main>
    );
  }

  const q = questions[current];
  const isCorrect = selected === q.answer;
  const hasDiagram = q.diagram && q.diagram.players && q.diagram.players.length > 0;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  }

  if (finished) {
    const pct = score / questions.length;
    const grade =
      pct === 1 ? "Perfect"
      : pct >= 0.8 ? "Elite"
      : pct >= 0.6 ? "Solid"
      : pct >= 0.4 ? "Growing"
      : "Grind More";

    return (
      <main className="max-w-2xl mx-auto px-6 py-20">
        <div className="stat-label mb-3">Final</div>
        <h1 className="display text-5xl sm:text-6xl text-ink mb-10">
          Session<br />complete.
        </h1>

        {/* Box-score scoreboard */}
        <div className="border border-border bg-surface">
          <div className="grid grid-cols-3 divide-x divide-border">
            <Stat label="Score">
              <span className="font-mono tabular text-5xl font-black text-ink">
                {score}
              </span>
              <span className="font-mono tabular text-2xl text-muted">
                /{questions.length}
              </span>
            </Stat>
            <Stat label="Accuracy">
              <span className="font-mono tabular text-5xl font-black text-ink">
                {Math.round(pct * 100)}
              </span>
              <span className="font-mono tabular text-2xl text-muted">%</span>
            </Stat>
            <Stat label="Grade">
              <span className="display-up text-3xl text-ink mt-2 inline-block">
                {grade}
              </span>
            </Stat>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setCurrent(0);
              setSelected(null);
              setAnswered(false);
              setScore(0);
              setFinished(false);
            }}
            className="h-12 bg-ink text-bg hover:bg-ink/90 transition-colors flex items-center justify-center"
          >
            <span className="display-up text-base">Run It Back</span>
          </button>
          <a
            href="/upload"
            className="h-12 inline-flex items-center justify-center border border-border-2 hover:border-border-3 transition-colors"
          >
            <span className="display-up text-base text-ink">New Session</span>
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={`mx-auto px-6 py-12 ${hasDiagram ? "max-w-5xl" : "max-w-2xl"}`}>
      {/* Scoreboard header */}
      <div className="border border-border bg-surface mb-8">
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="px-5 py-4">
            <div className="stat-label mb-1">Question</div>
            <div className="font-mono tabular text-2xl font-black text-ink">
              {String(current + 1).padStart(2, "0")}
              <span className="text-muted text-sm">
                /{String(questions.length).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="stat-label mb-1">Score</div>
            <div className="font-mono tabular text-2xl font-black text-ink">
              {score}
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="stat-label mb-1">Progress</div>
            <div className="mt-2 h-1.5 bg-border-2 overflow-hidden">
              <div
                className="h-full bg-ink transition-all duration-500"
                style={{
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={hasDiagram ? "grid md:grid-cols-2 gap-6" : ""}>
        {/* Diagram column */}
        {hasDiagram && (
          <div className="border border-border bg-surface p-4">
            <div className="stat-label mb-3">Film</div>
            <FieldDiagram data={q.diagram!} />
          </div>
        )}

        {/* Question — wrapped in roster card */}
        <RosterCard number={current + 1} position="Read">
          <h2 className="display text-2xl sm:text-3xl text-ink mb-6 leading-tight">
            {q.question}
          </h2>

          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let state: "default" | "selected" | "correct" | "wrong" | "muted" =
                "default";
              if (answered) {
                if (idx === q.answer) state = "correct";
                else if (idx === selected) state = "wrong";
                else state = "muted";
              }
              return (
                <AnswerRow
                  key={idx}
                  letter={String.fromCharCode(65 + idx)}
                  text={opt}
                  state={state}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                />
              );
            })}
          </div>

          {/* Explanation */}
          {answered && q.explanation && (
            <div
              className={`mt-6 px-5 py-4 border-l-2 ${
                isCorrect
                  ? "border-good bg-good/5"
                  : "border-bad bg-bad/5"
              }`}
            >
              <div
                className="stat-label mb-2"
                style={{
                  color: isCorrect ? "var(--color-good)" : "var(--color-bad)",
                }}
              >
                {isCorrect ? "Correct" : "Incorrect"}
              </div>
              <div className="text-sm text-ink leading-relaxed">
                {q.explanation}
              </div>
            </div>
          )}

          {answered && (
            <button
              onClick={handleNext}
              className="mt-6 w-full h-12 bg-ink text-bg hover:bg-ink/90 transition-colors flex items-center justify-center gap-3"
            >
              <span className="display-up text-base">
                {current + 1 >= questions.length ? "See Results" : "Next Rep"}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="square" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </RosterCard>
      </div>
    </main>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-8">
      <div className="stat-label mb-2">{label}</div>
      <div className="flex items-baseline gap-1">{children}</div>
    </div>
  );
}
