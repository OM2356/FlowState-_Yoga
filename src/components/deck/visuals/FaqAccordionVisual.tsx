import React, { useState } from "react";
import { FAQ_ITEMS } from "../../../data/deckData";
import { HelpCircle, ChevronDown, ChevronUp, Shield, Lock, Sparkles, CheckCircle2 } from "lucide-react";

export const FaqAccordionVisual: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              isOpen
                ? "bg-[#141A25] border-[#2EC4B6]/50 shadow-lg"
                : "bg-[#11151F] border-[#242D3D] hover:border-[#384660]"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#0D121B] border border-[#242D3D] flex items-center justify-center shrink-0 text-[#2EC4B6]">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-semibold">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-serif font-medium text-[#F5F1E8]">
                    {item.question}
                  </h4>
                </div>
              </div>

              <div className="text-[#8C9BAE] shrink-0 p-1 rounded-lg bg-[#0D121B]">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-[#CAD5E2] leading-relaxed border-t border-[#1E2738] bg-[#0D111A]/80">
                <p className="mb-3">{item.answer}</p>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#2EC4B6]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified standard operating compliance</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Safety & Compliance Badge Footer */}
      <div className="p-3 rounded-xl bg-[#0D121B] border border-[#1E283A] flex items-center justify-between text-xs text-[#8C9BAE]">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#2EC4B6]" />
          Explicit Wellness Non-Diagnostic Boundary
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px]">
          <Lock className="w-3 h-3 text-[#FF9F1C]" />
          Zero Third-Party Data Sharing
        </span>
      </div>
    </div>
  );
};
