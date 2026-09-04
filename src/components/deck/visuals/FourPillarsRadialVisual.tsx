import React, { useState } from "react";
import { Sparkles, Activity, Moon, Sun, Flame, Wind, Droplets, Compass } from "lucide-react";

interface PillarDetail {
  id: string;
  name: string;
  sanskrit: string;
  category: string;
  color: string;
  glow: string;
  icon: string;
  summary: string;
  keyOutputs: string[];
  scientificMechanism: string;
}

const PILLARS: PillarDetail[] = [
  {
    id: "yoga",
    name: "Yoga & Movement",
    sanskrit: "Asana & Kriya",
    category: "Physical Alignment & Vitality",
    color: "#FF9F1C",
    glow: "rgba(255, 159, 28, 0.3)",
    icon: "🧘",
    summary: "Guided, alignment-safe biomechanical sequences adapting dynamically to individual anatomy, mobility, and stress levels.",
    keyOutputs: ["3D skeletal joint kinematics", "Spine decompression flows", "Pelvic & core stabilization"],
    scientificMechanism: "Enhances somatic proprioception, lowers resting cortisol, and mobilizes fascial planes."
  },
  {
    id: "ayurveda",
    name: "Ayurveda",
    sanskrit: "Dinacharya & Ahara",
    category: "Metabolic & Circadian Constitution",
    color: "#2EC4B6",
    glow: "rgba(46, 196, 182, 0.3)",
    icon: "🌿",
    summary: "Dosha-based daily lifestyle and nutritional protocols calibrated to seasonal shifts (Ritucharya) and digestive fire (Agni).",
    keyOutputs: ["Vata / Pitta / Kapha balancing recipes", "Circadian meal timing windows", "Herbal adaptogens & rasayanas"],
    scientificMechanism: "Aligns nutritional intake with peripheral circadian clocks and optimizes gut microbiome diversity."
  },
  {
    id: "meditation",
    name: "Meditation & Breath",
    sanskrit: "Pranayama & Dhyana",
    category: "Autonomic Nervous System Regulation",
    color: "#D4AF37",
    glow: "rgba(212, 175, 55, 0.3)",
    icon: "🧠",
    summary: "Precision breath pacing (Nadi Shodhana, Bhramari, Sheetali) and mindfulness tools for sleep architecture and acute stress resets.",
    keyOutputs: ["Coherent 5.5s breath timers", "Evening sleep induction sadhana", "Subtle energy balance"],
    scientificMechanism: "Direct vagus nerve stimulation inducing parasympathetic shift and elevating Heart Rate Variability (HRV)."
  },
  {
    id: "jyotish",
    name: "Jyotish & Cosmic Rhythms",
    sanskrit: "Kala & Biorhythms",
    category: "Self-Awareness & Habit Timing",
    color: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.3)",
    icon: "⭐",
    summary: "Astronomical self-awareness framework utilizing lunar, solar, and planetary cycles for optimal habit timing and mental reflection.",
    keyOutputs: ["Biorhythm habit calendar", "Lunar phase mindfulness", "Seasonal energy mapping"],
    scientificMechanism: "Leverages chronological self-reflection and zeitgeber synchrony for consistent behavioral adherence."
  }
];

export const FourPillarsRadialVisual: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<PillarDetail>(PILLARS[0]);

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-6">
      {/* Radial Convergence Diagram */}
      <div className="relative w-[320px] sm:w-[360px] h-[320px] sm:h-[360px] shrink-0 flex items-center justify-center">
        {/* Connecting Radial Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 360">
          {/* Outer Orbit Rings */}
          <circle cx="180" cy="180" r="130" stroke="#242D3D" strokeWidth="1.5" fill="none" />
          <circle cx="180" cy="180" r="130" stroke={selectedPillar.color} strokeWidth="1" strokeDasharray="6 6" fill="none" opacity="0.4" className="animate-spin" style={{ animationDuration: "30s" }} />

          {/* Convergence lines from pillars to center */}
          <line x1="180" y1="50" x2="180" y2="180" stroke={selectedPillar.id === "yoga" ? "#FF9F1C" : "#3A3F4B"} strokeWidth={selectedPillar.id === "yoga" ? "2" : "1"} />
          <line x1="310" y1="180" x2="180" y2="180" stroke={selectedPillar.id === "ayurveda" ? "#2EC4B6" : "#3A3F4B"} strokeWidth={selectedPillar.id === "ayurveda" ? "2" : "1"} />
          <line x1="180" y1="310" x2="180" y2="180" stroke={selectedPillar.id === "meditation" ? "#D4AF37" : "#3A3F4B"} strokeWidth={selectedPillar.id === "meditation" ? "2" : "1"} />
          <line x1="50" y1="180" x2="180" y2="180" stroke={selectedPillar.id === "jyotish" ? "#8B5CF6" : "#3A3F4B"} strokeWidth={selectedPillar.id === "jyotish" ? "2" : "1"} />
        </svg>

        {/* Central Core Profile Node */}
        <div className="relative z-10 w-28 h-28 rounded-full bg-[#121722] border-2 border-[#D4AF37] p-2 flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(212,175,55,0.25)]">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#D4AF37]">
            One Profile
          </span>
          <span className="text-[11px] text-[#F5F1E8] font-medium leading-tight">
            Unified Data Layer
          </span>
        </div>

        {/* Pillar 1: Top (Yoga) */}
        <button
          onClick={() => setSelectedPillar(PILLARS[0])}
          className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
            selectedPillar.id === "yoga"
              ? "bg-[#1E1712] border-2 border-[#FF9F1C] scale-110 shadow-[0_0_15px_rgba(255,159,28,0.4)]"
              : "bg-[#121620] border border-[#242D3D] hover:border-[#FF9F1C]/60"
          }`}
        >
          <span className="text-xl">🧘</span>
          <span className="text-[9px] font-mono text-[#FF9F1C] font-semibold">Yoga</span>
        </button>

        {/* Pillar 2: Right (Ayurveda) */}
        <button
          onClick={() => setSelectedPillar(PILLARS[1])}
          className={`absolute top-1/2 -translate-y-1/2 right-2 z-20 w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
            selectedPillar.id === "ayurveda"
              ? "bg-[#101F1D] border-2 border-[#2EC4B6] scale-110 shadow-[0_0_15px_rgba(46,196,182,0.4)]"
              : "bg-[#121620] border border-[#242D3D] hover:border-[#2EC4B6]/60"
          }`}
        >
          <span className="text-xl">🌿</span>
          <span className="text-[9px] font-mono text-[#2EC4B6] font-semibold">Ayurveda</span>
        </button>

        {/* Pillar 3: Bottom (Meditation) */}
        <button
          onClick={() => setSelectedPillar(PILLARS[2])}
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
            selectedPillar.id === "meditation"
              ? "bg-[#1E1B12] border-2 border-[#D4AF37] scale-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              : "bg-[#121620] border border-[#242D3D] hover:border-[#D4AF37]/60"
          }`}
        >
          <span className="text-xl">🧠</span>
          <span className="text-[9px] font-mono text-[#D4AF37] font-semibold">Breath</span>
        </button>

        {/* Pillar 4: Left (Jyotish) */}
        <button
          onClick={() => setSelectedPillar(PILLARS[3])}
          className={`absolute top-1/2 -translate-y-1/2 left-2 z-20 w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
            selectedPillar.id === "jyotish"
              ? "bg-[#191522] border-2 border-[#8B5CF6] scale-110 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
              : "bg-[#121620] border border-[#242D3D] hover:border-[#8B5CF6]/60"
          }`}
        >
          <span className="text-xl">⭐</span>
          <span className="text-[9px] font-mono text-[#8B5CF6] font-semibold">Jyotish</span>
        </button>
      </div>

      {/* Detail Pane for Selected Pillar */}
      <div className="flex-1 w-full bg-[#131822] border border-[#242D3D] rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none"
          style={{ background: selectedPillar.glow }}
        />

        <div className="flex items-center justify-between mb-3 border-b border-[#242D3D] pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-[#1A2230] border border-[#2A354A]">
              {selectedPillar.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-serif text-[#F5F1E8] font-semibold">
                  {selectedPillar.name}
                </h4>
                <span className="text-xs font-mono text-[#8C9BAE] italic">({selectedPillar.sanskrit})</span>
              </div>
              <p className="text-xs font-mono" style={{ color: selectedPillar.color }}>
                {selectedPillar.category}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#CAD5E2] leading-relaxed mb-4">
          {selectedPillar.summary}
        </p>

        {/* Key Functional Outputs */}
        <div className="mb-4">
          <span className="text-[11px] uppercase tracking-wider text-[#8C9BAE] font-mono block mb-2 font-semibold">
            Key Integrations
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {selectedPillar.keyOutputs.map((item, idx) => (
              <div key={idx} className="bg-[#19202E] border border-[#263246] p-2 rounded-lg text-xs text-[#E3ECF6]">
                • {item}
              </div>
            ))}
          </div>
        </div>

        {/* Scientific Mechanism */}
        <div className="p-3 rounded-xl bg-[#0E131C] border border-[#1E2738] flex items-start justify-between gap-2.5 text-xs text-[#8C9BAE]">
          <div className="flex items-start gap-2.5">
            <Activity className="w-4 h-4 shrink-0 text-[#2EC4B6] mt-0.5" />
            <div>
              <span className="text-[#F5F1E8] font-medium">Underlying Mechanism: </span>
              <span>{selectedPillar.scientificMechanism}</span>
            </div>
          </div>

          {selectedPillar.id === "yoga" && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-pose-studio"))}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-[#FF9F1C]/20 hover:bg-[#FF9F1C]/30 text-[#FF9F1C] border border-[#FF9F1C]/40 font-mono text-[10px] font-semibold flex items-center gap-1 transition-all"
            >
              <span>Test Live 3D Rig</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
