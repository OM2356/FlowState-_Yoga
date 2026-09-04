import React, { useState } from "react";
import { FRAMEWORK_STEPS } from "../../../data/deckData";
import { FrameworkStep } from "../../../types/deck";
import { RotateCw, Target, Compass, Repeat, Users, BarChart3, ArrowRight } from "lucide-react";

export const GrowthFrameworkVisual: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<FrameworkStep>(FRAMEWORK_STEPS[0]);

  const getStepIcon = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return <Target className="w-4 h-4 text-[#FF9F1C]" />;
      case 2:
        return <Compass className="w-4 h-4 text-[#2EC4B6]" />;
      case 3:
        return <Repeat className="w-4 h-4 text-[#D4AF37]" />;
      case 4:
        return <Users className="w-4 h-4 text-[#8B5CF6]" />;
      case 5:
        return <BarChart3 className="w-4 h-4 text-[#2EC4B6]" />;
      default:
        return <Target className="w-4 h-4 text-[#FF9F1C]" />;
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-6">
      {/* Circular Loop Diagram */}
      <div className="relative w-[300px] sm:w-[340px] h-[300px] sm:h-[340px] shrink-0 flex items-center justify-center">
        {/* Curved Circular Loop SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 340">
          <circle cx="170" cy="170" r="120" stroke="#242D3D" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          <circle
            cx="170"
            cy="170"
            r="120"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeDasharray="40 160"
            fill="none"
            className="animate-spin"
            style={{ animationDuration: "24s" }}
          />
        </svg>

        {/* Center Loop Branding */}
        <div className="w-24 h-24 rounded-full bg-[#121620] border border-[#242D3D] p-2 flex flex-col items-center justify-center text-center shadow-inner">
          <RotateCw className="w-4 h-4 text-[#D4AF37] mb-1 animate-spin" style={{ animationDuration: "12s" }} />
          <span className="text-[10px] font-mono uppercase text-[#D4AF37] font-semibold">Self-Reinforcing</span>
          <span className="text-[9px] text-[#8C9BAE]">Habit Flywheel</span>
        </div>

        {/* 5 Circular Nodes Arranged in a Ring */}
        {FRAMEWORK_STEPS.map((step, idx) => {
          // Angle in radians: step 1 at top (-90 deg), then evenly spaced (72 deg intervals)
          const angle = (idx * 72 - 90) * (Math.PI / 180);
          const r = 120;
          const x = 170 + r * Math.cos(angle);
          const y = 170 + r * Math.sin(angle);
          const isSelected = selectedStep.step === step.step;

          return (
            <button
              key={step.step}
              onClick={() => setSelectedStep(step)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? "bg-[#1C2433] border-2 border-[#D4AF37] scale-110 shadow-[0_0_15px_rgba(212,175,55,0.4)] z-20"
                  : "bg-[#111620] border border-[#242D3D] hover:border-[#3E4F6D] z-10"
              }`}
              style={{ left: `${x}px`, top: `${y}px` }}
            >
              {getStepIcon(step.step)}
              <span className="text-[8px] font-mono text-[#CAD5E2] font-semibold mt-0.5">
                {step.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail Pane for Selected Step */}
      <div className="flex-1 w-full bg-[#131822] border border-[#242D3D] rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#242D3D] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1A2230] border border-[#2E3D56]">
              {getStepIcon(selectedStep.step)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#D4AF37] font-semibold">Step 0{selectedStep.step}</span>
                <h4 className="text-lg font-serif text-[#F5F1E8] font-semibold">{selectedStep.name}</h4>
              </div>
              <p className="text-xs text-[#8C9BAE]">{selectedStep.action}</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
            selectedStep.layer === "consumer"
              ? "bg-[#FF9F1C]/15 text-[#FF9F1C] border-[#FF9F1C]/30"
              : "bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30"
          }`}>
            {selectedStep.layer === "consumer" ? "Consumer Habit Loop" : "Enterprise Expansion"}
          </span>
        </div>

        <p className="text-sm text-[#CAD5E2] leading-relaxed mb-4">
          {selectedStep.objective}
        </p>

        {/* Step Progression Bar */}
        <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1F2738] flex items-center justify-between text-xs">
          <span className="text-[#8C9BAE]">Sequential Habit Journey:</span>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className={selectedStep.step === 1 ? "text-[#FF9F1C] font-bold" : "text-[#8C9BAE]"}>Assess</span>
            <span className="text-[#3A3F4B]">→</span>
            <span className={selectedStep.step === 2 ? "text-[#2EC4B6] font-bold" : "text-[#8C9BAE]"}>Guide</span>
            <span className="text-[#3A3F4B]">→</span>
            <span className={selectedStep.step === 3 ? "text-[#D4AF37] font-bold" : "text-[#8C9BAE]"}>Reinforce</span>
            <span className="text-[#3A3F4B]">→</span>
            <span className={selectedStep.step === 4 ? "text-[#8B5CF6] font-bold" : "text-[#8C9BAE]"}>Expand</span>
            <span className="text-[#3A3F4B]">→</span>
            <span className={selectedStep.step === 5 ? "text-[#2EC4B6] font-bold" : "text-[#8C9BAE]"}>Measure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
