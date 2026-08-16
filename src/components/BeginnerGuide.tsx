import React, { useState } from "react";
import { 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  Wind, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  Layers, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

export const BeginnerGuide: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const goldenRules = [
    {
      title: "1. The 'No Pinching' Rule",
      desc: "Good discomfort feels like a warm, satisfying muscle stretch. Bad pain feels sharp, electrical, pinching, or localized directly inside a joint (knees, wrists, spine). If it pinches, immediately back off.",
      badge: "Safety Essential"
    },
    {
      title: "2. Soft Knees Save Lower Backs",
      desc: "Never lock your knees backward. In forward folds and standing poses, keeping a micro-bend in your knees allows your pelvis to rotate forward naturally and protects your lower lumbar discs.",
      badge: "Spine Protection"
    },
    {
      title: "3. Breathe Exclusively Through Your Nose",
      desc: "Nasal breathing warms, humidifies, and filters the air while signaling your parasympathetic (rest and digest) nervous system to calm muscle guarding and lower heart rate.",
      badge: "Breath Rhythm"
    },
    {
      title: "4. Props Are for Smart Yogis, Not Just Beginners",
      desc: "Yoga blocks, straps, and blankets bring the floor closer to you. Using a block in Triangle Pose or Half Pigeon prevents spinal twisting and allows your muscles to relax into optimal alignment.",
      badge: "Prop Power"
    },
    {
      title: "5. Inhale to Expand, Exhale to Fold",
      desc: "The universal rhythm of yoga: inhale whenever you are lifting your chest, reaching overhead, or opening your heart; exhale whenever you are folding forward, twisting, or releasing downward.",
      badge: "Movement Flow"
    }
  ];

  const propGuides = [
    {
      name: "Yoga Blocks",
      use: "Brings the floor 4 to 9 inches closer to your hands. Perfect for Triangle Pose, Half Moon, or seated under hips in Hero Pose.",
      tip: "Blocks have 3 heights (low, medium, high). Use the highest setting when your hamstrings feel tight."
    },
    {
      name: "Yoga Strap / Belt",
      use: "Extends your arm reach. Use it in Seated Forward Fold (Paschimottanasana) or Reclined Hand-to-Big-Toe pose.",
      tip: "Loop it around the ball of your foot rather than the delicate arch."
    },
    {
      name: "Folded Blanket / Cushion",
      use: "Elevates your sit bones when sitting cross-legged to prevent lower back rounding. Also pads tender knees in Cat-Cow and Lunges.",
      tip: "Sit right on the edge of the folded blanket to tip your pelvis forward naturally."
    },
    {
      name: "Wall Support",
      use: "The ultimate balance stabilizer for Tree Pose, Warrior III, and Legs-Up-The-Wall (Viparita Karani).",
      tip: "Rest your hand on the wall at shoulder height for effortless stability."
    }
  ];

  const faqs = [
    {
      q: "What if I am not flexible at all?",
      a: "You don't need to be flexible to start yoga — just like you don't need to be clean to take a shower! Yoga builds flexibility gradually over time. Stiff bodies actually benefit the most from gentle regular stretching."
    },
    {
      q: "How many times a week should I practice?",
      a: "Consistency beats intensity. Practicing 10 to 15 minutes 4-5 days a week creates far greater mobility, spinal health, and mental calmness than doing a 90-minute session once every two weeks."
    },
    {
      q: "Should I practice yoga before or after eating?",
      a: "It is best to practice on an empty stomach or at least 1.5 to 2 hours after a light meal. Twisting and bending with a full stomach can feel uncomfortable."
    },
    {
      q: "What should I wear?",
      a: "Wear comfortable, stretchy clothes that allow your hips, knees, and shoulders to move freely without binding. Bare feet on a non-slip mat provide the best grip and stability."
    },
    {
      q: "Why do we do Savasana (Corpse Pose) at the end of every flow?",
      a: "Savasana allows your central nervous system to absorb and integrate all the neuromuscular changes from your practice. It drops your cortisol levels and leaves you feeling refreshed rather than drained."
    }
  ];

  return (
    <div id="beginner-guide-section" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4E6548]">
          <BookOpen className="w-4 h-4" />
          <span>Beginner Yoga & Safety Masterclass</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C] mt-2">
          Everything you need to practice yoga safely & comfortably
        </h2>
        <p className="text-sm sm:text-base text-[#556458] mt-2 max-w-3xl leading-relaxed">
          Yoga is for every human body. Review the 5 essential golden rules of safe practice, learn how to use simple props, and master basic breathwork principles.
        </p>
      </div>

      {/* 5 Golden Rules Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-serif font-medium text-[#1E2520] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#4E6548]" />
          <span>The 5 Golden Rules of Safe Yoga</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goldenRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] flex flex-col justify-between hover:border-[#4E6548] transition-all shadow-2xs"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C1664C] bg-[#C1664C]/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  {rule.badge}
                </span>
                <h4 className="text-base font-serif font-medium text-[#1A221C]">
                  {rule.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#4E5E51] mt-2 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Props & Accessories Guide */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
        <h3 className="text-xl font-serif font-medium text-[#1A221C] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#4E6548]" />
          <span>How to Use Everyday Yoga Props</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#5C6D5F]">
          Props adapt the posture to your unique skeletal anatomy rather than forcing your body to fit an arbitrary shape.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {propGuides.map((prop, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C2] flex flex-col justify-between">
              <div>
                <h4 className="font-serif font-medium text-base text-[#1E2520]">{prop.name}</h4>
                <p className="text-xs text-[#4A594D] mt-2 leading-relaxed">{prop.use}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#E2D8C8] text-[11px] font-medium text-[#4E6548]">
                <strong>Pro Tip:</strong> {prop.tip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
        <h3 className="text-xl font-serif font-medium text-[#1A221C] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#4E6548]" />
          <span>Common Beginner Questions & Answers</span>
        </h3>

        <div className="space-y-3 mt-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#FAF8F4] border border-[#DFD6C7] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-medium text-sm sm:text-base text-[#1E2520] flex items-center justify-between gap-3 hover:bg-[#F3EDE2] transition-colors cursor-pointer"
                >
                  <span className="font-serif">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#4E6548] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#7A8A7D] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#4C5B4F] leading-relaxed border-t border-[#EAE2D5] bg-[#FAF8F4]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
