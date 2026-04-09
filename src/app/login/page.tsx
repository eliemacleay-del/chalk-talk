"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/upload");
    router.refresh();
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-20">
      <div className="stat-label mb-3">Sign In</div>
      <h1 className="display text-5xl text-ink mb-3">Welcome<br />back.</h1>
      <p className="text-sm text-muted mb-10">Get back to your reps.</p>

      <form onSubmit={handleLogin} className="space-y-5">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />

        {error && (
          <div className="px-4 py-3 border border-bad/40 bg-bad/5 text-sm text-ink">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-ink text-bg hover:bg-ink/90 disabled:opacity-30 transition-colors flex items-center justify-center"
        >
          <span className="display-up text-base">
            {loading ? "Signing in" : "Sign In"}
          </span>
        </button>
      </form>

      <p className="mt-8 text-xs text-muted text-center uppercase tracking-[0.12em]">
        No account?{" "}
        <a href="/signup" className="text-ink hover:underline font-bold">
          Sign up
        </a>
      </p>
    </main>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <div className="stat-label mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="w-full px-4 h-11 bg-surface border border-border focus:border-border-3 outline-none text-sm font-mono placeholder:text-muted-2 transition-colors"
      />
    </div>
  );
}
