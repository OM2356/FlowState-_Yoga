import React, { useState, useEffect, useRef } from "react";
import { FlowSequence, YogaPose, PracticeSessionRecord } from "../types";
import { YOGA_POSES } from "../data/posesData";
import { HumanYogaAvatar } from "./HumanYogaAvatar";
import { ThreeYogaHuman } from "./ThreeYogaHuman";
import { audioEngine } from "../utils/audioEngine";
import confetti from "canvas-confetti";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  X, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Wind, 
  Heart, 
  Smile, 
  Award,
  Layers,
  Activity,
  ArrowRight,
  Rotate3d
} from "lucide-react";

interface PracticeStudioProps {
  flow: FlowSequence;
  onExit: () => void;
  onSessionComplete?: (record: PracticeSessionRecord) => void;
}

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  flow,
  onExit,
  onSessionComplete,
}) => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [poseSecondsRemaining, setPoseSecondsRemaining] = useState<number>(
    flow.poses[0]?.durationSeconds || 45
  );
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // View mode: 3D interactive human mannequin vs 2D anatomical map
  const [viewMode, setViewMode] = useState<"3d-mannequin" | "2d-anatomy">("3d-mannequin");

  // Sound and voice toggles
  const [soundscape, setSoundscape] = useState<"drone" | "silent">("drone");
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true);
  const [showAnatomyHeatmap, setShowAnatomyHeatmap] = useState<boolean>(true);

  // Breath pacer state (Cycle: 4s Inhale, 2s Hold, 4s Exhale, 2s Hold)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold-in" | "exhale" | "hold-out">("inhale");
  const [breathSeconds, setBreathSeconds] = useState<number>(4);

  // End of session Mood & Reflection modal
  const [moodBefore, setMoodBefore] = useState<string>("Neutral");
  const [moodAfter, setMoodAfter] = useState<string>("Calm & Centered");
  const [physicalFeeling, setPhysicalFeeling] = useState<string>("Spacious & Lengthened");
  const [sessionRating, setSessionRating] = useState<number>(5);

  const currentFlowItem = flow.poses[currentPoseIndex];
  const currentPoseData: YogaPose = 
    YOGA_POSES.find((p) => p.id === currentFlowItem?.poseId) || YOGA_POSES[0];

  // Start soundscape on mount
  useEffect(() => {
    if (soundscape === "drone") {
      audioEngine.startAmbientDrone();
    }
    // Play opening bowl gong
    audioEngine.playSingingBowl(261.63);

    // Speak initial pose in Indian English style
    if (voiceGuidance && currentPoseData) {
      const sideText = currentFlowItem?.side ? `on your ${currentFlowItem.side} side.` : "";
      audioEngine.speakCue(`Namaste! Beginning ${flow.title}. First posture is ${currentPoseData.name}, ${currentPoseData.sanskritName} ${sideText}. Keep your spine comfortably straight and take deep breaths.`);
    }

    return () => {
      audioEngine.stopAmbientDrone();
      audioEngine.stopSpeech();
    };
  }, []);

  // Main Practice Timer tick
  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const interval = setInterval(() => {
      setTotalElapsedTime((prev) => prev + 1);

      setPoseSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Advance to next pose or complete
          if (currentPoseIndex < flow.poses.length - 1) {
            const nextIdx = currentPoseIndex + 1;
            setCurrentPoseIndex(nextIdx);
            const nextPoseItem = flow.poses[nextIdx];
            const nextPose = YOGA_POSES.find((p) => p.id === nextPoseItem.poseId);

            // Play singing bowl chime transition
            audioEngine.playSingingBowl(329.63);

            // Indian English voice announcement
            if (voiceGuidance && nextPose) {
              const sideText = nextPoseItem.side ? `on your ${nextPoseItem.side} side.` : "";
              const noteText = nextPoseItem.note ? ` ${nextPoseItem.note}` : "";
              audioEngine.speakCue(`Very good! Now slowly transition into ${nextPose.name}, ${nextPose.sanskritName} ${sideText}. Maintain steady breath.${noteText}`);
            }

            return nextPoseItem.durationSeconds;
          } else {
            // Sequence completed
            setIsCompleted(true);
            setIsPlaying(false);
            audioEngine.playSingingBowl(523.25); // High C chime
            audioEngine.speakCue("Shanti Shanti! Practice complete. Take a moment to honor your dedication and feel the stillness throughout your body. Namaste.");
            confetti({
              particleCount: 75,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#6F7E68", "#BF6F55", "#E8E2D5", "#D48B70"],
            });
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, currentPoseIndex, flow, voiceGuidance]);

  // Pranayama Breath Ring Pacer timer
  useEffect(() => {
    if (!isPlaying || isCompleted) return;

    const breathInterval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === "inhale") return "hold-in";
        if (prev === "hold-in") return "exhale";
        if (prev === "exhale") return "hold-out";
        return "inhale";
      });
    }, 3500);

    return () => clearInterval(breathInterval);
  }, [isPlaying, isCompleted]);

  // Controls
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && soundscape === "drone") {
      audioEngine.startAmbientDrone();
    }
  };

  const handleNextPose = () => {
    if (currentPoseIndex < flow.poses.length - 1) {
      const nextIdx = currentPoseIndex + 1;
      setCurrentPoseIndex(nextIdx);
      const nextPoseItem = flow.poses[nextIdx];
      const nextPose = YOGA_POSES.find((p) => p.id === nextPoseItem.poseId);
      setPoseSecondsRemaining(nextPoseItem.durationSeconds);
      audioEngine.playSingingBowl(329.63);
      if (voiceGuidance && nextPose) {
        audioEngine.speakCue(`Moving to ${nextPose.name}.`);
      }
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevPose = () => {
    if (currentPoseIndex > 0) {
      const prevIdx = currentPoseIndex - 1;
      setCurrentPoseIndex(prevIdx);
      setPoseSecondsRemaining(flow.poses[prevIdx].durationSeconds);
      audioEngine.playSingingBowl(261.63);
    }
  };

  const handleSaveReflection = () => {
    const record: PracticeSessionRecord = {
      id: "session-" + Date.now(),
      sequenceId: flow.id,
      sequenceTitle: flow.title,
      date: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.round(totalElapsedTime / 60)),
      moodBefore,
      moodAfter,
      physicalFeelingAfter: physicalFeeling,
      rating: sessionRating,
    };

    // Save to local storage
    try {
      const saved = JSON.parse(localStorage.getItem("flowstate_history") || "[]");
      saved.unshift(record);
      localStorage.setItem("flowstate_history", JSON.stringify(saved));
    } catch {}

    if (onSessionComplete) onSessionComplete(record);
    onExit();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round(((currentPoseIndex + (1 - poseSecondsRemaining / (currentFlowItem?.durationSeconds || 45))) / flow.poses.length) * 100)
  );

  return (
    <div id="practice-studio-screen" className="fixed inset-0 z-50 bg-[#F4F0E8] text-[#1E2420] flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Top Practice Bar */}
      <div className="px-4 sm:px-8 py-3.5 border-b border-[#E2DAD0] bg-[#FAF7F0]/90 backdrop-blur-xs flex items-center justify-between z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#6F7E68]">
              {flow.title}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E5DDD0] text-[#4A5A4E] font-medium">
              Pose {currentPoseIndex + 1} of {flow.poses.length}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-serif font-medium text-[#1C221D] mt-0.5">
            {currentPoseData.name}{" "}
            {currentFlowItem?.side && (
              <span className="text-xs uppercase px-2 py-0.5 rounded-md bg-[#BF6F55]/15 text-[#9E4F38] font-sans font-semibold">
                {currentFlowItem.side} Side
              </span>
            )}
          </h1>
        </div>

        {/* Top Controls & Exit */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-toggle-voice-guidance"
            onClick={() => {
              setVoiceGuidance(!voiceGuidance);
              if (voiceGuidance) audioEngine.stopSpeech();
            }}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              voiceGuidance ? "bg-[#EAE3D5] border-[#D4C8B5] text-[#2C382F]" : "bg-transparent border-[#D8CFC0] text-[#8C988E]"
            }`}
            title="Toggle Voice Alignment Guidance"
          >
            {voiceGuidance ? <Volume2 className="w-4 h-4 text-[#BF6F55]" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{voiceGuidance ? "Voice On" : "Voice Off"}</span>
          </button>

          <button
            id="btn-toggle-studio-soundscape"
            onClick={() => {
              if (soundscape === "drone") {
                audioEngine.stopAmbientDrone();
                setSoundscape("silent");
              } else {
                audioEngine.startAmbientDrone();
                setSoundscape("drone");
              }
            }}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              soundscape === "drone" ? "bg-[#EAE3D5] border-[#D4C8B5] text-[#2C382F]" : "bg-transparent border-[#D8CFC0] text-[#8C988E]"
            }`}
            title="Toggle 432Hz Drone Soundscape"
          >
            <Wind className="w-4 h-4 text-[#5A6D56]" />
            <span className="hidden md:inline">{soundscape === "drone" ? "432Hz Drone" : "Mute Drone"}</span>
          </button>

          <button
            id="btn-exit-studio"
            onClick={onExit}
            className="p-2 rounded-xl text-[#5A685D] hover:bg-[#EAE2D4] transition-colors"
            title="Exit Practice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-[#E5DCD0] h-1.5 relative overflow-hidden">
        <div
          className="h-full bg-[#5A6D56] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Studio Arena */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center overflow-y-auto">
        {/* Left Arena: Realistic 3D Human Yoga Mannequin Simulation */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {/* Realistic 3D Human Yoga Mannequin Simulation */}
          <div className="w-full max-w-[560px] h-[380px] sm:h-[440px] rounded-3xl overflow-hidden border border-[#DDD5C5] shadow-md bg-[#FAF8F2] relative">
            <ThreeYogaHuman
              pose={currentPoseData}
              isBreathing={isPlaying}
              showMuscleHeatmap={showAnatomyHeatmap}
              materialMode={showAnatomyHeatmap ? "heatmap" : "skin"}
              className="w-full h-full"
            />
          </div>

          {/* Controls: 3D Display Mode & Anatomical focus tag */}
          <div className="w-full max-w-[560px] mt-2.5 flex items-center justify-between text-xs text-[#6A786E] px-1">
            <div className="flex items-center gap-1.5 bg-[#E8DFD0] p-0.5 rounded-xl">
              <button
                id="studio-btn-3d"
                onClick={() => setShowAnatomyHeatmap(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  !showAnatomyHeatmap ? "bg-[#4E6548] text-white shadow-xs" : "text-[#47554A] hover:text-[#1E231F]"
                }`}
              >
                <Rotate3d className="w-3.5 h-3.5" />
                <span>3D Skin</span>
              </button>
              <button
                id="studio-btn-2d"
                onClick={() => setShowAnatomyHeatmap(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  showAnatomyHeatmap ? "bg-[#4E6548] text-white shadow-xs" : "text-[#47554A] hover:text-[#1E231F]"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>3D Heatmap</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="italic font-serif text-[#7D6A5D] hidden sm:inline">{currentPoseData.sanskritName}</span>
              <button
                id="studio-btn-muscle-glow"
                onClick={() => setShowAnatomyHeatmap(!showAnatomyHeatmap)}
                className="flex items-center gap-1 hover:text-[#2D3930] font-medium transition-colors text-xs bg-[#EAE2D4] px-2.5 py-1 rounded-lg border border-[#DCD0BE]"
              >
                <Activity className="w-3.5 h-3.5 text-[#BF6F55]" />
                <span>{showAnatomyHeatmap ? "Heatmap On" : "Heatmap Off"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Arena: Timers, Breath Pacer & Real-time Alignment Directives */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Giant Pose Countdown Card */}
          <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E2DAD0] shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B8A7E] mb-1">
              Pose Remaining
            </span>
            <div className="text-6xl font-serif font-light text-[#1D241F] tracking-tight mb-2">
              {formatTime(poseSecondsRemaining)}
            </div>

            {/* Total elapsed sub-metric */}
            <div className="text-xs text-[#8A968E] mb-4">
              Session Total: <span className="font-medium text-[#4D5C50]">{formatTime(totalElapsedTime)}</span>
            </div>

            {/* Visual Breath Ring Pacer */}
            <div className="relative flex items-center justify-center my-2">
              <div
                className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                  breathPhase === "inhale"
                    ? "scale-110 border-[#5A6D56] bg-[#5A6D56]/10 text-[#3C4D38]"
                    : breathPhase === "hold-in"
                    ? "scale-110 border-[#6F7E68] bg-[#6F7E68]/15 text-[#3C4D38]"
                    : breathPhase === "exhale"
                    ? "scale-90 border-[#BF6F55] bg-[#BF6F55]/10 text-[#9E4F38]"
                    : "scale-90 border-[#D48B70] bg-[#D48B70]/15 text-[#9E4F38]"
                }`}
              >
                <Wind className="w-5 h-5 mb-0.5 opacity-70" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {breathPhase === "hold-in" || breathPhase === "hold-out" ? "Hold" : breathPhase}
                </span>
              </div>
            </div>

            {/* Current Breath Cue */}
            <p className="text-xs text-[#526154] mt-2 italic max-w-xs">
              "{currentFlowItem?.breathCueOverride || currentPoseData.breathGuide.holdNotes}"
            </p>
          </div>

          {/* Primary Anatomical Alignment Tip for current pose */}
          <div className="bg-[#EFE9DF] p-4 rounded-2xl border border-[#DFD5C5] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#303D32]">
              <Sparkles className="w-4 h-4 text-[#BF6F55]" />
              <span>Biomechanical Alignment Directive:</span>
            </div>
            <p className="text-[#4E5C50] leading-relaxed">
              {currentFlowItem?.note || currentPoseData.stepByStepInstructions[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Dock */}
      <div className="px-4 sm:px-8 py-4 border-t border-[#E2DAD0] bg-[#FAF7F0]/90 backdrop-blur-xs flex items-center justify-between z-20">
        {/* Previous Pose */}
        <button
          id="btn-prev-pose"
          onClick={handlePrevPose}
          disabled={currentPoseIndex === 0}
          className="p-3 rounded-2xl bg-[#EAE2D4] hover:bg-[#DCD2C2] text-[#334237] disabled:opacity-40 disabled:pointer-events-none transition-colors border border-[#D5C9B6] flex items-center gap-1.5 text-xs font-medium"
        >
          <SkipBack className="w-4 h-4" />
          <span className="hidden sm:inline">Previous Pose</span>
        </button>

          {/* Center Primary Play/Pause */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-play-practice"
            onClick={handleTogglePlay}
            className="w-14 h-14 rounded-full bg-[#4E6548] hover:bg-[#3D5237] text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause Flow" : "Resume Flow"}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Next Pose */}
        <button
          id="btn-next-pose"
          onClick={handleNextPose}
          className="p-3 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white transition-colors shadow-xs flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <span className="hidden sm:inline">
            {currentPoseIndex === flow.poses.length - 1 ? "Finish Practice" : "Next Pose"}
          </span>
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Completion & Reflection Dialog */}
      {isCompleted && (
        <div id="practice-completion-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1F1B]/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#FBF9F5] rounded-3xl border border-[#E2DAD0] shadow-2xl p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#4E6548]/15 text-[#4E6548] mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#4E6548]">
                Practice Completed
              </span>
              <h2 className="text-2xl font-serif font-medium text-[#1A221C] mt-1">
                Honoring Your Dedication
              </h2>
              <p className="text-xs text-[#5D6B60] mt-1">
                Completed {Math.round(totalElapsedTime / 60)} minutes across {flow.poses.length} postures.
              </p>
            </div>

            {/* Post-Session Reflection Questions */}
            <div className="space-y-4 text-left border-t border-b border-[#E8E0D2] py-4">
              <div>
                <label className="text-xs font-semibold text-[#374439] block mb-1.5">
                  How does your body feel now?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["Spacious & Lengthened", "Deeply Relaxed", "Energized & Light", "Less Pain / Released"].map((feeling) => (
                    <button
                      key={feeling}
                      type="button"
                      onClick={() => setPhysicalFeeling(feeling)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        physicalFeeling === feeling
                          ? "bg-[#4E6548] text-white border-[#4E6548] font-medium shadow-xs"
                          : "bg-[#F3EDE2] text-[#475549] border-[#DFD6C7] hover:bg-[#E8DFCFC0]"
                      }`}
                    >
                      {feeling}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#374439] block mb-1.5">
                  Mental State After Flow:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["Calm & Centered", "Grounded & Present", "Clear Headed", "Peaceful"].map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setMoodAfter(mood)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        moodAfter === mood
                          ? "bg-[#C1664C] text-white border-[#C1664C] font-medium shadow-xs"
                          : "bg-[#F3EDE2] text-[#475549] border-[#DFD6C7] hover:bg-[#E8DFCFC0]"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              id="btn-save-practice-reflection"
              onClick={handleSaveReflection}
              className="w-full py-3.5 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <span>Save Session & Return to Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
