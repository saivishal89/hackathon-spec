import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Users, 
  Layers, 
  Cpu, 
  ChevronRight,
  Activity,
  Award,
  Lock,
  Compass,
  FileText,
  DollarSign
} from 'lucide-react';
import { LEDTicker } from '../components/ui/led-ticker';
import { ImageFold } from '../components/ui/image-fold';
import { ResponsiveHeroBanner } from '../components/ui/responsive-hero-banner';
import { SocialIcons } from '../components/ui/social-icons';
import { useAuth } from '../context/AuthContext';

export interface LandingPageProps {
  onNavigate: (path: string) => void;
  onSwitchRole?: (role: 'CLIENT' | 'ADMIN') => void;
}

export function LandingPage({ onNavigate, onSwitchRole }: LandingPageProps) {
  const { user } = useAuth();

  // Interactive Risk Escalation Simulation State (Section 3)
  const [simRisk, setSimRisk] = useState(42);
  const [isSimPlaying, setIsSimPlaying] = useState(true);

  useEffect(() => {
    if (!isSimPlaying) return;
    const interval = setInterval(() => {
      setSimRisk(prev => {
        if (prev >= 87) return 42;
        if (prev === 42) return 61;
        if (prev === 61) return 78;
        return 87;
      });
    }, 2400);
    return () => clearInterval(interval);
  }, [isSimPlaying]);

  // Section 6 Interactive 1-Click Remediation State
  const [remediationApplied, setRemediationApplied] = useState(false);

  return (
    <div className="min-h-screen bg-[#05070D] text-slate-100 selection:bg-amber-500 selection:text-black font-sans overflow-x-hidden relative">
      
      {/* Global Ambient Atmospheric Mesh - Continuous Nebula Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/10 via-orange-600/5 to-transparent blur-[160px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[800px] h-[600px] bg-indigo-600/10 blur-[180px] rounded-full" />
        <div className="absolute top-[75%] left-[-10%] w-[800px] h-[600px] bg-amber-600/8 blur-[180px] rounded-full" />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 01 — HERO BANNER WITH RESPONSIVE HERO COMPONENT */}
      {/* ========================================================================= */}
      <div className="relative z-10">
        <ResponsiveHeroBanner
          badgeLabel="SLA AI 2.0"
          badgeText="Predictive SLA Breach Intelligence & 1-Click Mitigation"
          title="Predict SLA Breaches"
          titleLine2="Before They Happen."
          description="AI-powered SLA operations platform that forecasts breach risk percentages, explains root causes in real-time, and automatically helps engineering teams prevent SLA violations."
          primaryButtonText="Explore Operations Hub"
          onPrimaryClick={() => onNavigate(user ? '/admin' : '/login')}
          secondaryButtonText="Client Portal Demo"
          onSecondaryClick={() => onNavigate(user ? '/client' : '/login')}
          ctaButtonText={user ? "My Workspace" : "Launch Demo"}
          onCtaClick={() => onNavigate(user ? (user.role === 'CLIENT' ? '/client' : '/admin') : '/login')}
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 02 — THE PROBLEM (FEATURING GLOWING AMBER PIXEL LED TICKER) */}
      {/* ========================================================================= */}
      <section id="problem" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>The Reactive SLA Flaw</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Most SLA systems tell you when you're late.{' '}
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-indigo-300 bg-clip-text text-transparent">
              We tell you before you will be late.
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Traditional ticketing platforms only trigger alarms when a breach timer hits zero. By then, penalties are locked in and customer trust is destroyed.
          </p>
        </div>

        {/* PIXEL LED DISPLAY TICKER (BRIGHT GLOWING AMBER & GOLD MATRIX) */}
        <div className="mb-14 rounded-3xl bg-black/80 p-5 sm:p-7 border border-white/10 shadow-[0_0_60px_rgba(245,158,11,0.15)] backdrop-blur-xl relative overflow-hidden">
          
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-widest px-2 pb-4 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold text-slate-200">LIVE TELEMETRY MATRIX</span>
            </div>
            <span className="text-amber-400 font-bold tracking-wider">PIXEL LED ENGINE</span>
          </div>

          <div className="h-24 sm:h-28 w-full flex items-center justify-center">
            <LEDTicker
              items={[
                "SLA BREACH RISK",
                "PREDICT BEFORE DEADLINE",
                "ACT BEFORE IMPACT",
                "AUTONOMOUS REBALANCE",
                "ZERO DOWNTIME",
                "PREVENT PENALTIES"
              ]}
              separator="●"
              speed={24}
              dotSize={8}
              dotQuantity={10}
              onColor="#F59E0B"
              offColor="rgba(245, 158, 11, 0.09)"
              glow={true}
              glowOptions={{ strength: 90, size: 10 }}
              flicker={true}
              flickerOptions={{ strength: 18, speed: 25 }}
            />
          </div>
        </div>

        {/* 3 Flaw Diagnosis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-7 rounded-3xl bg-black/60 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all space-y-4 shadow-xl group">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">REACTIVE</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard countdown timers simply observe time passing. They do not correlate engineer workload, queue saturation, or ticket technical complexity.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-black/60 border border-white/10 hover:border-orange-500/30 backdrop-blur-xl transition-all space-y-4 shadow-xl group">
            <div className="h-10 w-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">MANUAL</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Support leads spend hours in triage spreadsheets trying to guess which unassigned P1 tickets need rebalancing before shift handover.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-black/60 border border-white/10 hover:border-purple-500/30 backdrop-blur-xl transition-all space-y-4 shadow-xl group">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">TOO LATE</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When an SLA breach notification arrives, your contractual financial credits are already lost and the escalation chain is flooded with angry stakeholders.
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 03 — THE COST OF WAITING (INTERACTIVE RISK ESCALATION) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>The Financial Liability</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Watching SLA Timers Bleed Out Destroys Enterprise Contracts.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              When high-tier enterprise customers experience prolonged downtime without proactive intervention, contractual breach penalty credits accumulate by the minute.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">$142,500</div>
                <div className="text-xs text-slate-400 mt-1">Prevented SLA credit liabilities</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">1.4 Hours</div>
                <div className="text-xs text-slate-400 mt-1">Average MTTR velocity drop</div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-black/80 border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-200">INCIDENT #SLA-8941</span>
              </div>
              <button
                onClick={() => setIsSimPlaying(!isSimPlaying)}
                className="text-[11px] font-mono text-amber-400 hover:underline"
              >
                {isSimPlaying ? "[Pause Sim]" : "[Resume Sim]"}
              </button>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400 font-medium">Autonomous SLA Breach Probability</span>
                  <span className={`font-mono font-extrabold text-xl ${
                    simRisk >= 80 ? 'text-rose-400' : simRisk >= 60 ? 'text-amber-400' : 'text-indigo-400'
                  }`}>
                    {simRisk}% {simRisk >= 80 ? 'CRITICAL' : simRisk >= 60 ? 'HIGH RISK' : 'MODERATE'}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      simRisk >= 80 ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : simRisk >= 60 ? 'bg-amber-500 shadow-[0_0_15px_#f59e0b]' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${simRisk}%` }}
                  />
                </div>
              </div>

              {/* Real-time factor diagnostics */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Assigned Queue Saturation</span>
                  <span className="text-rose-400 font-mono font-bold">94% (High Queue)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Technical Complexity Index</span>
                  <span className="text-amber-400 font-mono font-bold">8.5 / 10 (Critical)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Contractual SLA Remaining</span>
                  <span className="text-slate-200 font-mono font-bold">01h 42m</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span>SLA AI detects risk early and recommends immediate rebalance.</span>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04 — THE SOLUTION PIPELINE */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Zap className="h-3.5 w-3.5" />
            <span>Autonomous Intelligence Loop</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Meet the SLA Risk Engine.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From initial ticket ingestion to continuous SLA recalculation and 1-click remediation.
          </p>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          <div className="p-6 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-4 relative shadow-xl hover:border-amber-500/30 transition">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                STEP 01
              </span>
              <h4 className="text-sm font-bold text-white">Request Ingestion</h4>
              <p className="text-xs text-slate-400">Client submits ticket with title & diagnostics.</p>
            </div>
            <FileText className="h-5 w-5 text-slate-500 self-end" />
          </div>

          <div className="p-6 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-4 relative shadow-xl hover:border-amber-500/30 transition">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                STEP 02
              </span>
              <h4 className="text-sm font-bold text-white">Policy Matching</h4>
              <p className="text-xs text-slate-400">Calculates business hours & target deadline.</p>
            </div>
            <Layers className="h-5 w-5 text-slate-500 self-end" />
          </div>

          <div className="p-6 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-4 relative shadow-xl hover:border-amber-500/30 transition">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                STEP 03
              </span>
              <h4 className="text-sm font-bold text-white">Risk Scoring</h4>
              <p className="text-xs text-slate-400">Evaluates workload, progress %, and complexity.</p>
            </div>
            <Cpu className="h-5 w-5 text-slate-500 self-end" />
          </div>

          <div className="p-6 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-4 relative shadow-xl hover:border-amber-500/30 transition">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                STEP 04
              </span>
              <h4 className="text-sm font-bold text-white">Breach Forecast</h4>
              <p className="text-xs text-slate-400">Predicts risk score & estimated delay hours.</p>
            </div>
            <Activity className="h-5 w-5 text-slate-500 self-end" />
          </div>

          <div className="p-6 rounded-3xl bg-black/80 border border-amber-500/40 backdrop-blur-xl flex flex-col justify-between space-y-4 relative shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                STEP 05
              </span>
              <h4 className="text-sm font-bold text-white">1-Click Action</h4>
              <p className="text-xs text-slate-300">Auto-rebalance queue to available SRE.</p>
            </div>
            <Zap className="h-5 w-5 text-amber-400 self-end" />
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 05 — THE TRANSFORMATION (THREE.JS IMAGE FOLD UNROLLING EFFECT) */}
      {/* ========================================================================= */}
      <section id="transformation" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10 text-center">
        
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive 3D Unroll Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            From Chaotic Support Operations to Pure SLA Intelligence.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Scroll into view to watch the 3D spiral unroll into the SLA AI Operations Command Center.
          </p>
        </div>

        {/* THREE.JS IMAGE FOLD CONTAINER */}
        <div className="relative w-full max-w-5xl mx-auto h-[380px] sm:h-[540px] md:h-[620px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.9)] bg-black">
          <ImageFold
            image="/assets/dashboard-preview.jpg"
            angle={175}
            rolls={12}
            rollRadius={4}
            duration={2.0}
            className="w-full h-full"
          />
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 06 — ANATOMY OF THE RISK ENGINE (INTERACTIVE EXPLAINABILITY) */}
      {/* ========================================================================= */}
      <section id="risk-engine" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Cpu className="h-3.5 w-3.5" />
            <span>Explainable AI Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Every Request Has a Risk Story.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            We never output an opaque percentage. We explain the exact weighting factors and generate 1-click mitigation playbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Request Profile Card */}
          <div className="lg:col-span-5 p-7 rounded-3xl bg-black/80 border border-white/10 space-y-5 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-slate-400">TICKET #SLA-10482</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                P1 Critical
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Kubernetes Ingress Gateway 502 Outage</h3>
              <p className="text-xs text-slate-400">Canary deployment traffic failed health checks.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5">
                <span className="text-slate-400 text-[11px]">SLA Remaining</span>
                <div className="text-sm font-bold text-white mt-0.5">02h 14m</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5">
                <span className="text-slate-400 text-[11px]">Complexity Index</span>
                <div className="text-sm font-bold text-amber-400 mt-0.5">8.8 / 10</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5">
                <span className="text-slate-400 text-[11px]">Queue Saturation</span>
                <div className="text-sm font-bold text-rose-400 mt-0.5">87% Active</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5">
                <span className="text-slate-400 text-[11px]">Assigned Engineer</span>
                <div className="text-sm font-bold text-slate-300 mt-0.5">Unassigned</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400">Current Risk Level</span>
              <span className={`text-lg font-mono font-extrabold ${remediationApplied ? 'text-emerald-400' : 'text-rose-400'}`}>
                {remediationApplied ? '49.0% MODERATE' : '87.0% CRITICAL'}
              </span>
            </div>
          </div>

          {/* Explainable Factor Weights & Remediation Action */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="p-7 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                Multi-Factor Risk Breakdown
              </h4>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Engineer Queue Saturation & Workload</span>
                    <span className="font-mono font-bold text-amber-400">40% Weight</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-amber-500 w-[40%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Contractual SLA Timeline Elapsed</span>
                    <span className="font-mono font-bold text-orange-400">25% Weight</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-orange-500 w-[25%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Historical Incident Resolution Patterns</span>
                    <span className="font-mono font-bold text-indigo-400">20% Weight</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-indigo-500 w-[20%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1.5">
                    <span>Assignment & Backup Specialist Resourcing</span>
                    <span className="font-mono font-bold text-cyan-400">15% Weight</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-cyan-500 w-[15%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* 1-Click Mitigation Card */}
            <div className="p-7 rounded-3xl bg-black/80 border border-amber-500/40 backdrop-blur-2xl space-y-4 shadow-[0_0_40px_rgba(245,158,11,0.12)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>AI Recommended Playbook</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  -38% Projected Drop
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Auto-reassign ticket to Elena Rostova (Staff SRE) with 15% current queue load and pair David Kim as secondary coordinator.
              </p>

              <button
                type="button"
                onClick={() => setRemediationApplied(!remediationApplied)}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  remediationApplied
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold shadow-lg shadow-amber-500/20'
                }`}
              >
                {remediationApplied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Mitigation Executed: Risk Dropped to 49%</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Execute 1-Click Smart Rebalance</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 07 — PREDICTION VS REACTION (SPLIT COMPARISON) */}
      {/* ========================================================================= */}
      <section id="comparison" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Layers className="h-3.5 w-3.5" />
            <span>Operational Transformation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Prediction vs Reaction
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            See the difference between losing a high-value customer and saving an enterprise SLA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Traditional Way */}
          <div className="p-7 sm:p-8 rounded-3xl bg-black/60 border border-rose-500/30 space-y-6 relative overflow-hidden backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
              <h3 className="text-lg font-bold text-rose-300">Traditional Reactive Process</h3>
              <span className="text-xs font-mono text-rose-400 font-bold uppercase">SLA Breached</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-6 w-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">1</div>
                <span>Ticket submitted & placed in generic unassigned backlog</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-6 w-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">2</div>
                <span>Engineer works sequentially without workload risk visibility</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-6 w-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">3</div>
                <span>SLA timer expires at 00:00:00 → Incident breaches</span>
              </div>
              <div className="flex items-center gap-3 text-rose-300 font-semibold">
                <div className="h-6 w-6 rounded-full bg-rose-500/30 text-rose-400 flex items-center justify-center font-bold">4</div>
                <span>Outcome: $3,750 Contract Penalty Credit & Client Escalation</span>
              </div>
            </div>
          </div>

          {/* With SLA AI Platform */}
          <div className="p-7 sm:p-8 rounded-3xl bg-black/80 border border-amber-500/40 space-y-6 relative overflow-hidden backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)]">
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
              <h3 className="text-lg font-bold text-amber-300">SLA AI Proactive Platform</h3>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">SLA Saved</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">1</div>
                <span>AI pre-triage extracts urgency & sets target resolution window</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">2</div>
                <span>Risk engine detects 87% breach probability 3 hours before deadline</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">3</div>
                <span>Lead executes 1-click smart rebalance to low-load SRE specialist</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-300 font-semibold">
                <div className="h-6 w-6 rounded-full bg-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">4</div>
                <span>Outcome: SLA Preserved (99.4% Compliance) + 5-Star CSAT</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 08 — PRODUCT TELEMETRY BENCHMARKS */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Activity className="h-3.5 w-3.5" />
            <span>Real-time Operational Telemetry</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            High-Velocity SLA Operations
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Continuous background workers calculate deadline decay every 15 seconds across all organization tenants.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-6 sm:p-7 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">1,284</div>
            <div className="text-xs text-slate-400 font-medium">Requests Ingested</div>
            <div className="text-[10px] text-amber-400 font-mono">100% Policy Matched</div>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">99.4%</div>
            <div className="text-xs text-slate-400 font-medium">Compliance Rate</div>
            <div className="text-[10px] text-emerald-400 font-mono">+4.2% YoY Gain</div>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">$142.5k</div>
            <div className="text-xs text-slate-400 font-medium">Penalties Prevented</div>
            <div className="text-[10px] text-amber-400 font-mono">Realized Ledger Savings</div>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">4.8 / 5.0</div>
            <div className="text-xs text-slate-400 font-medium">Customer CSAT</div>
            <div className="text-[10px] text-purple-400 font-mono">94% Quality Score</div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 09 — ROLE-BASED WORKSPACES */}
      {/* ========================================================================= */}
      <section id="workspaces" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Users className="h-3.5 w-3.5" />
            <span>Role-Based Access Control</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tailored Experiences for Every Stakeholder.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Clean client self-service portal, operational SRE triage hub, and executive SLA compliance governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Client Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-amber-500/30 transition shadow-xl">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Client Requester Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit requests with instant AI pre-triage, track live SLA countdown clocks, and submit post-resolution star ratings & feedback.
              </p>
            </div>
            <button
              onClick={() => onNavigate(user ? '/client' : '/login')}
              className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Launch Client Portal</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* SRE Agent Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-orange-500/30 transition shadow-xl">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">SRE & Queue Handler</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prioritize at-risk queues, execute 1-click mitigations, pair backup senior specialists, and log resolution event timelines.
              </p>
            </div>
            <button
              onClick={() => onNavigate(user ? '/admin' : '/login')}
              className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Launch Queue Workspace</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Executive Admin Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-purple-500/30 transition shadow-xl">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Operations Command Center</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configure custom SLA policies, govern financial penalty credit reconciliations, inspect audit logs, and monitor team workload.
              </p>
            </div>
            <button
              onClick={() => onNavigate(user ? '/admin' : '/login')}
              className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Launch Admin Command Center</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 10 — FINAL CALL TO ACTION & FOOTER (WITH SOCIAL ICONS) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ready for Production</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Stop chasing SLA breaches.{' '}
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-indigo-300 bg-clip-text text-transparent">
              Start predicting them.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Transform SLA compliance from a reactive panic into proactive intelligence. Launch our production-grade B2B SaaS architecture in seconds.
          </p>

          {/* SECOND LED TICKER */}
          <div className="h-20 w-full max-w-xl mx-auto rounded-2xl bg-black/80 border border-white/10 p-3 overflow-hidden shadow-2xl">
            <LEDTicker
              items={["PREVENT", "PREDICT", "PRIORITIZE", "PROTECT", "SLA AI ENTERPRISE"]}
              separator="●"
              speed={20}
              textSize={70}
              dotSize={8}
              dotQuantity={8}
              onColor="#F59E0B"
              glow={true}
              glowOptions={{ strength: 80, size: 8 }}
              flicker={false}
            />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => onNavigate(user ? '/admin' : '/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 rounded-2xl py-3.5 px-8 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Admin Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate(user ? '/client' : '/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <span>Launch Client Requester Portal</span>
            </button>
          </div>

        </div>

        {/* Global Footer with Animated Social Icons */}
        <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black text-xs font-black">
              ⚡
            </div>
            <span className="font-bold text-slate-300">SLA AI Platform</span>
            <span>• Predictive SLA Management & Breach Prevention MVP</span>
          </div>

          {/* SOCIAL ICONS COMPONENT */}
          <SocialIcons />

          <div className="text-right">
            <span>© 2026 SLA AI Systems Inc. All rights reserved.</span>
          </div>

        </footer>

      </section>

    </div>
  );
}

export default LandingPage;