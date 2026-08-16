import React, { useState } from "react";
import { YogaPose, FlowSequence } from "../types";
import { YOGA_POSES } from "../data/posesData";
import { HumanYogaAvatar } from "./HumanYogaAvatar";
import { 
  Activity, 
  Play, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react";

interface BodyTensionMapProps {
  onStartFlow: (flow: FlowSequence) => void;
  onInspectPose: (pose: YogaPose) => void;
}

interface TensionZone {
  id: string;
  name: string;
  symptomTitle: string;
  plainDescription: string;
  commonCauses: string[];
  poseIds: string[];
  durationMinutes: number;
}

const TENSION_ZONES: TensionZone[] = [
  {
    id: "lower-back",
    name: "Lower Back & Lumbar",
    symptomTitle: "Lower Back Aches & Sitting Fatigue",
    plainDescription: "Sitting for long hours weakens glutes and compresses spinal discs, pulling on your lower lumbar vertebrae.",
    commonCauses: ["Prolonged desk sitting", "Slouched posture", "Tight hamstrings"],
    poseIds: ["cat-cow", "child-pose", "bridge-pose", "cobra-pose"],
    durationMinutes: 10,
  },
  {
    id: "neck-shoulders",
    name: "Neck & Upper Shoulders",
    symptomTitle: "Tech Neck & Tight Shoulder Knots",
    plainDescription: "Looking down at phones and monitors pulls forward on your cervical spine, straining trapezius and shoulder muscles.",
    commonCauses: ["Forward head posture", "Typing tension", "Shallow chest breathing"],
    poseIds: ["cobra-pose", "downward-dog", "child-pose", "seated-forward-fold"],
    durationMinutes: 10,
  },
  {
    id: "hips-glutes",
    name: "Hips & Glutes",
    symptomTitle: "Stiff Hips, Psoas & Sciatica Relief",
    plainDescription: "Your hip flexors stay locked in a bent position while sitting, causing pelvis tilt and tightness across the outer buttocks.",
    commonCauses: ["Desk chairs", "Running/cycling without cool down", "Sedentary stillness"],
    poseIds: ["pigeon-pose", "low-lunge", "malasana", "bridge-pose"],
    durationMinutes: 12,
  },
  {
    id: "hamstrings-calves",
    name: "Hamstrings & Legs",
    symptomTitle: "Tight Back-of-Legs & Stiff Knees",
    plainDescription: "Shortened hamstrings yank downward on your pelvis, contributing directly to lower back stiffness and restricted strides.",
    commonCauses: ["Inadequate stretching", "Walking on hard surfaces", "Heavy leg training"],
    poseIds: ["downward-dog", "triangle-pose", "seated-forward-fold", "legs-up-wall"],
    durationMinutes: 10,
  },
  {
    id: "chest-spine",
    name: "Chest & Spine Posture",
    symptomTitle: "Hunched Upper Back & Slumped Ribcage",
    plainDescription: "Rounded shoulders restrict diaphragm expansion, shallowing your breathing and causing fatigue throughout the day.",
    commonCauses: ["Driving and typing", "Weak upper back extensors", "Stress holding"],
    poseIds: ["cobra-pose", "camel-pose", "warrior-1", "cat-cow"],
    durationMinutes: 12,
  },
  {
    id: "stress-nervous-system",
    name: "Whole Body & Nervous System",
    symptomTitle: "Mental Stress & Restless Energy",
    plainDescription: "Mental burnout triggers muscle guarding throughout the jaw, shoulders, and belly. Inversions and slow breath reset your nervous system.",
    commonCauses: ["High work stress", "Poor sleep quality", "Overactive sympathetic state"],
    poseIds: ["legs-up-wall", "child-pose", "savasana", "supine-twist"],
    durationMinutes: 15,
  }
];

export const BodyTensionMap: React.FC<BodyTensionMapProps> = ({
  onStartFlow,
  onInspectPose,
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>("lower-back");

  const currentZone = TENSION_ZONES.find((z) => z.id === selectedZoneId) || TENSION_ZONES[0];

  const matchingPoses = currentZone.poseIds
    .map((id) => YOGA_POSES.find((p) => p.id === id))
    .filter((p): p is YogaPose => Boolean(p));

  const handleStartZoneRoutine = () => {
    const routineFlow: FlowSequence = {
      id: "tension-relief-" + currentZone.id + "-" + Date.now(),
      title: `${currentZone.name} Relief Flow`,
      subtitle: `${currentZone.durationMinutes}-minute targeted somatic relief for ${currentZone.symptomTitle.toLowerCase()}.`,
      durationMinutes: currentZone.durationMinutes,
      category: "recovery",
      difficulty: "beginner",
      physicalFocus: [currentZone.id],
      mentalFocus: "Gentle somatic release & deep calming breath",
      description: currentZone.plainDescription,
      bannerGradient: "from-[#F5EFEB] to-[#E5DCD0]",
      poses: matchingPoses.map((p) => ({
        poseId: p.id,
        durationSeconds: Math.round((currentZone.durationMinutes * 60) / matchingPoses.length),
        note: p.stepByStepInstructions[0] || "Breathe deeply into the targeted muscle group."
      })),
      isCustom: true,
    };

    onStartFlow(routineFlow);
  };

  return (
    <div id="body-tension-map-section" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4E6548]">
          <Activity className="w-4 h-4" />
          <span>Interactive Body Tension & Pain Relief Map</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C] mt-2">
          Where is your body holding tension today?
        </h2>
        <p className="text-sm sm:text-base text-[#59675C] mt-2 max-w-3xl leading-relaxed">
          Select any area of your body to discover why stiffness gathers there and get an instant, gentle 10-minute yoga routine crafted in plain, easy-to-follow steps.
        </p>
      </div>

      {/* Zone Selector Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TENSION_ZONES.map((zone) => {
          const isSelected = selectedZoneId === zone.id;
          return (
            <button
              key={zone.id}
              id={`btn-tension-zone-${zone.id}`}
              onClick={() => setSelectedZoneId(zone.id)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#4E6548] text-white border-[#4E6548] shadow-xs scale-[1.02]"
                  : "bg-[#FAF7F2] text-[#2C382F] border-[#E0D7C9] hover:bg-[#F2ECE0]"
              }`}
            >
              <div>
                <span className={`text-[11px] font-semibold uppercase tracking-wider block ${isSelected ? "text-[#D8E6D6]" : "text-[#7B8B7E]"}`}>
                  Target Zone
                </span>
                <span className="font-serif font-medium text-sm sm:text-base block mt-1">
                  {zone.name}
                </span>
              </div>
              <span className={`text-xs mt-3 block ${isSelected ? "text-white/80" : "text-[#627265]"}`}>
                {zone.durationMinutes} min flow
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Detail & Targeted Flow Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs">
        {/* Left Column: Symptom Explanation */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C1664C] bg-[#C1664C]/10 px-3 py-1 rounded-full">
              Symptom Guide
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#1A221C] mt-2">
              {currentZone.symptomTitle}
            </h3>
            <p className="text-sm sm:text-base text-[#465449] mt-3 leading-relaxed">
              {currentZone.plainDescription}
            </p>
          </div>

          {/* Common Causes */}
          <div className="p-4 rounded-2xl bg-[#F4EDE2] border border-[#E0D7C9]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5D6D5F]">
              Common Everyday Causes:
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-[#2E3B31]">
              {currentZone.commonCauses.map((cause, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4E6548] shrink-0" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action to Start Flow */}
          <button
            id="btn-start-targeted-relief-flow"
            onClick={handleStartZoneRoutine}
            className="w-full py-4 px-6 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start {currentZone.durationMinutes}-Min Guided Relief Flow</span>
          </button>
        </div>

        {/* Right Column: Targeted Postures Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#526354]">
              Recommended Poses for {currentZone.name} ({matchingPoses.length} Poses)
            </h4>
            <span className="text-xs text-[#758477]">
              Tap any pose to inspect 3D form
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {matchingPoses.map((pose) => (
              <div
                key={pose.id}
                className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#DDD3C2] flex flex-col justify-between hover:border-[#4E6548] hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A5A3C] bg-[#8A5A3C]/10 px-2 py-0.5 rounded-md">
                      {pose.difficulty}
                    </span>
                    <span className="text-xs text-[#637265] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#4E6548]" />
                      {pose.recommendedHoldSeconds}s hold
                    </span>
                  </div>

                  <h5 className="font-serif text-base font-medium text-[#1A221C]">
                    {pose.name}
                  </h5>
                  <span className="text-xs text-[#6D7D70] block italic mb-2">
                    {pose.sanskritName}
                  </span>

                  <p className="text-xs text-[#4F5E52] leading-relaxed line-clamp-2">
                    {pose.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8DFD2] flex items-center gap-2">
                  <button
                    onClick={() => onInspectPose(pose)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-[#EBE2D4] hover:bg-[#DCD0C0] text-[#2C382F] text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#4E6548]" />
                    <span>3D Form</span>
                  </button>
                  <button
                    onClick={() => {
                      const singleFlow: FlowSequence = {
                        id: "single-" + pose.id + "-" + Date.now(),
                        title: `${pose.name} Relief Hold`,
                        subtitle: `Targeted single-pose practice.`,
                        durationMinutes: 2,
                        category: "recovery",
                        difficulty: pose.difficulty,
                        physicalFocus: pose.primaryMuscles,
                        mentalFocus: "Direct tension release",
                        description: pose.description,
                        bannerGradient: "from-[#F5EFEB] to-[#E5DCD0]",
                        poses: [
                          { poseId: pose.id, durationSeconds: pose.recommendedHoldSeconds, note: pose.stepByStepInstructions[0] },
                          { poseId: "child-pose", durationSeconds: 45, note: "Rest and integrate." }
                        ],
                        isCustom: true,
                      };
                      onStartFlow(singleFlow);
                    }}
                    className="py-1.5 px-3 rounded-xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs font-medium flex items-center justify-center gap-1 shadow-2xs transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Try Pose</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
