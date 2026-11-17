import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AuthCard, FormError, SupabaseNotConfigured } from "@/components/auth-card";
import { Field, GenderField, LocationFields, TextInput } from "@/components/profile-fields";
import { Button } from "@/components/ui/button";
import { signupMetadata } from "@/lib/profile";
import type { Gender } from "@/lib/profile-options";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — BaselineX" }] }),
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || null;
    const email = text("email") ?? "";

    setSubmitting(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: String(form.get("password")),
      options: {
        // Kept in Supabase user_metadata until the email is confirmed. Then /onboard sends it to
        // the API (PUT /me), which validates it and saves the profile.
        data: signupMetadata({
          firstName: text("firstName"),
          lastName: text("lastName"),
          country: text("country"),
          state: text("state"),
          gender: text("gender") as Gender | null,
        }),
        // Where the confirmation email link lands.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setSubmitting(false);

    if (error) return setError(error.message);
    // "Confirm email" off in Supabase → signed in right away.
    if (data.session) return router.history.push("/onboard");
    // "Confirm email" on → no session until the user clicks the link in the email.
    setCheckEmail(email);
  }

  if (checkEmail) {
    return (
      <AuthCard eyebrow="Almost there" title="Check your email">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-optic text-optic-foreground">
            <Mail className="size-6" />
          </div>
          <p className="mt-5 text-sm leading-relaxed">
            We sent a confirmation link to <strong>{checkEmail}</strong>. Open it to finish creating
            your account. You'll come straight back here.
          </p>
          <button
            type="button"
            onClick={() => setCheckEmail(null)}
            className="mt-6 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Used the wrong email? Start over
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      wide
      eyebrow="Join BaselineX"
      title="Create your account"
      subtitle="Buy and sell racquet-sport gear, and book sessions near you."
    >
      {!supabase ? (
        <SupabaseNotConfigured />
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstName" label="First name" hideLabel>
              <TextInput
                id="firstName"
                name="firstName"
                placeholder="First name"
                autoComplete="given-name"
                required
                maxLength={100}
              />
            </Field>
            <Field id="lastName" label="Last name" hideLabel>
              <TextInput
                id="lastName"
                name="lastName"
                placeholder="Last name"
                autoComplete="family-name"
                required
                maxLength={100}
              />
            </Field>
          </div>

          <Field id="email" label="Email" hideLabel>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
            />
          </Field>

          <Field id="password" label="Password" hint="At least 8 characters." hideLabel>
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              required
              minLength={8}
              aria-describedby="password-hint"
            />
          </Field>

          <GenderField
            gender={null}
            required
            hideLabel
            hint="Private. It's never shown on your profile."
          />

          <LocationFields
            state={null}
            required
            hideLabels
            countryHint="BaselineX is only available in the United States for now."
          />

          <FormError message={error} />

          <div className="border-t pt-6">
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-full text-base font-semibold"
            >
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </div>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
