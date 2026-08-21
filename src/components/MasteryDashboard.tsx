import React, { useState } from "react";
import { 
  MasteryBadge, 
  UserMasteryState, 
  BadgeProgress, 
  PracticeSessionRecord, 
  UserProfile, 
  YogaPose,
  MasteryBadgeCategory,
  BadgeRarity
} from "../types";
import { 
  MASTERY_BADGES, 
  getXpRankInfo, 
  calculateBadgeProgress, 
  evaluateAndUnlockBadges 
} from "../data/masteryBadges";
import { YOGA_POSES } from "../data/posesData";
import { 
  Award, 
  Shield, 
  Sparkles, 
  Compass, 
  Heart, 
  Flame, 
  Layers, 
  Play, 
  BookOpen, 
  Wind, 
  Rotate3d, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Trophy, 
  ChevronRight, 
  Clock, 
  Zap, 
  Star, 
  X, 
  ExternalLink,
  Target,
  BarChart3,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { audioEngine } from "../utils/audioEngine";

interface MasteryDashboardProps {
  masteryState: UserMasteryState;
  sessionHistory: PracticeSessionRecord[];
  user: UserProfile | null;
  onUpdateMasteryState: (newState: UserMasteryState) => void;
  onNavigateToPoseLibrary: (poseIdFilter?: string) => void;
  onStartPracticePose: (pose: YogaPose) => void;
}

export const MasteryDashboard: React.FC<MasteryDashboardProps> = ({
  masteryState,
  sessionHistory,
  user,
  onUpdateMasteryState,
  onNavigateToPoseLibrary,
  onStartPracticePose,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unlocked" | "in-progress" | MasteryBadgeCategory>("all");
  const [activeBadgeModal, setActiveBadgeModal] = useState<BadgeProgress | null>(null);

  // Compute Rank and Level info
  const rankInfo = getXpRankInfo(masteryState.totalXp);

  // Evaluate all badges
  const badgeProgressList: BadgeProgress[] = MASTERY_BADGES.map((badge) =>
    calculateBadgeProgress(badge, masteryState, sessionHistory, user)
  );

  const unlockedCount = badgeProgressList.filter((b) => b.isUnlocked).length;
  const totalBadges = MASTERY_BADGES.length;
  const posesMasteredCount = Object.keys(masteryState.posesCompleted).length;
  const totalPosesInLibrary = YOGA_POSES.length;

  // Filtered badges
  const filteredBadges = badgeProgressList.filter((bp) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unlocked") return bp.isUnlocked;
    if (selectedFilter === "in-progress") return !bp.isUnlocked;
    return bp.badge.category === selectedFilter;
  });

  // Calculate Category Mastery Progress percentages
  const categories: { id: string; label: string; poses: YogaPose[]; icon: any }[] = [
    {
      id: "standing",
      label: "Standing & Strength",
      poses: YOGA_POSES.filter((p) => p.category === "standing"),
      icon: Shield,
    },
    {
      id: "balance",
      label: "Equilibrium & Balance",
      poses: YOGA_POSES.filter((p) => p.category === "balance"),
      icon: Compass,
    },
    {
      id: "flexibility",
      label: "Hamstring & Hip Mobility",
      poses: YOGA_POSES.filter((p) => p.category === "forwardBend" || p.id === "pigeon-pose"),
      icon: Sparkles,
    },
    {
      id: "backbend",
      label: "Spine & Heart Openers",
      poses: YOGA_POSES.filter((p) => p.category === "backbend"),
      icon: Heart,
    },
    {
      id: "restorative",
      label: "Restorative & Breath",
      poses: YOGA_POSES.filter((p) => p.category === "seatedRestorative"),
      icon: Wind,
    },
  ];

  // Helper icon lookup
  const getBadgeIcon = (iconName: string, className: string = "w-5 h-5") => {
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

  const getRarityBadge = (rarity: BadgeRarity) => {
    switch (rarity) {
      case "legendary":
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C1664C]/20 text-[#A64E35] border border-[#C1664C]/30">Legendary</span>;
      case "epic":
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#8B5A3C]/20 text-[#734529] border border-[#8B5A3C]/30">Epic</span>;
      case "rare":
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#4E6548]/20 text-[#3D5238] border border-[#4E6548]/30">Rare</span>;
      default:
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E5DDD0] text-[#556357] border border-[#D5CBB8]">Standard</span>;
    }
  };

  // Quick Action: Simulate completing a posture to demonstrate mastery unlock
  const handleQuickMasterPose = (poseId: string) => {
    const pose = YOGA_POSES.find((p) => p.id === poseId);
    if (!pose) return;

    const currentRec = masteryState.posesCompleted[poseId] || {
      poseId,
      completedCount: 0,
      totalHoldSeconds: 0,
      lastCompletedAt: new Date().toISOString(),
      masteryTier: 1,
    };

    const newHold = currentRec.totalHoldSeconds + (pose.recommendedHoldSeconds || 45);
    const newCount = currentRec.completedCount + 1;
    const newTier: 1 | 2 | 3 = newCount >= 5 ? 3 : newCount >= 3 ? 2 : 1;

    const updatedPoses = {
      ...masteryState.posesCompleted,
      [poseId]: {
        poseId,
        completedCount: newCount,
        totalHoldSeconds: newHold,
        lastCompletedAt: new Date().toISOString(),
        masteryTier: newTier,
      },
    };

    const updatedState: UserMasteryState = {
      ...masteryState,
      posesCompleted: updatedPoses,
      totalXp: masteryState.totalXp + 50,
      lastUpdated: new Date().toISOString(),
    };

    const { updatedState: finalState, newlyUnlockedBadges } = evaluateAndUnlockBadges(
      updatedState,
      sessionHistory,
      user
    );

    onUpdateMasteryState(finalState);
    audioEngine.playSingingBowl(440);

    if (newlyUnlockedBadges.length > 0) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#4E6548", "#C1664C", "#EBE2D4", "#8B5A3C"],
      });
    }
  };

  return (
    <div id="mastery-dashboard-container" className="space-y-6">
      {/* Level & Rank Showcase Header Banner */}
      <div className="bg-gradient-to-br from-[#273229] via-[#1E2620] to-[#151B16] text-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#3A493D] shadow-md relative overflow-hidden">
        {/* Background ambient aesthetic flourishes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4E6548]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#C1664C]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Rank Badge & Title */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4E6548] to-[#2E3C2B] p-0.5 border border-[#8BBA85]/40 shadow-inner flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[22px] bg-[#1C241E] flex flex-col items-center justify-center text-center">
                <Trophy className="w-7 h-7 text-[#8BBA85]" />
                <span className="text-[11px] font-bold text-[#A5CCA0] uppercase tracking-wider mt-0.5">
                  Lvl {rankInfo.level}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#8BBA85]/20 text-[#8BBA85] border border-[#8BBA85]/30">
                  Tier {rankInfo.level} Asana Mastery
                </span>
                <span className="text-xs text-[#8BA08E] font-medium hidden sm:inline">
                  • Gamified Yoga Progression
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#FAF8F5] mt-1">
                {rankInfo.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#A2B5A5] mt-0.5 font-sans">
                Earn mastery badges by completing warrior stances, flexibility holds, and consistent flow durations.
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-2xl bg-[#2D3930]/80 border border-[#3D4D40] text-center">
              <span className="text-[11px] text-[#8BA08E] block uppercase tracking-wider font-semibold">
                Badges
              </span>
              <div className="text-xl font-serif font-bold text-[#FAF8F5] mt-0.5 flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-[#8BBA85]" />
                <span>{unlockedCount}/{totalBadges}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#2D3930]/80 border border-[#3D4D40] text-center">
              <span className="text-[11px] text-[#8BA08E] block uppercase tracking-wider font-semibold">
                Poses
              </span>
              <div className="text-xl font-serif font-bold text-[#FAF8F5] mt-0.5 flex items-center justify-center gap-1">
                <BookOpen className="w-4 h-4 text-[#D48B70]" />
                <span>{posesMasteredCount}/{totalPosesInLibrary}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#2D3930]/80 border border-[#3D4D40] text-center">
              <span className="text-[11px] text-[#8BA08E] block uppercase tracking-wider font-semibold">
                Total XP
              </span>
              <div className="text-xl font-serif font-bold text-[#FAF8F5] mt-0.5 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-[#E2B755]" />
                <span>{masteryState.totalXp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-[#3B4C3E] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#A2B5A5]">
              Progress to Level {rankInfo.level + 1} ({rankInfo.level < 10 ? "Next Rank" : "Max"}):
            </span>
            <span className="text-[#8BBA85] font-semibold">
              {masteryState.totalXp} / {rankInfo.maxXp} XP ({rankInfo.progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#18201A] overflow-hidden border border-[#3B4C3E] p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4E6548] via-[#6FA368] to-[#8BBA85] transition-all duration-700 shadow-sm"
              style={{ width: `${rankInfo.progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8BA08E]">
            <span>{rankInfo.title}</span>
            <span>{rankInfo.xpToNext > 0 ? `${rankInfo.xpToNext} XP needed for next tier` : "Mastery Peak Reached"}</span>
          </div>
        </div>
      </div>

      {/* Category Mastery Progress Matrix */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4E6548]">
              <Target className="w-4 h-4" />
              <span>Anatomical Asana Competencies</span>
            </div>
            <h3 className="font-serif text-xl font-medium text-[#1A221C] mt-0.5">
              Category Mastery Breakdown
            </h3>
          </div>
          <button
            onClick={() => onNavigateToPoseLibrary()}
            className="text-xs text-[#4E6548] hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Browse All 24 Library Asanas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const masteredInCat = cat.poses.filter(
              (p) => masteryState.posesCompleted[p.id] && masteryState.posesCompleted[p.id].completedCount > 0
            ).length;
            const totalInCat = cat.poses.length;
            const catPercent = totalInCat > 0 ? Math.min(100, Math.round((masteredInCat / totalInCat) * 100)) : 0;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#DDD3C2] hover:border-[#4E6548]/60 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#EBE2D4] text-[#4E6548] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold text-[#1E2520]">{cat.label}</h4>
                      <span className="text-[10px] text-[#677769]">
                        {masteredInCat} of {totalInCat} poses completed
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#4E6548]">
                    {catPercent}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#E8DFD0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4E6548] transition-all duration-500"
                    style={{ width: `${catPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Gallery & Filter Header */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C1664C]">
                Trophy Hall & Milestones
              </span>
              <span className="text-xs text-[#708073]">({unlockedCount} / {totalBadges} Unlocked)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#1A221C] mt-0.5">
              Mastery Badges
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "all", label: "All Badges" },
              { id: "unlocked", label: `Earned (${unlockedCount})` },
              { id: "in-progress", label: `In Progress (${totalBadges - unlockedCount})` },
              { id: "poses", label: "Postures" },
              { id: "flexibility", label: "Flexibility" },
              { id: "balance", label: "Balance" },
              { id: "duration", label: "Flow Duration" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? "bg-[#4E6548] text-white border-[#4E6548] shadow-2xs"
                    : "bg-[#EBE2D4] text-[#425244] border-[#DDD2BF] hover:bg-[#DDD2BF]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges.map((bp) => {
            const { badge, isUnlocked, unlockedAt, progressPercent, progressLabel } = bp;
            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                onClick={() => setActiveBadgeModal(bp)}
                className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  isUnlocked
                    ? "bg-[#FAF8F4] border-[#4E6548]/40 hover:border-[#4E6548] hover:shadow-md hover:-translate-y-1"
                    : "bg-[#F3EDE2]/60 border-[#DDD3C2] hover:border-[#C0B3A0] opacity-85 hover:opacity-100"
                }`}
              >
                {/* Top Badge Banner */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Badge Icon Emblem */}
                    <div
                      className={`w-14 h-14 rounded-2xl p-0.5 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105 ${
                        isUnlocked
                          ? "bg-gradient-to-br " + badge.gradient + " text-white"
                          : "bg-[#DDD3C2] text-[#869488]"
                      }`}
                    >
                      <div className="w-full h-full rounded-[14px] flex items-center justify-center bg-black/10">
                        {isUnlocked ? (
                          getBadgeIcon(badge.iconName, "w-7 h-7")
                        ) : (
                          <Lock className="w-5 h-5 text-[#738275]" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {getRarityBadge(badge.rarity)}
                      <span className="text-[11px] font-mono font-semibold text-[#8B5A3C]">
                        +{badge.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="text-base font-serif font-bold text-[#1E2520] group-hover:text-[#4E6548] transition-colors">
                    {badge.title}
                  </h4>
                  <span className="text-[11px] font-serif italic text-[#7A6B5F] block mb-2">
                    {badge.subtitle}
                  </span>

                  {/* Description */}
                  <p className="text-xs text-[#526355] leading-relaxed line-clamp-2 mb-3">
                    {badge.description}
                  </p>
                </div>

                {/* Progress Bar & Status Footer */}
                <div className="pt-3 border-t border-[#E8DFD0] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#657567] font-medium">{progressLabel}</span>
                    <span className={`font-bold ${isUnlocked ? "text-[#4E6548]" : "text-[#8B5A3C]"}`}>
                      {progressPercent}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#E5DDD0] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? "bg-gradient-to-r from-[#4E6548] to-[#8BBA85]"
                          : "bg-gradient-to-r from-[#C1664C] to-[#E28B70]"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {isUnlocked ? (
                      <span className="text-[10px] font-semibold text-[#4E6548] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Unlocked {unlockedAt ? new Date(unlockedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Earned"}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#869488]">
                        Tap to view objectives
                      </span>
                    )}

                    <span className="text-xs text-[#4E6548] group-hover:translate-x-1 transition-transform flex items-center">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Badge Details Modal */}
      {activeBadgeModal && (
        <div
          id="badge-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181B18]/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveBadgeModal(null)}
        >
          <div
            className="w-full max-w-xl bg-[#FAF8F5] rounded-3xl border border-[#E2DAD0] shadow-2xl p-6 sm:p-8 space-y-5 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl p-0.5 flex items-center justify-center shadow-xs ${
                    activeBadgeModal.isUnlocked
                      ? "bg-gradient-to-br " + activeBadgeModal.badge.gradient + " text-white"
                      : "bg-[#DDD3C2] text-[#869488]"
                  }`}
                >
                  <div className="w-full h-full rounded-[14px] flex items-center justify-center bg-black/10">
                    {activeBadgeModal.isUnlocked ? (
                      getBadgeIcon(activeBadgeModal.badge.iconName, "w-8 h-8")
                    ) : (
                      <Lock className="w-6 h-6 text-[#6B7B6E]" />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    {getRarityBadge(activeBadgeModal.badge.rarity)}
                    <span className="text-xs font-mono font-bold text-[#8B5A3C]">
                      +{activeBadgeModal.badge.xpReward} XP Reward
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1E2520] mt-0.5">
                    {activeBadgeModal.badge.title}
                  </h3>
                  <span className="text-xs font-serif italic text-[#7A6B5F]">
                    {activeBadgeModal.badge.subtitle}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveBadgeModal(null)}
                className="p-1.5 rounded-full bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#556658] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lore and Description */}
            <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#DDD3C2] space-y-2 text-xs text-[#475749]">
              <p className="font-medium text-[#1E2520]">
                {activeBadgeModal.badge.description}
              </p>
              <p className="italic text-[#68786A] text-[11px] leading-relaxed border-t border-[#E2D8C7] pt-2">
                "{activeBadgeModal.badge.lore}"
              </p>
            </div>

            {/* Requirements & Target Poses Breakdown */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4E6548] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Associated Postures & Objectives</span>
              </h4>

              {activeBadgeModal.badge.requiredPoseIds && activeBadgeModal.badge.requiredPoseIds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeBadgeModal.badge.requiredPoseIds.map((poseId) => {
                    const pose = YOGA_POSES.find((p) => p.id === poseId);
                    const record = masteryState.posesCompleted[poseId];
                    const isDone = record && record.completedCount > 0;

                    return (
                      <div
                        key={poseId}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                          isDone
                            ? "bg-[#EFE9DF] border-[#C8BCAB] text-[#2C382F]"
                            : "bg-[#FAF8F4] border-[#E2DAD0] text-[#718073]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-[#4E6548] shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-[#B8A997] shrink-0" />
                          )}
                          <div>
                            <span className="font-semibold block text-[#1E2520]">
                              {pose?.name || poseId}
                            </span>
                            <span className="text-[10px] text-[#697A6C]">
                              {isDone ? `${record.completedCount}x held (${record.totalHoldSeconds}s)` : "Not yet held"}
                            </span>
                          </div>
                        </div>

                        {pose && (
                          <button
                            type="button"
                            onClick={() => {
                              handleQuickMasterPose(pose.id);
                            }}
                            className="py-1 px-2 rounded-lg bg-[#4E6548] hover:bg-[#3D5238] text-white text-[10px] font-semibold transition-colors cursor-pointer shrink-0"
                            title="Quick log 30s form hold for testing"
                          >
                            + Practice
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#DDD3C2] text-xs text-[#556658]">
                  <strong>Requirement:</strong> {activeBadgeModal.progressLabel}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#E8DFD0] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActiveBadgeModal(null);
                  onNavigateToPoseLibrary();
                }}
                className="py-2.5 px-4 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Pose Library</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
