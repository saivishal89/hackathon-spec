import React, { useState, useRef } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'indigo' | 'purple' | 'amber' | 'rose' | 'emerald';
  depth?: number;
}

export function Card3D({ children, className = '', glowColor = 'indigo', depth = 15 }: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -depth;
    const rY = ((x - centerX) / centerX) * depth;

    setRotateX(rX);
    setRotateY(rY);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  const glowStyles = {
    indigo: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] border-indigo-500/20',
    purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] border-purple-500/20',
    amber: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] border-amber-500/20',
    rose: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] border-rose-500/20',
    emerald: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] border-emerald-500/20',
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative transition-transform duration-200 ease-out"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden rounded-2xl border bg-[#0B0F19]/90 backdrop-blur-xl transition-all duration-200 ease-out ${glowStyles[glowColor]} ${className}`}
      >
        {/* Dynamic 3D Glare Flare */}
        <div
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}), transparent 60%)`,
          }}
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        />

        <div style={{ transform: 'translateZ(20px)' }} className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
