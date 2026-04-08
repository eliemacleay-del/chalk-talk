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
      <main className="max-w-sm mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Check your email</h1>
        <p className="text-muted">
          We sent a confirmation link to <span className="text-white font-medium">{email}</span>.
          Click it to activate your account, then come back and sign in.
        </p>
        <a
          href="/login"
          className="mt-6 inline-block px-6 py-2.5 rounded-lg font-semibold bg-mcgill hover:bg-mcgill-light transition-colors"
        >
          Go to Sign In
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-2">Create an account</h1>
      <p className="text-muted mb-8">Start quizzing yourself in seconds.</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border focus:border-mcgill focus:ring-1 focus:ring-mcgill outline-none text-sm transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border focus:border-mcgill focus:ring-1 focus:ring-mcgill outline-none text-sm transition-colors"
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold bg-mcgill hover:bg-mcgill-light disabled:opacity-40 transition-colors"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted text-center">
        Already have an account?{" "}
        <a href="/login" className="text-mcgill hover:underline">
          Sign in
        </a>
      </p>
    </main>
  );
}
