import React, { useState } from "react";
import { PERSONAS_DATA } from "../../../data/deckData";
import { PersonaItem } from "../../../types/deck";
import { GraduationCap, Briefcase, HeartHandshake, CalendarDays, CheckCircle2, Clock, Sparkles } from "lucide-react";

export const PersonasShowcaseVisual: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<PersonaItem>(PERSONAS_DATA[0]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return <GraduationCap className="w-5 h-5 text-[#FF9F1C]" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-[#2EC4B6]" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-5 h-5 text-[#D4AF37]" />;
      case "CalendarDays":
        return <CalendarDays className="w-5 h-5 text-[#8B5CF6]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#FF9F1C]" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Persona Selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PERSONAS_DATA.map((persona) => {
          const isSelected = selectedPersona.id === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => setSelectedPersona(persona)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "bg-[#18202D] border-[#FF9F1C] shadow-[0_0_15px_rgba(255,159,28,0.2)] scale-[1.02]"
                  : "bg-[#121620] border-[#242D3D] hover:border-[#3A465E] opacity-80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-[#0D121B] border border-[#242D3D]">
                    {getIcon(persona.avatarIcon)}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#1A2332] text-[#CAD5E2] border border-[#2C3B52]">
                    {persona.dosha}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#F5F1E8]">
                  {persona.title}
                </h4>
                <p className="text-[11px] text-[#8C9BAE] mt-0.5 line-clamp-1">
                  {persona.tagline}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#242D3D] flex items-center justify-between text-[10px] text-[#8C9BAE]">
                <span>{persona.timing}</span>
                {isSelected && <span className="text-[#FF9F1C] font-semibold">Active</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Persona Deep Dive Card */}
      <div className="bg-[#131822] border border-[#2EC4B6]/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242D3D] pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1A2230] border border-[#2EC4B6]/40">
              {getIcon(selectedPersona.avatarIcon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif text-[#F5F1E8] font-semibold">
                  {selectedPersona.title}
                </h3>
                <span className="text-xs font-mono text-[#FF9F1C] bg-[#FF9F1C]/15 px-2 py-0.5 rounded-full border border-[#FF9F1C]/30">
                  Dosha: {selectedPersona.dosha}
                </span>
              </div>
              <p className="text-xs text-[#8C9BAE]">{selectedPersona.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#2EC4B6]" />
            <span className="text-xs font-mono text-[#CAD5E2]">Optimal Window: {selectedPersona.timing}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Challenge Box */}
          <div className="p-3.5 rounded-xl bg-[#181E29] border border-red-900/30">
            <span className="text-[10px] uppercase font-mono font-semibold text-red-400 tracking-wider block mb-1">
              Physiological / Mental Challenge
            </span>
            <p className="text-xs sm:text-sm text-[#CAD5E2] leading-relaxed">
              {selectedPersona.challenge}
            </p>
          </div>

          {/* Prescription Box */}
          <div className="p-3.5 rounded-xl bg-[#17242B] border border-[#2EC4B6]/40">
            <span className="text-[10px] uppercase font-mono font-semibold text-[#2EC4B6] tracking-wider block mb-1">
              VedaVerse Prescribed Protocol
            </span>
            <p className="text-xs sm:text-sm text-[#E2F1ED] leading-relaxed">
              {selectedPersona.prescription}
            </p>
          </div>
        </div>

        {/* Pillars Utilized Tag Row */}
        <div className="mt-4 pt-3 border-t border-[#242D3D] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#8C9BAE] text-[11px] font-mono">Integrated Pillars:</span>
            <div className="flex gap-1.5">
              {selectedPersona.pillarsUsed.map((pil) => (
                <span key={pil} className="capitalize px-2 py-0.5 rounded bg-[#1C2636] text-[#2EC4B6] border border-[#2EC4B6]/30 text-[10px] font-mono">
                  {pil}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-[#D4AF37] font-mono">Zero Secondary Apps Needed ✓</span>
        </div>
      </div>
    </div>
  );
};
