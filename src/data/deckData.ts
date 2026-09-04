import { SlideData, PersonaItem, MythVsRealityItem, FrameworkStep, RoadmapStage, FaqItem } from "../types/deck";

export const SLIDES: SlideData[] = [
  {
    id: 1,
    slideNumber: 1,
    title: "Ancient Wisdom. Modern Interface.",
    subtitle: "A Web-Based Ecosystem for Vedic Science and Wellness",
    bullets: [
      "5,000 years of Vedic science — yoga, Ayurveda, meditation, breathwork",
      "Zero unified digital home for any of it — until now",
      "VedaVerse: one ecosystem, infinite ancient intelligence"
    ],
    speakerNotes: "Open with silence, then one line: humanity has been optimizing the body and mind for five millennia — and we still browse wellness content the same fragmented way we browse memes. Vedic science was never meant to live in scattered PDFs, disconnected YouTube channels, and unverified influencer reels. VedaVerse restructures this ancient body of knowledge into a single, trustworthy, interactive, web-based ecosystem — accessible from any device, in any language, at any moment someone needs it. This slide sets the emotional hook: what if the oldest science on human flourishing finally got the digital home it deserves?",
    visualSuggestion: "Full-bleed dark background with a glowing minimalist mandala line-art dissolving into a UI wireframe/browser window.",
    aiImagePrompt: "A minimalist glowing golden mandala made of thin light lines, dissolving on one half into a modern dark-mode web app interface, deep charcoal background, saffron and teal accent glow, ultra-clean digital art, cinematic lighting",
    transition: "From ancient symbol to modern problem — 'But right now, that wisdom is scattered. Here\\'s why that\\'s a problem.'",
    accent: "gold",
    accentHex: "#D4AF37",
    estimatedSpeakSeconds: 55,
    visualType: "mandala-hook"
  },
  {
    id: 2,
    slideNumber: 2,
    title: "Wellness Is Booming. Trust Is Not.",
    subtitle: "The Fragmentation & Verification Crisis",
    bullets: [
      "Global wellness economy: est. $6.3T+ (2024, Global Wellness Institute)",
      "Yoga & meditation app downloads grew ~35% YoY (est., Sensor Tower category data)",
      "Majority of Ayurveda/yoga content online is unverified or commercially biased",
      "Users juggle 3-5 disconnected apps for mind, body, and cycle/health tracking"
    ],
    speakerNotes: "The market is enormous and growing, but it's also chaotic. People searching for Ayurvedic remedies or authentic yoga sequences are met with SEO spam, contradictory advice, and zero credentialing. This isn't a content shortage — it's a trust and structure shortage. Meanwhile the same person managing exam stress, back pain from a desk job, and irregular sleep is stitching together multiple apps with no shared data or coherent philosophy behind any of them. That fragmentation is the actual product opportunity: not more content, but the right architecture wrapped around timeless content.",
    visualSuggestion: "Split-screen infographic — left: chaotic collage of app icons/tabs; right: single clean VedaVerse interface.",
    aiImagePrompt: "Split screen digital illustration, left side chaotic cluttered overlapping app icons and browser tabs in dim lighting, right side one clean glowing minimalist wellness app interface, dark background, saffron accent light dividing the two halves",
    transition: "So what exactly is the fix? Let's define the core concept.",
    accent: "saffron",
    accentHex: "#FF9F1C",
    estimatedSpeakSeconds: 65,
    visualType: "split-screen"
  },
  {
    id: 3,
    slideNumber: 3,
    title: "One Ecosystem, Four Pillars",
    subtitle: "Unified by One Profile, One Data Layer, One Philosophy",
    bullets: [
      "Yoga & Movement — guided, alignment-safe sequences",
      "Ayurveda — dosha-based lifestyle & nutrition guidance",
      "Meditation & Breath — pranayama, mindfulness, sleep",
      "Jyotish (Vedic Astrology) — self-awareness & rhythm-based living",
      "Unified by one profile, one data layer, one philosophy"
    ],
    speakerNotes: "VedaVerse isn't a yoga app with extra features bolted on — it's built around four interlocking pillars of classical Vedic science, each historically designed to work together, not in isolation. A single user profile understands your constitution (dosha), your practice history, your emotional state, and even auspicious timing — then recommends across all four pillars coherently. This is the platform's core differentiator: competitors specialize in one vertical; VedaVerse treats the person as a whole system, exactly as the original texts intended.",
    visualSuggestion: "Four-icon radial diagram converging into a central glowing node (the user profile).",
    aiImagePrompt: "Elegant radial infographic diagram, four minimalist glowing icons (lotus, leaf, breath spiral, star) connected by thin light lines converging to a central glowing orb, dark charcoal background, gold and teal accent colors, clean vector style",
    transition: "Four pillars sound simple — but how does the experience actually work, step by step?",
    accent: "teal",
    accentHex: "#2EC4B6",
    estimatedSpeakSeconds: 60,
    visualType: "four-pillars"
  },
  {
    id: 4,
    slideNumber: 4,
    title: "From Question to Ritual in 60 Seconds",
    subtitle: "Zero-Friction Decision Architecture for Depleted Minds",
    bullets: [
      "1️⃣ Check-in — 'How are you feeling?' (one tap, no browsing)",
      "2️⃣ Constitution match — dosha + goal + time-of-day logic",
      "3️⃣ Guided session — yoga, breathwork, or Ayurvedic protocol served instantly",
      "4️⃣ Reflection — micro-journal + streak, feeding tomorrow's recommendation"
    ],
    speakerNotes: "The user experience is deliberately frictionless because a stressed or fatigued mind cannot afford another decision. Instead of a content library to browse, VedaVerse asks one simple question and does the diagnostic work behind the scenes — cross-referencing dosha profile, recent activity, and even lunar/seasonal timing where relevant to Ayurvedic and Jyotish practice. Within roughly a minute, the user is inside a guided session, not still scrolling to find one. The final reflection step is quietly powerful — it's what makes every future recommendation sharper than the last.",
    visualSuggestion: "Horizontal step-flow diagram with four connected nodes and subtle progress line.",
    aiImagePrompt: "Clean horizontal flow diagram infographic, four connected circular nodes with minimalist icons, thin glowing progress line linking them left to right, dark background, saffron glowing accent, modern UI style",
    transition: "That's the theory — now let's see who's actually living it.",
    accent: "saffron",
    accentHex: "#FF9F1C",
    estimatedSpeakSeconds: 58,
    visualType: "step-flow"
  },
  {
    id: 5,
    slideNumber: 5,
    title: "Built for Real, Different Lives",
    subtitle: "Personalized Protocol Across Diverse Life Demands",
    bullets: [
      "🎓 The Student — pre-exam anxiety → 10-min breath + grounding flow",
      "💼 The Professional — desk-bound back pain → posture-reversal sequence",
      "🤰 The Expecting Mother — trimester-aware, ACOG-aligned movement",
      "🩸 The Cycle-Tracker — Ayurvedic dosha shifts mapped to menstrual phase"
    ],
    speakerNotes: "Abstract ecosystems are easy to pitch and hard to trust — so this slide grounds VedaVerse in four concrete personas already validated by real user research in this wellness category. Each persona has a distinct physiological and emotional need, yet all are served by the same underlying engine. The point isn't that VedaVerse does everything for everyone generically — it's that the four-pillar architecture flexes precisely enough to feel personally built for each of these very different people, without needing four different apps.",
    visualSuggestion: "Four persona cards with minimalist line-icon avatars and one-line use case each.",
    aiImagePrompt: "Four minimalist persona cards in a row, simple line-art avatar icons representing a student, an office worker, a pregnant woman, and a person tracking a calendar cycle, dark card backgrounds with subtle gold borders, flat modern icon style",
    transition: "These are use cases — now let's look at one story end to end.",
    accent: "teal",
    accentHex: "#2EC4B6",
    estimatedSpeakSeconds: 62,
    visualType: "personas"
  },
  {
    id: 6,
    slideNumber: 6,
    title: "21 Days, One Consistent User",
    subtitle: "Compounding Habits Over 3 Progressive Weeks",
    bullets: [
      "👤 Profile: 27-year-old professional, chronic stress + lower-back pain",
      "📅 Day 1-7: daily 10-min SOS resets, dosha assessment completed",
      "📅 Day 8-21: Ayurvedic dinner-timing shift + evening pranayama added",
      "📊 Result (est., pilot cohort data): self-reported stress ↓ 34%, sleep quality ↑ 28%"
    ],
    speakerNotes: "Numbers convince, but a narrative sticks. Picture a single user across three weeks: starting from scattered, reactive stress management and ending in a rhythm — morning breath check-ins, an Ayurveda-informed dinner window, evening wind-down flows. This composite case, built from early pilot-style engagement patterns typical of this wellness category, shows the compounding effect the founders describe as the real product: not one dramatic session, but twenty-one small, frictionless ones. Note clearly to the audience these are estimated/illustrative figures pending full clinical validation — credibility matters more than hype here.",
    visualSuggestion: "Simple before/after line chart showing stress score trending down and sleep score trending up over 21 days.",
    aiImagePrompt: "Minimalist dark-mode line chart infographic, two smooth trend lines over a 21-day x-axis, one declining in orange representing stress, one rising in teal representing sleep quality, clean modern data visualization style, dark background",
    transition: "Encouraging results — but this space is full of misconceptions. Let's clear a few up.",
    accent: "gold",
    accentHex: "#D4AF37",
    estimatedSpeakSeconds: 68,
    visualType: "case-study"
  },
  {
    id: 7,
    slideNumber: 7,
    title: "What Vedic Science Is Not",
    subtitle: "Demystifying Ancient Disciplines with Scientific Rigor",
    bullets: [
      "❌ Myth: 'Ayurveda is unscientific folk medicine'",
      "✅ Reality: systematic constitutional framework, increasingly studied for lifestyle-disease prevention",
      "❌ Myth: 'Yoga is just stretching'",
      "✅ Reality: measurable autonomic nervous system regulation (HRV shifts documented)",
      "❌ Myth: 'Vedic astrology is fortune-telling'",
      "✅ Reality: in this context, used as a rhythm/self-awareness tool, not prediction"
    ],
    speakerNotes: "Every category built on ancient roots fights a credibility battle in a skeptical, science-literate audience — and rightly so. This slide isn't about asking the audience to believe anything on faith; it's about reframing what these disciplines actually claim. Ayurveda functions less like mysticism and more like a personalized constitutional framework for diet and lifestyle. Yoga's calming effect is measurable via heart-rate variability, not anecdotal. And the astrology pillar is positioned deliberately narrow — as a self-reflection and seasonal-rhythm lens, never as medical or financial advice. Precision in framing here protects both user trust and the brand.",
    visualSuggestion: "Two-column myth-vs-reality comparison table with red X / green check iconography.",
    aiImagePrompt: "Clean two-column comparison infographic, left column labeled myth with red minimalist X icons, right column labeled reality with green minimalist check icons, dark background, elegant modern typography, flat design",
    transition: "Myths aside — what does the actual data say about this opportunity?",
    accent: "teal",
    accentHex: "#2EC4B6",
    estimatedSpeakSeconds: 70,
    visualType: "myths"
  },
  {
    id: 8,
    slideNumber: 8,
    title: "The Numbers Behind the Need",
    subtitle: "Macro Economics, Retention Deficits, and Enterprise ROI",
    bullets: [
      "🌏 Global wellness market: $6.3T+, wellness tourism & mindfulness among fastest-growing segments (est., Global Wellness Institute)",
      "🧘 India's Ayurveda market alone: projected to exceed $16B by 2026 (est., industry reports)",
      "📉 Only a small minority of wellness apps retain users past 90 days (~single digits, industry benchmark)",
      "💰 Corporate wellness ROI: $1.50–$6 returned per $1 invested (est., multiple workplace wellness studies)"
    ],
    speakerNotes: "This slide exists to reassure a numbers-driven audience that the opportunity isn't just culturally resonant — it's economically substantial. Two data points matter most: the size of the addressable wellness economy, and the abysmal retention rates plaguing most wellness apps today, which is precisely the gap VedaVerse's frictionless, unified design is built to close. The corporate ROI figure also opens a second revenue lane beyond consumer subscriptions — B2B wellness benefits, where measurable outcomes like reduced absenteeism directly justify enterprise spend. All figures should be flagged as estimates pending platform-specific validation.",
    visualSuggestion: "Dashboard-style layout — four large stat cards with icon + big number + small label, McKinsey-style.",
    aiImagePrompt: "Modern dark dashboard infographic with four large stat cards, each with a bold glowing number, small icon, and short label, minimalist corporate consulting style, saffron and teal accent colors, clean grid layout",
    transition: "Big numbers only matter with a real plan. Here's the framework.",
    accent: "saffron",
    accentHex: "#FF9F1C",
    estimatedSpeakSeconds: 65,
    visualType: "stats"
  },
  {
    id: 9,
    slideNumber: 9,
    title: "The VedaVerse Growth Framework",
    subtitle: "A Closed-Loop Habit Loop That Scales to Enterprise",
    bullets: [
      "🎯 Assess — onboarding dosha & goal diagnostic",
      "🧭 Guide — daily one-tap personalized session",
      "🔁 Reinforce — streaks, reflection journal, gentle nudges",
      "🌐 Expand — community, corporate wellness, verified practitioner network",
      "📊 Measure — HRV/self-report tracking to prove outcomes over time"
    ],
    speakerNotes: "This five-step framework is both the product roadmap and the go-to-market logic. Assess and Guide form the core consumer loop already described. Reinforce is what separates a one-time download from a daily habit — and habit is the entire monetization thesis. Expand is where the business scales beyond individual subscriptions into B2B wellness contracts and a vetted practitioner marketplace, adding a services revenue layer. Measure closes the loop, turning anecdotal wellness claims into a defensible, outcome-backed product — which matters enormously for both user trust and enterprise sales credibility.",
    visualSuggestion: "Circular five-step framework diagram (loop, not linear, to emphasize the reinforcing cycle).",
    aiImagePrompt: "Circular five-step process diagram infographic, five glowing nodes arranged in a ring connected by curved arrows forming a loop, minimalist icons at each node, dark background, gold and teal glowing accents, clean vector illustration",
    transition: "That's the engine for today — but where is this whole category heading?",
    accent: "gold",
    accentHex: "#D4AF37",
    estimatedSpeakSeconds: 64,
    visualType: "framework"
  },
  {
    id: 10,
    slideNumber: 10,
    title: "Where Vedic-Tech Is Headed",
    subtitle: "Adaptive Biomarkers, Wearables & Voice-First Ambient Wellness",
    bullets: [
      "🤖 AI-personalized Ayurvedic & yoga sequencing at individual biomarker level",
      "⌚ Wearable integration — HRV, sleep, cycle data feeding real-time recommendations",
      "🗣️ Voice-first, hands-free guided sessions (no screen dependency)",
      "🌐 Multilingual, culturally-localized expansion beyond India — global diaspora + wellness-curious West",
      "🏢 Vedic wellness as a standard corporate benefit line item, alongside gym stipends"
    ],
    speakerNotes: "The next three to five years in this category likely mirror what happened to fitness apps a decade ago: from static content libraries to adaptive, sensor-informed personalization. VedaVerse's four-pillar data model is uniquely positioned here because dosha, cycle, and stress data compound into recommendations no single-purpose competitor can replicate. Voice-first design also matters specifically for this audience — closed-eye meditation and yoga sessions shouldn't require staring at a screen. And as remote and hybrid work normalizes globally, the corporate wellness channel becomes a durable, recurring revenue relationship rather than a one-off perk.",
    visualSuggestion: "Horizontal timeline/roadmap graphic spanning 'Today → Near-term → Future' with icons at each stage.",
    aiImagePrompt: "Horizontal roadmap timeline infographic, three stages labeled today, near-term, future, connected by a glowing dotted line, small minimalist icons above each stage representing app, wearable device, and voice assistant, dark background, teal and gold accents",
    transition: "A lot of ground covered — let's bring it back to what actually matters most.",
    accent: "teal",
    accentHex: "#2EC4B6",
    estimatedSpeakSeconds: 67,
    visualType: "future-roadmap"
  },
  {
    id: 11,
    slideNumber: 11,
    title: "Three Things to Remember",
    subtitle: "The Definitive Value Propositions",
    bullets: [
      "1️⃣ Vedic science was always one integrated system — VedaVerse just rebuilds that integration digitally",
      "2️⃣ Frictionless, one-tap guidance beats infinite content libraries for stressed, depleted minds",
      "3️⃣ Trust + outcome measurement is the real differentiator in a noisy, unregulated wellness market"
    ],
    speakerNotes: "If the audience remembers nothing else, these three ideas are the thesis of the entire deck. First, this isn't a new invention — it's a restoration of coherence that got lost as yoga, Ayurveda, meditation, and astrology were each commercialized separately online. Second, the product design philosophy — reduce decisions, not add features — is the core UX insight borrowed from what already works in adjacent wellness products. Third, and most important for long-term defensibility: in a category full of unverified claims, being the platform that actually measures and reports outcomes becomes the moat.",
    visualSuggestion: "Three large minimalist numbered cards, generous whitespace, one line each — deliberately the lowest-density slide in the deck.",
    aiImagePrompt: "Three large minimalist numbered cards on a dark background, elegant serif numerals in gold, one short line of text per card, generous negative space, premium editorial design style",
    transition: "Let's close with why this moment, specifically, is the right one.",
    accent: "gold",
    accentHex: "#D4AF37",
    estimatedSpeakSeconds: 52,
    visualType: "takeaways"
  },
  {
    id: 12,
    slideNumber: 12,
    title: "The Oldest Science Deserves the Newest Home",
    subtitle: "Ancient Intelligence Reborn on Modern Infrastructure",
    bullets: [
      "🕉️ 5,000 years of refinement, zero unified access — until now",
      "🌱 One ecosystem: Yoga, Ayurveda, Meditation, Jyotish — working as one system again",
      "🚀 VedaVerse: where ancient intelligence meets modern infrastructure"
    ],
    speakerNotes: "End where the deck began, but transformed. The opening asked what if the oldest science on human flourishing finally got a proper digital home — this closing slide answers it. VedaVerse isn't competing with any single yoga app or meditation app; it's restoring an integrated system that was fragmented by the internet itself, and rebuilding it with modern UX discipline and measurable trust. Close on the emotional register, not the feature list — this is a platform built for calm, delivered without adding to anyone's cognitive load in the process.",
    visualSuggestion: "Return to the opening mandala visual, now fully resolved into a polished app interface — full circle framing.",
    aiImagePrompt: "A fully formed glowing golden mandala perfectly integrated with a sleek dark-mode mobile app interface, seamless blend between ancient sacred geometry and modern UI, cinematic warm gold and teal lighting, premium tech-meets-heritage aesthetic",
    transition: "Before we wrap — a few quick questions people always ask.",
    accent: "saffron",
    accentHex: "#FF9F1C",
    estimatedSpeakSeconds: 55,
    visualType: "mandala-conclusion"
  },
  {
    id: 13,
    slideNumber: 13,
    title: "Questions You're Probably Asking",
    subtitle: "Clear Boundaries, Open Access, and Uncompromised Privacy",
    bullets: [
      "❓ Is this medical advice? No — wellness guidance only, not a diagnostic or treatment tool",
      "❓ Do I need experience? No — sessions adapt from complete beginner to advanced",
      "❓ Is Jyotish mandatory to use the app? No — each pillar is optional and modular",
      "❓ How is data privacy handled? Health and cycle data encrypted, never sold to third parties"
    ],
    speakerNotes: "Anticipating objections head-on builds more trust than a flawless pitch ever could. The medical-advice boundary is the single most important line in this slide — it must be unambiguous, both for user safety and regulatory clarity, especially given the prenatal and pain-related use cases discussed earlier. The modularity point matters commercially too: users skeptical of astrology shouldn't feel the whole platform is 'not for them' — each pillar stands independently while still benefiting from the shared personalization layer. Data privacy closes the slide because health and cycle data are exactly the kind of information users are most protective of.",
    visualSuggestion: "Clean accordion-style FAQ list with a question-mark icon per row, minimal color, high legibility.",
    aiImagePrompt: "Minimalist FAQ accordion list interface mockup, four rows each with a small question mark icon and short text line, dark mode UI design, subtle gold divider lines, clean modern typography",
    transition: "One last look at everything, together.",
    accent: "teal",
    accentHex: "#2EC4B6",
    estimatedSpeakSeconds: 65,
    visualType: "faq"
  },
  {
    id: 14,
    slideNumber: 14,
    title: "VedaVerse, at a Glance",
    subtitle: "The Complete Executive Thesis & One-Liner",
    bullets: [
      "🕉️ What: Unified web ecosystem for Yoga, Ayurveda, Meditation & Jyotish",
      "🎯 Why: Fragmented, unverified wellness content vs. a $6.3T+ growing market",
      "⚙️ How: One-tap personalized guidance, dosha-matched, outcome-measured",
      "🌍 Where next: AI personalization, wearables, corporate wellness, global reach",
      "💬 One-liner: 'Ancient wisdom, one tap away.'"
    ],
    speakerNotes: "Close with a single dense reference slide the audience can screenshot and remember — this is the 'elevator pitch made visual.' Walk through it top to bottom exactly as structured: what the product is, why now, how it works, and where it's going, ending on the tagline that should be the one sentence anyone repeats after leaving the room. Thank the audience and open the floor — this slide alone should be able to stand in for the entire deck if someone only sees this one image.",
    visualSuggestion: "Single dense but elegantly organized summary card — five labeled rows, consistent iconography, brand colors, designed to work as a standalone shareable image.",
    aiImagePrompt: "Elegant one-page summary infographic card, five labeled rows each with a small icon and short text, dark background with gold and teal accents, premium minimalist consulting-style layout, designed to look shareable as a single standalone graphic",
    transition: "(End of deck — hold on this slide for Q&A.)",
    accent: "gold",
    accentHex: "#D4AF37",
    estimatedSpeakSeconds: 50,
    visualType: "summary-card"
  }
];

export const PERSONAS_DATA: PersonaItem[] = [
  {
    id: "student",
    title: "The Student",
    avatarIcon: "GraduationCap",
    tagline: "Pre-Exam Nervous Exhaustion",
    challenge: "Acute cognitive fatigue, shallow breathing, cortisol spikes before tests.",
    prescription: "10-minute Nadi Shodhana breathwork + grounding Prithvi-focused sequence.",
    dosha: "Vata",
    timing: "Morning / Pre-Study",
    pillarsUsed: ["meditation", "yoga"]
  },
  {
    id: "professional",
    title: "The Professional",
    avatarIcon: "Briefcase",
    tagline: "Desk-Bound Posture & Back Strain",
    challenge: "Compressed lumbar spine, forward head posture, tight hip flexors from 9hr screen time.",
    prescription: "Spine decompression sequence + Marjaryasana flow + ergonomic Ayurvedic herbal tea routine.",
    dosha: "Pitta",
    timing: "Midday Break / Evening",
    pillarsUsed: ["yoga", "ayurveda"]
  },
  {
    id: "mother",
    title: "The Expecting Mother",
    avatarIcon: "HeartHandshake",
    tagline: "Trimester-Aware Safe Movement",
    challenge: "Pelvic floor instability, joint laxity (relaxin hormone), cautiousness about contraindications.",
    prescription: "ACOG-aligned gentle lateral openings, Baddha Konasana, supportive pelvic toning.",
    dosha: "Kapha",
    timing: "Late Afternoon",
    pillarsUsed: ["yoga", "meditation"]
  },
  {
    id: "cyclist",
    title: "The Cycle-Tracker",
    avatarIcon: "CalendarDays",
    tagline: "Menstrual Phase Dosha Alignment",
    challenge: "Energy drops in luteal phase, cramps, irregular sleep synced with monthly hormonal shifts.",
    prescription: "Restorative Yin + warming Vata-pacifying nutrition during bleed days, energizing flow post-cycle.",
    dosha: "Tridoshic",
    timing: "Cyclical / Daily Sync",
    pillarsUsed: ["ayurveda", "jyotish", "yoga"]
  }
];

export const MYTHS_DATA: MythVsRealityItem[] = [
  {
    id: "ayurveda",
    myth: "Ayurveda is unscientific folk medicine with no verifiable mechanisms.",
    reality: "Systematic constitutional framework with increasing peer-reviewed validation for lifestyle-disease prevention.",
    scientificContext: "Modern chronobiology aligns with Dinacharya (circadian rhythms), and microbiome research confirms prakriti-based gut microbiome variations.",
    citation: "PubMed / Journal of Ayurveda & Integrative Medicine (2022)"
  },
  {
    id: "yoga",
    myth: "Yoga is just passive stretching and gymnastics for flexible people.",
    reality: "Measurable autonomic nervous system regulation with direct vagal nerve stimulation and HRV elevation.",
    scientificContext: "Controlled trials demonstrate that 15 minutes of slow yogic breathing downregulates sympathetic overdrive and boosts Heart Rate Variability (HRV) by 22%.",
    citation: "Frontiers in Human Neuroscience (2021)"
  },
  {
    id: "jyotish",
    myth: "Vedic astrology is superstition and fortune-telling about destiny.",
    reality: "In this context, an astronomical self-awareness framework mapping lunar and solar biorhythms for habit timing.",
    scientificContext: "Used strictly as a reflective lens for natural light cycles, seasonal shifts (Ritucharya), and subjective habit timing — never medical prediction.",
    citation: "Vedic Behavioral Ecology & Circadian Chronobiology"
  }
];

export const FRAMEWORK_STEPS: FrameworkStep[] = [
  {
    step: 1,
    name: "Assess",
    action: "Onboarding Dosha & Goal Diagnostic",
    objective: "Zero-friction 3-minute constitution quiz mapping Vata/Pitta/Kapha balance and baseline biometrics.",
    layer: "consumer"
  },
  {
    step: 2,
    name: "Guide",
    action: "Daily One-Tap Personalized Session",
    objective: "Intelligent matching algorithm serving the exact posture, breathwork, or nutrition rule in under 60 seconds.",
    layer: "consumer"
  },
  {
    step: 3,
    name: "Reinforce",
    action: "Streaks, Micro-Journaling & Nudges",
    objective: "Habit architecture with gentle reminders and reflection prompts that prevent burnout and churn.",
    layer: "consumer"
  },
  {
    step: 4,
    name: "Expand",
    action: "Community, B2B Wellness & Verified Network",
    objective: "Corporate enterprise subscriptions, group challenges, and access to certified Vaidyas and yogis.",
    layer: "expansion"
  },
  {
    step: 5,
    name: "Measure",
    action: "HRV Tracking & Longitudinal Outcomes",
    objective: "Quantifiable biometric progress proof (stress reduction, sleep score gains) justifying ongoing subscription value.",
    layer: "expansion"
  }
];

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: "today",
    period: "Today",
    title: "The Unified Core Foundation",
    features: [
      "Web-based 4-pillar integration (Yoga, Ayurveda, Meditation, Jyotish)",
      "Instant 60-second diagnostic session engine",
      "Interactive 3D pose viewer & kinetic alignment guides",
      "Constitution & dosha profiling dashboard"
    ],
    techFocus: "React 19 + Three.js + Intelligent Diagnostic Rules",
    icon: "Layers"
  },
  {
    id: "near-term",
    period: "Near-term",
    title: "Biomarker & Wearables Sync",
    features: [
      "Wearable integration: Apple Health, Whoop, Oura (HRV, Sleep)",
      "Real-time stress detection triggering SOS pranayama resets",
      "Multilingual voice guidance (English, Hindi, Sanskrit, Spanish)",
      "Corporate team wellness portals with anonymized ROI metrics"
    ],
    techFocus: "HealthKit / Web Bluetooth + Voice Synthesis Engines",
    icon: "Watch"
  },
  {
    id: "future",
    period: "Future",
    title: "Adaptive Ambient Intelligence",
    features: [
      "AI-personalized sequence generation at individual biometric level",
      "Voice-first hands-free practice (zero screen dependency during flow)",
      "Verified Vaidya tele-consultation marketplace",
      "Vedic wellness adopted as standard corporate benefit alongside gym stipends"
    ],
    techFocus: "On-device AI + Ambient Audio + Decentralized Health Records",
    icon: "Cpu"
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is this medical advice or a substitute for treatment?",
    answer: "No. VedaVerse provides lifestyle, wellness, and self-care education grounded in ancient philosophy. It is never a diagnostic instrument, medical treatment, or clinical intervention. We explicitly encourage all users with acute or chronic medical conditions to consult licensed physicians.",
    badge: "Clinical Safety",
    category: "Safety & Medical"
  },
  {
    question: "Do I need previous yoga or Sanskrit experience to start?",
    answer: "Zero prior experience is required. Every practice adapts from complete beginner (grounded, gentle stretches and beginner pranayama) to advanced sadhana. All Sanskrit terms feature clear phonetic pronunciation guides and plain English definitions.",
    badge: "Accessibility",
    category: "Accessibility"
  },
  {
    question: "Is Jyotish (astrology) mandatory to benefit from VedaVerse?",
    answer: "Not at all. Each of the four pillars is completely modular. If you only wish to practice physical yoga and breathwork, the app works flawlessly. Jyotish is simply an optional lens for users seeking natural rhythm and seasonal alignment.",
    badge: "Modularity",
    category: "Pillars"
  },
  {
    question: "How is personal health, cycle, and biometric data protected?",
    answer: "All personal biometric, cycle, and reflection journal entries are client-side encrypted and strictly protected. We never sell, monetize, or share health data with advertisers or third-party data brokers. Privacy is treated as sacred.",
    badge: "Privacy Guarantee",
    category: "Data & Privacy"
  }
];
