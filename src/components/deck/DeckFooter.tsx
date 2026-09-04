import React from "react";
import { ChevronLeft, ChevronRight, MessageSquare, Compass } from "lucide-react";
import { SlideData } from "../../types/deck";

interface DeckFooterProps {
  currentSlide: SlideData;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onGoToSlide: (index: number) => void;
  showNotes: boolean;
  onToggleNotes: () => void;
}

export const DeckFooter: React.FC<DeckFooterProps> = ({
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onGoToSlide,
  showNotes,
  onToggleNotes,
}) => {
  const currentIndex = currentSlide.slideNumber - 1;
  const progressPercent = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <footer className="w-full bg-[#0B0E14]/95 backdrop-blur-md border-t border-[#1E2532] px-4 sm:px-8 py-3 flex flex-col gap-2 z-30 select-none">
      {/* 14-Slide Segmented Progress Bar */}
      <div className="w-full flex items-center gap-1.5 h-2">
        {Array.from({ length: totalSlides }).map((_, idx) => {
          const isActive = idx === currentIndex;
          const isPassed = idx < currentIndex;

          return (
            <button
              key={idx}
              onClick={() => onGoToSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 flex-1 ${
                isActive
                  ? "bg-gradient-to-r from-[#FF9F1C] to-[#D4AF37] h-2 shadow-[0_0_8px_rgba(255,159,28,0.5)]"
                  : isPassed
                  ? "bg-[#2EC4B6]/60 hover:bg-[#2EC4B6]"
                  : "bg-[#242D3D] hover:bg-[#3E4A5F]"
              }`}
              title={`Jump to Slide ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Footer Controls & Transition Cue Preview */}
      <div className="flex items-center justify-between text-xs font-mono text-[#8C9BAE] pt-1">
        {/* Left: Speaker Transition Cue Preview */}
        <div 
          onClick={onToggleNotes}
          className="flex items-center gap-2 max-w-md truncate cursor-pointer hover:text-[#CAD5E2] transition-colors"
          title="Click to expand full speaker notes"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span className="truncate text-[11px] text-[#A6B4C4]">
            <strong className="text-[#D4AF37]">Transition: </strong>
            "{currentSlide.transition}"
          </span>
        </div>

        {/* Right: Prev / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevSlide}
            disabled={currentIndex === 0}
            className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-[#141A24] border border-[#242D3D] text-[#F5F1E8] hover:bg-[#1E2738] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
            title="Previous slide (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Prev</span>
          </button>

          <span className="text-xs text-[#CAD5E2] px-1 font-semibold">
            {currentSlide.slideNumber} of {totalSlides}
          </span>

          <button
            onClick={onNextSlide}
            disabled={currentIndex === totalSlides - 1}
            className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-[#FF9F1C] hover:bg-[#FF9F1C]/90 text-[#0B0E14] font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-all shadow-sm"
            title="Next slide (Right Arrow or Space)"
          >
            <span className="hidden sm:inline text-xs">Next</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
