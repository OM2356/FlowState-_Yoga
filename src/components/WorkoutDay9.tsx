import React, { useState, useEffect, useRef } from "react";
import { YogaPose } from "../types";
import { YOGA_POSES } from "../data/posesData";
import { AnimatedPoseFigure } from "./AnimatedPoseFigure";
import { audioEngine } from "../utils/audioEngine";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  ChevronRight,
  Info,
  Flame,
  Clock,
  Dumbbell,
  Volume2,
  VolumeX,
  CheckCircle,
  GripVertical,
  Layers,
  Sparkles,
  ArrowLeft,
  Settings,
  ListRestart,
  Heart,
  TrendingUp,
  X
} from "lucide-react";

export interface WorkoutExerciseItem {
  id: string;
  name: string;
  durationSeconds: number;
  timeFormatted: string;
  icon: string;
  poseId: string;
  completed?: boolean;
}

const DEFAULT_DAY9_EXERCISES: WorkoutExerciseItem[] = [
  { id: "ex-1", name: "Skater Jump", durationSeconds: 36, timeFormatted: "00:36", icon: "🏃", poseId: "skater-jump" },
  { id: "ex-2", name: "Knee To Elbow Crunches", durationSeconds: 36, timeFormatted: "00:36", icon: "🧘", poseId: "knee-to-elbow-crunches" },
  { id: "ex-3", name: "Sumo Squat & Leg Raises", durationSeconds: 36, timeFormatted: "00:36", icon: "🏋️", poseId: "sumo-squat-leg-raises" },
  { id: "ex-4", name: "Wall Push-Ups", durationSeconds: 36, timeFormatted: "00:36", icon: "🤸", poseId: "wall-push-ups" },
  { id: "ex-5", name: "Curtsy Lunges", durationSeconds: 36, timeFormatted: "00:36", icon: "🏃", poseId: "curtsy-lunges" },
  { id: "ex-6", name: "Wall Sit", durationSeconds: 36, timeFormatted: "00:36", icon: "🪑", poseId: "wall-sit" },
  { id: "ex-7", name: "Elbows Back", durationSeconds: 36, timeFormatted: "00:36", icon: "🙆", poseId: "elbows-back" },
  { id: "ex-8", name: "90/90 Crunch", durationSeconds: 36, timeFormatted: "00:36", icon: "🧘", poseId: "90-90-crunch" },
  { id: "ex-9", name: "Sumo Squat & Leg Raises", durationSeconds: 36, timeFormatted: "00:36", icon: "🏋️", poseId: "sumo-squat-leg-raises" },
  { id: "ex-10", name: "Wall Push-Ups", durationSeconds: 36, timeFormatted: "00:36", icon: "🤸", poseId: "wall-push-ups" },
];

interface WorkoutDay9Props {
  onInspectPose: (pose: YogaPose) => void;
  onBackToExplore?: () => void;
}

export const WorkoutDay9: React.FC<WorkoutDay9Props> = ({ onInspectPose, onBackToExplore }) => {
  const [exercises, setExercises] = useState<WorkoutExerciseItem[]>(DEFAULT_DAY9_EXERCISES);
  const [isWorkingOut, setIsWorkingOut] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(36);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [restTimeLeft, setRestTimeLeft] = useState<number>(10);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [previewModalExercise, setPreviewModalExercise] = useState<WorkoutExerciseItem | null>(null);
  const [showFinishedCelebration, setShowFinishedCelebration] = useState<boolean>(false);

  const currentExercise = exercises[currentIndex];
  const matchedPose = YOGA_POSES.find((p) => p.id === currentExercise?.poseId) || YOGA_POSES[0];

  // Total workout duration calculation
  const totalSeconds = exercises.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const totalMinutes = Math.ceil(totalSeconds / 60);
  const estCalories = Math.round((totalSeconds / 60) * 7.5);

  // Timer runner
  useEffect(() => {
    if (!isWorkingOut || isPaused || showFinishedCelebration) return;

    const interval = setInterval(() => {
      if (isResting) {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            if (soundEnabled) {
              audioEngine.playSingingBowl(440);
              audioEngine.speakCue(`Begin ${exercises[currentIndex].name}`);
            }
            return 10;
          }
          if (prev === 3 && soundEnabled) {
            audioEngine.playBell();
          }
          return prev - 1;
        });
      } else {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Exercise completed!
            if (currentIndex < exercises.length - 1) {
              setIsResting(true);
              setRestTimeLeft(10);
              setCurrentIndex((idx) => idx + 1);
              const nextEx = exercises[currentIndex + 1];
              setTimeLeft(nextEx.durationSeconds);
              if (soundEnabled) {
                audioEngine.playBell();
                audioEngine.speakCue(`Rest. Next is ${nextEx.name}`);
              }
            } else {
              // Completed whole workout
              setIsWorkingOut(false);
              setShowFinishedCelebration(true);
              if (soundEnabled) {
                audioEngine.playSingingBowl(528);
                audioEngine.speakCue("Workout complete! Outstanding effort.");
              }
            }
            return 0;
          }
          if (prev <= 4 && prev > 1 && soundEnabled) {
            audioEngine.playWoodBlock();
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkingOut, isPaused, isResting, currentIndex, exercises, soundEnabled, showFinishedCelebration]);

  const handleStartWorkout = (startIndex: number = 0) => {
    setCurrentIndex(startIndex);
    setTimeLeft(exercises[startIndex].durationSeconds);
    setIsResting(false);
    setIsPaused(false);
    setIsWorkingOut(true);
    setShowFinishedCelebration(false);
    if (soundEnabled) {
      audioEngine.playSingingBowl(440);
      audioEngine.speakCue(`Ready. Let's start with ${exercises[startIndex].name}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeLeft(exercises[nextIdx].durationSeconds);
      setIsResting(false);
      if (soundEnabled) {
        audioEngine.speakCue(exercises[nextIdx].name);
      }
    } else {
      setIsWorkingOut(false);
      setShowFinishedCelebration(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setTimeLeft(exercises[prevIdx].durationSeconds);
      setIsResting(false);
      if (soundEnabled) {
        audioEngine.speakCue(exercises[prevIdx].name);
      }
    }
  };

  const handleReset = () => {
    setTimeLeft(exercises[currentIndex].durationSeconds);
    setIsPaused(true);
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // If in full-screen active workout mode
  if (isWorkingOut) {
    const progressPercent = isResting
      ? ((10 - restTimeLeft) / 10) * 100
      : ((currentExercise.durationSeconds - timeLeft) / currentExercise.durationSeconds) * 100;

    return (
      <div id="active-workout-runner" className="w-full min-h-[85vh] bg-[#F7F8F9] flex flex-col items-center justify-between p-4 sm:p-6 select-none">
        {/* Top bar */}
        <div className="w-full max-w-xl flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-xs border border-slate-100">
          <button
            onClick={() => setIsWorkingOut(false)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quit</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Day 9 • {currentIndex + 1}/{exercises.length}
            </span>
          </div>

          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Stage */}
        <div className="w-full max-w-xl flex-1 flex flex-col items-center justify-center my-4">
          {isResting ? (
            <div className="w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center animate-in fade-in">
              <span className="text-xs font-bold tracking-widest uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-3">
                Rest & Prepare
              </span>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">Rest Interval</h3>
              <p className="text-slate-500 text-sm mb-6">Catch your breath and hydrate.</p>

              <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-amber-50 border-4 border-amber-400 shadow-inner mb-6">
                <span className="text-5xl font-mono font-bold text-amber-700">{restTimeLeft}</span>
                <span className="absolute bottom-4 text-xs font-semibold text-amber-600">sec</span>
              </div>

              <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left">
                <div className="text-xs font-semibold text-slate-400 uppercase">Coming Next:</div>
                <div className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-2">
                  <span className="text-xl">{exercises[currentIndex].icon}</span>
                  <span>{exercises[currentIndex].name}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Duration: {exercises[currentIndex].timeFormatted}</div>
              </div>

              <button
                onClick={() => setIsResting(false)}
                className="mt-6 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-xl transition-all shadow-xs"
              >
                Skip Rest
              </button>
            </div>
          ) : (
            <div className="w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center">
              {/* Exercise Vector Animation */}
              <div className="w-full h-56 sm:h-64 flex items-center justify-center relative overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50/40 via-white to-slate-50">
                <AnimatedPoseFigure
                  poseId={matchedPose.id}
                  poseName={currentExercise.name}
                  size="lg"
                  isPlaying={!isPaused}
                />
              </div>

              {/* Title & Info */}
              <div className="w-full flex items-center justify-between mt-4">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    Exercise {currentIndex + 1} of {exercises.length}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800 mt-0.5">{currentExercise.name}</h2>
                </div>
                <button
                  onClick={() => onInspectPose(matchedPose)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  <Info className="w-4 h-4" />
                  <span>Anatomy</span>
                </button>
              </div>

              {/* Giant Timer Display */}
              <div className="w-full flex flex-col items-center my-6">
                <div className="text-6xl sm:text-7xl font-mono font-bold text-slate-900 tracking-tight">
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Breath / Form Cue */}
              <div className="w-full bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-2.5 text-xs text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {matchedPose.alignmentCues[0]?.cue || "Keep your spine aligned and breathe with continuous rhythm."}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls bottom bar */}
        <div className="w-full max-w-xl bg-white px-6 py-4 rounded-2xl shadow-xs border border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-3 rounded-xl border transition-all ${
              currentIndex === 0
                ? "border-slate-100 text-slate-300 cursor-not-allowed"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold flex items-center gap-2 shadow-md transition-all"
          >
            {isPaused ? <Play className="w-5 h-5 fill-white" /> : <Pause className="w-5 h-5 fill-white" />}
            <span>{isPaused ? "RESUME" : "PAUSE"}</span>
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Celebration screen when finished
  if (showFinishedCelebration) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2">
          Day 9 Completed
        </span>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Workout Crushed!</h2>
        <p className="text-slate-500 max-w-md text-sm mb-6">
          You conquered 10 sets of high-efficiency dynamic core and lower-body exercises.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 max-w-md w-full bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col items-center">
            <Clock className="w-5 h-5 text-blue-500 mb-1" />
            <span className="text-lg font-bold text-slate-800">6:00</span>
            <span className="text-[11px] text-slate-400 uppercase">Duration</span>
          </div>
          <div className="flex flex-col items-center">
            <Flame className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-lg font-bold text-slate-800">{estCalories}</span>
            <span className="text-[11px] text-slate-400 uppercase">Est. Kcal</span>
          </div>
          <div className="flex flex-col items-center">
            <Dumbbell className="w-5 h-5 text-emerald-500 mb-1" />
            <span className="text-lg font-bold text-slate-800">10 / 10</span>
            <span className="text-[11px] text-slate-400 uppercase">Exercises</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStartWorkout(0)}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repeat Day 9</span>
          </button>
          <button
            onClick={() => {
              setShowFinishedCelebration(false);
              if (onBackToExplore) onBackToExplore();
            }}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Default List View (Inspired by Leap Fitness Day 9 UI)
  return (
    <div id="day9-workout-view" className="w-full max-w-xl mx-auto bg-white min-h-[90vh] flex flex-col shadow-xs border border-slate-200/80 rounded-3xl overflow-hidden my-4">
      {/* Top App Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          {onBackToExplore && (
            <button
              onClick={onBackToExplore}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Workout Challenge</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">
                Active
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">DAY 9</h1>
          </div>
        </div>

        <button
          onClick={handleToggleSound}
          className={`p-2.5 rounded-xl border transition-all ${
            soundEnabled ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-400"
          }`}
          title="Toggle Audio Coaching"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Hero Overview Banner */}
      <div className="p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Full Body & Core Burn</div>
            <div className="text-lg font-bold mt-0.5">High Efficiency Circuit</div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            10 Exercises
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-200" />
            <div>
              <div className="text-xs font-medium text-blue-200">Duration</div>
              <div className="text-sm font-bold">~6 mins</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-300" />
            <div>
              <div className="text-xs font-medium text-blue-200">Est. Burn</div>
              <div className="text-sm font-bold">{estCalories} kcal</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <div>
              <div className="text-xs font-medium text-blue-200">Level</div>
              <div className="text-sm font-bold">Intermediate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Circuit Order ({exercises.length})
          </span>
          <span className="text-xs text-slate-400">36s per move</span>
        </div>

        {exercises.map((item, idx) => {
          const itemPose = YOGA_POSES.find((p) => p.id === item.poseId) || YOGA_POSES[0];
          return (
            <div
              key={`${item.id}-${idx}`}
              className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xs transition-all"
            >
              {/* Left drag indicator & Index */}
              <div className="flex items-center gap-3">
                <div className="text-slate-300 group-hover:text-blue-500 transition-colors cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </div>
                
                {/* Visual Icon / Avatar Thumbnail */}
                <div
                  onClick={() => setPreviewModalExercise(item)}
                  className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl cursor-pointer hover:scale-105 transition-transform"
                >
                  <span>{item.icon}</span>
                </div>

                {/* Name & Time */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {item.timeFormatted}
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {itemPose.primaryMuscles[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action: Quick Info / Start Single */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onInspectPose(itemPose)}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="View Anatomy & Alignment"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleStartWorkout(idx)}
                  className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Start from this exercise"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Sticky Start Bar */}
      <div className="p-4 bg-white border-t border-slate-100">
        <button
          onClick={() => handleStartWorkout(0)}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black text-lg tracking-wide uppercase shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>START WORKOUT</span>
        </button>
      </div>

      {/* Exercise Quick Preview Modal */}
      {previewModalExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="text-xl">{previewModalExercise.icon}</span>
                <h3 className="font-bold text-slate-800 text-base">{previewModalExercise.name}</h3>
              </div>
              <button
                onClick={() => setPreviewModalExercise(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col items-center">
              {(() => {
                const p = YOGA_POSES.find((item) => item.id === previewModalExercise.poseId) || YOGA_POSES[0];
                return (
                  <>
                    <div className="w-full h-52 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
                      <AnimatedPoseFigure poseId={p.id} poseName={p.name} size="md" />
                    </div>
                    <p className="text-xs text-slate-600 mt-4 leading-relaxed text-center">
                      {p.description}
                    </p>
                    <div className="w-full flex items-center justify-between mt-5 gap-3">
                      <button
                        onClick={() => {
                          const p = YOGA_POSES.find((item) => item.id === previewModalExercise.poseId) || YOGA_POSES[0];
                          setPreviewModalExercise(null);
                          onInspectPose(p);
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                      >
                        Full Anatomy
                      </button>
                      <button
                        onClick={() => {
                          const idx = exercises.findIndex((e) => e.id === previewModalExercise.id);
                          setPreviewModalExercise(null);
                          handleStartWorkout(idx >= 0 ? idx : 0);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                      >
                        Start Move (36s)
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
