import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AuthCard, FormError } from "@/components/auth-card";
import {
  Field,
  GenderField,
  LocationFields,
  NativeSelect,
  StateField,
  TextArea,
  TextInput,
} from "@/components/profile-fields";
import { RolePicker } from "@/components/role-picker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSports, type BusinessDetails, type CoachDetails, type MyProfile } from "@/lib/api";
import type { OnboardingFields } from "@/lib/profile";
import {
  BUSINESS_TYPES,
  type BusinessType,
  type Gender,
  type ProfileRole,
} from "@/lib/profile-options";

// The forms of the /onboard steps. The route (src/routes/onboard.tsx) decides which one shows
// and when to save.

/** Only shown when the signup answers are missing (e.g. Google sign-in) or were rejected. */
export function DetailsStep(props: {
  profile: MyProfile;
  fromSignup: OnboardingFields;
  error: string | null;
  onSave: (fields: OnboardingFields) => void;
}) {
  const { profile, fromSignup } = props;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || null;
    props.onSave({
      firstName: text("firstName"),
      lastName: text("lastName"),
      country: text("country"),
      state: text("state"),
      gender: text("gender") as Gender | null,
    });
  }

  return (
    <AuthCard
      wide
      eyebrow="Almost there"
      title="Your details"
      subtitle="So we can show you gear, players and sessions near you."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="firstName" label="First name" hideLabel>
            <TextInput
              id="firstName"
              name="firstName"
              placeholder="First name"
              autoComplete="given-name"
              defaultValue={profile.firstName ?? fromSignup.firstName ?? ""}
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
              defaultValue={profile.lastName ?? fromSignup.lastName ?? ""}
              required
              maxLength={100}
            />
          </Field>
        </div>
        <GenderField
          gender={profile.gender ?? fromSignup.gender}
          required
          hideLabel
          hint="Private. It's never shown on your profile."
        />
        <LocationFields
          state={profile.state ?? fromSignup.state}
          required
          hideLabels
          countryHint="BaselineX is only available in the United States for now."
        />
        <FormError message={props.error} />
        <div className="border-t pt-6">
          <Button type="submit" className="h-12 w-full rounded-full text-base font-semibold">
            Continue
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}

export type StepProps = {
  progress: string | undefined;
  back: (() => void) | undefined;
  saving: boolean;
  error: string | null;
};

export function StepActions(props: {
  back: (() => void) | undefined;
  label: string;
  disabled: boolean;
}) {
  return (
    <div className="flex gap-3 border-t pt-6">
      {props.back && (
        <Button
          type="button"
          variant="ghost"
          onClick={props.back}
          className="h-12 rounded-full px-5 text-muted-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
      )}
      <Button
        type="submit"
        disabled={props.disabled}
        className="h-12 flex-1 rounded-full text-base font-semibold"
      >
        {props.label}
      </Button>
    </div>
  );
}

export function RolesStep(
  props: StepProps & {
    firstName: string | null;
    initial: ProfileRole[];
    labelFor: (roles: ProfileRole[]) => string;
    onNext: (roles: ProfileRole[]) => void;
  },
) {
  const [roles, setRoles] = useState(props.initial);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (roles.length > 0) props.onNext(roles);
  }

  return (
    <AuthCard
      wide
      eyebrow={props.progress ?? (props.firstName ? `Welcome, ${props.firstName}` : "Welcome")}
      title="How will you use BaselineX?"
      subtitle="Pick everything that fits. You can change it later in your account."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <RolePicker
          legend="How will you use BaselineX?"
          hideLegend
          value={roles}
          onChange={setRoles}
        />
        <FormError message={props.error} />
        <StepActions
          back={props.back}
          label={props.saving ? "Saving…" : props.labelFor(roles)}
          disabled={roles.length === 0 || props.saving}
        />
        {roles.length === 0 && (
          <p className="-mt-3 text-center text-xs text-muted-foreground">
            Pick at least one to continue.
          </p>
        )}
      </form>
    </AuthCard>
  );
}

export function CoachStep(
  props: StepProps & {
    initial: CoachDetails | null;
    label: string;
    onNext: (coach: CoachDetails) => void;
  },
) {
  const sports = useQuery({ queryKey: ["sports"], queryFn: getSports });
  const [sportIds, setSportIds] = useState<number[]>(props.initial?.sportIds ?? []);
  const toggleSport = (id: number, on: boolean) =>
    setSportIds((ids) => (on ? [...ids, id] : ids.filter((x) => x !== id)));

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sportIds.length === 0) return;
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || null;
    const number = (name: string) => {
      const v = text(name);
      return v === null ? null : Number(v);
    };
    props.onNext({
      sportIds,
      yearsExperience: number("yearsExperience"),
      privateLessonRate: number("privateLessonRate"),
      bio: text("bio"),
    });
  }

  return (
    <AuthCard
      wide
      eyebrow={props.progress ?? "Coach profile"}
      title="Set up your coach profile"
      subtitle="Players see this when they look for lessons. Only the sports are required."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <fieldset>
          <legend className="mb-3 text-sm font-medium">Sports you coach</legend>
          {sports.isError ? (
            <FormError message={`Couldn't load sports: ${sports.error.message}`} />
          ) : !sports.data ? (
            <div className="flex gap-2" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sports.data.map((sport) => (
                <label
                  key={sport.id}
                  className="cursor-pointer rounded-full border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/30"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={sportIds.includes(sport.id)}
                    onChange={(e) => toggleSport(sport.id, e.target.checked)}
                  />
                  {sport.name}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="yearsExperience" label="Years coaching">
            <TextInput
              id="yearsExperience"
              name="yearsExperience"
              type="number"
              inputMode="numeric"
              min={0}
              max={80}
              placeholder="e.g. 5"
              defaultValue={props.initial?.yearsExperience ?? ""}
            />
          </Field>
          <Field id="privateLessonRate" label="Private lesson rate" hint="US dollars per hour.">
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                $
              </span>
              <TextInput
                id="privateLessonRate"
                name="privateLessonRate"
                type="number"
                inputMode="decimal"
                min={0}
                max={100000}
                step="0.01"
                placeholder="80"
                className="pl-8"
                aria-describedby="privateLessonRate-hint"
                defaultValue={props.initial?.privateLessonRate ?? ""}
              />
            </div>
          </Field>
        </div>

        <Field id="bio" label="About your coaching">
          <TextArea
            id="bio"
            name="bio"
            rows={4}
            maxLength={1000}
            placeholder="Your background, the levels you teach, what a lesson with you looks like."
            defaultValue={props.initial?.bio ?? ""}
          />
        </Field>

        <FormError message={props.error} />
        <StepActions
          back={props.back}
          label={props.saving ? "Saving…" : props.label}
          disabled={sportIds.length === 0 || props.saving}
        />
      </form>
    </AuthCard>
  );
}

export function BusinessStep(
  props: StepProps & {
    initial: BusinessDetails | null;
    defaultState: string | null;
    label: string;
    onNext: (business: BusinessDetails) => void;
  },
) {
  const initial = props.initial;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || null;
    props.onNext({
      name: text("name") ?? "",
      type: text("type") as BusinessType,
      city: text("city"),
      state: text("state"),
      website: text("website"),
      phone: text("phone"),
    });
  }

  return (
    <AuthCard
      wide
      eyebrow={props.progress ?? "Your business"}
      title="Add your business"
      subtitle="Your club, academy or shop. You'll be its owner on BaselineX."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field id="name" label="Business name">
          <TextInput
            id="name"
            name="name"
            autoComplete="organization"
            required
            maxLength={180}
            defaultValue={initial?.name ?? ""}
          />
        </Field>
        <Field id="type" label="Type">
          <NativeSelect id="type" name="type" required defaultValue={initial?.type ?? ""}>
            <option value="" disabled>
              Select type
            </option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="city" label="City">
            <TextInput
              id="city"
              name="city"
              autoComplete="address-level2"
              required
              maxLength={120}
              defaultValue={initial?.city ?? ""}
            />
          </Field>
          <StateField id="businessState" state={initial?.state ?? props.defaultState} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="website" label="Website (optional)">
            <TextInput
              id="website"
              name="website"
              inputMode="url"
              autoComplete="url"
              placeholder="yourclub.com"
              maxLength={500}
              defaultValue={initial?.website ?? ""}
            />
          </Field>
          <Field id="phone" label="Phone (optional)">
            <TextInput
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              defaultValue={initial?.phone ?? ""}
            />
          </Field>
        </div>

        <FormError message={props.error} />
        <StepActions
          back={props.back}
          label={props.saving ? "Saving…" : props.label}
          disabled={props.saving}
        />
      </form>
    </AuthCard>
  );
}
