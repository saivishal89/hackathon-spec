import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = React.useState<GlobalNode>(GLOBAL_REGIONS[0]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // 1. Globe Mesh (Wireframe Sphere)
    const globeRadius = 1.8;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 28, 28);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x4338ca,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Inner dark sphere
    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius * 0.98, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x050811, transparent: true, opacity: 0.85 })
    );
    scene.add(innerSphere);

    // 2. Region Beacons / Pins on Globe
    const pinsGroup = new THREE.Group();
    scene.add(pinsGroup);

    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    GLOBAL_REGIONS.forEach((region) => {
      const pos = latLngToVector3(region.lat, region.lng, globeRadius * 1.02);
      
      const pinColor = region.status === 'CRITICAL' ? 0xf43f5e : region.status === 'WARNING' ? 0xf59e0b : 0x10b981;
      
      const pinGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const pinMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinsGroup.add(pinMesh);

      // Outer Pulsing Glow
      const auraGeo = new THREE.RingGeometry(0.08, 0.12, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      aura.position.copy(pos);
      aura.lookAt(new THREE.Vector3(0, 0, 0));
      pinsGroup.add(aura);
    });

    // 3. Ambient Star Field
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 120;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 15;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.03, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 4. Animation Loop
    let animId: number;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      globe.rotation.y += dx * 0.005;
      pinsGroup.rotation.y += dx * 0.005;
      globe.rotation.x += dy * 0.005;
      pinsGroup.rotation.x += dy * 0.005;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        globe.rotation.y += 0.003;
        pinsGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div ref={containerRef} className="w-full h-[320px] cursor-grab active:cursor-grabbing" />

      {/* Region Status Selector Bar */}
      <div className="mt-2 w-full grid grid-cols-3 sm:grid-cols-6 gap-1.5 z-10">
        {GLOBAL_REGIONS.map((r) => (
          <button
            key={r.name}
            onClick={() => setSelectedNode(r)}
            className={`px-2 py-1 rounded text-[10px] font-medium border text-center transition-all ${
              selectedNode.name === r.name
                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                : 'bg-[#0B0F19]/80 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="truncate">{r.name.split(' ')[0]}</div>
            <div className={`text-[9px] ${
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
