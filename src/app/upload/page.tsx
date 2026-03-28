"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);

    // Auto-read text files into the textarea
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
      <p className="text-gray-400 mb-8">
        Paste your play notes or upload a file, then hit generate.
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste your play notes here..."
        rows={8}
        className="w-full rounded-xl bg-gray-900 border border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none p-4 text-sm resize-y placeholder:text-gray-500 transition-colors"
      />

      <div className="mt-4 flex items-center gap-4">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm font-medium transition-colors">
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
          <span className="text-sm text-gray-400 truncate max-w-xs">
            {fileName}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <button
        onClick={handleGenerate}
        disabled={(!notes.trim() && !file) || loading}
        className="mt-8 w-full py-3 rounded-xl font-semibold text-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating..." : "Generate Quiz"}
      </button>
    </main>
  );
}
