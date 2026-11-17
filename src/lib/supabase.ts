import { createClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

// Pages also render on the server (SSR). There is no localStorage there, so the session
// only lives in the browser; the server render always sees a signed-out user.
const isBrowser = typeof window !== "undefined";

/**
 * The one Supabase client for the app. Used for auth only: all app data goes through the .NET API.
 * null until VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env.local,
 * so the rest of the site keeps working before Supabase is configured.
 */
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          persistSession: isBrowser,
          autoRefreshToken: isBrowser,
          detectSessionInUrl: isBrowser,
        },
      })
    : null;

/** Current access token (refreshed automatically by supabase-js when it is close to expiry). */
export async function getAccessToken(): Promise<string | undefined> {
  if (!supabase) return undefined;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}
