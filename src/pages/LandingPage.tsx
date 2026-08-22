import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Users, 
  Lock, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Crown,
  Database,
  Globe2,
  Sliders,
  DollarSign,
  BarChart3,
  Check,
  Flame,
  FileCode,
  Laptop
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { RiskBadge } from '../components/requests/RiskBadge';
import { calculateDynamicRisk } from '../utils/riskCalculator';
import { HeroScene3D } from '../components/3d/HeroScene3D';
import { Card3D } from '../components/3d/Card3D';
import { InteractiveGlobe3D } from '../components/3d/InteractiveGlobe3D';

export interface LandingPageProps {
  onNavigate: (path: string) => void;
  onSwitchRole: (role: 'ADMIN' | 'CLIENT') => void;
}

export function LandingPage({ onNavigate, onSwitchRole }: LandingPageProps) {
  // Interactive Live Simulator State on Landing Page
  const [simElapsed, setSimElapsed] = useState(78); // %
  const [simComplexity, setSimComplexity] = useState(8); // 1-10
  const [simOverloaded, setSimOverloaded] = useState(true);
  const [remediated, setRemediated] = useState(false);

  // Tab preview state
  const [previewTab, setPreviewTab] = useState<'ops' | 'client'>('ops');

  // Compute simulator risk dynamically
  const fakeAssignee = {
    id: 'sim-1',
    name: remediated ? 'David Kim (Available SRE)' : simOverloaded ? 'Marcus Vance (Overloaded SRE)' : 'David Kim (Available SRE)',
    email: 'marcus@demo.io',
    role: 'AGENT' as const,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    title: 'Senior Reliability Engineer',
    activeTicketsCount: remediated ? 2 : simOverloaded ? 6 : 2,
    maxCapacity: 5,
  };

  const simResult = calculateDynamicRisk(
    remediated ? Math.max(20, simElapsed - 35) : simElapsed,
    remediated ? Math.max(2, simComplexity - 3) : simComplexity,
    fakeAssignee,
    remediated ? 1 : 0
  );

  const handleLaunch = (role: 'ADMIN' | 'CLIENT', path: string) => {
    onSwitchRole(role);
    onNavigate(path);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />

      {/* 1. Floating Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] ring-1 ring-white/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-lg">
                SLA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-purple-400">AI Platform</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                3D Engine v2.4
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#simulator" className="hover:text-white transition-colors">3D Risk Engine</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#telemetry" className="hover:text-white transition-colors">Global Telemetry</a>
            <a href="#tiers" className="hover:text-white transition-colors">SLA Tiers</a>
            <a href="#metrics" className="hover:text-white transition-colors">Performance</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLaunch('CLIENT', '/client')}
              className="text-xs border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
            >
              Client Demo
            </Button>
            <Button
              variant="ai-glow"
              size="sm"
              onClick={() => handleLaunch('ADMIN', '/admin')}
              className="text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              Launch Admin Center
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with 3D Holographic AI Core & Live Simulator */}
      <section className="relative z-10 pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Presentation Header Pill */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-[0_0_25px_rgba(99,102,241,0.25)]">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Proactive SLA Governance & Breach Intelligence</span>
            <span className="text-indigo-400">⚡</span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Predict SLA Breaches <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Before They Cost Millions.
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transform reactive incident firefighting into proactive AI governance with multi-factor risk diagnostics, real-time workload-aware triage, and automated 1-click remediation.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Button
              size="lg"
              variant="ai-glow"
              onClick={() => handleLaunch('ADMIN', '/admin')}
              className="shadow-[0_0_30px_rgba(99,102,241,0.4)] font-semibold"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Explore Operations Hub
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleLaunch('CLIENT', '/client/create')}
              className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200"
            >
              Simulate Client Ticket
            </Button>
          </div>
        </div>

        {/* Interactive 3D Holographic AI Simulator Grid */}
        <div id="simulator" className="mt-12 bg-[#0B0F19]/95 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
          
          {/* Quick Scenario Preset Buttons */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                <Sliders className="h-4 w-4 text-indigo-400" />
                <span>Interactive Live AI Triage Simulator</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pick a scenario below or adjust sliders to see the AI predict and prevent SLA breaches in real time.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quick Presets:</span>
              <button
                onClick={() => {
                  setSimElapsed(85);
                  setSimComplexity(9);
                  setSimOverloaded(true);
                  setRemediated(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  simElapsed === 85 && simComplexity === 9 && simOverloaded && !remediated
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🔴 Critical Outage
              </button>
              <button
                onClick={() => {
                  setSimElapsed(65);
                  setSimComplexity(6);
                  setSimOverloaded(true);
                  setRemediated(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  simElapsed === 65 && simComplexity === 6 && simOverloaded && !remediated
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🟡 Latency Spike
              </button>
              <button
                onClick={() => {
                  setSimElapsed(20);
                  setSimComplexity(3);
                  setSimOverloaded(false);
                  setRemediated(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  simElapsed === 20 && simComplexity === 3 && !simOverloaded && !remediated
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🟢 Fast Track
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: 3D Hologram Sphere Canvas */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[380px] bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-[#070A12] rounded-2xl border border-indigo-500/20 p-4 overflow-hidden">
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] font-semibold text-slate-300">
                <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                <span>3D Neural Risk Core</span>
              </div>
              
              <div className="absolute top-3.5 right-3.5">
                <RiskBadge level={simResult.riskLevel} score={simResult.riskScore} />
              </div>

              {/* Three.js 3D Viewport */}
              <HeroScene3D riskScore={simResult.riskScore} riskLevel={simResult.riskLevel} />

              <div className="absolute bottom-3 text-center text-[10px] text-slate-400 font-medium">
                💡 Drag mouse to rotate • Color & spin speed adapt dynamically to risk
              </div>
            </div>

            {/* Right Column: Multi-Factor Breakdown & 1-Click AI Fix */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Factor Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Factor 1: Time */}
                <div className="bg-[#111625] border border-slate-800 p-3 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" /> Time (40%)
                    </span>
                    <span className={`font-mono font-bold ${simElapsed > 75 ? 'text-rose-400' : 'text-indigo-300'}`}>
                      {simElapsed}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={simElapsed}
                    onChange={(e) => {
                      setSimElapsed(Number(e.target.value));
                      setRemediated(false);
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="text-[10px] text-slate-500">
                    {simElapsed > 80 ? '⚠️ Breach Imminent' : simElapsed > 50 ? '⏱️ In Progress' : '✅ Early Window'}
                  </div>
                </div>

                {/* Factor 2: Complexity */}
                <div className="bg-[#111625] border border-slate-800 p-3 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5 text-purple-400" /> Complexity (20%)
                    </span>
                    <span className="font-mono font-bold text-purple-300">
                      {simComplexity}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={simComplexity}
                    onChange={(e) => {
                      setSimComplexity(Number(e.target.value));
                      setRemediated(false);
                    }}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="text-[10px] text-slate-500">
                    {simComplexity >= 8 ? '🔥 Multi-system dependencies' : simComplexity >= 5 ? '⚡ Standard backend' : '🟢 Simple config'}
                  </div>
                </div>

                {/* Factor 3: SRE Load */}
                <div className="bg-[#111625] border border-slate-800 p-3 rounded-xl space-y-1.5 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-amber-400" /> Queue Load (25%)
                    </span>
                    <span className={`font-mono font-bold ${fakeAssignee.activeTicketsCount > 4 ? 'text-rose-400' : 'text-emerald-300'}`}>
                      {fakeAssignee.activeTicketsCount}/{fakeAssignee.maxCapacity}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSimOverloaded(!simOverloaded);
                      setRemediated(false);
                    }}
                    className="w-full py-1 text-[11px] font-bold rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    {simOverloaded ? 'Switch to Available SRE' : 'Simulate Overloaded SRE'}
                  </button>
                  <div className="text-[10px] text-slate-500 truncate">
                    Assigned: {fakeAssignee.name.split(' ')[0]} {fakeAssignee.name.split(' ')[1]}
                  </div>
                </div>

              </div>

              {/* Explainable AI Diagnosis Box */}
              <div className="bg-gradient-to-r from-indigo-950/30 to-purple-950/20 border border-indigo-500/25 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span>Explainable AI Root-Cause Diagnostic:</span>
                  </div>
                  <Badge variant={simResult.riskLevel === 'CRITICAL' ? 'critical' : simResult.riskLevel === 'HIGH' ? 'warning' : 'success'}>
                    {simResult.riskScore}% Probability
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                  {simResult.riskExplanation || (
                    simResult.riskLevel === 'CRITICAL'
                      ? `⚠️ Critical Imminent Breach: ${fakeAssignee.name} is overloaded (${fakeAssignee.activeTicketsCount}/${fakeAssignee.maxCapacity} tickets) while ${simElapsed}% of the SLA time has elapsed for high complexity system (Level ${simComplexity}/10).`
                      : simResult.riskLevel === 'HIGH'
                      ? `⚠️ High Breach Risk: Ticket complexity is elevated (${simComplexity}/10) with ${simElapsed}% SLA elapsed. Active engineer queue requires load balancing.`
                      : `✅ SLA Healthy: Assigned engineer has ample bandwidth with ${100 - simElapsed}% SLA resolution buffer remaining.`
                  )}
                </p>
              </div>

              {/* 1-Click AI Auto-Remediation Banner */}
              <div className="bg-[#111625] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {remediated ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> 1-Click AI Mitigation Active
                      </span>
                    ) : (
                      <span>Recommended Action: Reassign to Available Specialist</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {remediated 
                      ? 'Reassigned to David Kim (2/5 tickets) • Buffer extended • Penalty saved: $350'
                      : 'Projected risk reduction: -45% • SRE workload auto-balanced'}
                  </div>
                </div>

                <Button
                  variant={remediated ? 'outline' : 'ai-glow'}
                  size="sm"
                  onClick={() => setRemediated(!remediated)}
                  className={`text-xs font-bold ${remediated ? 'border-emerald-500/50 text-emerald-300' : 'shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}
                  leftIcon={<Zap className="h-3.5 w-3.5 text-amber-400" />}
                >
                  {remediated ? 'Reset to High Risk' : '⚡ 1-Click Auto-Remediate'}
                </Button>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 3. Feature Grid: Proactive vs. Reactive Paradigm */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="ai" className="mb-3">AUTONOMOUS RISK ENGINE</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered to Solve the 4 Critical Failure Modes of Modern SLAs
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Traditional ticketing platforms record failures after they happen. SLA AI Platform orchestrates mitigation before contractual breaches trigger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Card3D glowColor="indigo" className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Cpu className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Multi-Factor Risk Scoring</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes elapsed deadline ratio (40%), engineer queue saturation (25%), architectural complexity (20%), and responder redundancy (15%).
            </p>
          </Card3D>

          <Card3D glowColor="purple" className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Sub-Minute Live Timers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synchronized 15-second tick rates across First Response and Final Resolution countdowns with progressive status states.
            </p>
          </Card3D>

          <Card3D glowColor="amber" className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Real-Time Pre-Triage</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes incoming incident descriptions in real time as the client types, predicting duration and recommending priority tiers.
            </p>
          </Card3D>

          <Card3D glowColor="emerald" className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Penalty Defense Ledger</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated financial impact audits calculating exact monetary SLA penalty exposure saved across tier covenants.
            </p>
          </Card3D>

        </div>
      </section>

      {/* 4. Dual Operations Showcase with 3D Global Telemetry Sphere */}
      <section id="telemetry" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="bg-gradient-to-b from-[#0B0F19] to-[#0D1220] border border-slate-800 rounded-3xl overflow-hidden p-6 sm:p-10 shadow-2xl">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Enterprise Visibility</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Dual-Role Operational Workspaces</h2>
            </div>

            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setPreviewTab('ops')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  previewTab === 'ops'
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Operations Center (/admin)
              </button>
              <button
                onClick={() => setPreviewTab('client')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  previewTab === 'client'
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Client Portal (/client)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: 3D Global Telemetry or Milestone Stepper */}
            <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Globe2 className="h-4 w-4 text-indigo-400" />
                  <span>{previewTab === 'ops' ? 'Worldwide Incident Telemetry' : 'Client SLA Milestone Tracker'}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Live Pulse • 15s</span>
              </div>

              {previewTab === 'ops' ? (
                <InteractiveGlobe3D />
              ) : (
                <div className="space-y-4 p-4">
                  <div className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">Ticket #SLA-8941</span>
                      <Badge variant="success">ON_TRACK</Badge>
                    </div>
                    <div className="text-xs text-slate-400">
                      Production Database Failover Execution
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full w-[65%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Response SLA: MET (8m)</span>
                      <span>Resolution SLA: 1h 42m Remaining</span>
                    </div>
                  </div>

                  <div className="bg-[#0B0F19] p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-indigo-300">Active Collaborative Support Thread:</div>
                    <p className="text-xs text-slate-300 italic">
                      "Lead SRE David Kim has initiated automated buffer expansion. Primary cluster replica synchronized."
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Live Telemetry Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-xs text-slate-400">Compliance Rate</div>
                  <div className="text-2xl font-extrabold text-white mt-1">99.4%</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +1.8% vs last cycle
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                  <div className="text-xs text-slate-400">Penalties Defended</div>
                  <div className="text-2xl font-extrabold text-indigo-400 mt-1">$2.42M</div>
                  <div className="text-[10px] text-slate-400 mt-1">Across 14 Tier Agreements</div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {previewTab === 'ops' ? 'High-Priority Queue Highlights' : 'Requester Action Items'}
                </h4>
                
                {[
                  { title: 'API Gateway Rate-Limit Exhaustion', risk: 'HIGH', time: '14m to action' },
                  { title: 'Kubernetes Pod Memory Leak in Auth Service', risk: 'CRITICAL', time: '2m to action' },
                  { title: 'Stripe Webhook Delivery Timeout', risk: 'MEDIUM', time: '42m to action' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#0B0F19] p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.title}</div>
                      <div className="text-[10px] text-slate-500">{item.time}</div>
                    </div>
                    <Badge variant={item.risk === 'CRITICAL' ? 'critical' : item.risk === 'HIGH' ? 'warning' : 'info'}>
                      {item.risk}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  variant="ai-glow"
                  onClick={() => handleLaunch(previewTab === 'ops' ? 'ADMIN' : 'CLIENT', previewTab === 'ops' ? '/admin' : '/client')}
                  className="w-full text-xs font-bold"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {previewTab === 'ops' ? 'Enter Live Operations Command Center' : 'Open Client Support Portal'}
                </Button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. SLA Policy Tier Governance Matrix */}
      <section id="tiers" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" className="mb-3">MULTI-TIER POLICY STUDIO</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Contractual Precision
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Define enforceable covenants with customized uptime commitments, response milestones, and monetary escalation rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Platinum */}
          <Card3D glowColor="purple" className="p-6 space-y-6 relative border-purple-500/30">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  PLATINUM COVENANT
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">Mission Critical</h3>
              </div>
              <Crown className="h-6 w-6 text-purple-400" />
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Target Uptime</span>
                <span className="text-white font-bold">99.9%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Response SLA</span>
                <span className="text-purple-300 font-bold">&lt; 15 Minutes</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Resolution SLA</span>
                <span className="text-purple-300 font-bold">&lt; 2 Hours</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Breach Penalty</span>
                <span className="text-rose-400 font-bold">$500 / hr</span>
              </div>
            </div>

            <Button
              variant="ai-glow"
              size="sm"
              onClick={() => handleLaunch('ADMIN', '/admin/sla-policies')}
              className="w-full text-xs"
            >
              Configure Policy
            </Button>
          </Card3D>

          {/* Gold */}
          <Card3D glowColor="indigo" className="p-6 space-y-6 relative border-indigo-500/30">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GOLD COVENANT
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">Enterprise Standard</h3>
              </div>
              <ShieldCheck className="h-6 w-6 text-indigo-400" />
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Target Uptime</span>
                <span className="text-white font-bold">99.5%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Response SLA</span>
                <span className="text-indigo-300 font-bold">&lt; 30 Minutes</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Resolution SLA</span>
                <span className="text-indigo-300 font-bold">&lt; 4 Hours</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Breach Penalty</span>
                <span className="text-rose-400 font-bold">$250 / hr</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLaunch('ADMIN', '/admin/sla-policies')}
              className="w-full text-xs border-slate-700 hover:bg-slate-800 text-slate-200"
            >
              Configure Policy
            </Button>
          </Card3D>

          {/* Silver */}
          <Card3D glowColor="emerald" className="p-6 space-y-6 relative border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-700 text-slate-300 border border-slate-600">
                  SILVER COVENANT
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">Growth Tier</h3>
              </div>
              <Activity className="h-6 w-6 text-emerald-400" />
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Target Uptime</span>
                <span className="text-white font-bold">98.0%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Response SLA</span>
                <span className="text-slate-300 font-bold">&lt; 2 Hours</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Resolution SLA</span>
                <span className="text-slate-300 font-bold">&lt; 12 Hours</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Breach Penalty</span>
                <span className="text-slate-400 font-bold">$100 / hr</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLaunch('ADMIN', '/admin/sla-policies')}
              className="w-full text-xs border-slate-700 hover:bg-slate-800 text-slate-200"
            >
              Configure Policy
            </Button>
          </Card3D>

        </div>
      </section>

      {/* 6. Enterprise Social Proof & Metrics */}
      <section id="metrics" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-[#0B0F19] border border-slate-800/80 p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              99.4%
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Average SLA Compliance</div>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800/80 p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              $2.4M+
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Financial Penalties Avoided</div>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800/80 p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              4.2x
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Faster Incident Resolution</div>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800/80 p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              0
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Unnotified SLA Breaches</div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action (CTA) & Global Footer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 text-center">
        <div className="bg-gradient-to-tr from-indigo-950/60 via-[#0B0F19] to-purple-950/60 border border-indigo-500/30 rounded-3xl p-10 sm:p-16 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ready for Presentation & Production Demo</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Make Every SLA Your Competitive Advantage.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Give your SRE teams the predictive foresight to act early, your clients the transparency to trust you, and your business the confidence to scale.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                variant="ai-glow"
                onClick={() => handleLaunch('ADMIN', '/admin')}
                className="shadow-[0_0_30px_rgba(99,102,241,0.5)] font-bold text-sm"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Launch Operations Center
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleLaunch('CLIENT', '/client')}
                className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold"
              >
                Launch Client Portal
              </Button>
            </div>

            <div className="pt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
              <span>All Systems Operational • Real-Time Predictive AI Engine Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">SLA AI Platform</span>
            <span>•</span>
            <span>Predictive SLA Intelligence for High-Uptime Engineering Teams</span>
          </div>
          <p>© 2026 SLA AI Systems. Built with precision for Hackathon Demo & Enterprise Operations.</p>
        </div>
      </footer>

    </div>
  );
}