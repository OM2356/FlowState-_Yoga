import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Layers, Shuffle, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

export const SplitScreenChaosVisual: React.FC = () => {
  const [highlightMode, setHighlightMode] = useState<"both" | "chaos" | "vedaverse">("both");

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setHighlightMode("both")}
          className={`px-3 py-1 text-xs rounded-full border transition-all ${
            highlightMode === "both"
              ? "bg-[#242D3D] text-[#F5F1E8] border-[#3A3F4B]"
              : "text-[#8C9BAE] border-transparent hover:text-[#F5F1E8]"
          }`}
        >
          Split Comparison
        </button>
        <button
          onClick={() => setHighlightMode("chaos")}
          className={`px-3 py-1 text-xs rounded-full border transition-all ${
            highlightMode === "chaos"
              ? "bg-red-950/40 text-red-300 border-red-800/60"
              : "text-[#8C9BAE] border-transparent hover:text-[#F5F1E8]"
          }`}
        >
          Today's Fragmentation
        </button>
        <button
          onClick={() => setHighlightMode("vedaverse")}
          className={`px-3 py-1 text-xs rounded-full border transition-all ${
            highlightMode === "vedaverse"
              ? "bg-[#2EC4B6]/20 text-[#2EC4B6] border-[#2EC4B6]/40"
              : "text-[#8C9BAE] border-transparent hover:text-[#F5F1E8]"
          }`}
        >
          VedaVerse Unity
        </button>
      </div>

      {/* Split Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Left: The Fragmented Chaos */}
        <div
          className={`rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden ${
            highlightMode === "vedaverse"
              ? "opacity-30 blur-[1px] bg-[#121620]"
              : "bg-[#161214] border-red-900/40 shadow-xl"
          }`}
        >
          <div className="flex items-center justify-between mb-4 border-b border-red-900/30 pb-3">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="text-sm font-semibold tracking-wide uppercase font-mono">
                The Status Quo
              </h4>
            </div>
            <span className="text-[11px] font-mono text-red-400/80 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
              3–5 Disconnected Apps
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Cluttered App 1 */}
            <div className="p-2.5 rounded-lg bg-[#201518] border border-red-900/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-red-900/40 flex items-center justify-center text-red-300 shrink-0 text-xs font-bold">
                App 1
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between text-red-200 font-medium">
                  <span>Viral Detox Reel</span>
                  <span className="text-[10px] text-red-400">Unverified</span>
                </div>
                <p className="text-[11px] text-[#A0888C] mt-0.5">
                  "Drink cold lemon ash gourd juice daily" (aggravates Vata dosha)
                </p>
              </div>
            </div>

            {/* Cluttered App 2 */}
            <div className="p-2.5 rounded-lg bg-[#201518] border border-red-900/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-red-900/40 flex items-center justify-center text-red-300 shrink-0 text-xs font-bold">
                App 2
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between text-red-200 font-medium">
                  <span>Extreme HIIT Yoga</span>
                  <span className="text-[10px] text-red-400">No Alignment Guard</span>
                </div>
                <p className="text-[11px] text-[#A0888C] mt-0.5">
                  50 rapid jump-backs without pelvic stabilization cues.
                </p>
              </div>
            </div>

            {/* Cluttered App 3 */}
            <div className="p-2.5 rounded-lg bg-[#201518] border border-red-900/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-red-900/40 flex items-center justify-center text-red-300 shrink-0 text-xs font-bold">
                App 3
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between text-red-200 font-medium">
                  <span>Generic Meditation Library</span>
                  <span className="text-[10px] text-red-400">Decision Fatigue</span>
                </div>
                <p className="text-[11px] text-[#A0888C] mt-0.5">
                  10,000+ unorganized tracks; 12 minutes spent scrolling.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-red-900/30 flex items-center justify-between text-[11px] text-[#A0888C]">
            <span>Result: Contradictions & Churn</span>
            <span className="text-red-400 font-mono">92% abandon in 90 days</span>
          </div>
        </div>

        {/* Right: The VedaVerse Coherence */}
        <div
          className={`rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden ${
            highlightMode === "chaos"
              ? "opacity-30 blur-[1px] bg-[#121620]"
              : "bg-[#121A22] border-[#2EC4B6]/40 shadow-xl shadow-[#2EC4B6]/5"
          }`}
        >
          <div className="flex items-center justify-between mb-4 border-b border-[#2EC4B6]/30 pb-3">
            <div className="flex items-center gap-2 text-[#2EC4B6]">
              <CheckCircle2 className="w-4 h-4" />
              <h4 className="text-sm font-semibold tracking-wide uppercase font-mono">
                The VedaVerse Way
              </h4>
            </div>
            <span className="text-[11px] font-mono text-[#2EC4B6] bg-[#2EC4B6]/15 px-2 py-0.5 rounded border border-[#2EC4B6]/30">
              1 Unified Profile
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Coherent Module 1 */}
            <div className="p-2.5 rounded-lg bg-[#17222C] border border-[#2EC4B6]/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#2EC4B6]/20 flex items-center justify-center text-[#2EC4B6] shrink-0 text-xs font-bold">
                🕉️
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between text-[#F5F1E8] font-medium">
                  <span>Ayurvedic Dinacharya</span>
                  <span className="text-[10px] text-[#2EC4B6]">Vaidya Verified</span>
                </div>
                <p className="text-[11px] text-[#8C9BAE] mt-0.5">
                  Warming teas + grounding oils matched precisely to your Vata constitution.
                </p>
              </div>
            </div>

            {/* Coherent Module 2 */}
            <div className="p-2.5 rounded-lg bg-[#17222C] border border-[#2EC4B6]/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#FF9F1C]/20 flex items-center justify-center text-[#FF9F1C] shrink-0 text-xs font-bold">
                🧘
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between text-[#F5F1E8] font-medium">
                  <span>Biomechanical Yoga</span>
                  <span className="text-[10px] text-[#FF9F1C]">Safety Guarded</span>
                </div>
                <p className="text-[11px] text-[#8C9BAE] mt-0.5">
                  3D anatomical cues, spine decompression, pelvic stabilizing sequencing.
                </p>
              </div>
            </div>

            {/* Coherent Module 3 */}
            <div className="p-2.5 rounded-lg bg-[#17222C] border border-[#2EC4B6]/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 text-xs font-bold">
                ⏱️
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between text-[#F5F1E8] font-medium">
                  <span>60-Second Ritual Flow</span>
                  <span className="text-[10px] text-[#D4AF37]">Zero Scrolling</span>
                </div>
                <p className="text-[11px] text-[#8C9BAE] mt-0.5">
                  One question: "How do you feel?" → Instant clinical session delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2EC4B6]/30 flex items-center justify-between text-[11px] text-[#8C9BAE]">
            <span className="flex items-center gap-1 text-[#2EC4B6]">
              <Sparkles className="w-3 h-3" />
              Unified Data & Philosophy
            </span>
            <span className="text-[#2EC4B6] font-mono">Habit compounding daily</span>
          </div>
        </div>
      </div>

      {/* Bottom Macro Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        <div className="bg-[#121620] border border-[#242D3D] p-2.5 rounded-xl text-center">
          <span className="block text-[10px] text-[#8C9BAE] uppercase font-mono">Wellness Economy</span>
          <span className="text-base font-mono font-bold text-[#FF9F1C]">$6.3T+</span>
        </div>
        <div className="bg-[#121620] border border-[#242D3D] p-2.5 rounded-xl text-center">
          <span className="block text-[10px] text-[#8C9BAE] uppercase font-mono">App Growth YoY</span>
          <span className="text-base font-mono font-bold text-[#2EC4B6]">+35%</span>
        </div>
        <div className="bg-[#121620] border border-[#242D3D] p-2.5 rounded-xl text-center">
          <span className="block text-[10px] text-[#8C9BAE] uppercase font-mono">Apps Juggled</span>
          <span className="text-base font-mono font-bold text-red-400">3–5 Apps</span>
        </div>
        <div className="bg-[#121620] border border-[#242D3D] p-2.5 rounded-xl text-center">
          <span className="block text-[10px] text-[#8C9BAE] uppercase font-mono">VedaVerse Fix</span>
          <span className="text-base font-mono font-bold text-[#D4AF37]">1 Ecosystem</span>
        </div>
      </div>
    </div>
  );
};
