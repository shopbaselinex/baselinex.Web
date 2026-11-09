import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORIES, CONDITIONS, NEIGHBORHOODS, PRODUCTS, SELLER_TYPES, SPORTS, sellerById } from "@/lib/data";
import { ProductCard } from "@/components/site";

type Search = { sport?: string | undefined; category?: string | undefined; q?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    sport: typeof s["sport"] === "string" ? s["sport"] : undefined,
    category: typeof s["category"] === "string" ? s["category"] : undefined,
    q: typeof s["q"] === "string" ? s["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop racquets, paddles & gear — BaselineX" },
      { name: "description", content: "Browse used and new tennis, pickleball and padel gear. Filter by grip size, head size, condition and more." },
      { property: "og:title", content: "Shop gear — BaselineX" },
      { property: "og:description", content: "Filter racquet-sport gear by sport, specs, seller and location." },
    ],
  }),
  component: Shop,
});

function Chip({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-full border px-3 py-1.5 text-xs transition ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}>{children}</button>;
}

function Shop() {
  const search = Route.useSearch();
  const nav = useNavigate({ from: "/shop" });
  const [cond, setCond] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [ship, setShip] = useState(false);
  const [pickup, setPickup] = useState(false);
  const [maxPrice, setMaxPrice] = useState(400);
  const [grip, setGrip] = useState("");
  const [sort, setSort] = useState("new");
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const results = useMemo(() => {
    let r = PRODUCTS.filter((p) => {
      const s = sellerById(p.sellerId);
      const q = search.q?.toLowerCase();
      return (!search.sport || p.sport === search.sport) && (!search.category || p.category === search.category)
        && (!q || `${p.brand} ${p.name} ${p.model}`.toLowerCase().includes(q))
        && (!cond.length || cond.includes(p.condition)) && (!types.length || types.includes(s.type))
        && (!ship || p.shipping) && (!pickup || p.pickup) && p.price <= maxPrice
        && (!grip || p.specs["Grip size"] === grip);
    });
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [search, cond, types, ship, pickup, maxPrice, grip, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="eyebrow text-muted-foreground">Marketplace</div>
      <h1 className="mt-2 text-5xl font-extrabold">{search.sport ?? search.category ?? "All gear"}</h1>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <input defaultValue={search.q} onChange={(e) => nav({ search: (s) => ({ ...s, q: e.target.value || undefined }) })} placeholder="Search brand or model — e.g. Blade 98" className="flex-1 rounded-full border bg-card px-5 py-3 outline-none focus:border-primary" />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border bg-card px-5 py-3">
          <option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8 grid gap-10 md:grid-cols-[240px_1fr]">
        <aside className="space-y-7 text-sm">
          <F t="Sport"><div className="flex flex-wrap gap-2">{SPORTS.map((s) => <Chip key={s} on={search.sport === s} onClick={() => nav({ search: (x) => ({ ...x, sport: x.sport === s ? undefined : s }) })}>{s}</Chip>)}</div></F>
          <F t="Category"><div className="flex flex-wrap gap-2">{CATEGORIES.map((c) => <Chip key={c} on={search.category === c} onClick={() => nav({ search: (x) => ({ ...x, category: x.category === c ? undefined : c }) })}>{c}</Chip>)}</div></F>
          <F t={`Max price · $${maxPrice}`}><input type="range" min={25} max={400} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-primary" /></F>
          <F t="Condition"><div className="flex flex-wrap gap-2">{CONDITIONS.map((c) => <Chip key={c} on={cond.includes(c)} onClick={() => toggle(cond, setCond, c)}>{c}</Chip>)}</div></F>
          <F t="Seller type"><div className="flex flex-wrap gap-2">{SELLER_TYPES.map((c) => <Chip key={c} on={types.includes(c)} onClick={() => toggle(types, setTypes, c)}>{c}</Chip>)}</div></F>
          <F t="Delivery">
            <label className="flex items-center gap-2"><input type="checkbox" checked={ship} onChange={(e) => setShip(e.target.checked)} className="accent-primary" /> Shipping available</label>
            <label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} className="accent-primary" /> Local pickup</label>
          </F>
          <F t="Grip size"><div className="flex flex-wrap gap-2">{["4 1/4", "4 3/8", "4 1/2"].map((g) => <Chip key={g} on={grip === g} onClick={() => setGrip(grip === g ? "" : g)}>{g}</Chip>)}</div></F>
          <F t="Location"><select className="w-full rounded-lg border bg-card px-3 py-2"><option>All of Los Angeles</option>{NEIGHBORHOODS.map((n) => <option key={n}>{n}</option>)}</select></F>
        </aside>
        <div>
          <div className="mb-4 text-sm text-muted-foreground">{results.length} items</div>
          {results.length ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">{results.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          ) : <div className="rounded-2xl border border-dashed p-16 text-center text-muted-foreground">No gear matches those filters yet.</div>}
        </div>
      </div>
    </div>
  );
}

function F({ t, children }: { t: string; children: React.ReactNode }) {
  return <div><div className="eyebrow mb-3 text-muted-foreground">{t}</div>{children}</div>;
}
