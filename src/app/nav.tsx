"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export function Nav() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
      <a href="/" className="text-xl font-bold tracking-tight">
        <span className="text-mcgill">Chalk</span> Talk
      </a>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <a
              href="/upload"
              className="px-4 py-2 text-sm font-medium bg-mcgill hover:bg-mcgill-light rounded-lg transition-colors"
            >
              New Quiz
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-mcgill hover:bg-mcgill-light rounded-lg transition-colors"
            >
              Get Started
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
