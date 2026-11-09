import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Star } from "lucide-react";
import club from "@/assets/club.jpg";
import { PRODUCTS, SELLERS } from "@/lib/data";
import { ACTIVITIES, COACH_INFO, activitiesByHost } from "@/lib/activities";
import { ActivityCard, ProductCard, VerifiedBadge } from "@/components/site";

export const Route = createFileRoute("/seller/$id")({
  loader: ({ params }) => {
    const s = SELLERS.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return { s };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Seller not found — BaselineX" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.s.name} storefront — BaselineX`;
    return { meta: [{ title: t }, { name: "description", content: loaderData.s.about }, { property: "og:title", content: t }, { property: "og:description", content: loaderData.s.about }] };
  },
  notFoundComponent: () => <div className="p-24 text-center">Seller not found. <Link to="/sellers" className="underline">See all sellers</Link></div>,
  component: Storefront,
});

const FILTERS = ["All", "Demo racquets", "Apparel", "Accessories"] as const;

function Storefront() {
  const { s } = Route.useLoaderData();
  const isCoach = s.type === "Coach";
  const isOrg = ["Tennis Club", "Pickleball Club", "Pro Shop"].includes(s.type);
  const sessions = activitiesByHost(s.id);
  const info = COACH_INFO[s.id];
  const clubCoaches = isOrg ? SELLERS.filter((c) => c.type === "Coach" && ACTIVITIES.some((a) => a.hostId === s.id && a.coachName === c.name)) : [];
  const tabs = isCoach ? ["Play", "Shop", "About"] : isOrg ? ["Shop", "Play", "About", "Coaches"] : ["Shop", "About"];
  const [tab, setTab] = useState<string>(tabs[0]!);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const products = PRODUCTS.filter((p) => p.sellerId === s.id);
  const items = products.filter((p) =>
    filter === "All" ? true : filter === "Demo racquets" ? p.demo : filter === "Apparel" ? p.category === "Apparel" || p.category === "Shoes" : p.category === "Accessories" || p.category === "Bags");
  return (
    <div>
      {isOrg && <img src={club} alt="" width={1600} height={704} className="h-64 w-full object-cover md:h-80" />}
      <div className="mx-auto max-w-7xl px-6">
        <div className={`flex flex-col gap-6 md:flex-row md:items-end ${isOrg ? "-mt-12" : "mt-12"}`}>
          <div className={`flex size-24 items-center justify-center border-4 border-background bg-optic font-display text-3xl font-extrabold text-optic-foreground ${isCoach ? "rounded-full" : "rounded-3xl"}`}>{s.initials}</div>
          <div className="flex-1">
            {s.verified && <VerifiedBadge label={`Verified ${s.type}`} />}
            <h1 className="text-4xl font-extrabold">{s.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="size-4" />{s.location}, CA</span>
              <span className="flex items-center gap-1"><Star className="size-4 fill-current" />{s.rating}</span>
              {info && <span>{info.sports.join(" · ")}</span>}
              <span>{products.length} items for sale</span>
              {sessions.length > 0 && <span>{sessions.length} upcoming activities</span>}
            </div>
          </div>
        </div>
        <div className="mt-10 flex gap-2 border-b">
          {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium ${tab === t ? "border-primary" : "border-transparent text-muted-foreground"}`}>{t}</button>)}
        </div>
        {tab === "Shop" && (
          <>
            <div className="mt-6 flex flex-wrap gap-2">{FILTERS.map((t) => <button key={t} onClick={() => setFilter(t)} className={`rounded-full border px-4 py-1.5 text-sm ${filter === t ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{t}</button>)}</div>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
            {!items.length && <Empty />}
          </>
        )}
        {tab === "Play" && (
          <>
            <div className="mt-8 grid gap-5 md:grid-cols-3">{sessions.map((a) => <ActivityCard key={a.id} a={a} />)}</div>
            {!sessions.length && <Empty />}
          </>
        )}
        {tab === "About" && (
          <div className="mt-8 max-w-2xl space-y-4 text-muted-foreground">
            <p className="leading-relaxed">{s.about}</p>
            {info && <dl className="grid grid-cols-[140px_1fr] gap-2 text-sm"><dt>Experience</dt><dd className="text-foreground">{info.experience}</dd><dt>Certifications</dt><dd className="text-foreground">{info.certs.join(", ")}</dd><dt>Levels taught</dt><dd className="text-foreground">{info.levels.join(", ")}</dd></dl>}
            <p className="text-sm">{s.sales} sales · Member since {s.since}</p>
          </div>
        )}
        {tab === "Coaches" && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {clubCoaches.map((c) => <Link key={c.id} to="/seller/$id" params={{ id: c.id }} className="rounded-2xl border bg-card p-5"><div className="font-semibold">{c.name}</div><div className="text-sm text-muted-foreground">{c.location}</div></Link>)}
            {!clubCoaches.length && <Empty />}
          </div>
        )}
      </div>
    </div>
  );
}

function Empty() {
  return <div className="mt-8 rounded-2xl border border-dashed p-12 text-center text-muted-foreground">Nothing in this section right now.</div>;
}
