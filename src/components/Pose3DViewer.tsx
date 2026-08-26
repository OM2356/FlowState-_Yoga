import React, { useState } from "react";
import { YogaPose, UserMasteryState } from "../types";
import { HumanYogaAvatar } from "./HumanYogaAvatar";
import { AnimatedPoseFigure } from "./AnimatedPoseFigure";
import { MUSCLE_GROUPS_INFO } from "../data/posesData";
import { audioEngine } from "../utils/audioEngine";
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  BookOpen, 
  Compass, 
  Plus, 
  Play, 
  HelpCircle,
  Layers,
  Trophy,
  Star,
  Award,
  Zap
} from "lucide-react";

interface Pose3DViewerProps {
  pose: YogaPose;
  masteryState?: UserMasteryState;
  onClose: () => void;
  onStartSinglePosePractice?: (pose: YogaPose) => void;
  onAddToCustomFlow?: (pose: YogaPose) => void;
  onLogPoseMastery?: (poseId: string, holdSeconds?: number) => void;
}

export const Pose3DViewer: React.FC<Pose3DViewerProps> = ({
  pose,
  masteryState,
  onClose,
  onStartSinglePosePractice,
  onAddToCustomFlow,
  onLogPoseMastery,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "anatomy" | "alignment" | "modifications">("overview");
  const [viewMode, setViewMode] = useState<"kinetic" | "anatomical">("kinetic");
  const [isPlayingAudioCue, setIsPlayingAudioCue] = useState<boolean>(false);

  const poseRecord = masteryState?.posesCompleted[pose.id];
  const completedCount = poseRecord?.completedCount || 0;
  const totalHoldSeconds = poseRecord?.totalHoldSeconds || 0;

  const handlePlayVoiceCue = () => {
    setIsPlayingAudioCue(true);
    audioEngine.playSingingBowl(329.63); // E4 harmonic chime
    const speechText = `${pose.name}. ${pose.sanskritName}. ${pose.description}. ${pose.stepByStepInstructions[0] || ""} ${pose.breathGuide.inhaleAction} ${pose.breathGuide.exhaleAction}`;
    audioEngine.speakCue(speechText);
    setTimeout(() => {
      setIsPlayingAudioCue(false);
    }, 8000);
  };

  return (
    <div id="pose-viewer-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#181B18]/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#FBF9F5] rounded-3xl border border-[#E2DAD0] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E0D2] flex items-center justify-between bg-[#F5EFEB]/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68]">
                {pose.category} • {pose.difficulty}
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-[#E5DDD0] text-[#4A5A4E] font-medium">
                Hold {pose.recommendedHoldSeconds}s
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="text-2xl font-serif font-medium text-[#1E231F]">{pose.name}</h2>
              <span className="text-sm font-serif italic text-[#7D6B5E]">{pose.sanskritName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-listen-pose-cue"
              onClick={handlePlayVoiceCue}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#EFE9DE] hover:bg-[#E4DCD0] text-[#334237] border border-[#D9CEBF] flex items-center gap-1.5 transition-colors"
              title="Listen to vocal alignment guide"
            >
              <Volume2 className="w-4 h-4 text-[#BF6F55]" />
              <span className="hidden sm:inline">{isPlayingAudioCue ? "Speaking..." : "Audio Guide"}</span>
            </button>

            <button
              id="btn-close-pose-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-[#5A685D] hover:bg-[#EBE2D5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Realistic Human Figure Visualizer */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {/* View Mode Toggle Pill */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#EDE5D8] border border-[#DDD4C4]">
                <button
                  onClick={() => setViewMode("kinetic")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === "kinetic"
                      ? "bg-white text-[#1A221C] shadow-2xs font-bold"
                      : "text-[#6B7C6E] hover:text-[#1A221C]"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kinetic Movement</span>
                </button>
                <button
                  onClick={() => setViewMode("anatomical")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === "anatomical"
                      ? "bg-white text-[#1A221C] shadow-2xs font-bold"
                      : "text-[#6B7C6E] hover:text-[#1A221C]"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Anatomy Heatmap</span>
                </button>
              </div>

              <span className="text-[11px] font-medium text-[#7A8A7C]">
                {viewMode === "kinetic" ? "Live Motion & Breathing" : "Muscle Activation Map"}
              </span>
            </div>

            <div className="w-full h-[380px] rounded-2xl overflow-hidden border border-[#DDD4C4] bg-[#F7F4EE] shadow-xs relative flex items-center justify-center">
              {viewMode === "kinetic" ? (
                <div className="w-full h-full p-4 flex items-center justify-center">
                  <AnimatedPoseFigure
                    poseId={pose.id}
                    poseName={pose.name}
                    isPlaying={true}
                    speed={1.0}
                    showBreathRhythm={true}
                  />
                </div>
              ) : (
                <div className="w-full h-full p-4 flex items-center justify-center">
                  <HumanYogaAvatar
                    kinematics={pose.kinematics}
                    primaryMuscles={pose.primaryMuscles}
                    secondaryMuscles={pose.secondaryMuscles}
                    showMuscleHeatmap={true}
                    width={320}
                    height={340}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons underneath avatar */}
            <div className="flex items-center gap-2 mt-1">
              {onStartSinglePosePractice && (
                <button
                  id="btn-practice-single-pose"
                  onClick={() => onStartSinglePosePractice(pose)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#5A6D56] hover:bg-[#495A46] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Practice Form (3 Min)</span>
                </button>
              )}

              {onAddToCustomFlow && (
                <button
                  id="btn-add-pose-to-flow"
                  onClick={() => onAddToCustomFlow(pose)}
                  className="py-2.5 px-4 rounded-xl bg-[#EDE5D8] hover:bg-[#DFD5C5] text-[#334237] font-medium text-xs border border-[#D4C8B5] flex items-center gap-1.5 transition-colors"
                  title="Add to custom sequence"
                >
                  <Plus className="w-4 h-4 text-[#BF6F55]" />
                  <span className="hidden sm:inline">Add to Flow</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Tabbed Anatomical & Instructional Details */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Tabs bar */}
            <div className="flex items-center border-b border-[#E2DAD0] mb-4 gap-1">
              <button
                id="tab-btn-overview"
                onClick={() => setActiveTab("overview")}
                className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
                  activeTab === "overview"
                    ? "border-[#5A6D56] text-[#2C382E] font-semibold"
                    : "border-transparent text-[#7D8A7F] hover:text-[#38463B]"
                }`}
              >
                Overview & Steps
              </button>

              <button
                id="tab-btn-anatomy"
                onClick={() => setActiveTab("anatomy")}
                className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
                  activeTab === "anatomy"
                    ? "border-[#5A6D56] text-[#2C382E] font-semibold"
                    : "border-transparent text-[#7D8A7F] hover:text-[#38463B]"
                }`}
              >
                Muscle Anatomy
              </button>

              <button
                id="tab-btn-alignment"
                onClick={() => setActiveTab("alignment")}
                className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
                  activeTab === "alignment"
                    ? "border-[#5A6D56] text-[#2C382E] font-semibold"
                    : "border-transparent text-[#7D8A7F] hover:text-[#38463B]"
                }`}
              >
                Alignment & Form
              </button>

              <button
                id="tab-btn-modifications"
                onClick={() => setActiveTab("modifications")}
                className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
                  activeTab === "modifications"
                    ? "border-[#5A6D56] text-[#2C382E] font-semibold"
                    : "border-transparent text-[#7D8A7F] hover:text-[#38463B]"
                }`}
              >
                Modifications
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 space-y-4">
              {activeTab === "overview" && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  <p className="text-sm text-[#434F45] leading-relaxed font-sans">{pose.description}</p>

                  {/* Breath Cue banner */}
                  <div className="p-3.5 rounded-xl bg-[#F0EBE1] border border-[#E0D5C3] flex items-start gap-3">
                    <Compass className="w-5 h-5 text-[#BF6F55] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-semibold text-[#2D382F] block mb-0.5">Pranayama / Breath Guide:</span>
                      <p className="text-[#556357]">
                        <strong className="text-[#3B4C3E]">Inhale:</strong> {pose.breathGuide.inhaleAction}
                      </p>
                      <p className="text-[#556357] mt-0.5">
                        <strong className="text-[#3B4C3E]">Exhale:</strong> {pose.breathGuide.exhaleAction}
                      </p>
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68] mb-2">Step-by-Step Instruction</h3>
                    <ol className="space-y-2 text-xs text-[#3E4C41]">
                      {pose.stepByStepInstructions.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#E5DCD0] text-[#4A5A4E] flex items-center justify-center font-serif text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {activeTab === "anatomy" && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68] mb-2 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-[#BF6F55]" />
                      <span>Primary Target Muscle Groups</span>
                    </h3>
                    <div className="space-y-2">
                      {pose.primaryMuscles.map((m) => {
                        const info = MUSCLE_GROUPS_INFO[m];
                        return (
                          <div key={m} className="p-3 rounded-xl bg-[#FAF5ED] border border-[#E8DDCF]">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs text-[#2A362D]">{info?.label || m}</span>
                              <span className="text-[11px] font-serif italic text-[#8B6554]">{info?.anatomicalName}</span>
                            </div>
                            <p className="text-xs text-[#5D6B60] mt-1">{info?.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {pose.secondaryMuscles.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68] mb-2">Supporting Stabilizers</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {pose.secondaryMuscles.map((m) => (
                          <span key={m} className="px-2.5 py-1 text-xs rounded-lg bg-[#EFE9DE] text-[#4E5D52] border border-[#DDD3C3]">
                            {MUSCLE_GROUPS_INFO[m]?.label || m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "alignment" && (
                <div className="space-y-4 animate-in fade-in-50 duration-150">
                  {/* Key Alignment Cues */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68] mb-2">Key Joint Alignment Cues</h3>
                    <div className="space-y-2">
                      {pose.alignmentCues.map((cue, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#F0ECE2] border border-[#E0D7C9] flex items-start gap-2.5 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-[#5A6D56] shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-[#2C382E]">{cue.joint}:</strong>{" "}
                            <span className="text-[#4E5C51]">{cue.cue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Pitfalls & Corrections */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#BF6F55] mb-2">Common Mistakes & Corrections</h3>
                    <div className="space-y-2">
                      {pose.commonMistakes.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#FAF0ED] border border-[#F0D5CF] text-xs space-y-1">
                          <div className="flex items-start gap-1.5 text-[#A83D2A] font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>Mistake: {item.mistake}</span>
                          </div>
                          <p className="text-[#4B584E] pl-5">
                            <strong className="text-[#5A6D56]">Fix:</strong> {item.correction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "modifications" && (
                <div className="space-y-3 animate-in fade-in-50 duration-150">
                  <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E8DFCFC0]">
                    <span className="text-xs font-semibold text-[#5A6D56] block mb-1">Beginner / Gentle Variation:</span>
                    <p className="text-xs text-[#4C5B4E] leading-relaxed">{pose.modifications.beginner}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E8DFCFC0]">
                    <span className="text-xs font-semibold text-[#BF6F55] block mb-1">Advanced Expression:</span>
                    <p className="text-xs text-[#4C5B4E] leading-relaxed">{pose.modifications.advanced}</p>
                  </div>

                  {pose.modifications.propUsage && (
                    <div className="p-3.5 rounded-xl bg-[#F0EBE0] border border-[#DECFC0]">
                      <span className="text-xs font-semibold text-[#3C4A3E] block mb-1">Support With Props (Blocks, Strap, Bolster):</span>
                      <p className="text-xs text-[#526054] leading-relaxed">{pose.modifications.propUsage}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
