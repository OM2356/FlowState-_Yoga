import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { YogaPose, MuscleGroup } from "../types";
import { SuryaNamaskarStep } from "../data/suryaNamaskarData";
import { 
  Rotate3d, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  Layers, 
  Sparkles, 
  Activity,
  Maximize2,
  Minimize2,
  Wind,
  Palette,
  Shirt,
  User,
  Sliders,
  Check,
  X
} from "lucide-react";

interface ThreeYogaHumanProps {
  pose?: YogaPose | null;
  suryaStep?: SuryaNamaskarStep | null;
  height?: number | string;
  className?: string;
  interactiveControls?: boolean;
  showMuscleHeatmap?: boolean;
  isBreathing?: boolean;
  breathPhase?: "inhale" | "hold-in" | "exhale" | "hold-out";
  depthLevel?: number; // 0 to 1
  materialMode?: "skin" | "heatmap" | "clay" | "wireframe";
  skinTone?: "golden-tan" | "deep-bronze" | "warm-sand" | "olive-radiance";
  shortsColor?: "slate-black" | "forest-sage" | "terracotta" | "ocean-navy";
  topStyle?: "bare-torso" | "fitted-tank";
  onPoseChangeAnimationEnd?: () => void;
}

export const ThreeYogaHuman: React.FC<ThreeYogaHumanProps> = ({
  pose,
  suryaStep,
  height = 420,
  className = "",
  interactiveControls = true,
  showMuscleHeatmap = false,
  isBreathing = true,
  breathPhase = "inhale",
  depthLevel = 0.5,
  materialMode: initialMode = "skin",
  skinTone: propSkinTone = "golden-tan",
  shortsColor: propShortsColor = "slate-black",
  topStyle: propTopStyle = "bare-torso",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayMode, setDisplayMode] = useState<"skin" | "heatmap" | "clay" | "wireframe">(
    showMuscleHeatmap ? "heatmap" : initialMode
  );
  const [cameraView, setCameraView] = useState<"threeQuarter" | "side" | "front" | "top">("threeQuarter");
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [activeDepth, setActiveDepth] = useState<number>(depthLevel);

  // Avatar Customization State (Athletic Male Yogi)
  const [activeSkinTone, setActiveSkinTone] = useState<"golden-tan" | "deep-bronze" | "warm-sand" | "olive-radiance">(propSkinTone);
  const [activeShortsColor, setActiveShortsColor] = useState<"slate-black" | "forest-sage" | "terracotta" | "ocean-navy">(propShortsColor);
  const [activeTopStyle, setActiveTopStyle] = useState<"bare-torso" | "fitted-tank">(propTopStyle);
  const [showCustomizeDrawer, setShowCustomizeDrawer] = useState<boolean>(false);

  // References for Three.js state
  const threeState = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    humanGroup: THREE.Group;
    pelvisGroup: THREE.Group;
    chestGroup: THREE.Group;
    headGroup: THREE.Group;
    leftArmGroup: THREE.Group;
    leftForearmGroup: THREE.Group;
    rightArmGroup: THREE.Group;
    rightForearmGroup: THREE.Group;
    leftLegGroup: THREE.Group;
    leftShinGroup: THREE.Group;
    rightLegGroup: THREE.Group;
    rightShinGroup: THREE.Group;
    matMesh: THREE.Mesh;
    materials: Record<string, THREE.Material>;
    targetRotations: Record<string, THREE.Euler>;
    targetPositions: Record<string, THREE.Vector3>;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    spherical: { radius: number; theta: number; phi: number };
    targetLookAt: THREE.Vector3;
    animationFrameId?: number;
  } | null>(null);

  // Sync display mode with heatmap prop
  useEffect(() => {
    if (showMuscleHeatmap) {
      setDisplayMode("heatmap");
    }
  }, [showMuscleHeatmap]);

  // Main Three.js Setup & Rigging
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 480;
    const canvasHeight = typeof height === "number" ? height : container.clientHeight || 420;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F7F4EE"); // Clean warm studio neutral
    scene.fog = new THREE.FogExp2("#F7F4EE", 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / canvasHeight, 0.1, 100);
    const spherical = { radius: 6.8, theta: Math.PI / 4, phi: Math.PI / 2.6 };
    const targetLookAt = new THREE.Vector3(0, 1.1, 0);

    const updateCameraPos = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi) + 0.8;
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(targetLookAt);
    };
    updateCameraPos();

    // 3. Renderer with antialias and soft shadows
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight("#FFF7ED", 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#FFFBEB", 1.8);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#E0E7FF", 0.75);
    fillLight.position.set(-5, 4, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#FEF3C7", 1.1);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // 5. Studio Floor & Yoga Mat
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: "#EDE6DA",
      roughness: 0.85,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Yoga Mat
    const matGeo = new THREE.BoxGeometry(1.6, 0.02, 3.6);
    const matMat = new THREE.MeshStandardMaterial({
      color: "#5C6F5A", // Natural calm sage yoga mat
      roughness: 0.65,
      metalness: 0.1,
    });
    const matMesh = new THREE.Mesh(matGeo, matMat);
    matMesh.position.set(0, 0.01, 0);
    matMesh.receiveShadow = true;
    scene.add(matMesh);

    // Mat Center Alignment Guide Line
    const matLineGeo = new THREE.PlaneGeometry(0.04, 3.2);
    const matLineMat = new THREE.MeshBasicMaterial({ color: "#7B9078" });
    const matLine = new THREE.Mesh(matLineGeo, matLineMat);
    matLine.rotation.x = -Math.PI / 2;
    matLine.position.set(0, 0.022, 0);
    scene.add(matLine);

    // 6. Materials definition
    const skinColorMap: Record<string, string> = {
      "golden-tan": "#DDA57A",
      "deep-bronze": "#B07A56",
      "warm-sand": "#E2B899",
      "olive-radiance": "#C89B77",
    };

    const shortsColorMap: Record<string, string> = {
      "slate-black": "#1F2622",
      "forest-sage": "#394B3C",
      "terracotta": "#8D4A38",
      "ocean-navy": "#223242",
    };

    const activeSkinHex = skinColorMap[activeSkinTone] || "#DDA57A";
    const activeShortsHex = shortsColorMap[activeShortsColor] || "#1F2622";

    const skinMat = new THREE.MeshStandardMaterial({
      color: activeSkinHex,
      roughness: 0.45,
      metalness: 0.05,
    });
    const apparelMat = new THREE.MeshStandardMaterial({
      color: activeShortsHex, // Athletic Male Yoga Shorts
      roughness: 0.7,
      metalness: 0.1,
    });
    const apparelTopMat = new THREE.MeshStandardMaterial({
      color: activeTopStyle === "bare-torso" ? activeSkinHex : "#35453A",
      roughness: activeTopStyle === "bare-torso" ? 0.45 : 0.75,
      metalness: 0.06,
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: "#181412", // Natural dark espresso yogi hair
      roughness: 0.85,
      metalness: 0.1,
    });
    const waistbandMat = new THREE.MeshStandardMaterial({
      color: "#141A16",
      roughness: 0.6,
      metalness: 0.15,
    });
    const jointMat = new THREE.MeshStandardMaterial({
      color: activeSkinHex,
      roughness: 0.48,
    });
    const muscleGlowMat = new THREE.MeshStandardMaterial({
      color: "#DE6B48", // glowing terracotta for muscle activation
      emissive: "#B84725",
      emissiveIntensity: 0.45,
      roughness: 0.35,
    });
    const clayMat = new THREE.MeshStandardMaterial({
      color: "#D8CEC0",
      roughness: 0.9,
      metalness: 0.0,
    });

    const materials = {
      skin: skinMat,
      apparel: apparelMat,
      apparelTop: apparelTopMat,
      hair: hairMat,
      waistband: waistbandMat,
      joint: jointMat,
      muscleGlow: muscleGlowMat,
      clay: clayMat,
    };

    // 7. Human Skeletal Hierarchy Rigging (Athletic Male Yogi)
    const humanGroup = new THREE.Group();
    scene.add(humanGroup);

    // Helper to create smooth capsule or cylinder
    const createCapsule = (radius: number, length: number, mat: THREE.Material) => {
      const geo = new THREE.CapsuleGeometry(radius, Math.max(0.01, length - radius * 2), 12, 16);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const createJointSphere = (radius: number, mat: THREE.Material) => {
      const geo = new THREE.SphereGeometry(radius, 16, 16);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      return mesh;
    };

    // --- PELVIS & ROOT (Athletic Waist & Shorts) ---
    const pelvisGroup = new THREE.Group();
    pelvisGroup.position.set(0, 1.05, 0);
    humanGroup.add(pelvisGroup);

    const pelvisMesh = createCapsule(0.195, 0.29, apparelMat);
    pelvisMesh.rotation.z = Math.PI / 2;
    pelvisGroup.add(pelvisMesh);

    // Shorts Waistband
    const waistbandGeo = new THREE.CylinderGeometry(0.205, 0.205, 0.05, 20);
    const waistbandMesh = new THREE.Mesh(waistbandGeo, waistbandMat);
    waistbandMesh.position.set(0, 0.08, 0);
    pelvisGroup.add(waistbandMesh);

    // --- SPINE / TORSO / CHEST (Sculpted Male Anatomy) ---
    const spineGroup = new THREE.Group();
    spineGroup.position.set(0, 0.12, 0);
    pelvisGroup.add(spineGroup);

    const abdomenMesh = createCapsule(0.175, 0.27, activeTopStyle === "bare-torso" ? skinMat : apparelTopMat);
    abdomenMesh.position.set(0, 0.12, 0);
    spineGroup.add(abdomenMesh);

    // Sculpted 6-Pack Abdominal Core Accents (Male Musculature)
    const absAccentGeo = new THREE.BoxGeometry(0.14, 0.16, 0.02);
    const absAccentMat = new THREE.MeshStandardMaterial({
      color: activeSkinHex,
      roughness: 0.5,
    });
    const absAccent = new THREE.Mesh(absAccentGeo, absAccentMat);
    absAccent.position.set(0, 0.12, 0.165);
    spineGroup.add(absAccent);

    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, 0.26, 0);
    spineGroup.add(chestGroup);

    const chestMesh = createCapsule(0.22, 0.33, apparelTopMat);
    chestMesh.position.set(0, 0.14, 0);
    chestGroup.add(chestMesh);

    // Sculpted Male Pectoral Muscles (Left & Right Pectorals)
    const pecGeo = new THREE.CapsuleGeometry(0.065, 0.11, 8, 12);
    const leftPec = new THREE.Mesh(pecGeo, activeTopStyle === "bare-torso" ? skinMat : apparelTopMat);
    leftPec.rotation.z = Math.PI / 2.8;
    leftPec.position.set(-0.085, 0.16, 0.18);
    chestGroup.add(leftPec);

    const rightPec = new THREE.Mesh(pecGeo, activeTopStyle === "bare-torso" ? skinMat : apparelTopMat);
    rightPec.rotation.z = -Math.PI / 2.8;
    rightPec.position.set(0.085, 0.16, 0.18);
    chestGroup.add(rightPec);

    // Broad Male Shoulders Beam
    const shouldersMesh = createCapsule(0.085, 0.58, apparelTopMat);
    shouldersMesh.rotation.z = Math.PI / 2;
    shouldersMesh.position.set(0, 0.28, 0);
    chestGroup.add(shouldersMesh);

    // Sculpted Left & Right Deltoids
    const deltoidGeo = new THREE.SphereGeometry(0.095, 16, 16);
    const leftDeltoid = new THREE.Mesh(deltoidGeo, skinMat);
    leftDeltoid.position.set(-0.28, 0.28, 0);
    chestGroup.add(leftDeltoid);

    const rightDeltoid = new THREE.Mesh(deltoidGeo, skinMat);
    rightDeltoid.position.set(0.28, 0.28, 0);
    chestGroup.add(rightDeltoid);

    // --- NECK & HEAD (Male Facial Structure & Hairstyle) ---
    const neckGroup = new THREE.Group();
    neckGroup.position.set(0, 0.32, 0);
    chestGroup.add(neckGroup);

    const neckMesh = createCapsule(0.085, 0.13, skinMat);
    neckMesh.position.set(0, 0.05, 0);
    neckGroup.add(neckMesh);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.15, 0);
    neckGroup.add(headGroup);

    // Head Cranium & Chiseled Jawline
    const headCranium = new THREE.Mesh(
      new THREE.SphereGeometry(0.145, 20, 20),
      skinMat
    );
    headCranium.scale.set(1, 1.22, 1.08);
    headCranium.castShadow = true;
    headGroup.add(headCranium);

    // Male Athletic Cropped Hair Cap
    const hairGeo = new THREE.SphereGeometry(0.149, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.02, -0.01);
    headGroup.add(hairMesh);

    // Yogi Topknot / Athletic Bun
    const bunGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const bunMesh = new THREE.Mesh(bunGeo, hairMat);
    bunMesh.position.set(0, 0.13, -0.09);
    headGroup.add(bunMesh);

    // Masculine Facial Profile Marker (Nose & Jaw)
    const noseMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.032, 0.075, 8),
      skinMat
    );
    noseMesh.rotation.x = Math.PI / 2;
    noseMesh.position.set(0, -0.015, 0.155);
    headGroup.add(noseMesh);

    // --- LEFT ARM (Athletic Male Bicep/Forearm) ---
    const leftShoulderPos = new THREE.Vector3(-0.29, 0.28, 0);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.copy(leftShoulderPos);
    chestGroup.add(leftArmGroup);

    const leftShoulderJoint = createJointSphere(0.085, jointMat);
    leftArmGroup.add(leftShoulderJoint);

    const leftUpperArm = createCapsule(0.08, 0.33, skinMat);
    leftUpperArm.position.set(0, -0.16, 0);
    leftArmGroup.add(leftUpperArm);

    const leftForearmGroup = new THREE.Group();
    leftForearmGroup.position.set(0, -0.33, 0);
    leftArmGroup.add(leftForearmGroup);

    const leftElbowJoint = createJointSphere(0.072, jointMat);
    leftForearmGroup.add(leftElbowJoint);

    const leftForearm = createCapsule(0.07, 0.31, skinMat);
    leftForearm.position.set(0, -0.15, 0);
    leftForearmGroup.add(leftForearm);

    // Left Hand (Palm + fingers)
    const leftHand = createCapsule(0.052, 0.13, skinMat);
    leftHand.position.set(0, -0.34, 0);
    leftForearmGroup.add(leftHand);

    // --- RIGHT ARM (Athletic Male Bicep/Forearm) ---
    const rightShoulderPos = new THREE.Vector3(0.29, 0.28, 0);
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.copy(rightShoulderPos);
    chestGroup.add(rightArmGroup);

    const rightShoulderJoint = createJointSphere(0.085, jointMat);
    rightArmGroup.add(rightShoulderJoint);

    const rightUpperArm = createCapsule(0.08, 0.33, skinMat);
    rightUpperArm.position.set(0, -0.16, 0);
    rightArmGroup.add(rightUpperArm);

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.set(0, -0.33, 0);
    rightArmGroup.add(rightForearmGroup);

    const rightElbowJoint = createJointSphere(0.072, jointMat);
    rightForearmGroup.add(rightElbowJoint);

    const rightForearm = createCapsule(0.07, 0.31, skinMat);
    rightForearm.position.set(0, -0.15, 0);
    rightForearmGroup.add(rightForearm);

    const rightHand = createCapsule(0.052, 0.13, skinMat);
    rightHand.position.set(0, -0.34, 0);
    rightForearmGroup.add(rightHand);

    // --- LEFT LEG (Shorts + Muscular Thigh/Calf) ---
    const leftHipPos = new THREE.Vector3(-0.135, -0.05, 0);
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.copy(leftHipPos);
    pelvisGroup.add(leftLegGroup);

    const leftHipJoint = createJointSphere(0.092, jointMat);
    leftLegGroup.add(leftHipJoint);

    // Athletic Yoga Shorts Leg (Upper half of thigh)
    const leftShortsMesh = createCapsule(0.108, 0.26, apparelMat);
    leftShortsMesh.position.set(0, -0.12, 0);
    leftLegGroup.add(leftShortsMesh);

    // Exposed Muscular Lower Thigh
    const leftThigh = createCapsule(0.098, 0.44, skinMat);
    leftThigh.position.set(0, -0.22, 0);
    leftLegGroup.add(leftThigh);

    const leftShinGroup = new THREE.Group();
    leftShinGroup.position.set(0, -0.44, 0);
    leftLegGroup.add(leftShinGroup);

    const leftKneeJoint = createJointSphere(0.088, jointMat);
    leftShinGroup.add(leftKneeJoint);

    // Muscular Calf & Shin
    const leftShin = createCapsule(0.084, 0.44, skinMat);
    leftShin.position.set(0, -0.22, 0);
    leftShinGroup.add(leftShin);

    const leftFoot = createCapsule(0.068, 0.23, skinMat);
    leftFoot.rotation.x = Math.PI / 2;
    leftFoot.position.set(0, -0.44, 0.085);
    leftShinGroup.add(leftFoot);

    // --- RIGHT LEG (Shorts + Muscular Thigh/Calf) ---
    const rightHipPos = new THREE.Vector3(0.135, -0.05, 0);
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.copy(rightHipPos);
    pelvisGroup.add(rightLegGroup);

    const rightHipJoint = createJointSphere(0.092, jointMat);
    rightLegGroup.add(rightHipJoint);

    // Athletic Yoga Shorts Leg (Upper half of thigh)
    const rightShortsMesh = createCapsule(0.108, 0.26, apparelMat);
    rightShortsMesh.position.set(0, -0.12, 0);
    rightLegGroup.add(rightShortsMesh);

    // Exposed Muscular Lower Thigh
    const rightThigh = createCapsule(0.098, 0.44, skinMat);
    rightThigh.position.set(0, -0.22, 0);
    rightLegGroup.add(rightThigh);

    const rightShinGroup = new THREE.Group();
    rightShinGroup.position.set(0, -0.44, 0);
    rightLegGroup.add(rightShinGroup);

    const rightKneeJoint = createJointSphere(0.088, jointMat);
    rightShinGroup.add(rightKneeJoint);

    // Muscular Calf & Shin
    const rightShin = createCapsule(0.084, 0.44, skinMat);
    rightShin.position.set(0, -0.22, 0);
    rightShinGroup.add(rightShin);

    const rightFoot = createCapsule(0.068, 0.23, skinMat);
    rightFoot.rotation.x = Math.PI / 2;
    rightFoot.position.set(0, -0.44, 0.085);
    rightShinGroup.add(rightFoot);

    // 8. Mouse & Touch Orbit Drag Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI / 2.05, spherical.phi - deltaY * 0.008));

      updateCameraPos();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(2.8, Math.min(12, spherical.radius + e.deltaY * 0.005));
      updateCameraPos();
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      spherical.theta -= deltaX * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI / 2.05, spherical.phi - deltaY * 0.01));

      updateCameraPos();
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // 9. Animation Render Loop
    let clock = new THREE.Clock();

    const targetRotations: Record<string, THREE.Euler> = {
      pelvis: new THREE.Euler(0, 0, 0),
      spine: new THREE.Euler(0, 0, 0),
      chest: new THREE.Euler(0, 0, 0),
      head: new THREE.Euler(0, 0, 0),
      leftArm: new THREE.Euler(0, 0, 0),
      leftForearm: new THREE.Euler(0, 0, 0),
      rightArm: new THREE.Euler(0, 0, 0),
      rightForearm: new THREE.Euler(0, 0, 0),
      leftLeg: new THREE.Euler(0, 0, 0),
      leftShin: new THREE.Euler(0, 0, 0),
      rightLeg: new THREE.Euler(0, 0, 0),
      rightShin: new THREE.Euler(0, 0, 0),
    };

    const targetPositions: Record<string, THREE.Vector3> = {
      humanRoot: new THREE.Vector3(0, 0, 0),
      pelvis: new THREE.Vector3(0, 1.05, 0),
    };

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth interpolation for all joint angles
      const lerpSpeed = 5.5 * delta;

      pelvisGroup.position.lerp(targetPositions.pelvis, lerpSpeed);
      humanGroup.position.lerp(targetPositions.humanRoot, lerpSpeed);

      pelvisGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.pelvis), lerpSpeed);
      spineGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.spine), lerpSpeed);
      chestGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.chest), lerpSpeed);
      headGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.head), lerpSpeed);

      leftArmGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.leftArm), lerpSpeed);
      leftForearmGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.leftForearm), lerpSpeed);
      rightArmGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.rightArm), lerpSpeed);
      rightForearmGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.rightForearm), lerpSpeed);

      leftLegGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.leftLeg), lerpSpeed);
      leftShinGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.leftShin), lerpSpeed);
      rightLegGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.rightLeg), lerpSpeed);
      rightShinGroup.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetRotations.rightShin), lerpSpeed);

      // Natural rhythmic breathing expansion
      if (isBreathing) {
        const breathFreq = 1.6; // ~14 breaths per min
        const expansion = 1 + Math.sin(time * breathFreq) * 0.035;
        chestMesh.scale.set(expansion, 1, expansion);
        abdomenMesh.scale.set(expansion * 0.95, 1, expansion * 0.95);
      }

      // Auto rotation if toggled
      if (isAutoRotate) {
        spherical.theta += 0.008;
        updateCameraPos();
      }

      renderer.render(scene, camera);
      threeState.current!.animationFrameId = requestAnimationFrame(animate);
    };

    threeState.current = {
      scene,
      camera,
      renderer,
      humanGroup,
      pelvisGroup,
      chestGroup,
      headGroup,
      leftArmGroup,
      leftForearmGroup,
      rightArmGroup,
      rightForearmGroup,
      leftLegGroup,
      leftShinGroup,
      rightLegGroup,
      rightShinGroup,
      matMesh,
      materials,
      targetRotations,
      targetPositions,
      isDragging,
      previousMousePosition,
      spherical,
      targetLookAt,
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = typeof height === "number" ? height : entry.contentRect.height || 420;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      if (threeState.current?.animationFrameId) {
        cancelAnimationFrame(threeState.current.animationFrameId);
      }
      resizeObserver.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
    };
  }, [height, activeSkinTone, activeShortsColor, activeTopStyle]);

  // Apply Pose Joint Kinematics to 3D Human Model
  useEffect(() => {
    if (!threeState.current) return;
    const { targetRotations, targetPositions, targetLookAt } = threeState.current;

    const degToRad = (deg: number) => (deg * Math.PI) / 180;

    // A: Check if Surya Namaskar Step with explicit 3D Kinematics is active
    if (suryaStep) {
      const k = suryaStep.kinematics3D;

      if (k.isFloorPose) {
        targetPositions.pelvis.set(0, 0.45 + k.bodyElevationY, 0);
        targetLookAt.set(0, 0.5, 0);
      } else {
        targetPositions.pelvis.set(0, 1.05 + k.bodyElevationY, 0);
        targetLookAt.set(0, 1.0, 0);
      }

      // Torso & Spine
      targetRotations.pelvis.set(degToRad(k.torsoAngle * 0.4), 0, 0);
      targetRotations.spine.set(degToRad(k.torsoAngle * 0.6 + k.spineArch * 25), 0, 0);
      targetRotations.chest.set(degToRad(k.spineArch * 25), 0, 0);
      targetRotations.head.set(degToRad(k.headPitch), 0, 0);

      // Arms
      if (k.handsJoined) {
        // Anjali Mudra prayer hands
        targetRotations.leftArm.set(degToRad(35), degToRad(25), degToRad(-15));
        targetRotations.leftForearm.set(degToRad(-95), degToRad(30), degToRad(15));
        targetRotations.rightArm.set(degToRad(35), degToRad(-25), degToRad(15));
        targetRotations.rightForearm.set(degToRad(-95), degToRad(-30), degToRad(-15));
      } else {
        targetRotations.leftArm.set(degToRad(-k.leftArmPitch), degToRad(k.leftArmYaw), degToRad(k.leftArmRoll));
        targetRotations.leftForearm.set(degToRad(-k.leftElbowFlex), 0, 0);
        targetRotations.rightArm.set(degToRad(-k.rightArmPitch), degToRad(k.rightArmYaw), degToRad(-k.rightArmRoll));
        targetRotations.rightForearm.set(degToRad(-k.rightElbowFlex), 0, 0);
      }

      // Legs
      targetRotations.leftLeg.set(degToRad(k.leftHipFlex), 0, 0);
      targetRotations.leftShin.set(degToRad(k.leftKneeFlex), 0, 0);
      targetRotations.rightLeg.set(degToRad(k.rightHipFlex), 0, 0);
      targetRotations.rightShin.set(degToRad(k.rightKneeFlex), 0, 0);
      return;
    }

    // B: Check standard YogaPose kinematics
    if (pose) {
      const arch = pose.kinematics.poseArchetype;
      const k = pose.kinematics;

      switch (arch) {
        case "tadasana":
          targetPositions.pelvis.set(0, 1.05, 0);
          targetRotations.pelvis.set(0, 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, 0, 0);
          targetRotations.leftArm.set(0, 0, degToRad(12));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(0, 0, degToRad(-12));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(0, 0, degToRad(-2));
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(0, 0, degToRad(2));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "downwardDog":
          targetPositions.pelvis.set(0, 0.78, 0);
          targetRotations.pelvis.set(degToRad(75), 0, 0);
          targetRotations.spine.set(degToRad(15), 0, 0);
          targetRotations.chest.set(degToRad(5), 0, 0);
          targetRotations.head.set(degToRad(35), 0, 0);
          targetRotations.leftArm.set(degToRad(-160), 0, degToRad(12));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(-160), 0, degToRad(-12));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(75), 0, degToRad(-4));
          targetRotations.leftShin.set(degToRad(10), 0, 0);
          targetRotations.rightLeg.set(degToRad(75), 0, degToRad(4));
          targetRotations.rightShin.set(degToRad(10), 0, 0);
          break;

        case "warrior1":
          targetPositions.pelvis.set(0, 0.78, 0);
          targetRotations.pelvis.set(degToRad(-5), degToRad(8), 0);
          targetRotations.spine.set(degToRad(-15), 0, 0);
          targetRotations.chest.set(degToRad(-12), 0, 0);
          targetRotations.head.set(degToRad(-20), 0, 0);
          targetRotations.leftArm.set(degToRad(-172), 0, degToRad(12));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(-172), 0, degToRad(-12));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(88), 0, degToRad(-6));
          targetRotations.leftShin.set(degToRad(90), 0, 0);
          targetRotations.rightLeg.set(degToRad(-38), 0, degToRad(16));
          targetRotations.rightShin.set(degToRad(4), 0, 0);
          break;

        case "warrior2":
          targetPositions.pelvis.set(0, 0.76, 0);
          targetRotations.pelvis.set(0, degToRad(82), 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, degToRad(-78), 0);
          targetRotations.leftArm.set(0, 0, degToRad(88));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(0, 0, degToRad(-88));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(85), degToRad(20), degToRad(-12));
          targetRotations.leftShin.set(degToRad(90), 0, 0);
          targetRotations.rightLeg.set(degToRad(18), degToRad(-10), degToRad(18));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "warrior3":
          // Pro-Level Warrior III (Virabhadrasana III) - Horizontal Flight T-Balance
          targetPositions.pelvis.set(0, 1.02, 0);
          targetRotations.pelvis.set(degToRad(88), 0, 0);
          targetRotations.spine.set(degToRad(4), 0, 0);
          targetRotations.chest.set(degToRad(2), 0, 0);
          targetRotations.head.set(degToRad(-10), 0, 0);
          // Arms reaching straight forward overhead
          targetRotations.leftArm.set(degToRad(-175), 0, degToRad(8));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(-175), 0, degToRad(-8));
          targetRotations.rightForearm.set(0, 0, 0);
          // Standing left leg
          targetRotations.leftLeg.set(degToRad(88), 0, 0);
          targetRotations.leftShin.set(degToRad(2), 0, 0);
          // Lifted right leg parallel with floor
          targetRotations.rightLeg.set(degToRad(-4), 0, degToRad(2));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "tree":
        case "treePose":
          targetPositions.pelvis.set(0, 1.05, 0);
          targetRotations.pelvis.set(0, 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, 0, 0);
          // Anjali mudra prayer hands at chest or overhead
          targetRotations.leftArm.set(degToRad(35), degToRad(22), degToRad(-18));
          targetRotations.leftForearm.set(degToRad(-95), degToRad(32), degToRad(18));
          targetRotations.rightArm.set(degToRad(35), degToRad(-22), degToRad(18));
          targetRotations.rightForearm.set(degToRad(-95), degToRad(-32), degToRad(-18));
          targetRotations.leftLeg.set(0, 0, 0);
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(degToRad(58), degToRad(-68), degToRad(28));
          targetRotations.rightShin.set(degToRad(118), 0, 0);
          break;

        case "upwardDog":
          // Urdhva Mukha Svanasana - Thighs hovering, deep thoracic backbend
          targetPositions.pelvis.set(0, 0.38, 0);
          targetRotations.pelvis.set(degToRad(-25), 0, 0);
          targetRotations.spine.set(degToRad(-45), 0, 0);
          targetRotations.chest.set(degToRad(-35), 0, 0);
          targetRotations.head.set(degToRad(-35), 0, 0);
          targetRotations.leftArm.set(degToRad(85), 0, degToRad(15));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(85), 0, degToRad(-15));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(-18), 0, degToRad(-5));
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(degToRad(-18), 0, degToRad(5));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "cobra":
          targetPositions.pelvis.set(0, 0.22, 0);
          targetRotations.pelvis.set(degToRad(-20), 0, 0);
          targetRotations.spine.set(degToRad(-35), 0, 0);
          targetRotations.chest.set(degToRad(-25), 0, 0);
          targetRotations.head.set(degToRad(-25), 0, 0);
          targetRotations.leftArm.set(degToRad(35), 0, degToRad(20));
          targetRotations.leftForearm.set(degToRad(-75), 0, 0);
          targetRotations.rightArm.set(degToRad(35), 0, degToRad(-20));
          targetRotations.rightForearm.set(degToRad(-75), 0, 0);
          targetRotations.leftLeg.set(degToRad(-10), 0, 0);
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(degToRad(-10), 0, 0);
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "childPose":
          targetPositions.pelvis.set(0, 0.28, -0.3);
          targetRotations.pelvis.set(degToRad(95), 0, 0);
          targetRotations.spine.set(degToRad(20), 0, 0);
          targetRotations.chest.set(degToRad(15), 0, 0);
          targetRotations.head.set(degToRad(40), 0, 0);
          targetRotations.leftArm.set(degToRad(-165), 0, degToRad(15));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(-165), 0, degToRad(-15));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(120), 0, degToRad(-10));
          targetRotations.leftShin.set(degToRad(135), 0, 0);
          targetRotations.rightLeg.set(degToRad(120), 0, degToRad(10));
          targetRotations.rightShin.set(degToRad(135), 0, 0);
          break;

        case "chair":
        case "chairPose":
          // Utkatasana - Deep Squat with High Reach
          targetPositions.pelvis.set(0, 0.72, -0.22);
          targetRotations.pelvis.set(degToRad(30), 0, 0);
          targetRotations.spine.set(degToRad(-20), 0, 0);
          targetRotations.chest.set(degToRad(-15), 0, 0);
          targetRotations.head.set(degToRad(-15), 0, 0);
          targetRotations.leftArm.set(degToRad(-145), 0, degToRad(12));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(-145), 0, degToRad(-12));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(75), 0, degToRad(-3));
          targetRotations.leftShin.set(degToRad(85), 0, 0);
          targetRotations.rightLeg.set(degToRad(75), 0, degToRad(3));
          targetRotations.rightShin.set(degToRad(85), 0, 0);
          break;

        case "triangle":
          targetPositions.pelvis.set(0, 0.9, 0);
          targetRotations.pelvis.set(0, degToRad(70), degToRad(-20));
          targetRotations.spine.set(0, 0, degToRad(-35));
          targetRotations.chest.set(0, 0, degToRad(-15));
          targetRotations.head.set(degToRad(-30), degToRad(45), 0);
          targetRotations.leftArm.set(0, 0, degToRad(75));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(0, 0, degToRad(-105));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(30), degToRad(15), degToRad(-15));
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(degToRad(-15), degToRad(-15), degToRad(25));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "sideAngle":
          // Extended Side Angle (Utthita Parsvakonasana)
          targetPositions.pelvis.set(0, 0.74, 0);
          targetRotations.pelvis.set(0, degToRad(75), degToRad(-15));
          targetRotations.spine.set(0, 0, degToRad(-32));
          targetRotations.chest.set(0, 0, degToRad(-10));
          targetRotations.head.set(degToRad(-20), degToRad(40), 0);
          // Grounding or resting bottom arm
          targetRotations.leftArm.set(degToRad(55), 0, degToRad(30));
          targetRotations.leftForearm.set(degToRad(-45), 0, 0);
          // Overhead reaching top arm forming unbroken diagonal
          targetRotations.rightArm.set(degToRad(-160), 0, degToRad(-35));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(85), degToRad(25), degToRad(-15));
          targetRotations.leftShin.set(degToRad(90), 0, 0);
          targetRotations.rightLeg.set(degToRad(-25), 0, degToRad(20));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "crow":
        case "crowPose":
          // Pro-Level Bakasana (Crow Arm Balance)
          targetPositions.pelvis.set(0, 0.52, 0);
          targetRotations.pelvis.set(degToRad(85), 0, 0);
          targetRotations.spine.set(degToRad(25), 0, 0);
          targetRotations.chest.set(degToRad(15), 0, 0);
          targetRotations.head.set(degToRad(-35), 0, 0);
          // Hands grounded on floor, elbows supporting knees
          targetRotations.leftArm.set(degToRad(65), 0, degToRad(15));
          targetRotations.leftForearm.set(degToRad(-75), 0, 0);
          targetRotations.rightArm.set(degToRad(65), 0, degToRad(-15));
          targetRotations.rightForearm.set(degToRad(-75), 0, 0);
          // Knees tucked onto triceps, feet lifted
          targetRotations.leftLeg.set(degToRad(110), 0, degToRad(-15));
          targetRotations.leftShin.set(degToRad(125), 0, 0);
          targetRotations.rightLeg.set(degToRad(110), 0, degToRad(15));
          targetRotations.rightShin.set(degToRad(125), 0, 0);
          break;

        case "sidePlank":
          // Vasisthasana (Side Plank Balance)
          targetPositions.pelvis.set(0, 0.55, 0);
          targetRotations.pelvis.set(0, degToRad(85), degToRad(-35));
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(degToRad(-15), degToRad(65), 0);
          // Bottom support arm
          targetRotations.leftArm.set(degToRad(85), 0, degToRad(10));
          targetRotations.leftForearm.set(0, 0, 0);
          // Top vertical arm
          targetRotations.rightArm.set(degToRad(-85), 0, degToRad(-15));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(0, 0, 0);
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(0, 0, 0);
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "halfMoon":
          // Ardha Chandrasana (Half Moon)
          targetPositions.pelvis.set(0, 0.95, 0);
          targetRotations.pelvis.set(degToRad(75), degToRad(75), 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(degToRad(-15), degToRad(60), 0);
          // Bottom hand touching ground
          targetRotations.leftArm.set(degToRad(85), 0, degToRad(15));
          targetRotations.leftForearm.set(0, 0, 0);
          // Top arm pointing skyward
          targetRotations.rightArm.set(degToRad(-85), 0, degToRad(-15));
          targetRotations.rightForearm.set(0, 0, 0);
          // Standing leg
          targetRotations.leftLeg.set(degToRad(75), 0, 0);
          targetRotations.leftShin.set(0, 0, 0);
          // Lifted horizontal leg
          targetRotations.rightLeg.set(degToRad(-15), 0, degToRad(10));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "boat":
          // Navasana (Boat Pose V-Balance)
          targetPositions.pelvis.set(0, 0.28, 0);
          targetRotations.pelvis.set(degToRad(-45), 0, 0);
          targetRotations.spine.set(degToRad(-10), 0, 0);
          targetRotations.chest.set(degToRad(-10), 0, 0);
          targetRotations.head.set(degToRad(15), 0, 0);
          // Arms reaching forward parallel
          targetRotations.leftArm.set(degToRad(-45), 0, degToRad(12));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(-45), 0, degToRad(-12));
          targetRotations.rightForearm.set(0, 0, 0);
          // Elevated legs at 45 degrees
          targetRotations.leftLeg.set(degToRad(90), 0, degToRad(-4));
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(degToRad(90), 0, degToRad(4));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "savasana":
          // Savasana (Corpse Pose)
          targetPositions.pelvis.set(0, 0.15, 0);
          targetRotations.pelvis.set(degToRad(-90), 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, 0, 0);
          targetRotations.leftArm.set(0, 0, degToRad(32));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(0, 0, degToRad(-32));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(0, 0, degToRad(-15));
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(0, 0, degToRad(15));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "headstand":
          // Sirsasana (Supported Headstand)
          targetPositions.pelvis.set(0, 1.35, 0);
          targetRotations.pelvis.set(degToRad(180), 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, 0, 0);
          // Forearms forming triangular basket
          targetRotations.leftArm.set(degToRad(75), degToRad(25), degToRad(15));
          targetRotations.leftForearm.set(degToRad(-90), 0, 0);
          targetRotations.rightArm.set(degToRad(75), degToRad(-25), degToRad(-15));
          targetRotations.rightForearm.set(degToRad(-90), 0, 0);
          targetRotations.leftLeg.set(0, 0, 0);
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(0, 0, 0);
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "shoulderStand":
          // Sarvangasana (Shoulderstand)
          targetPositions.pelvis.set(0, 0.95, 0);
          targetRotations.pelvis.set(degToRad(-180), 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(degToRad(25), 0, 0);
          // Hands supporting lumbar spine
          targetRotations.leftArm.set(degToRad(15), 0, degToRad(15));
          targetRotations.leftForearm.set(degToRad(-90), 0, 0);
          targetRotations.rightArm.set(degToRad(15), 0, degToRad(-15));
          targetRotations.rightForearm.set(degToRad(-90), 0, 0);
          targetRotations.leftLeg.set(0, 0, 0);
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(0, 0, 0);
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "butterfly":
          // Baddha Konasana (Bound Angle / Butterfly)
          targetPositions.pelvis.set(0, 0.25, 0);
          targetRotations.pelvis.set(degToRad(10), 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, 0, 0);
          targetRotations.leftArm.set(degToRad(35), 0, degToRad(18));
          targetRotations.leftForearm.set(degToRad(-45), 0, 0);
          targetRotations.rightArm.set(degToRad(35), 0, degToRad(-18));
          targetRotations.rightForearm.set(degToRad(-45), 0, 0);
          // Open abducted knees with feet touching
          targetRotations.leftLeg.set(degToRad(75), degToRad(65), degToRad(-35));
          targetRotations.leftShin.set(degToRad(120), 0, 0);
          targetRotations.rightLeg.set(degToRad(75), degToRad(-65), degToRad(35));
          targetRotations.rightShin.set(degToRad(120), 0, 0);
          break;

        case "seatedTwist":
          // Ardha Matsyendrasana (Half Lord of the Fishes Twist)
          targetPositions.pelvis.set(0, 0.25, 0);
          targetRotations.pelvis.set(0, degToRad(35), 0);
          targetRotations.spine.set(0, degToRad(45), 0);
          targetRotations.chest.set(0, degToRad(35), 0);
          targetRotations.head.set(0, degToRad(55), 0);
          // Left arm hooking over right knee
          targetRotations.leftArm.set(degToRad(45), degToRad(35), degToRad(15));
          targetRotations.leftForearm.set(degToRad(-85), 0, 0);
          // Right arm supporting behind
          targetRotations.rightArm.set(degToRad(-35), 0, degToRad(-25));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(85), degToRad(45), degToRad(-25));
          targetRotations.leftShin.set(degToRad(110), 0, 0);
          targetRotations.rightLeg.set(degToRad(95), 0, degToRad(10));
          targetRotations.rightShin.set(degToRad(100), 0, 0);
          break;

        case "eagle":
          // Garudasana (Eagle Pose)
          targetPositions.pelvis.set(0, 0.85, 0);
          targetRotations.pelvis.set(degToRad(25), 0, 0);
          targetRotations.spine.set(degToRad(-15), 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, 0, 0);
          // Entwined Eagle arms
          targetRotations.leftArm.set(degToRad(65), degToRad(25), degToRad(-15));
          targetRotations.leftForearm.set(degToRad(-95), degToRad(-45), 0);
          targetRotations.rightArm.set(degToRad(65), degToRad(-25), degToRad(15));
          targetRotations.rightForearm.set(degToRad(-95), degToRad(45), 0);
          // Wrapped legs
          targetRotations.leftLeg.set(degToRad(55), 0, 0);
          targetRotations.leftShin.set(degToRad(65), 0, 0);
          targetRotations.rightLeg.set(degToRad(75), degToRad(20), degToRad(-15));
          targetRotations.rightShin.set(degToRad(85), 0, 0);
          break;

        case "malasana":
        case "goddess":
          // Malasana / Goddess Wide Squat
          targetPositions.pelvis.set(0, 0.42, 0);
          targetRotations.pelvis.set(0, 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, 0, 0);
          // Prayer arms pressing knees open
          targetRotations.leftArm.set(degToRad(35), degToRad(25), degToRad(-15));
          targetRotations.leftForearm.set(degToRad(-95), degToRad(30), degToRad(15));
          targetRotations.rightArm.set(degToRad(35), degToRad(-25), degToRad(15));
          targetRotations.rightForearm.set(degToRad(-95), degToRad(-30), degToRad(-15));
          targetRotations.leftLeg.set(degToRad(95), degToRad(45), degToRad(-35));
          targetRotations.leftShin.set(degToRad(125), 0, 0);
          targetRotations.rightLeg.set(degToRad(95), degToRad(-45), degToRad(35));
          targetRotations.rightShin.set(degToRad(125), 0, 0);
          break;

        case "chaturanga":
          // Four-Limbed Staff Pose (Chaturanga Dandasana)
          targetPositions.pelvis.set(0, 0.28, 0);
          targetRotations.pelvis.set(0, 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(degToRad(-10), 0, 0);
          // 90-degree right angle elbows tucked along ribs
          targetRotations.leftArm.set(degToRad(15), 0, degToRad(10));
          targetRotations.leftForearm.set(degToRad(-90), 0, 0);
          targetRotations.rightArm.set(degToRad(15), 0, degToRad(-10));
          targetRotations.rightForearm.set(degToRad(-90), 0, 0);
          targetRotations.leftLeg.set(0, 0, degToRad(-3));
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(0, 0, degToRad(3));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "fishPose":
          // Matsyasana (Fish Pose)
          targetPositions.pelvis.set(0, 0.18, 0);
          targetRotations.pelvis.set(degToRad(-90), 0, 0);
          targetRotations.spine.set(degToRad(-35), 0, 0);
          targetRotations.chest.set(degToRad(-30), 0, 0);
          targetRotations.head.set(degToRad(-45), 0, 0);
          targetRotations.leftArm.set(degToRad(15), 0, degToRad(15));
          targetRotations.leftForearm.set(degToRad(-65), 0, 0);
          targetRotations.rightArm.set(degToRad(15), 0, degToRad(-15));
          targetRotations.rightForearm.set(degToRad(-65), 0, 0);
          targetRotations.leftLeg.set(0, 0, degToRad(-4));
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(0, 0, degToRad(4));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "catCow":
          targetPositions.pelvis.set(0, 0.48, 0);
          targetRotations.pelvis.set(degToRad(15), 0, 0);
          targetRotations.spine.set(degToRad(activeDepth > 0.5 ? -25 : 25), 0, 0);
          targetRotations.chest.set(degToRad(activeDepth > 0.5 ? -20 : 20), 0, 0);
          targetRotations.head.set(degToRad(activeDepth > 0.5 ? -30 : 30), 0, 0);
          targetRotations.leftArm.set(degToRad(85), 0, degToRad(10));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(85), 0, degToRad(-10));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(90), 0, degToRad(-8));
          targetRotations.leftShin.set(degToRad(90), 0, 0);
          targetRotations.rightLeg.set(degToRad(90), 0, degToRad(8));
          targetRotations.rightShin.set(degToRad(90), 0, 0);
          break;

        case "twistedLizard":
          // Realistic Twisted Lizard / Dragon Quad Stretch matching user reference
          targetPositions.pelvis.set(0, 0.38, 0);
          targetRotations.pelvis.set(degToRad(15), degToRad(35), 0);
          targetRotations.spine.set(degToRad(-15), degToRad(45), degToRad(10));
          targetRotations.chest.set(degToRad(-20), degToRad(30), 0);
          targetRotations.head.set(degToRad(-25), degToRad(40), 0);
          // Grounding right forearm on floor / block
          targetRotations.leftArm.set(degToRad(75), degToRad(15), degToRad(20));
          targetRotations.leftForearm.set(degToRad(-90), 0, 0);
          // Reaching back right arm grasping the back right foot
          targetRotations.rightArm.set(degToRad(-45), degToRad(-35), degToRad(-35));
          targetRotations.rightForearm.set(degToRad(-75), 0, 0);
          // Front leg deep lunge
          targetRotations.leftLeg.set(degToRad(95), degToRad(25), degToRad(-15));
          targetRotations.leftShin.set(degToRad(90), 0, 0);
          // Back leg extended on mat with knee bent upward toward hand
          targetRotations.rightLeg.set(degToRad(-40), degToRad(-10), degToRad(10));
          targetRotations.rightShin.set(degToRad(115), 0, 0);
          break;

        case "dancerPose":
          // Standing Natarajasana Balance & Backbend
          targetPositions.pelvis.set(0, 1.05, 0);
          targetRotations.pelvis.set(degToRad(25), 0, 0);
          targetRotations.spine.set(degToRad(-30), 0, 0);
          targetRotations.chest.set(degToRad(-25), 0, 0);
          targetRotations.head.set(degToRad(-15), 0, 0);
          // Left arm reaching skyward forward
          targetRotations.leftArm.set(degToRad(-170), 0, degToRad(10));
          targetRotations.leftForearm.set(0, 0, 0);
          // Right arm grasping back foot
          targetRotations.rightArm.set(degToRad(-55), 0, degToRad(-25));
          targetRotations.rightForearm.set(degToRad(-60), 0, 0);
          // Standing left leg
          targetRotations.leftLeg.set(degToRad(2), 0, 0);
          targetRotations.leftShin.set(0, 0, 0);
          // Lifted right leg kicking into back hand
          targetRotations.rightLeg.set(degToRad(-85), 0, degToRad(10));
          targetRotations.rightShin.set(degToRad(125), 0, 0);
          break;

        case "camelPose":
          // Kneeling Ustrasana Backbend
          targetPositions.pelvis.set(0, 0.58, 0);
          targetRotations.pelvis.set(degToRad(-15), 0, 0);
          targetRotations.spine.set(degToRad(-45), 0, 0);
          targetRotations.chest.set(degToRad(-35), 0, 0);
          targetRotations.head.set(degToRad(-35), 0, 0);
          // Arms reaching back to heels
          targetRotations.leftArm.set(degToRad(-65), 0, degToRad(20));
          targetRotations.leftForearm.set(degToRad(-15), 0, 0);
          targetRotations.rightArm.set(degToRad(-65), 0, degToRad(-20));
          targetRotations.rightForearm.set(degToRad(-15), 0, 0);
          // Knees on floor
          targetRotations.leftLeg.set(degToRad(-15), 0, degToRad(-4));
          targetRotations.leftShin.set(degToRad(90), 0, 0);
          targetRotations.rightLeg.set(degToRad(-15), 0, degToRad(4));
          targetRotations.rightShin.set(degToRad(90), 0, 0);
          break;

        case "wheelPose":
          // Chakrasana / Full Wheel
          targetPositions.pelvis.set(0, 0.52, 0);
          targetRotations.pelvis.set(0, 0, 0);
          targetRotations.spine.set(degToRad(-65), 0, 0);
          targetRotations.chest.set(degToRad(-50), 0, 0);
          targetRotations.head.set(degToRad(-45), 0, 0);
          targetRotations.leftArm.set(degToRad(-165), 0, degToRad(15));
          targetRotations.leftForearm.set(degToRad(-25), 0, 0);
          targetRotations.rightArm.set(degToRad(-165), 0, degToRad(-15));
          targetRotations.rightForearm.set(degToRad(-25), 0, 0);
          targetRotations.leftLeg.set(degToRad(-35), 0, degToRad(-8));
          targetRotations.leftShin.set(degToRad(85), 0, 0);
          targetRotations.rightLeg.set(degToRad(-35), 0, degToRad(8));
          targetRotations.rightShin.set(degToRad(85), 0, 0);
          break;

        case "pigeon":
        case "pigeonPose":
          // Half Pigeon
          targetPositions.pelvis.set(0, 0.32, 0);
          targetRotations.pelvis.set(degToRad(10), 0, 0);
          targetRotations.spine.set(degToRad(-20), 0, 0);
          targetRotations.chest.set(degToRad(-15), 0, 0);
          targetRotations.head.set(degToRad(-15), 0, 0);
          targetRotations.leftArm.set(degToRad(45), 0, degToRad(25));
          targetRotations.leftForearm.set(degToRad(-25), 0, 0);
          targetRotations.rightArm.set(degToRad(45), 0, degToRad(-25));
          targetRotations.rightForearm.set(degToRad(-25), 0, 0);
          // Front folded shin
          targetRotations.leftLeg.set(degToRad(85), degToRad(45), degToRad(-25));
          targetRotations.leftShin.set(degToRad(90), 0, 0);
          // Back leg extended straight behind
          targetRotations.rightLeg.set(degToRad(-15), 0, 0);
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "seatedForwardFold":
          // Paschimottanasana
          targetPositions.pelvis.set(0, 0.25, 0);
          targetRotations.pelvis.set(degToRad(85), 0, 0);
          targetRotations.spine.set(degToRad(15), 0, 0);
          targetRotations.chest.set(degToRad(10), 0, 0);
          targetRotations.head.set(degToRad(25), 0, 0);
          targetRotations.leftArm.set(degToRad(85), 0, degToRad(10));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(85), 0, degToRad(-10));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(90), 0, degToRad(-4));
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(degToRad(90), 0, degToRad(4));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "bridge":
        case "bridgePose":
          // Setu Bandhasana
          targetPositions.pelvis.set(0, 0.42, 0);
          targetRotations.pelvis.set(degToRad(-35), 0, 0);
          targetRotations.spine.set(degToRad(-25), 0, 0);
          targetRotations.chest.set(degToRad(-20), 0, 0);
          targetRotations.head.set(degToRad(15), 0, 0);
          targetRotations.leftArm.set(degToRad(10), 0, degToRad(15));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(10), 0, degToRad(-15));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(-45), 0, degToRad(-6));
          targetRotations.leftShin.set(degToRad(90), 0, 0);
          targetRotations.rightLeg.set(degToRad(-45), 0, degToRad(6));
          targetRotations.rightShin.set(degToRad(90), 0, 0);
          break;

        case "plank":
          targetPositions.pelvis.set(0, 0.45, 0);
          targetRotations.pelvis.set(0, 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, 0, 0);
          targetRotations.leftArm.set(degToRad(85), 0, degToRad(10));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(degToRad(85), 0, degToRad(-10));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(0, 0, degToRad(-4));
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(0, 0, degToRad(4));
          targetRotations.rightShin.set(0, 0, 0);
          break;

        case "legsUpWall":
          targetPositions.pelvis.set(0, 0.22, 0);
          targetRotations.pelvis.set(degToRad(-90), 0, 0);
          targetRotations.spine.set(0, 0, 0);
          targetRotations.chest.set(0, 0, 0);
          targetRotations.head.set(0, 0, 0);
          targetRotations.leftArm.set(0, 0, degToRad(45));
          targetRotations.leftForearm.set(0, 0, 0);
          targetRotations.rightArm.set(0, 0, degToRad(-45));
          targetRotations.rightForearm.set(0, 0, 0);
          targetRotations.leftLeg.set(degToRad(90), 0, 0);
          targetRotations.leftShin.set(0, 0, 0);
          targetRotations.rightLeg.set(degToRad(90), 0, 0);
          targetRotations.rightShin.set(0, 0, 0);
          break;

        default:
          // Standard kinematics fallback using raw angles
          targetPositions.pelvis.set(0, 1.05 - (k.elevationY || 0) * 0.5, 0);
          targetRotations.pelvis.set(degToRad(k.torsoAngle * 0.5), 0, 0);
          targetRotations.spine.set(degToRad(k.torsoAngle * 0.5 + (k.spineCurve || 0) * 30), 0, 0);
          targetRotations.chest.set(degToRad((k.spineCurve || 0) * 20), 0, 0);
          targetRotations.head.set(degToRad(k.headTilt || 0), 0, 0);
          targetRotations.leftArm.set(degToRad(-k.leftShoulderAngle), 0, degToRad(15));
          targetRotations.leftForearm.set(degToRad(-k.leftElbowAngle), 0, 0);
          targetRotations.rightArm.set(degToRad(-k.rightShoulderAngle), 0, degToRad(-15));
          targetRotations.rightForearm.set(degToRad(-k.rightElbowAngle), 0, 0);
          targetRotations.leftLeg.set(degToRad(k.leftHipAngle), 0, degToRad(-5));
          targetRotations.leftShin.set(degToRad(k.leftKneeAngle), 0, 0);
          targetRotations.rightLeg.set(degToRad(k.rightHipAngle), 0, degToRad(5));
          targetRotations.rightShin.set(degToRad(k.rightKneeAngle), 0, 0);
          break;
      }
    }
  }, [pose, suryaStep, activeDepth]);

  // Handle Preset Camera Angles
  const setCameraAngle = (view: "threeQuarter" | "side" | "front" | "top") => {
    setCameraView(view);
    if (!threeState.current) return;
    const { spherical } = threeState.current;

    switch (view) {
      case "front":
        spherical.theta = 0;
        spherical.phi = Math.PI / 2.3;
        spherical.radius = 6.2;
        break;
      case "side":
        spherical.theta = Math.PI / 2;
        spherical.phi = Math.PI / 2.3;
        spherical.radius = 6.2;
        break;
      case "top":
        spherical.theta = 0;
        spherical.phi = 0.2;
        spherical.radius = 7.5;
        break;
      case "threeQuarter":
      default:
        spherical.theta = Math.PI / 4;
        spherical.phi = Math.PI / 2.6;
        spherical.radius = 6.8;
        break;
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    if (!threeState.current) return;
    const { spherical } = threeState.current;
    if (direction === "in") {
      spherical.radius = Math.max(3.2, spherical.radius - 0.9);
    } else {
      spherical.radius = Math.min(11, spherical.radius + 0.9);
    }
  };

  const handleResetCamera = () => {
    setIsAutoRotate(false);
    setCameraAngle("threeQuarter");
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-[#FBF9F5] border border-[#E4DCD0] shadow-sm select-none ${className}`}
      style={{ height }}
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Floating 3D Control Bar (Top Left) */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 bg-[#FFFFFF]/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-[#E5DDD0] shadow-xs text-xs z-10">
        <div className="flex items-center gap-1.5 font-medium text-[#263328] pr-1.5 border-r border-[#E2DAD0]">
          <User className="w-3.5 h-3.5 text-[#4E6548]" />
          <span className="font-semibold text-[11px] sm:text-xs">Male Yogi (3D)</span>
        </div>

        {/* View Angle Presets */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setCameraAngle("threeQuarter")}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              cameraView === "threeQuarter" ? "bg-[#5A6D56] text-white" : "text-[#556457] hover:bg-[#EDE5D8]"
            }`}
          >
            3/4
          </button>
          <button
            onClick={() => setCameraAngle("side")}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              cameraView === "side" ? "bg-[#5A6D56] text-white" : "text-[#556457] hover:bg-[#EDE5D8]"
            }`}
          >
            Side
          </button>
          <button
            onClick={() => setCameraAngle("front")}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              cameraView === "front" ? "bg-[#5A6D56] text-white" : "text-[#556457] hover:bg-[#EDE5D8]"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setCameraAngle("top")}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              cameraView === "top" ? "bg-[#5A6D56] text-white" : "text-[#556457] hover:bg-[#EDE5D8]"
            }`}
          >
            Top
          </button>
        </div>

        {/* Auto Rotate Toggle */}
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 border-l border-[#E2DAD0] pl-1.5 ${
            isAutoRotate ? "bg-[#D48B70] text-white" : "text-[#556457] hover:bg-[#EDE5D8]"
          }`}
          title="Toggle 360° auto rotation"
        >
          <span>360°</span>
        </button>

        {/* Avatar Appearance Customizer Button */}
        <button
          onClick={() => setShowCustomizeDrawer(!showCustomizeDrawer)}
          className={`px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1 border-l border-[#E2DAD0] pl-1.5 ${
            showCustomizeDrawer ? "bg-[#334235] text-white" : "text-[#4E6548] hover:bg-[#EDE5D8]"
          }`}
          title="Customize Male Yogi Appearance"
        >
          <Palette className="w-3 h-3" />
          <span>Customize</span>
        </button>
      </div>

      {/* Floating Zoom & Reset (Top Right) */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#FFFFFF]/90 backdrop-blur-md p-1 rounded-xl border border-[#E5DDD0] shadow-xs z-10">
        <button
          onClick={() => handleZoom("in")}
          className="p-1.5 rounded-lg text-[#556457] hover:bg-[#EDE5D8] transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="p-1.5 rounded-lg text-[#556457] hover:bg-[#EDE5D8] transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded-lg text-[#556457] hover:bg-[#EDE5D8] transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Male Yogi Appearance Customizer Popover Drawer */}
      {showCustomizeDrawer && (
        <div className="absolute top-14 left-3 bg-[#FFFFFF]/95 backdrop-blur-md p-4 rounded-2xl border border-[#DDD3C2] shadow-lg z-20 w-72 space-y-3.5 text-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#EDE5D8] pb-2">
            <span className="font-semibold text-[#1A221C] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#4E6548]" />
              <span>Male Yogi Customization</span>
            </span>
            <button
              onClick={() => setShowCustomizeDrawer(false)}
              className="p-1 rounded-md text-[#78887B] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Top Style */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#5D6B60] uppercase tracking-wider block">
              Torso Style
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTopStyle("bare-torso")}
                className={`py-1.5 px-2 rounded-xl text-center font-medium transition-colors cursor-pointer border ${
                  activeTopStyle === "bare-torso"
                    ? "bg-[#4E6548] text-white border-[#4E6548]"
                    : "bg-[#F7F3EC] text-[#2C382F] border-[#E2DAD0] hover:bg-[#EBE2D4]"
                }`}
              >
                Bare Torso (Athletic)
              </button>
              <button
                type="button"
                onClick={() => setActiveTopStyle("fitted-tank")}
                className={`py-1.5 px-2 rounded-xl text-center font-medium transition-colors cursor-pointer border ${
                  activeTopStyle === "fitted-tank"
                    ? "bg-[#4E6548] text-white border-[#4E6548]"
                    : "bg-[#F7F3EC] text-[#2C382F] border-[#E2DAD0] hover:bg-[#EBE2D4]"
                }`}
              >
                Fitted Yogi Tank
              </button>
            </div>
          </div>

          {/* Skin Tone */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#5D6B60] uppercase tracking-wider block">
              Skin Tone
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: "golden-tan", label: "Golden", color: "#DDA57A" },
                { id: "deep-bronze", label: "Bronze", color: "#B07A56" },
                { id: "warm-sand", label: "Sand", color: "#E2B899" },
                { id: "olive-radiance", label: "Olive", color: "#C89B77" },
              ].map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setActiveSkinTone(tone.id as any)}
                  className={`py-1.5 px-1 rounded-xl text-center font-medium transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                    activeSkinTone === tone.id
                      ? "ring-2 ring-[#4E6548] border-[#4E6548] bg-[#F7F3EC]"
                      : "bg-[#F7F3EC] border-[#E2DAD0] hover:bg-[#EBE2D4]"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs block"
                    style={{ backgroundColor: tone.color }}
                  />
                  <span className="text-[10px] text-[#2C382F]">{tone.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shorts Color */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#5D6B60] uppercase tracking-wider block">
              Yoga Shorts Color
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: "slate-black", label: "Slate", color: "#1F2622" },
                { id: "forest-sage", label: "Sage", color: "#394B3C" },
                { id: "terracotta", label: "Rust", color: "#8D4A38" },
                { id: "ocean-navy", label: "Navy", color: "#223242" },
              ].map((shorts) => (
                <button
                  key={shorts.id}
                  type="button"
                  onClick={() => setActiveShortsColor(shorts.id as any)}
                  className={`py-1.5 px-1 rounded-xl text-center font-medium transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                    activeShortsColor === shorts.id
                      ? "ring-2 ring-[#4E6548] border-[#4E6548] bg-[#F7F3EC]"
                      : "bg-[#F7F3EC] border-[#E2DAD0] hover:bg-[#EBE2D4]"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs block"
                    style={{ backgroundColor: shorts.color }}
                  />
                  <span className="text-[10px] text-[#2C382F]">{shorts.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Material / Visual Mode Selector (Bottom Left) */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#FFFFFF]/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-[#E5DDD0] shadow-xs text-xs z-10">
        <span className="text-[11px] text-[#7A6E63] font-medium mr-1">Style:</span>
        <button
          onClick={() => setDisplayMode("skin")}
          className={`px-2 py-0.5 rounded-md transition-colors font-medium ${
            displayMode === "skin" ? "bg-[#495A46] text-white" : "text-[#4A5A4E] hover:bg-[#EDE5D8]"
          }`}
        >
          Real Skin
        </button>
        <button
          onClick={() => setDisplayMode("heatmap")}
          className={`px-2 py-0.5 rounded-md transition-colors font-medium flex items-center gap-1 ${
            displayMode === "heatmap" ? "bg-[#BF6F55] text-white" : "text-[#4A5A4E] hover:bg-[#EDE5D8]"
          }`}
        >
          <Activity className="w-3 h-3" />
          <span>Muscles</span>
        </button>
        <button
          onClick={() => setDisplayMode("clay")}
          className={`px-2 py-0.5 rounded-md transition-colors font-medium ${
            displayMode === "clay" ? "bg-[#6E645A] text-white" : "text-[#4A5A4E] hover:bg-[#EDE5D8]"
          }`}
        >
          Clay
        </button>
      </div>

      {/* Drag Hint & Active Pose Tag (Bottom Right) */}
      <div className="absolute bottom-3 right-3 bg-[#FFFFFF]/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#E5DDD0] text-[11px] text-[#6E7D6A] font-medium flex items-center gap-1.5 shadow-xs pointer-events-none z-10">
        <Wind className="w-3 h-3 text-[#5A6D56] animate-pulse" />
        <span>360° Drag • Scroll to zoom</span>
      </div>
    </div>
  );
};
