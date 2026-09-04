import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { 
  GripVertical, 
  ArrowLeftRight, 
  Play, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Sparkles, 
  Clock, 
  Activity, 
  Layers, 
  RotateCw,
  X,
  Check
} from "lucide-react";
import { YogaPose, FlowSequence, FlowItem } from "../types";
import { YOGA_POSES } from "../data/posesData";
import { AnimatedPoseFigure } from "./AnimatedPoseFigure";
import { MuscleAnatomyMap } from "./MuscleAnatomyMap";

export interface RoutineExerciseItem {
  id: string;
  poseId: string;
  title: string;
  sanskritName?: string;
  duration: string;
  durationSeconds: number;
  image?: string;
  muscleMap?: string;
  focusAreas: string[];
  instructions?: string[];
  pose: YogaPose;
}

interface RoutineViewProps {
  initialExercises?: RoutineExerciseItem[];
  dayTitle?: string;
  onStartFlow?: (flow: FlowSequence) => void;
  onBack?: () => void;
}

// Animation Variants matching requested specification
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Helper to convert yoga poses into routine exercise items
export function generateDefaultExercises(): RoutineExerciseItem[] {
  const defaultPoseIds = [
    "tadasana-mountain",
    "virabhadrasana-1",
    "virabhadrasana-2",
    "trikonasana",
    "adho-mukha-svanasana",
    "bhujangasana-cobra",
    "balasana-childs-pose",
    "vrksasana-tree",
    "navasana-boat",
    "setu-bandhasana"
  ];

  return defaultPoseIds.map((id, index) => {
    const pose = YOGA_POSES.find(p => p.id === id) || YOGA_POSES[index % YOGA_POSES.length];
    const durationSec = pose.recommendedHoldSeconds || 45;
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durationStr = mins > 0 ? `${mins}m ${secs > 0 ? secs + 's' : ''}` : `00:${secs < 10 ? '0' : ''}${secs}`;

    return {
      id: `exercise-${index + 1}-${pose.id}`,
      poseId: pose.id,
      title: pose.name,
      sanskritName: pose.sanskritName,
      duration: durationStr,
      durationSeconds: durationSec,
      focusAreas: [
        ...pose.primaryMuscles,
        ...pose.secondaryMuscles.slice(0, 2)
      ],
      instructions: pose.alignmentCues.map(c => `${c.joint}: ${c.cue}`),
      pose: pose
    };
  });
}

export default function RoutineView({ 
  initialExercises, 
  dayTitle = "Daily Flow", 
  onStartFlow,
  onBack
}: RoutineViewProps) {
  const [items, setItems] = useState<RoutineExerciseItem[]>(() => {
    if (initialExercises && initialExercises.length > 0) {
      return initialExercises;
    }
    return generateDefaultExercises();
  });

  const [selectedExercise, setSelectedExercise] = useState<RoutineExerciseItem | null>(null);
  const [activeTab, setActiveTab] = useState<"video" | "muscle" | "instructions">("video");
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [isAddingPose, setIsAddingPose] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate total routine duration
  const totalSeconds = useMemo(() => {
    return items.reduce((sum, item) => sum + item.durationSeconds, 0);
  }, [items]);

  const formattedTotalDuration = useMemo(() => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} min ${secs > 0 ? secs + 's' : ''}`;
  }, [totalSeconds]);

  // Handle replacing an item
  const handleReplacePose = (newPose: YogaPose) => {
    if (replacingIndex === null) return;
    const durationSec = newPose.recommendedHoldSeconds || 45;
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durationStr = mins > 0 ? `${mins}m ${secs > 0 ? secs + 's' : ''}` : `00:${secs < 10 ? '0' : ''}${secs}`;

    const newItem: RoutineExerciseItem = {
      id: `exercise-${Date.now()}-${newPose.id}`,
      poseId: newPose.id,
      title: newPose.name,
      sanskritName: newPose.sanskritName,
      duration: durationStr,
      durationSeconds: durationSec,
      focusAreas: [
        ...newPose.primaryMuscles,
        ...newPose.secondaryMuscles.slice(0, 2)
      ],
      instructions: newPose.alignmentCues.map(c => `${c.joint}: ${c.cue}`),
      pose: newPose
    };

    setItems(prev => {
      const next = [...prev];
      next[replacingIndex] = newItem;
      return next;
    });

    if (selectedExercise && selectedExercise.id === items[replacingIndex]?.id) {
      setSelectedExercise(newItem);
    }

    setReplacingIndex(null);
  };

  // Handle adding a new pose
  const handleAddPose = (newPose: YogaPose) => {
    const durationSec = newPose.recommendedHoldSeconds || 45;
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durationStr = mins > 0 ? `${mins}m ${secs > 0 ? secs + 's' : ''}` : `00:${secs < 10 ? '0' : ''}${secs}`;

    const newItem: RoutineExerciseItem = {
      id: `exercise-${Date.now()}-${newPose.id}`,
      poseId: newPose.id,
      title: newPose.name,
      sanskritName: newPose.sanskritName,
      duration: durationStr,
      durationSeconds: durationSec,
      focusAreas: [
        ...newPose.primaryMuscles,
        ...newPose.secondaryMuscles.slice(0, 2)
      ],
      instructions: newPose.alignmentCues.map(c => `${c.joint}: ${c.cue}`),
      pose: newPose
    };

    setItems(prev => [...prev, newItem]);
    setIsAddingPose(false);
  };

  // Handle removing a pose
  const handleRemovePose = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.filter((_, i) => i !== indexToRemove));
    if (selectedExercise && selectedExercise.id === items[indexToRemove]?.id) {
      setSelectedExercise(null);
    }
  };

  // Handle start practice flow
  const handleStartPractice = () => {
    if (onStartFlow) {
      const focusAreasList: string[] = Array.from(new Set<string>(items.flatMap(i => i.focusAreas))).slice(0, 4);
      const flow: FlowSequence = {
        id: `routine-flow-${Date.now()}`,
        title: `${dayTitle} Practice`,
        subtitle: `${items.length} Asanas • ${formattedTotalDuration}`,
        durationMinutes: Math.max(1, Math.round(totalSeconds / 60)),
        category: "morning",
        difficulty: "intermediate",
        physicalFocus: focusAreasList,
        mentalFocus: "Presence & Alignment",
        description: `Personalized sequence featuring ${items.length} poses designed for balanced strength, flexibility, and mind-body harmony.`,
        bannerGradient: "from-cyan-900 to-slate-900",
        poses: items.map(item => ({
          poseId: item.poseId,
          durationSeconds: item.durationSeconds,
          side: "both",
          breathCueOverride: item.pose.breathGuide?.inhaleAction ? `${item.pose.breathGuide.inhaleAction}; ${item.pose.breathGuide.exhaleAction}` : undefined
        }))
      };
      onStartFlow(flow);
    }
  };

  // Filter poses for replacement / add modal
  const filteredPoses = useMemo(() => {
    if (!searchQuery.trim()) return YOGA_POSES;
    const q = searchQuery.toLowerCase();
    return YOGA_POSES.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.sanskritName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto relative overflow-hidden font-sans rounded-3xl shadow-2xl border border-slate-800/80 my-4">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">{dayTitle}</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/70 text-cyan-400 border border-cyan-800/40">
              {items.length} Poses
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>Total: {formattedTotalDuration}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`text-sm font-semibold px-3 py-1 rounded-lg transition-colors ${
              isEditing ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-cyan-400 hover:text-cyan-300"
            }`}
          >
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>
      </header>

      {/* Routine Quick Info Banner */}
      <div className="px-5 pt-3 pb-1 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Drag handle to reorder</span>
        </span>
        <button 
          onClick={() => setIsAddingPose(true)}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-800/30"
        >
          <Plus className="w-3.5 h-3.5" /> Add Pose
        </button>
      </div>

      {/* Reorderable List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 py-3 space-y-3 pb-32"
      >
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
          {items.map((item, index) => (
            <Reorder.Item key={item.id} value={item} id={item.id}>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedExercise(item)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg cursor-pointer group transition-all hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Drag Handle */}
                  <div className="text-slate-600 group-hover:text-slate-400 cursor-grab active:cursor-grabbing shrink-0 touch-none">
                    <GripVertical size={20} />
                  </div>
                  
                  {/* Exercise Animated Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-800/90 overflow-hidden flex items-center justify-center p-1 border border-slate-700/50 shrink-0 relative">
                    <div className="w-full h-full scale-[0.65] origin-center pointer-events-none">
                      <AnimatedPoseFigure
                        poseId={item.poseId}
                        poseName={item.title}
                        isPlaying={true}
                        speed={0.8}
                        showBreathRhythm={false}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-cyan-400 font-mono">#{index + 1}</span>
                      <h3 className="font-semibold text-slate-100 text-sm truncate">{item.title}</h3>
                    </div>
                    {item.sanskritName && (
                      <p className="text-[11px] text-slate-400 font-serif italic truncate">
                        {item.sanskritName}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isEditing ? (
                    <button
                      onClick={(e) => handleRemovePose(index, e)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Remove pose"
                    >
                      <Trash2 size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setReplacingIndex(index);
                      }}
                      className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-lg transition-colors"
                      title="Replace pose"
                    >
                      <ArrowLeftRight size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {items.length === 0 && (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-400">
            <p className="text-sm">No exercises in this routine.</p>
            <button
              onClick={() => setIsAddingPose(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Add First Pose
            </button>
          </div>
        )}
      </motion.div>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 left-0 right-0 max-w-md mx-auto px-5 z-20">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStartPractice}
          disabled={items.length === 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play fill="currentColor" size={20} /> Start Practice
        </motion.button>
      </div>

      {/* Exercise Details Sheet / Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExercise(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              {/* Drag Indicator */}
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6" />

              {/* Title & Swap Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedExercise.title}</h2>
                  {selectedExercise.sanskritName && (
                    <p className="text-xs text-cyan-400 font-serif italic">{selectedExercise.sanskritName}</p>
                  )}
                </div>
                <button 
                  onClick={() => {
                    const idx = items.findIndex(i => i.id === selectedExercise.id);
                    if (idx !== -1) setReplacingIndex(idx);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-3 py-1.5 rounded-full hover:bg-cyan-900/50 transition-colors"
                >
                  <ArrowLeftRight size={14} /> Replace
                </button>
              </div>

              {/* Media Container with Animated Tab Switch */}
              <div className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-4 mb-5">
                <AnimatePresence mode="wait">
                  {activeTab === "video" && (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <AnimatedPoseFigure
                        poseId={selectedExercise.poseId}
                        poseName={selectedExercise.title}
                        isPlaying={true}
                        speed={1.0}
                        showBreathRhythm={true}
                      />
                    </motion.div>
                  )}

                  {activeTab === "muscle" && (
                    <motion.div
                      key="muscle"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full flex items-center justify-center scale-90"
                    >
                      <MuscleAnatomyMap
                        primaryMuscles={selectedExercise.pose.targetMuscles.primary}
                        secondaryMuscles={selectedExercise.pose.targetMuscles.secondary}
                        size="sm"
                        className="bg-transparent border-0"
                      />
                    </motion.div>
                  )}

                  {activeTab === "instructions" && (
                    <motion.div
                      key="instructions"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full overflow-y-auto pr-1 text-left space-y-2 py-2"
                    >
                      <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Alignment Cues</div>
                      {selectedExercise.pose.alignmentCues.map((cue, i) => (
                        <div key={i} className="text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                          <span className="font-semibold text-cyan-300">{cue.joint}:</span> {cue.cue}
                        </div>
                      ))}
                      {selectedExercise.pose.breathGuide && (
                        <div className="text-xs text-cyan-400/90 italic pt-1">
                          Breath: {selectedExercise.pose.breathGuide.inhaleAction} • {selectedExercise.pose.breathGuide.exhaleAction}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Segmented Control Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
                {(["video", "muscle", "instructions"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative py-2 text-xs font-semibold capitalize rounded-lg transition-colors cursor-pointer ${
                      activeTab === tab ? "text-slate-100" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-slate-800 rounded-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab === "video" ? "Animation" : tab}</span>
                  </button>
                ))}
              </div>

              {/* Focus Area Badges */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.focusAreas?.map((area, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedExercise(null)}
                className="w-full py-3.5 rounded-xl bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Replace / Add Pose Modal */}
      <AnimatePresence>
        {(replacingIndex !== null || isAddingPose) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {replacingIndex !== null ? `Replace Pose #${replacingIndex + 1}` : "Add New Pose"}
                  </h3>
                  <p className="text-xs text-slate-400">Select an asana with animated preview</p>
                </div>
                <button
                  onClick={() => {
                    setReplacingIndex(null);
                    setIsAddingPose(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search input */}
              <div className="py-2.5">
                <input
                  type="text"
                  placeholder="Search poses or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Poses List */}
              <div className="flex-1 overflow-y-auto py-2 space-y-2 pr-1">
                {filteredPoses.map((pose) => (
                  <div
                    key={pose.id}
                    onClick={() => {
                      if (replacingIndex !== null) {
                        handleReplacePose(pose);
                      } else {
                        handleAddPose(pose);
                      }
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 hover:bg-cyan-950/30 border border-slate-800/80 hover:border-cyan-800/60 cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
                      <div className="w-full h-full scale-[0.55] origin-center pointer-events-none">
                        <AnimatedPoseFigure
                          poseId={pose.id}
                          poseName={pose.name}
                          isPlaying={true}
                          speed={0.8}
                          showBreathRhythm={false}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-slate-100 group-hover:text-cyan-300 truncate">
                        {pose.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-serif italic truncate">
                        {pose.sanskritName}
                      </div>
                      <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5 capitalize">
                        {pose.category} • {pose.difficulty}
                      </div>
                    </div>

                    <button className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500 text-slate-950 group-hover:bg-cyan-400 transition-colors shrink-0">
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
