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
    <div className="min-h-screen bg-[#060911] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* SECTION 01 — HERO BANNER WITH RESPONSIVE HERO COMPONENT */}
      {/* ========================================================================= */}
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
        ctaButtonText={user ? "My Workspace" : "Sign In / Launch"}
        onCtaClick={() => onNavigate(user ? (user.role === 'CLIENT' ? '/client' : '/admin') : '/login')}
      />

      {/* ========================================================================= */}
      {/* SECTION 02 — THE PROBLEM (FEATURING PIXEL LED TICKER) */}
      {/* ========================================================================= */}
      <section id="problem" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative border-t border-slate-800/80">
        
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>The Reactive SLA Flaw</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Most SLA systems tell you when you're late.{' '}
            <span className="text-indigo-400">We tell you before you will be late.</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Traditional ticketing platforms only trigger alarms when a breach timer hits zero. By then, penalties are locked in and customer trust is destroyed.
          </p>
        </div>

        {/* PIXEL LED DISPLAY TICKER */}
        <div className="mb-14 rounded-2xl bg-black/90 p-4 sm:p-6 border border-slate-800 shadow-[0_0_50px_rgba(99,102,241,0.15)] overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 uppercase tracking-widest px-2 pb-3 border-b border-slate-800/60 mb-2">
            <span>● LIVE TELEMETRY MATRIX</span>
            <span className="text-indigo-400 font-bold">PIXEL LED ENGINE</span>
          </div>
          <div className="h-20 sm:h-24 w-full">
            <LEDTicker
              items={[
                "SLA BREACH RISK",
                "PREDICT BEFORE DEADLINE",
                "ACT BEFORE IMPACT",
                "AUTONOMOUS REBALANCE",
                "ZERO DOWNTIME"
              ]}
              separator="●"
              speed={28}
              textSize={100}
              dotSize={12}
              dotQuantity={9}
              onColor="#6366F1"
              glow={true}
              glowOptions={{ strength: 80, size: 9 }}
              flicker={true}
            />
          </div>
        </div>

        {/* 3 Flaw Diagnosis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-white">REACTIVE</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard countdown timers simply observe time passing. They do not correlate engineer workload, queue saturation, or ticket technical complexity.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-white">MANUAL</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Support leads spend hours in triage spreadsheets trying to guess which unassigned P1 tickets need rebalancing before shift handover.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-white">TOO LATE</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When an SLA breach notification arrives, your SLA financial credits are already lost and the escalation chain is flooded with angry stakeholders.
            </p>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 03 — THE COST OF WAITING (INTERACTIVE RISK ESCALATION) */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>The Financial Liability</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Watching SLA Timers Bleed Out Destroys Enterprise Contracts.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              When high-tier customers experience prolonged downtime without proactive intervention, contractual breach penalty credits accumulate by the minute.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-2xl font-extrabold text-rose-400">$142,500</div>
                <div className="text-xs text-slate-400 mt-1">Prevented SLA credit liabilities</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-2xl font-extrabold text-indigo-400">1.4 Hours</div>
                <div className="text-xs text-slate-400 mt-1">Average MTTR velocity drop</div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0F19] border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-slate-300">INCIDENT #SLA-8941</span>
              </div>
              <button
                onClick={() => setIsSimPlaying(!isSimPlaying)}
                className="text-[11px] font-mono text-indigo-400 hover:underline"
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
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      simRisk >= 80 ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : simRisk >= 60 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${simRisk}%` }}
                  />
                </div>
              </div>

              {/* Real-time factor diagnostics */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Assigned Queue Saturation</span>
                  <span className="text-rose-400 font-mono font-bold">94% (High Queue)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Technical Complexity Index</span>
                  <span className="text-amber-400 font-mono font-bold">8.5 / 10 (Critical)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Contractual SLA Remaining</span>
                  <span className="text-slate-200 font-mono font-bold">01h 42m</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <span>SLA AI detects risk early and recommends immediate rebalance.</span>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 04 — THE SOLUTION PIPELINE */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
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
          
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 relative">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                STEP 01
              </span>
              <h4 className="text-sm font-bold text-white">Request Ingestion</h4>
              <p className="text-xs text-slate-400">Client submits ticket with title & diagnostics.</p>
            </div>
            <FileText className="h-5 w-5 text-slate-500 self-end" />
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 relative">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                STEP 02
              </span>
              <h4 className="text-sm font-bold text-white">Policy Matching</h4>
              <p className="text-xs text-slate-400">Calculates business hours & target deadline.</p>
            </div>
            <Layers className="h-5 w-5 text-slate-500 self-end" />
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 relative">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                STEP 03
              </span>
              <h4 className="text-sm font-bold text-white">Risk Scoring</h4>
              <p className="text-xs text-slate-400">Evaluates workload, progress %, and complexity.</p>
            </div>
            <Cpu className="h-5 w-5 text-slate-500 self-end" />
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 relative">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                STEP 04
              </span>
              <h4 className="text-sm font-bold text-white">Breach Forecast</h4>
              <p className="text-xs text-slate-400">Predicts risk score & estimated delay hours.</p>
            </div>
            <Activity className="h-5 w-5 text-slate-500 self-end" />
          </div>

          <div className="p-5 rounded-3xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col justify-between space-y-4 relative shadow-lg shadow-indigo-500/10">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">
                STEP 05
              </span>
              <h4 className="text-sm font-bold text-white">1-Click Action</h4>
              <p className="text-xs text-slate-300">Auto-rebalance queue to available SRE.</p>
            </div>
            <Zap className="h-5 w-5 text-cyan-400 self-end" />
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 05 — THE TRANSFORMATION (THREE.JS IMAGE FOLD UNROLLING EFFECT) */}
      {/* ========================================================================= */}
      <section id="transformation" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80 text-center">
        
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
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
        <div className="relative w-full max-w-5xl mx-auto h-[380px] sm:h-[540px] md:h-[620px] rounded-3xl overflow-hidden border border-slate-800 shadow-[0_20px_80px_rgba(0,0,0,0.8)] bg-slate-950">
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
      <section id="risk-engine" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
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
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0B0F19] border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
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
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/60">
                <span className="text-slate-400 text-[11px]">SLA Remaining</span>
                <div className="text-sm font-bold text-white mt-0.5">02h 14m</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/60">
                <span className="text-slate-400 text-[11px]">Complexity Index</span>
                <div className="text-sm font-bold text-amber-400 mt-0.5">8.8 / 10</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/60">
                <span className="text-slate-400 text-[11px]">Queue Saturation</span>
                <div className="text-sm font-bold text-rose-400 mt-0.5">87% Active</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/60">
                <span className="text-slate-400 text-[11px]">Assigned Engineer</span>
                <div className="text-sm font-bold text-slate-300 mt-0.5">Unassigned</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Current Risk Level</span>
              <span className={`text-lg font-mono font-extrabold ${remediationApplied ? 'text-emerald-400' : 'text-rose-400'}`}>
                {remediationApplied ? '49.0% MODERATE' : '87.0% CRITICAL'}
              </span>
            </div>
          </div>

          {/* Explainable Factor Weights & Remediation Action */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400">
                Multi-Factor Risk Breakdown
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Engineer Queue Saturation & Workload</span>
                    <span className="font-mono font-bold text-indigo-400">40% Weight</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[40%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Contractual SLA Timeline Elapsed</span>
                    <span className="font-mono font-bold text-purple-400">25% Weight</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[25%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Historical Incident Resolution Patterns</span>
                    <span className="font-mono font-bold text-cyan-400">20% Weight</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[20%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Assignment & Backup Specialist Resourcing</span>
                    <span className="font-mono font-bold text-amber-400">15% Weight</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[15%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* 1-Click Mitigation Card */}
            <div className="p-6 rounded-3xl bg-indigo-950/30 border border-indigo-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>AI Recommended Playbook</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  -38% Projected Drop
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Auto-reassign ticket to Elena Rostova (Staff SRE) with 15% current queue load and pair David Kim as secondary coordinator.
              </p>

              <button
                type="button"
                onClick={() => setRemediationApplied(!remediationApplied)}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  remediationApplied
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
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
      <section id="comparison" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider">
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
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-6 relative overflow-hidden">
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
          <div className="p-6 sm:p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/40 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20">
              <h3 className="text-lg font-bold text-indigo-300">SLA AI Proactive Platform</h3>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">SLA Saved</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">1</div>
                <span>AI pre-triage extracts urgency & sets target resolution window</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">2</div>
                <span>Risk engine detects 87% breach probability 3 hours before deadline</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">3</div>
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
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
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
          
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">1,284</div>
            <div className="text-xs text-slate-400 font-medium">Requests Ingested</div>
            <div className="text-[10px] text-indigo-400 font-mono">100% Policy Matched</div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">99.4%</div>
            <div className="text-xs text-slate-400 font-medium">Compliance Rate</div>
            <div className="text-[10px] text-emerald-400 font-mono">+4.2% YoY Gain</div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400">$142.5k</div>
            <div className="text-xs text-slate-400 font-medium">Penalties Prevented</div>
            <div className="text-[10px] text-cyan-400 font-mono">Realized Ledger Savings</div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">4.8 / 5.0</div>
            <div className="text-xs text-slate-400 font-medium">Customer CSAT</div>
            <div className="text-[10px] text-purple-400 font-mono">94% Quality Score</div>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 09 — ROLE-BASED WORKSPACES */}
      {/* ========================================================================= */}
      <section id="workspaces" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
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
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 transition">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Client Requester Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit requests with instant AI pre-triage, track live SLA countdown clocks, and submit post-resolution star ratings & feedback.
              </p>
            </div>
            <button
              onClick={() => onNavigate(user ? '/client' : '/login')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
            >
              <span>Launch Client Portal</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* SRE Agent Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 transition">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">SRE & Queue Handler</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prioritize at-risk queues, execute 1-click mitigations, pair backup senior specialists, and log resolution event timelines.
              </p>
            </div>
            <button
              onClick={() => onNavigate(user ? '/admin' : '/login')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
            >
              <span>Launch Queue Workspace</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Executive Admin Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 transition">
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
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
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
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80 relative">
        
        {/* Background Mesh Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/15 blur-[160px] pointer-events-none rounded-full" />

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ready for Production</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Stop chasing SLA breaches.{' '}
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Start predicting them.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Transform SLA compliance from a reactive panic into proactive intelligence. Launch our production-grade B2B SaaS architecture in seconds.
          </p>

          {/* SECOND LED TICKER */}
          <div className="h-16 w-full max-w-xl mx-auto rounded-xl bg-black/80 border border-slate-800/80 p-2 overflow-hidden shadow-lg">
            <LEDTicker
              items={["PREVENT", "PREDICT", "PRIORITIZE", "PROTECT", "SLA AI ENTERPRISE"]}
              separator="●"
              speed={20}
              textSize={80}
              dotSize={10}
              dotQuantity={7}
              onColor="#38BDF8"
              glow={true}
              flicker={false}
            />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <button
              onClick={() => onNavigate(user ? '/admin' : '/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 hover:bg-indigo-500 text-sm font-bold text-white bg-indigo-600 shadow-xl shadow-indigo-600/30 rounded-2xl py-3.5 px-8 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Admin Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate(user ? '/client' : '/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all"
            >
              <span>Launch Client Requester Portal</span>
            </button>
          </div>

        </div>

        {/* Global Footer with Animated Social Icons */}
        <footer className="mt-24 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
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