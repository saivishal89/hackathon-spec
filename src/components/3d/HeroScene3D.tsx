import React, { useEffect, useRef } from 'react';

interface HeroScene3DProps {
  riskScore?: number; // 0 to 100
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function HeroScene3D({ riskScore = 45, riskLevel = 'MEDIUM' }: HeroScene3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });

  // Generate icosahedron vertices for 3D Cyber Core
  const t = (1 + Math.sqrt(5)) / 2;
  const rawVertices: Point3D[] = [
    { x: -1, y: t, z: 0 }, { x: 1, y: t, z: 0 }, { x: -1, y: -t, z: 0 }, { x: 1, y: -t, z: 0 },
    { x: 0, y: -1, z: t }, { x: 0, y: 1, z: t }, { x: 0, y: -1, z: -t }, { x: 0, y: 1, z: -t },
    { x: t, y: 0, z: -1 }, { x: t, y: 0, z: 1 }, { x: -t, y: 0, z: -1 }, { x: -t, y: 0, z: 1 }
  ];

  // Normalize vertices to sphere radius
  const vertices: Point3D[] = rawVertices.map(v => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return { x: (v.x / len) * 85, y: (v.y / len) * 85, z: (v.z / len) * 85 };
  });

  const edges = [
    [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
    [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
    [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
    [4, 9], [9, 8], [8, 6], [6, 2], [2, 4],
    [4, 5], [4, 11], [2, 11], [2, 10], [6, 10], [6, 7], [8, 7], [8, 1], [9, 1], [9, 5]
  ];

  // 120 orbiting background telemetry particles
  const particles: Point3D[] = Array.from({ length: 100 }, () => {
    const radius = 110 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi)
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = x * 2;
      mouseRef.current.targetY = y * 2;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.isHovered = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const speedMult = 1 + (riskScore / 100) * 1.5;
      angleY += 0.008 * speedMult + mouseRef.current.x * 0.02;
      angleX += 0.005 * speedMult + mouseRef.current.y * 0.02;
      angleZ += 0.003 * speedMult;

      // Color selection based on risk
      let strokeColor = 'rgba(99, 102, 241, 0.8)'; // Indigo
      let glowColor = 'rgba(99, 102, 241, 0.3)';
      let coreGlow = '#6366f1';
      if (riskLevel === 'CRITICAL') {
        strokeColor = 'rgba(244, 63, 94, 0.9)'; // Rose
        glowColor = 'rgba(244, 63, 94, 0.4)';
        coreGlow = '#f43f5e';
      } else if (riskLevel === 'HIGH') {
        strokeColor = 'rgba(245, 158, 11, 0.9)'; // Amber
        glowColor = 'rgba(245, 158, 11, 0.4)';
        coreGlow = '#f59e0b';
      } else if (riskLevel === 'LOW') {
        strokeColor = 'rgba(16, 185, 129, 0.9)'; // Emerald
        glowColor = 'rgba(16, 185, 129, 0.4)';
        coreGlow = '#10b981';
      }

      // 3D Rotation Matrix helper
      const rotate3D = (p: Point3D): Point3D => {
        // Rotate Y
        let x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        let z1 = p.x * Math.sin(angleY) + p.z * Math.cos(angleY);
        // Rotate X
        let y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = p.y * Math.sin(angleX) + z1 * Math.cos(angleX);
        // Rotate Z
        let x3 = x1 * Math.cos(angleZ) - y2 * Math.sin(angleZ);
        let y3 = x1 * Math.sin(angleZ) + y2 * Math.cos(angleZ);
        return { x: x3, y: y3, z: z2 };
      };

      // Project 3D to 2D perspective
      const fov = 350;
      const project = (p: Point3D) => {
        const rot = rotate3D(p);
        const scale = fov / (fov + rot.z);
        return {
          x: centerX + rot.x * scale,
          y: centerY + rot.y * scale,
          z: rot.z,
          scale
        };
      };

      // Draw Orbiting Particles
      particles.forEach((pt) => {
        const proj = project(pt);
        const alpha = Math.max(0.1, (proj.z + 150) / 300);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(1, 1.8 * proj.scale), 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Orbital Cyber Rings (Torus Wireframe)
      const ringSteps = 48;
      const ringRadius = 115;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i <= ringSteps; i++) {
        const theta = (i / ringSteps) * Math.PI * 2;
        const pt = { x: Math.cos(theta) * ringRadius, y: 0, z: Math.sin(theta) * ringRadius };
        const proj = project(pt);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.closePath();
      ctx.stroke();

      // Second inclined ring
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.beginPath();
      for (let i = 0; i <= ringSteps; i++) {
        const theta = (i / ringSteps) * Math.PI * 2;
        const pt = {
          x: Math.cos(theta) * ringRadius * 0.9,
          y: Math.sin(theta) * ringRadius * 0.9 * 0.5,
          z: Math.sin(theta) * ringRadius * 0.9 * 0.8
        };
        const proj = project(pt);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.closePath();
      ctx.stroke();

      // Project Core Vertices
      const projVertices = vertices.map(v => project(v));

      // Draw Edges with Glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = glowColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.8;

      edges.forEach(([i1, i2]) => {
        const p1 = projVertices[i1];
        const p2 = projVertices[i2];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw Core Vertex Nodes
      projVertices.forEach(p => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(2, 3 * p.scale), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(3, 5 * p.scale), 0, Math.PI * 2);
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      ctx.shadowBlur = 0;
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [riskScore, riskLevel]);

  return (
    <div className="relative w-full h-full min-h-[360px] flex items-center justify-center pointer-events-auto select-none">
      <canvas
        ref={canvasRef}
        width={440}
        height={360}
        className="w-full h-full max-w-[440px] max-h-[360px] cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
