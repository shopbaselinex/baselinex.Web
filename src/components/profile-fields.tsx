import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRY, GENDERS, US_STATES } from "@/lib/profile-options";
import { cn } from "@/lib/utils";

// BaselineX form controls, used by signup, onboarding and the account page.
// They match the Sell form: tall, rounded-xl, card background, court-green focus.
// Plain form controls, so FormData can read them.

const control =
  "w-full rounded-xl border border-input bg-card px-4 text-base shadow-none outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <Input className={cn(control, "h-12", className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return <Textarea className={cn(control, "py-3", className)} {...props} />;
}

/** Native <select>: phones show their own picker. A required select with no choice shows muted like a placeholder. */
export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          control,
          "peer h-12 appearance-none pr-10 invalid:text-muted-foreground [&>option]:text-foreground",
          className,
        )}
        {...props}
      />
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground peer-disabled:opacity-50"
      />
    </div>
  );
}

/** Label + control + optional hint. hideLabel keeps the label for screen readers only (placeholder-style forms). */
export function Field(props: {
  id: string;
  label: string;
  hint?: ReactNode;
  hideLabel?: boolean | undefined;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", props.className)}>
      <Label htmlFor={props.id} className={props.hideLabel ? "sr-only" : undefined}>
        {props.label}
      </Label>
      {props.children}
      {props.hint && (
        <p id={`${props.id}-hint`} className="text-xs leading-relaxed text-muted-foreground">
          {props.hint}
        </p>
      )}
    </div>
  );
}

/** Country and state. The country is locked to the US for now; the state is a list of US states. */
export function LocationFields(props: {
  state: string | null;
  required?: boolean;
  hideLabels?: boolean;
  countryHint?: ReactNode;
}) {
  const required = props.required ?? false;

  return (
    <>
      <Field id="country" label="Country" hint={props.countryHint} hideLabel={props.hideLabels}>
        <NativeSelect
          id="country"
          disabled
          aria-describedby={props.countryHint ? "country-hint" : undefined}
        >
          <option value={COUNTRY.code}>{COUNTRY.name}</option>
        </NativeSelect>
        {/* Disabled fields are left out of the form data, so this one sends the value. */}
        <input type="hidden" name="country" value={COUNTRY.code} />
      </Field>
      <StateField id="state" state={props.state} required={required} hideLabel={props.hideLabels} />
    </>
  );
}

/** A US state picker. The form field is always named "state". */
export function StateField(props: {
  id: string;
  label?: string;
  state: string | null;
  required?: boolean;
  hideLabel?: boolean | undefined;
}) {
  const required = props.required ?? false;
  const saved = US_STATES.some(([code]) => code === props.state) ? (props.state ?? "") : "";
  return (
    <Field id={props.id} label={props.label ?? "State"} hideLabel={props.hideLabel}>
      <NativeSelect id={props.id} name="state" defaultValue={saved} required={required}>
        <option value="" disabled={required}>
          Select state
        </option>
        {US_STATES.map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </NativeSelect>
    </Field>
  );
}

export function GenderField(props: {
  gender: string | null;
  required?: boolean;
  hideLabel?: boolean;
  hint?: ReactNode;
}) {
  const required = props.required ?? false;
  return (
    <Field id="gender" label="Gender" hint={props.hint} hideLabel={props.hideLabel}>
      <NativeSelect
        id="gender"
        name="gender"
        defaultValue={props.gender ?? ""}
        required={required}
        aria-describedby={props.hint ? "gender-hint" : undefined}
      >
        <option value="" disabled={required}>
          Select gender
        </option>
        {GENDERS.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </NativeSelect>
    </Field>
  );
}
