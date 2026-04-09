"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FieldDiagram } from "@/components/FieldDiagram";
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
          <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
          <span className="text-[10px] uppercase-display text-muted">
            Loading Reps
          </span>
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
      pct === 1 ? "PERFECT"
      : pct >= 0.8 ? "ELITE"
      : pct >= 0.6 ? "SOLID"
      : pct >= 0.4 ? "GROWING"
      : "GRIND MORE";

    return (
      <main className="max-w-2xl mx-auto px-6 py-20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 bg-accent" />
          <span className="text-[10px] uppercase-display text-muted">Final</span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-10">
          Session Complete
        </h1>

        {/* Scoreboard */}
        <div className="border border-border bg-surface">
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="px-6 py-8">
              <div className="text-[10px] uppercase-display text-muted mb-2">
                Score
              </div>
              <div className="font-black tabular tracking-tighter text-5xl text-accent">
                {score}
                <span className="text-muted text-2xl">/{questions.length}</span>
              </div>
            </div>
            <div className="px-6 py-8">
              <div className="text-[10px] uppercase-display text-muted mb-2">
                Accuracy
              </div>
              <div className="font-black tabular tracking-tighter text-5xl">
                {Math.round(pct * 100)}
                <span className="text-muted text-2xl">%</span>
              </div>
            </div>
            <div className="px-6 py-8">
              <div className="text-[10px] uppercase-display text-muted mb-2">
                Grade
              </div>
              <div className="font-black uppercase tracking-tight text-2xl text-ink mt-3">
                {grade}
              </div>
            </div>
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
            className="h-12 bg-accent hover:bg-accent-2 text-bg font-black uppercase tracking-wider text-sm transition-colors"
          >
            Run It Back
          </button>
          <a
            href="/upload"
            className="h-12 inline-flex items-center justify-center border border-border-2 hover:border-border-3 font-black uppercase tracking-wider text-sm transition-colors"
          >
            New Quiz
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
            <div className="text-[9px] uppercase-display text-muted mb-1">Question</div>
            <div className="font-black tabular text-2xl tracking-tight">
              {String(current + 1).padStart(2, "0")}
              <span className="text-muted text-sm">/{String(questions.length).padStart(2, "0")}</span>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="text-[9px] uppercase-display text-muted mb-1">Score</div>
            <div className="font-black tabular text-2xl tracking-tight text-accent">
              {score}
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="text-[9px] uppercase-display text-muted mb-1">Progress</div>
            <div className="mt-2 h-2 bg-border-2 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={hasDiagram ? "grid md:grid-cols-2 gap-6" : ""}>
        {/* Diagram column */}
        {hasDiagram && (
          <div className="border border-border bg-surface p-4">
            <div className="text-[10px] uppercase-display text-muted mb-3">
              Film
            </div>
            <FieldDiagram data={q.diagram!} />
          </div>
        )}

        {/* Question column */}
        <div>
          <div className="text-[10px] uppercase-display text-muted mb-3">
            Read
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-6 leading-tight">
            {q.question}
          </h2>

          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let style =
                "border-border bg-surface hover:border-border-2 hover:bg-surface-2 cursor-pointer";
              if (answered) {
                if (idx === q.answer)
                  style = "border-accent bg-accent/10 text-ink";
                else if (idx === selected)
                  style = "border-bad bg-bad/5 text-ink";
                else style = "border-border bg-surface opacity-30";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left px-5 py-4 border-2 transition-all flex items-start gap-4 ${style}`}
                >
                  <span className="font-mono text-xs text-muted tabular pt-0.5">
                    0{idx + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && q.explanation && (
            <div
              className={`mt-6 px-5 py-4 border-l-2 ${
                isCorrect
                  ? "border-accent bg-accent/5"
                  : "border-bad bg-bad/5"
              }`}
            >
              <div
                className={`text-[10px] uppercase-display mb-2 ${
                  isCorrect ? "text-accent" : "text-bad"
                }`}
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
              className="mt-6 w-full h-12 bg-accent hover:bg-accent-2 text-bg font-black uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-3"
            >
              {current + 1 >= questions.length ? "See Results" : "Next Rep"}
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
        </div>
      </div>
    </main>
  );
}
