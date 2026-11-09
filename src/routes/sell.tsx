import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Check } from "lucide-react";
import { CATEGORIES, CONDITIONS, SPORTS } from "@/lib/data";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell your gear — BaselineX" },
      { name: "description", content: "List your racquet, paddle, shoes or bag in minutes. Ship it or offer local pickup in Los Angeles." },
      { property: "og:title", content: "Sell your gear — BaselineX" },
      { property: "og:description", content: "Give your gear another match. List it in minutes." },
    ],
  }),
  component: Sell,
});

const STEPS = ["Item", "Specs", "Photos", "Price & delivery"];
const input = "w-full rounded-xl border bg-card px-4 py-3 outline-none focus:border-primary";

function Sell() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [delivery, setDelivery] = useState("Both");
  if (done) return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-optic text-optic-foreground"><Check /></div>
      <h1 className="mt-6 text-4xl font-extrabold">Your listing is ready.</h1>
      <p className="mt-3 text-muted-foreground">Accounts and live publishing are coming next — this is a preview of the flow.</p>
      <Link to="/shop" className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">Browse the marketplace</Link>
    </div>
  );
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="eyebrow text-muted-foreground">Sell</div>
      <h1 className="mt-2 text-5xl font-extrabold">List your gear</h1>
      <div className="mt-8 flex gap-2">{STEPS.map((s, i) => <div key={s} className="flex-1"><div className={`h-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} /><div className={`mt-2 text-xs ${i === step ? "font-medium" : "text-muted-foreground"}`}>{s}</div></div>)}</div>
      <div className="mt-10 space-y-4">
        {step === 0 && <>
          <div className="grid grid-cols-2 gap-4">
            <select className={input}>{SPORTS.map((s) => <option key={s}>{s}</option>)}</select>
            <select className={input}>{CATEGORIES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          <input className={input} placeholder="Brand (e.g. Wilson)" />
          <input className={input} placeholder="Model (e.g. Blade 98 V9)" />
          <select className={input}>{CONDITIONS.map((s) => <option key={s}>{s}</option>)}</select>
          <textarea className={input} rows={4} placeholder="Describe how it's been used…" />
        </>}
        {step === 1 && <div className="grid grid-cols-2 gap-4">
          {["Grip size", "Head size", "Weight", "String pattern", "Balance", "Length", "Strings installed", "String tension"].map((f) => <input key={f} className={input} placeholder={f} />)}
        </div>}
        {step === 2 && <label className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed bg-card text-muted-foreground">
          <Camera className="size-8" /><span className="text-sm">Add up to 8 photos — face, throat, butt cap, bumper</span><input type="file" multiple accept="image/*" className="hidden" />
        </label>}
        {step === 3 && <>
          <input className={input} type="number" placeholder="Price (USD)" />
          <div className="grid grid-cols-3 gap-3">{["Ship item", "Local pickup", "Both"].map((d) => <button key={d} onClick={() => setDelivery(d)} className={`rounded-xl border py-3 text-sm font-medium ${delivery === d ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{d}</button>)}</div>
          {delivery !== "Ship item" && <input className={input} placeholder="Pickup neighborhood (e.g. Santa Monica)" />}
        </>}
      </div>
      <div className="mt-10 flex justify-between">
        <button disabled={!step} onClick={() => setStep(step - 1)} className="rounded-full border px-6 py-3 font-medium disabled:opacity-40">Back</button>
        <button onClick={() => (step < 3 ? setStep(step + 1) : setDone(true))} className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground">{step < 3 ? "Continue" : "Publish listing"}</button>
      </div>
    </div>
  );
}
