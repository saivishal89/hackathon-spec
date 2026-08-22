import React, { useEffect, useRef, useState } from 'react';

interface GlobalNode {
  name: string;
  lat: number;
  lng: number;
  status: 'MET' | 'WARNING' | 'CRITICAL';
  pingMs: number;
}

const GLOBAL_REGIONS: GlobalNode[] = [
  { name: 'us-east-1 (N. Virginia)', lat: 38.0, lng: -77.0, status: 'MET', pingMs: 14 },
  { name: 'eu-west-1 (Frankfurt)', lat: 50.1, lng: 8.6, status: 'MET', pingMs: 22 },
  { name: 'ap-south-1 (Mumbai)', lat: 19.0, lng: 72.8, status: 'WARNING', pingMs: 48 },
  { name: 'ap-northeast-1 (Tokyo)', lat: 35.6, lng: 139.6, status: 'MET', pingMs: 31 },
  { name: 'sa-east-1 (São Paulo)', lat: -23.5, lng: -46.6, status: 'MET', pingMs: 65 },
  { name: 'us-west-2 (Oregon)', lat: 45.5, lng: -122.6, status: 'CRITICAL', pingMs: 89 },
];

export function InteractiveGlobe3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GlobalNode>(GLOBAL_REGIONS[0]);
  const rotRef = useRef({ rotY: 0, rotX: 0.2, isDragging: false, startX: 0, startY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const radius = 95;

    const handleMouseDown = (e: MouseEvent) => {
      rotRef.current.isDragging = true;
      rotRef.current.startX = e.clientX;
      rotRef.current.startY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!rotRef.current.isDragging) return;
      const dx = e.clientX - rotRef.current.startX;
      const dy = e.clientY - rotRef.current.startY;
      rotRef.current.rotY += dx * 0.008;
      rotRef.current.rotX += dy * 0.008;
      rotRef.current.startX = e.clientX;
      rotRef.current.startY = e.clientY;
    };

    const handleMouseUp = () => {
      rotRef.current.isDragging = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const latLngTo3D = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return {
        x: -r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta)
      };
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      if (!rotRef.current.isDragging) {
        rotRef.current.rotY += 0.004;
      }

      const rotY = rotRef.current.rotY;
      const rotX = rotRef.current.rotX;

      const rotate = (p: { x: number; y: number; z: number }) => {
        // Y-axis rotation
        let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        let z1 = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
        // X-axis rotation
        let y2 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = p.y * Math.sin(rotX) + z1 * Math.cos(rotX);
        return { x: x1, y: y2, z: z2 };
      };

      // Draw Globe Wireframe Latitudes and Longitudes
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.18)';
      ctx.lineWidth = 1;

      // Parallels (Latitudes)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        const rLat = radius * Math.cos((lat * Math.PI) / 180);
        const yLat = radius * Math.sin((lat * Math.PI) / 180);
        for (let lng = 0; lng <= 360; lng += 10) {
          const theta = (lng * Math.PI) / 180;
          const pt = rotate({ x: rLat * Math.cos(theta), y: yLat, z: rLat * Math.sin(theta) });
          const scale = 300 / (300 + pt.z);
          const px = centerX + pt.x * scale;
          const py = centerY + pt.y * scale;
          if (lng === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Meridians (Longitudes)
      for (let lng = 0; lng < 180; lng += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 10) {
          const pt3D = latLngTo3D(lat, lng, radius);
          const rot = rotate(pt3D);
          const scale = 300 / (300 + rot.z);
          const px = centerX + rot.x * scale;
          const py = centerY + rot.y * scale;
          if (lat === -90) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Outer Silhouette Rim Glow
      const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.15);
      grad.addColorStop(0, 'rgba(99, 102, 241, 0)');
      grad.addColorStop(0.8, 'rgba(99, 102, 241, 0.08)');
      grad.addColorStop(1, 'rgba(99, 102, 241, 0.25)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.05, 0, Math.PI * 2);
      ctx.fill();

      // Render Incident Nodes
      GLOBAL_REGIONS.forEach((region) => {
        const pt = latLngTo3D(region.lat, region.lng, radius * 1.02);
        const rot = rotate(pt);

        // Only draw front-facing nodes
        if (rot.z > -10) {
          const scale = 300 / (300 + rot.z);
          const px = centerX + rot.x * scale;
          const py = centerY + rot.y * scale;

          let color = '#10b981'; // Emerald
          if (region.status === 'CRITICAL') color = '#f43f5e';
          else if (region.status === 'WARNING') color = '#f59e0b';

          // Pulse ring
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 6 * scale, 0, Math.PI * 2);
          ctx.stroke();

          // Center solid dot
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, 3 * scale, 0, Math.PI * 2);
          ctx.fill();

          // Label
          ctx.font = '10px monospace';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(`${region.name.split(' ')[0]} (${region.pingMs}ms)`, px + 8, py - 4);
        }
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-3 select-none">
      <canvas
        ref={canvasRef}
        width={380}
        height={260}
        className="w-full h-[260px] max-w-[380px] cursor-grab active:cursor-grabbing"
      />

      {/* Region Status Selector Bar */}
      <div className="mt-3 w-full grid grid-cols-3 sm:grid-cols-6 gap-1.5 z-10">
        {GLOBAL_REGIONS.map((r) => (
          <button
            key={r.name}
            onClick={() => setSelectedNode(r)}
            className={`px-2 py-1 rounded-lg text-[10px] font-medium border text-center transition-all ${
              selectedNode.name === r.name
                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                : 'bg-[#0B0F19]/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="truncate font-semibold">{r.name.split(' ')[0]}</div>
            <div className={`text-[9px] font-mono mt-0.5 ${
              r.status === 'CRITICAL' ? 'text-rose-400 font-bold' : r.status === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {r.pingMs}ms
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
