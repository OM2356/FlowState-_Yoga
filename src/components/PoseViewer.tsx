import React, { useState } from "react";
import { YogaPose } from "../types";
import { ThreeYogaHuman } from "./ThreeYogaHuman";
import { AnimatedPoseFigure } from "./AnimatedPoseFigure";
import {
  Box,
  Layers,
  RotateCcw,
  Sparkles,
  Eye,
  Info,
  Maximize2,
  Minimize2,
  Palette,
  Camera,
  Activity,
  Flame,
  Zap,
  CheckCircle2,
  Code2
} from "lucide-react";

interface PoseViewerProps {
  pose: YogaPose;
  isPlaying?: boolean;
  speed?: number;
  initialMode?: "3d" | "2d";
  height?: number | string;
  showControls?: boolean;
  showAssetInfo?: boolean;
  className?: string;
}

export const PoseViewer: React.FC<PoseViewerProps> = ({
  pose,
  isPlaying = true,
  speed = 1.0,
  initialMode = "3d",
  height = 360,
  showControls = true,
  showAssetInfo = true,
  className = ""
}) => {
  const [renderMode, setRenderMode] = useState<"3d" | "2d">(initialMode);
  const [cameraPreset, setCameraPreset] = useState<"threeQuarter" | "side" | "front" | "top">("threeQuarter");
  const [materialMode, setMaterialMode] = useState<"realistic" | "clay" | "heatmap" | "wireframe">("realistic");
  const [activeDepth, setActiveDepth] = useState<number>(100);
  const [showPipelineModal, setShowPipelineModal] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);

  // Derive model file name from pose or fallback
  const glbFilename = pose.model3d || `${pose.id.replace(/-/g, "_")}.glb`;

  return (
    <div
      id={`pose-viewer-${pose.id}`}
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 flex flex-col ${className}`}
      style={{ minHeight: typeof height === "number" ? `${height}px` : height }}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
        {/* Render Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/85 backdrop-blur-md border border-slate-700/60 shadow-lg">
          <button
            onClick={() => setRenderMode("3d")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              renderMode === "3d"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Switch to 3D Rigged Model"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Rig</span>
          </button>
          <button
            onClick={() => setRenderMode("2d")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              renderMode === "2d"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Switch to 2D Vector Animation"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>2D Loop</span>
          </button>
        </div>

        {/* 3D Asset Badge & Pipeline Info */}
        {showAssetInfo && (
          <button
            onClick={() => setShowPipelineModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/85 hover:bg-slate-700/90 backdrop-blur-md border border-slate-700/60 text-xs text-blue-300 transition-colors shadow-lg"
            title="Inspect 3D GLTF asset specifications"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono text-[11px]">{glbFilename}</span>
          </button>
        )}
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
        {renderMode === "3d" ? (
          <div className="w-full h-full min-h-[300px] flex items-center justify-center">
            <ThreeYogaHuman
              pose={pose}
              activeDepth={activeDepth}
              materialMode={materialMode}
              isBreathingAnimated={isPlaying}
              topStyle="fitted-tee"
              bottomStyle="athletic-tights"
              showGroundShadow={true}
              canvasHeight={typeof height === "number" ? height - 60 : 320}
            />
          </div>
        ) : (
          <div className="w-full h-full min-h-[300px] p-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <AnimatedPoseFigure
              poseId={pose.id}
              poseName={pose.name}
              size="lg"
              isPlaying={isPlaying}
              speed={speed}
              showBreathRhythm={true}
            />
            <div className="mt-2 text-center">
              <span className="text-xs text-slate-400 font-medium">{pose.name}</span>
              <span className="block text-[11px] text-slate-500 italic">{pose.sanskritName}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar (when in 3D Mode and enabled) */}
      {showControls && renderMode === "3d" && (
        <div className="px-3 py-2 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          {/* Preset Camera Angles */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1 hidden sm:inline">
              Angle:
            </span>
            {(["threeQuarter", "front", "side", "top"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCameraPreset(view)}
                className={`px-2 py-0.5 rounded-md text-[11px] capitalize transition-colors ${
                  cameraPreset === view
                    ? "bg-slate-800 text-blue-400 font-semibold"
                    : "hover:text-slate-200"
                }`}
              >
                {view === "threeQuarter" ? "3/4" : view}
              </button>
            ))}
          </div>

          {/* Material Shader Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const modes: Array<"realistic" | "clay" | "heatmap" | "wireframe"> = ["realistic", "heatmap", "clay", "wireframe"];
                const next = modes[(modes.indexOf(materialMode) + 1) % modes.length];
                setMaterialMode(next);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Cycle Material Shader"
            >
              <Palette className="w-3 h-3 text-emerald-400" />
              <span className="capitalize text-[11px]">{materialMode}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3D Asset Pipeline Information Modal */}
      {showPipelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">3D Asset Pipeline Specs</h3>
              </div>
              <button
                onClick={() => setShowPipelineModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Asset mapping card */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Pose Asset</span>
                  <div className="text-sm font-mono font-bold text-blue-400 mt-0.5">{glbFilename}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{pose.name} ({pose.sanskritName})</div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                  GLTF / GLB 2.0
                </div>
              </div>

              {/* Pipeline details */}
              <div className="space-y-2">
                <div className="font-semibold text-slate-300 text-xs">Architecture & Loading Strategy:</div>
                <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                  <li><strong className="text-slate-200">Base Rig:</strong> Mixamo Standard Humanoid Biped skeleton with anatomically weighted mesh.</li>
                  <li><strong className="text-slate-200">Export:</strong> Short looping skeletal animations exported from Blender as standalone GLB clips.</li>
                  <li><strong className="text-slate-200">Runtime:</strong> Rendered in real-time with Three.js / React Three Fiber and fallback 2D vector loops.</li>
                  <li><strong className="text-slate-200">Kinematic Integration:</strong> Real-time joint rotation solver with inverse kinematics and breathing pulsation.</li>
                </ul>
              </div>

              {/* Code snippet */}
              <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800 overflow-x-auto">
                <code>{`// React Three Fiber Loading Pattern\nconst { scene, animations } = useGLTF("/models/${glbFilename}");\nconst { actions } = useAnimations(animations, groupRef);`}</code>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPipelineModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
