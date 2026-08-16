import React, { useState, useEffect } from "react";
import { FlowSequence, YogaPose, PracticeSessionRecord } from "./types";
import { PRESET_FLOWS } from "./data/presetFlows";
import { YOGA_POSES } from "./data/posesData";
import { InstantFlowGenerator } from "./components/InstantFlowGenerator";
import { SequenceExplorer } from "./components/SequenceExplorer";
import { PoseLibrary } from "./components/PoseLibrary";
import { PracticeStudio } from "./components/PracticeStudio";
import { Pose3DViewer } from "./components/Pose3DViewer";
import { CustomFlowBuilder } from "./components/CustomFlowBuilder";
import { AICoachChat } from "./components/AICoachChat";
import { BreathworkStudio } from "./components/BreathworkStudio";
import { 
  Compass, 
  Layers, 
  BookOpen, 
  Wind, 
  Bot, 
  Play, 
  Sparkles, 
  History, 
  Award, 
  Clock, 
  Heart, 
  Smile, 
  ChevronRight, 
  CheckCircle2, 
  Flame 
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"instant" | "sequences" | "poses" | "breathwork" | "coach" | "history">("instant");
  
  // Active modals & live practice states
  const [activePracticeFlow, setActivePracticeFlow] = useState<FlowSequence | null>(null);
  const [inspectedPose, setInspectedPose] = useState<YogaPose | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);

  // User History & Stats
  const [sessionHistory, setSessionHistory] = useState<PracticeSessionRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("flowstate_history") || "[]");
    } catch {
      return [];
    }
  });

  const totalMindfulMinutes = sessionHistory.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalSessionsCount = sessionHistory.length;

  const handleStartFlow = (flow: FlowSequence) => {
    setActivePracticeFlow(flow);
  };

  const handlePracticeSinglePose = (pose: YogaPose) => {
    const singleFlow: FlowSequence = {
      id: "single-pose-" + pose.id + "-" + Date.now(),
      title: `${pose.name} Alignment Practice`,
      subtitle: `Focused single-posture study of ${pose.sanskritName}.`,
      durationMinutes: Math.max(1, Math.round((pose.recommendedHoldSeconds * 3) / 60)),
      category: "recovery",
      difficulty: pose.difficulty,
      physicalFocus: pose.primaryMuscles,
      mentalFocus: "Anatomical precision & breath synchrony",
      description: pose.description,
      bannerGradient: "from-[#F5EFEB] to-[#E5DCD0]",
      poses: [
        {
          poseId: pose.id,
          durationSeconds: pose.recommendedHoldSeconds || 45,
          note: pose.stepByStepInstructions[0] || "Maintain even breath."
        },
        {
          poseId: "savasana",
          durationSeconds: 60,
          note: "Integrate posture sensations in stillness."
        }
      ],
      isCustom: true
    };
    setInspectedPose(null);
    setActivePracticeFlow(singleFlow);
  };

  const handleSaveCustomFlow = (newFlow: FlowSequence) => {
    try {
      const existing = JSON.parse(localStorage.getItem("flowstate_custom_flows") || "[]");
      existing.unshift(newFlow);
      localStorage.setItem("flowstate_custom_flows", JSON.stringify(existing));
    } catch {}
  };

  const handleSessionComplete = (record: PracticeSessionRecord) => {
    setSessionHistory((prev) => [record, ...prev]);
  };

  return (
    <div id="flowstate-root" className="min-h-screen bg-[#F5EFEB] text-[#1E2520] font-sans antialiased flex flex-col selection:bg-[#5A6D56]/20">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F3]/90 backdrop-blur-md border-b border-[#E2DAD0] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("instant")}>
            <div className="w-10 h-10 rounded-2xl bg-[#5A6D56] text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-medium tracking-tight text-[#1A221C]">FlowState</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-md bg-[#BF6F55]/15 text-[#9E4F38] font-semibold tracking-wider font-sans">
                  Human Yoga Biomechanics
                </span>
              </div>
              <span className="text-[11px] text-[#6D7A70] block">
                Mindful Movement & Somatic Recovery
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#ECE5D8] p-1 rounded-2xl border border-[#DDD3C2]">
            {[
              { id: "instant", label: "Instant Reset", icon: Sparkles },
              { id: "sequences", label: "Flow Sequences", icon: Layers },
              { id: "poses", label: "Pose Encyclopedia", icon: BookOpen },
              { id: "breathwork", label: "Pranayama", icon: Wind },
              { id: "coach", label: "AI Yoga Coach", icon: Bot },
              { id: "history", label: "My Rituals", icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-[#FAF7F2] text-[#222B24] font-semibold shadow-xs"
                      : "text-[#58665B] hover:text-[#222B24] hover:bg-[#E5DCD0]/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#5A6D56]" : "text-[#7A887D]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right quick stats / fast practice action */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#EBE3D5] text-xs font-medium text-[#48564B] border border-[#DDD2BF]">
              <Flame className="w-3.5 h-3.5 text-[#BF6F55]" />
              <span>{totalMindfulMinutes}m Mindful</span>
            </div>

            <button
              id="btn-quick-play-first-flow"
              onClick={() => handleStartFlow(PRESET_FLOWS[0])}
              className="py-2 px-4 rounded-2xl bg-[#5A6D56] hover:bg-[#485944] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">15m Desk Reset</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Strip */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {[
            { id: "instant", label: "Instant", icon: Sparkles },
            { id: "sequences", label: "Flows", icon: Layers },
            { id: "poses", label: "Poses & Anatomy", icon: BookOpen },
            { id: "breathwork", label: "Breathwork", icon: Wind },
            { id: "coach", label: "AI Coach", icon: Bot },
            { id: "history", label: "Rituals", icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1 border ${
                  isSelected
                    ? "bg-[#5A6D56] text-white border-[#5A6D56]"
                    : "bg-[#EFE8DC] text-[#475549] border-[#DFD6C7]"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {activeTab === "instant" && (
          <InstantFlowGenerator
            onStartFlow={handleStartFlow}
            onInspectPose={(pose) => setInspectedPose(pose)}
          />
        )}

        {activeTab === "sequences" && (
          <SequenceExplorer
            onStartFlow={handleStartFlow}
            onInspectPose={(pose) => setInspectedPose(pose)}
            onOpenCustomBuilder={() => setIsBuilderOpen(true)}
          />
        )}

        {activeTab === "poses" && (
          <PoseLibrary
            onSelectPose={(pose) => setInspectedPose(pose)}
            onPracticePose={handlePracticeSinglePose}
          />
        )}

        {activeTab === "breathwork" && <BreathworkStudio />}

        {activeTab === "coach" && <AICoachChat />}

        {activeTab === "history" && (
          <div id="practice-history-container" className="space-y-6">
            {/* History Summary Header */}
            <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E4DCD0] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68]">
                Somatic Journey Log
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1E241F] mt-1">
                Your Practice History & Mindful Minutes
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#DDD3C3]">
                  <span className="text-xs text-[#7A877E]">Total Mindful Minutes</span>
                  <div className="text-2xl font-serif font-medium text-[#202922] mt-1">
                    {totalMindfulMinutes} mins
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#DDD3C3]">
                  <span className="text-xs text-[#7A877E]">Sessions Completed</span>
                  <div className="text-2xl font-serif font-medium text-[#202922] mt-1">
                    {totalSessionsCount}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#DDD3C3]">
                  <span className="text-xs text-[#7A877E]">Primary Muscle Relief</span>
                  <div className="text-sm font-medium text-[#202922] mt-2">
                    Spine, Hamstrings, Hips
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#DDD3C3]">
                  <span className="text-xs text-[#7A877E]">Average Post-Flow Mood</span>
                  <div className="text-sm font-medium text-[#5A6D56] mt-2">
                    Calm & Centered
                  </div>
                </div>
              </div>
            </div>

            {/* Session Records Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68]">
                Past Recorded Rituals
              </h3>

              {sessionHistory.length === 0 ? (
                <div className="p-12 text-center bg-[#FAF7F2] rounded-3xl border border-[#E4DCD0] text-xs text-[#6F7D72]">
                  No sessions recorded yet. Start any flow to begin logging mindful minutes and somatic reflections.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sessionHistory.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E0D7C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-[11px] text-[#8C9A8E]">
                          {new Date(rec.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        <h4 className="text-base font-serif font-medium text-[#1E2520]">{rec.sequenceTitle}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#5D6B60]">
                          <span>Body: <strong>{rec.physicalFeelingAfter}</strong></span>
                          <span>•</span>
                          <span>Mind: <strong className="text-[#5A6D56]">{rec.moodAfter}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium bg-[#EFE8DC] px-3 py-1 rounded-xl text-[#39463C] border border-[#DDD3C2]">
                          {rec.durationMinutes} mins
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2DAD0] bg-[#FAF8F3] py-6 px-4 text-center text-xs text-[#7A877E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#5A6D56]" />
            <span className="font-serif font-medium text-[#202922]">FlowState</span>
            <span>— Biomechanically accurate yoga & mindful recovery</span>
          </div>
          <span>Crafted with procedural audio synthesis & vector human kinematics</span>
        </div>
      </footer>

      {/* Fullscreen Live Practice Studio Player */}
      {activePracticeFlow && (
        <PracticeStudio
          flow={activePracticeFlow}
          onExit={() => setActivePracticeFlow(null)}
          onSessionComplete={handleSessionComplete}
        />
      )}

      {/* Pose 3D & Biomechanics Detail Inspector Modal */}
      {inspectedPose && (
        <Pose3DViewer
          pose={inspectedPose}
          onClose={() => setInspectedPose(null)}
          onStartSinglePosePractice={handlePracticeSinglePose}
        />
      )}

      {/* Custom Sequence Builder Modal */}
      {isBuilderOpen && (
        <CustomFlowBuilder
          onClose={() => setIsBuilderOpen(false)}
          onSaveFlow={handleSaveCustomFlow}
          onStartFlow={handleStartFlow}
        />
      )}
    </div>
  );
}
