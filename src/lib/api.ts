import type { BusinessType, Gender, ProfileRole } from "./profile-options";
import { getAccessToken } from "./supabase";

export const API_URL = (
  (import.meta.env["VITE_API_URL"] as string | undefined) || "http://localhost:5261"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Calls the .NET API, attaching the Supabase access token as `Authorization: Bearer`. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const token = await getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    // The API returns ProblemDetails JSON: { title, detail, errors? }
    let message = res.status === 401 ? "Not signed in, or the session is invalid." : res.statusText;
    try {
      const problem = await res.json();
      const firstFieldError =
        problem.errors && Object.values(problem.errors as Record<string, string[]>)[0]?.[0];
      message = firstFieldError ?? problem.detail ?? problem.title ?? message;
    } catch {
      // body was not JSON; keep the default message
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---- Profile (/me) ----

export type MyProfile = {
  id: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  avatarObjectKey: string | null;
  state: string | null; // 2-letter US state code, e.g. "CA"
  country: string | null; // ISO code. Only "US" for now.
  gender: Gender | null; // private: only returned by /me
  roles: ProfileRole[]; // onboarding step 2; empty until answered
  hasCoachProfile: boolean; // has a coach profile (needed when roles has Coach)
  hasBusiness: boolean; // owns or runs a business (needed when roles has Business)
  profileComplete: boolean; // false → the user still needs /onboard
  stripeOnboardingStatus: string;
  createdAt: string;
};

export type UpdateProfileRequest = Omit<
  MyProfile,
  | "id"
  | "hasCoachProfile"
  | "hasBusiness"
  | "profileComplete"
  | "stripeOnboardingStatus"
  | "createdAt"
>;

// The first authenticated call also creates the user_profiles row on the backend.
export const getMe = () => api<MyProfile>("/me");
export const updateMe = (body: UpdateProfileRequest) =>
  api<void>("/me", { method: "PUT", body: JSON.stringify(body) });

// ---- Onboarding ----

export type Sport = { id: number; name: string; slug: string };
export const getSports = () => api<Sport[]>("/sports");

export type CoachDetails = {
  sportIds: number[];
  yearsExperience: number | null;
  privateLessonRate: number | null; // USD per hour
  bio: string | null;
};

export type BusinessDetails = {
  name: string;
  type: BusinessType;
  city: string | null;
  state: string | null;
  website: string | null;
  phone: string | null;
};

/**
 * The last onboarding step: saves the roles, plus the coach profile and business they need, in one
 * transaction (all or nothing). Pass coach/business only when the roles need them.
 */
export const finishOnboarding = (body: {
  roles: ProfileRole[];
  coach: CoachDetails | null;
  business: BusinessDetails | null;
}) => api<void>("/me/onboarding", { method: "POST", body: JSON.stringify(body) });
