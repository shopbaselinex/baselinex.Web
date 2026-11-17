import type { ReactNode } from "react";

/** Centered card used by the login, signup, onboarding and callback pages. */
export function AuthCard({
  eyebrow,
  title,
  subtitle,
  wide = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`mx-auto flex flex-col px-4 py-12 sm:px-6 md:py-16 ${wide ? "max-w-xl" : "max-w-md"}`}
    >
      <div className="text-center">
        {eyebrow && (
          <div className="eyebrow inline-flex items-center gap-2 text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-optic ring-2 ring-optic/30" />
            {eyebrow}
          </div>
        )}
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="mt-8 rounded-3xl border bg-card p-6 shadow-card sm:p-8">{children}</div>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
