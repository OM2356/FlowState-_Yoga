import React, { useState, useEffect } from "react";
import { YogaPose, MuscleGroup } from "../types";
import { MUSCLE_GROUPS_INFO } from "../data/posesData";
import { Eye, Layers, Activity, Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface HumanYogaAvatarProps {
  pose: YogaPose;
  angle?: "front" | "side" | "threeQuarter" | "isometric";
  showMuscleHeatmap?: boolean;
  showAlignmentGuides?: boolean;
  showMistakesComparison?: boolean;
  depthLevel?: number; // 0 = gentle, 0.5 = standard, 1 = deep
  isBreathing?: boolean;
  breathPhase?: "inhale" | "hold-in" | "exhale" | "hold-out";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  interactiveControls?: boolean;
}

export const HumanYogaAvatar: React.FC<HumanYogaAvatarProps> = ({
  pose,
  angle: initialAngle = "side",
  showMuscleHeatmap: initialHeatmap = false,
  showAlignmentGuides: initialGuides = true,
  showMistakesComparison: initialMistakes = false,
  depthLevel = 0.5,
  isBreathing = true,
  breathPhase = "inhale",
  className = "",
  size = "lg",
  interactiveControls = false,
}) => {
  const [currentAngle, setCurrentAngle] = useState<"front" | "side" | "threeQuarter" | "isometric">(
    initialAngle || (pose.kinematics.facing === "front" ? "front" : "side")
  );
  const [heatmapActive, setHeatmapActive] = useState<boolean>(initialHeatmap);
  const [guidesActive, setGuidesActive] = useState<boolean>(initialGuides);
  const [mistakesActive, setMistakesActive] = useState<boolean>(initialMistakes);
  const [activeDepth, setActiveDepth] = useState<number>(depthLevel);
  const [breathScale, setBreathScale] = useState<number>(1);

  // Sync with prop changes if provided
  useEffect(() => {
    if (initialAngle) setCurrentAngle(initialAngle);
  }, [initialAngle]);

  useEffect(() => {
    setActiveDepth(depthLevel);
  }, [depthLevel]);

  // Breathing expansion simulation
  useEffect(() => {
    if (!isBreathing) {
      setBreathScale(1);
      return;
    }
    if (breathPhase === "inhale" || breathPhase === "hold-in") {
      setBreathScale(1.035);
    } else {
      setBreathScale(0.975);
    }
  }, [isBreathing, breathPhase]);

  const archetype = pose.kinematics.poseArchetype;

  // Sizing definitions
  const dimensions = {
    sm: { width: 220, height: 180 },
    md: { width: 340, height: 280 },
    lg: { width: 480, height: 380 },
    xl: { width: 620, height: 480 },
  }[size];

  // Skin tone & clothing styling
  const skinColor = "#E4B89A";
  const skinShadow = "#CA9B7D";
  const skinHighlight = "#F5D4BE";
  const apparelColor = "#37413B"; // deep slate moss
  const apparelAccent = "#5A6E5E";
  const apparelHighlight = "#4A5A4E";
  const muscleGlowColor = "#BF6F55"; // warm terracotta muscle glow

  const isMuscleActive = (muscle: MuscleGroup) => {
    return pose.primaryMuscles.includes(muscle) || pose.secondaryMuscles.includes(muscle);
  };

  // Render specific anatomical human figures based on pose archetype
  const renderHumanFigure = () => {
    // Dynamic adjustment modifiers based on depth slider
    const dMod = activeDepth; // 0 (gentle) to 1 (deep)

    switch (archetype) {
      case "tadasana":
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 260px" }}>
            {/* Mat floor */}
            <ellipse cx="240" cy="350" rx="140" ry="16" fill="#EDE6DA" />
            <line x1="120" y1="350" x2="360" y2="350" stroke="#D3C9B8" strokeWidth="2" strokeDasharray="4 4" />

            {/* Left Leg */}
            <path d="M 230 180 Q 228 240 227 290 Q 226 320 225 345 L 235 345 Q 237 310 238 270 Q 239 220 238 180 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <rect x="226" y="175" width="14" height="45" rx="4" fill={apparelColor} />

            {/* Right Leg */}
            <path d="M 242 180 Q 244 240 245 290 Q 246 320 247 345 L 257 345 Q 256 310 255 270 Q 254 220 252 180 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <rect x="242" y="175" width="14" height="45" rx="4" fill={apparelColor} />

            {/* Feet */}
            <path d="M 218 345 Q 228 342 236 345 Q 238 350 224 350 Z" fill={skinShadow} />
            <path d="M 246 345 Q 256 342 264 345 Q 266 350 252 350 Z" fill={skinShadow} />

            {/* Pelvis & Shorts */}
            <path d="M 222 165 Q 241 170 260 165 L 258 200 Q 241 205 224 200 Z" fill={apparelColor} stroke={apparelAccent} strokeWidth="1" />

            {/* Torso & Ribcage */}
            <path d="M 224 165 Q 220 120 226 95 Q 241 90 256 95 Q 262 120 258 165 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 226 95 Q 241 93 256 95 L 255 130 Q 241 135 227 130 Z" fill={apparelAccent} />

            {/* Clavicle & Neck */}
            <path d="M 235 95 Q 241 85 241 72 Q 247 85 247 95 Z" fill={skinColor} />
            <line x1="230" y1="95" x2="252" y2="95" stroke={skinShadow} strokeWidth="1.5" strokeLinecap="round" />

            {/* Head & Hair */}
            <ellipse cx="241" cy="55" rx="14" ry="18" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            {/* Top Knot Hair */}
            <ellipse cx="241" cy="38" rx="8" ry="7" fill="#3D2E26" />
            <path d="M 230 45 Q 241 40 252 45 Q 241 36 230 45 Z" fill="#3D2E26" />

            {/* Left Arm (Relaxed at side) */}
            <path d="M 224 95 Q 212 135 214 175 Q 214 205 215 225 L 221 225 Q 220 195 220 165 Q 223 130 228 98 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            {/* Right Arm */}
            <path d="M 258 95 Q 270 135 268 175 Q 268 205 267 225 L 261 225 Q 262 195 262 165 Q 259 130 254 98 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />

            {/* Muscle heatmap overlay */}
            {heatmapActive && (
              <g opacity="0.6">
                <rect x="227" y="210" width="11" height="50" rx="5" fill={muscleGlowColor} />
                <rect x="244" y="210" width="11" height="50" rx="5" fill={muscleGlowColor} />
                <ellipse cx="241" cy="145" rx="10" ry="15" fill={muscleGlowColor} />
              </g>
            )}

            {/* Alignment Guides */}
            {guidesActive && (
              <g opacity="0.85">
                <line x1="241" y1="20" x2="241" y2="350" stroke="#5A6D56" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="241" cy="55" r="3" fill="#5A6D56" />
                <circle cx="241" cy="165" r="3" fill="#5A6D56" />
                <circle cx="230" cy="290" r="3" fill="#5A6D56" />
                <circle cx="252" cy="290" r="3" fill="#5A6D56" />
              </g>
            )}
          </g>
        );

      case "downwardDog":
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 220px" }}>
            {/* Mat floor */}
            <line x1="60" y1="320" x2="420" y2="320" stroke="#CFC5B4" strokeWidth="3" />
            <ellipse cx="240" cy="320" rx="170" ry="8" fill="#EDE6DA" />

            {/* Hips Apex point: (240, 110 - dMod * 15) */}
            {/* Hands point: (110, 318), Feet point: (370, 318) */}

            {/* Back Legs (Hamstrings/Calves) */}
            <path
              d={`M 255 ${120 - dMod * 15} Q 310 200 355 270 Q 365 300 370 318 L 360 318 Q 352 295 340 260 Q 295 190 240 ${130 - dMod * 15} Z`}
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="1.2"
            />
            {/* Leg apparel */}
            <path
              d={`M 240 ${125 - dMod * 15} Q 280 160 300 190 L 315 180 Q 280 140 255 ${118 - dMod * 15} Z`}
              fill={apparelColor}
            />

            {/* Feet grounded */}
            <path d="M 355 318 Q 375 315 385 318 Q 380 322 355 322 Z" fill={skinShadow} />

            {/* Torso / Spine (Straight diagonal) */}
            <path
              d={`M 245 ${115 - dMod * 15} Q 200 170 160 215 L 145 205 Q 190 155 235 ${110 - dMod * 15} Z`}
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="1.2"
            />
            <path
              d={`M 245 ${115 - dMod * 15} Q 210 160 185 190 L 175 180 Q 205 145 235 ${110 - dMod * 15} Z`}
              fill={apparelAccent}
            />

            {/* Arms extending from shoulders (155, 210) to Hands (110, 318) */}
            <path
              d="M 155 210 Q 135 260 112 318 L 104 318 Q 124 255 145 205 Z"
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="1.2"
            />
            {/* Hand grounded */}
            <path d="M 98 318 Q 112 315 120 318 Q 118 322 98 322 Z" fill={skinShadow} />

            {/* Head hanging naturally between biceps */}
            <ellipse cx="140" cy="235" rx="13" ry="16" transform="rotate(45 140 235)" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="132" cy="245" rx="7" ry="7" fill="#3D2E26" />

            {/* Muscle heatmap */}
            {heatmapActive && (
              <g opacity="0.65">
                {/* Hamstrings & Calves glow */}
                <path d={`M 260 ${140 - dMod * 15} Q 310 210 350 280`} stroke={muscleGlowColor} strokeWidth="10" strokeLinecap="round" fill="none" />
                {/* Shoulders / Lats glow */}
                <path d="M 155 210 Q 135 260 115 310" stroke={muscleGlowColor} strokeWidth="8" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Alignment Guides */}
            {guidesActive && (
              <g opacity="0.9">
                {/* Spine vector line */}
                <line x1="108" y1="318" x2={`245`} y2={`${110 - dMod * 15}`} stroke="#5A6D56" strokeWidth="2" strokeDasharray="4 4" />
                {/* Leg vector line */}
                <line x1="370" y1="318" x2={`245`} y2={`${110 - dMod * 15}`} stroke="#5A6D56" strokeWidth="2" strokeDasharray="4 4" />
                {/* Sit bones Apex ring */}
                <circle cx="245" cy={110 - dMod * 15} r="6" fill="none" stroke="#BF6F55" strokeWidth="2" />
                <circle cx="110" cy="318" r="4" fill="#5A6D56" />
                <circle cx="370" cy="318" r="4" fill="#5A6D56" />
              </g>
            )}

            {/* Common mistake callout */}
            {mistakesActive && (
              <g>
                <path d="M 175 160 Q 200 140 230 145" stroke="#E53E3E" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                <text x="140" y="140" fill="#E53E3E" fontSize="11" fontWeight="600">Avoid rounded upper back</text>
              </g>
            )}
          </g>
        );

      case "warrior1":
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 220px" }}>
            {/* Mat floor */}
            <line x1="80" y1="330" x2="400" y2="330" stroke="#CFC5B4" strokeWidth="2" />
            <ellipse cx="240" cy="330" rx="150" ry="8" fill="#EDE6DA" />

            {/* Back Leg (Straight, anchored heel at x=340, y=330) */}
            <path d="M 230 200 Q 280 255 335 328 L 350 328 Q 295 250 245 195 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            {/* Back foot */}
            <path d="M 330 328 Q 350 324 360 328 Q 355 332 330 332 Z" fill={skinShadow} />

            {/* Front Leg (Bent at 90 degrees, knee at x=160, y=240, foot at x=160, y=330) */}
            <path d="M 225 195 Q 190 215 155 240 L 155 328 L 170 328 L 170 250 Q 205 220 235 200 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            {/* Front foot */}
            <path d="M 145 328 Q 165 324 175 328 Q 170 332 145 332 Z" fill={skinShadow} />

            {/* Apparel shorts */}
            <path d="M 215 185 Q 235 190 250 185 L 245 225 Q 230 230 210 220 Z" fill={apparelColor} />

            {/* Torso & Chest lifting upright with gentle backbend */}
            <path d="M 215 185 Q 212 135 218 95 Q 235 92 248 95 Q 252 135 248 185 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 218 95 Q 233 93 248 95 L 246 140 Q 233 145 216 140 Z" fill={apparelAccent} />

            {/* Neck & Head (Gazing slightly up) */}
            <path d="M 228 95 Q 233 80 233 70 Q 238 80 240 95 Z" fill={skinColor} />
            <ellipse cx="234" cy="55" rx="13" ry="16" transform="rotate(-15 234 55)" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="230" cy="40" rx="7" ry="6" fill="#3D2E26" />

            {/* Arms extending overhead */}
            <path d="M 218 95 Q 210 50 205 10 L 213 10 Q 218 50 226 95 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 245 95 Q 250 50 255 10 L 247 10 Q 242 50 237 95 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />

            {/* Muscle heatmap */}
            {heatmapActive && (
              <g opacity="0.65">
                <path d="M 215 195 Q 185 220 160 245" stroke={muscleGlowColor} strokeWidth="12" strokeLinecap="round" fill="none" />
                <path d="M 230 200 Q 280 255 335 320" stroke={muscleGlowColor} strokeWidth="8" strokeLinecap="round" fill="none" />
                <rect x="220" y="100" width="22" height="35" rx="4" fill={muscleGlowColor} />
              </g>
            )}

            {/* Alignment Guides */}
            {guidesActive && (
              <g opacity="0.9">
                {/* 90 degree front knee vertical check */}
                <line x1="160" y1="240" x2="160" y2="330" stroke="#5A6D56" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="160" cy="240" r="5" fill="#BF6F55" />
                <circle cx="160" cy="328" r="4" fill="#5A6D56" />
                {/* Spine upward axis */}
                <line x1="233" y1="200" x2="230" y2="10" stroke="#5A6D56" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>
            )}
          </g>
        );

      case "warrior2":
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 220px" }}>
            {/* Mat floor */}
            <line x1="70" y1="330" x2="410" y2="330" stroke="#CFC5B4" strokeWidth="2" />
            <ellipse cx="240" cy="330" rx="160" ry="8" fill="#EDE6DA" />

            {/* Back Leg (Extended straight, foot at x=350, y=330) */}
            <path d="M 245 195 Q 295 255 345 328 L 360 328 Q 305 250 258 190 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 335 328 Q 355 324 365 328 Q 360 332 335 332 Z" fill={skinShadow} />

            {/* Front Leg (Bent 90 deg, knee at x=140, y=235, foot at x=140, y=330) */}
            <path d="M 235 195 Q 185 210 140 235 L 138 328 L 152 328 L 152 245 Q 195 220 245 200 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 125 328 Q 145 324 158 328 Q 150 332 125 332 Z" fill={skinShadow} />

            {/* Shorts */}
            <path d="M 230 180 Q 250 185 265 180 L 260 220 Q 245 225 225 215 Z" fill={apparelColor} />

            {/* Torso directly vertical over hips */}
            <path d="M 232 180 Q 230 135 235 95 Q 250 93 262 95 Q 265 135 260 180 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 235 95 Q 248 93 262 95 L 260 135 Q 248 140 233 135 Z" fill={apparelAccent} />

            {/* Neck & Head turned forward over front hand */}
            <path d="M 244 95 Q 248 80 248 70 Q 254 80 256 95 Z" fill={skinColor} />
            <ellipse cx="248" cy="55" rx="12" ry="15" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="254" cy="42" rx="7" ry="6" fill="#3D2E26" />

            {/* Front Arm (Horizontal forward to left x=80, y=100) */}
            <path d="M 235 100 Q 160 98 85 100 L 85 108 Q 160 106 235 108 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            {/* Back Arm (Horizontal backward to right x=400, y=100) */}
            <path d="M 262 100 Q 330 98 395 100 L 395 108 Q 330 106 262 108 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />

            {/* Muscle heatmap */}
            {heatmapActive && (
              <g opacity="0.65">
                <path d="M 230 195 Q 180 215 140 235" stroke={muscleGlowColor} strokeWidth="12" strokeLinecap="round" fill="none" />
                <line x1="90" y1="104" x2="390" y2="104" stroke={muscleGlowColor} strokeWidth="6" strokeLinecap="round" />
              </g>
            )}

            {/* Alignment Guides */}
            {guidesActive && (
              <g opacity="0.9">
                {/* Horizontal wingspan guideline */}
                <line x1="75" y1="104" x2="405" y2="104" stroke="#5A6D56" strokeWidth="1.5" strokeDasharray="4 4" />
                {/* Front knee vertical stack */}
                <line x1="140" y1="235" x2="140" y2="330" stroke="#5A6D56" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="140" cy="235" r="5" fill="#BF6F55" />
                {/* Torso vertical center */}
                <line x1="248" y1="50" x2="248" y2="200" stroke="#5A6D56" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>
            )}
          </g>
        );

      case "tree":
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 260px" }}>
            {/* Mat floor */}
            <ellipse cx="240" cy="350" rx="120" ry="14" fill="#EDE6DA" />

            {/* Standing Left Leg (Straight down) */}
            <path d="M 233 180 Q 232 245 231 295 Q 230 325 230 348 L 242 348 Q 242 315 243 275 Q 244 225 243 180 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 224 348 Q 236 345 244 348 Q 246 352 230 352 Z" fill={skinShadow} />

            {/* Lifted Right Leg (Bent outward, foot pressed on inner thigh at y=220) */}
            <path d="M 245 180 Q 295 195 315 225 Q 290 245 245 235 L 243 222 Q 280 230 298 218 Q 285 195 245 180 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 243 220 Q 255 225 250 238 Q 240 235 243 220 Z" fill={skinShadow} />

            {/* Shorts */}
            <path d="M 226 165 Q 244 170 262 165 L 260 200 Q 244 205 228 200 Z" fill={apparelColor} />

            {/* Torso & Chest */}
            <path d="M 228 165 Q 225 120 230 95 Q 245 92 258 95 Q 263 120 260 165 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 230 95 Q 244 93 258 95 L 257 130 Q 244 135 231 130 Z" fill={apparelAccent} />

            {/* Head */}
            <ellipse cx="244" cy="55" rx="13" ry="17" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="244" cy="38" rx="8" ry="7" fill="#3D2E26" />

            {/* Arms in Prayer at heart center or extended overhead */}
            {activeDepth < 0.6 ? (
              // Prayer hands at chest
              <g>
                <path d="M 230 98 Q 220 120 235 125 L 244 115 L 244 125 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1" />
                <path d="M 258 98 Q 268 120 253 125 L 244 115 L 244 125 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1" />
                <polygon points="241,105 247,105 245,125 243,125" fill={skinColor} />
              </g>
            ) : (
              // Extended branches overhead
              <g>
                <path d="M 230 95 Q 215 50 220 15 L 228 18 Q 225 50 236 95 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
                <path d="M 258 95 Q 273 50 268 15 L 260 18 Q 263 50 252 95 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
              </g>
            )}

            {/* Muscle heatmap */}
            {heatmapActive && (
              <g opacity="0.65">
                <rect x="231" y="210" width="12" height="60" rx="6" fill={muscleGlowColor} />
                <circle cx="305" cy="220" r="10" fill={muscleGlowColor} />
              </g>
            )}

            {/* Alignment Guides */}
            {guidesActive && (
              <g opacity="0.9">
                <line x1="244" y1="20" x2="244" y2="350" stroke="#5A6D56" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="244" cy="165" r="4" fill="#5A6D56" />
                <circle cx="315" cy="225" r="5" fill="#BF6F55" />
              </g>
            )}
          </g>
        );

      case "childPose":
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 280px" }}>
            {/* Mat floor */}
            <ellipse cx="240" cy="300" rx="160" ry="12" fill="#EDE6DA" />
            <line x1="80" y1="300" x2="400" y2="300" stroke="#CFC5B4" strokeWidth="2" />

            {/* Lower legs folded under (Calves/Feet at x=320, y=295) */}
            <path d="M 260 250 Q 295 270 335 295 L 350 295 Q 310 260 270 240 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />

            {/* Pelvis & Hips sinking back onto heels */}
            <path d="M 260 215 Q 295 220 290 260 Q 255 270 245 250 Z" fill={apparelColor} />

            {/* Curved spine draped forward */}
            <path d="M 265 220 Q 220 205 175 230 Q 155 245 140 270 L 155 275 Q 170 255 190 240 Q 230 225 260 235 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 265 220 Q 225 210 190 235 L 180 245 Q 220 220 260 235 Z" fill={apparelAccent} />

            {/* Head resting on the floor */}
            <ellipse cx="130" cy="275" rx="14" ry="15" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="140" cy="265" rx="8" ry="7" fill="#3D2E26" />

            {/* Arms reaching long forward along mat (to left x=60, y=295) */}
            <path d="M 160 245 Q 110 275 60 295 L 60 290 Q 110 268 160 238 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="55" cy="295" rx="8" ry="3" fill={skinShadow} />

            {/* Muscle heatmap */}
            {heatmapActive && (
              <g opacity="0.65">
                <path d="M 260 225 Q 215 210 165 235" stroke={muscleGlowColor} strokeWidth="14" strokeLinecap="round" fill="none" />
                <ellipse cx="275" cy="245" rx="15" ry="15" fill={muscleGlowColor} />
              </g>
            )}

            {/* Alignment Guides */}
            {guidesActive && (
              <g opacity="0.9">
                <circle cx="130" cy="285" r="4" fill="#5A6D56" />
                <circle cx="280" cy="255" r="5" fill="#BF6F55" />
                <line x1="130" y1="290" x2="280" y2="290" stroke="#5A6D56" strokeWidth="1" strokeDasharray="3 3" />
              </g>
            )}
          </g>
        );

      case "pigeon":
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 260px" }}>
            {/* Mat floor */}
            <line x1="60" y1="300" x2="420" y2="300" stroke="#CFC5B4" strokeWidth="2" />
            <ellipse cx="240" cy="300" rx="160" ry="10" fill="#EDE6DA" />

            {/* Back Leg extending straight back to right (x=380, y=295) */}
            <path d="M 260 250 Q 320 275 380 295 L 395 295 Q 330 265 270 240 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />

            {/* Front Leg folded in front (Shin angled at 45-90 degrees, knee at x=170, y=285) */}
            <path d="M 230 250 Q 185 260 165 285 Q 185 295 230 280 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />

            {/* Pelvis & Apparel */}
            <path d="M 225 240 Q 255 240 265 270 Q 235 280 215 265 Z" fill={apparelColor} />

            {/* Torso folded forward over front shin */}
            <path d="M 230 240 Q 190 220 145 240 Q 125 255 115 275 L 128 280 Q 140 260 160 248 Q 200 230 235 245 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <path d="M 230 240 Q 195 225 165 245 L 155 255 Q 190 235 230 245 Z" fill={apparelAccent} />

            {/* Forearms resting on floor */}
            <path d="M 140 250 Q 110 275 80 295 L 90 295 Q 120 275 150 255 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />

            {/* Head resting on hands or block */}
            <ellipse cx="110" cy="275" rx="13" ry="15" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="115" cy="265" rx="7" ry="6" fill="#3D2E26" />

            {/* Muscle heatmap */}
            {heatmapActive && (
              <g opacity="0.65">
                <circle cx="230" cy="260" r="18" fill={muscleGlowColor} />
                <path d="M 270 250 Q 320 275 360 290" stroke={muscleGlowColor} strokeWidth="8" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Alignment Guides */}
            {guidesActive && (
              <g opacity="0.9">
                <circle cx="230" cy="260" r="6" fill="none" stroke="#BF6F55" strokeWidth="2" />
                <circle cx="165" cy="285" r="4" fill="#5A6D56" />
                <line x1="165" y1="285" x2="380" y2="295" stroke="#5A6D56" strokeWidth="1.5" strokeDasharray="3 3" />
              </g>
            )}
          </g>
        );

      case "bridge":
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 260px" }}>
            {/* Mat floor */}
            <line x1="60" y1="300" x2="420" y2="300" stroke="#CFC5B4" strokeWidth="2" />
            <ellipse cx="240" cy="300" rx="160" ry="10" fill="#EDE6DA" />

            {/* Head & Upper Shoulders resting on floor at x=110, y=285 */}
            <ellipse cx="100" cy="285" rx="14" ry="16" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="90" cy="285" rx="8" ry="8" fill="#3D2E26" />

            {/* Upper Spine ascending to elevated Pelvis (x=250, y=170 - dMod*20) */}
            <path
              d={`M 115 285 Q 170 230 240 ${170 - dMod * 20} L 255 ${180 - dMod * 20} Q 185 240 125 290 Z`}
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="1.2"
            />
            {/* Apparel Top */}
            <path
              d={`M 125 285 Q 165 240 200 ${200 - dMod * 15} L 210 ${210 - dMod * 15} Q 175 250 135 290 Z`}
              fill={apparelAccent}
            />

            {/* Pelvis & Shorts elevated in air */}
            <path
              d={`M 235 ${165 - dMod * 20} Q 260 160 280 ${175 - dMod * 20} L 275 ${210 - dMod * 20} Q 250 200 230 ${200 - dMod * 20} Z`}
              fill={apparelColor}
            />

            {/* Thighs descending from Pelvis to Knees (x=330, y=190 - dMod*10) */}
            <path
              d={`M 275 ${175 - dMod * 20} Q 305 178 335 ${190 - dMod * 10} L 342 ${202 - dMod * 10} Q 310 190 270 ${205 - dMod * 20} Z`}
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="1.2"
            />

            {/* Shins vertical down from Knees to Feet on floor (x=340, y=298) */}
            <path
              d={`M 335 ${190 - dMod * 10} Q 340 245 342 298 L 330 298 Q 328 245 325 ${200 - dMod * 10} Z`}
              fill={skinColor}
              stroke={skinShadow}
              strokeWidth="1.2"
            />
            {/* Foot */}
            <path d="M 320 298 Q 340 294 355 298 Q 350 302 320 302 Z" fill={skinShadow} />

            {/* Arms clasped beneath pelvis on floor */}
            <path d="M 120 290 Q 180 295 240 295 L 240 300 Q 180 300 120 295 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />

            {/* Muscle heatmap */}
            {heatmapActive && (
              <g opacity="0.65">
                <ellipse cx="255" cy={185 - dMod * 20} rx="18" ry="14" fill={muscleGlowColor} />
                <path d={`M 275 ${180 - dMod * 20} Q 310 185 335 ${195 - dMod * 10}`} stroke={muscleGlowColor} strokeWidth="10" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Alignment Guides */}
            {guidesActive && (
              <g opacity="0.9">
                {/* Vertical shin stack */}
                <line x1="335" y1={190 - dMod * 10} x2="335" y2="298" stroke="#5A6D56" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="335" cy={190 - dMod * 10} r="5" fill="#BF6F55" />
                <circle cx="250" cy={170 - dMod * 20} r="5" fill="#5A6D56" />
                <circle cx="100" cy="285" r="4" fill="#5A6D56" />
              </g>
            )}
          </g>
        );

      case "savasana":
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 280px" }}>
            {/* Mat floor */}
            <ellipse cx="240" cy="300" rx="180" ry="14" fill="#EDE6DA" />
            <line x1="40" y1="300" x2="440" y2="300" stroke="#CFC5B4" strokeWidth="2" />

            {/* Head resting peacefully */}
            <ellipse cx="90" cy="288" rx="14" ry="15" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="80" cy="288" rx="8" ry="7" fill="#3D2E26" />

            {/* Torso flat & relaxed */}
            <rect x="110" y="278" width="105" height="18" rx="6" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <rect x="110" y="278" width="55" height="18" rx="4" fill={apparelAccent} />

            {/* Shorts */}
            <rect x="195" y="276" width="35" height="22" rx="4" fill={apparelColor} />

            {/* Legs flat with feet flopped out */}
            <path d="M 230 285 Q 295 285 365 288 L 375 282 L 375 292 L 230 292 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            {/* Flopped foot */}
            <path d="M 370 282 Q 388 275 392 284 Q 380 294 370 292 Z" fill={skinShadow} />

            {/* Arms relaxed at sides with palms up */}
            <path d="M 120 288 Q 165 295 210 295 L 210 300 Q 165 300 120 292 Z" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
            <ellipse cx="215" cy="296" rx="6" ry="3" fill={skinShadow} />

            {/* Soft energy wave */}
            <path d="M 60 260 Q 150 240 240 260 Q 330 280 420 260" stroke="#6F7E68" strokeWidth="1.5" strokeDasharray="4 6" fill="none" opacity="0.4" />

            {/* Alignment Guides */}
            {guidesActive && (
              <g opacity="0.8">
                <line x1="80" y1="288" x2="390" y2="288" stroke="#5A6D56" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="90" cy="288" r="3" fill="#5A6D56" />
                <circle cx="215" cy="288" r="3" fill="#5A6D56" />
                <circle cx="370" cy="288" r="3" fill="#5A6D56" />
              </g>
            )}
          </g>
        );

      default:
        // Generic Dynamic Anatomical Fallback for other poses (e.g. Cobra, Camel, Boat, Triangle, etc.)
        return (
          <g transform={`scale(${breathScale})`} style={{ transformOrigin: "240px 240px" }}>
            {/* Mat floor */}
            <ellipse cx="240" cy="330" rx="150" ry="10" fill="#EDE6DA" />
            <line x1="70" y1="330" x2="410" y2="330" stroke="#CFC5B4" strokeWidth="2" />

            {/* Standing / Floating Human Figure with procedural joint angles from kinematics */}
            <g transform={`translate(240, ${220 - pose.kinematics.elevationY * 60})`}>
              {/* Torso */}
              <rect x="-18" y="-60" width="36" height="65" rx="8" fill={apparelAccent} stroke={skinShadow} strokeWidth="1.2" />
              {/* Head */}
              <ellipse cx="0" cy="-85" rx="14" ry="17" fill={skinColor} stroke={skinShadow} strokeWidth="1.2" />
              <ellipse cx="0" cy="-100" rx="8" ry="7" fill="#3D2E26" />

              {/* Limbs based on kinematics */}
              {/* Left Arm */}
              <line x1="-18" y1="-50" x2="-55" y2={-50 + pose.kinematics.leftShoulderAngle * 0.4} stroke={skinColor} strokeWidth="9" strokeLinecap="round" />
              {/* Right Arm */}
              <line x1="18" y1="-50" x2="55" y2={-50 + pose.kinematics.rightShoulderAngle * 0.4} stroke={skinColor} strokeWidth="9" strokeLinecap="round" />
              {/* Left Leg */}
              <line x1="-10" y1="5" x2="-25" y2={75 + pose.kinematics.leftHipAngle * 0.3} stroke={skinColor} strokeWidth="11" strokeLinecap="round" />
              {/* Right Leg */}
              <line x1="10" y1="5" x2="25" y2={75 + pose.kinematics.rightHipAngle * 0.3} stroke={skinColor} strokeWidth="11" strokeLinecap="round" />
            </g>

            {/* Muscle heatmap */}
            {heatmapActive && (
              <circle cx="240" cy="200" r="30" fill={muscleGlowColor} opacity="0.5" />
            )}

            {/* Alignment Guides */}
            {guidesActive && (
              <line x1="240" y1="60" x2="240" y2="330" stroke="#5A6D56" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
            )}
          </g>
        );
    }
  };

  return (
    <div id={`human-avatar-container-${pose.id}`} className={`relative flex flex-col items-center bg-[#FAF7F0] rounded-2xl border border-[#E4DCD0] shadow-sm overflow-hidden p-4 select-none ${className}`}>
      {/* Top Overlay Badges & View Controls */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 z-10">
        <div className="flex items-center gap-1.5 bg-[#EFE9DD] px-2.5 py-1 rounded-full text-xs font-medium text-[#4A5A4E] border border-[#DDD3C3]">
          <Sparkles className="w-3.5 h-3.5 text-[#BF6F55]" />
          <span>Realistic Human Biomechanics</span>
        </div>

        {/* Multi-angle & layer toggle buttons */}
        <div className="flex items-center gap-1 bg-[#EBE4D6] p-1 rounded-xl border border-[#DCD1BF]">
          <button
            id={`btn-heatmap-${pose.id}`}
            onClick={() => setHeatmapActive(!heatmapActive)}
            title="Toggle Muscle Activation Heatmap"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              heatmapActive ? "bg-[#BF6F55] text-white shadow-xs" : "text-[#4B554E] hover:bg-[#DDD4C2]"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Muscles</span>
          </button>

          <button
            id={`btn-guides-${pose.id}`}
            onClick={() => setGuidesActive(!guidesActive)}
            title="Toggle Joint & Skeletal Alignment Guides"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              guidesActive ? "bg-[#5A6D56] text-white shadow-xs" : "text-[#4B554E] hover:bg-[#DDD4C2]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Align</span>
          </button>

          <button
            id={`btn-mistakes-${pose.id}`}
            onClick={() => setMistakesActive(!mistakesActive)}
            title="Toggle Common Alignment Pitfalls"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
              mistakesActive ? "bg-[#C05646] text-white shadow-xs" : "text-[#4B554E] hover:bg-[#DDD4C2]"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pitfalls</span>
          </button>
        </div>
      </div>

      {/* Main Human Posture Canvas */}
      <div className="relative w-full flex items-center justify-center min-h-[220px]">
        <svg
          viewBox="0 0 480 380"
          className="w-full h-auto max-h-[380px] drop-shadow-sm transition-transform duration-500 ease-out"
          style={{ width: "100%", height: "auto" }}
        >
          {renderHumanFigure()}
        </svg>

        {/* Live Breath Pulse Indicator */}
        {isBreathing && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-[#FAF7F0]/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-medium text-[#5A6D56] border border-[#E2D8C8]">
            <span className={`w-2 h-2 rounded-full ${breathPhase.includes("inhale") ? "bg-[#5A6D56] animate-ping" : "bg-[#BF6F55]"}`} />
            <span className="capitalize">{breathPhase.replace("-", " ")}</span>
          </div>
        )}
      </div>

      {/* Muscle Focus Legend bar if Heatmap is active */}
      {heatmapActive && (
        <div className="w-full mt-2 pt-2 border-t border-[#E8E0D2] flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
          <span className="text-[#6D7A70] font-medium mr-1">Activated Chains:</span>
          {pose.primaryMuscles.map((m) => (
            <span key={m} className="px-2 py-0.5 rounded-md bg-[#BF6F55]/15 text-[#9A4E38] font-medium border border-[#BF6F55]/30">
              {MUSCLE_GROUPS_INFO[m]?.label || m}
            </span>
          ))}
        </div>
      )}

      {/* Interactive Depth / Form Adjustment Slider (Optional) */}
      {interactiveControls && (
        <div className="w-full mt-3 pt-2.5 border-t border-[#E8E0D2] flex items-center justify-between gap-3 text-xs text-[#556458]">
          <span className="font-medium whitespace-nowrap">Pose Stretch Depth:</span>
          <div className="flex items-center gap-2 flex-1 max-w-[200px]">
            <span className="text-[10px] text-[#8C988E]">Gentle</span>
            <input
              id={`depth-slider-${pose.id}`}
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={activeDepth}
              onChange={(e) => setActiveDepth(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#DDD4C4] rounded-lg appearance-none cursor-pointer accent-[#5A6D56]"
            />
            <span className="text-[10px] text-[#8C988E]">Deep</span>
          </div>
          <span className="font-medium text-[#3D4C40] w-8 text-right">{Math.round(activeDepth * 100)}%</span>
        </div>
      )}
    </div>
  );
};
