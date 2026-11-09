import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MapPin, MessageCircle, Star, Truck } from "lucide-react";
import { PRODUCTS, productById, sellerById } from "@/lib/data";
import { ProductCard, VerifiedBadge } from "@/components/site";

export const Route = createFileRoute("/item/$id")({
  loader: ({ params }) => {
    const p = productById(params.id);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Item not found — BaselineX" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.p.brand} ${loaderData.p.name} — $${loaderData.p.price} | BaselineX`;
    const d = `${loaderData.p.condition} ${loaderData.p.brand} ${loaderData.p.name}. ${loaderData.p.description}`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  notFoundComponent: () => <div className="p-24 text-center">This item is no longer available. <Link to="/shop" className="underline">Keep shopping</Link></div>,
  component: Item,
});

function Item() {
  const { p } = Route.useLoaderData();
  const s = sellerById(p.sellerId);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
        <div className="grid grid-cols-[80px_1fr] gap-3">
          <div className="space-y-3">{[0, 1, 2].map((i) => <img key={i} src={p.image} alt="" className="aspect-square rounded-xl object-cover" />)}</div>
          <img src={p.image} alt={`${p.brand} ${p.name}`} width={816} height={816} className="aspect-square w-full rounded-3xl object-cover" />
        </div>
        <div>
          <div className="eyebrow text-muted-foreground">{p.brand} · {p.sport} · {p.year}</div>
          <h1 className="mt-2 text-4xl font-extrabold">{p.name}</h1>
          <div className="mt-1 text-muted-foreground">{p.model}</div>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">${p.price}</span>
            <s className="text-muted-foreground">${p.retail} retail</s>
            <span className="ml-auto rounded-full bg-accent px-3 py-1 text-sm font-medium">{p.condition}</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={() => setMsg("Checkout opens in the next version.")} className="col-span-2 rounded-full bg-primary py-3.5 font-semibold text-primary-foreground">Buy Now</button>
            <button onClick={() => setMsg("Offer sent to seller.")} className="rounded-full border py-3 font-medium">Make Offer</button>
            <button onClick={() => setSaved(!saved)} className="flex items-center justify-center gap-2 rounded-full border py-3 font-medium"><Heart className={`size-4 ${saved ? "fill-clay text-clay" : ""}`} /> {saved ? "Saved" : "Save"}</button>
          </div>
          {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
          <div className="mt-6 space-y-2 text-sm">
            {p.shipping && <div className="flex items-center gap-2"><Truck className="size-4" /> Ships nationwide · $14 flat</div>}
            {p.pickup && <div className="flex items-center gap-2"><MapPin className="size-4" /> Local pickup in {s.location}</div>}
          </div>
          <Link to="/seller/$id" params={{ id: s.id }} className="mt-8 flex items-center gap-4 rounded-2xl border bg-card p-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent font-display font-bold">{s.initials}</div>
            <div className="flex-1">
              <div className="font-semibold">{s.name}</div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Star className="size-3 fill-current" />{s.rating}</span>{s.type} · {s.location}</div>
            </div>
            {s.verified && <VerifiedBadge />}
          </Link>
          <button onClick={() => setMsg("Message thread started.")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2 text-sm font-medium"><MessageCircle className="size-4" /> Message seller</button>
          <p className="mt-6 text-sm leading-relaxed">{p.description}</p>
          <dl className="mt-6 divide-y rounded-2xl border bg-card text-sm">
            {Object.entries(p.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      <h2 className="mb-6 mt-20 text-2xl font-bold">More like this</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">{PRODUCTS.filter((x) => x.id !== p.id && x.sport === p.sport).slice(0, 4).map((x) => <ProductCard key={x.id} p={x} />)}</div>
    </div>
  );
}
