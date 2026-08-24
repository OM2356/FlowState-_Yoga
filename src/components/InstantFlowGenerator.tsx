import React, { useState, useMemo } from "react";
import { FlowSequence, FlowItem, YogaPose, BenefitTag } from "../types";
import { YOGA_POSES } from "../data/posesData";
import { MOOD_OPTIONS } from "../data/presetFlows";
import { ThreeYogaHuman } from "./ThreeYogaHuman";
import { 
  Sparkles, 
  Play, 
  Clock, 
  Layers, 
  Wind, 
  Activity, 
  Check, 
  Compass, 
  RefreshCw, 
  ShieldAlert, 
  Monitor, 
  Sun, 
  Moon,
  Rotate3d
} from "lucide-react";

interface InstantFlowGeneratorProps {
  onStartFlow: (flow: FlowSequence) => void;
  onInspectPose: (pose: YogaPose) => void;
}

export const InstantFlowGenerator: React.FC<InstantFlowGeneratorProps> = ({
  onStartFlow,
  onInspectPose,
}) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>("stiff-desk");
  const [selectedPhysicalFocus, setSelectedPhysicalFocus] = useState<string[]>(["hamstrings", "erectorSpinae"]);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Compile a personalized flow based on selected criteria
  const compiledFlow = useMemo<FlowSequence>(() => {
    const selectedMood = MOOD_OPTIONS.find((m) => m.id === selectedMoodId) || MOOD_OPTIONS[0];

    // Filter poses matching target benefits & physical regions
    let candidatePoses = YOGA_POSES.filter((p) => {
      const matchBenefit = p.benefits.includes(selectedMood.recommendedTag as BenefitTag);
      const matchMuscle = p.primaryMuscles.some((m) => selectedPhysicalFocus.includes(m));
      return matchBenefit || matchMuscle;
    });

    if (candidatePoses.length < 4) {
      candidatePoses = YOGA_POSES;
    }

    // Determine number of poses based on duration
    const poseCount = durationMinutes === 5 ? 4 : durationMinutes === 15 ? 7 : durationMinutes === 25 ? 9 : 12;
    const avgDuration = Math.round((durationMinutes * 60) / poseCount);

    // Structure: Warmup -> Standing/Balancing -> Peak/Twist -> Savasana
    const selectedFlowItems: FlowItem[] = [];

    // Always start with grounding opening (e.g. Child's pose or Tadasana)
    const opening = YOGA_POSES.find((p) => p.id === "child-pose") || YOGA_POSES[0];
    selectedFlowItems.push({
      poseId: opening.id,
      durationSeconds: Math.max(60, avgDuration),
      note: "Ground your breath and set an intention for your practice."
    });

    // Add candidate poses up to count - 1
    const filteredCandidates = candidatePoses.filter((p) => p.id !== "child-pose" && p.id !== "savasana");
    for (let i = 0; i < Math.min(poseCount - 2, filteredCandidates.length); i++) {
      const p = filteredCandidates[i % filteredCandidates.length];
      selectedFlowItems.push({
        poseId: p.id,
        durationSeconds: avgDuration,
        note: p.stepByStepInstructions[0] || "Maintain even, rhythmic breathing."
      });
    }

    // Always finish with Savasana
    const savasana = YOGA_POSES.find((p) => p.id === "savasana") || YOGA_POSES[0];
    selectedFlowItems.push({
      poseId: savasana.id,
      durationSeconds: Math.max(90, Math.round(durationMinutes * 12)),
      note: "Rest in effortless surrender."
    });

    return {
      id: `instant-flow-${selectedMoodId}-${durationMinutes}`,
      title: `${selectedMood.label} Recovery Sequence`,
      subtitle: `${durationMinutes}-minute tailored ritual focusing on ${selectedMood.subtext.toLowerCase()}.`,
      durationMinutes,
      category: "recovery",
      difficulty: experienceLevel,
      physicalFocus: selectedPhysicalFocus,
      mentalFocus: selectedMood.subtext,
      description: `Formulated specifically for your state of being. Moves steadily through ${selectedFlowItems.length} poses with anatomical precision.`,
      bannerGradient: "from-[#F5EFEB] to-[#E8DEC8]",
      poses: selectedFlowItems,
      isCustom: true,
    };
  }, [selectedMoodId, selectedPhysicalFocus, durationMinutes, experienceLevel]);

  const toggleMuscleFocus = (muscle: string) => {
    if (selectedPhysicalFocus.includes(muscle)) {
      if (selectedPhysicalFocus.length > 1) {
        setSelectedPhysicalFocus(selectedPhysicalFocus.filter((m) => m !== muscle));
      }
    } else {
      setSelectedPhysicalFocus([...selectedPhysicalFocus, muscle]);
    }
  };

  return (
    <div id="instant-flow-generator-container" className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E4DCD0] shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DE] text-xs font-semibold text-[#5A6D56] border border-[#DDD3C2] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#BF6F55]" />
            <span>State-Based Flow Generator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1E241F] tracking-tight">
            Tap How You Feel — Receive Your Ready Ritual
          </h2>
          <p className="text-sm text-[#5D6B60] mt-1.5 leading-relaxed font-sans">
            Tell FlowState where you hold tension and your mental weather. We compose a seamless sequence with anatomical cues and realistic human movement guides.
          </p>
        </div>

        {/* Step 1: Mood & Energy Matrix */}
        <div className="mt-6 pt-6 border-t border-[#E8DFD0]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68] block mb-3">
            1. Current Mental / Emotional Weather
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = selectedMoodId === mood.id;
              return (
                <button
                  key={mood.id}
                  id={`mood-option-${mood.id}`}
                  onClick={() => setSelectedMoodId(mood.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[95px] ${
                    isSelected
                      ? "bg-[#5A6D56] text-white border-[#5A6D56] shadow-sm scale-[1.02]"
                      : "bg-[#F5F0E6] text-[#2C382E] border-[#E2D8C8] hover:bg-[#EBE2D4]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold leading-tight">{mood.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </div>
                  <span className={`text-[10px] line-clamp-2 mt-1 leading-snug ${isSelected ? "text-[#DCE4DB]" : "text-[#77867B]"}`}>
                    {mood.subtext}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Physical Tension Areas */}
        <div className="mt-6 pt-6 border-t border-[#E8DFD0]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68] block mb-3">
            2. Physical Focus & Muscle Tension Areas
          </span>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "erectorSpinae", label: "Spine & Upper Back" },
              { id: "hamstrings", label: "Hamstrings & Legs" },
              { id: "hipFlexors", label: "Hip Flexors & Psoas" },
              { id: "glutes", label: "Glutes & Piriformis" },
              { id: "deltoidsShoulders", label: "Shoulders & Trapezius" },
              { id: "pectoralisChest", label: "Chest & Heart Opener" },
              { id: "coreAbdominals", label: "Core & Abdominals" },
              { id: "calvesAnkles", label: "Calves & Feet" }
            ].map((muscle) => {
              const isSelected = selectedPhysicalFocus.includes(muscle.id);
              return (
                <button
                  key={muscle.id}
                  id={`muscle-focus-${muscle.id}`}
                  onClick={() => toggleMuscleFocus(muscle.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-[#BF6F55] text-white border-[#BF6F55] shadow-xs"
                      : "bg-[#F3ECE1] text-[#475549] border-[#DFD6C7] hover:bg-[#E6DCCF]"
                  }`}
                >
                  {muscle.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Duration & Level */}
        <div className="mt-6 pt-6 border-t border-[#E8DFD0] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68] block mb-2">
              3. Practice Duration
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { min: 5, label: "5m Express" },
                { min: 15, label: "15m Reset" },
                { min: 25, label: "25m Deep" },
                { min: 40, label: "40m Immersion" }
              ].map((d) => (
                <button
                  key={d.min}
                  id={`duration-btn-${d.min}`}
                  onClick={() => setDurationMinutes(d.min)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium border text-center transition-all ${
                    durationMinutes === d.min
                      ? "bg-[#5A6D56] text-white border-[#5A6D56] shadow-xs"
                      : "bg-[#F5F0E6] text-[#475549] border-[#DFD6C7] hover:bg-[#EBE3D6]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68] block mb-2">
              4. Intensity / Experience
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: "beginner", label: "Gentle / Novice" },
                { level: "intermediate", label: "Standard Flow" },
                { level: "advanced", label: "Deep Stretch" }
              ].map((lvl) => (
                <button
                  key={lvl.level}
                  id={`level-btn-${lvl.level}`}
                  onClick={() => setExperienceLevel(lvl.level as any)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium border text-center transition-all ${
                    experienceLevel === lvl.level
                      ? "bg-[#5A6D56] text-white border-[#5A6D56] shadow-xs"
                      : "bg-[#F5F0E6] text-[#475549] border-[#DFD6C7] hover:bg-[#EBE3D6]"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Sequence Output Card with Interactive Human Visualizer */}
      {compiledFlow && (
        <div id="compiled-flow-card" className="bg-[#FAF8F4] p-6 sm:p-8 rounded-3xl border border-[#E0D7C9] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A6D56]/15 text-[#4D604A] font-semibold text-xs uppercase tracking-wider">
                  Generated Sequence
                </span>
                <span className="text-xs text-[#7A877E] font-medium">
                  {compiledFlow.durationMinutes} Minutes • {compiledFlow.poses.length} Postures
                </span>
              </div>
              <h3 className="text-2xl font-serif font-medium text-[#1E241F] mt-1">
                {compiledFlow.title}
              </h3>
              <p className="text-xs text-[#5D6B60] mt-0.5">{compiledFlow.subtitle}</p>
            </div>

            <button
              id="btn-start-compiled-flow"
              onClick={() => onStartFlow(compiledFlow)}
              className="py-3 px-6 rounded-2xl bg-[#5A6D56] hover:bg-[#485944] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Guided Practice</span>
            </button>
          </div>

          {/* Sequence Postures Timeline with Human Avatar previews */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68]">
              Sequence Movement Path
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {compiledFlow.poses.map((item, idx) => {
                const poseData = YOGA_POSES.find((p) => p.id === item.poseId) || YOGA_POSES[0];
                return (
                  <div
                    key={idx}
                    id={`flow-step-${idx}`}
                    onClick={() => onInspectPose(poseData)}
                    className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#E2D8C8] hover:border-[#BF6F55] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#7C8B80] mb-1">
                        <span className="font-serif">#{idx + 1}</span>
                        <span className="font-medium bg-[#E8DFD0] px-2 py-0.5 rounded-md text-[#4E5E51] text-[10px]">
                          {item.durationSeconds}s
                        </span>
                      </div>
                      <h5 className="text-sm font-serif font-medium text-[#222924] group-hover:text-[#BF6F55] transition-colors">
                        {poseData.name}
                      </h5>
                      <span className="text-[11px] font-serif italic text-[#8B786B] block">
                        {poseData.sanskritName}
                      </span>
                    </div>

                    {/* Compact 3D Human Pose Preview */}
                    <div className="mt-3 h-[130px] rounded-xl overflow-hidden bg-[#FAF7F0] border border-[#EAE1D3] relative">
                      <ThreeYogaHuman
                        pose={poseData}
                        height={130}
                        interactiveControls={false}
                        className="w-full h-full"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white flex items-center gap-0.5">
                        <Rotate3d className="w-2.5 h-2.5" />
                        <span>3D</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
