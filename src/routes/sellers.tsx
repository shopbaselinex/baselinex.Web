import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { SELLERS, sellerItemCount } from "@/lib/data";
import { VerifiedBadge } from "@/components/site";

export const Route = createFileRoute("/sellers")({
  head: () => ({
    meta: [
      { title: "Clubs, coaches & pro shops — BaselineX" },
      { name: "description", content: "Shop storefronts from verified Los Angeles tennis clubs, pickleball clubs, coaches and pro shops." },
      { property: "og:title", content: "Verified sellers — BaselineX" },
      { property: "og:description", content: "Club storefronts and verified sellers across Los Angeles." },
    ],
  }),
  component: Sellers,
});

function Sellers() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="eyebrow text-muted-foreground">Storefronts</div>
      <h1 className="mt-2 text-5xl font-extrabold">Clubs & sellers</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {SELLERS.map((s) => (
          <Link key={s.id} to="/seller/$id" params={{ id: s.id }} className="flex gap-4 rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-1">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent font-display text-lg font-bold">{s.initials}</div>
            <div className="flex-1">
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-muted-foreground">{s.type} · {s.location}</div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                {s.verified && <VerifiedBadge />}
                <span className="flex items-center gap-1 text-muted-foreground"><Star className="size-3 fill-current" />{s.rating}</span>
                <span className="text-muted-foreground">{sellerItemCount(s.id)} items</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
