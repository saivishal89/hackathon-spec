import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroScene3DProps {
  riskScore?: number; // 0 to 100
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export function HeroScene3D({ riskScore = 45, riskLevel = 'MEDIUM' }: HeroScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const outerRingRef = useRef<THREE.Mesh | null>(null);
  const innerRingRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Get color based on risk level
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return new THREE.Color(0xf43f5e); // Rose-500
      case 'HIGH': return new THREE.Color(0xf59e0b);     // Amber-500
      case 'MEDIUM': return new THREE.Color(0x6366f1);   // Indigo-500
      default: return new THREE.Color(0x10b981);         // Emerald-500
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // 3. Central Hologram Core (Icosahedron Wireframe + Inner Glow)
    const riskColor = getRiskColor(riskLevel);
    
    // Core Geometry
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: riskColor,
      wireframe: true,
      emissive: riskColor,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // Inner Solid Glow Sphere
    const innerGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x1e1b4b,
      transparent: true,
      opacity: 0.9,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreMesh.add(innerMesh);

    // 4. Orbital Cyber Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.02, 16, 100), ringMat);
    outerRing.rotation.x = Math.PI / 3;
    scene.add(outerRing);
    outerRingRef.current = outerRing;

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.02, 16, 100), new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    }));
    innerRing.rotation.y = Math.PI / 4;
    scene.add(innerRing);
    innerRingRef.current = innerRing;

    // 5. Floating Telemetry Particle Cloud (250 nodes)
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const radius = 2.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      scales[i] = Math.random();
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // 7. Mouse Movement Handler for Parallax
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current.targetX = x * 2;
      mouseRef.current.targetY = y * 2;
    };

    window.addEventListener('mousemove', onMouseMove);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Speed multipliers based on risk score (higher risk = faster pulse/spin)
      const speedMult = 1 + (riskScore / 100) * 1.5;

      if (coreMeshRef.current) {
        coreMeshRef.current.rotation.x = time * 0.25 * speedMult + mouseRef.current.y * 0.4;
        coreMeshRef.current.rotation.y = time * 0.35 * speedMult + mouseRef.current.x * 0.4;
        
        // Pulse scale with breathing animation
        const pulse = 1 + Math.sin(time * 2.5 * speedMult) * 0.04;
        coreMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      if (outerRingRef.current) {
        outerRingRef.current.rotation.z = -time * 0.3 * speedMult;
        outerRingRef.current.rotation.x = (Math.PI / 3) + Math.sin(time * 0.5) * 0.1;
      }

      if (innerRingRef.current) {
        innerRingRef.current.rotation.y = time * 0.4 * speedMult;
        innerRingRef.current.rotation.z = Math.sin(time * 0.6) * 0.15;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y = -time * 0.08;
      }

      // Parallax camera sway
      camera.position.x = mouseRef.current.x * 0.5;
      camera.position.y = -mouseRef.current.y * 0.5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // Update material color dynamically when risk changes
  useEffect(() => {
    if (coreMeshRef.current) {
      const mat = coreMeshRef.current.material as THREE.MeshStandardMaterial;
      const col = getRiskColor(riskLevel);
      mat.color = col;
      mat.emissive = col;
    }
  }, [riskLevel]);

  return (
    <div className="relative w-full h-full min-h-[420px] flex items-center justify-center pointer-events-auto select-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
      
      {/* Overlay Glowing Ring HUD */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[320px] h-[320px] rounded-full border border-indigo-500/20 animate-[spin_30s_linear_infinite]" />
        <div className="absolute w-[380px] h-[380px] rounded-full border border-dashed border-purple-500/15 animate-[spin_45s_linear_infinite_reverse]" />
      </div>
    </div>
  );
}
