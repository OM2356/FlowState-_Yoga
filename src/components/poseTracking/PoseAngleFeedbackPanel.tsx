import React, { useState } from "react";
import { PoseComparisonResult, TargetPoseReference } from "../../types/poseTracking";
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  HeartHandshake, 
  Flame, 
  Info,
  ShieldCheck
} from "lucide-react";

interface PoseAngleFeedbackPanelProps {
  comparison: PoseComparisonResult;
  targetPose: TargetPoseReference;
}

export const PoseAngleFeedbackPanel: React.FC<PoseAngleFeedbackPanelProps> = ({
  comparison,
  targetPose,
}) => {
  const [isAudioFeedbackActive, setIsAudioFeedbackActive] = useState<boolean>(true);

  const getStatusBadge = (status: "aligned" | "warning" | "error") => {
    switch (status) {
      case "aligned":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#2EC4B6]/15 text-[#2EC4B6] border border-[#2EC4B6]/30">
            <CheckCircle2 className="w-3 h-3" /> Aligned
          </span>
        );
      case "warning":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#FF9F1C]/15 text-[#FF9F1C] border border-[#FF9F1C]/30">
            <AlertTriangle className="w-3 h-3" /> Adjust
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-800/40">
            <AlertTriangle className="w-3 h-3" /> Misaligned
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-[#121620] border border-[#242D3D] rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Header: Score Gauge & Audio Cues Toggle */}
      <div className="flex items-center justify-between border-b border-[#242D3D] pb-3.5">
        <div className="flex items-center gap-3">
          {/* Circular Score Gauge */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#1E2738"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  comparison.overallScore >= 85
                    ? "#2EC4B6"
                    : comparison.overallScore >= 65
                    ? "#FF9F1C"
                    : "#FF5252"
                }
                strokeWidth="3.5"
                strokeDasharray={`${comparison.overallScore}, 100`}
                className="transition-all duration-300"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-[#F5F1E8]">
              {comparison.overallScore}%
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C9BAE] block">
              Biomechanical Accuracy
            </span>
            <h4 className="text-sm font-serif font-bold text-[#F5F1E8]">
              {comparison.isFullyAligned ? "Posture Mastered ✓" : "Active Alignment Guidance"}
            </h4>
          </div>
        </div>

        {/* Audio Cue Button */}
        <button
          onClick={() => setIsAudioFeedbackActive(!isAudioFeedbackActive)}
          className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all ${
            isAudioFeedbackActive
              ? "bg-[#2EC4B6]/15 border-[#2EC4B6]/40 text-[#2EC4B6]"
              : "bg-[#161D2A] border-[#253246] text-[#8C9BAE]"
          }`}
          title="Toggle Chime Feedback"
        >
          {isAudioFeedbackActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline font-mono text-[10px]">
            {isAudioFeedbackActive ? "Audio Cues On" : "Audio Muted"}
          </span>
        </button>
      </div>

      {/* Actionable Verbal Corrective Cues */}
      {comparison.criticalCues.length > 0 ? (
        <div className="p-3 bg-[#1C1616] border border-red-900/30 rounded-xl space-y-1">
          <span className="text-[10px] uppercase font-mono text-red-400 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Real-time Adjustments:
          </span>
          <ul className="text-xs text-[#F2C5C7] space-y-1 pl-5 list-disc leading-relaxed">
            {comparison.criticalCues.slice(0, 3).map((cue, idx) => (
              <li key={idx}>{cue}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-3 bg-[#101F1F] border border-[#2EC4B6]/30 rounded-xl flex items-center gap-2 text-xs text-[#2EC4B6]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>All monitored joint angles are within certified physiological thresholds!</span>
        </div>
      )}

      {/* Individual Joint Angle Breakdown Cards */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C9BAE] block">
          Key Joint Angle Telemetry
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {comparison.metrics.map((metric) => (
            <div
              key={metric.id}
              className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1E2638] flex flex-col justify-between text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-[#CAD5E2] text-[11px] truncate">
                  {metric.name}
                </span>
                {getStatusBadge(metric.status)}
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <div className="flex items-baseline gap-1 font-mono text-sm">
                  <span
                    className="font-bold"
                    style={{
                      color:
                        metric.status === "aligned"
                          ? "#2EC4B6"
                          : metric.status === "warning"
                          ? "#FF9F1C"
                          : "#FF5252",
                    }}
                  >
                    {metric.currentAngle}°
                  </span>
                  <span className="text-[10px] text-[#8C9BAE]">/ {metric.targetAngle}° Target</span>
                </div>

                <span className="text-[9px] font-mono text-[#8C9BAE]">
                  Tol: ±{metric.tolerance}°
                </span>
              </div>

              {/* Progress bar visual */}
              <div className="w-full bg-[#1C2536] h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(15, 100 - metric.deviation * 2.5))}%`,
                    backgroundColor:
                      metric.status === "aligned"
                        ? "#2EC4B6"
                        : metric.status === "warning"
                        ? "#FF9F1C"
                        : "#FF5252",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pranayama & Anatomical Synergy Footer */}
      <div className="mt-1 pt-3 border-t border-[#1F2738] flex items-center justify-between text-[11px] text-[#8C9BAE]">
        <div className="flex items-center gap-1.5 text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5 text-[#FF9F1C]" />
          <span>Vedic Pranayama: Smooth diaphragmatic breath</span>
        </div>
        <span className="font-mono text-[10px]">Client-Side Math • Zero Latency</span>
      </div>
    </div>
  );
};
