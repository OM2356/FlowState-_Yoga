import React, { useState } from "react";
import { MYTHS_DATA } from "../../../data/deckData";
import { XCircle, CheckCircle2, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

export const MythsVsRealityVisual: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>("ayurveda");

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Header Comparison Labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono tracking-wider uppercase font-semibold">
        <div className="flex items-center gap-2 text-red-400 px-1">
          <XCircle className="w-4 h-4" />
          <span>The Superficial Myth</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[#2EC4B6] px-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>The Scientific Reality</span>
        </div>
      </div>

      {/* Myth vs Reality Interactive Rows */}
      <div className="space-y-3">
        {MYTHS_DATA.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-[#121620] border border-[#242D3D] rounded-2xl p-4 transition-all hover:border-[#384660]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Myth Box */}
                <div className="p-3 bg-[#1C1416] border border-red-900/30 rounded-xl flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-red-400 font-semibold block mb-0.5">
                      Misconception
                    </span>
                    <p className="text-xs sm:text-sm text-[#F5C2C7] font-medium leading-snug">
                      "{item.myth}"
                    </p>
                  </div>
                </div>

                {/* Reality Box */}
                <div className="p-3 bg-[#132021] border border-[#2EC4B6]/30 rounded-xl flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2EC4B6] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#2EC4B6] font-semibold block mb-0.5">
                      Clinical Reality
                    </span>
                    <p className="text-xs sm:text-sm text-[#D7F5F0] font-medium leading-snug">
                      {item.reality}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expandable Evidence Bar */}
              <div className="mt-3 pt-2 border-t border-[#1F283A] flex items-center justify-between">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isExpanded ? "Hide Scientific Validation" : "Inspect Scientific Mechanism & Citation"}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <span className="text-[10px] font-mono text-[#8C9BAE]">{item.citation}</span>
              </div>

              {/* Expanded Citation Details */}
              {isExpanded && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#0B0F17] border border-[#1A2333] text-xs text-[#8C9BAE]">
                  <p className="mb-1 text-[#CAD5E2]">
                    <strong className="text-[#2EC4B6]">Validation Study: </strong>
                    {item.scientificContext}
                  </p>
                  <p className="text-[10px] font-mono text-[#FF9F1C]">
                    Source: {item.citation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
