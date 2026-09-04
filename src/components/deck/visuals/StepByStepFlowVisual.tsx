import React, { useState, useEffect } from "react";
import { Check, Clock, Play, RotateCcw, Sparkles, ChevronRight, Heart, Brain, Moon, Sun } from "lucide-react";

interface StepItem {
  id: number;
  number: string;
  name: string;
  timeSec: string;
  icon: string;
  summary: string;
  mockUI: {
    prompt: string;
    actionLabel: string;
    details: string;
  };
}

const STEPS: StepItem[] = [
  {
    id: 1,
    number: "1️⃣",
    name: "Check-in",
    timeSec: "00:05",
    icon: "Heart",
    summary: "One tap. No scrolling 10,000 videos. 'How are you feeling right now?'",
    mockUI: {
      prompt: "How does your body & mind feel right now?",
      actionLabel: "Selected: High Stress + Tight Neck & Shoulders",
      details: "One tap captures emotional valence + physical tension landmark."
    }
  },
  {
    id: 2,
    number: "2️⃣",
    name: "Constitution Match",
    timeSec: "00:15",
    icon: "Sparkles",
    summary: "Cross-references your baseline dosha, circadian hour, and daily goals.",
    mockUI: {
      prompt: "Algorithm calculating somatic prescription...",
      actionLabel: "Match: Vata-Pacifying Lateral Spine Decompression",
      details: "Circadian sync: Evening wind-down window + low-intensity parasympathetic trigger."
    }
  },
  {
    id: 3,
    number: "3️⃣",
    name: "Guided Session",
    timeSec: "00:45",
    icon: "Play",
    summary: "Immediate launch into alignment-safe, 3D/audio guided protocol.",
    mockUI: {
      prompt: "Live Sadhana: 8-minute Grounding Prana Flow",
      actionLabel: "Playing: Balasana → Marjaryasana → Nadi Shodhana",
      details: "Zero friction transition directly into breathing audio & 3D kinetic avatar."
    }
  },
  {
    id: 4,
    number: "4️⃣",
    name: "Reflection",
    timeSec: "01:00",
    icon: "Check",
    summary: "10-second micro-journal + streak badge feeding tomorrow's algorithm.",
    mockUI: {
      prompt: "How do you feel after practice?",
      actionLabel: "Logged: Heart Rate Normalized, Calm Alertness (+1 Streak)",
      details: "Closed-loop feedback loop sharpens tomorrow's personalized recommendation."
    }
  }
];

export const StepByStepFlowVisual: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simTimer, setSimTimer] = useState<number>(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimTimer((prev) => {
          if (prev >= 60) {
            setIsSimulating(false);
            return 60;
          }
          const next = prev + 5;
          if (next <= 15) setActiveStep(1);
          else if (next <= 30) setActiveStep(2);
          else if (next <= 50) setActiveStep(3);
          else setActiveStep(4);
          return next;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleStartSimulation = () => {
    setActiveStep(1);
    setSimTimer(5);
    setIsSimulating(true);
  };

  const current = STEPS[activeStep - 1];

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Simulation Controller Bar */}
      <div className="flex items-center justify-between bg-[#121620] border border-[#242D3D] px-4 py-2.5 rounded-xl">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-[#FF9F1C]" />
          <span className="text-xs font-mono text-[#8C9BAE]">
            Target Latency: <strong className="text-[#FF9F1C]">Under 60s from open to practice</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1A2230] text-[#2EC4B6] border border-[#2EC4B6]/30">
            {simTimer}s / 60s
          </span>
          <button
            onClick={handleStartSimulation}
            disabled={isSimulating}
            className="px-3 py-1 bg-[#FF9F1C] hover:bg-[#FF9F1C]/90 text-[#0B0E14] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Simulate Flow</span>
          </button>
        </div>
      </div>

      {/* 4 Connected Step Nodes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const isPassed = activeStep > step.id;

          return (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(step.id);
                setIsSimulating(false);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? "bg-[#18202D] border-[#FF9F1C] shadow-[0_0_15px_rgba(255,159,28,0.2)]"
                  : isPassed
                  ? "bg-[#121924] border-[#2EC4B6]/50 text-[#CAD5E2]"
                  : "bg-[#10141C] border-[#222938] hover:border-[#3A465E] opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#FF9F1C]">
                    Step 0{step.id}
                  </span>
                  <span className="text-[10px] font-mono text-[#8C9BAE]">
                    {step.timeSec}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#F5F1E8] mb-1">
                  {step.name}
                </h4>
                <p className="text-[11px] text-[#8C9BAE] line-clamp-2">
                  {step.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#242D3D] flex items-center justify-between text-[10px]">
                <span className={isActive ? "text-[#FF9F1C] font-semibold" : "text-[#8C9BAE]"}>
                  {isActive ? "Active Phase" : isPassed ? "Complete ✓" : "Upcoming"}
                </span>
                <ChevronRight className="w-3 h-3 text-[#8C9BAE]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Interactive Demo Screen */}
      <div className="bg-[#141A26] border border-[#2EC4B6]/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-[#242D3D] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2EC4B6] animate-ping" />
            <span className="text-xs uppercase font-mono text-[#2EC4B6] tracking-wider font-semibold">
              Live Mockup: Step {current.id} — {current.name}
            </span>
          </div>
          <span className="text-xs font-mono text-[#8C9BAE]">
            Decision Latency: ~10 seconds
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-[#0D121B] rounded-xl border border-[#1F283A]">
            <p className="text-xs text-[#8C9BAE] uppercase font-mono mb-1">Interactive Interface Prompt</p>
            <h5 className="text-base font-serif text-[#F5F1E8] font-medium">
              "{current.mockUI.prompt}"
            </h5>
          </div>

          <div className="p-3 bg-[#1B2433] rounded-xl border border-[#2E3C52] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#2EC4B6]">
              <Sparkles className="w-4 h-4 text-[#FF9F1C]" />
              <span className="font-medium text-[#F5F1E8]">{current.mockUI.actionLabel}</span>
            </div>
            <span className="text-[10px] font-mono bg-[#FF9F1C]/20 text-[#FF9F1C] px-2 py-0.5 rounded">
              Verified
            </span>
          </div>

          <p className="text-xs text-[#8C9BAE]">
            <strong className="text-[#CAD5E2]">UX Insight: </strong>
            {current.mockUI.details}
          </p>
        </div>
      </div>
    </div>
  );
};
