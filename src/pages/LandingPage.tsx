import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
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
  DollarSign,
  AlertTriangle,
  Play
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card3D } from '../components/3d/Card3D';
import { FullBackground3D } from '../components/3d/FullBackground3D';

export interface LandingPageProps {
  onNavigate: (path: string) => void;
  onSwitchRole: (role: 'ADMIN' | 'CLIENT') => void;
}

export function LandingPage({ onNavigate, onSwitchRole }: LandingPageProps) {
  // Live 1-Click Interactive Demo State
  const [isRemediated, setIsRemediated] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'client'>('admin');

  const handleLaunch = (role: 'ADMIN' | 'CLIENT', path: string) => {
    onSwitchRole(role);
    onNavigate(path);
  };

  return (
    <div className="relative min-h-screen bg-[#070A12] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* 1. Full-Screen Immersive 3D Animated Background */}
      <FullBackground3D />

      {/* 2. Top Floating Navigation */}
      <header className="relative z-50 border-b border-slate-800/80 bg-[#0B0F19]/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] ring-1 ring-white/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-lg">
                SLA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-purple-400">AI Platform</span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Core Features</a>
            <a href="#tiers" className="hover:text-white transition-colors">SLA Tiers</a>
            <a href="#metrics" className="hover:text-white transition-colors">ROI Impact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLaunch('CLIENT', '/client')}
              className="text-xs border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200"
            >
              Client Portal
            </Button>
            <Button
              variant="ai-glow"
              size="sm"
              onClick={() => handleLaunch('ADMIN', '/admin')}
              className="text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              Launch Operations Hub
            </Button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section (Clean, Cinematic, High-Impact) */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Animated Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-[0_0_30px_rgba(99,102,241,0.25)]">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Next-Generation Autonomous SLA Governance</span>
        </div>

        {/* Main Presentation Headline */}
        <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Predict SLA Breaches <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Before They Happen.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Stop firefighting support tickets. Our autonomous AI engine monitors incident complexity, team saturation, and real-time countdowns to automatically remediate risks with 1 click.
        </p>

        {/* Quick CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant="ai-glow"
            onClick={() => handleLaunch('ADMIN', '/admin')}
            className="shadow-[0_0_30px_rgba(99,102,241,0.4)] font-bold text-sm"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Open Admin Dashboard
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleLaunch('CLIENT', '/client/create')}
            className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold"
          >
            Create Test Incident
          </Button>
        </div>

        {/* 4. Interactive Hero Demo Card (Simple, Crystal Clear, WOW Effect) */}
        <div id="how-it-works" className="mt-14 max-w-3xl mx-auto">
          <Card3D glowColor={isRemediated ? 'emerald' : 'rose'} className="p-6 sm:p-8 text-left transition-all">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  isRemediated ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {isRemediated ? 'OK' : 'P1'}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>INC-8941: Production Database Connection Pool Saturation</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    SLA Tier: <strong className="text-purple-300">Platinum (99.9%)</strong> • Department: IT Infrastructure
                  </div>
                </div>
              </div>

              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  isRemediated 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                }`}>
                  {isRemediated ? '🟢 21% ON TRACK' : '🔴 84% CRITICAL RISK'}
                </span>
              </div>
            </div>

            {/* Live Metrics Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              
              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" /> Resolution Deadline
                </div>
                <div className={`text-base font-extrabold mt-1 font-mono ${isRemediated ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isRemediated ? '1h 45m remaining' : '18m remaining'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isRemediated ? '✅ Buffer extended by 1hr' : '⚠️ 78% of SLA elapsed'}
                </div>
              </div>

              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-400" /> Assigned SRE
                </div>
                <div className="text-sm font-bold text-white mt-1 truncate">
                  {isRemediated ? 'David Kim (Available)' : 'Marcus Vance (Overloaded)'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isRemediated ? 'Queue: 2/5 tickets (Optimal)' : 'Queue: 6/5 tickets (120% load)'}
                </div>
              </div>

              <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Penalty Exposure
                </div>
                <div className={`text-base font-extrabold mt-1 font-mono ${isRemediated ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isRemediated ? '$0 (Defended)' : '$500 / hr breach'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isRemediated ? '💰 $500 penalty avoided' : 'Contractual covenant active'}
                </div>
              </div>

            </div>

            {/* AI Diagnostics Banner */}
            <div className={`p-4 rounded-xl border mb-5 transition-all ${
              isRemediated 
                ? 'bg-emerald-950/20 border-emerald-500/30' 
                : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold mb-1">
                <Sparkles className={`h-4 w-4 ${isRemediated ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span className={isRemediated ? 'text-emerald-300' : 'text-rose-300'}>
                  {isRemediated ? 'AI Remediation Succeeded:' : 'Autonomous Risk Warning Detected:'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isRemediated 
                  ? 'Auto-reassigned to specialized SRE David Kim with secondary co-responder attached. Resolution window stabilized.'
                  : 'High probability of SLA violation: Assigned engineer is at 120% capacity with only 18 minutes before breach threshold.'}
              </p>
            </div>

            {/* Big Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {isRemediated ? 'Click to re-simulate high breach risk' : 'Test our automated 1-click mitigation in real time:'}
              </span>
              <Button
                variant={isRemediated ? 'outline' : 'ai-glow'}
                size="md"
                onClick={() => setIsRemediated(!isRemediated)}
                className={`font-bold text-xs ${isRemediated ? 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/30' : 'shadow-[0_0_25px_rgba(99,102,241,0.5)]'}`}
                leftIcon={<Zap className="h-4 w-4 text-amber-400" />}
              >
                {isRemediated ? '↺ Reset to High Risk' : '⚡ 1-Click AI Auto-Remediate'}
              </Button>
            </div>

          </Card3D>
        </div>

      </section>

      {/* 5. 4 Core Advantages Feature Grid */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="ai" className="mb-3">ENTERPRISE INTELLIGENCE</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Zero-Breach Engineering Teams
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Four powerful layers designed to keep your services compliant, reliable, and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Card3D glowColor="indigo" className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Multi-Factor Risk AI</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes deadline progress, engineer queue depth, and codebase complexity into a unified 0-100 risk index.
            </p>
          </Card3D>

          <Card3D glowColor="purple" className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">1-Click Auto-Remediation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly balances engineer workloads, pairs specialized co-responders, and extends buffer windows.
            </p>
          </Card3D>

          <Card3D glowColor="amber" className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Live Pre-Triage Prediction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ML heuristic engine detects urgency and suggests resolution hours as the client types their ticket.
            </p>
          </Card3D>

          <Card3D glowColor="emerald" className="p-6 space-y-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Penalty Defense Ledger</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live monetary tracking calculating exactly how much contract penalty exposure was protected by AI actions.
            </p>
          </Card3D>

        </div>
      </section>

      {/* 6. SLA Policy Tier Matrix */}
      <section id="tiers" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="purple" className="mb-3">POLICY STUDIO</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Contract Governance
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Define enforceable uptime covenants with customized response milestones and monetary penalty terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card3D glowColor="purple" className="p-6 space-y-5 border-purple-500/30">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  PLATINUM TIER
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">Mission Critical</h3>
              </div>
              <Crown className="h-6 w-6 text-purple-400" />
            </div>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Uptime</span>
                <span className="text-white font-bold">99.9%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Response SLA</span>
                <span className="text-purple-300 font-bold">&lt; 15 Mins</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Resolution SLA</span>
                <span className="text-purple-300 font-bold">&lt; 2 Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Breach Penalty</span>
                <span className="text-rose-400 font-bold">$500 / hr</span>
              </div>
            </div>
            <Button
              variant="ai-glow"
              size="sm"
              onClick={() => handleLaunch('ADMIN', '/admin/sla-policies')}
              className="w-full text-xs font-bold"
            >
              Configure Platinum
            </Button>
          </Card3D>

          <Card3D glowColor="indigo" className="p-6 space-y-5 border-indigo-500/30">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  GOLD TIER
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">Enterprise Standard</h3>
              </div>
              <ShieldCheck className="h-6 w-6 text-indigo-400" />
            </div>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Uptime</span>
                <span className="text-white font-bold">99.5%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Response SLA</span>
                <span className="text-indigo-300 font-bold">&lt; 30 Mins</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Resolution SLA</span>
                <span className="text-indigo-300 font-bold">&lt; 4 Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Breach Penalty</span>
                <span className="text-rose-400 font-bold">$250 / hr</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLaunch('ADMIN', '/admin/sla-policies')}
              className="w-full text-xs font-bold border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              Configure Gold
            </Button>
          </Card3D>

          <Card3D glowColor="emerald" className="p-6 space-y-5 border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
                  SILVER TIER
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">Growth Tier</h3>
              </div>
              <Activity className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Uptime</span>
                <span className="text-white font-bold">98.0%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Response SLA</span>
                <span className="text-slate-300 font-bold">&lt; 2 Hours</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Resolution SLA</span>
                <span className="text-slate-300 font-bold">&lt; 12 Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Breach Penalty</span>
                <span className="text-slate-400 font-bold">$100 / hr</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLaunch('ADMIN', '/admin/sla-policies')}
              className="w-full text-xs font-bold border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              Configure Silver
            </Button>
          </Card3D>

        </div>
      </section>

      {/* 7. Performance Telemetry Metrics */}
      <section id="metrics" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-[#0B0F19]/90 border border-slate-800 p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              99.4%
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Average SLA Compliance</div>
          </div>

          <div className="bg-[#0B0F19]/90 border border-slate-800 p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              $2.4M+
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Financial Penalties Defended</div>
          </div>

          <div className="bg-[#0B0F19]/90 border border-slate-800 p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              4.2x
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Faster Incident Resolution</div>
          </div>

          <div className="bg-[#0B0F19]/90 border border-slate-800 p-6 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              0
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">Unnotified SLA Breaches</div>
          </div>
        </div>
      </section>

      {/* 8. Call To Action & Footer */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 text-center">
        <div className="bg-gradient-to-tr from-indigo-950/60 via-[#0B0F19] to-purple-950/60 border border-indigo-500/30 rounded-3xl p-10 sm:p-14 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Demo the Platform?
            </h2>
            <p className="text-sm text-slate-300">
              Explore the operations command center or submit test client incidents.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button
                size="lg"
                variant="ai-glow"
                onClick={() => handleLaunch('ADMIN', '/admin')}
                className="shadow-[0_0_30px_rgba(99,102,241,0.5)] font-bold text-sm"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Launch Admin Center
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleLaunch('CLIENT', '/client')}
                className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold"
              >
                Launch Client Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 text-center">
        <p>© 2026 SLA AI Systems • Enterprise Predictive SLA Intelligence</p>
      </footer>

    </div>
  );
}