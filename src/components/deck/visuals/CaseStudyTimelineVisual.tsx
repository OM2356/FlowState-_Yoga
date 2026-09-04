import React, { useState } from "react";
import { TrendingDown, TrendingUp, Calendar, User, CheckCircle2, Clock } from "lucide-react";

export const CaseStudyTimelineVisual: React.FC = () => {
  const [activeDay, setActiveDay] = useState<number>(21);

  // 21 days data points for stress (down) and sleep quality (up)
  const days = [1, 3, 7, 10, 14, 18, 21];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* User Header Profile & Metrics Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-[#121620] border border-[#242D3D] rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1F293D] border border-[#2E3C56] flex items-center justify-center text-sm font-serif text-[#D4AF37]">
            27
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8C9BAE]">Composite Cohort Profile</span>
            <h5 className="text-xs font-semibold text-[#F5F1E8]">Tech Professional, Chronic Stress & Lumbar Pain</h5>
          </div>
        </div>

        <div className="p-3 bg-[#1B1516] border border-red-900/30 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-red-400">Self-Reported Stress</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-mono font-bold text-red-400">↓ 34%</span>
              <span className="text-[11px] text-[#8C9BAE]">Score: 8.2 → 5.4</span>
            </div>
          </div>
          <TrendingDown className="w-6 h-6 text-red-400 shrink-0" />
        </div>

        <div className="p-3 bg-[#111C1A] border border-[#2EC4B6]/30 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#2EC4B6]">Sleep Quality Index</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-mono font-bold text-[#2EC4B6]">↑ 28%</span>
              <span className="text-[11px] text-[#8C9BAE]">Score: 5.8 → 8.4</span>
            </div>
          </div>
          <TrendingUp className="w-6 h-6 text-[#2EC4B6] shrink-0" />
        </div>
      </div>

      {/* Interactive 21-Day Trend Graph & Stage Breakdown */}
      <div className="bg-[#131822] border border-[#242D3D] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-[#242D3D] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <Calendar className="w-4 h-4" />
            <span>21-Day Compounding Progression</span>
          </div>
          <span className="text-[11px] text-[#8C9BAE]">Hover or click any milestone day</span>
        </div>

        {/* SVG Dual-Trend Line Chart */}
        <div className="w-full h-36 relative">
          <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
            {/* Grid Horizontal Guide Lines */}
            <line x1="20" y1="20" x2="480" y2="20" stroke="#1E2738" strokeDasharray="3 3" />
            <line x1="20" y1="65" x2="480" y2="65" stroke="#1E2738" strokeDasharray="3 3" />
            <line x1="20" y1="110" x2="480" y2="110" stroke="#1E2738" strokeDasharray="3 3" />

            {/* Stress Line (Orange/Red falling) */}
            <path
              d="M 30 25 C 100 35, 180 50, 250 65 C 320 80, 400 95, 470 100"
              fill="none"
              stroke="#FF9F1C"
              strokeWidth="2.5"
            />

            {/* Sleep Line (Teal rising) */}
            <path
              d="M 30 105 C 100 95, 180 80, 250 65 C 320 50, 400 35, 470 25"
              fill="none"
              stroke="#2EC4B6"
              strokeWidth="2.5"
            />

            {/* Interactive Milestone Nodes */}
            {days.map((d, idx) => {
              const x = 30 + (idx / (days.length - 1)) * 440;
              const isSelected = activeDay === d;
              return (
                <g key={d} className="cursor-pointer" onClick={() => setActiveDay(d)}>
                  <line x1={x} y1="10" x2={x} y2="115" stroke={isSelected ? "#D4AF37" : "#242D3D"} strokeWidth={isSelected ? 1.5 : 0.5} />
                  <circle cx={x} cy="65" r={isSelected ? 6 : 4} fill={isSelected ? "#D4AF37" : "#1A2332"} stroke="#0B0E14" strokeWidth="2" />
                </g>
              );
            })}
          </svg>

          {/* Legend Labels */}
          <div className="absolute top-1 right-2 flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-[#FF9F1C]">
              <span className="w-2.5 h-0.5 bg-[#FF9F1C]" /> Stress Score
            </span>
            <span className="flex items-center gap-1 text-[#2EC4B6]">
              <span className="w-2.5 h-0.5 bg-[#2EC4B6]" /> Sleep Quality
            </span>
          </div>
        </div>

        {/* Milestone Days Selector */}
        <div className="flex items-center justify-between gap-1 mt-3 pt-3 border-t border-[#242D3D]">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                activeDay === d
                  ? "bg-[#D4AF37] text-[#0B0E14] font-bold shadow-md"
                  : "bg-[#171D2A] text-[#8C9BAE] hover:text-[#F5F1E8]"
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>

        {/* Day Milestone Breakdown Card */}
        <div className="mt-3 p-3 bg-[#0D121B] rounded-xl border border-[#1F283A] flex items-center justify-between text-xs">
          <div>
            <span className="font-mono text-[#D4AF37] font-semibold">
              {activeDay <= 7 ? "Week 1 (Days 1–7): Acute Habit Anchoring" : "Weeks 2–3 (Days 8–21): Systemic Integration"}
            </span>
            <p className="text-[#8C9BAE] text-[11px] mt-0.5">
              {activeDay <= 7
                ? "Daily 10-minute SOS micro-resets, completed baseline Dosha diagnostic, neck & thoracic release."
                : "Ayurvedic warm dinner timing window instituted + 7-minute evening Bhramari pranayama added."}
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-mono px-2 py-1 rounded bg-[#182230] text-[#2EC4B6] border border-[#2EC4B6]/30">
            {activeDay <= 7 ? "Phase 1 ✓" : "Phase 2 Active ✓"}
          </span>
        </div>
      </div>
    </div>
  );
};
