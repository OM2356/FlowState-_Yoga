import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Landmark3D, TargetPoseReference, JointStatus } from "../../types/poseTracking";
import { POSE_CONNECTIONS, POSE_LANDMARKS } from "../../utils/poseGeometry";
import { Eye, RotateCcw, Compass, Sparkles, Layers, CheckCircle2 } from "lucide-react";

interface LiveThreeAvatarProps {
  currentLandmarks: Landmark3D[];
  targetPose: TargetPoseReference;
  jointStatuses?: Record<string, JointStatus>;
  overallScore: number;
}

export const LiveThreeAvatar: React.FC<LiveThreeAvatarProps> = ({
  currentLandmarks,
  targetPose,
  overallScore,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showGhost, setShowGhost] = useState<boolean>(true);
  const [viewAngle, setViewAngle] = useState<"perspective" | "front" | "side">("perspective");

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Group references
  const userAvatarGroupRef = useRef<THREE.Group | null>(null);
  const ghostAvatarGroupRef = useRef<THREE.Group | null>(null);

  // User joints & bones references for rapid frame-by-frame position updates
  const userJointMeshesRef = useRef<THREE.Mesh[]>([]);
  const userBoneMeshesRef = useRef<THREE.Mesh[]>([]);

  // Ghost joints & bones
  const ghostJointMeshesRef = useRef<THREE.Mesh[]>([]);
  const ghostBoneMeshesRef = useRef<THREE.Mesh[]>([]);

  // Mouse orbit interaction
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: 0, phi: 0.2, radius: 3.2 });

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d14);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff9f1c, 1.2);
    dirLight1.position.set(2, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x2ec4b6, 1.0);
    dirLight2.position.set(-2, -2, -3);
    scene.add(dirLight2);

    // 5. Floor Grid with Sacred Geometry Glow
    const gridHelper = new THREE.GridHelper(4, 20, 0x242d3d, 0x141a24);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    // Circular glowing ring on the ground
    const ringGeo = new THREE.RingGeometry(0.8, 0.82, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.19;
    scene.add(ringMesh);

    // 6. User Avatar Group
    const userAvatarGroup = new THREE.Group();
    scene.add(userAvatarGroup);
    userAvatarGroupRef.current = userAvatarGroup;

    // Build 33 user joint spheres
    const jointGeo = new THREE.SphereGeometry(0.035, 16, 16);
    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x2ec4b6,
      emissive: 0x2ec4b6,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.5,
    });

    const userJoints: THREE.Mesh[] = [];
    for (let i = 0; i < 33; i++) {
      const mesh = new THREE.Mesh(jointGeo, jointMat.clone());
      userAvatarGroup.add(mesh);
      userJoints.push(mesh);
    }
    userJointMeshesRef.current = userJoints;

    // Build user bone cylinders
    const boneCylGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 12);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0x2ec4b6,
      roughness: 0.3,
      metalness: 0.4,
    });

    const userBones: THREE.Mesh[] = [];
    for (let i = 0; i < POSE_CONNECTIONS.length; i++) {
      const mesh = new THREE.Mesh(boneCylGeo, boneMat.clone());
      userAvatarGroup.add(mesh);
      userBones.push(mesh);
    }
    userBoneMeshesRef.current = userBones;

    // 7. Ghost Avatar Group (Instructor Reference Target)
    const ghostGroup = new THREE.Group();
    scene.add(ghostGroup);
    ghostAvatarGroupRef.current = ghostGroup;

    const ghostJointMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.5,
      emissive: 0xd4af37,
      emissiveIntensity: 0.2,
    });
    const ghostBoneMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });

    const ghostJoints: THREE.Mesh[] = [];
    for (let i = 0; i < 33; i++) {
      const mesh = new THREE.Mesh(jointGeo, ghostJointMat);
      ghostGroup.add(mesh);
      ghostJoints.push(mesh);
    }
    ghostJointMeshesRef.current = ghostJoints;

    const ghostBones: THREE.Mesh[] = [];
    for (let i = 0; i < POSE_CONNECTIONS.length; i++) {
      const mesh = new THREE.Mesh(boneCylGeo, ghostBoneMat);
      ghostGroup.add(mesh);
      ghostBones.push(mesh);
    }
    ghostBoneMeshesRef.current = ghostBones;

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Subtle breathing idle pulse on sacred floor ring
      const time = performance.now() * 0.0015;
      ringMesh.scale.setScalar(1 + 0.04 * Math.sin(time));

      renderer.render(scene, camera);
    };
    animate();

    // Window / container resize observer
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Helper to convert MediaPipe 2D/3D normalized coordinates (x: 0..1, y: 0..1, z: normalized) to Three.js space
  const mapLandmarkTo3D = (lm: Landmark3D): THREE.Vector3 => {
    // Invert X for mirror feel, shift Y down so hips are centered near (0, 0, 0)
    const scale = 2.4;
    const x = (lm.x - 0.5) * -scale;
    const y = (0.5 - lm.y) * scale;
    const z = (lm.z || 0) * -scale;
    return new THREE.Vector3(x, y, z);
  };

  // Helper to position and orient cylinder between 2 3D points
  const updateBoneTransform = (mesh: THREE.Mesh, pA: THREE.Vector3, pB: THREE.Vector3) => {
    const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
    mesh.position.copy(mid);

    const length = pA.distanceTo(pB);
    mesh.scale.set(1, length, 1);

    const dir = new THREE.Vector3().subVectors(pB, pA).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    mesh.quaternion.copy(quat);
  };

  // Update User Avatar Skeleton every time landmarks update
  useEffect(() => {
    if (!currentLandmarks || currentLandmarks.length < 33) return;

    // Update Joints
    const vPoints: THREE.Vector3[] = [];
    currentLandmarks.forEach((lm, idx) => {
      const v = mapLandmarkTo3D(lm);
      vPoints.push(v);
      const mesh = userJointMeshesRef.current[idx];
      if (mesh) {
        mesh.position.copy(v);
      }
    });

    // Determine colors based on alignment score
    let boneColorHex = 0x2ec4b6; // Green / Aligned
    if (overallScore < 65) {
      boneColorHex = 0xff5252; // Coral / Off
    } else if (overallScore < 85) {
      boneColorHex = 0xff9f1c; // Saffron / Minor deviation
    }

    // Update Bones
    POSE_CONNECTIONS.forEach(([idxA, idxB], boneIdx) => {
      const mesh = userBoneMeshesRef.current[boneIdx];
      const pA = vPoints[idxA];
      const pB = vPoints[idxB];
      if (mesh && pA && pB) {
        updateBoneTransform(mesh, pA, pB);
        (mesh.material as THREE.MeshStandardMaterial).color.setHex(boneColorHex);
      }
    });
  }, [currentLandmarks, overallScore]);

  // Update Ghost Target Avatar when targetPose changes or ghost toggle flips
  useEffect(() => {
    if (!ghostAvatarGroupRef.current) return;
    ghostAvatarGroupRef.current.visible = showGhost;

    if (!showGhost || !targetPose.idealLandmarks3D) return;

    const gPoints: THREE.Vector3[] = [];
    targetPose.idealLandmarks3D.forEach((lm, idx) => {
      const v = mapLandmarkTo3D(lm);
      gPoints.push(v);
      const mesh = ghostJointMeshesRef.current[idx];
      if (mesh) {
        mesh.position.copy(v);
      }
    });

    POSE_CONNECTIONS.forEach(([idxA, idxB], boneIdx) => {
      const mesh = ghostBoneMeshesRef.current[boneIdx];
      const pA = gPoints[idxA];
      const pB = gPoints[idxB];
      if (mesh && pA && pB) {
        updateBoneTransform(mesh, pA, pB);
      }
    });
  }, [targetPose, showGhost]);

  // Camera preset switcher
  const applyViewAngle = (angle: "perspective" | "front" | "side") => {
    if (!cameraRef.current) return;
    setViewAngle(angle);

    if (angle === "front") {
      cameraAngleRef.current = { theta: 0, phi: 0, radius: 3.2 };
      cameraRef.current.position.set(0, 0.1, 3.2);
    } else if (angle === "side") {
      cameraAngleRef.current = { theta: Math.PI / 2, phi: 0, radius: 3.2 };
      cameraRef.current.position.set(3.2, 0.1, 0);
    } else {
      cameraAngleRef.current = { theta: 0.35, phi: 0.25, radius: 3.2 };
      cameraRef.current.position.set(1.1, 0.6, 3.0);
    }
    cameraRef.current.lookAt(0, 0, 0);
  };

  // Mouse drag orbital controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !cameraRef.current) return;
    const dx = e.clientX - prevMousePosRef.current.x;
    const dy = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    cameraAngleRef.current.theta -= dx * 0.01;
    cameraAngleRef.current.phi = Math.max(-0.6, Math.min(0.8, cameraAngleRef.current.phi + dy * 0.01));

    const { theta, phi, radius } = cameraAngleRef.current;
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(theta) * Math.cos(phi);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.002;
    cameraAngleRef.current.radius = Math.max(1.8, Math.min(5.5, cameraAngleRef.current.radius + zoomDelta));

    const { theta, phi, radius } = cameraAngleRef.current;
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(phi);
    const z = radius * Math.cos(theta) * Math.cos(phi);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);
  };

  return (
    <div
      className="relative w-full h-full min-h-[380px] sm:min-h-[460px] bg-[#090D14] rounded-2xl overflow-hidden border border-[#242D3D] shadow-2xl flex flex-col select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {/* Alignment Badge */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0E1420]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#242D3D] text-xs font-mono">
          <div
            className={`w-2.5 h-2.5 rounded-full animate-ping ${
              overallScore >= 85 ? "bg-[#2EC4B6]" : overallScore >= 65 ? "bg-[#FF9F1C]" : "bg-red-500"
            }`}
          />
          <span className="text-[#CAD5E2]">3D Avatar Mirrored</span>
          <span
            className="font-bold px-1.5 py-0.5 rounded text-[10px]"
            style={{
              backgroundColor: overallScore >= 85 ? "#2EC4B622" : overallScore >= 65 ? "#FF9F1C22" : "#FF525222",
              color: overallScore >= 85 ? "#2EC4B6" : overallScore >= 65 ? "#FF9F1C" : "#FF5252",
            }}
          >
            {overallScore}% Match
          </span>
        </div>

        {/* View Angles & Ghost Overlay Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0E1420]/80 backdrop-blur-md p-1 rounded-xl border border-[#242D3D] text-xs">
          <button
            onClick={() => setShowGhost(!showGhost)}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1.5 ${
              showGhost
                ? "bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]"
                : "text-[#8C9BAE] hover:text-[#F5F1E8]"
            }`}
            title="Toggle Instructor Ghost Target Overlay"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ghost Target</span>
          </button>

          <div className="w-[1px] h-4 bg-[#242D3D]" />

          <button
            onClick={() => applyViewAngle("perspective")}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all ${
              viewAngle === "perspective" ? "bg-[#242D3D] text-[#F5F1E8]" : "text-[#8C9BAE]"
            }`}
          >
            3D 3/4
          </button>
          <button
            onClick={() => applyViewAngle("front")}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all ${
              viewAngle === "front" ? "bg-[#242D3D] text-[#F5F1E8]" : "text-[#8C9BAE]"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => applyViewAngle("side")}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all ${
              viewAngle === "side" ? "bg-[#242D3D] text-[#F5F1E8]" : "text-[#8C9BAE]"
            }`}
          >
            Side
          </button>
        </div>
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 text-[10px] font-mono text-[#8C9BAE]">
        <span className="bg-[#0E1420]/75 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#1E2535]">
          Drag to Orbit (360°) • Scroll to Zoom
        </span>

        <div className="flex items-center gap-2 bg-[#0E1420]/75 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#1E2535]">
          <span className="flex items-center gap-1 text-[#2EC4B6]">
            <span className="w-2 h-2 rounded-full bg-[#2EC4B6]" /> Aligned
          </span>
          <span className="flex items-center gap-1 text-[#FF9F1C]">
            <span className="w-2 h-2 rounded-full bg-[#FF9F1C]" /> &lt;25° Dev
          </span>
          <span className="flex items-center gap-1 text-[#D4AF37]">
            <span className="w-2 h-2 rounded-full border border-[#D4AF37]" /> Target
          </span>
        </div>
      </div>
    </div>
  );
};
