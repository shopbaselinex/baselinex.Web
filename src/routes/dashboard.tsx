import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ACTIVITY_TYPES, AGE_GROUPS, PLAY_AREAS, SKILL_LEVELS, activitiesByHost, fmtDate } from "@/lib/activities";
import { PRODUCTS, SPORTS } from "@/lib/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Coach & Club Dashboard — BaselineX" },
      { name: "description", content: "Manage sessions, clinics, participants, gear listings and reviews on BaselineX." },
      { property: "og:title", content: "Dashboard — BaselineX" },
      { property: "og:description", content: "Run your lessons, clinics and gear storefront in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const COACH_TABS = ["Upcoming Sessions", "Create Clinic", "Participants", "Messages", "Gear Listings", "Reviews", "Profile Settings"];
const CLUB_TABS = ["Upcoming Clinics", "Create Activity", "Coaches", "Participants", "Marketplace Inventory", "Sales"];

function Dashboard() {
  const [mode, setMode] = useState<"coach" | "club">("coach");
  const tabs = mode === "coach" ? COACH_TABS : CLUB_TABS;
  const [tab, setTab] = useState<string>(COACH_TABS[0]!);
  const hostId = mode === "coach" ? "coach-marcus" : "bh-tennis-club";
  const sessions = activitiesByHost(hostId);
  const gear = PRODUCTS.filter((p) => p.sellerId === (mode === "coach" ? "coach-maya" : "riviera-racquet-club"));
  const switchMode = (m: "coach" | "club") => { setMode(m); setTab((m === "coach" ? COACH_TABS[0] : CLUB_TABS[0])!); };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><div className="eyebrow text-muted-foreground">Preview dashboard</div><h1 className="mt-2 text-4xl font-extrabold">{mode === "coach" ? "Coach Marcus" : "Beverly Hills Tennis Club"}</h1></div>
        <div className="flex rounded-full border bg-card p-1 text-sm">
          {(["coach", "club"] as const).map((m) => <button key={m} onClick={() => switchMode(m)} className={`rounded-full px-4 py-1.5 capitalize ${mode === m ? "bg-primary text-primary-foreground" : ""}`}>{m}</button>)}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Upcoming", sessions.length], ["Booked players", sessions.reduce((n, a) => n + a.maxPlayers - a.spotsLeft, 0)], ["Items listed", gear.length], ["Rating", "4.9"]].map(([l, v]) => (
          <div key={l} className="rounded-2xl border bg-card p-5"><div className="eyebrow text-muted-foreground">{l}</div><div className="mt-2 font-display text-3xl font-bold">{v}</div></div>
        ))}
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-row flex-wrap gap-1 md:flex-col">
          {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-xl px-4 py-2.5 text-left text-sm ${tab === t ? "bg-accent font-medium" : "text-muted-foreground"}`}>{t}</button>)}
        </nav>
        <div className="rounded-3xl border bg-card p-6">
          {(tab.startsWith("Upcoming")) && <Table rows={sessions.map((a) => [a.title, `${fmtDate(a.date)} ${a.time}`, `${a.maxPlayers - a.spotsLeft}/${a.maxPlayers}`, `$${a.price}`])} head={["Session", "When", "Booked", "Price"]} />}
          {tab.startsWith("Create") && <CreateForm />}
          {tab === "Participants" && <Table head={["Player", "Session", "Status"]} rows={[["Jess L.", sessions[0]?.title ?? "", "Confirmed"], ["Andre P.", sessions[0]?.title ?? "", "Confirmed"], ["Priya S.", sessions[1]?.title ?? "", "Pending"]]} />}
          {(tab === "Gear Listings" || tab === "Marketplace Inventory") && <Table head={["Item", "Condition", "Price"]} rows={gear.map((p) => [`${p.brand} ${p.name}`, p.condition, `$${p.price}`])} />}
          {tab === "Sales" && <Table head={["Item", "Buyer", "Amount"]} rows={[["Wilson Blade 98 V9", "Sam T.", "$159"], ["Court Classic", "Nina K.", "$69"]]} />}
          {tab === "Coaches" && <Table head={["Coach", "Sessions this week"]} rows={[["Coach Marcus", "6"], ["Coach Maya R.", "4"]]} />}
          {["Messages", "Reviews", "Profile Settings"].includes(tab) && <p className="text-muted-foreground">{tab} will appear here once accounts are connected.</p>}
        </div>
      </div>
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <table className="w-full text-sm">
      <thead><tr className="text-left text-muted-foreground">{head.map((h) => <th key={h} className="pb-3 font-medium">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className="border-t">{r.map((c, j) => <td key={j} className="py-3">{c}</td>)}</tr>)}</tbody>
    </table>
  );
}

const inp = "w-full rounded-xl border bg-background px-3 py-2 text-sm";
function CreateForm() {
  const F = ({ l, children }: { l: string; children: React.ReactNode }) => <label className="block text-sm"><span className="mb-1 block text-muted-foreground">{l}</span>{children}</label>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); toast("Preview only — publishing activities is coming soon."); }} className="grid gap-4 md:grid-cols-2">
      <F l="Title"><input required className={inp} placeholder="Saturday Live Ball" /></F>
      <F l="Type"><select className={inp}>{ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}</select></F>
      <F l="Sport"><select className={inp}>{SPORTS.map((t) => <option key={t}>{t}</option>)}</select></F>
      <F l="Location"><select className={inp}>{PLAY_AREAS.map((t) => <option key={t}>{t}</option>)}</select></F>
      <F l="Date"><input type="date" className={inp} /></F>
      <F l="Start time"><input type="time" className={inp} /></F>
      <F l="Duration (minutes)"><input type="number" defaultValue={90} className={inp} /></F>
      <F l="Price ($)"><input type="number" defaultValue={35} className={inp} /></F>
      <F l="Skill level"><select className={inp}>{SKILL_LEVELS.map((t) => <option key={t}>{t}</option>)}</select></F>
      <F l="Max players"><input type="number" defaultValue={8} className={inp} /></F>
      <F l="Age range"><select className={inp}>{AGE_GROUPS.map((t) => <option key={t}>{t}</option>)}</select></F>
      <F l="Equipment requirements"><input className={inp} placeholder="Racquet, water" /></F>
      <div className="md:col-span-2"><F l="Description"><textarea rows={4} className={inp} /></F></div>
      <button className="rounded-full bg-primary py-3 font-semibold text-primary-foreground md:col-span-2">Publish activity</button>
    </form>
  );
}
