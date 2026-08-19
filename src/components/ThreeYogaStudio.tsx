import React, { useState, useMemo, useRef } from "react";
import { YogaPose, PoseCategory, DifficultyLevel, MuscleGroup } from "../types";
import { YOGA_POSES, MUSCLE_GROUPS_INFO } from "../data/posesData";
import { ThreeYogaHuman } from "./ThreeYogaHuman";
import { audioEngine } from "../utils/audioEngine";
import { 
  Play, 
  Pause, 
  Rotate3d, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Sliders, 
  Layers, 
  Activity, 
  Sparkles, 
  Search, 
  Filter, 
  Eye, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Compass, 
  Upload, 
  FileCode, 
  Sun, 
  ShieldCheck, 
  ChevronRight,
  Maximize2,
  Info,
  Clock,
  Heart,
  Wind
} from "lucide-react";

interface ThreeYogaStudioProps {
  onStartPracticeFlow?: (pose: YogaPose) => void;
  onPoseInspected?: (pose: YogaPose) => void;
}

export const ThreeYogaStudio: React.FC<ThreeYogaStudioProps> = ({
  onStartPracticeFlow,
  onPoseInspected,
}) => {
  // Active selected pose in 3D studio
  const [selectedPoseId, setSelectedPoseId] = useState<string>("warrior-2");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // 3D Playback & Camera Controls State
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.5x, 1.0x, 1.5x, 2.0x
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<"threeQuarter" | "side" | "front" | "top">("threeQuarter");
  const [depthLevel, setDepthLevel] = useState<number>(0.5);
  const [materialMode, setMaterialMode] = useState<"skin" | "heatmap" | "clay" | "wireframe">("skin");
  const [infoTab, setInfoTab] = useState<"instructions" | "anatomy" | "cues" | "breath">("instructions");
  const [speakingPose, setSpeakingPose] = useState<boolean>(false);

  // Current Pose Object
  const currentPose = useMemo(() => {
    return YOGA_POSES.find((p) => p.id === selectedPoseId) || YOGA_POSES[0];
  }, [selectedPoseId]);

  // Filtered poses for sidebar
  const filteredPoses = useMemo(() => {
    return YOGA_POSES.filter((pose) => {
      const matchSearch =
        pose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.sanskritName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "all" || pose.category === selectedCategory;
      const matchDiff = selectedDifficulty === "all" || pose.difficulty === selectedDifficulty;
      return matchSearch && matchCat && matchDiff;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Audio Vocal Alignment Cue
  const handlePlayVoiceCue = () => {
    setSpeakingPose(true);
    audioEngine.playSingingBowl(329.63);
    const text = `${currentPose.name}. ${currentPose.sanskritName}. ${currentPose.description}. ${currentPose.stepByStepInstructions[0] || ""} ${currentPose.breathGuide.inhaleAction} ${currentPose.breathGuide.exhaleAction}`;
    audioEngine.speakCue(text);
    setTimeout(() => setSpeakingPose(false), 6000);
  };

  return (
    <div id="three-yoga-studio-root" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Studio Banner */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9DE] text-xs font-semibold text-[#4E6548] border border-[#DDD3C2] mb-2">
            <Rotate3d className="w-3.5 h-3.5 text-[#C1664C]" />
            <span>Interactive 3D Yoga Studio • Full Human Biomechanics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C]">
            3D Asana Biomechanics & Pose Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6A5E] mt-1 max-w-2xl">
            Examine precise human joint kinematics in 360°, inspect muscle activation heatmaps, adjust playback speeds, and study detailed alignment cues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onStartPracticeFlow && (
            <button
              onClick={() => onStartPracticeFlow(currentPose)}
              className="px-4 py-2.5 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Practice {currentPose.name}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pose Selector Sidebar (3 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-[#FAF7F2] p-4 sm:p-5 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DFD2] pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4E6548]" />
              <h3 className="font-serif text-base font-medium text-[#1A221C]">
                Pose Selector
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#667668] bg-[#ECE4D6] px-2 py-0.5 rounded-full">
              {filteredPoses.length} Poses
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#88978A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pose or Sanskrit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#D8CFBF] text-xs text-[#2A342B] placeholder-[#9AA89D] focus:outline-hidden focus:border-[#4E6548]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: "all", label: "All" },
              { id: "standing", label: "Standing" },
              { id: "balance", label: "Balance" },
              { id: "backbend", label: "Backbend" },
              { id: "seatedRestorative", label: "Floor" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#4E6548] text-white shadow-2xs"
                    : "bg-[#EFE7DC] text-[#4A594D] hover:bg-[#E2D8CA]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Pose List Items */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 no-scrollbar">
            {filteredPoses.map((pose) => {
              const isSelected = pose.id === selectedPoseId;
              return (
                <div
                  key={pose.id}
                  id={`pose-item-${pose.id}`}
                  onClick={() => setSelectedPoseId(pose.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-[#FAF8F4] border-[#4E6548] ring-2 ring-[#4E6548]/15 shadow-xs"
                      : "bg-[#FAF7F2] border-[#E8DFC0]/50 hover:bg-[#F4ECE1] hover:border-[#D5CABE]"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-sm font-medium text-[#1A221C]">
                        {pose.name}
                      </span>
                    </div>
                    <span className="text-xs text-[#7B6A5D] font-serif italic block">
                      {pose.sanskritName}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-[#69796B] font-medium pt-0.5">
                      <span className="capitalize">{pose.category}</span>
                      <span>•</span>
                      <span className="capitalize">{pose.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isSelected ? (
                      <span className="w-6 h-6 rounded-full bg-[#4E6548] text-white flex items-center justify-center text-xs shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-[#88978A] hover:text-[#1A221C] p-1">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: 3D Viewer Canvas & Playback Bar (6 cols on lg, 6 cols on xl) */}
        <div className="lg:col-span-8 xl:col-span-6 space-y-4">
          {/* Main 3D Canvas Box */}
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E2DAD0] shadow-xs overflow-hidden flex flex-col">
            {/* Top Canvas Bar */}
            <div className="px-5 py-3 border-b border-[#E8DFD2] flex flex-wrap items-center justify-between gap-3 bg-[#F6F0E6]/80">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4E6548] animate-pulse" />
                <span className="text-xs font-semibold text-[#1A221C]">
                  {currentPose.name}
                </span>
                <span className="text-xs text-[#7D6E61] italic font-serif hidden sm:inline">
                  ({currentPose.sanskritName})
                </span>
              </div>

              {/* Material mode switcher */}
              <div className="flex items-center bg-[#E6DDD0] p-0.5 rounded-xl text-xs">
                <button
                  onClick={() => setMaterialMode("skin")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    materialMode === "skin" ? "bg-[#4E6548] text-white shadow-2xs" : "text-[#47574A] hover:text-[#1A221C]"
                  }`}
                >
                  Realistic Skin
                </button>
                <button
                  onClick={() => setMaterialMode("heatmap")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    materialMode === "heatmap" ? "bg-[#4E6548] text-white shadow-2xs" : "text-[#47574A] hover:text-[#1A221C]"
                  }`}
                >
                  Muscle Map
                </button>
                <button
                  onClick={() => setMaterialMode("wireframe")}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    materialMode === "wireframe" ? "bg-[#4E6548] text-white shadow-2xs" : "text-[#47574A] hover:text-[#1A221C]"
                  }`}
                >
                  Skeletal Rig
                </button>
              </div>
            </div>

            {/* Central 3D Canvas */}
            <div className="relative w-full h-[440px] sm:h-[480px] bg-[#F7F4EE]">
              <ThreeYogaHuman
                pose={currentPose}
                height={480}
                depthLevel={depthLevel}
                showMuscleHeatmap={materialMode === "heatmap"}
                materialMode={materialMode}
                isBreathing={isPlayingAnimation}
                interactiveControls={true}
              />

              {/* In-Canvas Camera Quick View Pill */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#FAF8F4]/90 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-[#DED4C5] shadow-xs text-xs">
                <span className="text-[10px] text-[#69796C] font-semibold uppercase tracking-wider">
                  Drag to rotate • Scroll to zoom
                </span>
              </div>
            </div>

            {/* Comprehensive Playback & Studio Controls Bar */}
            <div className="p-4 sm:p-5 border-t border-[#E8DFD2] bg-[#FAF8F4] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Play / Pause Animation & Auto Rotate */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isPlayingAnimation
                        ? "bg-[#4E6548] text-white shadow-2xs"
                        : "bg-[#EAE2D5] text-[#2C382E] hover:bg-[#DCD0BF]"
                    }`}
                  >
                    {isPlayingAnimation ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlayingAnimation ? "Pause Breath" : "Play Breath"}</span>
                  </button>

                  <button
                    onClick={() => setIsAutoRotate(!isAutoRotate)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      isAutoRotate
                        ? "bg-[#1E2520] text-[#8BBA85] border-[#1E2520] shadow-2xs"
                        : "bg-[#EFE8DC] text-[#455447] border-[#DFD6C7] hover:bg-[#E3D9C9]"
                    }`}
                  >
                    <Rotate3d className="w-3.5 h-3.5" />
                    <span>Auto-Rotate {isAutoRotate ? "ON" : "OFF"}</span>
                  </button>
                </div>

                {/* Animation Playback Speed Slider / Selector */}
                <div className="flex items-center gap-1 bg-[#EBE2D4] p-1 rounded-xl text-xs">
                  <span className="text-[11px] font-semibold text-[#5A6A5C] px-2">Speed:</span>
                  {[0.5, 1.0, 1.5, 2.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        playbackSpeed === spd
                          ? "bg-[#4E6548] text-white shadow-2xs"
                          : "text-[#4A5A4D] hover:text-[#1A221C]"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Presets & Alignment Depth Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E8DFD2]">
                {/* Camera View Angle Selector */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#667768] uppercase tracking-wider block">
                    Camera View Angle:
                  </span>
                  <div className="flex items-center gap-1 bg-[#EFE8DC] p-1 rounded-xl text-xs">
                    {[
                      { id: "threeQuarter", label: "Perspective" },
                      { id: "front", label: "Front" },
                      { id: "side", label: "Side" },
                      { id: "top", label: "Top-Down" },
                    ].map((view) => (
                      <button
                        key={view.id}
                        onClick={() => setCameraPreset(view.id as any)}
                        className={`flex-1 py-1 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                          cameraPreset === view.id
                            ? "bg-[#FAF8F4] text-[#1A221C] shadow-2xs font-semibold"
                            : "text-[#556657] hover:text-[#1A221C]"
                        }`}
                      >
                        {view.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pose Depth / Intensity Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#667768] uppercase tracking-wider">
                    <span>Pose Depth / Extension:</span>
                    <span className="text-[#4E6548] font-bold">{Math.round(depthLevel * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={depthLevel}
                    onChange={(e) => setDepthLevel(parseFloat(e.target.value))}
                    className="w-full accent-[#4E6548] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Info Panel & Muscle Breakdown (3 cols) */}
        <div className="lg:col-span-12 xl:col-span-3 bg-[#FAF7F2] p-5 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
          {/* Pose Header & Voice Guide */}
          <div className="border-b border-[#E8DFD2] pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4E6548] bg-[#4E6548]/10 px-2.5 py-0.5 rounded-full">
                {currentPose.category} • {currentPose.difficulty}
              </span>
              <button
                onClick={handlePlayVoiceCue}
                className="px-2.5 py-1 rounded-xl bg-[#EBE2D4] hover:bg-[#DCD0BF] text-xs font-semibold text-[#2C382F] flex items-center gap-1 transition-colors cursor-pointer"
                title="Play vocal guidance"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#C1664C]" />
                <span>{speakingPose ? "Speaking..." : "Voice Guide"}</span>
              </button>
            </div>

            <h3 className="text-xl font-serif font-medium text-[#1A221C] mt-2">
              {currentPose.name}
            </h3>
            <span className="text-xs font-serif italic text-[#7C6C5F] block">
              {currentPose.sanskritName} {currentPose.englishPronunciation ? `• ${currentPose.englishPronunciation}` : ""}
            </span>
            <p className="text-xs text-[#526354] mt-2 leading-relaxed">
              {currentPose.description}
            </p>
          </div>

          {/* Info Section Tabs */}
          <div className="flex items-center gap-1 bg-[#ECE4D6] p-1 rounded-xl text-xs">
            {[
              { id: "instructions", label: "Steps" },
              { id: "anatomy", label: "Muscles" },
              { id: "cues", label: "Alignment" },
              { id: "breath", label: "Breathing" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setInfoTab(tab.id as any)}
                className={`flex-1 py-1 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                  infoTab === tab.id
                    ? "bg-[#FAF8F4] text-[#1A221C] font-semibold shadow-2xs"
                    : "text-[#556657] hover:text-[#1A221C]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Info Tab Content */}
          <div className="space-y-3 min-h-[300px]">
            {infoTab === "instructions" && (
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-[#243026] block">
                  Step-by-Step Instructions
                </span>
                <ol className="space-y-2 text-xs text-[#47574A] list-decimal list-inside leading-relaxed">
                  {currentPose.stepByStepInstructions.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      <span className="text-[#1A221C] font-medium">{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-4 pt-3 border-t border-[#E8DFD2] space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#667768] uppercase tracking-wider block">
                    Key Benefits:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPose.benefits.map((b, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-[#EFE7DB] text-[#334235] font-medium"
                      >
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {infoTab === "anatomy" && (
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-[#8B5A3C] uppercase tracking-wider block mb-1.5">
                    Primary Muscles Activated
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPose.primaryMuscles.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#C1664C]/15 text-[#8B3F2A] border border-[#E8C0B2]"
                      >
                        🔥 {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-1.5">
                    Secondary Stabilizers
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPose.secondaryMuscles.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-1 rounded-xl bg-[#4E6548]/10 text-[#344530] border border-[#C5D5C1]"
                      >
                        • {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-2xl bg-[#F4EFE6] border border-[#DDD3C2] text-xs text-[#526354]">
                  💡 <strong>Heatmap Visualizer:</strong> Switch material mode to "Muscle Map" above to inspect anatomical thermal activation directly on the 3D model.
                </div>
              </div>
            )}

            {infoTab === "cues" && (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#243026] block">
                  Joint Alignment Directives
                </span>
                <div className="space-y-2">
                  {currentPose.alignmentCues.map((cue, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#F5EFE5] border border-[#DDD3C2] text-xs space-y-0.5">
                      <span className="font-semibold text-[#4E6548] block">{cue.joint}</span>
                      <p className="text-[#3C4A3E]">{cue.cue}</p>
                    </div>
                  ))}
                </div>

                {currentPose.commonMistakes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E8DFD2] space-y-2">
                    <span className="text-[11px] font-semibold text-[#A84832] uppercase tracking-wider block">
                      Common Mistakes to Avoid:
                    </span>
                    {currentPose.commonMistakes.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#FFF4F0] border border-[#F0D0C8] text-xs space-y-0.5">
                        <span className="text-[#A84832] font-semibold block">⚠️ {m.mistake}</span>
                        <p className="text-[#59695C]">Fix: {m.correction}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {infoTab === "breath" && (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#243026] block">
                  Synchronized Breath Guide
                </span>
                <div className="p-3 rounded-2xl bg-[#F3ECE0] border border-[#DECFC0] space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-[#4E6548] font-semibold">
                    <Wind className="w-3.5 h-3.5" />
                    <span>Inhale Pattern:</span>
                  </div>
                  <p className="text-[#3F4D41] leading-relaxed">
                    {currentPose.breathGuide.inhaleAction}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#ECE7DC] border border-[#D5CBC0] space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-[#C1664C] font-semibold">
                    <Wind className="w-3.5 h-3.5" />
                    <span>Exhale Pattern:</span>
                  </div>
                  <p className="text-[#3F4D41] leading-relaxed">
                    {currentPose.breathGuide.exhaleAction}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E0D7CA] text-xs text-[#556658]">
                  ⏱️ <strong>Hold Notes:</strong> {currentPose.breathGuide.holdNotes}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
