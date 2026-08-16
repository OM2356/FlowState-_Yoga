import React, { useState, useEffect } from "react";
import { FlowSequence, YogaPose, PracticeSessionRecord, UserProfile } from "./types";
import { PRESET_FLOWS } from "./data/presetFlows";
import { YOGA_POSES } from "./data/posesData";
import { InstantFlowGenerator } from "./components/InstantFlowGenerator";
import { MoodSessionSelector } from "./components/MoodSessionSelector";
import { SequenceExplorer } from "./components/SequenceExplorer";
import { PoseLibrary } from "./components/PoseLibrary";
import { PracticeStudio } from "./components/PracticeStudio";
import { Pose3DViewer } from "./components/Pose3DViewer";
import { CustomFlowBuilder } from "./components/CustomFlowBuilder";
import { AICoachChat } from "./components/AICoachChat";
import { BreathworkStudio } from "./components/BreathworkStudio";
import { BodyTensionMap } from "./components/BodyTensionMap";
import { BeginnerGuide } from "./components/BeginnerGuide";
import { UserProfileDashboard } from "./components/UserProfileDashboard";
import { AuthModal } from "./components/AuthModal";
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
  Flame,
  Activity,
  ShieldCheck,
  Eye,
  Calendar,
  Sun,
  User
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "mood" | "instant" | "tension" | "sequences" | "poses" | "breathwork" | "coach" | "guide" | "history" | "profile"
  >("mood");
  
  // Active modals & live practice states
  const [activePracticeFlow, setActivePracticeFlow] = useState<FlowSequence | null>(null);
  const [inspectedPose, setInspectedPose] = useState<YogaPose | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // User Profile & Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem("flowstate_auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

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

  // Pose of the Day (rotates based on day of month)
  const dayOfMonth = new Date().getDate();
  const poseOfTheDay = YOGA_POSES[dayOfMonth % YOGA_POSES.length] || YOGA_POSES[0];

  const handleStartFlow = (flow: FlowSequence) => {
    setActivePracticeFlow(flow);
  };

  const handlePracticeSinglePose = (pose: YogaPose) => {
    const singleFlow: FlowSequence = {
      id: "single-pose-" + pose.id + "-" + Date.now(),
      title: `${pose.name} Practice`,
      subtitle: `Guided practice of ${pose.sanskritName}.`,
      durationMinutes: Math.max(1, Math.round((pose.recommendedHoldSeconds * 3) / 60)),
      category: "recovery",
      difficulty: pose.difficulty,
      physicalFocus: pose.primaryMuscles,
      mentalFocus: "Gentle alignment & calm breathing",
      description: pose.description,
      bannerGradient: "from-[#F5EFEB] to-[#E5DCD0]",
      poses: [
        {
          poseId: pose.id,
          durationSeconds: pose.recommendedHoldSeconds || 45,
          note: pose.stepByStepInstructions[0] || "Breathe slowly and comfortably."
        },
        {
          poseId: "savasana",
          durationSeconds: 60,
          note: "Rest completely in stillness."
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
    setSessionHistory((prev) => {
      const updated = [record, ...prev];
      try {
        localStorage.setItem("flowstate_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <div id="flowstate-root" className="min-h-screen bg-[#F5EFEB] text-[#1A221C] font-sans antialiased flex flex-col selection:bg-[#4E6548]/20">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E2DAD0] px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setActiveTab("mood")}
          >
            <div className="w-11 h-11 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center shadow-xs">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-medium tracking-tight text-[#1A221C]">FlowState</span>
                <span className="text-[11px] uppercase px-2 py-0.5 rounded-md bg-[#C1664C]/15 text-[#9E4F38] font-bold tracking-wider font-sans">
                  Yoga & Recovery
                </span>
              </div>
              <span className="text-xs text-[#5E6D60] block font-medium">
                Simple, Safe & Mindful Movement
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#ECE4D6] p-1.5 rounded-2xl border border-[#DDD3C2]">
            {[
              { id: "mood", label: "Mood Flow", icon: Smile },
              { id: "instant", label: "AI Generator", icon: Sparkles },
              { id: "tension", label: "Body Relief", icon: Activity },
              { id: "sequences", label: "Yoga Flows", icon: Layers },
              { id: "poses", label: "Pose Library", icon: BookOpen },
              { id: "breathwork", label: "Breathing", icon: Wind },
              { id: "coach", label: "AI Coach", icon: Bot },
              { id: "guide", label: "Guide", icon: ShieldCheck },
              { id: "profile", label: "My Profile", icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FAF8F4] text-[#1A221C] shadow-xs"
                      : "text-[#546457] hover:text-[#1A221C] hover:bg-[#E2D8C8]/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-[#4E6548]" : "text-[#738275]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right quick stats & Profile Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-xs font-semibold text-[#3B4A3E] border border-[#DDD2BF] transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-[#4E6548] text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
              </div>
              <span className="hidden sm:inline">
                {currentUser ? currentUser.name.split(" ")[0] : "Member Login"}
              </span>
            </button>

            <button
              id="btn-quick-play-first-flow"
              onClick={() => handleStartFlow(PRESET_FLOWS[0])}
              className="py-2.5 px-4.5 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>15m Desk Reset</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation Strip */}
        <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {[
            { id: "mood", label: "Mood Flow", icon: Smile },
            { id: "instant", label: "AI Flow", icon: Sparkles },
            { id: "tension", label: "Body Relief", icon: Activity },
            { id: "sequences", label: "Flows", icon: Layers },
            { id: "poses", label: "Poses", icon: BookOpen },
            { id: "breathwork", label: "Breathing", icon: Wind },
            { id: "coach", label: "AI Coach", icon: Bot },
            { id: "guide", label: "Guide", icon: ShieldCheck },
            { id: "profile", label: "Profile", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#4E6548] text-white border-[#4E6548] shadow-xs"
                    : "bg-[#EFE8DC] text-[#425044] border-[#DFD6C7]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Daily Pose of the Day Quick Highlight Banner (visible on main views) */}
      {(activeTab === "mood" || activeTab === "instant" || activeTab === "sequences") && (
        <div className="bg-[#FAF7F2] border-b border-[#E2DAD0] py-3 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C1664C]/15 text-[#C1664C] flex items-center justify-center font-bold text-xs">
                <Sun className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-[#8B5A3C] uppercase tracking-wider text-[11px] block">
                  Pose of the Day
                </span>
                <span className="font-serif font-medium text-[#1A221C] text-sm sm:text-base">
                  {poseOfTheDay.name} ({poseOfTheDay.sanskritName})
                </span>
                <span className="text-[#5E6D60] text-xs ml-2 hidden md:inline">
                  — {poseOfTheDay.description.slice(0, 75)}...
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setInspectedPose(poseOfTheDay)}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#4E6548]" />
                <span>View Form</span>
              </button>
              <button
                onClick={() => handlePracticeSinglePose(poseOfTheDay)}
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Practice (3 Min)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {activeTab === "mood" && (
          <MoodSessionSelector
            onStartFlow={handleStartFlow}
            onInspectPose={(pose) => setInspectedPose(pose)}
          />
        )}

        {activeTab === "instant" && (
          <InstantFlowGenerator
            onStartFlow={handleStartFlow}
            onInspectPose={(pose) => setInspectedPose(pose)}
          />
        )}

        {activeTab === "tension" && (
          <BodyTensionMap
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

        {activeTab === "coach" && (
          <AICoachChat
            onInspectPose={(pose) => setInspectedPose(pose)}
            onPracticePose={handlePracticeSinglePose}
          />
        )}

        {activeTab === "guide" && <BeginnerGuide />}

        {activeTab === "profile" && (
          <UserProfileDashboard
            user={currentUser}
            sessionHistory={sessionHistory}
            onOpenAuth={() => setIsAuthOpen(true)}
            onStartFlow={handleStartFlow}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2DAD0] bg-[#FAF8F3] py-8 px-4 sm:px-8 text-xs sm:text-sm text-[#667768]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#4E6548]" />
            <span className="font-serif font-medium text-[#1A221C] text-base">FlowState</span>
            <span>— Simple, safe, and accessible yoga for everyone</span>
          </div>
          <span>Gentle posture guidance • Nasal breathing pacers • Mindful recovery</span>
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

      {/* Authentication & User Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(usr) => setCurrentUser(usr)}
        onLogout={() => {
          try {
            localStorage.removeItem("flowstate_auth_user");
          } catch {}
          setCurrentUser(null);
        }}
        onUpdateProfile={(updated) => setCurrentUser(updated)}
      />
    </div>
  );
}
