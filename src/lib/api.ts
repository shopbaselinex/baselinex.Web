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
  bio: string | null;
  city: string | null;
  state: string | null;
  neighborhood: string | null;
  stripeOnboardingStatus: string;
  createdAt: string;
};

export type UpdateProfileRequest = Omit<MyProfile, "id" | "stripeOnboardingStatus" | "createdAt">;

// The first authenticated call also creates the user_profiles row on the backend.
export const getMe = () => api<MyProfile>("/me");
export const updateMe = (body: UpdateProfileRequest) =>
  api<void>("/me", { method: "PUT", body: JSON.stringify(body) });
