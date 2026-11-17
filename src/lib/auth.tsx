import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { getAccessToken, supabase } from "./supabase";

type AuthState = {
  session: Session | null;
  user: User | null;
  /** true until supabase-js has read the stored session (always true during the server render) */
  loading: boolean;
  /** false when the Supabase env vars are missing */
  configured: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

/** Keeps the current Supabase session in React state. Must sit inside QueryClientProvider. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    // Fires once immediately (INITIAL_SESSION), then on SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, ...
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setLoading(false);
      // Don't let the next user on this browser see the previous user's cached API data.
      if (event === "SIGNED_OUT") queryClient.clear();
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  const value: AuthState = {
    session,
    user: session?.user ?? null,
    loading,
    configured: supabase !== null,
    signOut: async () => {
      await supabase?.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/**
 * Route guard for `beforeLoad`. Use together with `ssr: false` on the route,
 * because the session only exists in the browser.
 *
 *   beforeLoad: ({ location }) => requireAuth(location.href)
 */
export async function requireAuth(returnTo: string) {
  if (!(await getAccessToken())) throw redirect({ to: "/login", search: { redirect: returnTo } });
}

/** Only allow same-site paths after login (prevents redirecting to another website). */
export function safeRedirect(path: string | undefined, fallback = "/account") {
  return path && path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}
