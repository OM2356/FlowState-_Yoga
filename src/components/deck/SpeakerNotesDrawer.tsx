import React, { useState } from "react";
import { X, Clock, MessageSquare, Image, Sparkles, ZoomIn, ZoomOut, Compass } from "lucide-react";
import { SlideData } from "../../types/deck";

interface SpeakerNotesDrawerProps {
  slide: SlideData;
  isOpen: boolean;
  onClose: () => void;
}

export const SpeakerNotesDrawer: React.FC<SpeakerNotesDrawerProps> = ({
  slide,
  isOpen,
  onClose,
}) => {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  if (!isOpen) return null;

  const wordCount = slide.speakerNotes.split(/\s+/).length;

  return (
    <div className="fixed bottom-16 right-4 sm:right-8 w-[92vw] sm:w-[480px] max-h-[75vh] bg-[#0E131C]/95 backdrop-blur-xl border border-[#D4AF37]/50 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-serene-pulse" style={{ animationDuration: "0.2s" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#242D3D] bg-[#141A25]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-serif font-bold text-[#F5F1E8]">
            Presenter Teleprompter — Slide {slide.slideNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Resizer */}
          <div className="flex items-center bg-[#0B0E14] rounded-lg border border-[#242D3D] p-0.5 text-xs text-[#8C9BAE]">
            <button
              onClick={() => setFontSize("sm")}
              className={`px-1.5 py-0.5 rounded ${fontSize === "sm" ? "bg-[#242D3D] text-[#F5F1E8]" : ""}`}
              title="Small text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("base")}
              className={`px-1.5 py-0.5 rounded ${fontSize === "base" ? "bg-[#242D3D] text-[#F5F1E8]" : ""}`}
              title="Standard text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-1.5 py-0.5 rounded ${fontSize === "lg" ? "bg-[#242D3D] text-[#F5F1E8]" : ""}`}
              title="Large text"
            >
              A+
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#8C9BAE] hover:text-[#F5F1E8] rounded-lg hover:bg-[#242D3D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
        {/* Pacing Guide Badge */}
        <div className="flex items-center justify-between text-xs font-mono bg-[#141A26] border border-[#222B3D] p-2 rounded-xl text-[#8C9BAE]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#2EC4B6]" />
            Pacing: ~{slide.estimatedSpeakSeconds}s ({wordCount} words)
          </span>
          <span className="text-[#FF9F1C] font-medium">TED Delivery Style</span>
        </div>

        {/* Primary Speaker Notes */}
        <div>
          <span className="text-[10px] uppercase tracking-wider font-mono text-[#D4AF37] block mb-1 font-semibold">
            Spoken Narrative
          </span>
          <p
            className={`text-[#F5F1E8] leading-relaxed font-sans ${
              fontSize === "sm"
                ? "text-xs"
                : fontSize === "base"
                ? "text-sm"
                : "text-base font-medium"
            }`}
          >
            {slide.speakerNotes}
          </p>
        </div>

        {/* Verbal Transition Cue */}
        <div className="p-3 bg-[#171D2A] border border-[#2B374C] rounded-xl text-xs">
          <span className="text-[10px] uppercase font-mono text-[#2EC4B6] font-semibold block mb-0.5">
            Verbal Bridge to Next Slide
          </span>
          <p className="text-[#CAD5E2] italic font-serif">
            "{slide.transition}"
          </p>
        </div>

        {/* Production & Visual Hints */}
        <div className="p-3 bg-[#0B0F17] border border-[#1C2536] rounded-xl text-xs space-y-2">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8C9BAE] block font-medium">Visual Suggestion</span>
            <p className="text-[#8C9BAE] text-[11px]">{slide.visualSuggestion}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#D4AF37] block font-medium">AI Visual Prompt</span>
            <p className="text-[#8C9BAE] text-[11px] italic">"{slide.aiImagePrompt}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};
