import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PLAYERS, PLAY_AREAS } from "@/lib/activities";

export const Route = createFileRoute("/play/partners")({
  head: () => ({
    meta: [
      { title: "Find a Hitting Partner in LA — BaselineX" },
      { name: "description", content: "Discover tennis, pickleball and padel players near you by level, area and preferred playing times." },
      { property: "og:title", content: "Find a Hitting Partner — BaselineX" },
      { property: "og:description", content: "Meet racquet-sport players at your level across Los Angeles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Partners,
});

function Partners() {
  const [sport, setSport] = useState("");
  const [area, setArea] = useState("");
  const list = PLAYERS.filter((p) => (!sport || p.sport === sport) && (!area || p.area === area));
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="eyebrow text-muted-foreground">Play · Coming soon</div>
      <h1 className="mt-2 text-5xl font-extrabold">Find a Hitting Partner</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Browse players near you. Connecting and scheduling directly is on the way.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <select value={sport} onChange={(e) => setSport(e.target.value)} className="rounded-xl border bg-card px-3 py-2 text-sm"><option value="">All sports</option>{["Tennis", "Pickleball", "Padel"].map((s) => <option key={s}>{s}</option>)}</select>
        <select value={area} onChange={(e) => setArea(e.target.value)} className="rounded-xl border bg-card px-3 py-2 text-sm"><option value="">All of LA</option>{PLAY_AREAS.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {list.map((p) => (
          <div key={p.name} className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-full bg-accent font-display font-bold">{p.initials}</div><div><div className="font-semibold">{p.name}</div><div className="text-sm text-muted-foreground">{p.sport} · {p.area}</div></div></div>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm"><dt className="text-muted-foreground">Level</dt><dd>{p.level}</dd><dt className="text-muted-foreground">Plays</dt><dd>{p.times}</dd><dt className="text-muted-foreground">Courts</dt><dd>{p.courts}</dd><dt className="text-muted-foreground">Style</dt><dd>{p.style}</dd></dl>
            <button onClick={() => toast("Player connections are coming soon.")} className="mt-5 w-full rounded-full border py-2 text-sm font-medium">Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
}
