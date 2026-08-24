import React, { useState, useEffect } from "react";
import { YogaPose, MuscleGroup } from "../types";

interface AnimatedPoseFigureProps {
  poseId: string;
  poseName?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isPlaying?: boolean;
  speed?: number; // 0.5 to 2
  showBreathRhythm?: boolean;
  activeTab?: "animation" | "video";
}

export const AnimatedPoseFigure: React.FC<AnimatedPoseFigureProps> = ({
  poseId,
  poseName = "Yoga Exercise",
  className = "",
  size = "md",
  isPlaying = true,
  speed = 1,
  showBreathRhythm = true,
  activeTab = "animation",
}) => {
  const [frame, setFrame] = useState<number>(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 120);
    }, 1000 / (30 * speed));
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const phase: "inhale" | "exhale" = frame < 60 ? "inhale" : "exhale";

  // Normalized progress from 0 to 1 with smooth sine wave oscillation
  const t = Math.sin((frame / 120) * Math.PI * 2);
  const t01 = (t + 1) / 2; // 0 to 1 smooth loop

  // Dimensions
  const dim = {
    sm: { width: 140, height: 120, viewBox: "0 0 200 180" },
    md: { width: 280, height: 220, viewBox: "0 0 280 220" },
    lg: { width: 380, height: 280, viewBox: "0 0 340 260" },
    xl: { width: 480, height: 340, viewBox: "0 0 380 280" },
  }[size];

  // Character style colors (matching Leap Fitness / clean 2D vector style in screenshots)
  const skin = "#E5A885";
  const skinShadow = "#CF8F6C";
  const shirt = "#2A85FF"; // Bright blue top from screenshots
  const shirtShadow = "#1B6FD8";
  const shorts = "#1E232B"; // Dark slate shorts
  const shoes = "#2B313A";
  const floorMat = "#E8EDF5";
  const floorLine = "#D0D9E5";
  const highlight = "rgba(42, 133, 255, 0.15)";

  const normId = poseId.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Render pose-specific smooth vector limb movement
  const renderMovement = () => {
    // ==========================================
    // 1. DOWNWARD-FACING DOG (Adho Mukha Svanasana)
    // ==========================================
    if (normId.includes("downward") || normId.includes("adho") || normId.includes("dog") && !normId.includes("upward")) {
      const breathSpine = t01 * 6;
      return (
        <g transform="translate(140, 115)">
          {/* Mat */}
          <ellipse cx="0" cy="55" rx="85" ry="10" fill={floorMat} />
          <line x1="-75" y1="55" x2="75" y2="55" stroke={floorLine} strokeWidth="2" />

          {/* Hands rooted forward at (-55, 50) */}
          <ellipse cx="-55" cy="52" rx="6" ry="3" fill={skin} />
          {/* Feet rooted back at (55, 50) */}
          <ellipse cx="55" cy="52" rx="6" ry="3" fill={shoes} />

          {/* Inverted V apex at pelvis (0, -25 - breathSpine) */}
          {/* Arms from hands to shoulders (-20, -10 - breathSpine) */}
          <line x1="-55" y1="50" x2="-20" y2={-10 - breathSpine} stroke={skin} strokeWidth="9" strokeLinecap="round" />
          
          {/* Torso & Head */}
          <line x1="-20" y1={-10 - breathSpine} x2="0" y2={-25 - breathSpine} stroke={shirt} strokeWidth="18" strokeLinecap="round" />
          {/* Head hanging naturally between arms */}
          <circle cx="-25" cy={-4 - breathSpine} r="9.5" fill={skin} />
          <path d="M-30,-9 Q-24,-14 -20,-8 Z" fill="#2E241E" />

          {/* Pelvis & Shorts */}
          <circle cx="0" cy={-25 - breathSpine} r="12" fill={shorts} />

          {/* Legs from Pelvis to Feet */}
          {/* Left leg (front view) */}
          <line x1="0" y1={-25 - breathSpine} x2="28" y2={12 - breathSpine * 0.4} stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <line x1="28" y1={12 - breathSpine * 0.4} x2="55" y2="50" stroke={skin} strokeWidth="10" strokeLinecap="round" />

          {/* Subtle micro-pedal animation */}
          <circle cx="28" cy={12 - breathSpine * 0.4} r="5" fill={skinShadow} opacity="0.4" />
        </g>
      );
    }

    // ==========================================
    // 2. TREE POSE (Vrksasana)
    // ==========================================
    if (normId.includes("tree") || normId.includes("vrks") || normId.includes("vriksha")) {
      const sway = Math.sin((frame / 120) * Math.PI * 2) * 3;
      const breathLift = t01 * 5;
      return (
        <g transform={`translate(${140 + sway}, ${95 - breathLift})`}>
          {/* Mat */}
          <ellipse cx="0" cy={72 + breathLift} rx="60" ry="8" fill={floorMat} />
          
          {/* Standing Leg (Right - rooted) */}
          <line x1="0" y1="18" x2="0" y2={70 + breathLift} stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <circle cx="0" cy={72 + breathLift} r="6" fill={shoes} />

          {/* Bent Leg (Left) pressed into inner thigh */}
          <line x1="0" y1="18" x2="-28" y2="36" stroke={skin} strokeWidth="11" strokeLinecap="round" />
          <line x1="-28" y1="36" x2="-4" y2="40" stroke={skin} strokeWidth="10" strokeLinecap="round" />
          <circle cx="-4" cy="40" r="4.5" fill={shoes} />

          {/* Torso & Shorts */}
          <rect x="-12" y="10" width="24" height="20" rx="3" fill={shorts} />
          <path d="M-11,10 L-9,-25 L9,-25 L11,10 Z" fill={shirt} />

          {/* Head & Gaze */}
          <circle cx="0" cy="-35" r="10.5" fill={skin} />
          <path d="M-8,-41 Q0,-46 8,-41 Z" fill="#2E241E" />

          {/* Arms reaching overhead in Anjali Mudra prayer */}
          <path 
            d={`M-8,-22 L-16,${-44 - t01 * 4} L0,${-60 - t01 * 6} L16,${-44 - t01 * 4} L8,-22 Z`} 
            fill="none" 
            stroke={skin} 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="0" cy={-60 - t01 * 6} r="4.5" fill={shirt} />
        </g>
      );
    }

    // ==========================================
    // 3. WARRIOR I (Virabhadrasana I) & HIGH/LOW LUNGE
    // ==========================================
    if (normId.includes("warrior1") || normId.includes("warriori") || normId.includes("lunge") || normId.includes("anjaneya")) {
      const lungeDip = t01 * 6;
      return (
        <g transform={`translate(140, ${105 + lungeDip})`}>
          {/* Mat */}
          <ellipse cx="0" cy={68 - lungeDip} rx="85" ry="9" fill={floorMat} />

          {/* Back Leg (Right - anchored back at 45 deg or low lunge) */}
          <line x1="0" y1="12" x2="52" y2={64 - lungeDip} stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <circle cx="54" cy={66 - lungeDip} r="5.5" fill={shoes} />

          {/* Front Leg (Left - bent at 90 deg) */}
          <line x1="0" y1="12" x2="-38" y2="22" stroke={skin} strokeWidth="13" strokeLinecap="round" />
          <line x1="-38" y1="22" x2="-38" y2={64 - lungeDip} stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <circle cx="-38" cy={66 - lungeDip} r="6" fill={shoes} />

          {/* Shorts & Torso facing front-diagonal */}
          <rect x="-14" y="6" width="28" height="18" rx="3" fill={shorts} />
          <path d="M-12,8 L-9,-26 L9,-26 L12,8 Z" fill={shirt} />

          {/* Head looking slightly upward */}
          <circle cx="0" cy="-36" r="10.5" fill={skin} />
          <path d="M-8,-42 Q0,-47 8,-42 Z" fill="#2E241E" />

          {/* Both Arms reaching high overhead */}
          <line x1="-8" y1="-24" x2="-14" y2={-56 - t01 * 4} stroke={shirt} strokeWidth="8" strokeLinecap="round" />
          <line x1="-14" y1={-56 - t01 * 4} x2="-12" y2={-62 - t01 * 5} stroke={skin} strokeWidth="7" strokeLinecap="round" />
          
          <line x1="8" y1="-24" x2="14" y2={-56 - t01 * 4} stroke={shirt} strokeWidth="8" strokeLinecap="round" />
          <line x1="14" y1={-56 - t01 * 4} x2="12" y2={-62 - t01 * 5} stroke={skin} strokeWidth="7" strokeLinecap="round" />
        </g>
      );
    }

    // ==========================================
    // 4. WARRIOR II (Virabhadrasana II)
    // ==========================================
    if (normId.includes("warrior2") || normId.includes("warriorii") || normId.includes("warrior") && !normId.includes("warrior3")) {
      const breathDip = t01 * 7;
      return (
        <g transform={`translate(140, ${110 + breathDip})`}>
          {/* Mat */}
          <ellipse cx="0" cy={65 - breathDip} rx="85" ry="10" fill={floorMat} />
          
          {/* Back Leg (Straight) */}
          <line x1="0" y1="10" x2="52" y2={62 - breathDip} stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <circle cx="54" cy={64 - breathDip} r="5.5" fill={shoes} />

          {/* Front Leg (Bent at ~90 deg) */}
          <line x1="-4" y1="10" x2="-45" y2="20" stroke={skin} strokeWidth="13" strokeLinecap="round" />
          <line x1="-45" y1="20" x2="-45" y2={62 - breathDip} stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <circle cx="-45" cy={64 - breathDip} r="6" fill={shoes} />

          {/* Shorts & Torso */}
          <rect x="-14" y="4" width="28" height="18" rx="3" fill={shorts} />
          <path d="M-12,6 L-9,-28 L9,-28 L12,6 Z" fill={shirt} />

          {/* Head looking over front arm */}
          <circle cx="-4" cy="-38" r="10.5" fill={skin} />
          <path d="M-12,-44 Q-4,-49 4,-43 Z" fill="#2E241E" />

          {/* Extended Parallel Arms (Front & Back) */}
          {/* Back Arm */}
          <line x1="8" y1="-24" x2="58" y2="-24" stroke={shirt} strokeWidth="8" strokeLinecap="round" />
          <circle cx="60" cy="-24" r="4" fill={skin} />
          {/* Front Arm */}
          <line x1="-8" y1="-24" x2="-62" y2="-24" stroke={shirt} strokeWidth="9" strokeLinecap="round" />
          <circle cx="-64" cy="-24" r="4.5" fill={skin} />
        </g>
      );
    }

    // ==========================================
    // 5. WARRIOR III (Virabhadrasana III)
    // ==========================================
    if (normId.includes("warrior3") || normId.includes("warrioriii")) {
      const balanceSway = Math.sin((frame / 120) * Math.PI * 2) * 3;
      return (
        <g transform={`translate(140, 110)`}>
          <ellipse cx="-10" cy={65} rx="65" ry="8" fill={floorMat} />

          {/* Standing Leg (Left - rooted) */}
          <line x1="-10" y1="0" x2="-10" y2="62" stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <circle cx="-10" cy={64} r="6" fill={shoes} />

          {/* Torso & Pelvis forming horizontal 'T' */}
          <g transform={`rotate(${balanceSway}, -10, 0)`}>
            {/* Pelvis & Shorts */}
            <circle cx="-10" cy="0" r="13" fill={shorts} />

            {/* Lifted Back Leg extending horizontal right */}
            <line x1="-10" y1="0" x2="55" y2="0" stroke={skin} strokeWidth="11" strokeLinecap="round" />
            <circle cx="58" cy="0" r="5" fill={shoes} />

            {/* Torso extending horizontal left */}
            <line x1="-10" y1="0" x2="-45" y2="0" stroke={shirt} strokeWidth="18" strokeLinecap="round" />
            {/* Head */}
            <circle cx="-54" cy="0" r="9.5" fill={skin} />
            <path d="M-58,-5 Q-54,-10 -50,-4 Z" fill="#2E241E" />

            {/* Arms reaching forward left */}
            <line x1="-40" y1="0" x2="-75" y2="0" stroke={skin} strokeWidth="7" strokeLinecap="round" />
            <circle cx="-77" cy="0" r="3.5" fill={skin} />
          </g>
        </g>
      );
    }

    // ==========================================
    // 6. TRIANGLE POSE (Trikonasana)
    // ==========================================
    if (normId.includes("triangle") || normId.includes("trikon")) {
      const breathTilt = t01 * 4;
      return (
        <g transform="translate(140, 105)">
          <ellipse cx="0" cy={65} rx="85" ry="9" fill={floorMat} />
          
          {/* Back Leg (Straight, right) */}
          <line x1="0" y1="0" x2="48" y2="62" stroke={skin} strokeWidth="11" strokeLinecap="round" />
          <circle cx="50" cy={64} r="5.5" fill={shoes} />

          {/* Front Leg (Straight, left) */}
          <line x1="0" y1="0" x2="-45" y2="62" stroke={skin} strokeWidth="11" strokeLinecap="round" />
          <circle cx="-45" cy={64} r="5.5" fill={shoes} />

          {/* Pelvis & Shorts */}
          <ellipse cx="0" cy="0" rx="14" ry="9" fill={shorts} transform="rotate(25)" />

          {/* Torso tilted laterally to the left */}
          <g transform={`rotate(${30 + breathTilt}, 0, 0)`}>
            <path d="M-10,0 L-35,0 L-30,-22 L-5,-18 Z" fill={shirt} />
            
            {/* Head looking up */}
            <circle cx="-40" cy="-12" r="9.5" fill={skin} />
            
            {/* Bottom hand reaching to shin/mat */}
            <line x1="-30" y1="0" x2="-35" y2="48" stroke={skin} strokeWidth="8" strokeLinecap="round" />
            <circle cx="-35" cy="50" r="4" fill={skin} />

            {/* Top arm reaching vertical to sky */}
            <line x1="-20" y1="-20" x2="0" y2="-62" stroke={skin} strokeWidth="8" strokeLinecap="round" />
            <circle cx="0" cy="-64" r="4" fill={skin} />
          </g>
        </g>
      );
    }

    // ==========================================
    // 7. BOAT POSE (Navasana)
    // ==========================================
    if (normId.includes("boat") || normId.includes("nava") || normId.includes("crunch") || normId.includes("core") || normId.includes("abs")) {
      const corePulse = t01 * 6;
      return (
        <g transform="translate(140, 115)">
          <ellipse cx="0" cy={55} rx="80" ry="10" fill={floorMat} />

          {/* Balancing on Sit Bones */}
          <circle cx="0" cy={35} r="14" fill={shorts} />

          {/* Torso leaning back in 45 deg V */}
          <g transform={`rotate(${-corePulse}, 0, 35)`}>
            <path d="M0,35 L-28,5 L-18,-8 L8,24 Z" fill={shirt} />
            <circle cx="-32" cy="-2" r="10" fill={skin} />
            <path d="M-38,-8 Q-32,-14 -26,-6 Z" fill="#2E241E" />

            {/* Arms reaching parallel to floor */}
            <line x1="-16" y1="12" x2="25" y2="12" stroke={skin} strokeWidth="8" strokeLinecap="round" />
            <circle cx="28" cy="12" r="4" fill={skin} />
          </g>

          {/* Legs lifted straight in 45 deg V */}
          <g transform={`rotate(${corePulse}, 0, 35)`}>
            <line x1="0" y1="35" x2="35" y2="0" stroke={skin} strokeWidth="12" strokeLinecap="round" />
            <line x1="35" y1="0" x2="62" y2="-20" stroke={skin} strokeWidth="10" strokeLinecap="round" />
            <circle cx="65" cy="-22" r="5" fill={shoes} />
          </g>
        </g>
      );
    }

    // ==========================================
    // 8. CHILD'S POSE (Balasana)
    // ==========================================
    if (normId.includes("child") || normId.includes("bala") || normId.includes("rest")) {
      const breathSwell = t01 * 4;
      return (
        <g transform="translate(140, 125)">
          <ellipse cx="0" cy="45" rx="85" ry="10" fill={floorMat} />
          
          {/* Folded Knees and Lower Legs */}
          <line x1="45" y1="40" x2="10" y2="40" stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <circle cx="48" cy="40" r="5" fill={shoes} />
          <ellipse cx="25" cy="32" rx="16" ry="12" fill={shorts} />

          {/* Torso folded over thighs */}
          <g transform={`translate(0, ${-breathSwell})`}>
            <path d="M20,32 Q-5,16 -30,28 L-25,38 Q0,32 20,38 Z" fill={shirt} />
            {/* Forehead on mat */}
            <circle cx="-35" cy="34" r="9" fill={skin} />
            <path d="M-40,28 Q-34,24 -30,30 Z" fill="#2E241E" />

            {/* Arms extending long in front */}
            <line x1="-20" y1="30" x2="-65" y2="42" stroke={skin} strokeWidth="7" strokeLinecap="round" />
            <circle cx="-68" cy="42" r="4" fill={skin} />
          </g>
        </g>
      );
    }

    // ==========================================
    // 9. COBRA (Bhujangasana) & UPWARD-FACING DOG (Urdhva Mukha Svanasana)
    // ==========================================
    if (normId.includes("cobra") || normId.includes("bhujanga") || normId.includes("upward") || normId.includes("urdhva")) {
      const arch = t01 * 12;
      return (
        <g transform="translate(140, 125)">
          <ellipse cx="0" cy="45" rx="85" ry="10" fill={floorMat} />
          
          {/* Lower body on mat */}
          <line x1="50" y1="42" x2="-8" y2="40" stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <circle cx="54" cy="42" r="5" fill={shoes} />
          <ellipse cx="-8" cy="38" rx="14" ry="9" fill={shorts} />

          {/* Arching Spine & Chest */}
          <g transform={`rotate(${-arch}, -8, 40)`}>
            <path d="M-8,38 Q-28,18 -38,-16 L-22,-20 Q-14,14 2,38 Z" fill={shirt} />
            <circle cx="-42" cy="-25" r="10" fill={skin} />
            <path d="M-49,-31 Q-41,-37 -35,-29 Z" fill="#2E241E" />

            {/* Supporting Arms */}
            <line x1="-28" y1="-6" x2="-35" y2="38" stroke={skin} strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="-35" cy="40" rx="6" ry="3" fill={skin} />
          </g>
        </g>
      );
    }

    // ==========================================
    // 10. BRIDGE POSE (Setu Bandhasana)
    // ==========================================
    if (normId.includes("bridge") || normId.includes("setu")) {
      const hipDrive = t01 * 10;
      return (
        <g transform="translate(140, 120)">
          <ellipse cx="0" cy="50" rx="85" ry="10" fill={floorMat} />

          {/* Head & Shoulders on Mat */}
          <circle cx="-48" cy="42" r="9.5" fill={skin} />
          <line x1="-45" y1="42" x2="20" y2="42" stroke={skin} strokeWidth="8" strokeLinecap="round" />

          {/* Elevated Torso & Pelvis Bridge */}
          <g transform={`translate(0, ${-hipDrive})`}>
            <path d="M-40,42 L0,15 L14,16 L-30,42 Z" fill={shirt} />
            <ellipse cx="14" cy="18" rx="13" ry="10" fill={shorts} />

            {/* Thighs from Pelvis to Knees */}
            <line x1="14" y1="18" x2="45" y2="18" stroke={skin} strokeWidth="12" strokeLinecap="round" />
          </g>

          {/* Calves from Knees down to grounded Feet */}
          <line x1="45" y1={18 - hipDrive} x2="45" y2="48" stroke={skin} strokeWidth="11" strokeLinecap="round" />
          <circle cx="45" cy="48" r="6" fill={shoes} />
        </g>
      );
    }

    // ==========================================
    // 11. CHAIR POSE (Utkatasana) & SQUAT
    // ==========================================
    if (normId.includes("chair") || normId.includes("utkata") || normId.includes("squat") || normId.includes("wallsit")) {
      const squatY = t01 * 16;
      return (
        <g transform={`translate(140, ${100 + squatY})`}>
          <ellipse cx="0" cy={70 - squatY} rx="70" ry="10" fill={floorMat} />
          
          {/* Calves and Thighs in deep chair seat */}
          <line x1="-8" y1={42 - squatY * 0.3} x2="-12" y2={68 - squatY} stroke={skin} strokeWidth="11" strokeLinecap="round" />
          <line x1="8" y1={42 - squatY * 0.3} x2="12" y2={68 - squatY} stroke={skin} strokeWidth="11" strokeLinecap="round" />
          <circle cx="-12" cy={68 - squatY} r="5.5" fill={shoes} />
          <circle cx="12" cy={68 - squatY} r="5.5" fill={shoes} />

          {/* Thighs horizontal back to glutes */}
          <line x1="-8" y1={42 - squatY * 0.3} x2="18" y2={35 - squatY * 0.5} stroke={skin} strokeWidth="13" strokeLinecap="round" />
          <ellipse cx="18" cy={35 - squatY * 0.5} rx="14" ry="10" fill={shorts} />

          {/* Torso angled forward */}
          <path d="M18,32 L-10,0 L-2, -10 L25,24 Z" fill={shirt} />
          {/* Head */}
          <circle cx="-16" cy="-14" r="10" fill={skin} />
          <path d="M-22,-20 Q-16,-25 -10,-18 Z" fill="#2E241E" />

          {/* Arms reaching overhead in line with torso */}
          <line x1="-6" y1="-8" x2="-38" y2="-46" stroke={skin} strokeWidth="8" strokeLinecap="round" />
          <circle cx="-40" cy="-48" r="4" fill={skin} />
        </g>
      );
    }

    // ==========================================
    // 12. HALF PIGEON POSE (Eka Pada Rajakapotasana)
    // ==========================================
    if (normId.includes("pigeon") || normId.includes("kapota") || normId.includes("hip")) {
      const breathPigeon = t01 * 5;
      return (
        <g transform="translate(140, 120)">
          <ellipse cx="0" cy="48" rx="85" ry="10" fill={floorMat} />

          {/* Front Bent Leg across mat */}
          <ellipse cx="-20" cy="42" rx="22" ry="8" fill={skin} />
          {/* Back Extended Leg */}
          <line x1="-5" y1="40" x2="55" y2="44" stroke={skin} strokeWidth="11" strokeLinecap="round" />
          <circle cx="58" cy="44" r="5" fill={shoes} />

          {/* Pelvis & Torso Folded forward */}
          <ellipse cx="-15" cy="36" rx="14" ry="9" fill={shorts} />
          <g transform={`translate(0, ${-breathPigeon})`}>
            <path d="M-15,36 L-45,22 L-40,10 L-10,24 Z" fill={shirt} />
            <circle cx="-50" cy="18" r="9.5" fill={skin} />
            
            {/* Forearms supporting on floor */}
            <line x1="-38" y1="18" x2="-55" y2="44" stroke={skin} strokeWidth="8" strokeLinecap="round" />
            <circle cx="-58" cy="44" r="4" fill={skin} />
          </g>
        </g>
      );
    }

    // ==========================================
    // 13. SEATED FORWARD BEND (Paschimottanasana) & BUTTERFLY
    // ==========================================
    if (normId.includes("forward") || normId.includes("paschimo") || normId.includes("butterfly") || normId.includes("baddha")) {
      const foldDepth = t01 * 8;
      return (
        <g transform="translate(140, 120)">
          <ellipse cx="0" cy="50" rx="85" ry="10" fill={floorMat} />

          {/* Legs extended forward on mat */}
          <line x1="-20" y1="42" x2="50" y2="42" stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <circle cx="52" cy="38" r="5" fill={shoes} />

          {/* Pelvis on mat */}
          <ellipse cx="-20" cy="38" rx="13" ry="9" fill={shorts} />

          {/* Torso folded over legs */}
          <g transform={`rotate(${15 + foldDepth}, -20, 38)`}>
            <path d="M-20,38 L20,24 L18,12 L-18,26 Z" fill={shirt} />
            <circle cx="28" cy="16" r="9.5" fill={skin} />

            {/* Arms reaching to toes */}
            <line x1="12" y1="20" x2="48" y2="38" stroke={skin} strokeWidth="7" strokeLinecap="round" />
            <circle cx="50" cy="38" r="4" fill={skin} />
          </g>
        </g>
      );
    }

    // ==========================================
    // 14. CAMEL POSE (Ustrasana) & BACKBENDS
    // ==========================================
    if (normId.includes("camel") || normId.includes("ustra") || normId.includes("hasta")) {
      const camelArch = t01 * 8;
      return (
        <g transform="translate(140, 115)">
          <ellipse cx="0" cy="55" rx="75" ry="9" fill={floorMat} />

          {/* Kneeling Lower Legs on Mat */}
          <line x1="-15" y1="50" x2="25" y2="50" stroke={skin} strokeWidth="11" strokeLinecap="round" />
          <circle cx="28" cy="50" r="5" fill={shoes} />

          {/* Thighs vertical */}
          <line x1="-15" y1="50" x2="-15" y2="15" stroke={skin} strokeWidth="12" strokeLinecap="round" />
          <ellipse cx="-15" cy="15" rx="13" ry="9" fill={shorts} />

          {/* Spine arching back */}
          <g transform={`rotate(${camelArch}, -15, 15)`}>
            <path d="M-15,15 Q-5,0 12,-12 L22,-8 Q5,10 -15,20 Z" fill={shirt} />
            <circle cx="20" cy="-20" r="9.5" fill={skin} />
            <path d="M14,-26 Q22,-30 26,-22 Z" fill="#2E241E" />

            {/* Arm reaching back to heel */}
            <line x1="10" y1="-8" x2="25" y2="48" stroke={skin} strokeWidth="7" strokeLinecap="round" />
            <circle cx="25" cy="48" r="4" fill={skin} />
          </g>
        </g>
      );
    }

    // ==========================================
    // 15. DEFAULT: MOUNTAIN POSE (Tadasana) & PRANAYAMA BREATH FLOW
    // ==========================================
    const stretchY = t01 * 10;
    return (
      <g transform={`translate(140, ${105 - stretchY})`}>
        <ellipse cx="0" cy={70 + stretchY} rx="65" ry="9" fill={floorMat} />
        
        {/* Legs */}
        <line x1="-10" y1="18" x2="-12" y2={68 + stretchY} stroke={skin} strokeWidth="11" strokeLinecap="round" />
        <circle cx="-12" cy={70 + stretchY} r="5.5" fill={shoes} />
        <line x1="10" y1="18" x2="12" y2={68 + stretchY} stroke={skin} strokeWidth="11" strokeLinecap="round" />
        <circle cx="12" cy={70 + stretchY} r="5.5" fill={shoes} />

        {/* Torso & Shorts */}
        <rect x="-14" y="10" width="28" height="20" rx="3" fill={shorts} />
        <path d="M-12,12 L-10,-24 L10,-24 L12,12 Z" fill={shirt} />

        {/* Head */}
        <circle cx="0" cy="-35" r="10" fill={skin} />
        <path d="M-8,-40 Q0,-45 8,-40 Z" fill="#2E241E" />

        {/* Arms Reaching smoothly */}
        <line x1="-10" y1="-20" x2={-24 - t01 * 8} y2={-50 - stretchY} stroke={skin} strokeWidth="8" strokeLinecap="round" />
        <circle cx={-24 - t01 * 8} cy={-50 - stretchY} r="4" fill={skin} />
        <line x1="10" y1="-20" x2={24 + t01 * 8} y2={-50 - stretchY} stroke={skin} strokeWidth="8" strokeLinecap="round" />
        <circle cx={24 + t01 * 8} cy={-50 - stretchY} r="4" fill={skin} />
      </g>
    );
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Background Soft Studio Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-sky-50/60 via-slate-50/40 to-indigo-50/30 -z-10 border border-slate-100/80 shadow-inner" />

      {/* Breathing Guide Pill */}
      {showBreathRhythm && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-slate-200/70 text-[11px] font-semibold text-slate-700">
          <span className={`w-2 h-2 rounded-full ${phase === "inhale" ? "bg-emerald-500 animate-ping" : "bg-sky-500 animate-pulse"}`} />
          <span className="capitalize">{phase} • {Math.round(speed * 100)}%</span>
        </div>
      )}

      {/* SVG Canvas Animation */}
      <svg
        width={dim.width}
        height={dim.height}
        viewBox={dim.viewBox}
        className="w-full h-full max-h-[300px] object-contain drop-shadow-sm transition-all duration-300"
      >
        <defs>
          <radialGradient id="matGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="140" cy="190" rx="100" ry="18" fill="url(#matGlow)" />
        {renderMovement()}
      </svg>
    </div>
  );
};
