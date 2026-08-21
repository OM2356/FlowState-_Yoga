import React, { useState, useEffect } from "react";
import { FlowSequence, YogaPose, PracticeSessionRecord, UserProfile, UserMasteryState, MasteryBadge } from "./types";
import { PRESET_FLOWS } from "./data/presetFlows";
import { YOGA_POSES } from "./data/posesData";
import { 
  getInitialMasteryState, 
  evaluateAndUnlockBadges, 
  MASTERY_BADGES, 
  getXpRankInfo
} from "./data/masteryBadges";
import { audioEngine } from "./utils/audioEngine";
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
import { UserFeedbackModal } from "./components/UserFeedbackModal";
import { AuthModal } from "./components/AuthModal";
import { AuthLandingPage } from "./components/AuthLandingPage";
import { SuryaNamaskarStudio } from "./components/SuryaNamaskarStudio";
import { ThreeYogaStudio } from "./components/ThreeYogaStudio";
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
  User,
  MessageSquarePlus,
  LogOut,
  Rotate3d,
  Trophy,
  Shield,
  X
} from "lucide-react";

const getToastBadgeIcon = (iconName: string, className = "w-6 h-6 text-white") => {
  switch (iconName) {
    case "Shield": return <Shield className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Compass": return <Compass className={className} />;
    case "Heart": return <Heart className={className} />;
    case "Flame": return <Flame className={className} />;
    case "Layers": return <Layers className={className} />;
    case "Play": return <Play className={className} />;
    case "Award": return <Award className={className} />;
    case "BookOpen": return <BookOpen className={className} />;
    case "Wind": return <Wind className={className} />;
    case "Rotate3d": return <Rotate3d className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    default: return <Trophy className={className} />;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "mood" | "studio3d" | "surya" | "instant" | "tension" | "sequences" | "poses" | "breathwork" | "coach" | "guide" | "profile"
  >("mood");
  
  // Active modals & live practice states
  const [activePracticeFlow, setActivePracticeFlow] = useState<FlowSequence | null>(null);
  const [inspectedPose, setInspectedPose] = useState<YogaPose | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  // User Profile & Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem("flowstate_auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem("flowstate_auth_user");
      localStorage.removeItem("flowstate_auth_token");
      sessionStorage.removeItem("flowstate_dev_authorized");
    } catch {}
    setCurrentUser(null);
    setActiveTab("mood");
  };

  // User History & Stats
  const [sessionHistory, setSessionHistory] = useState<PracticeSessionRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("flowstate_history") || "[]");
    } catch {
      return [];
    }
  });

  // User Gamified Mastery State
  const [masteryState, setMasteryState] = useState<UserMasteryState>(() => {
    return getInitialMasteryState();
  });

  // Transient notification for newly unlocked badges
  const [unlockedToast, setUnlockedToast] = useState<{
    badge: MasteryBadge;
    title: string;
  } | null>(null);

  // Fetch remote session history if logged in
  useEffect(() => {
    if (currentUser?.id) {
      fetch(`/api/sessions?userId=${currentUser.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data.sessions) && data.sessions.length > 0) {
            setSessionHistory((prev) => {
              const combined = [...data.sessions, ...prev];
              // De-duplicate by id
              const unique = Array.from(new Map(combined.map((s) => [s.id, s])).values());
              return unique;
            });
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  // Track 3D pose inspections for Biomechanics mastery
  const handleInspectPose = (pose: YogaPose) => {
    setInspectedPose(pose);
    setMasteryState((prev) => {
      const alreadyInspected = prev.inspected3dPoseIds.includes(pose.id);
      if (alreadyInspected) return prev;
      const updatedInspected = [...prev.inspected3dPoseIds, pose.id];
      const nextState: UserMasteryState = {
        ...prev,
        inspected3dPoseIds: updatedInspected,
      };
      const { updatedState, newlyUnlockedBadges } = evaluateAndUnlockBadges(nextState, sessionHistory, currentUser);
      if (newlyUnlockedBadges.length > 0) {
        audioEngine.playSingingBowl(528); // Solfeggio 528Hz Miracle frequency
        setUnlockedToast({
          badge: newlyUnlockedBadges[0],
          title: newlyUnlockedBadges[0].title,
        });
      }
      return updatedState;
    });
  };

  // Helper to log pose hold mastery directly from library or studio
  const handleLogPoseMastery = (poseId: string, holdSeconds = 30) => {
    audioEngine.playSingingBowl(440);
    setMasteryState((prev) => {
      const existing = prev.posesCompleted[poseId] || {
        poseId,
        completedCount: 0,
        totalHoldSeconds: 0,
        lastCompletedAt: new Date().toISOString(),
        masteryTier: 1,
      };

      const newCount = existing.completedCount + 1;
      const newHold = existing.totalHoldSeconds + holdSeconds;
      const newTier = newCount >= 5 ? 3 : newCount >= 3 ? 2 : 1;

      const nextPosesCompleted = {
        ...prev.posesCompleted,
        [poseId]: {
          ...existing,
          completedCount: newCount,
          totalHoldSeconds: newHold,
          lastCompletedAt: new Date().toISOString(),
          masteryTier: newTier as 1 | 2 | 3,
        },
      };

      const nextState: UserMasteryState = {
        ...prev,
        posesCompleted: nextPosesCompleted,
        lastUpdated: new Date().toISOString(),
      };

      const { updatedState, newlyUnlockedBadges } = evaluateAndUnlockBadges(nextState, sessionHistory, currentUser);

      if (newlyUnlockedBadges.length > 0) {
        audioEngine.playSingingBowl(587.33); // D5 celebration chime
        setUnlockedToast({
          badge: newlyUnlockedBadges[0],
          title: newlyUnlockedBadges[0].title,
        });
      }

      return updatedState;
    });
  };

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

  // Sync completed session with local storage AND backend storage, and advance Mastery
  const handleSessionComplete = async (record: PracticeSessionRecord) => {
    const updatedHistory = [record, ...sessionHistory];
    setSessionHistory(updatedHistory);
    try {
      localStorage.setItem("flowstate_history", JSON.stringify(updatedHistory));
    } catch {}

    // Advance user mastery progress for all poses included in this flow
    if (activePracticeFlow?.poses) {
      setMasteryState((prev) => {
        const nextPoses = { ...prev.posesCompleted };

        activePracticeFlow.poses.forEach((p) => {
          const existing = nextPoses[p.poseId] || {
            poseId: p.poseId,
            completedCount: 0,
            totalHoldSeconds: 0,
            lastCompletedAt: new Date().toISOString(),
            masteryTier: 1,
          };
          const count = existing.completedCount + 1;
          const hold = existing.totalHoldSeconds + p.durationSeconds;
          nextPoses[p.poseId] = {
            ...existing,
            completedCount: count,
            totalHoldSeconds: hold,
            lastCompletedAt: new Date().toISOString(),
            masteryTier: (count >= 5 ? 3 : count >= 3 ? 2 : 1) as 1 | 2 | 3,
          };
        });

        const nextState: UserMasteryState = {
          ...prev,
          posesCompleted: nextPoses,
          totalFlowMinutes: prev.totalFlowMinutes + record.durationMinutes,
          lastUpdated: new Date().toISOString(),
        };

        const { updatedState, newlyUnlockedBadges } = evaluateAndUnlockBadges(nextState, updatedHistory, currentUser);

        if (newlyUnlockedBadges.length > 0) {
          audioEngine.playSingingBowl(528);
          setUnlockedToast({
            badge: newlyUnlockedBadges[0],
            title: newlyUnlockedBadges[0].title,
          });
        }

        return updatedState;
      });
    }

    // Sync to backend DB for developer-side visibility
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id || "guest-user",
          userName: currentUser?.name || "Guest Practitioner",
          sequenceId: record.sequenceId,
          sequenceTitle: record.sequenceTitle,
          durationMinutes: record.durationMinutes,
          moodBefore: record.moodBefore,
          moodAfter: record.moodAfter,
          physicalFeelingAfter: record.physicalFeelingAfter,
          rating: record.rating,
          notes: record.notes,
        }),
      });
    } catch (e) {
      console.warn("Backend session sync deferred:", e);
    }
  };

  // If user is not authenticated yet, render the full Login & Registration landing page
  if (!currentUser) {
    return (
      <AuthLandingPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  // Defined navigation tabs
  const navTabs = [
    { id: "mood", label: "Mood Flow", icon: Smile },
    { id: "studio3d", label: "3D Studio", icon: Rotate3d, isSpecial: true },
    { id: "surya", label: "Surya Namaskar 3D", icon: Sun, isSpecial: true },
    { id: "instant", label: "AI Generator", icon: Sparkles },
    { id: "tension", label: "Body Relief", icon: Activity },
    { id: "sequences", label: "Yoga Flows", icon: Layers },
    { id: "poses", label: "Pose Library", icon: BookOpen },
    { id: "breathwork", label: "Breathing", icon: Wind },
    { id: "coach", label: "AI Coach", icon: Bot },
    { id: "guide", label: "Guide", icon: ShieldCheck },
    { id: "profile", label: "My Profile", icon: User },
  ];

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
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#FAF8F4] text-[#1A221C] shadow-xs"
                      : "text-[#546457] hover:text-[#1A221C] hover:bg-[#E2D8C8]/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#4E6548]" : "text-[#738275]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right quick stats, Feedback & Profile Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share Feedback"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#4E6548]" />
              <span className="hidden md:inline">Feedback</span>
            </button>

            {/* Current Member Status & Profile Modal Trigger */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-xs font-semibold text-[#3B4A3E] border border-[#DDD2BF] transition-colors cursor-pointer"
              title="Account Preferences"
            >
              <div className="w-5 h-5 rounded-full bg-[#4E6548] text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline">
                {currentUser.name.split(" ")[0]}
              </span>
            </button>

            {/* Log Out Button */}
            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#EBE2D4] hover:bg-[#E2D2C2] text-[#8F3E2C] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Log Out</span>
            </button>

            <button
              id="btn-quick-play-first-flow"
              onClick={() => handleStartFlow(PRESET_FLOWS[0])}
              className="py-2.5 px-4 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">15m Desk Reset</span>
              <span className="sm:hidden">Start</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation Strip */}
        <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 border transition-all cursor-pointer ${
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

        {activeTab === "studio3d" && (
          <ThreeYogaStudio
            onStartPracticeFlow={handlePracticeSinglePose}
            onPoseInspected={(pose) => setInspectedPose(pose)}
          />
        )}

        {activeTab === "surya" && (
          <SuryaNamaskarStudio
            currentUserId={currentUser?.id}
            currentUserName={currentUser?.name}
            onSessionComplete={(session) => {
              setSessionHistory((prev) => [
                {
                  id: `session-${Date.now()}`,
                  flowId: "surya-namaskar-flow",
                  flowTitle: session.title,
                  category: "morningEnergy",
                  completedAt: session.completed_at,
                  durationMinutes: session.durationMinutes,
                  totalPosesCompleted: session.rounds * 12,
                  rating: 5,
                },
                ...prev,
              ]);
            }}
            onOpenCoach={(query) => {
              setActiveTab("coach");
            }}
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
            onInspectPose={handleInspectPose}
            onOpenCustomBuilder={() => setIsBuilderOpen(true)}
          />
        )}

        {activeTab === "poses" && (
          <PoseLibrary
            masteryState={masteryState}
            onSelectPose={handleInspectPose}
            onPracticePose={handlePracticeSinglePose}
            onLogPoseMastery={handleLogPoseMastery}
            onOpenProfileMastery={() => setActiveTab("profile")}
          />
        )}

        {activeTab === "breathwork" && <BreathworkStudio />}

        {activeTab === "coach" && (
          <AICoachChat
            onInspectPose={handleInspectPose}
            onPracticePose={handlePracticeSinglePose}
          />
        )}

        {activeTab === "guide" && <BeginnerGuide />}

        {activeTab === "profile" && (
          <UserProfileDashboard
            user={currentUser}
            sessionHistory={sessionHistory}
            masteryState={masteryState}
            onUpdateMasteryState={(ns) => {
              setMasteryState(ns);
              try {
                localStorage.setItem("flowstate_mastery_state", JSON.stringify(ns));
              } catch {}
            }}
            onNavigateToPoseLibrary={(filter) => {
              setActiveTab("poses");
            }}
            onStartPracticePose={handlePracticeSinglePose}
            onOpenAuth={() => setIsAuthOpen(true)}
            onStartFlow={handleStartFlow}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="text-xs text-[#4E6548] hover:underline font-semibold cursor-pointer"
            >
              Report an Issue / Feedback
            </button>
          </div>
        </div>
      </footer>

      {/* Gamified Badge Unlock Floating Toast Notification */}
      {unlockedToast && (
        <div
          id="badge-unlocked-toast"
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#1F2621] text-[#F9F7F2] p-4 rounded-2xl border border-[#4E6548] shadow-2xl animate-in slide-in-from-bottom-5 duration-300 flex items-start gap-3.5"
        >
          <div className="w-11 h-11 rounded-xl bg-[#4E6548] text-white flex items-center justify-center shrink-0 shadow-xs">
            {getToastBadgeIcon(unlockedToast.badge.iconName, "w-6 h-6 text-white")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#98C493] bg-[#4E6548]/30 px-2 py-0.5 rounded-md">
                Badge Unlocked!
              </span>
              <button
                onClick={() => setUnlockedToast(null)}
                className="text-[#96A699] hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="font-serif font-bold text-sm text-[#F7F4EE] mt-1">
              {unlockedToast.badge.title}
            </h4>
            <p className="text-xs text-[#B4C2B6] mt-0.5 leading-snug">
              {unlockedToast.badge.description}
            </p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#344036]">
              <span className="text-[10px] font-mono text-[#D8E6D6] font-semibold">
                +{unlockedToast.badge.xpReward} Mastery XP
              </span>
              <button
                onClick={() => {
                  setUnlockedToast(null);
                  setActiveTab("profile");
                }}
                className="text-[11px] font-semibold text-[#98C493] hover:underline ml-auto cursor-pointer"
              >
                View Mastery Profile &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

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
          masteryState={masteryState}
          onClose={() => setInspectedPose(null)}
          onStartSinglePosePractice={handlePracticeSinglePose}
          onLogPoseMastery={handleLogPoseMastery}
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
            localStorage.removeItem("flowstate_auth_token");
          } catch {}
          setCurrentUser(null);
        }}
        onUpdateProfile={(updated) => setCurrentUser(updated)}
      />

      {/* User Issue & Feedback Modal */}
      <UserFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
