import { Check, ClipboardList, ShoppingBag, Store, type LucideIcon } from "lucide-react";

import { ROLES, type ProfileRole } from "@/lib/profile-options";
import { cn } from "@/lib/utils";

const ICONS: Record<ProfileRole, LucideIcon> = {
  ShopAndPlay: ShoppingBag,
  Coach: ClipboardList,
  Business: Store,
};

/**
 * "How will you use BaselineX?" as selectable cards, one or more.
 * Each card is a real checkbox (name="roles"), so keyboard, screen readers and FormData all work.
 */
export function RolePicker(props: {
  value: readonly ProfileRole[];
  onChange: (roles: ProfileRole[]) => void;
  legend: string;
  hideLegend?: boolean;
}) {
  // Keep the list in display order, whatever order the cards are clicked in.
  function toggle(role: ProfileRole, on: boolean) {
    props.onChange(
      ROLES.map((r) => r.value).filter((v) => (v === role ? on : props.value.includes(v))),
    );
  }

  return (
    <fieldset>
      <legend className={cn("mb-3 text-sm font-medium", props.hideLegend && "sr-only")}>
        {props.legend}
      </legend>
      <div className="space-y-3">
        {ROLES.map((role) => {
          const Icon = ICONS[role.value];
          return (
            <label
              key={role.value}
              className="group flex cursor-pointer items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/30"
            >
              <input
                type="checkbox"
                name="roles"
                value={role.value}
                checked={props.value.includes(role.value)}
                onChange={(e) => toggle(role.value, e.target.checked)}
                className="sr-only"
              />
              <span
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-has-[:checked]:bg-primary group-has-[:checked]:text-primary-foreground"
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-semibold">{role.label}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {role.description}
                </span>
              </span>
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-input text-transparent transition-colors group-has-[:checked]:border-optic group-has-[:checked]:bg-optic group-has-[:checked]:text-optic-foreground"
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
