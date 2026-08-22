import React, { useMemo, useState } from 'react';
import {
  Activity, ArrowRight, Check, CheckCircle2, ChevronRight, Clock3, Code2,
  Database, Gauge, Layers3, LockKeyhole, Menu, Network, Play, ShieldCheck,
  Sparkles, Target, Users, X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { calculateDynamicRisk } from '../utils/riskCalculator';

export interface LandingPageProps {
  onNavigate: (path: string) => void;
  onSwitchRole: (role: 'ADMIN' | 'CLIENT') => void;
}

const policies = [
  { name: 'Platinum', accent: 'indigo', uptime: '99.9%', response: '15m', resolution: '2h', penalty: '$500/hr', featured: true },
  { name: 'Gold', accent: 'purple', uptime: '99.5%', response: '30m', resolution: '4h', penalty: '$250/hr' },
  { name: 'Silver', accent: 'slate', uptime: '98.0%', response: '2h', resolution: '12h', penalty: '$100/hr' },
];

const features = [
  { icon: Target, color: 'indigo', title: 'Autonomous AI Risk Engine', description: 'Explainable scoring weighs SLA time, queue saturation, architecture complexity, and resource coverage before a breach is visible.' },
  { icon: Clock3, color: 'purple', title: 'Sub-Minute Live SLA Timers', description: 'Track response and resolution commitments with live countdowns, warning thresholds, and automatic breach-state transitions.' },
  { icon: Network, color: 'cyan', title: 'Live Pre-Triage Prediction', description: 'As requests arrive, classify urgency, estimate resolution effort, and route work to the right team before the queue compounds.' },
  { icon: ShieldCheck, color: 'emerald', title: 'Penalty Defense Ledger', description: 'Quantify prevented financial exposure in real time so every intervention is tied to a measurable business outcome.' },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function LandingPage({ onNavigate, onSwitchRole }: LandingPageProps) {
  const [elapsed, setElapsed] = useState(75);
  const [complexity, setComplexity] = useState(8);
  const [overloaded, setOverloaded] = useState(true);
  const [preview, setPreview] = useState<'ops' | 'client'>('ops');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [remediated, setRemediated] = useState(false);

  const result = useMemo(() => calculateDynamicRisk(
    elapsed,
    complexity,
    {
      id: 'demo-sre',
      name: overloaded ? 'Marcus Vance' : 'David Kim',
      email: 'demo@sla.ai',
      role: 'AGENT',
      avatar: '',
      title: 'Senior Reliability Engineer',
      activeTicketsCount: overloaded ? 6 : 2,
      maxCapacity: 5,
    },
    remediated ? 1 : 0,
  ), [elapsed, complexity, overloaded, remediated]);

  const launch = (role: 'ADMIN' | 'CLIENT', path: string) => {
    onSwitchRole(role);
    onNavigate(path);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#090D16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(99,102,241,.24),transparent_38%),radial-gradient(circle_at_90%_45%,rgba(168,85,247,.1),transparent_25%)]" />
      <div className="pointer-events-none fixed left-1/2 top-28 z-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full border border-indigo-400/10 [transform-style:preserve-3d] animate-[spin_24s_linear_infinite]" />

      <header className="sticky top-0 z-50 border-b border-white/[.07] bg-[#090D16]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <button onClick={() => scrollTo('top')} className="flex items-center gap-3" aria-label="SLA AI Platform home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_0_24px_rgba(99,102,241,.45)]"><Sparkles size={18} /></span>
            <span className="text-sm font-bold tracking-tight text-white sm:text-base">SLA <span className="text-indigo-300">AI Platform</span></span>
          </button>
          <nav className="hidden items-center gap-7 text-xs font-medium text-slate-400 lg:flex">
            {['features', 'simulator', 'policies', 'pricing', 'docs'].map((item) => (
              <button key={item} onClick={() => scrollTo(item)} className="capitalize transition hover:text-white">{item === 'simulator' ? 'Live Simulator' : item === 'docs' ? 'Docs' : item}</button>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" size="sm" onClick={() => launch('CLIENT', '/client')}>Client Portal</Button>
            <Button variant="ai-glow" size="sm" onClick={() => launch('ADMIN', '/admin')} rightIcon={<ArrowRight size={14} />}>Launch Admin Center</Button>
          </div>
          <button className="rounded-lg p-2 text-slate-300 sm:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {mobileOpen && <div className="border-t border-white/[.07] bg-[#0B0F19] px-5 py-4 sm:hidden">
          <div className="grid gap-3 text-left text-sm text-slate-300">{['features', 'simulator', 'policies', 'pricing', 'docs'].map(item => <button key={item} onClick={() => { scrollTo(item); setMobileOpen(false); }} className="capitalize">{item}</button>)}</div>
        </div>}
      </header>

      <main id="top" className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-32 lg:pt-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.16em] text-indigo-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> AI governance, now in production <ChevronRight size={13} /></div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-.045em] text-white sm:text-6xl lg:text-[76px]">Predict SLA breaches <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent">before they cost millions.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">Transform reactive ticket firefighting into proactive AI governance with multi-factor risk diagnostics, workload-aware triage, and automated one-click remediation.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button size="lg" variant="ai-glow" onClick={() => launch('ADMIN', '/admin')} rightIcon={<ArrowRight size={17} />}>Enter Operations Center</Button><Button size="lg" variant="glass" onClick={() => scrollTo('simulator')} leftIcon={<Play size={15} />}>Run live simulator</Button></div>
            <div className="mt-10 flex items-center gap-6 text-xs text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400" /> SOC 2-ready controls</span><span className="flex items-center gap-2"><LockKeyhole size={14} className="text-indigo-400" /> Enterprise-grade</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-[510px] [perspective:1200px]">
            <div className="absolute -inset-8 rounded-[40px] bg-indigo-500/15 blur-3xl" />
            <div className="relative rounded-[28px] border border-white/10 bg-[#0d1423]/90 p-5 shadow-2xl shadow-indigo-950/60 [transform:rotateY(-7deg)_rotateX(4deg)] backdrop-blur-xl sm:p-7">
              <div className="mb-7 flex items-center justify-between"><div><div className="text-[10px] uppercase tracking-[.18em] text-slate-500">Real-time command signal</div><div className="mt-1 text-sm font-semibold text-white">Incident risk telemetry</div></div><div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300"><Activity size={12} /> LIVE</div></div>
              <div className="grid grid-cols-[1fr_135px] items-center gap-4"><div className="space-y-4"><div className="h-2 rounded-full bg-slate-800"><div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-400 shadow-[0_0_18px_rgba(129,110,255,.8)]" /></div><div className="h-2 w-[62%] rounded-full bg-gradient-to-r from-purple-600 to-indigo-400 opacity-80" /><div className="h-2 w-[88%] rounded-full bg-gradient-to-r from-rose-500 to-amber-400 opacity-90" /></div><div className="relative flex aspect-square items-center justify-center rounded-full border-[10px] border-rose-500/20"><div className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-l-rose-400 border-t-fuchsia-400 rotate-[-30deg]" /><div className="text-center"><div className="text-4xl font-semibold text-white">82</div><div className="text-[10px] uppercase tracking-widest text-rose-300">critical</div></div></div></div>
              <div className="mt-8 grid grid-cols-3 gap-2"><div className="rounded-xl border border-white/[.07] bg-white/[.03] p-3"><div className="text-lg font-semibold text-white">4.2x</div><div className="mt-1 text-[10px] text-slate-500">faster resolution</div></div><div className="rounded-xl border border-white/[.07] bg-white/[.03] p-3"><div className="text-lg font-semibold text-emerald-300">99.4%</div><div className="mt-1 text-[10px] text-slate-500">SLA compliance</div></div><div className="rounded-xl border border-white/[.07] bg-white/[.03] p-3"><div className="text-lg font-semibold text-indigo-300">$2.4M</div><div className="mt-1 text-[10px] text-slate-500">penalties avoided</div></div></div>
              <div className="absolute -right-5 -top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-500/20 text-indigo-200 shadow-lg shadow-indigo-500/20 animate-[pulseGlow_3s_ease-in-out_infinite]"><Gauge size={24} /></div>
            </div>
          </div>
        </section>

        <section id="simulator" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8">
          <div className="mb-10 max-w-2xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-indigo-300">Live simulator</p><h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">See the breach before it happens.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Move the telemetry controls and watch our explainable risk engine react in real time.</p></div>
          <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <Card variant="glass" className="p-6 sm:p-8"><div className="mb-8 flex items-center justify-between"><div><div className="text-sm font-semibold text-white">Incident parameters</div><div className="mt-1 text-xs text-slate-500">Configure live telemetry</div></div><SlidersIcon /></div>
              <Range label="SLA elapsed time" value={elapsed} min={0} max={100} suffix="%" color="indigo" onChange={setElapsed} /><Range label="Technical complexity" value={complexity} min={1} max={10} suffix="/10" color="purple" onChange={setComplexity} />
              <div className="mt-7"><div className="mb-3 flex justify-between text-xs"><span className="font-medium text-slate-300">Assigned engineer capacity</span><span className="text-slate-500">{overloaded ? '120% utilized' : '40% utilized'}</span></div><div className="grid grid-cols-2 gap-2">{[['Balanced', false], ['Overloaded', true]].map(([label, state]) => <button key={String(label)} onClick={() => { setOverloaded(Boolean(state)); setRemediated(false); }} className={`rounded-xl border px-3 py-3 text-left text-xs transition ${overloaded === state ? 'border-rose-400/40 bg-rose-400/10 text-rose-200' : 'border-white/[.08] bg-white/[.03] text-slate-400 hover:border-white/20'}`}><span className={`mb-2 block h-2 w-2 rounded-full ${state ? 'bg-rose-400' : 'bg-emerald-400'}`} />{label}<span className="mt-1 block text-[10px] opacity-60">{state ? '6 active incidents' : '2 active incidents'}</span></button>)}</div></div>
            </Card>
            <Card variant="glow" className="relative p-6 sm:p-8"><div className="flex items-center justify-between border-b border-white/[.08] pb-5"><div className="flex items-center gap-3"><span className="rounded-lg bg-indigo-500/15 p-2 text-indigo-300"><Sparkles size={16} /></span><div><div className="text-sm font-semibold text-white">AI risk diagnosis</div><div className="text-[11px] text-slate-500">Model updated just now</div></div></div><span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${result.riskLevel === 'CRITICAL' ? 'border-rose-400/30 bg-rose-400/10 text-rose-300' : result.riskLevel === 'HIGH' ? 'border-amber-400/30 bg-amber-400/10 text-amber-300' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'}`}>{result.riskLevel} risk</span></div>
              <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center"><div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full border-[12px] border-slate-800"><div className={`absolute inset-[-12px] rounded-full border-[12px] border-transparent ${result.riskLevel === 'CRITICAL' ? 'border-l-rose-400 border-t-fuchsia-400' : 'border-l-emerald-400 border-t-indigo-400'} rotate-[-35deg] transition-all`} /><div className="text-center"><div className="text-4xl font-semibold text-white">{result.riskScore}</div><div className="text-[10px] uppercase tracking-widest text-slate-500">risk score</div></div></div><div><div className="text-sm leading-6 text-slate-300">{result.riskExplanation}</div><div className="mt-4 flex flex-wrap gap-2">{result.riskFactors.slice(0, 3).map(factor => <span key={factor.id} className="rounded-md bg-white/[.05] px-2 py-1 text-[10px] text-slate-400">{factor.label}: <b className="text-slate-200">{factor.impact}</b></span>)}</div></div></div>
              <div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/[.08] pt-5 sm:flex-row sm:items-center"><div><div className="text-[10px] uppercase tracking-widest text-slate-500">Recommended action</div><div className="mt-1 text-xs font-medium text-white">{overloaded ? 'Reassign to available SRE' : 'Trigger fast rollback playbook'}</div></div><Button size="sm" variant={remediated ? 'secondary' : 'ai-glow'} onClick={() => setRemediated(true)} leftIcon={remediated ? <Check size={14} /> : <Sparkles size={14} />}>{remediated ? 'Risk reduced' : 'One-click remediate'}</Button></div>
            </Card>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 border-y border-white/[.05] bg-[#0B0F19]/60 px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-purple-300">The proactive advantage</p><h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Built for high-velocity operations.</h2></div><p className="max-w-sm text-sm leading-6 text-slate-500">The intelligence layer between your customer promise and the teams delivering it.</p></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, color, title, description }) => <Card key={title} variant="glass" hoverEffect className="p-6"><div className={`mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-300`}><Icon size={19} /></div><h3 className="text-sm font-semibold text-white">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{description}</p></Card>)}</div></div></section>

        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8"><div className="mb-10 text-center"><p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-indigo-300">SLA policy studio</p><h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Commitments your customers can trust.</h2></div><div id="policies" className="grid gap-4 scroll-mt-24 md:grid-cols-3">{policies.map(policy => <Card key={policy.name} variant={policy.featured ? 'glow' : 'glass'} className={`relative p-6 ${policy.featured ? 'ring-1 ring-indigo-400/30' : ''}`}>{policy.featured && <div className="absolute right-5 top-5 rounded-full bg-indigo-500/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-300">Most adopted</div>}<div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{policy.name} tier</div><div className="mt-7 text-3xl font-semibold text-white">{policy.uptime} <span className="text-sm font-normal text-slate-500">uptime</span></div><div className="my-6 space-y-3 border-y border-white/[.07] py-5 text-xs">{[['Response SLA', policy.response], ['Resolution SLA', policy.resolution], ['Breach defense', policy.penalty]].map(([label, value]) => <div key={String(label)} className="flex justify-between text-slate-500"><span>{label}</span><span className="font-medium text-slate-200">{value}</span></div>)}</div><div className="flex items-center gap-2 text-xs text-emerald-300"><Check size={14} /> Predictive breach protection included</div></Card>)}</div></section>

        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8"><Card variant="glass" className="overflow-hidden p-0"><div className="flex flex-col justify-between gap-5 border-b border-white/[.07] p-6 sm:flex-row sm:items-center sm:p-8"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">Product preview</p><h2 className="mt-2 text-2xl font-semibold text-white">One source of truth for every stakeholder.</h2></div><div className="flex rounded-lg border border-white/[.08] bg-black/20 p-1"><button onClick={() => setPreview('ops')} className={`rounded-md px-3 py-2 text-xs ${preview === 'ops' ? 'bg-indigo-500/20 text-indigo-200' : 'text-slate-500'}`}>Operations center</button><button onClick={() => setPreview('client')} className={`rounded-md px-3 py-2 text-xs ${preview === 'client' ? 'bg-indigo-500/20 text-indigo-200' : 'text-slate-500'}`}>Client portal</button></div></div><div className="grid gap-5 bg-[#0a101d] p-6 sm:grid-cols-[1.1fr_.9fr] sm:p-8"><div className="rounded-xl border border-white/[.07] bg-[#101827] p-5"><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-semibold text-white"><span className="h-2 w-2 rounded-full bg-rose-400" /> {preview === 'ops' ? 'At-risk prioritization queue' : 'Request progress'}</div><span className="text-[10px] text-slate-500">Updated 12s ago</span></div>{(preview === 'ops' ? ['API latency spike in us-east-1', 'Payment webhook delivery delay', 'SSO provisioning failures'] : ['Incident response · INC-2841', 'Database migration review', 'Access policy update']).map((item, i) => <div key={item} className="mb-2 flex items-center justify-between rounded-lg border border-white/[.05] bg-white/[.025] p-3"><div><div className="text-xs text-slate-200">{item}</div><div className="mt-1 text-[10px] text-slate-500">{preview === 'ops' ? `Risk ${92 - i * 14}% · ${i + 1}m to action` : ['In progress', 'Under review', 'Resolved'][i]}</div></div><ChevronRight size={14} className="text-slate-600" /></div>)}</div><div className="flex flex-col justify-center gap-4"><MiniStat icon={Activity} value={preview === 'ops' ? '97.4%' : '3h 18m'} label={preview === 'ops' ? 'compliance this month' : 'resolution ETA'} color="indigo" /><MiniStat icon={Database} value={preview === 'ops' ? '$184k' : '100%'} label={preview === 'ops' ? 'risk exposure avoided' : 'audit transparency'} color="emerald" /></div></div></Card></section>

        <section id="docs" className="border-t border-white/[.06] px-5 py-20 text-center lg:px-8"><div className="mx-auto max-w-3xl"><div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/25 bg-indigo-500/10 text-indigo-300"><Sparkles size={25} /></div><h2 className="text-4xl font-semibold tracking-tight text-white">Make every SLA a competitive advantage.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">Give your teams the context to act early, your customers the transparency to trust you, and your business the confidence to scale.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button size="lg" variant="ai-glow" onClick={() => launch('ADMIN', '/admin')} rightIcon={<ArrowRight size={16} />}>Launch live platform</Button><Button size="lg" variant="glass" onClick={() => launch('CLIENT', '/client')}>Create a request</Button></div><div className="mt-9 inline-flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" /> All systems operational · 100%</div></div></section>
      </main>
      <footer className="border-t border-white/[.06] px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-slate-600 sm:flex-row"><span className="font-semibold text-slate-300">SLA AI Platform</span><span>Predictive governance for high-uptime teams · © 2026</span><span className="flex items-center gap-2"><Code2 size={13} /> Built for operational precision</span></div></footer>
    </div>
  );
}

function Range({ label, value, min, max, suffix, color, onChange }: { label: string; value: number; min: number; max: number; suffix: string; color: string; onChange: (value: number) => void }) {
  return <div className="mb-7"><div className="mb-3 flex justify-between text-xs"><span className="font-medium text-slate-300">{label}</span><span className={`font-mono text-${color}-300`}>{value}{suffix}</span></div><input aria-label={label} type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className={`w-full accent-${color}-500`} /><div className="mt-2 flex justify-between text-[10px] text-slate-600"><span>{min}{suffix}</span><span>{max}{suffix}</span></div></div>;
}

function SlidersIcon() { return <div className="rounded-lg bg-purple-500/10 p-2 text-purple-300"><Layers3 size={16} /></div>; }
function MiniStat({ icon: Icon, value, label, color }: { icon: React.ElementType; value: string; label: string; color: string }) { return <div className="flex items-center gap-4 rounded-xl border border-white/[.06] bg-white/[.025] p-4"><span className={`rounded-lg bg-${color}-500/10 p-2.5 text-${color}-300`}><Icon size={17} /></span><div><div className="text-lg font-semibold text-white">{value}</div><div className="text-[10px] text-slate-500">{label}</div></div></div>; }