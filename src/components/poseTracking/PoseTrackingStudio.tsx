import React, { useState, useMemo } from "react";
import { TARGET_POSES_LIBRARY } from "../../data/targetPosesLibrary";
import { TargetPoseReference, Landmark3D, VideoSourceMode } from "../../types/poseTracking";
import { evaluatePoseAlignment } from "../../utils/poseGeometry";
import { LiveThreeAvatar } from "./LiveThreeAvatar";
import { LiveWebcamCanvas } from "./LiveWebcamCanvas";
import { PoseAngleFeedbackPanel } from "./PoseAngleFeedbackPanel";
import { 
  Compass, 
  Sparkles, 
  Camera, 
  Sliders, 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  Activity,
  Layers,
  ChevronDown,
  Info
} from "lucide-react";

interface PoseTrackingStudioProps {
  onBackToDeck?: () => void;
}

export const PoseTrackingStudio: React.FC<PoseTrackingStudioProps> = ({ onBackToDeck }) => {
  const [selectedPoseId, setSelectedPoseId] = useState<string>("warrior-ii");
  const [sourceMode, setSourceMode] = useState<VideoSourceMode>("interactive-rig");
  const [liveLandmarks, setLiveLandmarks] = useState<Landmark3D[]>(() => {
    const p = TARGET_POSES_LIBRARY.find((item) => item.id === "warrior-ii") || TARGET_POSES_LIBRARY[0];
    return p.idealLandmarks3D;
  });

  const currentPose = useMemo(() => {
    return TARGET_POSES_LIBRARY.find((p) => p.id === selectedPoseId) || TARGET_POSES_LIBRARY[0];
  }, [selectedPoseId]);

  // Compute live comparison against target pose
  const comparisonResult = useMemo(() => {
    return evaluatePoseAlignment(liveLandmarks, currentPose);
  }, [liveLandmarks, currentPose]);

  const handleSelectPose = (pose: TargetPoseReference) => {
    setSelectedPoseId(pose.id);
    setLiveLandmarks(pose.idealLandmarks3D);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col gap-4 min-h-[calc(100vh-80px)] select-none">
      {/* Studio Header */}
      <div className="bg-[#0E131C] border border-[#242D3D] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          {onBackToDeck && (
            <button
              onClick={onBackToDeck}
              className="p-2 rounded-xl bg-[#141A25] hover:bg-[#1E2638] border border-[#242D3D] text-[#8C9BAE] hover:text-[#F5F1E8] transition-all flex items-center gap-1.5 text-xs font-mono"
              title="Return to Presentation Deck"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Deck</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-serif font-bold text-[#F5F1E8]">
                2D-to-3D Live Yoga Pose Tracking Studio
              </span>
              <span className="text-[10px] font-mono bg-[#2EC4B6]/15 text-[#2EC4B6] px-2 py-0.5 rounded-full border border-[#2EC4B6]/30">
                Client-Side ML
              </span>
            </div>
            <p className="text-xs text-[#8C9BAE]">
              Extract 33 2D landmarks from webcam → mirror live on 3D rigged avatar → real-time joint angle alignment cues.
            </p>
          </div>
        </div>

        {/* Pose Selection Dropdown / Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {TARGET_POSES_LIBRARY.map((pose) => {
            const isSelected = pose.id === selectedPoseId;
            return (
              <button
                key={pose.id}
                onClick={() => handleSelectPose(pose)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap border ${
                  isSelected
                    ? "bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FF9F1C] font-bold shadow-sm"
                    : "bg-[#141A25] border-[#222B3A] text-[#8C9BAE] hover:text-[#F5F1E8]"
                }`}
              >
                {pose.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Stage (2D Feed Left, 3D Mirrored Avatar Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: 2D Video Feed + 33-Landmark Overlay */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1 text-xs font-mono text-[#8C9BAE]">
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#FF9F1C]" />
              2D Input Feed & MediaPipe Keypoints
            </span>
            <span className="text-[10px] text-[#2EC4B6]">33 Joints Detected</span>
          </div>

          <div className="h-[380px] sm:h-[460px]">
            <LiveWebcamCanvas
              currentLandmarks={liveLandmarks}
              onLandmarksDetected={setLiveLandmarks}
              targetPose={currentPose}
              sourceMode={sourceMode}
              onSourceModeChange={setSourceMode}
            />
          </div>
        </div>

        {/* Right: 3D Mirrored Humanoid Avatar (Three.js) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1 text-xs font-mono text-[#8C9BAE]">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#2EC4B6]" />
              Live 3D Mirrored Avatar + Instructor Ghost Target
            </span>
            <span className="text-[10px] text-[#D4AF37]">WebGL • 360° Orbit</span>
          </div>

          <div className="h-[380px] sm:h-[460px]">
            <LiveThreeAvatar
              currentLandmarks={liveLandmarks}
              targetPose={currentPose}
              overallScore={comparisonResult.overallScore}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row: Joint Angle Analysis & Asana Clinical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left (7 cols): Alignment Telemetry Panel */}
        <div className="lg:col-span-7">
          <PoseAngleFeedbackPanel
            comparison={comparisonResult}
            targetPose={currentPose}
          />
        </div>

        {/* Right (5 cols): Asana Clinical Anatomy & Benefits Card */}
        <div className="lg:col-span-5 bg-[#121620] border border-[#242D3D] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-[#242D3D] pb-3 mb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] block">
                  Sanskrit Asana Tradition
                </span>
                <h3 className="text-lg font-serif font-bold text-[#F5F1E8]">
                  {currentPose.name} ({currentPose.sanskritName})
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1A2333] text-[#2EC4B6] border border-[#2EC4B6]/30">
                {currentPose.difficulty}
              </span>
            </div>

            <p className="text-xs text-[#CAD5E2] leading-relaxed mb-3">
              {currentPose.description}
            </p>

            {/* Physiological Benefits */}
            <div className="space-y-1.5 mb-3">
              <span className="text-[10px] uppercase font-mono font-semibold text-[#2EC4B6] block">
                Biomechanical Adaptations:
              </span>
              <ul className="text-xs text-[#CAD5E2] space-y-1 pl-4 list-disc leading-relaxed">
                {currentPose.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            {/* Cautions */}
            {currentPose.cautions.length > 0 && (
              <div className="p-2.5 rounded-xl bg-[#1A181C] border border-amber-900/30 text-xs text-[#F2D0C5] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentPose.cautions[0]}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1F2738] flex items-center justify-between text-xs text-[#8C9BAE]">
            <span className="font-mono text-[10px]">Pillar: Yoga & Movement</span>
            <span className="text-[#D4AF37] font-mono text-[10px]">ACOG & Iyengar Aligned ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
