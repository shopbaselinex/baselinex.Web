import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Field, GenderField, LocationFields, TextInput } from "@/components/profile-fields";
import { RolePicker } from "@/components/role-picker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMe, updateMe, type MyProfile } from "@/lib/api";
import { requireAuth, useAuth } from "@/lib/auth";
import { useRequireCompleteProfile } from "@/lib/profile";
import type { Gender, ProfileRole } from "@/lib/profile-options";

export const Route = createFileRoute("/account")({
  ssr: false, // the session lives in the browser, so render this page there
  beforeLoad: ({ location }) => requireAuth(location.href),
  head: () => ({ meta: [{ title: "Your account — BaselineX" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // GET /me with the Bearer token. The first call also creates the user_profiles row.
  const me = useQuery({ queryKey: ["me"], queryFn: getMe });
  useRequireCompleteProfile(me.data, "/account");

  const save = useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      toast.success("Profile saved");
      return queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => toast.error(e.message),
  });

  async function onSignOut() {
    await signOut();
    router.history.push("/");
  }

  function onSubmit(e: FormEvent<HTMLFormElement>, profile: MyProfile) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || null;
    const roles = form.getAll("roles").map(String) as ProfileRole[];
    if (roles.length === 0) {
      toast.error("Pick at least one way you use BaselineX.");
      return;
    }
    save.mutate({
      displayName: text("displayName") ?? profile.displayName,
      firstName: text("firstName"),
      lastName: text("lastName"),
      avatarObjectKey: profile.avatarObjectKey,
      state: text("state"),
      country: text("country"),
      gender: text("gender") as Gender | null,
      roles,
    });
  }

  const profile = me.data?.profileComplete ? me.data : undefined; // incomplete → redirecting to /onboard

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow text-muted-foreground">Account</div>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {me.data?.displayName ?? "Your profile"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={onSignOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-8 rounded-3xl border bg-card p-6 shadow-card sm:p-8">
        {me.isError ? (
          <p role="alert" className="text-sm text-destructive">
            Couldn't load your profile from the API: {me.error.message}
          </p>
        ) : !profile ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-2/3 rounded-xl" />
          </div>
        ) : (
          // The onboarding fields stay required here: clearing one would send the user back to /onboard.
          <form onSubmit={(e) => onSubmit(e, profile)} className="grid gap-4 sm:grid-cols-2">
            <Field id="displayName" label="Display name" className="sm:col-span-2">
              <TextInput
                id="displayName"
                name="displayName"
                defaultValue={profile.displayName}
                required
                maxLength={120}
              />
            </Field>
            <TextField label="First name" name="firstName" value={profile.firstName} />
            <TextField label="Last name" name="lastName" value={profile.lastName} />
            <LocationFields
              state={profile.state}
              required
              countryHint="Only the United States for now."
            />
            <GenderField
              gender={profile.gender}
              required
              hint="Private. Never shown on your profile."
            />
            <div className="sm:col-span-2">
              <RolesField initial={profile.roles} />
            </div>
            <div className="flex items-center justify-between gap-4 border-t pt-6 sm:col-span-2">
              <span className="text-xs text-muted-foreground">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </span>
              <Button type="submit" className="rounded-full px-6" disabled={save.isPending}>
                {save.isPending ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function TextField(props: { label: string; name: string; value: string | null }) {
  return (
    <Field id={props.name} label={props.label}>
      <TextInput
        id={props.name}
        name={props.name}
        defaultValue={props.value ?? ""}
        required
        maxLength={100}
      />
    </Field>
  );
}

/** The onboarding roles, editable. The checkboxes are named "roles", so the form's FormData has them. */
function RolesField(props: { initial: ProfileRole[] }) {
  const [roles, setRoles] = useState(props.initial);
  return <RolePicker legend="How you use BaselineX" value={roles} onChange={setRoles} />;
}
