import React, { useState } from "react";
import { FlowSequence, YogaPose } from "../types";
import { PRESET_FLOWS } from "../data/presetFlows";
import { YOGA_POSES } from "../data/posesData";
import { 
  Smile, 
  Sparkles, 
  Sun, 
  Moon, 
  Flame, 
  Wind, 
  CloudRain, 
  BatteryCharging, 
  ShieldAlert, 
  Compass, 
  Play, 
  Clock, 
  Heart, 
  ArrowRight,
  Eye,
  CheckCircle2,
  Activity
} from "lucide-react";

interface MoodSessionSelectorProps {
  onStartFlow: (flow: FlowSequence) => void;
  onInspectPose: (pose: YogaPose) => void;
}

interface MoodProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: any;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  suggestedDuration: number;
  flowId: string;
  benefits: string[];
}

const MOODS: MoodProfile[] = [
  {
    id: "stressed",
    name: "Stressed & Overwhelmed",
    tagline: "Somatic De-stress & Nervous System Reset",
    description: "Long exhales, grounding forward folds, and restorative hip openers to calm racing thoughts and drop cortisol.",
    icon: CloudRain,
    colorBg: "bg-[#EAE4DC]",
    colorBorder: "border-[#D6CCBD]",
    colorText: "text-[#59685B]",
    suggestedDuration: 15,
    flowId: "desk-worker-reset",
    benefits: ["Lowers sympathetic heart rate", "Releases jaw & shoulder tension", "Promotes mental clarity"]
  },
  {
    id: "sluggish",
    name: "Sluggish & Fatigued",
    tagline: "Gentle Prana Energizer & Spine Activation",
    description: "Dynamic fluid stretches, gentle backbends, and heart openers to wake up circulation without exhausting you.",
    icon: BatteryCharging,
    colorBg: "bg-[#F3EBE0]",
    colorBorder: "border-[#DFD3C2]",
    colorText: "text-[#8B5A3C]",
    suggestedDuration: 12,
    flowId: "morning-vitality",
    benefits: ["Stimulates cerebral blood flow", "Awakens dormant hip flexors", "Boosts natural vitality"]
  },
  {
    id: "stiff",
    name: "Desk Stiff & Cramped",
    tagline: "Upper Back, Neck & Hip Unlocking Flow",
    description: "Counteract hours of sitting and keyboard hunching with targeted spine rotations, chest expansion, and glute relief.",
    icon: Activity,
    colorBg: "bg-[#EDE9E1]",
    colorBorder: "border-[#D5CDBE]",
    colorText: "text-[#4E6548]",
    suggestedDuration: 15,
    flowId: "desk-worker-reset",
    benefits: ["Restores cervical spine curve", "Lengthens tight pectorals", "Decompresses lower lumbar"]
  },
  {
    id: "anxious",
    name: "Restless & Distracted",
    tagline: "4-4-4 Grounding & Balance Flow",
    description: "Steady standing balance postures like Tree Pose and Warrior II to anchor your mind into the present moment.",
    icon: Wind,
    colorBg: "bg-[#ECE6DE]",
    colorBorder: "border-[#D8CFBF]",
    colorText: "text-[#4A5D4D]",
    suggestedDuration: 15,
    flowId: "deep-stress-release",
    benefits: ["Builds single-point focus", "Strengthens stabilizing ankles", "Calms internal chatter"]
  },
  {
    id: "evening",
    name: "Ready for Deep Sleep",
    tagline: "Parasympathetic Wind-Down & Melatonin Prep",
    description: "Floor-based slow poses and passive gravity stretches to melt physical tension before bedtime.",
    icon: Moon,
    colorBg: "bg-[#E6E0D7]",
    colorBorder: "border-[#D2C8BA]",
    colorText: "text-[#455246]",
    suggestedDuration: 20,
    flowId: "evening-wind-down",
    benefits: ["Prepares nervous system for REM", "Deep hamstring & calf relaxation", "Promotes nocturnal stillness"]
  },
  {
    id: "confident",
    name: "Empowered & Strong",
    tagline: "Core Integration & Solar Strength Flow",
    description: "Build heat, strengthen your core cylinder, and expand stamina with steady Warrior postures and plank balance.",
    icon: Flame,
    colorBg: "bg-[#F3ECE1]",
    colorBorder: "border-[#DECFC0]",
    colorText: "text-[#C1664C]",
    suggestedDuration: 25,
    flowId: "core-stability-flow",
    benefits: ["Tones deep transverse abs", "Improves posture & confidence", "Builds sustained stamina"]
  }
];

export const MoodSessionSelector: React.FC<MoodSessionSelectorProps> = ({
  onStartFlow,
  onInspectPose,
}) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>("stressed");
  const [duration, setDuration] = useState<number>(15);

  const currentMood = MOODS.find((m) => m.id === selectedMoodId) || MOODS[0];

  // Match corresponding preset flow or build a customized mood sequence
  const matchingFlow = PRESET_FLOWS.find((f) => f.id === currentMood.flowId) || PRESET_FLOWS[0];

  const handleLaunchMoodFlow = () => {
    // Generate flow adapted to selected duration
    const customMoodFlow: FlowSequence = {
      ...matchingFlow,
      id: `mood-${currentMood.id}-${Date.now()}`,
      title: `${currentMood.name}: ${currentMood.tagline}`,
      subtitle: `${duration}-minute mindful practice designed to meet your current emotional and physical state.`,
      durationMinutes: duration,
      mentalFocus: currentMood.description,
      isCustom: true
    };
    onStartFlow(customMoodFlow);
  };

  return (
    <div id="mood-selector-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4E6548]">
          <Smile className="w-4 h-4" />
          <span>Somatic Mood & Emotional State Selector</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C] mt-2">
          How are you feeling right now?
        </h2>
        <p className="text-sm sm:text-base text-[#57675A] mt-2 max-w-3xl leading-relaxed">
          Yoga is most transformative when practice aligns with your current mental state. Select your mood to receive a tailored sequence with calibrated breath pacers.
        </p>
      </div>

      {/* Mood Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOODS.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMoodId === mood.id;

          return (
            <div
              key={mood.id}
              id={`mood-card-${mood.id}`}
              onClick={() => {
                setSelectedMoodId(mood.id);
                setDuration(mood.suggestedDuration);
              }}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#FAF8F4] border-[#4E6548] ring-2 ring-[#4E6548]/20 shadow-sm"
                  : "bg-[#FAF7F2] border-[#E0D7C9] hover:border-[#4E6548]/50 hover:bg-[#F5EFE5]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl ${mood.colorBg} ${mood.colorText} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#4E6548] bg-[#4E6548]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-medium text-[#1A221C]">
                  {mood.name}
                </h3>
                <span className="text-xs font-semibold text-[#8B5A3C] block mt-0.5">
                  {mood.tagline}
                </span>

                <p className="text-xs sm:text-sm text-[#506053] mt-2.5 leading-relaxed">
                  {mood.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8DFD2] flex items-center justify-between text-xs text-[#637366]">
                <span>Recommended: <strong>{mood.suggestedDuration} mins</strong></span>
                <span className="text-[#4E6548] font-semibold flex items-center gap-0.5">
                  Select <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Mood Launch Action Card */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4E6548] bg-[#4E6548]/10 px-3 py-1 rounded-full">
              Tailored Practice Ready
            </span>
            <span className="text-xs text-[#718274]">• {currentMood.name}</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1A221C]">
            Ready for your {currentMood.tagline}
          </h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-[#445347] pt-1">
            {currentMood.benefits.map((b, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4E6548]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Duration picker & Start button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-1 bg-[#ECE4D6] p-1 rounded-2xl border border-[#DDD3C2] w-full sm:w-auto justify-center">
            {[10, 15, 20, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => setDuration(mins)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  duration === mins
                    ? "bg-[#FAF8F4] text-[#1A221C] shadow-2xs"
                    : "text-[#5A6A5D] hover:text-[#1A221C]"
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>

          <button
            id="btn-launch-mood-session"
            onClick={handleLaunchMoodFlow}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Begin {duration}-Min Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
