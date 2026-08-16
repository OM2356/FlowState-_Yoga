import { FlowSequence } from "../types";

export const PRESET_FLOWS: FlowSequence[] = [
  {
    id: "desk-worker-reset",
    title: "Desk Worker Spine & Shoulder Reset",
    subtitle: "Reverse hunched screen fatigue, open the anterior chest, and release tight psoas.",
    durationMinutes: 15,
    category: "recovery",
    difficulty: "beginner",
    physicalFocus: ["Spine Extensors", "Chest & Heart", "Hip Flexors", "Cervical Neck"],
    mentalFocus: "Release cognitive stiffness and restore natural breath depth.",
    description: "Tailored specifically to counter 8+ hours of sitting. Decompresses the lumbar vertebrae, frees the upper trapezius, and unglues tight hip flexors.",
    bannerGradient: "from-[#F4EFE6] to-[#E9DFCF]",
    poses: [
      { poseId: "child-pose", durationSeconds: 90, note: "Settle into gentle diaphragmatic breath, letting gravity decompress your lower back." },
      { poseId: "downward-dog", durationSeconds: 60, note: "Pedal out the heels, lengthening the spine from wrists to sitting bones." },
      { poseId: "low-lunge", durationSeconds: 45, side: "right", note: "Melt your left hip flexor forward, opening the deep psoas." },
      { poseId: "low-lunge", durationSeconds: 45, side: "left", note: "Switch sides, lifting your heart and softening the shoulders." },
      { poseId: "cobra-pose", durationSeconds: 40, note: "Engage the middle and upper back to roll shoulders open." },
      { poseId: "bridge-pose", durationSeconds: 60, note: "Fire the glutes to counteract sitting stagnation, opening the front chest." },
      { poseId: "seated-twist", durationSeconds: 45, side: "right", note: "Gently rinse the thoracic spine and stimulate digestion." },
      { poseId: "seated-twist", durationSeconds: 45, side: "left", note: "Equalize rotation across both sides of the ribcage." },
      { poseId: "savasana", durationSeconds: 180, note: "Rest in complete stillness, integrating the spinal decompression." }
    ]
  },
  {
    id: "nervous-system-destress",
    title: "Nervous System Down-Regulation",
    subtitle: "Somatic release to shift from fight-or-flight into grounded parasympathetic calm.",
    durationMinutes: 20,
    category: "destress",
    difficulty: "beginner",
    physicalFocus: ["Lower Back", "Pelvis & Hips", "Diaphragm", "Neck"],
    mentalFocus: "Quiet mental chatter and release accumulated emotional tension.",
    description: "A slow, contemplative ritual designed to lower cortisol and heart rate using extended exhalations and deeply supported restorative postures.",
    bannerGradient: "from-[#EDE8DF] to-[#DFD6C7]",
    poses: [
      { poseId: "child-pose", durationSeconds: 120, note: "Rest forehead firmly on the mat, signaling safety to the autonomic nervous system." },
      { poseId: "butterfly-pose", durationSeconds: 90, note: "Soften the pelvic floor and breathe 4 counts in, 6 counts out." },
      { poseId: "seated-forward-bend", durationSeconds: 90, note: "Drape gently over thighs with soft knees; let the back body expand." },
      { poseId: "pigeon-pose", durationSeconds: 90, side: "right", note: "Notice where you grip unconsciously and exhale into the right hip." },
      { poseId: "pigeon-pose", durationSeconds: 90, side: "left", note: "Surrender tension on the left side with compassionate awareness." },
      { poseId: "bridge-pose", durationSeconds: 60, note: "Gentle heart lift with slow, even breathing." },
      { poseId: "legs-up-the-wall", durationSeconds: 180, note: "Elevate legs to drain circulatory pressure and soothe the brain." },
      { poseId: "savasana", durationSeconds: 240, note: "Complete rest in golden, unhurried stillness." }
    ]
  },
  {
    id: "deep-hip-low-back",
    title: "Deep Hip & Low Back Liberation",
    subtitle: "Targeted myofascial release for the piriformis, glutes, hamstrings, and sacrum.",
    durationMinutes: 25,
    category: "recovery",
    difficulty: "intermediate",
    physicalFocus: ["Gluteal Complex", "Hip Flexors", "Hamstrings", "Lumbar Spine"],
    mentalFocus: "Patience and steady acceptance through deep physical release.",
    description: "Deeply unburdens the lower back by mobilizing the ball-and-socket hip joints, releasing the piriformis, and lengthening the posterior myofascial chain.",
    bannerGradient: "from-[#F2ECE1] to-[#E5DBCB]",
    poses: [
      { poseId: "tadasana", durationSeconds: 45, note: "Root through four corners of feet, establishing pelvic neutrality." },
      { poseId: "downward-dog", durationSeconds: 60, note: "Lengthen the hamstrings and create space in the sacral vertebrae." },
      { poseId: "warrior-2", durationSeconds: 45, side: "right", note: "Open the adductors and build strength in the external hip rotators." },
      { poseId: "triangle-pose", durationSeconds: 45, side: "right", note: "Decompress the lateral waist and elongate the right hamstring." },
      { poseId: "warrior-2", durationSeconds: 45, side: "left", note: "Settle into the left hip crease with open chest." },
      { poseId: "triangle-pose", durationSeconds: 45, side: "left", note: "Create geometric clarity and lateral space on the left side." },
      { poseId: "low-lunge", durationSeconds: 60, side: "right", note: "Sink into the left psoas, reaching tall through the spine." },
      { poseId: "low-lunge", durationSeconds: 60, side: "left", note: "Even out the hip flexor release on the right side." },
      { poseId: "pigeon-pose", durationSeconds: 90, side: "right", note: "Deep piriformis release. Keep front ankle flexed." },
      { poseId: "pigeon-pose", durationSeconds: 90, side: "left", note: "Melt down onto forearms or block, breathing steadily." },
      { poseId: "butterfly-pose", durationSeconds: 90, note: "Release the groin and inner thighs with soft forward hinge." },
      { poseId: "savasana", durationSeconds: 240, note: "Feel the warm rush of circulation throughout the pelvic basin." }
    ]
  },
  {
    id: "dawn-energy-flow",
    title: "Dawn Radiance & Whole Body Flow",
    subtitle: "Awaken circulation, activate core fire, and invigorate mental clarity.",
    durationMinutes: 15,
    category: "morning",
    difficulty: "intermediate",
    physicalFocus: ["Quadriceps", "Core & Abdominals", "Deltoids", "Heart & Lungs"],
    mentalFocus: "Cultivate vibrant presence, confidence, and inner focus.",
    description: "A rhythmic, dynamic sequence to ignite the metabolic fire, awaken the postural stabilizers, and charge your day with radiant energy.",
    bannerGradient: "from-[#F9F5EC] to-[#EFE4D2]",
    poses: [
      { poseId: "tadasana", durationSeconds: 30, note: "Establish tall, centered presence and set an intentional breath rhythm." },
      { poseId: "chair-pose", durationSeconds: 45, note: "Awaken the thighs and kindle internal digestive warmth." },
      { poseId: "downward-dog", durationSeconds: 45, note: "Stretch through the entire posterior body with energizing breath." },
      { poseId: "warrior-1", durationSeconds: 45, side: "right", note: "Reach high like a warrior greeting the morning sun." },
      { poseId: "warrior-1", durationSeconds: 45, side: "left", note: "Ground back heel firmly while lifting the sternum." },
      { poseId: "warrior-3", durationSeconds: 30, side: "right", note: "Engage posterior kinetic chain in dynamic horizontal balance." },
      { poseId: "warrior-3", durationSeconds: 30, side: "left", note: "Level the hips and lengthen from crown to heel." },
      { poseId: "upward-facing-dog", durationSeconds: 30, note: "Press the earth away, expanding chest and vital capacity." },
      { poseId: "boat-pose", durationSeconds: 40, note: "Ignite the core powerhouse with crisp, steady breathing." },
      { poseId: "tree-pose", durationSeconds: 45, side: "right", note: "Re-center your grounded balance and focused gaze." },
      { poseId: "tree-pose", durationSeconds: 45, side: "left", note: "Root down and grow expansive branches." },
      { poseId: "savasana", durationSeconds: 120, note: "A brief, sparkling rest to channel fresh vitality into every cell." }
    ]
  },
  {
    id: "athletes-recovery",
    title: "Runner & Athlete Lower Body Recovery",
    subtitle: "Restore muscle length, flush metabolic byproduct, and protect joint longevity.",
    durationMinutes: 20,
    category: "recovery",
    difficulty: "beginner",
    physicalFocus: ["Hamstrings", "Calves & Ankles", "Quadriceps", "IT Band"],
    mentalFocus: "Physical restoration and gentle gratitude for your body's strength.",
    description: "Engineered for runners, cyclists, and athletes to lengthen compressed muscle fibers, prevent tendonitis, and accelerate muscular recovery.",
    bannerGradient: "from-[#EFEBE4] to-[#E0D7C9]",
    poses: [
      { poseId: "downward-dog", durationSeconds: 60, note: "Pedal slowly, holding each heel down for 3 seconds to stretch Achilles." },
      { poseId: "low-lunge", durationSeconds: 60, side: "right", note: "Open the front quad and psoas of the back leg." },
      { poseId: "low-lunge", durationSeconds: 60, side: "left", note: "Deepen the stretch without forcing; breathe through the nose." },
      { poseId: "triangle-pose", durationSeconds: 45, side: "right", note: "Isolate and lengthen the right hamstring with micro-bent knee." },
      { poseId: "triangle-pose", durationSeconds: 45, side: "left", note: "Balance hamstring elongation across both legs." },
      { poseId: "pigeon-pose", durationSeconds: 90, side: "right", note: "Release tight outer glute and piriformis from pounding pavement." },
      { poseId: "pigeon-pose", durationSeconds: 90, side: "left", note: "Allow the hip to unlock under gentle, unforced gravity." },
      { poseId: "seated-forward-bend", durationSeconds: 90, note: "Long passive stretch along the entire spinal and hamstring line." },
      { poseId: "legs-up-the-wall", durationSeconds: 180, note: "Inversion flush: accelerates venous return and reduces leg inflammation." },
      { poseId: "savasana", durationSeconds: 180, note: "Complete physical surrender and tissue repair." }
    ]
  },
  {
    id: "lunar-sleep-prep",
    title: "Lunar Bedtime Deep Sleep Restoration",
    subtitle: "Calm circadian rhythms, quiet nighttime rumination, and prepare for deep rest.",
    durationMinutes: 25,
    category: "evening",
    difficulty: "beginner",
    physicalFocus: ["Spine Extensors", "Diaphragm", "Neck & Jaw", "Pelvis"],
    mentalFocus: "Softening the day's mental baggage into quiet restful surrender.",
    description: "An evening sanctuary practice featuring grounded, supported shapes that soothe the central nervous system and prepare the mind for deep restorative sleep.",
    bannerGradient: "from-[#EBE6DD] to-[#DDD4C4]",
    poses: [
      { poseId: "child-pose", durationSeconds: 120, note: "Forehead resting heavy; release any lingering tension from your day." },
      { poseId: "butterfly-pose", durationSeconds: 90, note: "Let knees fall open softly, breathing slow 4-in, 7-out breaths." },
      { poseId: "seated-twist", durationSeconds: 60, side: "right", note: "Gently wring out daytime stiffness from the spine." },
      { poseId: "seated-twist", durationSeconds: 60, side: "left", note: "Soften the shoulders, jaw, and space between your eyebrows." },
      { poseId: "bridge-pose", durationSeconds: 60, note: "Gentle supported bridge to open the front body without overstimulating." },
      { poseId: "legs-up-the-wall", durationSeconds: 240, note: "Rest here, letting all heavy energy drain from your feet into the earth." },
      { poseId: "savasana", durationSeconds: 300, note: "Transition directly into restful sleep or deep restorative relaxation." }
    ]
  }
];

export const MOOD_OPTIONS = [
  {
    id: "stiff-desk",
    label: "Hunched & Stiff",
    subtext: "Desk posture, tight neck, rounded shoulders",
    iconName: "Monitor",
    recommendedTag: "deskPosturedetox" as const,
    recommendedCategory: "standing" as const,
    accentColor: "#BF6F55"
  },
  {
    id: "anxious-scattered",
    label: "Anxious & Scattered",
    subtext: "Racing thoughts, nervous tension, shallow breath",
    iconName: "Wind",
    recommendedTag: "stressRelief" as const,
    recommendedCategory: "seatedRestorative" as const,
    accentColor: "#6F7E68"
  },
  {
    id: "low-back-ache",
    label: "Lower Back Ache",
    subtext: "Lumbar compression, tight hips, sciatic stiffness",
    iconName: "ShieldAlert",
    recommendedTag: "lowerBackPain" as const,
    recommendedCategory: "forwardBend" as const,
    accentColor: "#8C7355"
  },
  {
    id: "low-energy",
    label: "Fatigued & Sluggish",
    subtext: "Brain fog, heavy limbs, need gentle revitalization",
    iconName: "Sun",
    recommendedTag: "energyBoost" as const,
    recommendedCategory: "backbend" as const,
    accentColor: "#C06C52"
  },
  {
    id: "bedtime-unwind",
    label: "Ready for Sleep",
    subtext: "Evening wind-down, insomnia prep, deep rest",
    iconName: "Moon",
    recommendedTag: "sleepQuality" as const,
    recommendedCategory: "inversion" as const,
    accentColor: "#556B52"
  },
  {
    id: "post-workout",
    label: "Post-Workout Sore",
    subtext: "Tight hamstrings, calves, quads, athletic strain",
    iconName: "Activity",
    recommendedTag: "runnersRecovery" as const,
    recommendedCategory: "standing" as const,
    accentColor: "#7B6F8E"
  }
];
