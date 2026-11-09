import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { SELLERS, sellerItemCount } from "@/lib/data";
import { COACH_INFO, activitiesByHost } from "@/lib/activities";
import { VerifiedBadge } from "@/components/site";

export const Route = createFileRoute("/coaches")({
  head: () => ({
    meta: [
      { title: "Tennis & Pickleball Coaches in LA — BaselineX" },
      { name: "description", content: "Verified racquet-sport coaches in Los Angeles offering lessons, clinics and gear for sale." },
      { property: "og:title", content: "Coaches — BaselineX" },
      { property: "og:description", content: "Book lessons and shop gear from verified LA coaches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Coaches,
});

function Coaches() {
  const coaches = SELLERS.filter((s) => s.type === "Coach");
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="eyebrow text-muted-foreground">Coaches</div>
      <h1 className="mt-2 text-5xl font-extrabold">Learn from the best in LA</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {coaches.map((c) => {
          const info = COACH_INFO[c.id];
          return (
            <Link key={c.id} to="/seller/$id" params={{ id: c.id }} className="flex gap-5 rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-1">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-optic font-display text-xl font-bold text-optic-foreground">{c.initials}</div>
              <div className="flex-1">
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-muted-foreground">{info?.sports.join(" · ")} · {c.location}</div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  {c.verified && <VerifiedBadge label="Verified Coach" />}
                  <span className="flex items-center gap-1 text-muted-foreground"><Star className="size-3 fill-current" />{c.rating}</span>
                  <span className="text-muted-foreground">{activitiesByHost(c.id).length} sessions · {sellerItemCount(c.id)} items for sale</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
