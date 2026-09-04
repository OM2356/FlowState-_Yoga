import React, { useState } from "react";
import { Copy, Check, Share2, Sparkles, Printer, Award, ExternalLink } from "lucide-react";

export const FinalSummaryCardVisual: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const summaryRows = [
    {
      label: "WHAT",
      icon: "🕉️",
      color: "#D4AF37",
      title: "Unified Web Ecosystem",
      content: "Yoga, Ayurveda, Meditation & Jyotish integrated into one single authenticated profile with zero fragmented downloads."
    },
    {
      label: "WHY",
      icon: "🎯",
      color: "#FF9F1C",
      title: "Trust & Retention Deficit",
      content: "Addressing the rampant contradictions in a $6.3T+ wellness economy where 90%+ of generic apps churn within 90 days."
    },
    {
      label: "HOW",
      icon: "⚙️",
      color: "#2EC4B6",
      title: "60-Second Frictionless Matching",
      content: "One-tap diagnostic, dosha-matched algorithm, verified Vaidya lineages, and longitudinal biometric outcome tracking."
    },
    {
      label: "WHERE NEXT",
      icon: "🌍",
      color: "#8B5CF6",
      title: "Ambient Wearables & Enterprise",
      content: "On-device AI biomarker sequencing, hands-free voice guidance, B2B corporate wellness stipends, and global diaspora expansion."
    },
    {
      label: "THE ONE-LINER",
      icon: "💬",
      color: "#D4AF37",
      title: "Ancient Wisdom, One Tap Away",
      content: "The oldest science on human flourishing, delivered on modern digital infrastructure without cognitive load."
    }
  ];

  const handleCopy = () => {
    const text = `VedaVerse — Ancient Wisdom, One Tap Away.\n\n` +
      `• WHAT: Unified web ecosystem for Yoga, Ayurveda, Meditation & Jyotish.\n` +
      `• WHY: Fragmented, unverified wellness content vs. $6.3T+ growing market.\n` +
      `• HOW: One-tap personalized guidance, dosha-matched, outcome-measured.\n` +
      `• WHERE NEXT: AI personalization, wearables, corporate wellness, global reach.\n` +
      `• ONE-LINER: "Ancient wisdom, one tap away."`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Standalone Executive Summary Card */}
      <div className="bg-[#121620] border-2 border-[#D4AF37]/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#242D3D] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-xl shadow-sm">
              🕉️
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] font-semibold">
                Executive Overview Card
              </span>
              <h3 className="text-lg sm:text-xl font-serif text-[#F5F1E8] font-bold">
                VedaVerse Ecosystem at a Glance
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-[#1A2230] hover:bg-[#232F42] border border-[#2D3C54] text-xs font-mono text-[#F5F1E8] flex items-center gap-1.5 transition-all shadow-xs"
              title="Copy executive pitch to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span>{copied ? "Copied" : "Copy Deck Pitch"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-[#1A2230] hover:bg-[#232F42] border border-[#2D3C54] text-[#8C9BAE] hover:text-[#F5F1E8] transition-all"
              title="Print slide"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 Distinct Rows */}
        <div className="space-y-2.5">
          {summaryRows.map((row, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#0E131C] border border-[#1E2738] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all hover:border-[#33425C]"
            >
              <div className="flex items-center gap-2.5 sm:w-1/3 shrink-0">
                <span className="text-base">{row.icon}</span>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase block" style={{ color: row.color }}>
                    {row.label}
                  </span>
                  <span className="text-xs sm:text-sm font-serif font-semibold text-[#F5F1E8]">
                    {row.title}
                  </span>
                </div>
              </div>

              <div className="flex-1 text-xs text-[#CAD5E2] leading-relaxed border-t sm:border-t-0 sm:border-l border-[#1F2A3D] pt-2 sm:pt-0 sm:pl-3">
                {row.content}
              </div>
            </div>
          ))}
        </div>

        {/* Tagline Callout Footer */}
        <div className="mt-4 pt-3 border-t border-[#242D3D] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#D4AF37] font-serif italic text-sm">
            <Sparkles className="w-4 h-4 text-[#FF9F1C]" />
            <span>"Ancient wisdom, one tap away."</span>
          </div>
          <span className="text-[10px] font-mono text-[#8C9BAE]">
            vedaverse.io • Presentation Deck Final
          </span>
        </div>
      </div>
    </div>
  );
};
