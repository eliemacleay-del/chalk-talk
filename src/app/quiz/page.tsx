"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

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
        <p className="text-gray-400">Loading quiz...</p>
      </main>
    );
  }

  const q = questions[current];

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
    return (
      <main className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
        <p className="text-6xl font-extrabold text-emerald-400 mb-2">
          {score}/{questions.length}
        </p>
        <p className="text-gray-400 mb-8">
          {score === questions.length
            ? "Perfect score — you're game-day ready!"
            : score >= questions.length / 2
              ? "Solid work. Keep studying to lock it in."
              : "Time to hit the playbook again."}
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/upload"
            className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 font-medium transition-colors"
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
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-400">
          Question {current + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
          {score}/{questions.length} correct
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-6">{q.question}</h2>

      <div className="space-y-3">
        {q.options.map((opt, idx) => {
          let style =
            "border-gray-700 bg-gray-900 hover:border-gray-500 cursor-pointer";
          if (answered) {
            if (idx === q.answer) style = "border-emerald-500 bg-emerald-950";
            else if (idx === selected)
              style = "border-red-500 bg-red-950";
            else style = "border-gray-800 bg-gray-900 opacity-50";
          } else if (idx === selected) {
            style = "border-emerald-500 bg-gray-800";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${style}`}
            >
              <span className="font-medium text-gray-300 mr-3">
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          onClick={handleNext}
          className="mt-8 w-full py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 transition-colors"
        >
          {current + 1 >= questions.length ? "See Results" : "Next Question"}
        </button>
      )}
    </main>
  );
}
