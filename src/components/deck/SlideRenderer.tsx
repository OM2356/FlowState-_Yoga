import React from "react";
import { SlideData } from "../../types/deck";
import { MandalaDissolveVisual } from "./visuals/MandalaDissolveVisual";
import { SplitScreenChaosVisual } from "./visuals/SplitScreenChaosVisual";
import { FourPillarsRadialVisual } from "./visuals/FourPillarsRadialVisual";
import { StepByStepFlowVisual } from "./visuals/StepByStepFlowVisual";
import { PersonasShowcaseVisual } from "./visuals/PersonasShowcaseVisual";
import { CaseStudyTimelineVisual } from "./visuals/CaseStudyTimelineVisual";
import { MythsVsRealityVisual } from "./visuals/MythsVsRealityVisual";
import { StatsDashboardVisual } from "./visuals/StatsDashboardVisual";
import { GrowthFrameworkVisual } from "./visuals/GrowthFrameworkVisual";
import { FutureRoadmapVisual } from "./visuals/FutureRoadmapVisual";
import { KeyTakeawaysVisual } from "./visuals/KeyTakeawaysVisual";
import { FaqAccordionVisual } from "./visuals/FaqAccordionVisual";
import { FinalSummaryCardVisual } from "./visuals/FinalSummaryCardVisual";
import { Sparkles, Compass } from "lucide-react";

interface SlideRendererProps {
  slide: SlideData;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide }) => {
  const renderVisual = () => {
    switch (slide.visualType) {
      case "mandala-hook":
        return <MandalaDissolveVisual isClosing={false} />;
      case "split-screen":
        return <SplitScreenChaosVisual />;
      case "four-pillars":
        return <FourPillarsRadialVisual />;
      case "step-flow":
        return <StepByStepFlowVisual />;
      case "personas":
        return <PersonasShowcaseVisual />;
      case "case-study":
        return <CaseStudyTimelineVisual />;
      case "myths":
        return <MythsVsRealityVisual />;
      case "stats":
        return <StatsDashboardVisual />;
      case "framework":
        return <GrowthFrameworkVisual />;
      case "future-roadmap":
        return <FutureRoadmapVisual />;
      case "takeaways":
        return <KeyTakeawaysVisual />;
      case "mandala-conclusion":
        return <MandalaDissolveVisual isClosing={true} />;
      case "faq":
        return <FaqAccordionVisual />;
      case "summary-card":
        return <FinalSummaryCardVisual />;
      default:
        return null;
    }
  };

  // Determine if this slide prefers a full-width centered layout or a split 2-column layout
  const isFullWidthLayout = 
    slide.visualType === "takeaways" || 
    slide.visualType === "summary-card" || 
    slide.visualType === "faq";

  return (
    <div 
      key={slide.id}
      className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8 flex flex-col justify-center min-h-[calc(100vh-130px)] transition-all duration-300"
    >
      {/* Eyebrow & Slide Category */}
      <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#D4AF37]">
        <Compass className="w-3.5 h-3.5 text-[#FF9F1C]" />
        <span className="uppercase tracking-widest font-semibold">
          Slide {slide.slideNumber.toString().padStart(2, "0")} — VedaVerse Ecosystem
        </span>
      </div>

      {isFullWidthLayout ? (
        /* Full-Width Centered Layout for High-Impact Cards / FAQ / Summary */
        <div className="flex flex-col gap-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F5F1E8] font-semibold tracking-tight leading-tight">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-sm sm:text-base text-[#8C9BAE] mt-2 font-sans font-normal">
                {slide.subtitle}
              </p>
            )}
          </div>

          {/* Render Full-Width Visual */}
          <div className="w-full mt-2">
            {renderVisual()}
          </div>
        </div>
      ) : (
        /* Split 2-Column Responsive Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Title & Bullets */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif text-[#F5F1E8] font-semibold tracking-tight leading-[1.15]">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-xs sm:text-sm text-[#D4AF37] font-mono mt-2 tracking-wide font-medium">
                  {slide.subtitle}
                </p>
              )}
            </div>

            {/* Bullets List */}
            <div className="space-y-3 pt-1">
              {slide.bullets.map((bullet, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#121620]/60 border border-[#1E2636] hover:border-[#2E3C56] transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF9F1C] mt-2 shrink-0 shadow-[0_0_6px_#FF9F1C]" />
                  <p className="text-xs sm:text-sm text-[#CAD5E2] font-sans leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>

            {/* Speaker Transition Cue Subtle Indicator */}
            <div className="p-2.5 rounded-xl bg-[#0D121B] border border-[#1C2536] text-[11px] font-mono text-[#8C9BAE]">
              <span className="text-[#2EC4B6] font-semibold">Presenter Hook: </span>
              <span className="italic">"{slide.transition.split("—")[0]}"</span>
            </div>
          </div>

          {/* Right Column: Interactive Visual Component */}
          <div className="lg:col-span-7 w-full flex items-center justify-center">
            {renderVisual()}
          </div>
        </div>
      )}
    </div>
  );
};
