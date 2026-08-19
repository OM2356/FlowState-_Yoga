import React, { useState } from "react";
import { FlowSequence, YogaPose } from "../types";
import { PRESET_FLOWS } from "../data/presetFlows";
import { YOGA_POSES } from "../data/posesData";
import { Hero3DWave } from "./Hero3DWave";
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
  Activity,
  Layers,
  ChevronDown,
  ChevronUp
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
    name: "Calm Stress & Tension",
    tagline: "Slow Down & Release Built-Up Pressure",
    description: "Soothing forward folds, deep relaxing breaths, and gentle hip stretches to quiet busy thoughts and relax your body.",
    icon: CloudRain,
    colorBg: "bg-[#EAE4DC]",
    colorBorder: "border-[#D6CCBD]",
    colorText: "text-[#59685B]",
    suggestedDuration: 15,
    flowId: "desk-worker-reset",
    benefits: ["Slows down a racing heart", "Relieves jaw, neck, and shoulder tight spots", "Brings peaceful mental clarity"]
  },
  {
    id: "sluggish",
    name: "Wake Up & Feel Energized",
    tagline: "Natural Energy Boost & Morning Freshness",
    description: "Gentle flowing stretches and uplifting chest openers to awaken your circulation without feeling exhausted.",
    icon: BatteryCharging,
    colorBg: "bg-[#F3EBE0]",
    colorBorder: "border-[#DFD3C2]",
    colorText: "text-[#8B5A3C]",
    suggestedDuration: 12,
    flowId: "morning-vitality",
    benefits: ["Boosts clean natural energy", "Gently awakens tight morning muscles", "Leaves you refreshed for the day"]
  },
  {
    id: "stiff",
    name: "Ease Desk & Sitting Stiffness",
    tagline: "Unwind Neck, Back & Tight Hips",
    description: "Undo long hours of sitting at a desk with targeted spine rotations, shoulder open-ups, and lower back relief.",
    icon: Activity,
    colorBg: "bg-[#EDE9E1]",
    colorBorder: "border-[#D5CDBE]",
    colorText: "text-[#4E6548]",
    suggestedDuration: 15,
    flowId: "desk-worker-reset",
    benefits: ["Straightens posture comfortably", "Loosens hunched shoulders", "Releases lower back ache"]
  },
  {
    id: "anxious",
    name: "Ground & Steady Your Mind",
    tagline: "Find Balance & Present-Moment Peace",
    description: "Steady balance poses like Tree Pose and Warrior postures to help you feel rooted, centered, and calm.",
    icon: Wind,
    colorBg: "bg-[#ECE6DE]",
    colorBorder: "border-[#D8CFBF]",
    colorText: "text-[#4A5D4D]",
    suggestedDuration: 15,
    flowId: "deep-stress-release",
    benefits: ["Builds steady balance", "Strengthens ankles and feet", "Quiets constant overthinking"]
  },
  {
    id: "evening",
    name: "Unwind for Deep Sleep",
    tagline: "Gentle Floor Stretches for Restful Bedtime",
    description: "Slow floor-based poses and soft breathing to relax every muscle before you head to sleep.",
    icon: Moon,
    colorBg: "bg-[#E6E0D7]",
    colorBorder: "border-[#D2C8BA]",
    colorText: "text-[#455246]",
    suggestedDuration: 20,
    flowId: "evening-wind-down",
    benefits: ["Prepares your mind for deep rest", "Relaxes tired leg and back muscles", "Fosters tranquil calm"]
  },
  {
    id: "confident",
    name: "Build Strength & Confidence",
    tagline: "Core Tone & Steady Body Power",
    description: "Invigorating standing postures and core stabilization to build healthy stamina, balance, and positive energy.",
    icon: Flame,
    colorBg: "bg-[#F3ECE1]",
    colorBorder: "border-[#DECFC0]",
    colorText: "text-[#C1664C]",
    suggestedDuration: 25,
    flowId: "core-stability-flow",
    benefits: ["Strengthens abdominal core", "Improves posture and physical stability", "Builds sustained endurance"]
  },
  {
    id: "surya-namaskar",
    name: "Sun Salutations (Surya Namaskar)",
    tagline: "12 Classical Steps • Rhythmic Whole-Body Flow",
    description: "Flow through traditional sun salutations with smooth breathing for complete whole-body flexibility and warmth.",
    icon: Sun,
    colorBg: "bg-[#FFF4E8]",
    colorBorder: "border-[#EAD3BD]",
    colorText: "text-[#D48B70]",
    suggestedDuration: 15,
    flowId: "morning-vitality",
    benefits: ["Warms up every joint evenly", "Full spine flexibility and stretch", "Builds radiant, uplifting vitality"]
  }
];

export const MoodSessionSelector: React.FC<MoodSessionSelectorProps> = ({
  onStartFlow,
  onInspectPose,
}) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>("stressed");
  const [duration, setDuration] = useState<number>(15);
  const [showPoseTimeline, setShowPoseTimeline] = useState<boolean>(true);

  const currentMood = MOODS.find((m) => m.id === selectedMoodId) || MOODS[0];

  // Match corresponding preset flow or build a customized mood sequence
  const matchingFlow = PRESET_FLOWS.find((f) => f.id === currentMood.flowId) || PRESET_FLOWS[0];

  const handleLaunchMoodFlow = () => {
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
      {/* 3D Wave Interactive Hero Header */}
      <Hero3DWave 
        onQuickStartClick={() => handleLaunchMoodFlow()}
      />

      {/* Top Guided Explainer */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4E6548]">
          <Smile className="w-4 h-4" />
          <span>Choose Your Flow by How You Feel</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C] mt-2">
          How is your body and mind feeling right now?
        </h2>
        <p className="text-sm sm:text-base text-[#57675A] mt-2 max-w-3xl leading-relaxed">
          Yoga works best when your session matches your present mood and energy level. Choose an option below to begin a customized sequence with soothing sound and guidance.
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

      {/* Selected Mood Launch Action Card & Flow Breakdown */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
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

        {/* Pose Timeline in Selected Sequence */}
        <div className="pt-4 border-t border-[#E8DFD2]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#4E6548]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4E6548]">
                Sequence Movement Timeline ({matchingFlow.poses.length} Postures)
              </span>
            </div>
            <button
              onClick={() => setShowPoseTimeline(!showPoseTimeline)}
              className="text-xs text-[#5D6C5F] hover:text-[#1A221C] flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>{showPoseTimeline ? "Hide Breakdown" : "View Breakdown"}</span>
              {showPoseTimeline ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showPoseTimeline && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
              {matchingFlow.poses.map((item, idx) => {
                const poseData = YOGA_POSES.find((p) => p.id === item.poseId) || YOGA_POSES[0];
                return (
                  <div
                    key={idx}
                    onClick={() => onInspectPose(poseData)}
                    className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#DDD3C2] hover:border-[#4E6548] hover:shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
                    title={`Click to inspect 3D form for ${poseData.name}`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-[#718274] mb-1 font-medium">
                        <span>Step {idx + 1}</span>
                        <span className="text-[#8B5A3C]">{item.durationSeconds}s</span>
                      </div>
                      <h4 className="font-serif text-xs font-medium text-[#1A221C] group-hover:text-[#4E6548] transition-colors line-clamp-1">
                        {poseData.name}
                      </h4>
                      <span className="text-[10px] text-[#78887B] italic line-clamp-1">
                        {poseData.sanskritName}
                      </span>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-[#ECE3D5] flex items-center justify-between text-[10px] text-[#4E6548] font-medium">
                      <span>Inspect Form</span>
                      <Eye className="w-3 h-3 text-[#4E6548]" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
