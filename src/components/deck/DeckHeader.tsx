import React, { useState, useEffect } from "react";
import { 
  Maximize2, 
  Minimize2, 
  FileText, 
  Grid, 
  Play, 
  Pause, 
  Zap, 
  Clock, 
  RotateCcw,
  Sparkles,
  Compass
} from "lucide-react";
import { SlideData } from "../../types/deck";

interface DeckHeaderProps {
  currentSlide: SlideData;
  totalSlides: number;
  showNotes: boolean;
  onToggleNotes: () => void;
  onOpenGrid: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isLaserActive: boolean;
  onToggleLaser: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenStudio?: () => void;
}

export const DeckHeader: React.FC<DeckHeaderProps> = ({
  currentSlide,
  totalSlides,
  showNotes,
  onToggleNotes,
  onOpenGrid,
  isPlaying,
  onTogglePlay,
  isLaserActive,
  onToggleLaser,
  isFullscreen,
  onToggleFullscreen,
  onOpenStudio,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleResetTimer = () => {
    setElapsedSeconds(0);
  };

  return (
    <header className="w-full bg-[#0B0E14]/90 backdrop-blur-md border-b border-[#1E2532] px-4 sm:px-6 py-2.5 flex items-center justify-between z-30 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF9F1C] via-[#D4AF37] to-[#2EC4B6] p-[1.5px] flex items-center justify-center shadow-[0_0_12px_rgba(255,159,28,0.3)]">
          <div className="w-full h-full bg-[#0B0E14] rounded-[10px] flex items-center justify-center">
            <span className="text-sm font-serif font-bold text-[#D4AF37]">🕉️</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-serif font-bold text-[#F5F1E8] tracking-wide">
              VedaVerse
            </span>
            <span className="text-[10px] font-mono uppercase bg-[#18202E] text-[#D4AF37] px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
              Deck
            </span>
          </div>
          <p className="text-[10px] text-[#8C9BAE] hidden sm:block">
            Ancient Wisdom. Modern Interface.
          </p>
        </div>
      </div>

      {/* Center Slide Indicator & Clock */}
      <div className="flex items-center gap-3">
        {/* Slide Counter */}
        <button
          onClick={onOpenGrid}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#121620] hover:bg-[#1A2230] border border-[#242D3D] text-xs font-mono text-[#F5F1E8] transition-all group"
          title="Click to view all slides (G)"
        >
          <Grid className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
          <span>
            {currentSlide.slideNumber.toString().padStart(2, "0")} / {totalSlides.toString().padStart(2, "0")}
          </span>
        </button>

        {/* Presenter Timer */}
        <div 
          onClick={handleResetTimer}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#121620] border border-[#242D3D] text-xs font-mono text-[#8C9BAE] hover:text-[#CAD5E2] cursor-pointer transition-colors"
          title="Elapsed presentation time (Click to reset)"
        >
          <Clock className="w-3 h-3 text-[#2EC4B6]" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Presenter Tools */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Auto-Play Toggle */}
        <button
          onClick={onTogglePlay}
          className={`p-2 rounded-lg text-xs border transition-all ${
            isPlaying
              ? "bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FF9F1C]"
              : "bg-[#121620] border-[#242D3D] text-[#8C9BAE] hover:text-[#F5F1E8]"
          }`}
          title={isPlaying ? "Pause auto-advance (A)" : "Auto-advance slides (A)"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Laser Pointer Mode */}
        <button
          onClick={onToggleLaser}
          className={`p-2 rounded-lg text-xs border transition-all ${
            isLaserActive
              ? "bg-red-950/40 border-red-600 text-red-400 shadow-[0_0_10px_rgba(255,51,102,0.4)]"
              : "bg-[#121620] border-[#242D3D] text-[#8C9BAE] hover:text-[#F5F1E8]"
          }`}
          title="Toggle Laser Pointer mode (L)"
        >
          <Zap className="w-4 h-4" />
        </button>

        {/* Live 2D->3D Pose Tracker Studio Button */}
        {onOpenStudio && (
          <button
            onClick={onOpenStudio}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-[#2EC4B6]/15 hover:bg-[#2EC4B6]/25 text-[#2EC4B6] border border-[#2EC4B6]/40 flex items-center gap-1.5 transition-all shadow-sm group"
            title="Launch Live 2D-to-3D Yoga Pose Tracking Studio"
          >
            <Compass className="w-3.5 h-3.5 text-[#2EC4B6] group-hover:rotate-45 transition-transform" />
            <span className="hidden sm:inline font-semibold">Live 3D Studio</span>
          </button>
        )}

        {/* Speaker Notes Toggle */}
        <button
          onClick={onToggleNotes}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-all ${
            showNotes
              ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]"
              : "bg-[#121620] border-[#242D3D] text-[#8C9BAE] hover:text-[#F5F1E8]"
          }`}
          title="Toggle Speaker Notes drawer (N)"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Notes</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-lg text-xs bg-[#121620] border border-[#242D3D] text-[#8C9BAE] hover:text-[#F5F1E8] transition-all"
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
