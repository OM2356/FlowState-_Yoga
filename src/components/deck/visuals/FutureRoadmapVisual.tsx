import React, { useState } from "react";
import { ROADMAP_STAGES } from "../../../data/deckData";
import { RoadmapStage } from "../../../types/deck";
import { Layers, Watch, Cpu, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export const FutureRoadmapVisual: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>("today");

  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case "Layers":
        return <Layers className="w-5 h-5 text-[#FF9F1C]" />;
      case "Watch":
        return <Watch className="w-5 h-5 text-[#2EC4B6]" />;
      case "Cpu":
        return <Cpu className="w-5 h-5 text-[#D4AF37]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#FF9F1C]" />;
    }
  };

  const currentStage = ROADMAP_STAGES.find((s) => s.id === activeStageId) || ROADMAP_STAGES[0];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Horizontal Roadmap Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        {ROADMAP_STAGES.map((stage, idx) => {
          const isSelected = activeStageId === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-[#18202D] border-[#2EC4B6] shadow-[0_0_15px_rgba(46,196,182,0.2)] scale-[1.01]"
                  : "bg-[#111620] border-[#242D3D] hover:border-[#384660] opacity-80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-[#0D121B] border border-[#242D3D]">
                    {getStageIcon(stage.icon)}
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                    stage.id === "today"
                      ? "bg-[#FF9F1C]/20 text-[#FF9F1C] border border-[#FF9F1C]/30"
                      : stage.id === "near-term"
                      ? "bg-[#2EC4B6]/20 text-[#2EC4B6] border border-[#2EC4B6]/30"
                      : "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                  }`}>
                    {stage.period}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#F5F1E8]">
                  {stage.title}
                </h4>
              </div>

              <div className="mt-4 pt-2 border-t border-[#242D3D] flex items-center justify-between text-[11px] text-[#8C9BAE]">
                <span className="font-mono text-[10px]">Phase 0{idx + 1}</span>
                {isSelected && <span className="text-[#2EC4B6] font-semibold">Inspecting →</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep Dive Roadmap Screen */}
      <div className="bg-[#131822] border border-[#2EC4B6]/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#242D3D] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1A2230] border border-[#2EC4B6]/40">
              {getStageIcon(currentStage.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#2EC4B6] font-semibold">{currentStage.period}</span>
                <h3 className="text-lg font-serif text-[#F5F1E8] font-semibold">{currentStage.title}</h3>
              </div>
              <p className="text-xs font-mono text-[#8C9BAE]">Architecture Stack: {currentStage.techFocus}</p>
            </div>
          </div>

          {currentStage.id === "today" && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-pose-studio"))}
              className="px-3 py-1.5 rounded-xl bg-[#2EC4B6]/20 hover:bg-[#2EC4B6]/30 border border-[#2EC4B6]/40 text-[#2EC4B6] font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Launch Live Pose Studio</span>
              <span>→</span>
            </button>
          )}
        </div>

        {/* Feature Deliverables List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentStage.features.map((feat, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#0D121B] border border-[#1F2738] flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#2EC4B6] shrink-0 mt-0.5" />
              <span className="text-[#CAD5E2] font-medium leading-relaxed">{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
