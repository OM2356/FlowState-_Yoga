import React, { useState, useMemo } from "react";
import { YogaPose, PoseCategory, DifficultyLevel, UserMasteryState, PoseCompletionRecord } from "../types";
import { YOGA_POSES, MUSCLE_GROUPS_INFO } from "../data/posesData";
import { ThreeYogaHuman } from "./ThreeYogaHuman";
import { 
  Search, 
  Filter, 
  Sparkles, 
  Activity, 
  Play, 
  Eye, 
  Compass, 
  Layers,
  BookOpen,
  Volume2,
  Clock,
  Rotate3d,
  Trophy,
  Award,
  CheckCircle2,
  Zap,
  Shield,
  Star,
  Flame
} from "lucide-react";
import { audioEngine } from "../utils/audioEngine";

interface PoseLibraryProps {
  masteryState?: UserMasteryState;
  onSelectPose: (pose: YogaPose) => void;
  onPracticePose: (pose: YogaPose) => void;
  onLogPoseMastery?: (poseId: string, holdSeconds?: number) => void;
  onOpenProfileMastery?: () => void;
}

export const PoseLibrary: React.FC<PoseLibraryProps> = ({
  masteryState,
  onSelectPose,
  onPracticePose,
  onLogPoseMastery,
  onOpenProfileMastery,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");
  const [selectedMasteryFilter, setSelectedMasteryFilter] = useState<"all" | "mastered" | "in-progress" | "unpracticed">("all");
  const [speakingPoseId, setSpeakingPoseId] = useState<string | null>(null);

  const handleSpeakSanskrit = (e: React.MouseEvent, pose: YogaPose) => {
    e.stopPropagation();
    setSpeakingPoseId(pose.id);
    audioEngine.playSingingBowl(440);
    audioEngine.speakCue(`${pose.name}. In Sanskrit, ${pose.sanskritName}. ${pose.description}`);
    setTimeout(() => setSpeakingPoseId(null), 4000);
  };

  const posesMasteredCount = useMemo(() => {
    if (!masteryState || !masteryState.posesCompleted) return 0;
    return Object.values(masteryState.posesCompleted).filter((p: PoseCompletionRecord) => Boolean(p && p.completedCount > 0)).length;
  }, [masteryState]);

  const filteredPoses = useMemo(() => {
    return YOGA_POSES.filter((pose) => {
      const matchSearch =
        pose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.sanskritName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || pose.category === selectedCategory;

      const matchDifficulty =
        selectedDifficulty === "all" || pose.difficulty === selectedDifficulty;

      const matchMuscle =
        selectedMuscle === "all" ||
        pose.primaryMuscles.includes(selectedMuscle as any) ||
        pose.secondaryMuscles.includes(selectedMuscle as any);

      // Mastery filter
      let matchMastery = true;
      const rec = masteryState?.posesCompleted[pose.id];
      if (selectedMasteryFilter === "mastered") {
        matchMastery = Boolean(rec && (rec.masteryTier === 3 || rec.completedCount >= 5));
      } else if (selectedMasteryFilter === "in-progress") {
        matchMastery = Boolean(rec && rec.completedCount > 0 && rec.completedCount < 5);
      } else if (selectedMasteryFilter === "unpracticed") {
        matchMastery = !rec || rec.completedCount === 0;
      }

      return matchSearch && matchCategory && matchDifficulty && matchMuscle && matchMastery;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedMuscle, selectedMasteryFilter, masteryState]);

  return (
    <div id="pose-library-container" className="space-y-6">
      {/* Header & Mastery Status Banner */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E4DCD0] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DE] text-xs font-semibold text-[#4E6548] border border-[#DDD3C2] mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#C1664C]" />
              <span>Anatomical Asana Encyclopedia • 3D Skeletal Rigging</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C]">
              Human Posture & Alignment Library
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B60] mt-1 font-sans">
              Explore realistic 3D human biomechanics, muscle activation heatmaps, and alignment directives across all traditional yoga asanas.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8C9A8E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-pose-input"
              type="text"
              placeholder="Search pose or Sanskrit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#DDD3C3] text-xs text-[#2A342B] placeholder-[#9CA99F] focus:outline-hidden focus:border-[#4E6548] transition-colors"
            />
          </div>
        </div>

        {/* Gamified Pose Mastery Progress Bar */}
        {masteryState && (
          <div className="p-4 rounded-2xl bg-[#F2ECE0] border border-[#DDD0BC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4E6548] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Trophy className="w-5 h-5 text-[#FAF8F5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-serif font-bold text-[#1E2520]">
                    Pose Mastery Journey
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#4E6548]/15 text-[#3D5238] font-bold">
                    {posesMasteredCount} / {YOGA_POSES.length} Postures Mastered
                  </span>
                </div>
                <p className="text-[11px] text-[#5D6C5F] mt-0.5">
                  Complete Warrior poses, flexibility holds, and flow durations to unlock badges in your profile.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {onOpenProfileMastery && (
                <button
                  type="button"
                  onClick={onOpenProfileMastery}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EBE2D4] text-[#4E6548] text-xs font-semibold border border-[#D4C7B3] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Award className="w-3.5 h-3.5 text-[#C1664C]" />
                  <span>View Badges ({masteryState.unlockedBadgeIds.length})</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Featured Spotlight Card */}
        {searchQuery === "" && selectedCategory === "all" && selectedMasteryFilter === "all" && (
          <div 
            id="featured-twisted-lizard-card"
            onClick={() => {
              const lizard = YOGA_POSES.find(p => p.id === "twisted-lizard");
              if (lizard) onSelectPose(lizard);
            }}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F0EAE1] to-[#FAF7F2] border border-[#DCD0BE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:border-[#4E6548] hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#4E6548] text-white flex items-center justify-center font-serif text-lg font-bold shrink-0 shadow-xs">
                3D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C1664C] bg-[#C1664C]/10 px-2 py-0.5 rounded-md">
                    Featured Asana
                  </span>
                  <span className="text-xs text-[#637366] font-medium">Deep Quadriceps & Psoas Opener</span>
                </div>
                <h4 className="text-base sm:text-lg font-serif font-medium text-[#1A221C] mt-0.5">
                  Twisted Lizard Pose • Parivrtta Utthan Pristhasana
                </h4>
                <p className="text-xs text-[#5D6B60] mt-0.5">
                  Deep lunge with back knee quad stretch & thoracic spinal twist in 3D interactive mannequin.
                </p>
              </div>
            </div>
            <button
              id="view-twisted-lizard-3d-btn"
              onClick={(e) => {
                e.stopPropagation();
                const lizard = YOGA_POSES.find(p => p.id === "twisted-lizard");
                if (lizard) onSelectPose(lizard);
              }}
              className="px-4 py-2 rounded-xl bg-[#4E6548] hover:bg-[#3D5238] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect 3D Pose</span>
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="pt-4 border-t border-[#E8DFD0] flex flex-wrap items-center justify-between gap-3">
          {/* Category Dropdown/Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[#6D7A70] font-medium mr-1 text-[11px] uppercase tracking-wider">
              Category:
            </span>
            {[
              { id: "all", label: "All Poses" },
              { id: "standing", label: "Standing" },
              { id: "balance", label: "Balancing" },
              { id: "backbend", label: "Backbends" },
              { id: "forwardBend", label: "Forward Folds" },
              { id: "inversion", label: "Inversions" },
              { id: "seatedRestorative", label: "Restorative" },
            ].map((cat) => (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#4E6548] text-white border-[#4E6548] shadow-xs"
                    : "bg-[#F4EFE6] text-[#47554A] border-[#DED4C4] hover:bg-[#EBE2D4]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mastery Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#6D7A70] font-medium text-[11px] uppercase tracking-wider">
              Mastery:
            </span>
            {[
              { id: "all", label: "All" },
              { id: "mastered", label: "Mastered ⭐" },
              { id: "in-progress", label: "Practicing" },
              { id: "unpracticed", label: "New" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMasteryFilter(m.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedMasteryFilter === m.id
                    ? "bg-[#8B5A3C] text-white border-[#8B5A3C] shadow-xs"
                    : "bg-[#F4EFE6] text-[#47554A] border-[#DED4C4] hover:bg-[#EBE2D4]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Poses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPoses.map((pose) => {
          const record = masteryState?.posesCompleted[pose.id];
          const completedCount = record?.completedCount || 0;
          const totalHold = record?.totalHoldSeconds || 0;
          const isMastered = completedCount >= 5 || record?.masteryTier === 3;
          const isAdept = completedCount >= 3;
          const isPracticed = completedCount >= 1;

          return (
            <div
              key={pose.id}
              id={`pose-card-${pose.id}`}
              className="group bg-[#FAF8F4] rounded-3xl border border-[#E2DAD0] hover:border-[#4E6548]/70 hover:shadow-xl hover:shadow-[#4E6548]/10 hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.99] transition-all duration-300 ease-out p-4 flex flex-col justify-between cursor-pointer relative"
              onClick={() => onSelectPose(pose)}
            >
              <div>
                {/* Card Header metadata with Mastery Tier Ribbon */}
                <div className="flex items-center justify-between text-xs text-[#7A887C] mb-1.5">
                  <span className="capitalize text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EBE3D6] text-[#4F5E52] group-hover:bg-[#E5DBCB] transition-colors">
                    {pose.category}
                  </span>

                  {/* Mastery Pill */}
                  {isMastered ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#4E6548]/15 text-[#3D5238] border border-[#4E6548]/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-[#4E6548]" />
                      <span>Tier 3 Master</span>
                    </span>
                  ) : isAdept ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#8B5A3C]/15 text-[#734529] border border-[#8B5A3C]/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#8B5A3C]" />
                      <span>Tier 2 Adept</span>
                    </span>
                  ) : isPracticed ? (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#E5DDD0] text-[#556357]">
                      {completedCount}x held
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#8C7A6D] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#4E6548]" />
                      {pose.recommendedHoldSeconds}s
                    </span>
                  )}
                </div>

                {/* Pose Names & Sanskrit Pronunciation */}
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h3 className="text-lg font-serif font-medium text-[#1E2520] group-hover:text-[#4E6548] transition-colors">
                      {pose.name}
                    </h3>
                    <span className="text-xs font-serif italic text-[#8B786B] block mb-2">
                      {pose.sanskritName}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleSpeakSanskrit(e, pose)}
                    className={`p-1.5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                      speakingPoseId === pose.id
                        ? "bg-[#4E6548] text-white border-[#4E6548]"
                        : "bg-[#EFE8DC] text-[#556758] border-[#DFD5C4] hover:bg-[#E5DCB] hover:text-[#1A221C]"
                    }`}
                    title="Listen to pronunciation & cue"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Realistic 3D Human Model Visualizer */}
                <div
                  className="w-full h-[190px] bg-[#F3EDE2] rounded-2xl overflow-hidden border border-[#E4DCD0] group-hover:border-[#D6CAB8] transition-all duration-300 relative"
                  title="Click to view detailed 3D alignment"
                >
                  <ThreeYogaHuman
                    pose={pose}
                    height={190}
                    interactiveControls={false}
                    className="w-full h-full"
                  />
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-semibold text-white flex items-center gap-1">
                    <Rotate3d className="w-2.5 h-2.5" />
                    <span>3D</span>
                  </div>
                </div>

                {/* Muscle tags preview */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {pose.primaryMuscles.slice(0, 2).map((m) => (
                    <span
                      key={m}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#EFE9DF] text-[#556357] font-medium border border-[#DDD3C3] group-hover:border-[#D0C2B0] transition-colors"
                    >
                      {MUSCLE_GROUPS_INFO[m]?.label || m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions: 3D Alignment & Quick Form Hold Mastery Log */}
              <div className="flex items-center gap-1.5 mt-3.5 pt-2.5 border-t border-[#E8E0D2]">
                <button
                  id={`btn-inspect-card-${pose.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPose(pose);
                  }}
                  className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#EDE5D8] hover:bg-[#DFD5C5] text-[#334237] text-xs font-medium border border-[#D4C8B5] flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#4E6548]" />
                  <span>3D Alignment</span>
                </button>

                {onLogPoseMastery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogPoseMastery(pose.id, pose.recommendedHoldSeconds || 30);
                    }}
                    className="py-1.5 px-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EBE2D4] text-[#8B5A3C] border border-[#DDD3C2] text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title={`Log ${pose.recommendedHoldSeconds || 30}s hold mastery`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4E6548]" />
                    <span>+Hold</span>
                  </button>
                )}

                <button
                  id={`btn-practice-card-${pose.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPracticePose(pose);
                  }}
                  className="py-1.5 px-2.5 rounded-xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs font-medium flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Practice pose with live timer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPoses.length === 0 && (
        <div className="p-12 text-center bg-[#FAF7F2] rounded-3xl border border-[#E4DCD0] space-y-2">
          <p className="text-sm font-serif text-[#49574C]">No yoga postures matched your filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
              setSelectedMuscle("all");
              setSelectedMasteryFilter("all");
            }}
            className="text-xs text-[#C1664C] underline font-medium hover:text-[#9A4E38] cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};

