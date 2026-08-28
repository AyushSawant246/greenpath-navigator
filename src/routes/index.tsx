import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Crosshair,
  Gauge,
  Hospital,
  LayoutDashboard,
  Lightbulb,
  LogIn,
  MapPinned,
  Menu,
  Navigation,
  Radio,
  Route as RouteIcon,
  ShieldCheck,
  Siren,
  Sparkles,
  TrafficCone,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";

import cityGrid from "@/assets/greenpulse-city-grid.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GreenPulse — Intelligent Emergency Green Corridors" },
      { name: "description", content: "Simulate dynamic emergency corridors, coordinated signals, and nearby vehicle alerts with GreenPulse." },
      { property: "og:title", content: "GreenPulse — Intelligent Emergency Green Corridors" },
      { property: "og:description", content: "A civic operations prototype for coordinating emergency routes and traffic signals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GreenPulse,
});

type Role = "Ambulance" | "Citizen" | "Admin";
type Section = "active" | "route" | "signals";
type SignalState = "cleared" | "preparing" | "scheduled" | "normal";

const signals = [
  { id: "SIG-014", name: "5th & Madison", distance: "400 m", eta: 25, action: "Prepare GREEN" },
  { id: "SIG-028", name: "8th & Broadway", distance: "850 m", eta: 52, action: "Schedule GREEN" },
  { id: "SIG-031", name: "12th & Mercer", distance: "1.2 km", eta: 78, action: "Schedule GREEN" },
  { id: "SIG-041", name: "Main St. Exit", distance: "1.7 km", eta: 110, action: "Schedule GREEN" },
];

const routeStops = ["Current location", "I-94 / Madison", "8th & Broadway", "12th & Mercer", "City Hospital"];

function GreenPulse() {
  const [screen, setScreen] = useState<"landing" | "dashboard">("landing");
  const [role, setRole] = useState<Role>("Ambulance");
  const [section, setSection] = useState<Section>("active");
  const [tripActive, setTripActive] = useState(true);
  const [progress, setProgress] = useState(1);
  const [selectedHospital, setSelectedHospital] = useState("City Hospital");
  const [emergency, setEmergency] = useState("Critical");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"Register" | "Sign in">("Register");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!tripActive) return;
    const timer = window.setInterval(() => setProgress((value) => (value >= 4 ? 1 : value + 1)), 4200);
    return () => window.clearInterval(timer);
  }, [tripActive]);

  const currentSignalStates = useMemo<SignalState[]>(() => {
    if (!tripActive) return signals.map(() => "normal");
    return signals.map((_, index) => index < progress - 1 ? "cleared" : index === progress - 1 ? "preparing" : "scheduled");
  }, [progress, tripActive]);

  const openDashboard = () => {
    setScreen("dashboard");
    setTripActive(true);
  };

  const endTrip = () => {
    setTripActive(false);
    setProgress(4);
  };

  if (screen === "landing") {
    return (
      <div className="min-h-screen bg-brand-surface text-foreground">
        <LandingNav onDemo={openDashboard} onAuth={(mode) => { setAuthMode(mode); setShowAuth(true); }} />
        <LandingHero onStart={() => { setAuthMode("Register"); setShowAuth(true); }} onDemo={openDashboard} />
        <HowItWorks />
        <LandingProof onDemo={openDashboard} />
        <footer className="border-t border-brand-line bg-brand-surface px-6 py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-foreground">GreenPulse Operations</span>
            <span>Prototype simulation · No real signal control or emergency services</span>
          </div>
        </footer>
        {showAuth && <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setShowAuth(false)} onComplete={openDashboard} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-brand-line bg-brand-surface/90 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <BrandMark />
          <div className="hidden h-4 w-px bg-brand-line sm:block" />
          <div className="hidden items-center gap-1 sm:flex" aria-label="Demo roles">
            {(["Ambulance", "Citizen", "Admin"] as Role[]).map((item) => (
              <Button key={item} variant="ghost" size="sm" onClick={() => { setRole(item); setSection("active"); }} className={cn("h-7 px-2.5 text-xs", role === item && "bg-brand-ui text-foreground")}>{item}</Button>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Open role menu"><Menu /></Button>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-emerald-700 sm:flex"><span className="size-1.5 rounded-full bg-brand-success" /> System active</div>
          <div className="grid size-8 place-items-center rounded-full bg-brand-ui text-muted-foreground"><UserRound className="size-4" /></div>
        </div>
      </header>
      {mobileOpen && <div className="fixed left-3 right-3 top-[4.5rem] z-40 flex gap-1 rounded-lg border border-brand-line bg-card p-2 shadow-civic-lg sm:hidden">{(["Ambulance", "Citizen", "Admin"] as Role[]).map((item) => <Button key={item} variant="ghost" size="sm" onClick={() => { setRole(item); setMobileOpen(false); }}>{item}</Button>)}</div>}

      <main className="flex min-h-screen pt-14">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-line bg-brand-ui/40 lg:flex">
          <div className="space-y-6 p-4">
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Navigation</p>
              <SidebarButton icon={Activity} label="Active missions" active={section === "active"} onClick={() => setSection("active")} />
              <SidebarButton icon={RouteIcon} label="Route planner" active={section === "route"} onClick={() => setSection("route")} />
              <SidebarButton icon={TrafficCone} label="Signal health" active={section === "signals"} onClick={() => setSection("signals")} />
            </div>
            <UnitCard active={tripActive} onEnd={endTrip} onStart={() => setTripActive(true)} />
          </div>
          <div className="mt-auto border-t border-brand-line p-4"><div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-brand-success" /> Network latency: 12ms</div></div>
        </aside>
        <section className="min-w-0 flex-1">
          <div className="border-b border-brand-line bg-card px-4 py-5 sm:px-6 sm:py-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground"><span>{role === "Admin" ? "Command view" : role === "Citizen" ? "Public safety view" : "Destination"}</span><span className="size-1 rounded-full bg-brand-line" /><span>ETA: {tripActive ? "04:12" : "—"}</span></div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{role === "Citizen" ? "Nearby emergency activity" : role === "Admin" ? "Signal operations center" : selectedHospital}</h1></div>
              <div className="flex items-center gap-4"><div className="text-left sm:text-right"><div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{tripActive ? "Clear path status" : "Corridor status"}</div><div className={cn("text-lg font-medium", tripActive ? "text-brand-success" : "text-muted-foreground")}>{tripActive ? "92% synchronized" : "Signals normal"}</div></div><div className="hidden h-9 w-px bg-brand-line sm:block" /><div className="hidden text-right sm:block"><div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live units</div><div className="font-mono text-lg font-medium">04</div></div></div>
            </div>
          </div>
          <div className="min-h-[calc(100vh-8.5rem)] overflow-y-auto bg-brand-ui p-4 sm:p-6">
            <div className="mx-auto max-w-6xl space-y-6">
              {role === "Citizen" ? <CitizenView tripActive={tripActive} /> : role === "Admin" ? <AdminView tripActive={tripActive} signalStates={currentSignalStates} /> : <AmbulanceView tripActive={tripActive} progress={progress} section={section} selectedHospital={selectedHospital} setSelectedHospital={setSelectedHospital} emergency={emergency} setEmergency={setEmergency} signals={signals} signalStates={currentSignalStates} onStart={() => { setTripActive(true); setProgress(1); }} onEnd={endTrip} />}
            </div>
          </div>
        </section>
      </main>
      {tripActive && role === "Ambulance" && <div className="fixed bottom-4 right-4 z-30 hidden w-80 rounded-xl border border-brand-line bg-card p-4 shadow-civic-lg xl:block"><div className="flex items-start gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600"><Clock3 className="size-4" /></div><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">Approaching junction</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{signals[Math.max(progress - 1, 0)].id} switching to emergency override in 8 seconds.</p><Button variant="outline" size="sm" className="mt-3 h-7 text-xs" onClick={() => setSection("signals")}>Open signal details</Button></div><Button variant="ghost" size="icon" className="-mr-2 -mt-2 size-7" aria-label="Dismiss alert"><X className="size-3.5" /></Button></div></div>}
    </div>
  );
}

function BrandMark() { return <div className="flex items-center gap-2"><div className="grid size-6 place-items-center rounded-[4px] bg-brand-primary"><span className="size-2 rounded-full bg-brand-primary-foreground" /></div><span className="font-medium tracking-tight">GreenPulse</span></div>; }

function LandingNav({ onDemo, onAuth }: { onDemo: () => void; onAuth: (mode: "Register" | "Sign in") => void }) {
  return <nav className="flex h-16 items-center justify-between border-b border-brand-line bg-brand-surface/90 px-5 backdrop-blur-md sm:px-8"><BrandMark /><div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex"><span>System status</span><span>Emergency protocols</span><span>Network map</span></div><div className="flex items-center gap-2 sm:gap-4"><Button variant="ghost" size="sm" onClick={() => onAuth("Sign in")}><LogIn /> <span className="hidden sm:inline">Sign in</span></Button><Button size="sm" onClick={onDemo}>Open demo <ArrowRight /></Button></div></nav>;
}

function LandingHero({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  return <header className="overflow-hidden border-b border-brand-line px-5 py-16 sm:px-8 sm:py-24"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-success opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-brand-success" /></span> Next-gen traffic coordination</div><h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-7xl">Intelligent emergency <span className="text-brand-success">green corridors.</span></h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Coordinate traffic signals dynamically to help emergency vehicles reach critical destinations faster — while keeping the rest of the city moving.</p><div className="mt-9 flex flex-wrap gap-3"><Button size="lg" onClick={onStart}>Get started <ArrowRight /></Button><Button variant="outline" size="lg" onClick={onDemo}>View demo <MapPinned /></Button></div><div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground"><span className="flex items-center gap-2"><Check className="size-3.5 text-brand-success" /> Route calculated automatically</span><span className="flex items-center gap-2"><Check className="size-3.5 text-brand-success" /> Signals return to normal</span></div></div><div className="relative overflow-hidden rounded-xl border border-brand-line bg-brand-ui shadow-civic-lg"><img src={cityGrid} alt="Simulated city grid with a highlighted emergency corridor" width={1200} height={608} className="h-auto w-full object-cover" /><div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-white/70 bg-card/90 px-3 py-2 text-xs font-medium shadow-civic backdrop-blur-sm"><span className="size-2 rounded-full bg-brand-success signal-pulse" /> Corridor preview <span className="text-muted-foreground">·</span> 4 signals synced</div><div className="absolute bottom-4 left-4 rounded-lg border border-white/70 bg-card/90 px-3 py-2 shadow-civic backdrop-blur-sm"><div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Emergency route</div><div className="mt-1 flex items-center gap-2 text-sm font-semibold"><Ambulance className="size-4 text-brand-success" /> AMB-102 <ArrowRight className="size-3.5 text-muted-foreground" /> <Hospital className="size-4 text-brand-success" /> City Hospital</div></div></div></div></header>;
}

function HowItWorks() {
  const items = [{ icon: Crosshair, title: "Route-aware", text: "GreenPulse scores distance, congestion, intersections, and emergency priority." }, { icon: Lightbulb, title: "Time coordinated", text: "Each upcoming signal receives a green window based on predicted arrival." }, { icon: Bell, title: "City informed", text: "Nearby vehicles receive a directional give-way alert before the ambulance arrives." }];
  return <section className="border-b border-brand-line px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto max-w-7xl"><div className="mb-10 max-w-xl"><p className="text-xs font-bold uppercase tracking-widest text-brand-success">How it works</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">One coordinated response, from dispatch to destination.</h2></div><div className="grid gap-4 md:grid-cols-3">{items.map(({ icon: Icon, title, text }, index) => <div key={title} className="border-l-2 border-brand-line py-2 pl-5"><div className="mb-5 grid size-9 place-items-center rounded-lg bg-brand-ui text-brand-success"><Icon className="size-4" /></div><div className="mb-2 text-sm font-semibold">0{index + 1} / {title}</div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}</div></div></section>;
}

function LandingProof({ onDemo }: { onDemo: () => void }) {
  return <section className="bg-brand-ui px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-success">Simulation workspace</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">See the route, every signal window, and every nearby alert in one operational view.</h2></div><div className="flex items-end justify-between gap-6 border-t border-brand-line pt-5"><div><div className="font-mono text-3xl font-medium">04:12</div><div className="mt-1 text-xs text-muted-foreground">Projected hospital ETA</div></div><div><div className="font-mono text-3xl font-medium text-brand-success">92%</div><div className="mt-1 text-xs text-muted-foreground">Corridor synchronized</div></div><Button variant="outline" onClick={onDemo} aria-label="Open the GreenPulse demo"><ArrowRight /></Button></div></div></section>;
}

function SidebarButton({ icon: Icon, label, active, onClick }: { icon: typeof Activity; label: string; active: boolean; onClick: () => void }) { return <Button variant="ghost" onClick={onClick} className={cn("w-full justify-start gap-3 px-3 text-sm font-medium text-muted-foreground", active && "bg-emerald-50 text-brand-success hover:bg-emerald-50 hover:text-brand-success")}><Icon className="size-4" /> {label}</Button>; }

function UnitCard({ active, onEnd, onStart }: { active: boolean; onEnd: () => void; onStart: () => void }) { return <div className="rounded-xl border border-brand-line bg-card p-4 shadow-civic"><h3 className="mb-3 text-xs font-medium">Unit AMB-102</h3><div className="space-y-3"><div className="flex items-center justify-between"><span className="text-[11px] text-muted-foreground">Priority</span><Badge className="border-transparent bg-rose-50 text-[11px] text-rose-600 hover:bg-rose-50">CRITICAL</Badge></div><div className="flex items-center justify-between"><span className="text-[11px] text-muted-foreground">Status</span><span className="text-[11px] text-foreground">{active ? "In transit" : "Available"}</span></div>{active ? <Button variant="destructive" size="sm" className="w-full" onClick={onEnd}>End mission</Button> : <Button size="sm" className="w-full" onClick={onStart}>Start mission</Button>}</div></div>; }

function MapPanel({ progress, tripActive }: { progress: number; tripActive: boolean }) {
  return <div className="relative aspect-[21/9] min-h-[230px] overflow-hidden rounded-xl border border-brand-line bg-card shadow-civic"><img src={cityGrid} alt="Simulated map of the emergency corridor" width={1200} height={608} loading="lazy" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-white/10" /><div className="absolute left-4 top-4 flex flex-col gap-2"><div className="rounded-lg border border-white/70 bg-card/90 px-3 py-1.5 text-[11px] font-medium shadow-civic backdrop-blur-sm"><span className="text-muted-foreground">Signals on route:</span><span className="ml-2 font-semibold">04 active</span></div><div className="w-fit rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-[11px] font-medium text-emerald-700 shadow-civic backdrop-blur-sm"><span className="mr-2 inline-block size-1.5 rounded-full bg-brand-success signal-pulse" />{tripActive ? "Green corridor active" : "Network normal"}</div></div><div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3"><div className="rounded-lg border border-white/70 bg-card/90 px-3 py-2 shadow-civic backdrop-blur-sm"><div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live vehicle</div><div className="mt-1 flex items-center gap-2 text-xs font-semibold"><Ambulance className="size-4 text-brand-success" /> AMB-102 <span className="text-muted-foreground">·</span> I-94 / Madison</div></div><div className="hidden rounded-lg border border-white/70 bg-card/90 px-3 py-2 text-right shadow-civic backdrop-blur-sm sm:block"><div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Route progress</div><div className="mt-1 text-xs font-semibold">{tripActive ? progress * 25 : 100}% · {tripActive ? "moving" : "complete"}</div></div></div></div>;
}

function AmbulanceView({ tripActive, progress, section, selectedHospital, setSelectedHospital, emergency, setEmergency, signals: signalData, signalStates, onStart, onEnd }: { tripActive: boolean; progress: number; section: Section; selectedHospital: string; setSelectedHospital: (value: string) => void; emergency: string; setEmergency: (value: string) => void; signals: typeof signals; signalStates: SignalState[]; onStart: () => void; onEnd: () => void }) {
  return <><MapPanel progress={progress} tripActive={tripActive} />{section === "route" && <RoutePlanner selectedHospital={selectedHospital} setSelectedHospital={setSelectedHospital} emergency={emergency} setEmergency={setEmergency} onStart={onStart} />}{section === "signals" && <SignalHealth signalStates={signalStates} />}{section === "active" && <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]"><SignalTimeline signalData={signalData} signalStates={signalStates} /><AlertFeed /></div>}<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-line bg-card px-5 py-4 shadow-civic"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-brand-success"><ShieldCheck className="size-4" /></div><div><div className="text-sm font-semibold">{tripActive ? "GreenPulse is coordinating this corridor" : "Mission ended safely"}</div><div className="text-xs text-muted-foreground">{tripActive ? "Signals will automatically return to normal after AMB-102 passes." : "All affected signals have returned to normal timing."}</div></div></div>{tripActive ? <Button variant="destructive" onClick={onEnd}>End emergency trip</Button> : <Button onClick={onStart}>Start another trip <ArrowRight /></Button>}</div></>;
}

function RoutePlanner({ selectedHospital, setSelectedHospital, emergency, setEmergency, onStart }: { selectedHospital: string; setSelectedHospital: (value: string) => void; emergency: string; setEmergency: (value: string) => void; onStart: () => void }) { return <div className="grid gap-6 lg:grid-cols-[1fr_1fr]"><div className="rounded-xl border border-brand-line bg-card p-5 shadow-civic"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-success">Automatic route calculation</p><h2 className="mt-1 text-base font-semibold">Set mission parameters</h2></div><Zap className="size-4 text-brand-success" /></div><label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="hospital">Destination hospital</label><select id="hospital" value={selectedHospital} onChange={(event) => setSelectedHospital(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"><option>City Hospital</option><option>St. Jude Regional Medical Center</option><option>Northside Trauma Center</option></select><label className="mb-2 mt-5 block text-xs font-medium text-muted-foreground" htmlFor="emergency">Emergency level</label><select id="emergency" value={emergency} onChange={(event) => setEmergency(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"><option>Normal</option><option>Urgent</option><option>Critical</option></select><Button className="mt-5 w-full" onClick={onStart}>Calculate and start trip <RouteIcon /></Button></div><div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-card text-brand-success"><Crosshair className="size-4" /></div><div><div className="text-sm font-semibold text-emerald-900">Optimal emergency route found</div><div className="text-xs text-emerald-800/70">Scored for distance, density, and signal count</div></div></div><div className="mt-6 space-y-0">{routeStops.map((stop, index) => <div key={stop} className="flex gap-3"><div className="flex w-4 flex-col items-center"><span className={cn("mt-1 size-2.5 rounded-full border-2 border-emerald-600 bg-card", index === 0 && "bg-brand-success")} />{index < routeStops.length - 1 && <span className="h-8 w-px bg-emerald-300" />}</div><div className="pb-4 text-xs font-medium text-emerald-950">{stop}{index === 0 && <span className="ml-2 font-normal text-emerald-800/60">· 0 m</span>}{index > 0 && index < 4 && <span className="ml-2 font-normal text-emerald-800/60">· Signal {String(index).padStart(2, "0")}</span>}</div></div>)}</div></div></div>; }

function SignalTimeline({ signalData, signalStates }: { signalData: typeof signals; signalStates: SignalState[] }) { return <div className="rounded-xl border border-brand-line bg-card p-5 shadow-civic"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Upcoming signal sequence</h2><p className="mt-1 text-xs text-muted-foreground">Green windows are scheduled to predicted arrival.</p></div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-brand-success"><Radio className="size-3.5" /> Live sync</div></div><div className="space-y-3">{signalData.map((signal, index) => <SignalRow key={signal.id} signal={signal} state={signalStates[index]} />)}</div></div>; }

function SignalRow({ signal, state }: { signal: (typeof signals)[number]; state: SignalState }) { const config = { cleared: { label: "Cleared", dot: "bg-brand-success", tone: "border-emerald-200 bg-emerald-50/50" }, preparing: { label: "Preparing corridor", dot: "bg-brand-warning", tone: "border-amber-200 bg-amber-50/40" }, scheduled: { label: "Scheduled", dot: "bg-muted-foreground/40", tone: "border-brand-line bg-card" }, normal: { label: "Normal cycle", dot: "bg-muted-foreground/30", tone: "border-brand-line bg-card" } }[state]; return <div className={cn("flex items-center gap-3 rounded-lg border p-3 transition-colors sm:gap-4", config.tone)}><div className="grid size-8 shrink-0 place-items-center rounded-md bg-card"><span className={cn("size-2.5 rounded-full", config.dot, state === "preparing" && "signal-pulse")} /></div><div className="min-w-0 flex-1"><div className="truncate text-xs font-medium">{signal.id} · {signal.name}</div><div className="mt-1 text-[10px] text-muted-foreground">{signal.distance} away <span className="mx-1">·</span> ETA {signal.eta}s</div></div><div className="hidden text-right sm:block"><div className={cn("text-[10px] font-bold uppercase", state === "cleared" ? "text-brand-success" : state === "preparing" ? "text-amber-600" : "text-muted-foreground")}>{config.label}</div><div className="mt-1 text-[10px] text-muted-foreground">{state === "normal" ? "Normal timing" : signal.action}</div></div></div>; }

function AlertFeed() { return <div className="rounded-xl border border-brand-line bg-card p-5 shadow-civic"><div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-semibold">Nearby vehicle alerts</h2><Badge variant="outline" className="text-[10px] text-brand-success">LIVE</Badge></div><div className="rounded-lg border-l-2 border-rose-400 bg-rose-50/70 p-4"><div className="flex items-start gap-3"><div className="grid size-8 shrink-0 place-items-center rounded-md bg-card text-rose-600"><Siren className="size-4" /></div><div><div className="text-xs font-semibold text-rose-900">Emergency vehicle approaching</div><p className="mt-1 text-xs leading-relaxed text-rose-900/70">Ambulance approaching from 350m south. Please give way and avoid blocking the intersection.</p></div></div></div><div className="mt-4 grid grid-cols-3 divide-x divide-brand-line rounded-lg border border-brand-line py-3"><MiniStat value="12" label="vehicles notified" /><MiniStat value="3" label="intersections" /><MiniStat value="ACTIVE" label="route status" /></div><div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Navigation className="size-3.5 text-brand-success" /> Approximate direction: northbound on Madison</div></div>; }

function MiniStat({ value, label }: { value: string; label: string }) { return <div className="px-2 text-center"><div className="font-mono text-sm font-medium">{value}</div><div className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div></div>; }

function SignalHealth({ signalStates }: { signalStates: SignalState[] }) { return <div className="rounded-xl border border-brand-line bg-card p-5 shadow-civic"><div className="mb-5"><h2 className="text-sm font-semibold">Signal health and corridor windows</h2><p className="mt-1 text-xs text-muted-foreground">Every node is responding in the current simulation.</p></div><div className="grid gap-3 sm:grid-cols-2">{signals.map((signal, index) => <SignalRow key={signal.id} signal={signal} state={signalStates[index]} />)}</div></div>; }

function CitizenView({ tripActive }: { tripActive: boolean }) { return <><div className="rounded-xl border border-rose-200 bg-rose-50 p-5 shadow-civic"><div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-card text-rose-600"><Siren className="size-5" /></div><div><div className="text-xs font-bold uppercase tracking-widest text-rose-600">{tripActive ? "Emergency vehicle alert" : "No active alert"}</div><h2 className="mt-2 text-xl font-semibold text-rose-950">{tripActive ? "Ambulance approaching from 350m south" : "Your route is clear"}</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-rose-950/70">{tripActive ? "Please give way and avoid blocking the upcoming intersection. The approximate direction is northbound on Madison." : "GreenPulse will notify you if an emergency corridor becomes active nearby."}</p></div></div></div><div className="grid gap-6 lg:grid-cols-[1fr_.8fr]"><MapPanel progress={tripActive ? 2 : 4} tripActive={tripActive} /><div className="rounded-xl border border-brand-line bg-card p-5 shadow-civic"><h2 className="text-sm font-semibold">Your simulated vehicle</h2><div className="mt-5 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-lg bg-brand-ui"><Navigation className="size-4 text-muted-foreground" /></div><div><div className="text-sm font-medium">Vehicle N-042</div><div className="text-xs text-muted-foreground">Ridge Line Rd · heading northeast</div></div></div><div className="mt-6 space-y-3 border-t border-brand-line pt-4"><div className="flex justify-between text-xs"><span className="text-muted-foreground">Alert radius</span><span className="font-medium">500 m</span></div><div className="flex justify-between text-xs"><span className="text-muted-foreground">Intersection ahead</span><span className="font-medium">Broadway / 8th</span></div><div className="flex justify-between text-xs"><span className="text-muted-foreground">Recommended action</span><span className="font-medium text-brand-success">Yield and clear</span></div></div></div></div></>; }

function AdminView({ tripActive, signalStates }: { tripActive: boolean; signalStates: SignalState[] }) { return <><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><AdminMetric icon={Ambulance} label="Active emergency units" value={tripActive ? "01" : "00"} tone="text-rose-600" /><AdminMetric icon={TrafficCone} label="Signals coordinated" value={tripActive ? "04" : "00"} tone="text-brand-success" /><AdminMetric icon={Users} label="Nearby vehicles alerted" value={tripActive ? "12" : "00"} tone="text-amber-600" /><AdminMetric icon={Gauge} label="Network density" value="34%" tone="text-sky-600" /></div><div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-xl border border-brand-line bg-card p-5 shadow-civic"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Active corridor monitor</h2><p className="mt-1 text-xs text-muted-foreground">What GreenPulse is automatically planning.</p></div><Badge className="bg-emerald-50 text-[10px] text-emerald-700 hover:bg-emerald-50">{tripActive ? "CORRIDOR ACTIVE" : "NETWORK NORMAL"}</Badge></div><MapPanel progress={2} tripActive={tripActive} /></div><div className="rounded-xl border border-brand-line bg-card p-5 shadow-civic"><div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-semibold">Signal schedule</h2><Clock3 className="size-4 text-muted-foreground" /></div><div className="space-y-3">{signals.map((signal, index) => <SignalRow key={signal.id} signal={signal} state={signalStates[index]} />)}</div></div></div><div className="rounded-xl border border-brand-line bg-card p-5 shadow-civic"><div className="mb-4 flex items-center gap-2"><Bell className="size-4 text-brand-success" /><h2 className="text-sm font-semibold">Controller activity</h2></div><div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3"><div className="rounded-lg bg-brand-ui p-3"><span className="font-mono text-[10px] text-brand-success">12:04:15</span><p className="mt-2">SIG-014 prepared green phase</p></div><div className="rounded-lg bg-brand-ui p-3"><span className="font-mono text-[10px] text-brand-success">12:04:18</span><p className="mt-2">12 nearby vehicles notified</p></div><div className="rounded-lg bg-brand-ui p-3"><span className="font-mono text-[10px] text-amber-600">12:04:22</span><p className="mt-2">Traffic density stable at 34%</p></div></div></div></>; }

function AdminMetric({ icon: Icon, label, value, tone }: { icon: typeof Ambulance; label: string; value: string; tone: string }) { return <div className="rounded-xl border border-brand-line bg-card p-4 shadow-civic"><div className="flex items-center justify-between"><Icon className={cn("size-4", tone)} /><span className={cn("font-mono text-2xl font-medium", tone)}>{value}</span></div><div className="mt-5 text-xs text-muted-foreground">{label}</div></div>; }

function AuthModal({ mode, onModeChange, onClose, onComplete }: { mode: "Register" | "Sign in"; onModeChange: (mode: "Register" | "Sign in") => void; onClose: () => void; onComplete: () => void }) { const [type, setType] = useState<Role>("Ambulance"); return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-xl border border-brand-line bg-card p-6 shadow-civic-lg"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-success">GreenPulse access</p><h2 className="mt-2 text-xl font-semibold">{mode} for the simulation</h2><p className="mt-1 text-xs text-muted-foreground">Use any details — this prototype does not create a real account.</p></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close access dialog"><X /></Button></div><div className="mt-6 flex rounded-lg bg-brand-ui p-1">{(["Register", "Sign in"] as const).map((item) => <Button key={item} variant="ghost" size="sm" onClick={() => onModeChange(item)} className={cn("flex-1", mode === item && "bg-card shadow-sm")}>{item}</Button>)}</div><div className="mt-5 space-y-4"><div className={cn(mode === "Sign in" && "hidden")}><label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="full-name">Full name</label><input id="full-name" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="Jordan Lee" maxLength={100} /></div><div><label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="email">Email</label><input id="email" type="email" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="operator@greenpulse.demo" maxLength={255} /></div><div className={cn(mode === "Sign in" && "hidden")}><label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="phone">Phone</label><input id="phone" type="tel" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="(555) 014-0102" maxLength={30} /></div><div><label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="password">Password</label><input id="password" type="password" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="••••••••" maxLength={128} /></div><div><label className="mb-2 block text-xs font-medium text-muted-foreground" htmlFor="user-type">User type</label><select id="user-type" value={type} onChange={(event) => setType(event.target.value as Role)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"><option>Ambulance</option><option>Citizen</option><option>Admin</option></select></div>{type === "Ambulance" && mode === "Register" && <div className="grid grid-cols-2 gap-3"><input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="Ambulance ID" maxLength={30} /><input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="Vehicle registration" maxLength={30} /></div>}{type === "Citizen" && mode === "Register" && <input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring" placeholder="Vehicle registration" maxLength={30} />}</div><Button className="mt-6 w-full" onClick={() => { onClose(); onComplete(); }}>Continue to demo <ArrowRight /></Button></div></div>; }