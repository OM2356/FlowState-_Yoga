import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Wind, Sparkles, Activity, Play, Compass } from "lucide-react";

interface Hero3DWaveProps {
  onExploreClick?: () => void;
  onQuickStartClick?: () => void;
}

export const Hero3DWave: React.FC<Hero3DWaveProps> = ({
  onExploreClick,
  onQuickStartClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [waveSpeed, setWaveSpeed] = useState<"calm" | "deep" | "dynamic">("calm");

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight || 260;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 8, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3D Harmonic Plane Wave Grid
    const cols = 55;
    const rows = 35;
    const planeGeo = new THREE.PlaneGeometry(28, 18, cols, rows);
    planeGeo.rotateX(-Math.PI / 2.6);

    // Dynamic wave shader-like vertex displacement with point dots and wireframe
    const count = planeGeo.attributes.position.count;
    const originalPositions = new Float32Array(planeGeo.attributes.position.array);

    // Material with earthy sage-forest tones
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x4e6548,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });

    const waveMesh = new THREE.Mesh(planeGeo, wireMat);
    scene.add(waveMesh);

    // Points particle grid overlay on vertices
    const pointsMat = new THREE.PointsMaterial({
      color: 0x8bba85,
      size: 0.09,
      transparent: true,
      opacity: 0.75,
    });
    const pointsMesh = new THREE.Points(planeGeo, pointsMat);
    scene.add(pointsMesh);

    // Ambient floating prana particles
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 24;
      particlePos[i + 1] = Math.random() * 6 - 1;
      particlePos[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const ambientParticleMat = new THREE.PointsMaterial({
      color: 0xd48b70,
      size: 0.12,
      transparent: true,
      opacity: 0.55,
    });
    const ambientParticles = new THREE.Points(particleGeo, ambientParticleMat);
    scene.add(ambientParticles);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const speedFactor = waveSpeed === "deep" ? 0.6 : waveSpeed === "dynamic" ? 1.5 : 1.0;
      const t = elapsedTime * speedFactor;

      const posAttr = planeGeo.attributes.position;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const ox = originalPositions[ix];
        const oy = originalPositions[ix + 1];

        // Harmonic dual-sine undulating yogic breath wave
        const z =
          Math.sin(ox * 0.45 + t * 1.8) * 0.95 +
          Math.cos(oy * 0.4 + t * 1.4) * 0.8 +
          Math.sin((ox + oy) * 0.2 + t * 2.2) * 0.45;

        arr[ix + 2] = z;
      }
      posAttr.needsUpdate = true;

      // Gentle orbital oscillation
      waveMesh.rotation.z = Math.sin(t * 0.2) * 0.04;
      pointsMesh.rotation.z = Math.sin(t * 0.2) * 0.04;

      // Slow particle float
      ambientParticles.rotation.y = t * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 260;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();
      wireMat.dispose();
      pointsMat.dispose();
      particleGeo.dispose();
      ambientParticleMat.dispose();
    };
  }, [waveSpeed]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E2520] via-[#2A342D] to-[#1E2520] text-white border border-[#3E4D40] shadow-sm">
      {/* 3D Wave WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
      />

      {/* Hero Content Overlay */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between min-h-[260px] sm:min-h-[290px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-[#FAF8F4]/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-[#8BBA85]">
            <Wind className="w-3.5 h-3.5 animate-pulse text-[#8BBA85]" />
            <span>Harmonic Breath Wave • Real-time 3D Prana</span>
          </div>

          {/* Wave Speed Toggle */}
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setWaveSpeed("deep")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                waveSpeed === "deep" ? "bg-[#4E6548] text-white font-semibold" : "text-white/70 hover:text-white"
              }`}
            >
              Slow Breath
            </button>
            <button
              onClick={() => setWaveSpeed("calm")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                waveSpeed === "calm" ? "bg-[#4E6548] text-white font-semibold" : "text-white/70 hover:text-white"
              }`}
            >
              Natural Flow
            </button>
            <button
              onClick={() => setWaveSpeed("dynamic")}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                waveSpeed === "dynamic" ? "bg-[#4E6548] text-white font-semibold" : "text-white/70 hover:text-white"
              }`}
            >
              Vigorous
            </button>
          </div>
        </div>

        <div className="my-auto py-3 max-w-2xl">
          <h1 className="text-2xl sm:text-4xl font-serif font-medium tracking-tight text-[#FAF8F4] leading-tight">
            Find Your Balance in Body and Mind
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
            FlowState guides you through intelligent yoga flows with interactive 3D human pose alignment, soothing voice coaching, and breath-synchronized visual rhythms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {onQuickStartClick && (
            <button
              onClick={onQuickStartClick}
              className="px-4 py-2.5 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 15m Relaxing Practice</span>
            </button>
          )}

          {onExploreClick && (
            <button
              onClick={onExploreClick}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/20 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Mood Sessions</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
