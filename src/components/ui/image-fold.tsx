// Image Fold / Unrolling Transformation Component (Three.js + GSAP + Canvas Fallback)
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const CANVAS_OVERSIZE = 1.4;
const MESH_SCALE = 1;
const CAMERA_DISTANCE = 400;
const CAMERA_NEAR = 100;
const CAMERA_FAR = 1000;
const PLANE_SEGMENTS = 64;

const vertexShader = `
uniform float time;
uniform float angle;
uniform float progress;
uniform float rolls;
uniform float rollRadius;
uniform vec4 resolution;
varying vec2 vUv;
varying float vFrontShadow;
const float pi = 3.14159265359;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat4(
    oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

void main() {
  float deg = mod(degrees(angle), 360.0);
  float base = deg;
  float fx = 1.0;
  float fy = 1.0;
  if (deg > 270.0) {
    base = 360.0 - deg;
    fy = -1.0;
  } else if (deg > 180.0) {
    base = deg - 180.0;
    fx = -1.0;
    fy = -1.0;
  } else if (deg > 90.0) {
    base = 180.0 - deg;
    fx = -1.0;
  }
  float finalAngle = radians(base);

  vUv = uv;
  if (fx < 0.0) vUv.x = 1.0 - vUv.x;
  if (fy < 0.0) vUv.y = 1.0 - vUv.y;
  vec3 newposition = position;
  float rad = rollRadius;
  float rollCount = rolls;

  newposition = rotate(newposition - vec3(-0.5, 0.5, 0.0), vec3(0.0, 0.0, 1.0), -finalAngle) + vec3(-0.5, 0.5, 0.0);
  float offs = (newposition.x + 0.5) / (sin(finalAngle) + cos(finalAngle) + 0.0001);
  float tProgress = clamp((progress - offs * 0.99) / 0.01, 0.0, 1.0);
  vFrontShadow = clamp((progress - offs * 0.95) / 0.05, 0.7, 1.0);

  newposition.z = rad + rad * (1.0 - offs / 2.0) * sin(-offs * rollCount * pi - 0.5 * pi);
  newposition.x = -0.5 + rad * (1.0 - offs / 2.0) * cos(-offs * rollCount * pi + 0.5 * pi);
  newposition = rotate(newposition - vec3(-0.5, 0.5, 0.0), vec3(0.0, 0.0, 1.0), finalAngle) + vec3(-0.5, 0.5, 0.0);
  newposition = rotate(newposition - vec3(-0.5, 0.5, rad), vec3(sin(finalAngle), cos(finalAngle), 0.0), -pi * progress * rollCount);
  newposition += vec3(
    -0.5 + progress * cos(finalAngle) * (sin(finalAngle) + cos(finalAngle)),
    0.5 - progress * sin(finalAngle) * (sin(finalAngle) + cos(finalAngle)),
    rad * (1.0 - progress / 2.0)
  );

  vec3 finalposition = mix(newposition, position, tProgress);
  if (fx < 0.0) finalposition.x = -finalposition.x;
  if (fy < 0.0) finalposition.y = -finalposition.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalposition, 1.0);
}
`;

const fragmentShader = `
uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying float vFrontShadow;

vec2 get_img_uv() {
  vec2 uv = vUv - 0.5;
  uv *= resolution.zw;
  return uv + 0.5;
}

void main() {
  vec2 img_uv = get_img_uv();
  vec4 color = texture2D(texture1, img_uv);
  color.rgb *= vFrontShadow;
  color.a = clamp(progress * 4.0, 0.0, 1.0);
  gl_FragColor = color;
}
`;

function mapRollRadius(value: number): number {
  if (value <= 1) return 0.01;
  if (value >= 10) return 0.13;
  return 0.01 + ((value - 1) / 9) * 0.12;
}

function computeFov(width: number, height: number, distance: number): number {
  const aspect = width / height;
  return 2 * Math.atan(width / aspect / (2 * distance)) * (180 / Math.PI);
}

export interface ImageFoldProps {
  image?: string;
  angle?: number;
  rolls?: number;
  rollRadius?: number;
  mode?: "default" | "enter";
  startAlign?: "top" | "center" | "bottom";
  replay?: boolean;
  duration?: number;
  style?: CSSProperties;
  className?: string;
}

export function ImageFold({
  image = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  angle = 175,
  rolls = 12,
  rollRadius = 4,
  mode = "enter",
  startAlign = "center",
  replay = false,
  duration = 1.8,
  style,
  className = "",
}: ImageFoldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isRenderingRef = useRef(false);
  const scrollTweenRef = useRef<any>(null);

  const [inView, setInView] = useState(false);
  const [textureReady, setTextureReady] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const resize = useCallback((width: number, height: number) => {
    if (!cameraRef.current || !rendererRef.current || !meshRef.current || !canvasRef.current)
      return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasW = width * CANVAS_OVERSIZE;
    const canvasH = height * CANVAS_OVERSIZE;
    const meshW = width * MESH_SCALE;
    const meshH = height * MESH_SCALE;

    cameraRef.current.aspect = canvasW / canvasH;
    cameraRef.current.fov = computeFov(canvasW, canvasH, CAMERA_DISTANCE);
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(
      Math.round(canvasW * dpr),
      Math.round(canvasH * dpr),
      false
    );
    canvasRef.current.style.width = `${canvasW}px`;
    canvasRef.current.style.height = `${canvasH}px`;
    meshRef.current.scale.set(meshW, meshH, meshW / 2);

    const material = meshRef.current.material as THREE.ShaderMaterial;
    if (material?.uniforms?.resolution) {
      const tex = material.uniforms.texture1?.value;
      if (tex?.image) {
        const layerAspect = meshW / meshH;
        const imgAspect = tex.image.width / tex.image.height;
        let a1 = 1;
        let a2 = 1;
        if (layerAspect > imgAspect) {
          a2 = imgAspect / layerAspect;
        } else {
          a1 = layerAspect / imgAspect;
        }
        material.uniforms.resolution.value.set(meshW, meshH, a1, a2);
      }
    }
  }, []);

  const renderOnce = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, []);

  const renderLoop = useCallback(() => {
    renderOnce();
    rafIdRef.current = isRenderingRef.current
      ? requestAnimationFrame(renderLoop)
      : null;
  }, [renderOnce]);

  const startLoop = useCallback(() => {
    isRenderingRef.current = true;
    if (rafIdRef.current == null) rafIdRef.current = requestAnimationFrame(renderLoop);
  }, [renderLoop]);

  const stopLoop = useCallback(() => {
    isRenderingRef.current = false;
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // Initialize Three.js scene
  const initThree = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return null;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasW = width * CANVAS_OVERSIZE;
    const canvasH = height * CANVAS_OVERSIZE;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      computeFov(canvasW, canvasH, CAMERA_DISTANCE),
      canvasW / canvasH,
      CAMERA_NEAR,
      CAMERA_FAR
    );
    camera.position.set(0, 0, CAMERA_DISTANCE);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });
    } catch {
      setHasWebGL(false);
      return null;
    }

    renderer.setSize(Math.round(canvasW * dpr), Math.round(canvasH * dpr), false);
    renderer.setPixelRatio(1);
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(1, 1, PLANE_SEGMENTS, PLANE_SEGMENTS);
    const meshW = width * MESH_SCALE;
    const meshH = height * MESH_SCALE;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        angle: { value: (angle * Math.PI) / 180 },
        rolls: { value: rolls },
        rollRadius: { value: mapRollRadius(rollRadius) },
        texture1: { value: null },
        resolution: { value: new THREE.Vector4(meshW, meshH, 1, 1) },
      },
      transparent: true,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(meshW, meshH, meshW / 2);
    mesh.position.set(0, 0, 0);
    meshRef.current = mesh;
    scene.add(mesh);

    return { scene, camera, renderer, mesh };
  }, [angle, rolls, rollRadius]);

  // Load Image Texture
  const loadTexture = useCallback(() => {
    if (!image || !meshRef.current) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!meshRef.current) return;
      const texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      texture.minFilter = THREE.LinearFilter;
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (!material || !material.uniforms) return;
      material.uniforms.texture1.value = texture;
      setTextureReady(true);
      renderOnce();
    };
    img.onerror = () => {
      setTextureReady(false);
    };
    img.src = image;
  }, [image, renderOnce]);

  useEffect(() => {
    if (!hasWebGL) return;
    initThree();
    loadTexture();
    return () => {
      stopLoop();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
        sceneRef.current = null;
      }
    };
  }, [hasWebGL, initThree, loadTexture, stopLoop]);

  // Intersection / Scroll Detection
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (replay) {
          setInView(false);
          if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            if (material?.uniforms?.progress) material.uniforms.progress.value = 0;
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [replay]);

  // Animate Unroll on Scroll
  useEffect(() => {
    if (!inView || !textureReady || !meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    if (!material?.uniforms?.progress) return;

    startLoop();
    scrollTweenRef.current = gsap.to(material.uniforms.progress, {
      value: 1,
      duration: duration,
      ease: "power3.out",
      onUpdate: renderOnce,
      onComplete: () => {
        renderOnce();
        stopLoop();
      },
    });

    return () => {
      if (scrollTweenRef.current) scrollTweenRef.current.kill();
      stopLoop();
    };
  }, [inView, textureReady, duration, renderOnce, startLoop, stopLoop]);

  if (!hasWebGL) {
    return (
      <div className={`relative w-full h-full rounded-2xl overflow-hidden ${className}`} style={style}>
        <img src={image} alt="Dashboard Preview" className="w-full h-full object-cover rounded-2xl" />
      </div>
    );
  }

  const offset = ((CANVAS_OVERSIZE - 1) / 2) * 100;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        ...style,
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: `-${offset}%`,
          left: `-${offset}%`,
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default ImageFold;
