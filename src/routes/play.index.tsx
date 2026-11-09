import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ACTIVITIES, ACTIVITY_TYPES, AGE_GROUPS, NTRP_LEVELS, PLAY_AREAS, SKILL_LEVELS } from "@/lib/activities";
import { SELLERS, SPORTS } from "@/lib/data";
import { ActivityCard } from "@/components/site";

type Search = { sport?: string | undefined; area?: string | undefined; type?: string | undefined };

export const Route = createFileRoute("/play/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    sport: typeof s["sport"] === "string" ? (s["sport"] as string) : undefined,
    area: typeof s["area"] === "string" ? (s["area"] as string) : undefined,
    type: typeof s["type"] === "string" ? (s["type"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Find Lessons & Clinics in LA — BaselineX Play" },
      { name: "description", content: "Book tennis, pickleball, padel and squash lessons, clinics, live ball and camps from verified LA coaches and clubs." },
      { property: "og:title", content: "Find Lessons & Clinics — BaselineX Play" },
      { property: "og:description", content: "Lessons, clinics, live ball and open play across Los Angeles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Play,
});

const sel = "w-full rounded-xl border bg-card px-3 py-2 text-sm";

function Play() {
  const init = Route.useSearch();
  const [f, setF] = useState({ q: "", sport: init.sport ?? "", area: init.area ?? "", type: init.type ?? "", level: "", ntrp: "", host: "", age: "", date: "", maxPrice: 150 });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: k === "maxPrice" ? Number(e.target.value) : e.target.value });
  const coaches = SELLERS.filter((s) => s.type === "Coach");
  const clubs = SELLERS.filter((s) => s.type !== "Coach" && s.type !== "Player");

  const list = useMemo(() => ACTIVITIES.filter((a) =>
    (!f.q || `${a.title} ${a.venue} ${a.coachName ?? ""}`.toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.sport || a.sport === f.sport) && (!f.area || a.area === f.area) && (!f.type || a.type === f.type) &&
    (!f.level || a.level === f.level) && (!f.ntrp || a.ntrp?.includes(f.ntrp as never)) &&
    (!f.host || a.hostId === f.host || (f.host === "coach-marcus" && a.coachName === "Coach Marcus")) &&
    (!f.age || a.ageGroup === f.age) && (!f.date || a.date === f.date) && a.price <= f.maxPrice,
  ).sort((a, b) => a.date.localeCompare(b.date)), [f]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="eyebrow text-muted-foreground">Play</div>
      <h1 className="mt-2 text-5xl font-extrabold">Find Lessons & Clinics</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Lessons, clinics, live ball and open play from verified coaches and clubs across Los Angeles.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {PLAY_AREAS.map((n) => (
          <button key={n} onClick={() => setF({ ...f, area: f.area === n ? "" : n })} className={`rounded-full border px-4 py-2 text-sm ${f.area === n ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{n}</button>
        ))}
        <Link to="/play/partners" className="rounded-full bg-optic px-4 py-2 text-sm font-semibold text-optic-foreground">Find a hitting partner →</Link>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <input placeholder="Search activities, coaches…" value={f.q} onChange={set("q")} className={sel} />
          <Field label="Sport"><select className={sel} value={f.sport} onChange={set("sport")}><option value="">All sports</option>{SPORTS.map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Activity type"><select className={sel} value={f.type} onChange={set("type")}><option value="">All types</option>{ACTIVITY_TYPES.map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Location"><select className={sel} value={f.area} onChange={set("area")}><option value="">All of LA</option>{PLAY_AREAS.map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Date"><input type="date" className={sel} value={f.date} onChange={set("date")} /></Field>
          <Field label={`Max price: $${f.maxPrice}`}><input type="range" min={10} max={150} value={f.maxPrice} onChange={set("maxPrice")} className="w-full accent-primary" /></Field>
          <Field label="Skill level"><select className={sel} value={f.level} onChange={set("level")}><option value="">Any level</option>{SKILL_LEVELS.map((s) => <option key={s}>{s}</option>)}</select></Field>
          {(f.sport === "" || f.sport === "Tennis") && <Field label="Tennis level (NTRP)"><select className={sel} value={f.ntrp} onChange={set("ntrp")}><option value="">Any</option>{NTRP_LEVELS.map((s) => <option key={s}>{s}</option>)}</select></Field>}
          <Field label="Coach"><select className={sel} value={coaches.some((c) => c.id === f.host) ? f.host : ""} onChange={set("host")}><option value="">Any coach</option>{coaches.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Club"><select className={sel} value={clubs.some((c) => c.id === f.host) ? f.host : ""} onChange={set("host")}><option value="">Any club</option>{clubs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          <Field label="Age group"><select className={sel} value={f.age} onChange={set("age")}><option value="">All ages</option>{AGE_GROUPS.map((s) => <option key={s}>{s}</option>)}</select></Field>
        </aside>
        <div>
          <div className="mb-4 text-sm text-muted-foreground">{list.length} activities</div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{list.map((a) => <ActivityCard key={a.id} a={a} />)}</div>
          {!list.length && <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No activities match. Try clearing a filter.</div>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="eyebrow mb-1.5 block text-muted-foreground">{label}</span>{children}</label>;
}
