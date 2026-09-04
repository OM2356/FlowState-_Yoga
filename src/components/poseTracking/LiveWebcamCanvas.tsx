import React, { useRef, useEffect, useState } from "react";
import { Landmark3D, TargetPoseReference, VideoSourceMode } from "../../types/poseTracking";
import { POSE_CONNECTIONS, POSE_LANDMARKS } from "../../utils/poseGeometry";
import { Camera, CameraOff, Video, Sliders, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface LiveWebcamCanvasProps {
  currentLandmarks: Landmark3D[];
  onLandmarksDetected: (landmarks: Landmark3D[]) => void;
  targetPose: TargetPoseReference;
  sourceMode: VideoSourceMode;
  onSourceModeChange: (mode: VideoSourceMode) => void;
}

export const LiveWebcamCanvas: React.FC<LiveWebcamCanvasProps> = ({
  currentLandmarks,
  onLandmarksDetected,
  targetPose,
  sourceMode,
  onSourceModeChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(30);

  // Procedural interactive simulation controls when in 'interactive-rig' mode
  const [simKneeBend, setSimKneeBend] = useState<number>(90); // 90 is ideal target
  const [simArmElevation, setSimArmElevation] = useState<number>(180); // 180 is ideal target
  const [simTorsoTilt, setSimTorsoTilt] = useState<number>(90); // 90 is ideal target
  const [isAutoLooping, setIsAutoLooping] = useState<boolean>(true);

  // Setup Webcam Stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isCancelled = false;

    if (sourceMode === "webcam") {
      setCameraError(null);
      navigator.mediaDevices
        ?.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        })
        .then((mediaStream) => {
          if (isCancelled) {
            mediaStream.getTracks().forEach((track) => track.stop());
            return;
          }
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch((err) => {
          console.warn("Webcam access unavailable or restricted in iframe:", err);
          setCameraError(
            "Webcam permission not granted or restricted in container preview. Running in Interactive Biomechanical Simulation Mode."
          );
          onSourceModeChange("interactive-rig");
        });
    }

    return () => {
      isCancelled = true;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [sourceMode, onSourceModeChange]);

  // Procedural Animation Loop for Interactive Simulation Mode
  useEffect(() => {
    if (sourceMode !== "interactive-rig" && sourceMode !== "demo-stream") return;

    let animId: number;
    let t = 0;

    const loop = () => {
      t += 0.035;

      // Base target landmarks
      const base = targetPose.idealLandmarks3D.map((lm) => ({ ...lm }));

      if (isAutoLooping) {
        // Natural gentle organic breathing & pose oscillation to demonstrate real-time tracking
        const sway = Math.sin(t) * 0.03;
        const kneeShift = Math.sin(t * 0.8) * 0.04;
        const armShift = Math.cos(t * 0.6) * 0.025;

        // Apply shifts to left knee
        base[POSE_LANDMARKS.LEFT_KNEE] = {
          ...base[POSE_LANDMARKS.LEFT_KNEE],
          y: base[POSE_LANDMARKS.LEFT_KNEE].y + kneeShift,
          x: base[POSE_LANDMARKS.LEFT_KNEE].x - kneeShift * 0.5,
        };

        // Apply shifts to arms
        base[POSE_LANDMARKS.LEFT_WRIST] = {
          ...base[POSE_LANDMARKS.LEFT_WRIST],
          y: base[POSE_LANDMARKS.LEFT_WRIST].y + armShift,
        };
        base[POSE_LANDMARKS.RIGHT_WRIST] = {
          ...base[POSE_LANDMARKS.RIGHT_WRIST],
          y: base[POSE_LANDMARKS.RIGHT_WRIST].y - armShift,
        };

        // Torso subtle breathing
        base[POSE_LANDMARKS.NOSE] = {
          ...base[POSE_LANDMARKS.NOSE],
          x: base[POSE_LANDMARKS.NOSE].x + sway * 0.3,
        };
      } else {
        // Manual slider adjustments
        // Knee flexion adjustment
        const kneeFactor = (simKneeBend - 90) * 0.002;
        base[POSE_LANDMARKS.LEFT_KNEE] = {
          ...base[POSE_LANDMARKS.LEFT_KNEE],
          y: base[POSE_LANDMARKS.LEFT_KNEE].y + kneeFactor,
        };

        // Arm elevation adjustment
        const armFactor = (simArmElevation - 180) * 0.0015;
        base[POSE_LANDMARKS.LEFT_WRIST] = {
          ...base[POSE_LANDMARKS.LEFT_WRIST],
          y: base[POSE_LANDMARKS.LEFT_WRIST].y + armFactor,
        };
        base[POSE_LANDMARKS.RIGHT_WRIST] = {
          ...base[POSE_LANDMARKS.RIGHT_WRIST],
          y: base[POSE_LANDMARKS.RIGHT_WRIST].y + armFactor,
        };
      }

      onLandmarksDetected(base);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [sourceMode, targetPose, isAutoLooping, simKneeBend, simArmElevation, simTorsoTilt, onLandmarksDetected]);

  // 2D Canvas Landmark & Skeleton Overlay Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (!currentLandmarks || currentLandmarks.length < 33) return;

    // Draw Skeleton Connections
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    POSE_CONNECTIONS.forEach(([idxA, idxB]) => {
      const pA = currentLandmarks[idxA];
      const pB = currentLandmarks[idxB];
      if (!pA || !pB) return;

      const xA = (isMirrored ? 1 - pA.x : pA.x) * width;
      const yA = pA.y * height;
      const xB = (isMirrored ? 1 - pB.x : pB.x) * width;
      const yB = pB.y * height;

      ctx.beginPath();
      ctx.moveTo(xA, yA);
      ctx.lineTo(xB, yB);
      ctx.strokeStyle = "rgba(46, 196, 182, 0.75)";
      ctx.stroke();
    });

    // Draw 33 Landmark Points
    currentLandmarks.forEach((lm, idx) => {
      const cx = (isMirrored ? 1 - lm.x : lm.x) * width;
      const cy = lm.y * height;

      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#FF9F1C";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();
    });

    // Draw Joint Angle Readout Callouts
    targetPose.keyJointMetrics.forEach((rule) => {
      const centerIdx = rule.jointTriplet[1];
      const centerLm = currentLandmarks[centerIdx];
      if (!centerLm) return;

      const px = (isMirrored ? 1 - centerLm.x : centerLm.x) * width;
      const py = centerLm.y * height;

      // Small badge displaying live angle
      ctx.fillStyle = "rgba(11, 14, 20, 0.85)";
      ctx.strokeStyle = "#2EC4B6";
      ctx.lineWidth = 1;
      const text = `${rule.name}: ${rule.targetAngle}°`;
      ctx.font = "10px monospace";
      const textWidth = ctx.measureText(text).width;

      ctx.fillRect(px + 8, py - 12, textWidth + 8, 18);
      ctx.strokeRect(px + 8, py - 12, textWidth + 8, 18);

      ctx.fillStyle = "#F5F1E8";
      ctx.fillText(text, px + 12, py + 1);
    });
  }, [currentLandmarks, targetPose, isMirrored]);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] bg-[#0E131C] rounded-2xl overflow-hidden border border-[#242D3D] flex flex-col shadow-2xl">
      {/* Video & Canvas Frame */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-black">
        {/* Real Webcam Video Element */}
        {sourceMode === "webcam" && (
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${isMirrored ? "-scale-x-100" : ""}`}
          />
        )}

        {/* Synthetic Interactive Stream Visual Background */}
        {sourceMode !== "webcam" && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D121B] via-[#111724] to-[#0A0D14] flex flex-col items-center justify-center p-6 text-center">
            {/* Subtle Grid backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b2434_1px,transparent_1px),linear-gradient(to_bottom,#1b2434_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
            <div className="relative z-10 max-w-sm">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-[#2EC4B6]/15 text-[#2EC4B6] border border-[#2EC4B6]/30 mb-2 inline-block">
                Interactive Biomechanical Stream
              </span>
              <h4 className="text-sm font-serif font-semibold text-[#F5F1E8] mb-1">
                Live 2D Pose Landmark Extraction
              </h4>
              <p className="text-xs text-[#8C9BAE] leading-relaxed">
                Extracting 33 client-side joints at 30 FPS. Drag the calibration sliders below or switch to Live Webcam.
              </p>
            </div>
          </div>
        )}

        {/* 2D Landmark Overlay Canvas */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
        />
      </div>

      {/* Top Overlay Badge Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
        {/* Source Mode Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0B0E14]/85 backdrop-blur-md p-1 rounded-xl border border-[#242D3D] text-xs font-mono">
          <button
            onClick={() => onSourceModeChange("interactive-rig")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              sourceMode === "interactive-rig"
                ? "bg-[#2EC4B6]/20 border border-[#2EC4B6]/40 text-[#2EC4B6] font-bold"
                : "text-[#8C9BAE] hover:text-[#F5F1E8]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Stream</span>
          </button>

          <button
            onClick={() => onSourceModeChange("webcam")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              sourceMode === "webcam"
                ? "bg-[#FF9F1C]/20 border border-[#FF9F1C]/40 text-[#FF9F1C] font-bold"
                : "text-[#8C9BAE] hover:text-[#F5F1E8]"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Webcam</span>
          </button>
        </div>

        {/* Mirror & FPS Badge */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0B0E14]/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#242D3D] text-[10px] font-mono text-[#8C9BAE]">
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className="hover:text-[#F5F1E8] transition-colors"
            title="Toggle Mirror Feed"
          >
            Mirror: {isMirrored ? "ON" : "OFF"}
          </button>
          <span>•</span>
          <span className="text-[#2EC4B6]">30 FPS</span>
        </div>
      </div>

      {/* Interactive Calibration Sliders (Only visible in simulation mode) */}
      {sourceMode === "interactive-rig" && (
        <div className="bg-[#121622] border-t border-[#1F2738] p-3 z-20 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Live Joint Angle Simulator
            </span>

            <button
              onClick={() => setIsAutoLooping(!isAutoLooping)}
              className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                isAutoLooping
                  ? "bg-[#2EC4B6]/20 border-[#2EC4B6] text-[#2EC4B6]"
                  : "bg-[#1A2230] border-[#2E3D56] text-[#8C9BAE]"
              }`}
            >
              {isAutoLooping ? "Auto Flowing (Live)" : "Manual Sliders"}
            </button>
          </div>

          {!isAutoLooping && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between text-[10px] text-[#8C9BAE] mb-1">
                  <span>Front Knee Angle:</span>
                  <span className="text-[#2EC4B6] font-bold">{simKneeBend}° (Target: 90°)</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="160"
                  value={simKneeBend}
                  onChange={(e) => setSimKneeBend(Number(e.target.value))}
                  className="w-full h-1 bg-[#242D3D] rounded-lg appearance-none cursor-pointer accent-[#2EC4B6]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#8C9BAE] mb-1">
                  <span>Arm Extension:</span>
                  <span className="text-[#FF9F1C] font-bold">{simArmElevation}° (Target: 180°)</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="200"
                  value={simArmElevation}
                  onChange={(e) => setSimArmElevation(Number(e.target.value))}
                  className="w-full h-1 bg-[#242D3D] rounded-lg appearance-none cursor-pointer accent-[#FF9F1C]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Camera Alert Toast if access was denied */}
      {cameraError && (
        <div className="absolute bottom-3 left-3 right-3 bg-amber-950/90 border border-amber-600/50 p-2.5 rounded-xl text-xs text-amber-200 flex items-center justify-between z-30 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="text-[11px] leading-tight">{cameraError}</span>
          </div>
          <button
            onClick={() => setCameraError(null)}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/60 hover:bg-amber-800"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
