import React, { useState } from "react";
import { MuscleGroup } from "../types";
import { RotateCw, Sparkles, CheckCircle2 } from "lucide-react";

interface MuscleAnatomyMapProps {
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const MuscleAnatomyMap: React.FC<MuscleAnatomyMapProps> = ({
  primaryMuscles = [],
  secondaryMuscles = [],
  className = "",
  size = "md",
}) => {
  const [viewAngle, setViewAngle] = useState<"front" | "back">("front");

  const isPrimary = (key: string) => {
    const norm = key.toLowerCase();
    return primaryMuscles.some((m) => m.toLowerCase().includes(norm));
  };

  const isSecondary = (key: string) => {
    const norm = key.toLowerCase();
    return secondaryMuscles.some((m) => m.toLowerCase().includes(norm));
  };

  const getMuscleColor = (key: string) => {
    if (isPrimary(key)) return "#DC2626"; // Bold Crimson Red for primary muscles (like screenshot)
    if (isSecondary(key)) return "#F87171"; // Coral light red for secondary
    return "#CBD5E1"; // Slate neutral inactive
  };

  const getMuscleOpacity = (key: string) => {
    if (isPrimary(key)) return 0.95;
    if (isSecondary(key)) return 0.65;
    return 0.25;
  };

  const dim = {
    sm: { w: 180, h: 220 },
    md: { w: 260, h: 280 },
    lg: { w: 340, h: 320 },
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 select-none ${className}`}>
      {/* 360° Angle Rotation Button */}
      <button
        onClick={() => setViewAngle((prev) => (prev === "front" ? "back" : "front"))}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-xs border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all active:scale-95"
        title="Toggle Front / Back View"
      >
        <RotateCw className="w-3.5 h-3.5 text-blue-600 animate-spin-reverse" />
        <span className="capitalize">{viewAngle} View</span>
      </button>

      {/* SVG Anatomical Figure with Highlighted Muscle Groups */}
      <svg
        width={dim.w}
        height={dim.h}
        viewBox="0 0 240 280"
        className="drop-shadow-sm transition-transform duration-300"
      >
        <defs>
          <filter id="glow-muscle" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {viewAngle === "front" ? (
          /* FRONT ANATOMY VIEW */
          <g transform="translate(120, 140)">
            {/* Head & Neck */}
            <circle cx="0" cy="-105" r="14" fill="#94A3B8" />
            <path d="M-6,-92 L6,-92 L8,-80 L-8,-80 Z" fill="#94A3B8" />

            {/* Shoulders / Deltoids (Left & Right) */}
            <ellipse
              cx="-34"
              cy="-70"
              rx="10"
              ry="14"
              fill={getMuscleColor("shoulder")}
              opacity={getMuscleOpacity("shoulder")}
              filter={isPrimary("shoulder") ? "url(#glow-muscle)" : undefined}
            />
            <ellipse
              cx="34"
              cy="-70"
              rx="10"
              ry="14"
              fill={getMuscleColor("shoulder")}
              opacity={getMuscleOpacity("shoulder")}
              filter={isPrimary("shoulder") ? "url(#glow-muscle)" : undefined}
            />

            {/* Chest / Pectorals */}
            <path
              d="M-24,-76 Q0,-70 24,-76 L20,-50 Q0,-45 -20,-50 Z"
              fill={getMuscleColor("chest")}
              opacity={getMuscleOpacity("chest")}
              filter={isPrimary("chest") ? "url(#glow-muscle)" : undefined}
            />

            {/* Core / Abdominals (6-pack segmented highlight) */}
            <g>
              <rect
                x="-14"
                y="-46"
                width="12"
                height="10"
                rx="2"
                fill={getMuscleColor("core")}
                opacity={getMuscleOpacity("core")}
                filter={isPrimary("core") ? "url(#glow-muscle)" : undefined}
              />
              <rect
                x="2"
                y="-46"
                width="12"
                height="10"
                rx="2"
                fill={getMuscleColor("core")}
                opacity={getMuscleOpacity("core")}
                filter={isPrimary("core") ? "url(#glow-muscle)" : undefined}
              />
              <rect
                x="-14"
                y="-33"
                width="12"
                height="10"
                rx="2"
                fill={getMuscleColor("core")}
                opacity={getMuscleOpacity("core")}
                filter={isPrimary("core") ? "url(#glow-muscle)" : undefined}
              />
              <rect
                x="2"
                y="-33"
                width="12"
                height="10"
                rx="2"
                fill={getMuscleColor("core")}
                opacity={getMuscleOpacity("core")}
                filter={isPrimary("core") ? "url(#glow-muscle)" : undefined}
              />
              <rect
                x="-14"
                y="-20"
                width="12"
                height="10"
                rx="2"
                fill={getMuscleColor("core")}
                opacity={getMuscleOpacity("core")}
                filter={isPrimary("core") ? "url(#glow-muscle)" : undefined}
              />
              <rect
                x="2"
                y="-20"
                width="12"
                height="10"
                rx="2"
                fill={getMuscleColor("core")}
                opacity={getMuscleOpacity("core")}
                filter={isPrimary("core") ? "url(#glow-muscle)" : undefined}
              />
            </g>

            {/* Biceps & Forearms */}
            <path d="M-42,-55 L-30,-55 L-32,-20 L-40,-20 Z" fill="#94A3B8" opacity="0.4" />
            <path d="M42,-55 L30,-55 L32,-20 L40,-20 Z" fill="#94A3B8" opacity="0.4" />
            <line x1="-36" y1="-20" x2="-44" y2="15" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
            <line x1="36" y1="-20" x2="44" y2="15" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" opacity="0.4" />

            {/* Pelvis / Hip Flexors */}
            <path
              d="M-22,-8 Q0,-12 22,-8 L16,8 Q0,4 -16,8 Z"
              fill={getMuscleColor("hip")}
              opacity={getMuscleOpacity("hip")}
              filter={isPrimary("hip") ? "url(#glow-muscle)" : undefined}
            />

            {/* Quadriceps (Thighs Front - Left & Right) */}
            <path
              d="M-22,8 L-8,8 L-10,65 L-24,65 Z"
              rx="4"
              fill={getMuscleColor("quadriceps")}
              opacity={getMuscleOpacity("quadriceps")}
              filter={isPrimary("quadriceps") ? "url(#glow-muscle)" : undefined}
            />
            <path
              d="M8,8 L22,8 L24,65 L10,65 Z"
              rx="4"
              fill={getMuscleColor("quadriceps")}
              opacity={getMuscleOpacity("quadriceps")}
              filter={isPrimary("quadriceps") ? "url(#glow-muscle)" : undefined}
            />

            {/* Knees */}
            <circle cx="-17" cy="72" r="6" fill="#64748B" opacity="0.3" />
            <circle cx="17" cy="72" r="6" fill="#64748B" opacity="0.3" />

            {/* Calves & Tibialis Front */}
            <path
              d="M-23,78 L-11,78 L-13,115 L-20,115 Z"
              fill={getMuscleColor("calves")}
              opacity={getMuscleOpacity("calves")}
              filter={isPrimary("calves") ? "url(#glow-muscle)" : undefined}
            />
            <path
              d="M11,78 L23,78 L20,115 L13,115 Z"
              fill={getMuscleColor("calves")}
              opacity={getMuscleOpacity("calves")}
              filter={isPrimary("calves") ? "url(#glow-muscle)" : undefined}
            />

            {/* Feet */}
            <ellipse cx="-16" cy="120" rx="9" ry="4" fill="#64748B" opacity="0.4" />
            <ellipse cx="16" cy="120" rx="9" ry="4" fill="#64748B" opacity="0.4" />
          </g>
        ) : (
          /* BACK ANATOMY VIEW */
          <g transform="translate(120, 140)">
            {/* Back of Head */}
            <circle cx="0" cy="-105" r="14" fill="#94A3B8" />
            <path d="M-6,-92 L6,-92 L8,-80 L-8,-80 Z" fill="#94A3B8" />

            {/* Trapezius & Upper Back */}
            <path
              d="M-8,-80 L8,-80 L28,-65 L0,-40 L-28,-65 Z"
              fill={getMuscleColor("back")}
              opacity={getMuscleOpacity("back")}
              filter={isPrimary("back") ? "url(#glow-muscle)" : undefined}
            />

            {/* Latissimus Dorsi / Mid Back */}
            <path
              d="M-28,-65 L-12,-35 L-8,-10 L-20,-10 L-32,-45 Z"
              fill={getMuscleColor("latissimus")}
              opacity={getMuscleOpacity("latissimus")}
              filter={isPrimary("latissimus") ? "url(#glow-muscle)" : undefined}
            />
            <path
              d="M28,-65 L12,-35 L8,-10 L20,-10 L32,-45 Z"
              fill={getMuscleColor("latissimus")}
              opacity={getMuscleOpacity("latissimus")}
              filter={isPrimary("latissimus") ? "url(#glow-muscle)" : undefined}
            />

            {/* Erector Spinae / Lower Back */}
            <rect
              x="-6"
              y="-38"
              width="12"
              height="30"
              rx="3"
              fill={getMuscleColor("spine")}
              opacity={getMuscleOpacity("spine")}
              filter={isPrimary("spine") ? "url(#glow-muscle)" : undefined}
            />

            {/* Gluteus Maximus (Buttocks / Glutes - Prominent red in screenshots) */}
            <path
              d="M-22,-8 Q0,-12 0,16 Q-22,18 -22,-8 Z"
              fill={getMuscleColor("glutes")}
              opacity={getMuscleOpacity("glutes")}
              filter={isPrimary("glutes") ? "url(#glow-muscle)" : undefined}
            />
            <path
              d="M22,-8 Q0,-12 0,16 Q22,18 22,-8 Z"
              fill={getMuscleColor("glutes")}
              opacity={getMuscleOpacity("glutes")}
              filter={isPrimary("glutes") ? "url(#glow-muscle)" : undefined}
            />

            {/* Hamstrings (Back of Thighs) */}
            <path
              d="M-20,18 L-4,18 L-6,65 L-22,65 Z"
              fill={getMuscleColor("hamstrings")}
              opacity={getMuscleOpacity("hamstrings")}
              filter={isPrimary("hamstrings") ? "url(#glow-muscle)" : undefined}
            />
            <path
              d="M4,18 L20,18 L22,65 L6,65 Z"
              fill={getMuscleColor("hamstrings")}
              opacity={getMuscleOpacity("hamstrings")}
              filter={isPrimary("hamstrings") ? "url(#glow-muscle)" : undefined}
            />

            {/* Gastrocnemius (Calves Back) */}
            <ellipse
              cx="-16"
              cy="88"
              rx="8"
              ry="14"
              fill={getMuscleColor("calves")}
              opacity={getMuscleOpacity("calves")}
              filter={isPrimary("calves") ? "url(#glow-muscle)" : undefined}
            />
            <ellipse
              cx="16"
              cy="88"
              rx="8"
              ry="14"
              fill={getMuscleColor("calves")}
              opacity={getMuscleOpacity("calves")}
              filter={isPrimary("calves") ? "url(#glow-muscle)" : undefined}
            />

            {/* Feet */}
            <ellipse cx="-16" cy="120" rx="9" ry="4" fill="#64748B" opacity="0.4" />
            <ellipse cx="16" cy="120" rx="9" ry="4" fill="#64748B" opacity="0.4" />
          </g>
        )}
      </svg>

      {/* Target Muscle Key Indicator */}
      <div className="flex items-center gap-4 mt-2 text-[11px] font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
          <span>Primary Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span>Supporting Engagement</span>
        </div>
      </div>
    </div>
  );
};
