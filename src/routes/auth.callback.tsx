import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import { AuthCard } from "@/components/auth-card";
import { useAuth } from "@/lib/auth";

// Landing page for links Supabase sends (email confirmation; later also OAuth and password reset).
// supabase-js reads the tokens from the URL by itself (detectSessionInUrl); we just wait for the session.
export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({ meta: [{ title: "Signing in — BaselineX" }] }),
  component: AuthCallback,
});

function AuthCallback() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) router.history.replace("/account");
  }, [session, router]);

  if (loading || session) {
    return (
      <AuthCard title="Signing you in…">
        <p className="text-sm text-muted-foreground">One moment.</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Link invalid or expired">
      <p className="text-sm text-muted-foreground">
        This sign-in link didn't work. It may have expired or already been used.
      </p>
      <Link
        to="/login"
        className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline"
      >
        Go to sign in →
      </Link>
    </AuthCard>
  );
}
