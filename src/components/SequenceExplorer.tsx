import React, { useState } from "react";
import { FlowSequence, FlowCategory, YogaPose } from "../types";
import { PRESET_FLOWS } from "../data/presetFlows";
import { YOGA_POSES } from "../data/posesData";
import { ThreeYogaHuman } from "./ThreeYogaHuman";
import { 
  Play, 
  Clock, 
  Sparkles, 
  Flame, 
  Moon, 
  Sun, 
  Wind, 
  Activity, 
  Plus, 
  ChevronRight, 
  Compass, 
  Bot, 
  Send,
  Filter,
  Check,
  Rotate3d
} from "lucide-react";

interface SequenceExplorerProps {
  onStartFlow: (flow: FlowSequence) => void;
  onInspectPose: (pose: YogaPose) => void;
  onOpenCustomBuilder: () => void;
}

const CATEGORY_OPTIONS = [
  { id: "deskRelief", label: "Desk & Posture Reset", icon: "🪑" },
  { id: "recovery", label: "Athletic & Deep Recovery", icon: "🏃" },
  { id: "energy", label: "Morning & Vitality", icon: "☀️" },
  { id: "sleep", label: "Bedtime & Rest", icon: "🌙" },
];

const DIFFICULTY_OPTIONS = [
  { id: "beginner", label: "Gentle / Beginner" },
  { id: "intermediate", label: "Moderate / Intermediate" },
  { id: "advanced", label: "Dynamic / Advanced" },
];

export const SequenceExplorer: React.FC<SequenceExplorerProps> = ({
  onStartFlow,
  onInspectPose,
  onOpenCustomBuilder,
}) => {
  // Multi-category state: array of selected category IDs
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [maxMinutes, setMaxMinutes] = useState<number | null>(null);

  const [userCustomFlows, setUserCustomFlows] = useState<FlowSequence[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("flowstate_custom_flows") || "[]");
    } catch {
      return [];
    }
  });

  // AI Flow Generation State
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiGeneratedFlow, setAiGeneratedFlow] = useState<FlowSequence | null>(null);

  const allFlows = [...userCustomFlows, ...PRESET_FLOWS];

  // Toggle multi-select category
  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const toggleDifficulty = (diffId: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diffId) ? prev.filter((id) => id !== diffId) : [...prev, diffId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setMaxMinutes(null);
  };

  // Multi-Category filtered flows
  const filteredFlows = allFlows.filter((flow) => {
    // Category match (if any selected, must match one)
    if (selectedCategories.length > 0 && !selectedCategories.includes(flow.category)) {
      return false;
    }
    // Difficulty match
    if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(flow.difficulty)) {
      return false;
    }
    // Duration filter
    if (maxMinutes && flow.durationMinutes > maxMinutes) {
      return false;
    }
    return true;
  });

  // Generate Flow with Gemini AI API (with fallback)
  const handleGenerateAiFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    try {
      const response = await fetch("/api/ai/generate-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          physicalFeeling: aiPrompt,
          durationMinutes: 15,
          experienceLevel: "All levels",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate sequence");
      const data = await response.json();
      
      const newAiFlow: FlowSequence = {
        id: "ai-flow-" + Date.now(),
        title: "Intelligent Custom Ritual",
        subtitle: `Custom sequence tailored for: "${aiPrompt.slice(0, 45)}..."`,
        durationMinutes: 15,
        category: "recovery",
        difficulty: "intermediate",
        physicalFocus: ["hamstrings", "erectorSpinae", "hipFlexors"],
        mentalFocus: "Release tension & restore equilibrium",
        description: "A tailored sequence targeting deep myofascial release and spinal decompression.",
        bannerGradient: "from-[#F3ECE1] to-[#E2D6C3]",
        poses: Array.isArray(data.flow) && data.flow.length > 0 
          ? data.flow.map((p: any) => ({
              poseId: p.poseName?.toLowerCase().includes("dog") ? "downward-dog" : p.poseName?.toLowerCase().includes("cat") ? "cat-cow" : p.poseName?.toLowerCase().includes("warrior") ? "warrior-2" : p.poseName?.toLowerCase().includes("pigeon") ? "half-pigeon" : "child-pose",
              durationSeconds: p.durationSeconds || 60,
              note: p.breathCue || p.biomechanicalTip || "Breathe deeply into posture."
            }))
          : [
              { poseId: "child-pose", durationSeconds: 60, note: "Calm the central nervous system." },
              { poseId: "cat-cow", durationSeconds: 60, note: "Mobilize thoracic spine." },
              { poseId: "downward-dog", durationSeconds: 45, note: "Lengthen posterior chain." },
              { poseId: "warrior-2", durationSeconds: 45, side: "right", note: "Root through back heel." },
              { poseId: "half-pigeon", durationSeconds: 60, side: "right", note: "Release deep hip tension." },
              { poseId: "savasana", durationSeconds: 120, note: "Absorb full restoration." },
            ],
        isCustom: true,
      };
      setAiGeneratedFlow(newAiFlow);
    } catch (err) {
      console.error(err);
      const fallback: FlowSequence = {
        id: "ai-flow-" + Date.now(),
        title: "Intelligent Custom Ritual",
        subtitle: `Tailored flow for: "${aiPrompt.slice(0, 40)}..."`,
        durationMinutes: 15,
        category: "recovery",
        difficulty: "intermediate",
        physicalFocus: ["hamstrings", "erectorSpinae", "hipFlexors"],
        mentalFocus: "Release tension & restore equilibrium",
        description: "A tailored sequence targeting deep myofascial release and spinal decompression.",
        bannerGradient: "from-[#F3ECE1] to-[#E2D6C3]",
        poses: [
          { poseId: "child-pose", durationSeconds: 60, note: "Calm the nervous system." },
          { poseId: "downward-dog", durationSeconds: 45, note: "Lengthen spine." },
          { poseId: "half-pigeon", durationSeconds: 60, side: "right", note: "Release hip tension." },
          { poseId: "bridge-pose", durationSeconds: 45, note: "Open chest." },
          { poseId: "savasana", durationSeconds: 120, note: "Complete rest." },
        ],
        isCustom: true,
      };
      setAiGeneratedFlow(fallback);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div id="sequence-explorer-container" className="space-y-8">
      {/* Editorial Hero Banner */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E4DCD0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DE] text-xs font-semibold text-[#5A6D56] border border-[#DDD3C2] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#BF6F55]" />
            <span>Master Flow Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1E241F]">
            Curated Yoga Sequences & Rituals
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6B60] mt-1.5 font-sans leading-relaxed">
            Every sequence is orchestrated with optimal pose sequencing, physiological counter-poses, breath synchrony, and realistic visual guidance.
          </p>
        </div>

        <button
          id="btn-open-custom-builder"
          onClick={onOpenCustomBuilder}
          className="py-3 px-5 rounded-2xl bg-[#5A6D56] hover:bg-[#485944] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Build Custom Sequence</span>
        </button>
      </div>

      {/* AI Custom Flow Generator Box */}
      <div className="bg-[#F6F0E6] p-6 rounded-3xl border border-[#E2D7C5] space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#BF6F55]" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#354337]">
            AI Yoga Coach — Tailor a Flow For Any Goal
          </h3>
        </div>

        <form onSubmit={handleGenerateAiFlow} className="flex flex-col sm:flex-row gap-2">
          <input
            id="ai-flow-prompt-input"
            type="text"
            placeholder="e.g. 'I sit all day and have tight hamstrings and a sore lower back...'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF7F1] border border-[#DDD3C3] text-xs text-[#2A342B] placeholder-[#9AA79E] focus:outline-hidden focus:border-[#5A6D56] transition-colors"
          />
          <button
            type="submit"
            id="btn-submit-ai-flow"
            disabled={isAiLoading || !aiPrompt.trim()}
            className="py-3 px-6 rounded-2xl bg-[#BF6F55] hover:bg-[#A95A42] disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            {isAiLoading ? (
              <span>Composing Sequence...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Flow</span>
              </>
            )}
          </button>
        </form>

        {/* AI Generated Flow Result Card */}
        {aiGeneratedFlow && (
          <div className="mt-4 p-5 rounded-2xl bg-[#FAF8F4] border border-[#E4DBD0] animate-in fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#BF6F55] uppercase tracking-wider">
                Bespoke Flow Ready
              </span>
              <h4 className="text-lg font-serif font-medium text-[#1E2520]">{aiGeneratedFlow.title}</h4>
              <p className="text-xs text-[#5D6B60] mt-0.5">{aiGeneratedFlow.subtitle}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#7A877E]">
                <span>{aiGeneratedFlow.durationMinutes} mins</span>
                <span>•</span>
                <span>{aiGeneratedFlow.poses.length} postures</span>
              </div>
            </div>

            <button
              id="btn-play-ai-flow"
              onClick={() => onStartFlow(aiGeneratedFlow)}
              className="py-2.5 px-5 rounded-xl bg-[#5A6D56] hover:bg-[#485944] text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Multi-Category Selection & Filter Bar */}
      <div className="bg-[#FAF7F2] p-5 rounded-3xl border border-[#E2DAD0] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#5A6D56]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#354337]">
              Multi-Category Selection & Filters
            </h3>
            {(selectedCategories.length > 0 || selectedDifficulties.length > 0 || maxMinutes !== null) && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#5A6D56] text-white">
                {selectedCategories.length + selectedDifficulties.length + (maxMinutes ? 1 : 0)} active
              </span>
            )}
          </div>

          {(selectedCategories.length > 0 || selectedDifficulties.length > 0 || maxMinutes !== null) && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#BF6F55] hover:underline font-semibold cursor-pointer self-start sm:self-auto"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Multi-select Category Chips */}
        <div>
          <span className="text-[11px] font-medium text-[#68796A] block mb-2">
            Select one or more practice categories:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategories([])}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                selectedCategories.length === 0
                  ? "bg-[#5A6D56] text-white border-[#5A6D56] font-semibold shadow-xs"
                  : "bg-[#F4EDE2] text-[#475549] border-[#DDD3C2] hover:bg-[#EBE2D4]"
              }`}
            >
              All Categories
            </button>
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#5A6D56] text-white border-[#5A6D56] font-semibold shadow-xs"
                      : "bg-[#F4EDE2] text-[#475549] border-[#DDD3C2] hover:bg-[#EBE2D4]"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{cat.icon} {cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-select Difficulty & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EAE0D4]">
          <div>
            <span className="text-[11px] font-medium text-[#68796A] block mb-1.5">
              Experience Level:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTY_OPTIONS.map((diff) => {
                const isSelected = selectedDifficulties.includes(diff.id);
                return (
                  <button
                    key={diff.id}
                    onClick={() => toggleDifficulty(diff.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#354337] text-white border-[#354337]"
                        : "bg-[#F4EDE2] text-[#475549] border-[#DDD3C2] hover:bg-[#EBE2D4]"
                    }`}
                  >
                    {diff.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#68796A] block mb-1.5">
              Max Practice Duration:
            </span>
            <div className="flex items-center gap-1.5">
              {[15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setMaxMinutes(maxMinutes === mins ? null : mins)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                    maxMinutes === mins
                      ? "bg-[#BF6F55] text-white border-[#BF6F55] font-semibold"
                      : "bg-[#F4EDE2] text-[#475549] border-[#DDD3C2] hover:bg-[#EBE2D4]"
                  }`}
                >
                  ≤ {mins} mins
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sequences Grid */}
      {filteredFlows.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF7F2] rounded-3xl border border-[#E4DCD0] space-y-3">
          <p className="font-serif text-lg text-[#1E241F]">No sequences match your active filters.</p>
          <p className="text-xs text-[#5D6B60]">Try clearing some of your category or duration selections.</p>
          <button
            onClick={clearAllFilters}
            className="py-2 px-4 rounded-xl bg-[#5A6D56] text-white text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlows.map((flow) => {
            const firstPose = YOGA_POSES.find((p) => p.id === flow.poses[0]?.poseId) || YOGA_POSES[0];
            return (
              <div
                key={flow.id}
                id={`sequence-card-${flow.id}`}
                className="group bg-[#FAF8F4] rounded-3xl border border-[#E2DAD0] hover:border-[#5A6D56] hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Meta header */}
                  <div className="flex items-center justify-between text-xs text-[#7A887C] mb-2">
                    <span className="capitalize text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EBE3D6] text-[#4F5E52]">
                      {flow.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-[#7D6B5E]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{flow.durationMinutes} mins</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-medium text-[#1E2520] group-hover:text-[#5A6D56] transition-colors">
                    {flow.title}
                  </h3>
                  <p className="text-xs text-[#5D6B60] mt-1 line-clamp-2 leading-relaxed">
                    {flow.subtitle}
                  </p>

                  {/* Visual Preview of First Pose in 3D */}
                  <div className="my-4 h-[160px] bg-[#F2EDE2] rounded-2xl overflow-hidden border border-[#E4DBD0] relative">
                    <ThreeYogaHuman
                      pose={firstPose}
                      height={160}
                      interactiveControls={false}
                      className="w-full h-full"
                    />
                    <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex items-center gap-1">
                      <Rotate3d className="w-2.5 h-2.5" />
                      <span>3D</span>
                    </div>
                  </div>

                  {/* Pose chips flow preview */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-medium text-[#7A887C] uppercase tracking-wider">
                      Sequence Arc ({flow.poses.length} Postures)
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {flow.poses.slice(0, 4).map((p, idx) => {
                        const poseObj = YOGA_POSES.find((yp) => yp.id === p.poseId);
                        return (
                          <span
                            key={idx}
                            className="text-[11px] bg-[#EAE2D5] text-[#364238] px-2 py-0.5 rounded-md font-medium"
                          >
                            {poseObj ? poseObj.name : p.poseId}
                          </span>
                        );
                      })}
                      {flow.poses.length > 4 && (
                        <span className="text-[11px] text-[#7A887C] self-center px-1 font-medium">
                          +{flow.poses.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-5 mt-4 border-t border-[#EAE2D5] flex items-center justify-between">
                  <span className="text-xs text-[#637366] capitalize font-medium">
                    {flow.difficulty}
                  </span>
                  <button
                    onClick={() => onStartFlow(flow)}
                    className="py-2 px-4 rounded-xl bg-[#5A6D56] group-hover:bg-[#485944] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Begin Flow</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
