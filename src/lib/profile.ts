import type { User } from "@supabase/supabase-js";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import type { MyProfile, UpdateProfileRequest } from "./api";
import type { Gender } from "./profile-options";

/** The fields /onboard asks for. GET /me's profileComplete is true once these are filled. */
export type OnboardingFields = Pick<
  UpdateProfileRequest,
  "firstName" | "lastName" | "country" | "state" | "gender"
>;

/** The keys the signup form puts in Supabase user_metadata (signUp options.data). */
export function signupMetadata(fields: OnboardingFields) {
  return {
    full_name: `${fields.firstName ?? ""} ${fields.lastName ?? ""}`.trim(),
    first_name: fields.firstName,
    last_name: fields.lastName,
    country: fields.country,
    state: fields.state,
    gender: fields.gender,
  };
}

/** Reads back what the signup form saved in user_metadata. Missing keys come back as null. */
export function onboardingFieldsFrom(user: User | null): OnboardingFields {
  const meta: Record<string, unknown> = user?.user_metadata ?? {};
  const text = (key: string) => {
    const v = meta[key];
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };
  return {
    firstName: text("first_name"),
    lastName: text("last_name"),
    country: text("country"),
    state: text("state"),
    gender: text("gender") as Gender | null,
  };
}

/** Same rule as the API's profileComplete: every onboarding field is filled. */
export function isOnboardingComplete(f: OnboardingFields) {
  return Boolean(f.firstName && f.lastName && f.country && f.state && f.gender);
}

/** PUT /me replaces the whole profile, so start from the current values. */
export function toUpdateRequest(p: MyProfile): UpdateProfileRequest {
  return {
    displayName: p.displayName,
    firstName: p.firstName,
    lastName: p.lastName,
    avatarObjectKey: p.avatarObjectKey,
    state: p.state,
    country: p.country,
    gender: p.gender,
    roles: p.roles,
  };
}

/** Sends a signed-in user whose profile is not complete to /onboard, then back to returnTo. */
export function useRequireCompleteProfile(profile: MyProfile | undefined, returnTo: string) {
  const router = useRouter();
  useEffect(() => {
    if (profile && !profile.profileComplete)
      void router.navigate({ to: "/onboard", search: { redirect: returnTo }, replace: true });
  }, [profile, returnTo, router]);
}
