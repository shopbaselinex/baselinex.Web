import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NEIGHBORHOODS, PRODUCTS, sellerById } from "@/lib/data";
import { ProductCard } from "@/components/site";

export const Route = createFileRoute("/local")({
  head: () => ({
    meta: [
      { title: "Local pickup in Los Angeles — BaselineX" },
      { name: "description", content: "Find racquet-sport gear for pickup in Santa Monica, Beverly Hills, Pasadena, Manhattan Beach and more." },
      { property: "og:title", content: "Local LA gear — BaselineX" },
      { property: "og:description", content: "Meet at the courts. Shop gear near you in Los Angeles." },
    ],
  }),
  component: Local,
});

function Local() {
  const [hood, setHood] = useState<string | null>(null);
  const items = PRODUCTS.filter((p) => p.pickup && (!hood || sellerById(p.sellerId).location === hood));
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="eyebrow text-muted-foreground">Local pickup · Los Angeles</div>
      <h1 className="mt-2 max-w-3xl text-5xl font-extrabold">Meet at the courts.</h1>
      <div className="mt-8 flex flex-wrap gap-2">
        <button onClick={() => setHood(null)} className={`rounded-full border px-4 py-2 text-sm ${!hood ? "bg-primary text-primary-foreground" : "bg-card"}`}>All LA</button>
        {NEIGHBORHOODS.map((n) => (
          <button key={n} onClick={() => setHood(n)} className={`rounded-full border px-4 py-2 text-sm ${hood === n ? "bg-primary text-primary-foreground" : "bg-card"}`}>{n}</button>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      {!items.length && <div className="mt-6 rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No pickup listings in {hood} yet.</div>}
    </div>
  );
}
