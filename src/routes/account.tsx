import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getMe, updateMe, type MyProfile } from "@/lib/api";
import { requireAuth, useAuth } from "@/lib/auth";

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
    save.mutate({
      displayName: text("displayName") ?? profile.displayName,
      firstName: text("firstName"),
      lastName: text("lastName"),
      avatarObjectKey: profile.avatarObjectKey,
      bio: text("bio"),
      city: text("city"),
      state: text("state"),
      neighborhood: text("neighborhood"),
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow text-muted-foreground">Account</div>
          <h1 className="mt-2 text-3xl font-bold">{me.data?.displayName ?? "Your profile"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-8 rounded-2xl border bg-card p-6 shadow-card">
        {me.isPending && (
          <div className="space-y-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-2/3" />
          </div>
        )}

        {me.isError && (
          <p role="alert" className="text-sm text-destructive">
            Couldn't load your profile from the API: {me.error.message}
          </p>
        )}

        {me.data && (
          <form onSubmit={(e) => onSubmit(e, me.data)} className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Display name"
              name="displayName"
              value={me.data.displayName}
              required
              className="sm:col-span-2"
            />
            <Field label="First name" name="firstName" value={me.data.firstName} />
            <Field label="Last name" name="lastName" value={me.data.lastName} />
            <Field label="City" name="city" value={me.data.city} />
            <Field label="State" name="state" value={me.data.state} />
            <Field
              label="Neighborhood"
              name="neighborhood"
              value={me.data.neighborhood}
              className="sm:col-span-2"
            />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" defaultValue={me.data.bio ?? ""} rows={3} />
            </div>
            <div className="flex items-center justify-between gap-4 sm:col-span-2">
              <span className="text-xs text-muted-foreground">
                Member since {new Date(me.data.createdAt).toLocaleDateString()}
              </span>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  name: string;
  value: string | null;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${props.className ?? ""}`}>
      <Label htmlFor={props.name}>{props.label}</Label>
      <Input
        id={props.name}
        name={props.name}
        defaultValue={props.value ?? ""}
        required={props.required}
        maxLength={120}
      />
    </div>
  );
}
