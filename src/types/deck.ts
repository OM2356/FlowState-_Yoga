export type AccentColor = "saffron" | "teal" | "gold" | "slate";

export interface StatItem {
  value: string;
  label: string;
  subtext?: string;
  source?: string;
}

export interface PersonaItem {
  id: string;
  title: string;
  avatarIcon: string;
  tagline: string;
  challenge: string;
  prescription: string;
  dosha: "Vata" | "Pitta" | "Kapha" | "Tridoshic";
  timing: string;
  pillarsUsed: ("yoga" | "ayurveda" | "meditation" | "jyotish")[];
}

export interface MythVsRealityItem {
  id: string;
  myth: string;
  reality: string;
  scientificContext: string;
  citation: string;
}

export interface FrameworkStep {
  step: number;
  name: string;
  action: string;
  objective: string;
  layer: "consumer" | "expansion";
}

export interface RoadmapStage {
  id: string;
  period: "Today" | "Near-term" | "Future";
  title: string;
  features: string[];
  techFocus: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  badge: string;
  category: "Safety & Medical" | "Accessibility" | "Pillars" | "Data & Privacy";
}

export interface SlideData {
  id: number;
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  speakerNotes: string;
  visualSuggestion: string;
  aiImagePrompt: string;
  transition: string;
  accent: AccentColor;
  accentHex: string;
  estimatedSpeakSeconds: number;
  visualType: 
    | "mandala-hook"
    | "split-screen"
    | "four-pillars"
    | "step-flow"
    | "personas"
    | "case-study"
    | "myths"
    | "stats"
    | "framework"
    | "future-roadmap"
    | "takeaways"
    | "mandala-conclusion"
    | "faq"
    | "summary-card";
}
