import React, { useState, useEffect } from "react";
import { audioEngine } from "../utils/audioEngine";
import { Wind, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";

interface BreathPattern {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  benefit: string;
}

const BREATH_PATTERNS: BreathPattern[] = [
  {
    id: "box",
    name: "Square / Box Breathing",
    sanskritName: "Sama Vritti Pranayama",
    description: "Equal four-part ratio used to reset the central nervous system and restore laser focus.",
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    benefit: "Calms fight-or-flight & stabilizes blood pressure",
  },
  {
    id: "478",
    name: "4-7-8 Deep Tranquility",
    sanskritName: "Pranava Shanti",
    description: "Extended exhalation stimulates the vagus nerve and triggers deep parasympathetic rest.",
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    benefit: "Ideal for anxiety relief & bedtime sleep preparation",
  },
  {
    id: "diaphragmatic",
    name: "2:1 Vagal Nerve Lengthening",
    sanskritName: "Dirga Pranayama",
    description: "Doubled exhalation ratio promotes profound muscular release and heart-rate recovery.",
    inhale: 4,
    holdIn: 2,
    exhale: 8,
    holdOut: 2,
    benefit: "Soothes emotional tension & releases diaphragm tightness",
  },
];

export const BreathworkStudio: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(BREATH_PATTERNS[0]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<"inhale" | "hold-in" | "exhale" | "hold-out">("inhale");
  const [countdown, setCountdown] = useState<number>(selectedPattern.inhale);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [droneEnabled, setDroneEnabled] = useState<boolean>(true);

  // Switch pattern
  const handleSelectPattern = (pattern: BreathPattern) => {
    setSelectedPattern(pattern);
    setIsActive(false);
    setPhase("inhale");
    setCountdown(pattern.inhale);
    setCyclesCompleted(0);
  };

  useEffect(() => {
    if (!isActive) return;

    if (droneEnabled) {
      audioEngine.startAmbientDrone();
    }

    return () => {
      audioEngine.stopAmbientDrone();
    };
  }, [isActive, droneEnabled]);

  // Main breath loop
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (phase === "inhale") {
            if (selectedPattern.holdIn > 0) {
              setPhase("hold-in");
              audioEngine.playSingingBowl(440); // A4 tone
              return selectedPattern.holdIn;
            } else {
              setPhase("exhale");
              audioEngine.playSingingBowl(330);
              return selectedPattern.exhale;
            }
          } else if (phase === "hold-in") {
            setPhase("exhale");
            audioEngine.playSingingBowl(330); // E4 tone
            return selectedPattern.exhale;
          } else if (phase === "exhale") {
            if (selectedPattern.holdOut > 0) {
              setPhase("hold-out");
              audioEngine.playSingingBowl(261.63);
              return selectedPattern.holdOut;
            } else {
              setPhase("inhale");
              setCyclesCompleted((c) => c + 1);
              audioEngine.playSingingBowl(523.25);
              return selectedPattern.inhale;
            }
          } else {
            // hold-out finish
            setPhase("inhale");
            setCyclesCompleted((c) => c + 1);
            audioEngine.playSingingBowl(523.25);
            return selectedPattern.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, selectedPattern]);

  const togglePractice = () => {
    if (!isActive) {
      setIsActive(true);
      setCountdown(selectedPattern.inhale);
      setPhase("inhale");
      audioEngine.playSingingBowl(523.25);
    } else {
      setIsActive(false);
      audioEngine.stopAmbientDrone();
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe in deeply through the nose, filling lower belly and ribs";
      case "hold-in":
        return "Hold gently with relaxed shoulders and soft throat";
      case "exhale":
        return "Smooth, slow release through parted lips or nose";
      case "hold-out":
        return "Rest in empty stillness before the next wave";
    }
  };

  return (
    <div id="breathwork-studio-container" className="space-y-6">
      {/* Pattern Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {BREATH_PATTERNS.map((p) => {
          const isSelected = selectedPattern.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPattern(p)}
              className={`p-4 rounded-3xl border text-left transition-all ${
                isSelected
                  ? "bg-[#5A6D56] text-white border-[#5A6D56] shadow-sm"
                  : "bg-[#FAF7F2] text-[#2C382E] border-[#E4DCD0] hover:bg-[#F2ECE0]"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-serif font-medium">{p.name}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isSelected ? "bg-white/20 text-white" : "bg-[#EAE2D4] text-[#4A5A4E]"}`}>
                  {p.inhale}-{p.holdIn}-{p.exhale}-{p.holdOut}
                </span>
              </div>
              <span className={`text-[11px] font-serif italic block mt-0.5 ${isSelected ? "text-[#DCE4DC]" : "text-[#88786B]"}`}>
                {p.sanskritName}
              </span>
              <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isSelected ? "text-[#E8EFE8]" : "text-[#5B695E]"}`}>
                {p.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Breathing Orb Arena */}
      <div className="bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#E4DCD0] shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[440px]">
        {/* Top pattern badge */}
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6F7E68]">
            {selectedPattern.name}
          </span>
          <p className="text-xs text-[#7A887C] mt-0.5">{selectedPattern.benefit}</p>
        </div>

        {/* Dynamic Expanding/Contracting Visual Orb */}
        <div className="relative flex items-center justify-center my-6">
          {/* Outer glow rings */}
          <div
            className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${
              !isActive
                ? "scale-95 bg-[#EAE2D4]/50 border border-[#D8CEBF]"
                : phase === "inhale" || phase === "hold-in"
                ? "scale-110 bg-[#5A6D56]/15 border-2 border-[#5A6D56] shadow-xl"
                : "scale-85 bg-[#BF6F55]/15 border-2 border-[#BF6F55] shadow-inner"
            }`}
          >
            {/* Inner pulsating core */}
            <div
              className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                !isActive
                  ? "bg-[#DDD3C2] text-[#4A5A4E]"
                  : phase === "inhale"
                  ? "bg-[#5A6D56] text-white scale-105"
                  : phase === "hold-in"
                  ? "bg-[#4D5E4A] text-white scale-105"
                  : phase === "exhale"
                  ? "bg-[#BF6F55] text-white scale-90"
                  : "bg-[#A65B43] text-white scale-90"
              }`}
            >
              <Wind className="w-6 h-6 mb-1 opacity-80" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                {isActive ? (phase === "hold-in" || phase === "hold-out" ? "Hold" : phase) : "Ready"}
              </span>
              <span className="text-4xl font-serif font-light mt-1">
                {isActive ? countdown : selectedPattern.inhale}
              </span>
            </div>
          </div>
        </div>

        {/* Phase instruction */}
        <p className="text-xs sm:text-sm text-[#4E5D51] font-serif italic max-w-md my-2">
          {isActive ? `"${getPhaseInstruction()}"` : "Click below to begin your guided breathing cycle"}
        </p>

        {/* Cycles Counter */}
        {isActive && (
          <span className="text-xs text-[#7A877E] font-medium mt-1">
            Cycles Completed: <strong className="text-[#324035]">{cyclesCompleted}</strong>
          </span>
        )}

        {/* Controls */}
        <div className="mt-6 flex items-center gap-4">
          <button
            id="btn-toggle-breathwork"
            onClick={togglePractice}
            className="py-3 px-8 rounded-full bg-[#5A6D56] hover:bg-[#485944] text-white font-medium text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            <span>{isActive ? "Pause Breathing" : "Begin Pranayama"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
