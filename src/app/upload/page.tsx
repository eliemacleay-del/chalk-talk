"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const difficulties = [
  { value: "easy", label: "ROOKIE", desc: "Recall & terminology" },
  { value: "medium", label: "STARTER", desc: "Mixed difficulty" },
  { value: "hard", label: "ALL-PRO", desc: "Application & analysis" },
] as const;

export default function UploadPage() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);

    if (f.type === "text/plain" || f.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNotes(ev.target?.result as string);
      };
      reader.readAsText(f);
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("notes", notes);
      formData.append("difficulty", difficulty);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("quizQuestions", JSON.stringify(data.questions));
      router.push("/quiz");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {/* Header strip */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 bg-accent" />
        <span className="text-[10px] uppercase-display text-muted">
          New Session
        </span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-3">
        Build Your Reps
      </h1>
      <p className="text-muted text-sm mb-10">
        Drop in playbook notes or upload a PDF. The AI does the rest.
      </p>

      {/* Notes input */}
      <label className="block text-[10px] uppercase-display text-muted mb-2">
        Playbook Notes
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your install sheet, coverage rules, or any text from your playbook..."
        rows={10}
        className="w-full bg-surface border border-border focus:border-accent outline-none p-4 text-sm resize-y placeholder:text-muted-2 transition-colors font-mono leading-relaxed"
      />

      {/* File upload */}
      <div className="mt-3 flex items-center gap-3">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 h-10 bg-surface hover:bg-surface-2 border border-border hover:border-border-2 text-xs font-bold uppercase tracking-wider transition-colors">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="square"
              d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
            />
          </svg>
          Upload PDF
          <input
            type="file"
            accept=".pdf,.txt,application/pdf,text/plain"
            onChange={handleFile}
            className="hidden"
          />
        </label>
        {fileName && (
          <span className="text-xs font-mono text-muted truncate max-w-xs">
            {fileName}
          </span>
        )}
      </div>

      {/* Difficulty selector */}
      <div className="mt-10">
        <label className="block text-[10px] uppercase-display text-muted mb-3">
          Difficulty
        </label>
        <div className="grid grid-cols-3 gap-px bg-border border border-border">
          {difficulties.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={`px-4 py-4 text-left transition-all ${
                difficulty === d.value
                  ? "bg-accent text-bg"
                  : "bg-surface hover:bg-surface-2 text-ink"
              }`}
            >
              <div className="font-black text-sm uppercase tracking-wider">
                {d.label}
              </div>
              <div
                className={`text-[10px] mt-1 ${
                  difficulty === d.value ? "text-bg/70" : "text-muted"
                }`}
              >
                {d.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-6 px-4 py-3 border border-bad/40 bg-bad/5">
          <div className="text-[10px] uppercase-display text-bad mb-1">
            Error
          </div>
          <div className="text-sm text-ink">{error}</div>
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={(!notes.trim() && !file) || loading}
        className="mt-10 w-full h-14 font-black uppercase tracking-wider text-sm bg-accent hover:bg-accent-2 text-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <span className="w-2 h-2 bg-bg animate-pulse" />
            Generating Reps...
          </>
        ) : (
          <>
            Generate Quiz
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="square" d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </main>
  );
}
