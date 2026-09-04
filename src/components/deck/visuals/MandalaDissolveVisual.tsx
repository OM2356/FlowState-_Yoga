import React, { useState } from "react";
import { Sparkles, Compass, ShieldCheck, HeartPulse, Activity } from "lucide-react";

interface MandalaDissolveVisualProps {
  isClosing?: boolean;
}

export const MandalaDissolveVisual: React.FC<MandalaDissolveVisualProps> = ({ isClosing = false }) => {
  // Slider ratio: 0 = pure mandala, 100 = full app interface
  const [blend, setBlend] = useState<number>(isClosing ? 85 : 45);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive Visual Canvas */}
      <div className="relative w-full max-w-2xl h-[360px] sm:h-[420px] rounded-2xl bg-[#121620]/90 border border-[#242D3D] overflow-hidden shadow-2xl backdrop-blur-md flex items-center justify-center p-6">
        
        {/* Ancient Sacred Mandala Side (Opacity governed by 100 - blend) */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none"
          style={{ opacity: Math.max(0.08, (100 - blend) / 100) }}
        >
          <svg className="w-[380px] h-[380px] animate-serene-pulse" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="180" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
            <circle cx="200" cy="200" r="140" stroke="#FF9F1C" strokeWidth="1" strokeDasharray="4 4" opacity="0.8" />
            <circle cx="200" cy="200" r="100" stroke="#2EC4B6" strokeWidth="1.5" opacity="0.7" />
            <circle cx="200" cy="200" r="50" stroke="#D4AF37" strokeWidth="2" opacity="0.9" />
            
            {/* 8-Point Lotus Petal Geometry */}
            {Array.from({ length: 8 }).map((_, i) => {
              const rot = i * 45;
              return (
                <g key={i} transform={`rotate(${rot} 200 200)`}>
                  <path
                    d="M 200 60 C 230 110, 230 150, 200 200 C 170 150, 170 110, 200 60 Z"
                    fill="url(#goldGradient)"
                    opacity="0.25"
                    stroke="#D4AF37"
                    strokeWidth="1"
                  />
                  <circle cx="200" cy="60" r="4" fill="#FF9F1C" />
                </g>
              );
            })}

            {/* Central Bindu Node */}
            <circle cx="200" cy="200" r="14" fill="#FF9F1C" opacity="0.9" />
            <circle cx="200" cy="200" r="24" stroke="#FF9F1C" strokeWidth="1.5" opacity="0.5" className="animate-ping" />

            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF9F1C" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2EC4B6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute bottom-6 left-6 text-xs text-[#D4AF37] tracking-wider uppercase font-mono flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>5,000-Year Sacred Lineage</span>
          </div>
        </div>

        {/* Modern Web Interface Mockup Side (Opacity governed by blend) */}
        <div 
          className="absolute inset-0 p-6 flex flex-col justify-between transition-opacity duration-300"
          style={{ opacity: Math.max(0.1, blend / 100) }}
        >
          {/* Mockup Top Header */}
          <div className="flex items-center justify-between border-b border-[#242D3D] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-mono text-[#8C9BAE] ml-2">app.vedaverse.io</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#2EC4B6] bg-[#2EC4B6]/10 px-2.5 py-1 rounded-full border border-[#2EC4B6]/30">
              <ShieldCheck className="w-3 h-3" />
              <span>Vaidya Verified</span>
            </div>
          </div>

          {/* Center Card: Daily Harmony Diagnostic */}
          <div className="bg-[#171D2A] border border-[#2EC4B6]/30 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#FF9F1C] font-mono font-semibold">Today's Constitution Match</p>
                <h4 className="text-base font-serif text-[#F5F1E8]">Pitta-Vata Balancing Sadhana</h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#2EC4B6]/20 flex items-center justify-center text-[#2EC4B6]">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-[#242D3D]">
              <div className="bg-[#11151F] py-1.5 px-2 rounded-lg border border-[#242D3D]">
                <span className="block text-[10px] text-[#8C9BAE]">Yoga</span>
                <span className="font-medium text-[#F5F1E8]">Chandra Flow</span>
              </div>
              <div className="bg-[#11151F] py-1.5 px-2 rounded-lg border border-[#242D3D]">
                <span className="block text-[10px] text-[#8C9BAE]">Pranayama</span>
                <span className="font-medium text-[#2EC4B6]">Sheetali (Cooling)</span>
              </div>
              <div className="bg-[#11151F] py-1.5 px-2 rounded-lg border border-[#242D3D]">
                <span className="block text-[10px] text-[#8C9BAE]">Ayurveda</span>
                <span className="font-medium text-[#FF9F1C]">Ghee & Fennel</span>
              </div>
            </div>
          </div>

          {/* Mockup Bottom Indicator */}
          <div className="flex items-center justify-between text-xs text-[#8C9BAE]">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#FF9F1C]" />
              Circadian Sync: 18:30 Pitta Peak
            </span>
            <span className="text-[#D4AF37] font-medium">1-Tap Start →</span>
          </div>
        </div>

        {/* Center Dissolve Divider Indicator */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FF9F1C] via-[#2EC4B6] to-[#D4AF37] pointer-events-none shadow-[0_0_12px_#FF9F1C]"
          style={{ left: `${blend}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0B0E14] border-2 border-[#FF9F1C] flex items-center justify-center shadow-md">
            <Sparkles className="w-3 h-3 text-[#FF9F1C]" />
          </div>
        </div>
      </div>

      {/* Interactive Dissolve Slider Controller */}
      <div className="w-full max-w-md mt-5 flex flex-col items-center gap-2">
        <div className="w-full flex items-center justify-between text-xs font-mono text-[#8C9BAE]">
          <span className={blend < 50 ? "text-[#D4AF37] font-semibold" : ""}>Ancient Mandala</span>
          <span className="text-[11px] text-[#8C9BAE]">Drag to blend era</span>
          <span className={blend >= 50 ? "text-[#2EC4B6] font-semibold" : ""}>Modern Interface</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={blend}
          onChange={(e) => setBlend(Number(e.target.value))}
          className="w-full h-1.5 bg-[#242D3D] rounded-lg appearance-none cursor-pointer accent-[#FF9F1C]"
        />
      </div>
    </div>
  );
};
