import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Clock, 
  Users, 
  Lock, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Crown
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { RiskBadge } from '../components/requests/RiskBadge';
import { calculateDynamicRisk } from '../utils/riskCalculator';

export interface LandingPageProps {
  onNavigate: (path: string) => void;
  onSwitchRole: (role: 'ADMIN' | 'CLIENT') => void;
}

export function LandingPage({ onNavigate, onSwitchRole }: LandingPageProps) {
  // Interactive Live Simulator State on Landing Page
  const [simElapsed, setSimElapsed] = useState(75); // %
  const [simComplexity, setSimComplexity] = useState(8); // 1-10
  const [simOverloaded, setSimOverloaded] = useState(true);

  // Compute simulator risk dynamically
  const fakeAssignee = {
    id: 'sim-1',
    name: simOverloaded ? 'Marcus (Overloaded SRE)' : 'David (Available SRE)',
    email: 'marcus@demo.io',
    role: 'AGENT' as const,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    title: 'Senior Engineer',
    activeTicketsCount: simOverloaded ? 6 : 2,
    maxCapacity: 5,
  };

  const simResult = calculateDynamicRisk(simElapsed, simComplexity, fakeAssignee, 0);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Top Floating Navbar for Landing Page */}
      <header className="relative z-50 border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight text-white text-lg">
              SLA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI Platform</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onSwitchRole('CLIENT');
                onNavigate('/client');
              }}
              className="text-xs"
            >
              Client Demo
            </Button>
            <Button
              variant="ai-glow"
              size="sm"
              onClick={() => {
                onSwitchRole('ADMIN');
                onNavigate('/admin');
              }}
              className="text-xs"
            >
              Launch Admin Center
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span>Next-Gen Enterprise SLA Risk Prediction Engine</span>
          <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Predict, Prevent, and Master Enterprise SLAs with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Autonomous AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Stop reacting to breached SLA tickets. Our explainable ML model identifies impending breaches before they happen, diagnoses root bottlenecks, and automates one-click team remediation.
        </p>

        {/* CTA Launch Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            variant="ai-glow"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={() => {
              onSwitchRole('ADMIN');
              onNavigate('/admin');
            }}
            className="w-full sm:w-auto text-sm px-8"
          >
            Enter Operations Command Center
          </Button>

          <Button
            size="lg"
            variant="glass"
            onClick={() => {
              onSwitchRole('CLIENT');
              onNavigate('/client');
            }}
            className="w-full sm:w-auto text-sm px-8"
          >
            Requester Portal Experience
          </Button>
        </div>

        {/* Live ROI Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-3xl font-extrabold text-white font-mono">99.8%</span>
            <p className="text-xs text-slate-400 mt-1">SLA Compliance Rate</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-3xl font-extrabold text-indigo-400 font-mono">68%</span>
            <p className="text-xs text-slate-400 mt-1">Breach Reduction</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-3xl font-extrabold text-purple-400 font-mono">4.2x</span>
            <p className="text-xs text-slate-400 mt-1">Faster Resolution</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">$180k+</span>
            <p className="text-xs text-slate-400 mt-1">Penalty Cost Avoided</p>
          </div>
        </div>

      </section>

      {/* Interactive Live SLA Risk Simulator Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <Badge variant="ai">Interactive Demonstration</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Test the AI Breach Risk Engine Live
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Adjust the telemetry sliders below to watch the explainable ML model compute breach probability and risk drivers in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Controls: Sliders (5 cols) */}
          <Card variant="glass" className="lg:col-span-5 p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Simulated Incident Parameters
              </h4>
              <p className="text-xs text-slate-400">Configure ticket telemetry</p>
            </div>

            {/* Elapsed SLA Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">SLA Window Elapsed:</span>
                <span className="font-mono font-bold text-indigo-400">{simElapsed}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={simElapsed}
                onChange={e => setSimElapsed(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10% (Just Opened)</span>
                <span>100% (Deadline)</span>
              </div>
            </div>

            {/* Complexity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">System Complexity:</span>
                <span className="font-mono font-bold text-purple-400">Level {simComplexity} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simComplexity}
                onChange={e => setSimComplexity(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Level 1 (Simple)</span>
                <span>Level 10 (Critical Arch)</span>
              </div>
            </div>

            {/* Engineer Workload Toggle */}
            <div className="pt-2">
              <span className="text-xs text-slate-300 font-semibold block mb-2">
                Engineer Queue Saturation:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSimOverloaded(false)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                    !simOverloaded
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Balanced (2 active)
                </button>
                <button
                  type="button"
                  onClick={() => setSimOverloaded(true)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                    simOverloaded
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Overloaded (6 active)
                </button>
              </div>
            </div>
          </Card>

          {/* Right: AI Output Diagnostic Preview (7 cols) */}
          <Card variant="glow" className="lg:col-span-7 p-6 space-y-5 bg-[#0F1626]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Live AI Risk Output</h4>
              </div>

              <RiskBadge score={simResult.riskScore} level={simResult.riskLevel} size="md" />
            </div>

            {/* Explanation box */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {simResult.riskExplanation}
              </p>
            </div>

            {/* Factor breakdown */}
            <div className="space-y-2.5">
              {simResult.riskFactors.map(factor => (
                <div key={factor.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                  <span className="font-semibold text-slate-300">{factor.label}</span>
                  <span className={`text-[11px] font-bold uppercase ${
                    factor.impact === 'critical' ? 'text-rose-400' : factor.impact === 'high' ? 'text-orange-400' : 'text-emerald-400'
                  }`}>
                    {factor.impact} Impact
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Recommended Action: <strong className="text-white font-medium">{simOverloaded ? 'Auto-Reassign to David Kim (-45% Risk)' : 'Trigger Fast Rollback'}</strong>
              </span>
              <Button
                size="sm"
                variant="ai-glow"
                onClick={() => {
                  onSwitchRole('ADMIN');
                  onNavigate('/admin/at-risk');
                }}
                className="text-xs"
              >
                Try in Dashboard
              </Button>
            </div>
          </Card>

        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Built for Modern High-Velocity Operations
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Everything your team needs to enforce contract commitments, protect customer trust, and streamline engineering triage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="glass" className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Predictive Breach Scoring</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ML heuristic models analyze elapsed duration, engineer bandwidth, complexity, and historical resolution curves to identify breaches hours ahead.
            </p>
          </Card>

          <Card variant="glass" className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">One-Click Auto Remediation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execute intelligent mitigations with a single click—reassigning to low-saturation specialists, pairing co-responders, or triggering emergency playbooks.
            </p>
          </Card>

          <Card variant="glass" className="p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Sliders className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Multi-Tier SLA Policy Studio</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure Platinum, Gold, and Silver tiers with custom response and resolution targets, escalation thresholds, and financial penalty rules.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">SLA AI Platform</span>
            <span>•</span>
            <span>Enterprise SLA Intelligence</span>
          </div>
          <p>© 2026 SLA AI Systems. Built with precision for high-uptime engineering teams.</p>
        </div>
      </footer>

    </div>
  );
}
