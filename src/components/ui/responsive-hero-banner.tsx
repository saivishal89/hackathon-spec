// Responsive Hero Banner — SLA Risk Prediction Platform
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, ShieldAlert, Cpu, Activity, Zap, CheckCircle2 } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface Partner {
  name: string;
  badge: string;
  category: string;
}

export interface ResponsiveHeroBannerProps {
  navLinks?: NavLink[];
  ctaButtonText?: string;
  onCtaClick?: () => void;
  badgeLabel?: string;
  badgeText?: string;
  title?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  partnersTitle?: string;
  partners?: Partner[];
}

export const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  navLinks = [
    { label: "Overview", href: "#problem", isActive: true },
    { label: "Risk Engine", href: "#risk-engine" },
    { label: "Transformation", href: "#transformation" },
    { label: "Comparison", href: "#comparison" },
    { label: "Workspaces", href: "#workspaces" },
  ],
  ctaButtonText = "Launch Demo",
  onCtaClick,
  badgeLabel = "SLA AI 2.0",
  badgeText = "Autonomous Breach Prevention & 1-Click Remediation",
  title = "Predict SLA Breaches",
  titleLine2 = "Before They Happen.",
  description = "AI-powered SLA operations platform that forecasts breach risk percentages, explains root causes in real-time, and automatically helps engineering teams prevent SLA violations.",
  primaryButtonText = "Explore Operations Hub",
  onPrimaryClick,
  secondaryButtonText = "Client Portal Demo",
  onSecondaryClick,
  partnersTitle = "Engineered for mission-critical enterprise infrastructure",
  partners = [
    { name: "Kubernetes", badge: "Cloud Native", category: "Orchestration" },
    { name: "FastAPI", badge: "High Velocity", category: "Core Backend" },
    { name: "PostgreSQL", badge: "ACID Relational", category: "Persistence" },
    { name: "Redis", badge: "Sub-millisecond", category: "Cache & Queue" },
    { name: "Docker", badge: "Multi-Container", category: "Architecture" },
  ]
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="w-full isolate min-h-screen overflow-hidden relative bg-[#060911] text-white flex flex-col justify-between">
      
      {/* Background Animated Gradient Mesh & Cyberpunk Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="z-30 w-full relative pt-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onCtaClick}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-lg text-white">SLA AI</span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400 ml-1.5 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                PROACTIVE
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 rounded-full bg-slate-900/80 p-1.5 ring-1 ring-white/10 backdrop-blur-xl shadow-2xl">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onCtaClick}
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <span>{ctaButtonText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/80 ring-1 ring-white/15 text-white"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl space-y-2 animate-fadeIn">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onCtaClick && onCtaClick();
              }}
              className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 font-bold text-xs text-white"
            >
              {ctaButtonText}
            </button>
          </div>
        )}
      </header>

      {/* Hero Content Area */}
      <div className="z-10 relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center flex-1 flex flex-col justify-center">
        
        {/* Top Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-900/90 border border-indigo-500/30 px-3.5 py-1.5 backdrop-blur-md shadow-xl mx-auto">
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 rounded-full py-0.5 px-2">
            {badgeLabel}
          </span>
          <span className="text-xs sm:text-sm font-medium text-slate-200">
            {badgeText}
          </span>
        </div>

        {/* Main Headings */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto">
          <span className="text-white drop-shadow-sm">{title}</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            {titleLine2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mt-6 mx-auto leading-relaxed">
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row sm:gap-4 mt-8 gap-3 items-center justify-center">
          <button
            onClick={onPrimaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 hover:bg-indigo-500 text-sm font-bold text-white bg-indigo-600 shadow-xl shadow-indigo-600/30 rounded-2xl py-3.5 px-7 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{primaryButtonText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={onSecondaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900/80 border border-slate-700/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Play className="h-4 w-4 text-cyan-400 fill-cyan-400/20" />
            <span>{secondaryButtonText}</span>
          </button>
        </div>

        {/* Real-time Telemetry Stats Pill */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>SLA Target</span>
              <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white">99.4%</div>
            <div className="text-[10px] text-emerald-400 font-semibold">+4.2% compliance</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Risk Prediction</span>
              <Activity className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="text-lg font-bold text-white">Real-Time</div>
            <div className="text-[10px] text-indigo-400 font-semibold">Multi-factor engine</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>1-Click Action</span>
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white">Auto-Mitigate</div>
            <div className="text-[10px] text-cyan-400 font-semibold">-38% risk drop</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Customer CSAT</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-white">4.8 / 5.0</div>
            <div className="text-[10px] text-purple-400 font-semibold">Post-resolution loop</div>
          </div>
        </div>

      </div>

      {/* Tech Stack / Partner Bar */}
      <div className="z-10 relative max-w-5xl mx-auto px-4 pb-8 w-full">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-mono text-center mb-4">
          {partnersTitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-300"
            >
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              <span>{partner.name}</span>
              <span className="text-[10px] text-slate-500 font-normal">({partner.category})</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default ResponsiveHeroBanner;
