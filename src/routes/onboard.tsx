import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { AuthCard, FormError } from "@/components/auth-card";
import { BusinessStep, CoachStep, DetailsStep, RolesStep } from "@/components/onboarding-steps";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  finishOnboarding,
  getMe,
  updateMe,
  type BusinessDetails,
  type CoachDetails,
  type MyProfile,
} from "@/lib/api";
import { requireAuth, safeRedirect, useAuth } from "@/lib/auth";
import {
  isOnboardingComplete,
  onboardingFieldsFrom,
  toUpdateRequest,
  type OnboardingFields,
} from "@/lib/profile";
import type { ProfileRole } from "@/lib/profile-options";

// Every new account passes through here: after email confirmation (/auth/callback), right after
// signup when confirmation is off, and later after Google sign-in. Steps:
//   Details   The signup form's answers (kept in Supabase user_metadata) are saved to the API without
//             asking (PUT /me). The form only shows if they are missing or the API rejects them.
//   Roles     "How will you use BaselineX?": shop & play, coach, business (one or more).
//   Coach     Only if Coach was picked: sports, experience, rate, bio.
//   Business  Only if Business was picked: name, type, location, contact.
// Roles, coach and business are kept on this page and saved together after the last step
// (POST /me/onboarding), all or nothing.
// The account page can add a role later; the guard then sends the user back here for just that step.
export const Route = createFileRoute("/onboard")({
  ssr: false, // the session lives in the browser
  validateSearch: (search): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  beforeLoad: ({ location }) => requireAuth(location.href),
  head: () => ({ meta: [{ title: "Set up your account — BaselineX" }] }),
  component: OnboardPage,
});

function OnboardPage() {
  const { redirect } = Route.useSearch();
  const next = safeRedirect(redirect);
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // GET /me. The first call also creates the user_profiles row.
  const me = useQuery({ queryKey: ["me"], queryFn: getMe });

  const saveDetails = useMutation({
    mutationFn: ({ profile, fields }: { profile: MyProfile; fields: OnboardingFields }) =>
      updateMe({ ...toUpdateRequest(profile), ...fields }), // PUT replaces everything, so merge
    // Stay "pending" until /me is refetched, so the form doesn't flash before the next step.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });
  const { mutate } = saveDetails;

  // All steps done (just now, or already) → continue.
  const complete = me.data?.profileComplete ?? false;
  useEffect(() => {
    if (complete) router.history.replace(next);
  }, [complete, next, router]);

  const detailsDone = me.data ? isOnboardingComplete(me.data) : false;

  // The signup form's answers. If they're all there, save them without asking (once).
  const fromSignup = useMemo(() => onboardingFieldsFrom(user), [user]);
  const canAutoSave = isOnboardingComplete(fromSignup);
  const autoSaveStarted = useRef(false);
  useEffect(() => {
    if (!me.data || detailsDone || !canAutoSave || autoSaveStarted.current) return;
    autoSaveStarted.current = true;
    mutate({ profile: me.data, fields: fromSignup });
  }, [me.data, detailsDone, canAutoSave, fromSignup, mutate]);

  if (me.isError) {
    return (
      <AuthCard title="Something went wrong">
        <FormError message={`Couldn't load your profile: ${me.error.message}`} />
        <Button
          variant="outline"
          className="mt-4 h-11 w-full rounded-full"
          onClick={() => void me.refetch()}
        >
          Try again
        </Button>
      </AuthCard>
    );
  }

  // Skeleton while loading, redirecting, or saving the details (automatically or from the form).
  const savingDetails =
    !detailsDone && ((canAutoSave && saveDetails.isIdle) || saveDetails.isPending);
  if (!me.data || complete || savingDetails) return <LoadingCard />;

  const profile = me.data;
  if (!detailsDone) {
    return (
      <DetailsStep
        profile={profile}
        fromSignup={fromSignup}
        error={saveDetails.error?.message ?? null}
        onSave={(fields) => mutate({ profile, fields })}
      />
    );
  }
  return <SetupSteps profile={profile} />;
}

function LoadingCard() {
  return (
    <AuthCard eyebrow="Welcome to BaselineX" title="Setting up your account…">
      <div className="space-y-3" aria-hidden>
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-2/3 rounded-xl" />
      </div>
    </AuthCard>
  );
}

// ---- Roles, coach, business ----

type Step = "roles" | "coach" | "business";

/** The steps this user still needs, in order, given the roles picked so far. */
function stepsFor(profile: MyProfile, roles: readonly ProfileRole[]): Step[] {
  const steps: Step[] = [];
  if (profile.roles.length === 0) steps.push("roles");
  if (roles.includes("Coach") && !profile.hasCoachProfile) steps.push("coach");
  if (roles.includes("Business") && !profile.hasBusiness) steps.push("business");
  return steps;
}

/** Holds the answers while the user moves between steps; saves them all after the last one. */
function SetupSteps({ profile }: { profile: MyProfile }) {
  const queryClient = useQueryClient();
  // Roles already saved (e.g. Coach added on the account page) → skip the roles step.
  const [roles, setRoles] = useState<ProfileRole[]>(profile.roles);
  const [coach, setCoach] = useState<CoachDetails | null>(null);
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [index, setIndex] = useState(0);

  const finish = useMutation({
    mutationFn: finishOnboarding,
    // Refetch /me: profileComplete turns true and the page moves on.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const steps = stepsFor(profile, roles);
  const step = steps[index] ?? "roles";
  const progress = steps.length > 1 ? `Step ${index + 1} of ${steps.length}` : undefined;
  const back = index > 0 ? () => setIndex(index - 1) : undefined;
  const isLast = (r: readonly ProfileRole[]) => index + 1 >= stepsFor(profile, r).length;
  const common = { progress, back, saving: finish.isPending, error: finish.error?.message ?? null };

  // Next step, or save everything after the last one. Takes this step's answer directly,
  // because the state set here isn't readable until the next render.
  function advance(answer: {
    roles?: ProfileRole[];
    coach?: CoachDetails;
    business?: BusinessDetails;
  }) {
    const r = answer.roles ?? roles;
    const c = answer.coach ?? coach;
    const b = answer.business ?? business;
    setRoles(r);
    setCoach(c);
    setBusiness(b);
    const remaining = stepsFor(profile, r);
    if (index + 1 < remaining.length) return setIndex(index + 1);
    finish.mutate({
      roles: r,
      coach: remaining.includes("coach") ? c : null,
      business: remaining.includes("business") ? b : null,
    });
  }

  if (step === "coach")
    return (
      <CoachStep
        {...common}
        initial={coach}
        label={isLast(roles) ? "Finish" : "Next"}
        onNext={(c) => advance({ coach: c })}
      />
    );
  if (step === "business")
    return (
      <BusinessStep
        {...common}
        initial={business}
        defaultState={profile.state}
        label="Finish"
        onNext={(b) => advance({ business: b })}
      />
    );
  return (
    <RolesStep
      {...common}
      firstName={profile.firstName}
      initial={roles}
      labelFor={(r) => (isLast(r) ? "Get started" : "Next")}
      onNext={(r) => advance({ roles: r })}
    />
  );
}
