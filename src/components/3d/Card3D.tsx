import React from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'indigo' | 'purple' | 'amber' | 'rose' | 'emerald';
}

export function Card3D({ children, className = '', glowColor = 'indigo' }: Card3DProps) {
  const glowStyles = {
    indigo: 'border-indigo-500/25 hover:border-indigo-500/50 hover:shadow-[0_0_35px_rgba(99,102,241,0.25)]',
    purple: 'border-purple-500/25 hover:border-purple-500/50 hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]',
    amber: 'border-amber-500/25 hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)]',
    rose: 'border-rose-500/25 hover:border-rose-500/50 hover:shadow-[0_0_35px_rgba(244,63,94,0.25)]',
    emerald: 'border-emerald-500/25 hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]',
  };

  return (
    <div
      className={`relative rounded-2xl border bg-[#0B0F19]/90 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 ${glowStyles[glowColor]} ${className}`}
    >
      {/* Subtle Inner Card Lighting */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
