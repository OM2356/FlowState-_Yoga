import React from "react";
import { AccentColor } from "../../types/deck";

interface SacredGeometryBackgroundProps {
  accent: AccentColor;
  laserPos?: { x: number; y: number } | null;
}

export const SacredGeometryBackground: React.FC<SacredGeometryBackgroundProps> = ({
  accent,
  laserPos,
}) => {
  const getGlowColor = () => {
    switch (accent) {
      case "saffron":
        return "rgba(255, 159, 28, 0.08)";
      case "teal":
        return "rgba(46, 196, 182, 0.08)";
      case "gold":
        return "rgba(212, 175, 55, 0.08)";
      default:
        return "rgba(58, 63, 75, 0.08)";
    }
  };

  const getBorderColor = () => {
    switch (accent) {
      case "saffron":
        return "#FF9F1C";
      case "teal":
        return "#2EC4B6";
      case "gold":
        return "#D4AF37";
      default:
        return "#3A3F4B";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Deep Charcoal Indigo Base */}
      <div className="absolute inset-0 bg-[#0B0E14]" />

      {/* Atmospheric Ambient Glows */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-1000"
        style={{ background: getGlowColor() }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[650px] h-[650px] rounded-full blur-[160px] transition-all duration-1000"
        style={{
          background:
            accent === "teal"
              ? "rgba(46, 196, 182, 0.06)"
              : "rgba(212, 175, 55, 0.06)",
        }}
      />

      {/* Subtle Geometric Mandala Line Art in the Background */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] opacity-[0.04] transition-all duration-1000 animate-serene-pulse"
        viewBox="0 0 800 800"
        fill="none"
        stroke={getBorderColor()}
        strokeWidth="1"
      >
        {/* Concentric Circles */}
        <circle cx="400" cy="400" r="100" />
        <circle cx="400" cy="400" r="180" strokeDasharray="3 6" />
        <circle cx="400" cy="400" r="260" />
        <circle cx="400" cy="400" r="340" strokeDasharray="2 8" />
        <circle cx="400" cy="400" r="390" />

        {/* 12-petaled Sri Yantra Inspired Rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x2 = 400 + 380 * Math.cos(angle);
          const y2 = 400 + 380 * Math.sin(angle);
          return <line key={i} x1="400" y1="400" x2={x2} y2={y2} />;
        })}

        {/* Interlocking Triangles / Yantra Geometry */}
        <polygon points="400,120 640,540 160,540" />
        <polygon points="400,680 640,260 160,260" />
        <polygon points="400,190 580,500 220,500" strokeDasharray="4 4" />
        <polygon points="400,610 580,300 220,300" strokeDasharray="4 4" />
      </svg>

      {/* Grid Mesh Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFF 1px, transparent 0)`,
          backgroundSize: "48px 48px"
        }}
      />

      {/* Presenter Laser Pointer Effect */}
      {laserPos && (
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 transition-transform duration-75"
          style={{
            left: `${laserPos.x}px`,
            top: `${laserPos.y}px`,
            background: "#FF3366",
            boxShadow: "0 0 16px 6px rgba(255, 51, 102, 0.8), 0 0 32px 12px rgba(255, 51, 102, 0.4)",
          }}
        />
      )}
    </div>
  );
};
