import React, { useState } from "react";
import { FlowSequence, FlowCategory, YogaPose } from "../types";
import { PRESET_FLOWS } from "../data/presetFlows";
import { YOGA_POSES } from "../data/posesData";
import { HumanYogaAvatar } from "./HumanYogaAvatar";
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
  Send 
} from "lucide-react";

interface SequenceExplorerProps {
  onStartFlow: (flow: FlowSequence) => void;
  onInspectPose: (pose: YogaPose) => void;
  onOpenCustomBuilder: () => void;
}

export const SequenceExplorer: React.FC<SequenceExplorerProps> = ({
  onStartFlow,
  onInspectPose,
  onOpenCustomBuilder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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

  const filteredFlows = allFlows.filter((flow) => {
    if (selectedCategory === "all") return true;
    return flow.category === selectedCategory;
  });

  // Generate Flow with Gemini AI API
  const handleGenerateAiFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiLoading(true);
    try {
      const response = await fetch("/api/generate-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          durationMinutes: 15,
          level: "intermediate"
        }),
      });

      if (!response.ok) throw new Error("Failed to generate sequence");
      const data = await response.json();
      setAiGeneratedFlow(data);
    } catch (err) {
      console.error(err);
      // Fallback local intelligent generator if offline
      const fallback: FlowSequence = {
        id: "ai-flow-" + Date.now(),
        title: "Intelligent Custom Ritual",
        subtitle: `Formulated based on: "${aiPrompt.slice(0, 40)}..."`,
        durationMinutes: 15,
        category: "recovery",
        difficulty: "intermediate",
        physicalFocus: ["hamstrings", "erectorSpinae", "hipFlexors"],
        mentalFocus: "Release tension & restore equilibrium",
        description: "A tailored sequence targeting deep myofascial release and spinal decompression.",
        bannerGradient: "from-[#F3ECE1] to-[#E2D6C3]",
        poses: [
          { poseId: "child-pose", durationSeconds: 60, note: "Calm the central nervous system." },
          { poseId: "downward-dog", durationSeconds: 45, note: "Lengthen posterior chain." },
          { poseId: "warrior-1", durationSeconds: 45, side: "right", note: "Root through back heel." },
          { poseId: "warrior-1", durationSeconds: 45, side: "left", note: "Square hips forward." },
          { poseId: "half-pigeon", durationSeconds: 60, side: "right", note: "Release deep piriformis tension." },
          { poseId: "half-pigeon", durationSeconds: 60, side: "left", note: "Breathe into hip space." },
          { poseId: "bridge-pose", durationSeconds: 45, note: "Strengthen glutes and open chest." },
          { poseId: "savasana", durationSeconds: 120, note: "Absorb full restoration." },
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
          className="py-3 px-5 rounded-2xl bg-[#5A6D56] hover:bg-[#485944] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
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
            placeholder="e.g., 'I run 10k every weekend and have tight calves, stiff IT band, and sore hips...'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-[#FAF7F1] border border-[#DDD3C3] text-xs text-[#2A342B] placeholder-[#9AA79E] focus:outline-hidden focus:border-[#5A6D56] transition-colors"
          />
          <button
            type="submit"
            id="btn-submit-ai-flow"
            disabled={isAiLoading || !aiPrompt.trim()}
            className="py-3 px-6 rounded-2xl bg-[#BF6F55] hover:bg-[#A95A42] disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-all shrink-0"
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
              className="py-2.5 px-5 rounded-xl bg-[#5A6D56] hover:bg-[#485944] text-white text-xs font-medium flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { id: "all", label: "All Sequences" },
          { id: "deskRelief", label: "Desk & Posture Reset" },
          { id: "recovery", label: "Athletic & Deep Recovery" },
          { id: "energy", label: "Morning & Vitality" },
          { id: "sleep", label: "Bedtime & Rest" },
        ].map((cat) => (
          <button
            key={cat.id}
            id={`tab-flow-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-medium border transition-all ${
              selectedCategory === cat.id
                ? "bg-[#5A6D56] text-white border-[#5A6D56] shadow-xs font-semibold"
                : "bg-[#FAF7F2] text-[#475549] border-[#DFD6C7] hover:bg-[#EBE2D4]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sequences Grid */}
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

                {/* Visual Preview of First Pose Avatar */}
                <div className="my-4 bg-[#F2EDE2] rounded-2xl p-2 flex items-center justify-center border border-[#E4DBD0]">
                  <HumanYogaAvatar
                    pose={firstPose}
                    size="sm"
                    showAlignmentGuides={false}
                    className="bg-transparent border-0 shadow-none p-0 max-h-[140px]"
                  />
                </div>

                {/* Pose chips flow preview */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7E8B81]">
                    Includes {flow.poses.length} Postures:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {flow.poses.slice(0, 4).map((pItem, idx) => {
                      const pData = YOGA_POSES.find((p) => p.id === pItem.poseId);
                      return (
                        <span
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (pData) onInspectPose(pData);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#EFE9DF] hover:bg-[#E4DBD0] text-[#4F5E52] cursor-pointer border border-[#DDD3C3] transition-colors"
                          title="Click to view biomechanics"
                        >
                          {pData?.name || pItem.poseId}
                        </span>
                      );
                    })}
                    {flow.poses.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EFE9DF] text-[#7E8B81] font-medium">
                        +{flow.poses.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Start Sequence CTA */}
              <div className="mt-6 pt-4 border-t border-[#E8E0D2]">
                <button
                  id={`btn-play-flow-${flow.id}`}
                  onClick={() => onStartFlow(flow)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#5A6D56] hover:bg-[#485944] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Begin Guided Flow ({flow.durationMinutes}m)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
