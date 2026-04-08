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
        <p className="text-muted">Loading quiz...</p>
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
    return (
      <main className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
        <p className="text-6xl font-extrabold text-mcgill mb-2">
          {score}/{questions.length}
        </p>
        <p className="text-muted mb-8">
          {pct === 1
            ? "Perfect score — you're game-day ready!"
            : pct >= 0.5
              ? "Solid work. Keep studying to lock it in."
              : "Time to hit the playbook again."}
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/upload"
            className="px-6 py-3 rounded-xl bg-surface hover:bg-surface-light border border-border font-medium transition-colors"
          >
            New Quiz
          </a>
          <button
            onClick={() => {
              setCurrent(0);
              setSelected(null);
              setAnswered(false);
              setScore(0);
              setFinished(false);
            }}
            className="px-6 py-3 rounded-xl bg-mcgill hover:bg-mcgill-light font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`mx-auto px-6 py-16 ${hasDiagram ? "max-w-4xl" : "max-w-xl"}`}>
      {/* Progress bar */}
      <div className="w-full h-1 bg-border rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-mcgill rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-muted">
          Question {current + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-surface border border-border">
          {score}/{questions.length} correct
        </span>
      </div>

      <div className={hasDiagram ? "grid md:grid-cols-2 gap-8" : ""}>
        {/* Diagram column */}
        {hasDiagram && (
          <div className="flex items-start justify-center">
            <FieldDiagram data={q.diagram!} />
          </div>
        )}

        {/* Question column */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let style =
                "border-border bg-surface hover:border-border-light cursor-pointer";
              if (answered) {
                if (idx === q.answer)
                  style = "border-green-500 bg-green-950/30";
                else if (idx === selected)
                  style = "border-mcgill bg-mcgill/10";
                else style = "border-border bg-surface opacity-40";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${style}`}
                >
                  <span className="font-medium text-muted mr-3">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && q.explanation && (
            <div
              className={`mt-6 px-5 py-4 rounded-xl border text-sm leading-relaxed ${
                isCorrect
                  ? "border-green-800 bg-green-950/20 text-green-200"
                  : "border-mcgill/50 bg-mcgill/5 text-gray-300"
              }`}
            >
              <div className="font-semibold mb-1">
                {isCorrect ? "Correct!" : "Not quite."}
              </div>
              {q.explanation}
            </div>
          )}

          {answered && (
            <button
              onClick={handleNext}
              className="mt-6 w-full py-3 rounded-xl font-semibold bg-mcgill hover:bg-mcgill-light transition-colors"
            >
              {current + 1 >= questions.length ? "See Results" : "Next Question"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
