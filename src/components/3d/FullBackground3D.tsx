import React, { useEffect, useRef } from 'react';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
}

export function FullBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / width - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Create 3D particles in a spherical/wave cloud
    const particleCount = Math.min(180, Math.floor((width * height) / 8000));
    const colors = ['#6366f1', '#a855f7', '#38bdf8', '#c084fc', '#818cf8'];

    const particles: Particle3D[] = Array.from({ length: particleCount }, () => {
      const spread = 650;
      const x = (Math.random() - 0.5) * spread * 2.5;
      const y = (Math.random() - 0.5) * spread * 1.8;
      const z = (Math.random() - 0.5) * spread * 2;
      return {
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        radius: 1.2 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });

    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      time += 0.01;

      ctx.fillStyle = '#070A12';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const rotY = mouseRef.current.x * 0.35 + time * 0.05;
      const rotX = mouseRef.current.y * 0.25 + Math.sin(time * 0.2) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 450;

      // Project 3D coordinate to 2D
      const projected = particles.map((p) => {
        // Subtle organic sine floating
        p.x = p.baseX + Math.sin(time + p.baseZ * 0.01) * 20;
        p.y = p.baseY + Math.cos(time + p.baseX * 0.01) * 20;

        // 3D rotation
        const x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        const z1 = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);

        const y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = p.y * Math.sin(rotX) + z1 * Math.cos(rotX);

        const scale = fov / (fov + z2 + 350);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        return { px, py, z: z2, scale, color: p.color, radius: p.radius };
      });

      // Draw connecting synaptic network lines between close particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          if (p1.scale > 0.4 && p2.scale > 0.4) {
            const dx = p1.px - p2.px;
            const dy = p1.py - p2.py;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 110) {
              const alpha = (1 - dist / 110) * 0.22 * Math.min(p1.scale, p2.scale);
              ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
            }
          }
        }
      }

      // Draw 3D glowing particles
      projected.forEach((p) => {
        if (p.scale > 0.2) {
          const alpha = Math.max(0.15, Math.min(1, p.scale));
          
          // Outer glow
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.25;
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.radius * p.scale * 3, 0, Math.PI * 2);
          ctx.fill();

          // Center solid core
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.radius * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;

      // Subtle Cyber Grid Floor at bottom
      const gridY = height * 0.85;
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.06)';
      ctx.lineWidth = 1;
      for (let x = -width; x < width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x + mouseRef.current.x * 40, height);
        ctx.lineTo(centerX + (x - centerX) * 0.1, gridY);
        ctx.stroke();
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-[#090D16]/60 pointer-events-none" />
    </div>
  );
}
