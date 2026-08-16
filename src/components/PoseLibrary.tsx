import React, { useState, useMemo } from "react";
import { YogaPose, PoseCategory, DifficultyLevel } from "../types";
import { YOGA_POSES, MUSCLE_GROUPS_INFO } from "../data/posesData";
import { HumanYogaAvatar } from "./HumanYogaAvatar";
import { 
  Search, 
  Filter, 
  Sparkles, 
  Activity, 
  Play, 
  Eye, 
  Compass, 
  Layers 
} from "lucide-react";

interface PoseLibraryProps {
  onSelectPose: (pose: YogaPose) => void;
  onPracticePose: (pose: YogaPose) => void;
}

export const PoseLibrary: React.FC<PoseLibraryProps> = ({
  onSelectPose,
  onPracticePose,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all");

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

      return matchSearch && matchCategory && matchDifficulty && matchMuscle;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedMuscle]);

  return (
    <div id="pose-library-container" className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E4DCD0] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DE] text-xs font-semibold text-[#5A6D56] border border-[#DDD3C2] mb-2">
              <BookOpenIcon className="w-3.5 h-3.5 text-[#BF6F55]" />
              <span>Anatomical Asana Encyclopedia</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1E241F]">
              Human Posture & Alignment Library
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B60] mt-1 font-sans">
              Explore realistic human biomechanics, muscle activation heatmaps, and alignment directives across all traditional asanas.
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
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#F4EFE6] border border-[#DDD3C3] text-xs text-[#2A342B] placeholder-[#9CA99F] focus:outline-hidden focus:border-[#5A6D56] transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pt-4 border-t border-[#E8DFD0] flex flex-wrap items-center gap-2">
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
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#5A6D56] text-white border-[#5A6D56] shadow-xs"
                    : "bg-[#F4EFE6] text-[#47554A] border-[#DED4C4] hover:bg-[#EBE2D4]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5 ml-auto text-xs">
            <span className="text-[#6D7A70] font-medium text-[11px] uppercase tracking-wider">Level:</span>
            {["all", "beginner", "intermediate", "advanced"].map((lvl) => (
              <button
                key={lvl}
                id={`filter-lvl-${lvl}`}
                onClick={() => setSelectedDifficulty(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize border transition-all ${
                  selectedDifficulty === lvl
                    ? "bg-[#BF6F55] text-white border-[#BF6F55] font-medium shadow-xs"
                    : "bg-[#F4EFE6] text-[#47554A] border-[#DED4C4] hover:bg-[#EBE2D4]"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Poses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPoses.map((pose) => (
          <div
            key={pose.id}
            id={`pose-card-${pose.id}`}
            className="group bg-[#FAF8F4] rounded-3xl border border-[#E2DAD0] hover:border-[#BF6F55]/60 hover:shadow-md transition-all p-4 flex flex-col justify-between"
          >
            <div>
              {/* Card Header metadata */}
              <div className="flex items-center justify-between text-xs text-[#7A887C] mb-1.5">
                <span className="capitalize text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EBE3D6] text-[#4F5E52]">
                  {pose.category}
                </span>
                <span className="text-[11px] text-[#8C7A6D] font-medium">
                  {pose.difficulty}
                </span>
              </div>

              {/* Pose Names */}
              <h3 className="text-lg font-serif font-medium text-[#1E2520] group-hover:text-[#BF6F55] transition-colors">
                {pose.name}
              </h3>
              <span className="text-xs font-serif italic text-[#8B786B] block mb-3">
                {pose.sanskritName}
              </span>

              {/* Realistic Human Avatar Visualizer */}
              <div
                onClick={() => onSelectPose(pose)}
                className="w-full bg-[#F3EDE2] rounded-2xl p-2 flex items-center justify-center cursor-pointer border border-[#E4DCD0] group-hover:bg-[#EFE7DA] transition-colors"
                title="Click to view detailed 3D alignment"
              >
                <HumanYogaAvatar
                  pose={pose}
                  size="md"
                  showAlignmentGuides={true}
                  className="bg-transparent border-0 shadow-none p-0 max-h-[190px]"
                />
              </div>

              {/* Muscle tags preview */}
              <div className="flex flex-wrap gap-1 mt-3">
                {pose.primaryMuscles.slice(0, 2).map((m) => (
                  <span
                    key={m}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#EFE9DF] text-[#556357] font-medium border border-[#DDD3C3]"
                  >
                    {MUSCLE_GROUPS_INFO[m]?.label || m}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E8E0D2]">
              <button
                id={`btn-inspect-card-${pose.id}`}
                onClick={() => onSelectPose(pose)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#EDE5D8] hover:bg-[#DFD5C5] text-[#334237] text-xs font-medium border border-[#D4C8B5] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#BF6F55]" />
                <span>Examine</span>
              </button>

              <button
                id={`btn-practice-card-${pose.id}`}
                onClick={() => onPracticePose(pose)}
                className="py-2 px-3 rounded-xl bg-[#5A6D56] hover:bg-[#485944] text-white text-xs font-medium flex items-center justify-center gap-1 shadow-xs transition-colors"
                title="Practice pose with live timer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        ))}
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
            }}
            className="text-xs text-[#BF6F55] underline font-medium hover:text-[#9A4E38]"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};

function BookOpenIcon(props: any) {
  return <Layers {...props} />;
}
