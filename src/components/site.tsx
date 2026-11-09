import { Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, MapPin, Truck, Search } from "lucide-react";
import { sellerById, type Product } from "@/lib/data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6">
        <Link to="/" className="font-display text-xl font-extrabold tracking-tighter">
          BaselineX<span className="text-optic-foreground">.</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/shop" activeProps={{ className: "text-foreground" }}>Shop</Link>
          <Link to="/play" activeProps={{ className: "text-foreground" }}>Play</Link>
          <Link to="/sell" activeProps={{ className: "text-foreground" }}>Sell</Link>
          <Link to="/sellers" activeProps={{ className: "text-foreground" }}>Clubs</Link>
          <Link to="/coaches" activeProps={{ className: "text-foreground" }}>Coaches</Link>
          <Link to="/dashboard" activeProps={{ className: "text-foreground" }}>Dashboard</Link>
        </nav>
        <Link to="/shop" className="ml-auto hidden items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground lg:flex lg:w-72">
          <Search className="size-4" /> Search racquets, paddles…
        </Link>
        <Link to="/sell" className="ml-auto rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground lg:ml-0">Sell</Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-12 md:flex-row">
        <div>
          <div className="font-display text-2xl font-extrabold tracking-tighter">BaselineX.</div>
          <p className="mt-2 text-sm text-muted-foreground">Give your gear another match. Launching in Los Angeles.</p>
        </div>
        <div className="eyebrow text-muted-foreground">Tennis · Pickleball · Padel · Squash · Racquetball</div>
      </div>
    </footer>
  );
}

export function VerifiedBadge({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
      <BadgeCheck className="size-3.5" /> {label}
    </span>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const s = sellerById(p.sellerId);
  return (
    <Link to="/item/$id" params={{ id: p.id }} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <img src={p.image} alt={`${p.brand} ${p.name}`} loading="lazy" width={816} height={816} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-card px-2.5 py-1 text-xs font-medium">{p.condition}</span>
        {p.demo && <span className="absolute right-3 top-3 rounded-full bg-optic px-2.5 py-1 text-xs font-semibold text-optic-foreground">Demo</span>}
        <Heart className="absolute bottom-3 right-3 size-5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="mt-3 space-y-1">
        <div className="eyebrow text-muted-foreground">{p.brand}</div>
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-medium">{p.name}</div>
          <div className="font-display text-lg font-bold">${p.price}</div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">{s.name}{s.verified && <BadgeCheck className="size-3.5 text-primary" />}</span>
          <span className="flex items-center gap-2">
            {p.shipping && <Truck className="size-3.5" />}
            {p.pickup && <MapPin className="size-3.5" />}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SectionHead({ eyebrow, title, to }: { eyebrow: string; title: string; to?: "/shop" | "/sellers" }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <div className="eyebrow text-muted-foreground">{eyebrow}</div>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
      </div>
      {to && <Link to={to} className="text-sm font-medium underline-offset-4 hover:underline">View all →</Link>}
    </div>
  );
}

import type { Activity } from "@/lib/activities";
import { fmtDate } from "@/lib/activities";
import { Clock, Users, Star as StarIcon } from "lucide-react";

export function ActivityCard({ a }: { a: Activity }) {
  const host = sellerById(a.hostId);
  return (
    <Link to="/play/$id" params={{ id: a.id }} className="group flex flex-col rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-muted-foreground">{a.sport} · {a.type}</span>
        <span className="flex items-center gap-1 text-xs"><StarIcon className="size-3 fill-current" />{a.rating}</span>
      </div>
      <div className="mt-3 text-lg font-semibold leading-snug">{a.title}</div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-accent font-display text-xs font-bold">{host.initials}</div>
        <div className="text-sm">
          <div className="flex items-center gap-1.5 font-medium">{a.coachName ?? host.name}{host.verified && <BadgeCheck className="size-3.5 text-primary" />}</div>
          <div className="text-xs text-muted-foreground">{a.venue} · {a.area}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span>{fmtDate(a.date)}, {a.time}</span>
        <span className="flex items-center gap-1"><Clock className="size-3" />{a.duration} min</span>
        <span>{a.levelLabel}</span>
        <span className="flex items-center gap-1"><Users className="size-3" />{a.spotsLeft} spot{a.spotsLeft === 1 ? "" : "s"} left</span>
      </div>
      <div className="mt-auto flex items-baseline justify-between pt-4">
        <span className="font-display text-2xl font-bold">${a.price}<span className="text-sm font-normal text-muted-foreground">{a.priceUnit ?? ""}</span></span>
        {a.spotsLeft <= 3 && <span className="rounded-full bg-optic px-2.5 py-1 text-xs font-semibold text-optic-foreground">Almost full</span>}
      </div>
    </Link>
  );
}
