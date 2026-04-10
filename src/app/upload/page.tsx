"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/StarRating";

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(text);
  }

  return pages.join("\n").trim();
}

export default function UploadPage() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [loading, setLoading] = useState(false);
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setError(null);

    if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
      setExtractingPdf(true);
      try {
        const text = await extractPdfText(f);
        setNotes(text);
      } catch {
        setError("Could not read that PDF. Try pasting the text instead.");
      } finally {
        setExtractingPdf(false);
      }
      return;
    }

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
      {/* Header */}
      <div className="stat-label mb-3">New Session</div>
      <h1 className="display text-5xl sm:text-6xl text-ink mb-4">
        Build your<br />reps.
      </h1>
      <p className="text-sm text-muted max-w-md mb-12">
        Drop in playbook notes or upload a PDF. The AI builds 5 reps tuned to
        your level.
      </p>

      {/* Notes input */}
      <div className="stat-label mb-2">Playbook Notes</div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your install sheet, coverage rules, or any text from your playbook..."
        rows={10}
        className="w-full bg-surface border border-border focus:border-border-3 outline-none p-4 text-sm resize-y placeholder:text-muted-2 transition-colors font-mono leading-relaxed"
      />

      {/* File upload */}
      <div className="mt-3 flex items-center gap-3">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 h-10 bg-surface hover:bg-surface-2 border border-border hover:border-border-2 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors">
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
            {extractingPdf ? "Reading..." : fileName}
          </span>
        )}
      </div>

      {/* Difficulty */}
      <div className="mt-12">
        <div className="stat-label mb-3">Difficulty</div>
        <StarRating value={difficulty} onChange={setDifficulty} />
      </div>

      {error && (
        <div className="mt-6 px-4 py-3 border border-bad/40 bg-bad/5">
          <div className="stat-label mb-1" style={{ color: "var(--color-bad)" }}>
            Error
          </div>
          <div className="text-sm text-ink">{error}</div>
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!notes.trim() || loading || extractingPdf}
        className="mt-12 w-full h-14 bg-ink text-bg hover:bg-ink/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
      >
        {extractingPdf ? (
          <>
            <span className="w-2 h-2 bg-bg animate-pulse" />
            <span className="display-up text-lg">Reading PDF</span>
          </>
        ) : loading ? (
          <>
            <span className="w-2 h-2 bg-bg animate-pulse" />
            <span className="display-up text-lg">Generating Reps</span>
          </>
        ) : (
          <>
            <span className="display-up text-lg">Run It</span>
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
