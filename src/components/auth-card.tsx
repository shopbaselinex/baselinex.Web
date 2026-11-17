import type { ReactNode } from "react";

/** Centered card used by the login, signup and callback pages. */
export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-8 rounded-2xl border bg-card p-6 shadow-card">{children}</div>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}

export function SupabaseNotConfigured() {
  return (
    <p className="text-sm text-muted-foreground">
      Supabase isn't configured yet. Set <code>VITE_SUPABASE_URL</code> and{" "}
      <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code>.env.local</code>, then restart the dev
      server.
    </p>
  );
}
