"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const difficulties = [
  { value: "easy", label: "Easy", desc: "Terminology & recall" },
  { value: "medium", label: "Medium", desc: "Mixed question types" },
  { value: "hard", label: "Hard", desc: "Application & analysis" },
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
      <h1 className="text-3xl font-bold mb-2">Upload Your Notes</h1>
      <p className="text-muted mb-8">
        Paste your play notes or upload a file, then hit generate.
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your play notes here..."
        rows={8}
        className="w-full rounded-xl bg-surface border border-border focus:border-mcgill focus:ring-1 focus:ring-mcgill outline-none p-4 text-sm resize-y placeholder:text-muted/50 transition-colors"
      />

      <div className="mt-4 flex items-center gap-4">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-light hover:bg-border border border-border text-sm font-medium transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
            />
          </svg>
          Upload File
          <input
            type="file"
            onChange={handleFile}
            className="hidden"
          />
        </label>
        {fileName && (
          <span className="text-sm text-muted truncate max-w-xs">
            {fileName}
          </span>
        )}
      </div>

      {/* Difficulty selector */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Difficulty</label>
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDifficulty(d.value)}
              className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
                difficulty === d.value
                  ? "border-mcgill bg-mcgill/10"
                  : "border-border bg-surface hover:border-border-light"
              }`}
            >
              <div className="font-semibold text-sm">{d.label}</div>
              <div className="text-xs text-muted mt-0.5">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <button
        onClick={handleGenerate}
        disabled={(!notes.trim() && !file) || loading}
        className="mt-8 w-full py-3 rounded-xl font-semibold text-lg bg-mcgill hover:bg-mcgill-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>
    </main>
  );
}
