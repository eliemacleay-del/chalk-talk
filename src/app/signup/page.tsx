"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function SignupPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="max-w-sm mx-auto px-6 py-20">
        <div className="stat-label mb-3">Confirm</div>
        <h1 className="display text-5xl text-ink mb-4">Check<br />your email.</h1>
        <p className="text-sm text-muted">
          We sent a confirmation link to{" "}
          <span className="text-ink font-mono">{email}</span>. Click it to
          activate your account, then come back and sign in.
        </p>
        <a
          href="/login"
          className="mt-8 inline-flex items-center justify-center h-12 px-7 bg-ink text-bg hover:bg-ink/90 transition-colors"
        >
          <span className="display-up text-base">Go to Sign In</span>
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-20">
      <div className="stat-label mb-3">New Player</div>
      <h1 className="display text-5xl text-ink mb-3">Create<br />an account.</h1>
      <p className="text-sm text-muted mb-10">Start running reps in seconds.</p>

      <form onSubmit={handleSignup} className="space-y-5">
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
          placeholder="At least 6 characters"
          minLength={6}
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
            {loading ? "Creating" : "Sign Up"}
          </span>
        </button>
      </form>

      <p className="mt-8 text-xs text-muted text-center uppercase tracking-[0.12em]">
        Already have an account?{" "}
        <a href="/login" className="text-ink hover:underline font-bold">
          Sign in
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
  minLength,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  minLength?: number;
}) {
  return (
    <div>
      <div className="stat-label mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={minLength}
        placeholder={placeholder}
        className="w-full px-4 h-11 bg-surface border border-border focus:border-border-3 outline-none text-sm font-mono placeholder:text-muted-2 transition-colors"
      />
    </div>
  );
}
