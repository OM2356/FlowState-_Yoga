import React from "react";
import { X, Check } from "lucide-react";
import { SlideData } from "../../types/deck";

interface SlideGridModalProps {
  slides: SlideData[];
  currentSlideIndex: number;
  isOpen: boolean;
  onSelectSlide: (index: number) => void;
  onClose: () => void;
}

export const SlideGridModal: React.FC<SlideGridModalProps> = ({
  slides,
  currentSlideIndex,
  isOpen,
  onSelectSlide,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E14]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-serene-pulse" style={{ animationDuration: "0.2s" }}>
      <div className="bg-[#121620] border border-[#242D3D] rounded-3xl w-full max-w-5xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242D3D] bg-[#151B27]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕉️</span>
            <div>
              <h3 className="text-base font-serif font-bold text-[#F5F1E8]">
                Slide Overview Index
              </h3>
              <p className="text-xs text-[#8C9BAE] font-mono">14 Slides — VedaVerse Presentation Deck</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#0E131C] border border-[#242D3D] text-[#8C9BAE] hover:text-[#F5F1E8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of Slides */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 no-scrollbar">
          {slides.map((s, idx) => {
            const isSelected = idx === currentSlideIndex;

            return (
              <button
                key={s.id}
                onClick={() => {
                  onSelectSlide(idx);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-36 group ${
                  isSelected
                    ? "bg-[#1A2333] border-[#FF9F1C] shadow-[0_0_15px_rgba(255,159,28,0.3)] ring-1 ring-[#FF9F1C]"
                    : "bg-[#0E131C] border-[#222B3D] hover:border-[#384660] hover:bg-[#141A26]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">
                      {s.slideNumber.toString().padStart(2, "0")}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#FF9F1C] flex items-center justify-center text-[#0B0E14]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-serif font-semibold text-[#F5F1E8] line-clamp-2 leading-snug group-hover:text-[#FF9F1C] transition-colors">
                    {s.title}
                  </h4>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[#1F2738] flex items-center justify-between text-[10px] font-mono text-[#8C9BAE]">
                  <span className="capitalize">{s.visualType.split("-")[0]}</span>
                  <span>~{s.estimatedSpeakSeconds}s</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
