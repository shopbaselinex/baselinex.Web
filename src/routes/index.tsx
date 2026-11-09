import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { CATEGORIES, PRODUCTS, SELLERS, SPORTS, sellerItemCount } from "@/lib/data";
import { ActivityCard, ProductCard, SectionHead, VerifiedBadge } from "@/components/site";
import { ACTIVITIES } from "@/lib/activities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BaselineX — Give your gear another match" },
      { name: "description", content: "Buy and sell tennis, pickleball, padel and racquet-sport gear from players, clubs, coaches and pro shops in Los Angeles." },
      { property: "og:title", content: "BaselineX — Give your gear another match" },
      { property: "og:description", content: "The racquet-sport marketplace for players, clubs, coaches and pro shops." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-6">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={hero} alt="Player on a sunlit Los Angeles tennis court" width={1600} height={1008} className="h-[78vh] min-h-[520px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
            <div className="eyebrow text-optic">Now live in Los Angeles</div>
            <h1 className="mt-4 max-w-2xl text-5xl font-extrabold leading-[0.95] text-primary-foreground md:text-7xl">Give your gear another match.</h1>
            <p className="mt-5 max-w-lg text-primary-foreground/85">Buy and sell tennis, pickleball, padel and racquet-sport gear from players, clubs, coaches and pro shops.</p>
            <div className="mt-8 flex gap-3">
              <Link to="/shop" className="rounded-full bg-optic px-6 py-3 font-semibold text-optic-foreground">Shop Gear</Link>
              <Link to="/sell" className="rounded-full border border-primary-foreground/40 px-6 py-3 font-medium text-primary-foreground backdrop-blur">Sell Your Gear</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-6">
        <SectionHead eyebrow="01 — Sport" title="Shop by sport" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {SPORTS.map((s, i) => (
            <Link key={s} to="/shop" search={{ sport: s }} className={`group flex aspect-[4/5] flex-col justify-between rounded-2xl p-5 transition hover:-translate-y-1 ${i % 2 ? "bg-accent" : "bg-primary text-primary-foreground"}`}>
              <span className="eyebrow opacity-70">0{i + 1}</span>
              <span className="font-display text-2xl font-bold">{s}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c} to="/shop" search={{ category: c }} className="rounded-full border bg-card px-5 py-2.5 text-sm font-medium transition hover:border-primary">{c}</Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-6">
        <SectionHead eyebrow="02 — Featured" title="Fresh on court" to="/shop" />
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {PRODUCTS.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow text-muted-foreground">Play — Lessons & clinics</div>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Get on court</h2>
          </div>
          <Link to="/play" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Explore Activities</Link>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {([["Live Ball Near You", { type: "Live Ball" }], ["Tennis Lessons", { sport: "Tennis" }], ["Pickleball Clinics", { sport: "Pickleball" }], ["Beginner Classes", { type: "Beginner Classes" }], ["Weekend Sessions", {}]] as const).map(([l, s]) => (
            <Link key={l} to="/play" search={s} className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary">{l}</Link>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-3">{ACTIVITIES.slice(0, 3).map((a) => <ActivityCard key={a.id} a={a} />)}</div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6">
        <div className="grid gap-10 rounded-3xl bg-primary p-10 text-primary-foreground md:grid-cols-[1fr_2fr] md:p-14">
          <div>
            <div className="eyebrow text-optic">Club demo program</div>
            <h2 className="mt-3 text-4xl font-bold">Demo racquets, straight from the club wall.</h2>
            <p className="mt-4 text-primary-foreground/75">Lightly hit frames from verified LA clubs and pro shops — often 40–60% under retail.</p>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {PRODUCTS.filter((p) => p.demo).slice(0, 3).map((p) => (
              <Link key={p.id} to="/item/$id" params={{ id: p.id }} className="rounded-2xl bg-card p-3 text-card-foreground">
                <img src={p.image} alt={p.name} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
                <div className="mt-3 text-sm font-medium">{p.brand} {p.name}</div>
                <div className="text-sm"><b>${p.price}</b> <s className="text-muted-foreground">${p.retail}</s></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6">
        <SectionHead eyebrow="03 — Trusted" title="Verified clubs, coaches & pro shops" to="/sellers" />
        <div className="grid gap-4 md:grid-cols-4">
          {SELLERS.filter((s) => s.verified).map((s) => (
            <Link key={s.id} to="/seller/$id" params={{ id: s.id }} className="rounded-2xl border bg-card p-6 shadow-card transition hover:-translate-y-1">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent font-display font-bold">{s.initials}</div>
              <div className="mt-4 font-semibold">{s.name}</div>
              <div className="text-sm text-muted-foreground">{s.type} · {s.location}</div>
              <div className="mt-4 flex items-center justify-between"><VerifiedBadge /><span className="text-xs text-muted-foreground">{sellerItemCount(s.id)} items</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6">
        <SectionHead eyebrow="04 — How it works" title="Three sets to a sale" />
        <div className="grid gap-px overflow-hidden rounded-3xl border bg-border md:grid-cols-3">
          {[["List", "Snap photos, add specs like grip and string pattern, set your price."], ["Match", "Buyers find you by sport, specs or neighborhood. Accept offers or sell instantly."], ["Ship or meet", "Ship anywhere, or hand it off at your local courts."]].map(([t, d], i) => (
            <div key={t} className="bg-card p-8">
              <div className="font-display text-5xl font-extrabold text-optic-foreground/20">0{i + 1}</div>
              <div className="mt-4 text-xl font-semibold">{t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
