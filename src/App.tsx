import React, { useState, useEffect, useCallback } from "react";
import { SLIDES } from "./data/deckData";
import { DeckHeader } from "./components/deck/DeckHeader";
import { DeckFooter } from "./components/deck/DeckFooter";
import { SlideRenderer } from "./components/deck/SlideRenderer";
import { SpeakerNotesDrawer } from "./components/deck/SpeakerNotesDrawer";
import { SlideGridModal } from "./components/deck/SlideGridModal";
import { SacredGeometryBackground } from "./components/deck/SacredGeometryBackground";
import { PoseTrackingStudio } from "./components/poseTracking/PoseTrackingStudio";
import { Sparkles, Compass } from "lucide-react";

export default function App() {
  const [appMode, setAppMode] = useState<"deck" | "pose-studio">("deck");
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isGridOpen, setIsGridOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLaserActive, setIsLaserActive] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const totalSlides = SLIDES.length;
  const currentSlide = SLIDES[currentSlideIndex];

  // Navigation handlers
  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleGoToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
    }
  }, [totalSlides]);

  // Listen for open-pose-studio event from slide visuals
  useEffect(() => {
    const handleOpenStudio = () => setAppMode("pose-studio");
    window.addEventListener("open-pose-studio", handleOpenStudio);
    return () => window.removeEventListener("open-pose-studio", handleOpenStudio);
  }, []);

  // Keyboard navigation & presentation shortcuts (only when in deck mode)
  useEffect(() => {
    if (appMode !== "deck") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          handleNextSlide();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          handlePrevSlide();
          break;
        case "n":
        case "N":
          e.preventDefault();
          setShowNotes((prev) => !prev);
          break;
        case "g":
        case "G":
          e.preventDefault();
          setIsGridOpen((prev) => !prev);
          break;
        case "l":
        case "L":
          e.preventDefault();
          setIsLaserActive((prev) => !prev);
          break;
        case "a":
        case "A":
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          setIsGridOpen(false);
          setShowNotes(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appMode, handleNextSlide, handlePrevSlide]);

  // Auto-play / Presentation rehearse mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && appMode === "deck") {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => {
          if (prev >= totalSlides - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, appMode, totalSlides]);

  // Laser pointer mouse tracker
  useEffect(() => {
    if (!isLaserActive || appMode !== "deck") {
      setLaserPos(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setLaserPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isLaserActive, appMode]);

  // Fullscreen controller
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F5F1E8] flex flex-col justify-between font-sans selection:bg-[#FF9F1C]/30 relative overflow-x-hidden">
      {/* Sacred Geometry Ambient Animated Background */}
      <SacredGeometryBackground 
        accent={currentSlide.accent} 
        laserPos={laserPos} 
      />

      {/* Top Application Switcher Bar */}
      <div className="w-full bg-[#080B10] border-b border-[#1A2230] px-4 py-1.5 flex items-center justify-between text-xs font-mono z-40">
        <div className="flex items-center gap-2">
          <span className="text-sm">🕉️</span>
          <span className="font-serif font-bold text-[#D4AF37] tracking-wider text-xs sm:text-sm">
            VedaVerse Ecosystem
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#101622] p-1 rounded-xl border border-[#222E42]">
          <button
            onClick={() => setAppMode("deck")}
            className={`px-3 py-1 rounded-lg transition-all ${
              appMode === "deck"
                ? "bg-[#D4AF37] text-[#0B0E14] font-bold shadow-xs"
                : "text-[#8C9BAE] hover:text-[#F5F1E8]"
            }`}
          >
            Presentation Deck
          </button>
          <button
            onClick={() => setAppMode("pose-studio")}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              appMode === "pose-studio"
                ? "bg-[#2EC4B6] text-[#0B0E14] font-bold shadow-xs"
                : "text-[#8C9BAE] hover:text-[#F5F1E8]"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Live 2D→3D Pose Studio</span>
          </button>
        </div>
      </div>

      {appMode === "pose-studio" ? (
        /* Live 2D-to-3D Pose Tracking Studio View */
        <main className="flex-1 relative z-10">
          <PoseTrackingStudio onBackToDeck={() => setAppMode("deck")} />
        </main>
      ) : (
        /* VedaVerse Presentation Deck View */
        <>
          <DeckHeader
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            showNotes={showNotes}
            onToggleNotes={() => setShowNotes((prev) => !prev)}
            onOpenGrid={() => setIsGridOpen(true)}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying((prev) => !prev)}
            isLaserActive={isLaserActive}
            onToggleLaser={() => setIsLaserActive((prev) => !prev)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onOpenStudio={() => setAppMode("pose-studio")}
          />

          {/* Main Slide Stage */}
          <main className="flex-1 flex items-center justify-center relative z-10 py-2 sm:py-4">
            <SlideRenderer slide={currentSlide} />
          </main>

          {/* Slide Navigation Progress & Footer Controls */}
          <DeckFooter
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
            onGoToSlide={handleGoToSlide}
            showNotes={showNotes}
            onToggleNotes={() => setShowNotes((prev) => !prev)}
          />

          {/* Speaker Notes Teleprompter Drawer */}
          <SpeakerNotesDrawer
            slide={currentSlide}
            isOpen={showNotes}
            onClose={() => setShowNotes(false)}
          />

          {/* 14-Slide Thumbnail Grid Modal */}
          <SlideGridModal
            slides={SLIDES}
            currentSlideIndex={currentSlideIndex}
            isOpen={isGridOpen}
            onSelectSlide={handleGoToSlide}
            onClose={() => setIsGridOpen(false)}
          />
        </>
      )}
    </div>
  );
}
