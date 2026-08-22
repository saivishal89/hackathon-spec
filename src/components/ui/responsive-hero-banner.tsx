"use client";

import React, { useState } from 'react';

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface Partner {
  logoUrl?: string;
  name?: string;
  href?: string;
}

export interface ResponsiveHeroBannerProps {
  logoUrl?: string;
  backgroundImageUrl?: string;
  navLinks?: NavLink[];
  ctaButtonText?: string;
  ctaButtonHref?: string;
  onCtaClick?: () => void;
  badgeText?: string;
  badgeLabel?: string;
  title?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  onSecondaryClick?: () => void;
  partnersTitle?: string;
  partners?: Partner[];
}

export const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  logoUrl = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/febf2421-4a9a-42d6-871d-ff4f9518021c_1600w.png",
  backgroundImageUrl = "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0e2dbea0-c0a9-413f-a57b-af279633c0df_3840w.jpg",
  navLinks = [
    { label: "Home", href: "#", isActive: true },
    { label: "Problem", href: "#problem" },
    { label: "Risk Engine", href: "#risk-engine" },
    { label: "Transformation", href: "#transformation" },
    { label: "Workspaces", href: "#workspaces" }
  ],
  ctaButtonText = "Launch Demo",
  ctaButtonHref = "#",
  onCtaClick,
  badgeLabel = "New",
  badgeText = "AI-Powered SLA Breach Risk Forecasting 2026",
  title = "Predict SLA Breaches",
  titleLine2 = "Before They Happen.",
  description = "Experience proactive SLA operations like never before. Our advanced risk engine and multi-factor diagnostics make deadline management predictable, autonomous, and breach-free.",
  primaryButtonText = "Explore Operations Hub",
  primaryButtonHref = "#",
  onPrimaryClick,
  secondaryButtonText = "Client Portal Demo",
  secondaryButtonHref = "#",
  onSecondaryClick,
  partnersTitle = "Partnering with leading enterprise engineering teams worldwide",
  partners = [
    { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/f7466370-2832-4fdd-84c2-0932bb0dd850_800w.png", name: "Kubernetes", href: "#" },
    { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0a9a71ec-268b-4689-a510-56f57e9d4f13_1600w.png", name: "PostgreSQL", href: "#" },
    { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a9ed4369-748a-49f8-9995-55d6c876bbff_1600w.png", name: "FastAPI", href: "#" },
    { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0d8966a4-8525-4e11-9d5d-2d7390b2c798_1600w.png", name: "Redis", href: "#" },
    { logoUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/2ed33c8b-b8b2-4176-967f-3d785fed07d8_1600w.png", name: "Docker", href: "#" }
  ]
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCta = (e: React.MouseEvent) => {
    if (onCtaClick) {
      e.preventDefault();
      onCtaClick();
    }
  };

  const handlePrimary = (e: React.MouseEvent) => {
    if (onPrimaryClick) {
      e.preventDefault();
      onPrimaryClick();
    }
  };

  const handleSecondary = (e: React.MouseEvent) => {
    if (onSecondaryClick) {
      e.preventDefault();
      onSecondaryClick();
    }
  };

  return (
    <section className="w-full isolate min-h-screen overflow-hidden relative flex flex-col justify-between bg-black">
      {/* Background Hero Image */}
      <img
        src={backgroundImageUrl}
        alt="SLA Platform Background"
        className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0 brightness-[0.75]"
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

      {/* Header Navigation */}
      <header className="z-20 xl:top-4 relative">
        <div className="mx-6">
          <div className="flex items-center justify-between pt-4">
            
            {/* Logo Brand / Icon */}
            <a
              href="#"
              onClick={handleCta}
              className="inline-flex items-center gap-2.5 text-white no-underline group"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                ⚡
              </div>
              <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                SLA AI
              </span>
            </a>

            {/* Desktop Capsule Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur-md shadow-2xl">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium hover:text-white font-sans transition-colors ${
                      link.isActive ? 'text-white/90' : 'text-white/80'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={ctaButtonHref}
                  onClick={handleCta}
                  className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 font-sans transition-colors cursor-pointer shadow-lg shadow-white/10"
                >
                  <span>{ctaButtonText}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </a>
              </div>
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white/90"
              >
                <path d="M4 5h16" />
                <path d="M4 12h16" />
                <path d="M4 19h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 p-4 rounded-2xl bg-black/90 ring-1 ring-white/15 backdrop-blur-xl space-y-2 animate-fade-in">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={ctaButtonHref}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleCta(e);
                }}
                className="block text-center mt-2 py-2.5 rounded-full bg-white font-bold text-xs text-neutral-900"
              >
                {ctaButtonText}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Hero Body */}
      <div className="z-10 relative flex-1 flex flex-col justify-center">
        <div className="sm:pt-20 md:pt-28 lg:pt-32 max-w-7xl mx-auto pt-16 px-6 pb-16">
          <div className="mx-auto max-w-3xl text-center">
            
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur animate-fade-slide-in-1">
              <span className="inline-flex items-center text-xs font-medium text-neutral-900 bg-white/90 rounded-full py-0.5 px-2 font-sans">
                {badgeLabel}
              </span>
              <span className="text-sm font-medium text-white/90 font-sans">
                {badgeText}
              </span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-4xl text-white tracking-tight font-normal animate-fade-slide-in-2 drop-shadow-md">
              {title}
              <br className="hidden sm:block" />
              {titleLine2}
            </h1>

            {/* Description Subtitle */}
            <p className="sm:text-lg animate-fade-slide-in-3 text-base text-white/80 max-w-2xl mt-6 mx-auto leading-relaxed drop-shadow">
              {description}
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">
              <a
                href={primaryButtonHref}
                onClick={handlePrimary}
                className="inline-flex items-center gap-2 hover:bg-white/15 text-sm font-medium text-white bg-white/10 ring-white/15 ring-1 rounded-full py-3 px-5 font-sans transition-colors cursor-pointer"
              >
                <span>{primaryButtonText}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a
                href={secondaryButtonHref}
                onClick={handleSecondary}
                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:text-white font-sans transition-colors cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                </svg>
                <span>{secondaryButtonText}</span>
              </a>
            </div>

          </div>

          {/* Partner & Integrations Bar */}
          <div className="mx-auto mt-16 max-w-5xl">
            <p className="animate-fade-slide-in-1 text-sm text-white/70 text-center">
              {partnersTitle}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 animate-fade-slide-in-2 text-white/70 mt-6 items-center justify-items-center gap-4">
              {partners.map((partner, index) => (
                <a
                  key={index}
                  href={partner.href || "#"}
                  className="inline-flex items-center justify-center bg-center w-[120px] h-[36px] bg-cover rounded-full opacity-80 hover:opacity-100 transition-opacity"
                  style={{ backgroundImage: partner.logoUrl ? `url(${partner.logoUrl})` : undefined }}
                  aria-label={partner.name || `Partner ${index + 1}`}
                >
                  {!partner.logoUrl && partner.name && (
                    <span className="text-xs font-mono font-bold text-white/90">{partner.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
