import React from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export const KeyTakeawaysVisual: React.FC = () => {
  const takeaways = [
    {
      num: "01",
      icon: Sparkles,
      color: "#FF9F1C",
      headline: "One Integrated System",
      body: "Vedic science was never meant to be four separate apps. VedaVerse restores the native, unified coherence of Yoga, Ayurveda, Breath, and Biorhythms."
    },
    {
      num: "02",
      icon: Zap,
      color: "#2EC4B6",
      headline: "Frictionless Guidance Wins",
      body: "Stressed and depleted minds cannot afford decision fatigue. One-tap, 60-second diagnostic delivery beats scrolling through 10,000 unverified videos every single time."
    },
    {
      num: "03",
      icon: ShieldCheck,
      color: "#D4AF37",
      headline: "Trust & Outcomes Are the Moat",
      body: "In an unregulated, hype-saturated wellness category, clinical credentialing, verified lineages, and longitudinal biometric measurement form the defensible moat."
    }
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
      {takeaways.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.num}
            className="bg-[#121620] border border-[#242D3D] rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all hover:border-[#D4AF37]/50 hover:shadow-2xl relative overflow-hidden group"
          >
            {/* Ambient Corner Glow */}
            <div 
              className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-[40px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
              style={{ background: item.color }}
            />

            <div>
              {/* Giant Serif Numeral */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-[#D4AF37] tracking-tight">
                  {item.num}
                </span>
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                  style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
              </div>

              <h4 className="text-lg sm:text-xl font-serif text-[#F5F1E8] font-semibold mb-3 leading-snug">
                {item.headline}
              </h4>

              <p className="text-xs sm:text-sm text-[#CAD5E2] leading-relaxed">
                {item.body}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1F2738] flex items-center justify-between text-[10px] font-mono text-[#8C9BAE]">
              <span>Core Thesis</span>
              <span style={{ color: item.color }}>Pillar {item.num}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
