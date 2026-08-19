import React, { useState, useEffect, useRef } from "react";
import { SURYA_NAMASKAR_STEPS, SuryaNamaskarStep, SURYA_NAMASKAR_ROUNDS_PRESETS } from "../data/suryaNamaskarData";
import { ThreeYogaHuman } from "./ThreeYogaHuman";
import { audioEngine } from "../utils/audioEngine";
import confetti from "canvas-confetti";
import {
  Sun,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Activity,
  Heart,
  Flame,
  Award,
  Layers,
  ChevronRight,
  Wind,
  Info,
  Clock,
  Compass
} from "lucide-react";

interface SuryaNamaskarStudioProps {
  currentUserId?: string;
  currentUserName?: string;
  onSessionComplete?: (sessionData: any) => void;
  onOpenCoach?: (query: string) => void;
}

export const SuryaNamaskarStudio: React.FC<SuryaNamaskarStudioProps> = ({
  currentUserId = "guest-yogi",
  currentUserName = "FlowState Practitioner",
  onSessionComplete,
  onOpenCoach,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [targetRounds, setTargetRounds] = useState<number>(6);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [stepDurationSeconds, setStepDurationSeconds] = useState<number>(5);
  const [secondsRemainingInStep, setSecondsRemainingInStep] = useState<number>(5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceCuesEnabled, setVoiceCuesEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"visualizer" | "mantras" | "alignment" | "anatomy">("visualizer");
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [totalPracticeSeconds, setTotalPracticeSeconds] = useState<number>(0);

  const currentStep = SURYA_NAMASKAR_STEPS[currentStepIndex];

  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play singing bowl & voice cue when step changes
  useEffect(() => {
    if (soundEnabled) {
      // Harmonic solfeggio frequencies for solar awakening
      const frequencies = [396, 417, 528, 639, 741, 852, 963, 432, 528, 639, 741, 528];
      const freq = frequencies[currentStepIndex % frequencies.length] || 528;
      audioEngine.playSingingBowl(freq);
    }

    if (voiceCuesEnabled) {
      const cue = `${currentStep.sanskritName}. ${currentStep.breathAction}. ${currentStep.solarMantra}.`;
      audioEngine.speakCue(cue);
    }
  }, [currentStepIndex, soundEnabled, voiceCuesEnabled]);

  // Main Practice Timer Runner
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTotalPracticeSeconds((prev) => prev + 1);

      setSecondsRemainingInStep((prev) => {
        if (prev <= 1) {
          // Advance to next step or next round
          setCurrentStepIndex((currIdx) => {
            if (currIdx < SURYA_NAMASKAR_STEPS.length - 1) {
              return currIdx + 1;
            } else {
              // Completed a full 12-step cycle
              setCurrentRound((currRnd) => {
                if (currRnd < targetRounds) {
                  return currRnd + 1;
                } else {
                  // ALL ROUNDS COMPLETED!
                  handleFinishPractice();
                  return currRnd;
                }
              });
              return 0; // reset to step 1
            }
          });
          return stepDurationSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, stepDurationSeconds, targetRounds]);

  const handleFinishPractice = () => {
    setIsPlaying(false);
    setSessionCompleted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D48B70", "#BF6F55", "#5A6D56", "#E8D8C0"],
      });
    } catch {}

    const totalMinutes = Math.max(1, Math.round(totalPracticeSeconds / 60) || 5);
    const sessionPayload = {
      userId: currentUserId,
      userName: currentUserName,
      type: "surya_namaskar",
      title: `Surya Namaskar (${targetRounds} Rounds)`,
      rounds: targetRounds,
      durationMinutes: totalMinutes,
      completed_at: new Date().toISOString(),
      calories_estimate: Math.round(targetRounds * 14.5),
    };

    // Post to backend database
    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionPayload),
    }).catch(() => {});

    if (onSessionComplete) {
      onSessionComplete(sessionPayload);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < SURYA_NAMASKAR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      if (currentRound < targetRounds) {
        setCurrentRound(currentRound + 1);
        setCurrentStepIndex(0);
      }
    }
    setSecondsRemainingInStep(stepDurationSeconds);
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else if (currentRound > 1) {
      setCurrentRound(currentRound - 1);
      setCurrentStepIndex(SURYA_NAMASKAR_STEPS.length - 1);
    }
    setSecondsRemainingInStep(stepDurationSeconds);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setCurrentRound(1);
    setSecondsRemainingInStep(stepDurationSeconds);
    setSessionCompleted(false);
    setTotalPracticeSeconds(0);
  };

  const calculateTotalMinutes = () => {
    return Math.round((targetRounds * 12 * stepDurationSeconds) / 60);
  };

  return (
    <div id="surya-namaskar-studio" className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#F9F5EE] via-[#F2ECE0] to-[#E9DFCF] border border-[#E2DAD0] p-6 sm:p-8 mb-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#5A6D56]/15 text-[#334237] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#D48B70] animate-spin-slow" />
                <span>Classic Solar Salutation</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFFFFF]/70 text-[#6F7E68] border border-[#E2DAD0]">
                12 Sacred Asanas • 3D Biomechanics
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#1E231F] tracking-tight">
              Surya Namaskar 3D Studio
            </h1>
            <p className="text-sm sm:text-base text-[#556457] mt-1 max-w-2xl">
              Awaken vitality, harmonize breath with movement, and master the traditional 12-step sun salutation cycle with interactive 3D human pose biomechanics.
            </p>
          </div>

          {/* Quick Round Target Selection */}
          <div className="bg-[#FFFFFF]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#DFD6C8] shadow-xs flex flex-col gap-2 min-w-[240px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#37453A] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#D48B70]" />
                <span>Target Rounds:</span>
              </span>
              <span className="font-bold text-[#5A6D56]">{targetRounds} Rounds ({calculateTotalMinutes()} min)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[3, 6, 12, 24, 108].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setTargetRounds(num);
                    if (currentRound > num) setCurrentRound(1);
                  }}
                  disabled={isPlaying}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
                    targetRounds === num
                      ? "bg-[#5A6D56] text-white shadow-xs"
                      : "bg-[#F3EDE2] text-[#4A5A4E] hover:bg-[#E7DFC8]"
                  } disabled:opacity-50`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal / Celebration */}
      {sessionCompleted && (
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#5A6D56]/15 via-[#8A9B83]/15 to-[#D48B70]/15 border border-[#8A9B83]/40 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-[#5A6D56] text-white flex items-center justify-center mb-4 shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E231F]">
            Namaste! {targetRounds} Rounds Completed
          </h2>
          <p className="text-sm text-[#4A5A4E] mt-2 max-w-lg">
            You completed {targetRounds * 12} postures. Solar prana and cardiovascular endurance have been logged to your FlowState profile.
          </p>

          <div className="grid grid-cols-3 gap-4 my-6 w-full max-w-md">
            <div className="bg-[#FFFFFF]/90 p-3 rounded-2xl border border-[#E2DAD0] text-center">
              <span className="text-xs text-[#7A6E63] block">Rounds</span>
              <span className="text-xl font-bold text-[#334237]">{targetRounds}</span>
            </div>
            <div className="bg-[#FFFFFF]/90 p-3 rounded-2xl border border-[#E2DAD0] text-center">
              <span className="text-xs text-[#7A6E63] block">Minutes</span>
              <span className="text-xl font-bold text-[#334237]">
                {Math.max(1, Math.round(totalPracticeSeconds / 60))}
              </span>
            </div>
            <div className="bg-[#FFFFFF]/90 p-3 rounded-2xl border border-[#E2DAD0] text-center">
              <span className="text-xs text-[#7A6E63] block">Est. Calories</span>
              <span className="text-xl font-bold text-[#D48B70]">{Math.round(targetRounds * 14.5)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-[#5A6D56] hover:bg-[#495A46] text-white font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>
            {onOpenCoach && (
              <button
                onClick={() => onOpenCoach("How can I improve my alignment and stamina in Surya Namaskar?")}
                className="px-5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F5EFEB] text-[#334237] border border-[#D4C9BA] font-medium text-sm transition-colors"
              >
                Ask AI Yoga Coach
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Studio Grid: Left 3D Human Avatar | Right Pose Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left 7 Columns: 3D Articulated Human Model & Playback Controls */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* 3D Human Canvas */}
          <div className="relative">
            <ThreeYogaHuman
              suryaStep={currentStep}
              height={440}
              interactiveControls={true}
              isBreathing={true}
              breathPhase={currentStep.breathAction.toLowerCase().includes("in") ? "inhale" : "exhale"}
              showMuscleHeatmap={activeTab === "anatomy"}
            />

            {/* Current Step Floating Indicator */}
            <div className="absolute top-4 left-4 bg-[#FFFFFF]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E2DAD0] shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#5A6D56] text-white flex items-center justify-center font-bold text-sm">
                {currentStep.stepNumber}
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#7D6B5E] block">
                  Step {currentStep.stepNumber} of 12
                </span>
                <h3 className="text-sm font-serif font-bold text-[#1E231F] leading-tight">
                  {currentStep.sanskritName}
                </h3>
              </div>
            </div>

            {/* Round & Breath Meter (Top Right) */}
            <div className="absolute top-4 right-4 bg-[#FFFFFF]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E2DAD0] shadow-sm flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#7D6B5E] block">
                  Round {currentRound} of {targetRounds}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block ${
                    currentStep.breathAction === "Inhale"
                      ? "bg-[#6F8A70]/20 text-[#3F5440]"
                      : currentStep.breathAction === "Exhale"
                      ? "bg-[#D48B70]/20 text-[#9E543A]"
                      : "bg-[#8A9B83]/20 text-[#4A5A4E]"
                  }`}
                >
                  {currentStep.breathAction}
                </span>
              </div>
              {/* Countdown circle */}
              <div className="w-9 h-9 rounded-full border-2 border-[#5A6D56] flex items-center justify-center font-bold text-xs text-[#334237]">
                {secondsRemainingInStep}s
              </div>
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="bg-[#FBF9F5] p-4 rounded-2xl border border-[#E2DAD0] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                id="btn-surya-prev"
                onClick={handlePrevStep}
                className="p-2.5 rounded-xl text-[#4A5A4E] hover:bg-[#EFE9DE] border border-[#DFD6C8] transition-colors"
                title="Previous Asana"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                id="btn-surya-play-pause"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all ${
                  isPlaying
                    ? "bg-[#BF6F55] hover:bg-[#A95D45] text-white"
                    : "bg-[#5A6D56] hover:bg-[#495A46] text-white"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Flow</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Guided Flow</span>
                  </>
                )}
              </button>

              <button
                id="btn-surya-next"
                onClick={handleNextStep}
                className="p-2.5 rounded-xl text-[#4A5A4E] hover:bg-[#EFE9DE] border border-[#DFD6C8] transition-colors"
                title="Next Asana"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                id="btn-surya-reset"
                onClick={handleReset}
                className="p-2.5 rounded-xl text-[#7A6E63] hover:bg-[#EFE9DE] transition-colors"
                title="Reset Round"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Hold duration selector & Sound controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#556457]">
                <Clock className="w-3.5 h-3.5 text-[#7A6E63]" />
                <span className="hidden sm:inline">Pace:</span>
                <select
                  value={stepDurationSeconds}
                  onChange={(e) => {
                    const sec = Number(e.target.value);
                    setStepDurationSeconds(sec);
                    setSecondsRemainingInStep(sec);
                  }}
                  className="bg-[#FFFFFF] border border-[#D9CEBF] text-[#334237] text-xs rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value={3}>3s (Dynamic Flow)</option>
                  <option value={5}>5s (Classic Pace)</option>
                  <option value={8}>8s (Deep Alignment)</option>
                  <option value={12}>12s (Meditative)</option>
                </select>
              </div>

              <div className="flex items-center gap-1 border-l border-[#E2DAD0] pl-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    soundEnabled ? "text-[#5A6D56] hover:bg-[#EFE9DE]" : "text-[#9E8E81] hover:bg-[#EFE9DE]"
                  }`}
                  title={soundEnabled ? "Mute Chimes" : "Unmute Chimes"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Asana Details, Mantras, Alignment & Anatomy Tabs */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#EFE9DE] rounded-2xl border border-[#DFD6C8]">
            <button
              onClick={() => setActiveTab("visualizer")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "visualizer" ? "bg-[#FFFFFF] text-[#1E231F] shadow-xs" : "text-[#5A685D] hover:bg-[#E6DEC4]"
              }`}
            >
              Pose Overview
            </button>
            <button
              onClick={() => setActiveTab("mantras")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "mantras" ? "bg-[#FFFFFF] text-[#1E231F] shadow-xs" : "text-[#5A685D] hover:bg-[#E6DEC4]"
              }`}
            >
              Solar Mantra
            </button>
            <button
              onClick={() => setActiveTab("alignment")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "alignment" ? "bg-[#FFFFFF] text-[#1E231F] shadow-xs" : "text-[#5A685D] hover:bg-[#E6DEC4]"
              }`}
            >
              Alignment
            </button>
            <button
              onClick={() => setActiveTab("anatomy")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                activeTab === "anatomy" ? "bg-[#BF6F55] text-white shadow-xs" : "text-[#5A685D] hover:bg-[#E6DEC4]"
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Muscles</span>
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="bg-[#FBF9F5] rounded-3xl border border-[#E2DAD0] p-6 shadow-xs flex-1 flex flex-col justify-between min-h-[360px]">
            {/* TAB 1: Visualizer / Overview */}
            {activeTab === "visualizer" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6F7E68]">
                      Step {currentStep.stepNumber} • {currentStep.breathAction}
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-[#1E231F] mt-0.5">
                      {currentStep.sanskritName}
                    </h2>
                    <span className="text-sm font-serif italic text-[#7D6B5E]">
                      {currentStep.englishName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: `${currentStep.chakraFocus.color}15`,
                        color: currentStep.chakraFocus.color,
                        borderColor: `${currentStep.chakraFocus.color}40`,
                      }}
                    >
                      {currentStep.chakraFocus.name}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E8E0D2] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#37453A]">
                    <Sun className="w-3.5 h-3.5 text-[#D48B70]" />
                    <span>Solar Chant</span>
                  </div>
                  <p className="text-base font-serif italic text-[#1E231F] font-semibold">
                    "{currentStep.solarMantra}"
                  </p>
                  <p className="text-xs text-[#556457]">
                    {currentStep.mantraTranslation}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7D6B5E] mb-2">
                    Key Alignment Focus
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#37453A]">
                    {currentStep.keyAlignmentCues.slice(0, 3).map((cue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5A6D56] shrink-0 mt-0.5" />
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: Solar Mantras & Sacred Meaning */}
            {activeTab === "mantras" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D48B70]">
                    Solar Invocation
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#1E231F]">
                    {currentStep.solarMantra}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F0DFCD] space-y-2">
                  <span className="text-xs font-bold text-[#8C5D4B] block">Spiritual Translation:</span>
                  <p className="text-sm text-[#37413B] leading-relaxed">
                    {currentStep.mantraTranslation}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2DAD0] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#37453A]">
                    <Heart className="w-3.5 h-3.5 text-[#BF6F55]" />
                    <span>Chakra Energy Center:</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1E231F]">{currentStep.chakraFocus.name}</span>
                    <span className="text-[#6F7E68]">{currentStep.chakraFocus.location}</span>
                  </div>
                </div>

                <p className="text-xs text-[#7A6E63] italic">
                  Chanting or reflecting upon these 12 solar names connects human consciousness with the biological rhythm of the sun and celestial vitality.
                </p>
              </div>
            )}

            {/* TAB 3: Alignment Guidelines */}
            {activeTab === "alignment" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6D56]">
                  Biomechanical Cues
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1E231F]">
                  Step {currentStep.stepNumber} Alignment Mastery
                </h3>

                <div className="space-y-2.5">
                  {currentStep.keyAlignmentCues.map((cue, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5DDD0] flex items-start gap-2.5 text-xs text-[#37453A]">
                      <div className="w-5 h-5 rounded-full bg-[#5A6D56]/15 text-[#3F5440] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed">{cue}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-[#F3EDE2] border border-[#DFD6C8] text-xs text-[#556457]">
                  <span className="font-bold text-[#37453A] block mb-1">Anatomical Focus:</span>
                  {currentStep.anatomicalFocus}
                </div>
              </div>
            )}

            {/* TAB 4: Muscle Heatmap & Active Groups */}
            {activeTab === "anatomy" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#BF6F55]">
                    Active Muscle Activation
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#1E231F]">
                    Target Muscle Groups
                  </h3>
                </div>

                <div className="space-y-2">
                  {currentStep.primaryMuscles.map((muscle) => (
                    <div
                      key={muscle}
                      className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E5DDD0] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#DE6B48] animate-pulse" />
                        <span className="font-semibold text-[#1E231F] capitalize">{muscle}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#BF6F55]/15 text-[#9E452E] font-medium text-[11px]">
                        Primary Engagement
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#7A6E63] leading-relaxed">
                  Surya Namaskar delivers a symmetrical, full-body workout engaging over 90% of skeletal muscles in one continuous rhythmic sequence.
                </p>
              </div>
            )}

            {/* Ask AI Coach footer action */}
            <div className="pt-4 border-t border-[#E8E0D2] flex items-center justify-between">
              <span className="text-xs text-[#7A6E63]">Need personalized posture advice?</span>
              {onOpenCoach && (
                <button
                  onClick={() => onOpenCoach(`How do I practice ${currentStep.sanskritName} safely in Surya Namaskar?`)}
                  className="text-xs font-semibold text-[#5A6D56] hover:text-[#3F5440] hover:underline flex items-center gap-1"
                >
                  <span>Ask AI Coach</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 12-Step Visual Timeline Carousel (Bottom) */}
      <div className="bg-[#FBF9F5] p-6 rounded-3xl border border-[#E2DAD0] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#1E231F]">
              The 12 Classical Salutation Steps
            </h3>
            <p className="text-xs text-[#6F7E68]">
              Click any step to transition the 3D human avatar directly to that posture.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EFE9DE] text-[#4A5A4E]">
            Step {currentStepIndex + 1} of 12
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {SURYA_NAMASKAR_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={step.poseId}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setSecondsRemainingInStep(stepDurationSeconds);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isCurrent
                    ? "bg-[#5A6D56] text-white border-[#495A46] shadow-sm scale-102"
                    : "bg-[#FFFFFF] text-[#334237] border-[#E2DAD0] hover:bg-[#F5EFEB] hover:border-[#D4C9BA]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      isCurrent ? "bg-[#FFFFFF]/25 text-white" : "bg-[#EDE5D8] text-[#556457]"
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isCurrent
                        ? "bg-[#FFFFFF]/20 text-white"
                        : step.breathAction === "Inhale"
                        ? "bg-[#6F8A70]/15 text-[#3F5440]"
                        : step.breathAction === "Exhale"
                        ? "bg-[#D48B70]/15 text-[#9E543A]"
                        : "bg-[#8A9B83]/15 text-[#4A5A4E]"
                    }`}
                  >
                    {step.breathAction}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-xs truncate leading-tight">
                  {step.sanskritName}
                </h4>
                <p className={`text-[11px] truncate mt-0.5 ${isCurrent ? "text-[#E0E7DC]" : "text-[#7D6B5E]"}`}>
                  {step.englishName}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
