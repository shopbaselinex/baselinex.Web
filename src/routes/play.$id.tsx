import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, Star, Users, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { ACTIVITIES, CANCELLATION_POLICY, COACH_INFO, REVIEWS, activityById, fmtDate, fmtDuration } from "@/lib/activities";
import { sellerById } from "@/lib/data";
import { ActivityCard, VerifiedBadge } from "@/components/site";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/play/$id")({
  loader: ({ params }) => {
    const a = activityById(params.id);
    if (!a) throw notFound();
    return { a };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Activity not found — BaselineX" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.a.title} — BaselineX Play`;
    return { meta: [{ title: t }, { name: "description", content: loaderData.a.description }, { property: "og:title", content: t }, { property: "og:description", content: loaderData.a.description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
  },
  notFoundComponent: () => <div className="p-24 text-center">Activity not found. <Link to="/play" className="underline">Browse activities</Link></div>,
  component: Detail,
});

const FEE_RATE = 0.08; // platform fee placeholder
const TAX_RATE = 0; // services typically untaxed; hook for future tax engine

function Detail() {
  const { a } = Route.useLoaderData();
  const host = sellerById(a.hostId);
  const coachId = a.coachName === "Coach Marcus" ? "coach-marcus" : a.coachName?.startsWith("Coach Maya") ? "coach-maya" : null;
  const coach = coachId ? sellerById(coachId) : null;
  const info = coachId ? COACH_INFO[coachId] : null;
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState(1);
  const sub = a.price * qty, fee = Math.round(sub * FEE_RATE * 100) / 100, tax = sub * TAX_RATE, total = sub + fee + tax;
  const related = ACTIVITIES.filter((x) => x.id !== a.id && (x.sport === a.sport || x.area === a.area)).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/play" className="text-sm text-muted-foreground hover:underline">← All activities</Link>
      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="eyebrow text-muted-foreground">{a.sport} · {a.type}</div>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">{a.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Link to="/seller/$id" params={{ id: host.id }} className="font-medium text-foreground hover:underline">{host.name}</Link>
            {host.verified && <VerifiedBadge />}
            <span className="flex items-center gap-1"><Star className="size-4 fill-current" />{a.rating} ({a.reviews})</span>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border bg-card p-6 md:grid-cols-3">
            {[[CalendarDays, `${fmtDate(a.date)}, ${a.time}`], [Clock, fmtDuration(a.duration)], [MapPin, `${a.venue}, ${a.area}`], [Users, `${a.spotsLeft} of ${a.maxPlayers} spots left`], [Star, a.levelLabel], [Users, a.ageGroup]].map(([I, t], i) => {
              const Icon = I as typeof Clock;
              return <div key={i} className="flex items-start gap-2 text-sm"><Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{t as string}</div>;
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Exact court address is shared after booking.</p>
          <Section title="About this session"><p className="leading-relaxed text-muted-foreground">{a.description}</p></Section>
          <Section title="What to bring"><ul className="list-inside list-disc text-muted-foreground">{a.bring.map((b) => <li key={b}>{b}</li>)}</ul></Section>
          <Section title="Cancellation policy"><p className="text-muted-foreground">{CANCELLATION_POLICY}</p></Section>
          {coach && info && (
            <Section title="Your coach">
              <Link to="/seller/$id" params={{ id: coach.id }} className="flex gap-4 rounded-2xl border bg-card p-5">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-optic font-display font-bold text-optic-foreground">{coach.initials}</div>
                <div><div className="font-semibold">{coach.name} <VerifiedBadge label="Verified Coach" /></div><p className="mt-1 text-sm text-muted-foreground">{coach.about}</p><p className="mt-2 text-xs text-muted-foreground">{info.experience} · {info.certs.join(", ")}</p></div>
              </Link>
            </Section>
          )}
          <Section title="Reviews">
            <div className="space-y-4">{REVIEWS.map((r) => <div key={r.name} className="border-b pb-4"><div className="flex items-center gap-2 text-sm font-medium">{r.name}<span className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-3 fill-current" />)}</span></div><p className="mt-1 text-sm text-muted-foreground">{r.text}</p></div>)}</div>
          </Section>
        </div>

        <aside className="h-fit space-y-4 rounded-3xl border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <div className="font-display text-4xl font-bold">${a.price}<span className="text-base font-normal text-muted-foreground">{a.priceUnit ?? " / player"}</span></div>
          <div className="text-sm text-muted-foreground">{a.spotsLeft} spots remaining · max {a.maxPlayers}</div>
          <button onClick={() => { setStep(1); setOpen(true); }} disabled={!a.spotsLeft} className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground disabled:opacity-50">Reserve Your Spot</button>
          <button onClick={() => toast("Messaging is coming soon.")} className="w-full rounded-full border py-3 font-medium">Message Coach</button>
        </aside>
      </div>

      {related.length > 0 && <div className="mt-20"><h2 className="mb-6 text-2xl font-bold">Related clinics</h2><div className="grid gap-5 md:grid-cols-3">{related.map((r) => <ActivityCard key={r.id} a={r} />)}</div></div>}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{step === 3 ? "You're on the list" : "Reserve your spot"}</DialogTitle></DialogHeader>
          {step === 1 && (
            <div className="space-y-4">
              <div className="rounded-xl bg-muted p-4 text-sm"><div className="font-medium">{a.title}</div><div className="text-muted-foreground">{fmtDate(a.date)}, {a.time} · {fmtDuration(a.duration)}</div></div>
              <label className="block text-sm">Participants
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="mt-1 w-full rounded-xl border bg-card px-3 py-2">{Array.from({ length: Math.min(a.spotsLeft, 4) }).map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select>
              </label>
              <button onClick={() => setStep(2)} className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground">Review booking</button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3 text-sm">
              <Row l={`$${a.price} × ${qty}`} r={`$${sub.toFixed(2)}`} />
              <Row l="Service fee" r={`$${fee.toFixed(2)}`} />
              <Row l="Taxes" r={tax ? `$${tax.toFixed(2)}` : "—"} />
              <div className="border-t pt-3"><Row l={<b>Total</b>} r={<b>${total.toFixed(2)}</b>} /></div>
              <p className="text-xs text-muted-foreground">Payment isn't connected yet — this is a preview of the booking flow.</p>
              <div className="flex gap-2"><button onClick={() => setStep(1)} className="flex-1 rounded-full border py-3">Back</button><button onClick={() => setStep(3)} className="flex-1 rounded-full bg-primary py-3 font-semibold text-primary-foreground">Reserve</button></div>
            </div>
          )}
          {step === 3 && <p className="text-sm text-muted-foreground">Your {qty} spot{qty > 1 ? "s" : ""} for {a.title} on {fmtDate(a.date)} are held (preview — no payment taken).</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-10"><h2 className="mb-3 text-xl font-bold">{title}</h2>{children}</section>;
}
function Row({ l, r }: { l: React.ReactNode; r: React.ReactNode }) {
  return <div className="flex justify-between">{l}<span>{r}</span></div>;
}
