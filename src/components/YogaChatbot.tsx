'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  Eye, 
  ShieldAlert, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Compass,
  Layers,
  Heart
} from 'lucide-react';
import { YogaPose, FlowSequence, FlowItem } from '../types';
import { YOGA_POSES } from '../data/posesData';

export interface RoutinePose {
  name: string;
  duration: string;
  visualCue: string;
  benefit: string;
  targetMuscles?: string[];
}

export interface GeneratedRoutine {
  title: string;
  focusArea: string;
  precautions: string;
  durationMinutes?: number;
  level?: string;
  warmUp?: string[];
  mainFlow?: string[];
  coolDown?: string[];
  poses: RoutinePose[];
}

interface YogaChatbotProps {
  onStartFlow?: (flow: FlowSequence) => void;
  onInspectPose?: (pose: YogaPose) => void;
}

export default function YogaChatbot({ onStartFlow, onInspectPose }: YogaChatbotProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState<GeneratedRoutine | null>({
    title: "Lower Back Decompression & Posture Flow",
    focusArea: "Spinal Mobility & Shoulder Opening",
    precautions: "Avoid pulling forcefully in Cobra Pose; move slowly with breath. Consult a physician if experiencing sharp, shooting, or acute pain.",
    durationMinutes: 15,
    level: "beginner",
    poses: [
      {
        name: "Cat-Cow Stretch (Marjaryasana-Bitilasana)",
        duration: "5-8 breaths",
        visualCue: "Inhale to arch back and look up; exhale to round spine towards ceiling.",
        benefit: "Warms up vertebrae and releases mid-back tightness.",
        targetMuscles: ["Erector Spinae", "Abdominals"]
      },
      {
        name: "Sphinx Pose (Salamba Bhujangasana)",
        duration: "1 minute",
        visualCue: "Lie on belly, forearms on mat, gently press chest forward.",
        benefit: "Strengthens lumbar region without over-arching.",
        targetMuscles: ["Upper Back", "Lumbar Spine", "Chest"]
      },
      {
        name: "Glute Bridges (Setu Bandhasana prep)",
        duration: "10 reps",
        visualCue: "Press heels down, lift hips until knees and shoulders align.",
        benefit: "Activates glutes to relieve pressure from the lower back.",
        targetMuscles: ["Gluteus Maximus", "Hamstrings"]
      }
    ]
  });
  const [introMessage, setIntroMessage] = useState<string | null>(
    "Namaste! I have crafted a gentle therapeutic routine focusing on spinal decompression, pelvic balance, and posture support."
  );

  const quickPrompts = [
    'I have mild lower back pain',
    'Improve body posture and open chest',
    'Morning energy flow for beginners',
    'Desk worker neck and shoulder relief',
  ];

  const handleSend = async (promptText: string) => {
    if (!promptText.trim()) return;
    setLoading(true);
    setRoutine(null);
    setIntroMessage(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await res.json();
      if (data.routine) {
        setRoutine(data.routine);
      }
      if (data.message) {
        setIntroMessage(data.message);
      }
    } catch (err) {
      console.error('Failed to fetch routine:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to map pose name to built-in YogaPose for 3D/2D animation & practice
  const findMatchingPose = (poseName: string): YogaPose => {
    const lower = poseName.toLowerCase();
    if (lower.includes("cat") || lower.includes("cow") || lower.includes("marjaryasana")) {
      return YOGA_POSES.find(p => p.id === "cat-cow") || YOGA_POSES[0];
    }
    if (lower.includes("sphinx") || lower.includes("cobra") || lower.includes("bhujangasana")) {
      return YOGA_POSES.find(p => p.id === "cobra-pose") || YOGA_POSES[0];
    }
    if (lower.includes("bridge") || lower.includes("setu bandha")) {
      return YOGA_POSES.find(p => p.id === "bridge-pose") || YOGA_POSES[0];
    }
    if (lower.includes("child") || lower.includes("balasana")) {
      return YOGA_POSES.find(p => p.id === "child-pose") || YOGA_POSES[0];
    }
    if (lower.includes("downward") || lower.includes("dog") || lower.includes("adho mukha")) {
      return YOGA_POSES.find(p => p.id === "downward-dog") || YOGA_POSES[0];
    }
    if (lower.includes("pigeon") || lower.includes("kapotasana")) {
      return YOGA_POSES.find(p => p.id === "pigeon-pose") || YOGA_POSES[0];
    }
    if (lower.includes("warrior ii") || lower.includes("warrior 2")) {
      return YOGA_POSES.find(p => p.id === "warrior-2") || YOGA_POSES[0];
    }
    if (lower.includes("warrior")) {
      return YOGA_POSES.find(p => p.id === "warrior-1") || YOGA_POSES[0];
    }
    if (lower.includes("tree") || lower.includes("vrksasana")) {
      return YOGA_POSES.find(p => p.id === "tree-pose") || YOGA_POSES[0];
    }
    if (lower.includes("twist") || lower.includes("matsyendrasana")) {
      return YOGA_POSES.find(p => p.id === "supine-twist") || YOGA_POSES[0];
    }
    if (lower.includes("savasana") || lower.includes("corpse")) {
      return YOGA_POSES.find(p => p.id === "savasana") || YOGA_POSES[0];
    }
    return YOGA_POSES[0];
  };

  // Convert routine to practice flow
  const handleStartRoutinePractice = () => {
    if (!routine || !onStartFlow) return;

    const flowPoses: FlowItem[] = routine.poses.map((p) => {
      const match = findMatchingPose(p.name);
      let durationSec = 60;
      if (p.duration.includes("breath")) {
        durationSec = 45;
      } else if (p.duration.includes("minute")) {
        const mins = parseInt(p.duration) || 1;
        durationSec = mins * 60;
      } else if (p.duration.includes("rep")) {
        durationSec = 50;
      }

      return {
        poseId: match.id,
        durationSeconds: durationSec,
        note: `${p.visualCue} • Benefit: ${p.benefit}`,
      };
    });

    const sequence: FlowSequence = {
      id: `ai-routine-${Date.now()}`,
      title: routine.title,
      subtitle: `AI-designed flow for ${routine.focusArea}`,
      durationMinutes: routine.durationMinutes || Math.round(flowPoses.reduce((a, b) => a + b.durationSeconds, 0) / 60) || 15,
      category: "recovery",
      difficulty: "beginner",
      physicalFocus: [routine.focusArea],
      mentalFocus: "Gentle Alignment & Breath Awareness",
      description: `${routine.precautions ? `Safety Note: ${routine.precautions} ` : ''}Customized therapeutic yoga sequence.`,
      bannerGradient: "from-emerald-900 to-slate-900",
      poses: flowPoses,
      isCustom: true,
    };

    onStartFlow(sequence);
  };

  return (
    <div id="ai-yoga-chatbot-panel" className="max-w-4xl mx-auto p-6 sm:p-8 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-400">AI Yoga Routine Assistant</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Specialized in posture alignment, spinal mobility, and therapeutic recovery flows
              </p>
            </div>
          </div>
        </div>

        {routine && onStartFlow && (
          <button
            onClick={handleStartRoutinePractice}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Practice Session</span>
          </button>
        )}
      </div>

      {/* Quick Select Chips */}
      <div className="mb-5">
        <span className="text-xs font-semibold text-slate-400 block mb-2">
          Recommended Consultations:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => {
                setInput(q);
                handleSend(q);
              }}
              className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-slate-700/80 hover:border-emerald-500/50 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{q}</span>
              <ArrowRight className="w-3 h-3 text-emerald-400 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
        <input
          id="yoga-chatbot-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., I sit all day and need a 15-min posture routine..."
          className="flex-1 bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-2xl px-4.5 py-3.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm sm:text-base placeholder-slate-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
        />
        <button
          id="btn-generate-ai-routine"
          onClick={() => handleSend(input)}
          disabled={loading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold px-6 py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs text-sm sm:text-base whitespace-nowrap"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Designing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Flow</span>
            </>
          )}
        </button>
      </div>

      {/* Empathetic Greeting / Context */}
      {introMessage && !loading && (
        <div className="mb-4 px-4 py-3 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl text-xs sm:text-sm text-emerald-200/90 flex items-start gap-2.5">
          <Heart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>{introMessage}</p>
        </div>
      )}

      {/* Routine Display */}
      {routine && (
        <div className="space-y-4 bg-slate-800/40 p-5 sm:p-7 rounded-2xl border border-slate-700/60 shadow-inner">
          <div className="border-b border-slate-700/80 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-300">{routine.title}</h3>
              {routine.durationMinutes && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 self-start sm:self-auto font-mono">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {routine.durationMinutes} Minutes
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800/60 inline-flex items-center gap-1.5 font-medium">
                <Compass className="w-3 h-3" />
                Focus: {routine.focusArea}
              </span>
              {routine.level && (
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 capitalize">
                  Level: {routine.level}
                </span>
              )}
            </div>

            {routine.precautions && (
              <div className="text-amber-300/90 text-xs sm:text-sm mt-3.5 bg-amber-950/40 p-3.5 rounded-xl border border-amber-900/60 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-amber-300">Safety Protocol:</strong> {routine.precautions}
                </div>
              </div>
            )}
          </div>

          {/* Posture Cards List */}
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold uppercase tracking-wider">
              <span>Sequence Asanas ({routine.poses.length} Poses)</span>
              <span>Hold Time</span>
            </div>

            {routine.poses.map((pose, idx) => {
              const matchedPose = findMatchingPose(pose.name);

              return (
                <div 
                  key={idx} 
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-100 text-sm sm:text-base">{pose.name}</h4>
                        {matchedPose && (
                          <span className="text-[11px] text-slate-400 italic">
                            ({matchedPose.sanskritName})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1 flex items-start gap-1">
                        <span className="text-emerald-400 font-medium">Alignment Cue:</span>
                        <span>{pose.visualCue}</span>
                      </p>
                      <p className="text-xs text-emerald-400/90 mt-1 flex items-start gap-1">
                        <span className="text-emerald-500 font-medium">Target Benefit:</span>
                        <span>{pose.benefit}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <span className="text-xs font-mono bg-slate-950 text-emerald-300 px-3 py-1.5 rounded-xl border border-slate-800">
                      {pose.duration}
                    </span>

                    {onInspectPose && matchedPose && (
                      <button
                        onClick={() => onInspectPose(matchedPose)}
                        className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Inspect 3D Anatomical Form"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          {onStartFlow && (
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-700/60">
              <div className="text-xs text-slate-400">
                ⚡ Ready to practice this routine with guided breath pacing and audio?
              </div>
              <button
                onClick={handleStartRoutinePractice}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Practice Flow</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
