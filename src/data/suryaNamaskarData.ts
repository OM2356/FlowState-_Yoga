import { YogaPose, MuscleGroup } from "../types";

export interface SuryaNamaskarStep {
  stepNumber: number;
  poseId: string;
  sanskritName: string;
  englishName: string;
  solarMantra: string;
  mantraTranslation: string;
  breathAction: "Inhale" | "Exhale" | "Retain (Hold In)";
  chakraFocus: {
    name: string;
    location: string;
    color: string;
  };
  recommendedSeconds: number;
  keyAlignmentCues: string[];
  anatomicalFocus: string;
  primaryMuscles: MuscleGroup[];
  kinematics3D: {
    torsoAngle: number;       // degrees tilt forward (+) or back (-)
    spineArch: number;        // curve: -1 (deep fold) to +1 (deep backbend)
    headPitch: number;        // degrees up/down
    leftArmPitch: number;     // shoulder forward/back
    leftArmRoll: number;      // shoulder abduction
    leftArmYaw: number;
    leftElbowFlex: number;    // 0 = straight, 90+ = bent
    rightArmPitch: number;
    rightArmRoll: number;
    rightArmYaw: number;
    rightElbowFlex: number;
    leftHipFlex: number;      // hip angle
    leftKneeFlex: number;     // knee angle
    rightHipFlex: number;
    rightKneeFlex: number;
    handsJoined: boolean;     // Anjali mudra
    handsOnFloor: boolean;
    bodyElevationY: number;   // vertical height offset
    isFloorPose: boolean;
  };
}

export const SURYA_NAMASKAR_STEPS: SuryaNamaskarStep[] = [
  {
    stepNumber: 1,
    poseId: "pranamasana-1",
    sanskritName: "Pranamasana",
    englishName: "Prayer Pose",
    solarMantra: "Om Mitraya Namaha",
    mantraTranslation: "Salutations to the Friend of all beings who radiates unconditional affection.",
    breathAction: "Exhale",
    chakraFocus: {
      name: "Anahata (Heart Chakra)",
      location: "Center of the chest",
      color: "#4E8256"
    },
    recommendedSeconds: 5,
    keyAlignmentCues: [
      "Stand with feet rooted together, weight equally distributed.",
      "Bring palms together at heart center in Anjali Mudra.",
      "Elongate the spine upwards while relaxing shoulder blades down.",
      "Gaze forward softly, settling your awareness into the steady rhythm of your heart."
    ],
    anatomicalFocus: "Spinal elongation, chest opening, grounded posture balance.",
    primaryMuscles: ["quadriceps", "coreAbdominals", "calvesAnkles", "pectoralisChest"],
    kinematics3D: {
      torsoAngle: 0,
      spineArch: 0,
      headPitch: 0,
      leftArmPitch: 35,
      leftArmRoll: 25,
      leftArmYaw: 0,
      leftElbowFlex: 95,
      rightArmPitch: 35,
      rightArmRoll: 25,
      rightArmYaw: 0,
      rightElbowFlex: 95,
      leftHipFlex: 0,
      leftKneeFlex: 0,
      rightHipFlex: 0,
      rightKneeFlex: 0,
      handsJoined: true,
      handsOnFloor: false,
      bodyElevationY: 0,
      isFloorPose: false
    }
  },
  {
    stepNumber: 2,
    poseId: "hasta-uttanasana-2",
    sanskritName: "Hasta Uttanasana",
    englishName: "Raised Arms / Arching Back Pose",
    solarMantra: "Om Ravaye Namaha",
    mantraTranslation: "Salutations to the Radiant One who illuminates cosmic wisdom.",
    breathAction: "Inhale",
    chakraFocus: {
      name: "Vishuddha (Throat Chakra)",
      location: "Throat and thyroid gland",
      color: "#5B7B94"
    },
    recommendedSeconds: 5,
    keyAlignmentCues: [
      "Inhale deeply and sweep both arms overhead with biceps alongside ears.",
      "Engage glutes and lower belly to protect your lumbar spine.",
      "Arch gently from the thoracic upper spine, lifting your heart toward the sun.",
      "Keep neck long and gaze softly upward toward your fingertips."
    ],
    anatomicalFocus: "Chest expansion, abdominal stretching, upper back extension.",
    primaryMuscles: ["pectoralisChest", "deltoidsShoulders", "erectorSpinae", "quadriceps"],
    kinematics3D: {
      torsoAngle: -20,
      spineArch: 0.45,
      headPitch: -30,
      leftArmPitch: 175,
      leftArmRoll: 10,
      leftArmYaw: 0,
      leftElbowFlex: 5,
      rightArmPitch: 175,
      rightArmRoll: 10,
      rightArmYaw: 0,
      rightElbowFlex: 5,
      leftHipFlex: -10,
      leftKneeFlex: 0,
      rightHipFlex: -10,
      rightKneeFlex: 0,
      handsJoined: false,
      handsOnFloor: false,
      bodyElevationY: 0,
      isFloorPose: false
    }
  },
  {
    stepNumber: 3,
    poseId: "padahastasana-3",
    sanskritName: "Hastapadasana (Uttanasana)",
    englishName: "Standing Forward Bend",
    solarMantra: "Om Suryaya Namaha",
    mantraTranslation: "Salutations to the Divine Guide who activates inner cosmic energy.",
    breathAction: "Exhale",
    chakraFocus: {
      name: "Swadhisthana (Sacral Chakra)",
      location: "Lower abdomen / pelvis",
      color: "#D48B70"
    },
    recommendedSeconds: 5,
    keyAlignmentCues: [
      "Exhale and hinge forward from the hip creases with a flat spine.",
      "Place palms or fingertips on the floor beside your feet.",
      "Keep a micro-bend in the knees to prioritize spinal decompression over hamstring tension.",
      "Let the crown of your head surrender toward the earth."
    ],
    anatomicalFocus: "Deep hamstring stretch, lumbar decompression, cerebral circulation.",
    primaryMuscles: ["hamstrings", "calvesAnkles", "erectorSpinae", "glutes"],
    kinematics3D: {
      torsoAngle: 95,
      spineArch: -0.3,
      headPitch: 45,
      leftArmPitch: 85,
      leftArmRoll: 15,
      leftArmYaw: 0,
      leftElbowFlex: 10,
      rightArmPitch: 85,
      rightArmRoll: 15,
      rightArmYaw: 0,
      rightElbowFlex: 10,
      leftHipFlex: 95,
      leftKneeFlex: 8,
      rightHipFlex: 95,
      rightKneeFlex: 8,
      handsJoined: false,
      handsOnFloor: true,
      bodyElevationY: 0,
      isFloorPose: false
    }
  },
  {
    stepNumber: 4,
    poseId: "ashwa-sanchalanasana-4",
    sanskritName: "Ashwa Sanchalanasana (Right Back)",
    englishName: "Equestrian / Low Lunge Pose",
    solarMantra: "Om Bhanave Namaha",
    mantraTranslation: "Salutations to the Illuminator who dispels all darkness and inertia.",
    breathAction: "Inhale",
    chakraFocus: {
      name: "Ajna (Third Eye Chakra)",
      location: "Space between the eyebrows",
      color: "#6B5B95"
    },
    recommendedSeconds: 5,
    keyAlignmentCues: [
      "Inhale, step your RIGHT leg far back and lower the right knee to the floor.",
      "Keep your front LEFT knee directly stacked over the left ankle at 90 degrees.",
      "Press fingertips into the floor, roll shoulders back, and lift the sternum.",
      "Gaze upward toward the eyebrow center, feeling an expansive psoas opening."
    ],
    anatomicalFocus: "Deep hip flexor and psoas release, quadriceps stretch, chest opening.",
    primaryMuscles: ["hipFlexors", "quadriceps", "glutes", "erectorSpinae"],
    kinematics3D: {
      torsoAngle: -10,
      spineArch: 0.3,
      headPitch: -25,
      leftArmPitch: 65,
      leftArmRoll: 25,
      leftArmYaw: 0,
      leftElbowFlex: 20,
      rightArmPitch: 65,
      rightArmRoll: 25,
      rightArmYaw: 0,
      rightElbowFlex: 20,
      leftHipFlex: 90,
      leftKneeFlex: 90,
      rightHipFlex: -40,
      rightKneeFlex: 90,
      handsJoined: false,
      handsOnFloor: true,
      bodyElevationY: -0.45,
      isFloorPose: true
    }
  },
  {
    stepNumber: 5,
    poseId: "dandasana-5",
    sanskritName: "Dandasana (Plank / Stick Pose)",
    englishName: "Plank Pose",
    solarMantra: "Om Khagaya Namaha",
    mantraTranslation: "Salutations to the One who moves gracefully through the celestial sphere.",
    breathAction: "Retain (Hold In)",
    chakraFocus: {
      name: "Vishuddha (Throat Chakra)",
      location: "Base of the neck",
      color: "#5B7B94"
    },
    recommendedSeconds: 4,
    keyAlignmentCues: [
      "Step the front left leg back to meet the right in a strong high plank.",
      "Form a single unbroken diagonal line from the crown of your head to your heels.",
      "Spread fingers wide, pressing firmly through the palms to engage shoulder stabilizers.",
      "Engage your navel firmly toward your spine, keeping hips level (neither sagging nor piking)."
    ],
    anatomicalFocus: "Total core integration, wrist and shoulder endurance, spinal bracing.",
    primaryMuscles: ["coreAbdominals", "deltoidsShoulders", "quadriceps", "latissimusDorsi"],
    kinematics3D: {
      torsoAngle: 75,
      spineArch: 0,
      headPitch: 0,
      leftArmPitch: 90,
      leftArmRoll: 10,
      leftArmYaw: 0,
      leftElbowFlex: 0,
      rightArmPitch: 90,
      rightArmRoll: 10,
      rightArmYaw: 0,
      rightElbowFlex: 0,
      leftHipFlex: 15,
      leftKneeFlex: 0,
      rightHipFlex: 15,
      rightKneeFlex: 0,
      handsJoined: false,
      handsOnFloor: true,
      bodyElevationY: -0.65,
      isFloorPose: true
    }
  },
  {
    stepNumber: 6,
    poseId: "ashtanga-namaskara-6",
    sanskritName: "Ashtanga Namaskara",
    englishName: "Eight-Limbed Salutation",
    solarMantra: "Om Pushne Namaha",
    mantraTranslation: "Salutations to the Nourisher of the universe who grants strength and stamina.",
    breathAction: "Exhale",
    chakraFocus: {
      name: "Manipura (Solar Plexus)",
      location: "Navel center",
      color: "#C29236"
    },
    recommendedSeconds: 5,
    keyAlignmentCues: [
      "Exhale and lower knees to the mat, then slide chest and chin down between hands.",
      "Eight points touch the earth: 2 feet, 2 knees, 2 hands, chest, and chin.",
      "Keep the hips elevated slightly off the floor with elbows hugged tightly to ribs.",
      "Surrender your ego in humility to the earth."
    ],
    anatomicalFocus: "Strengthens triceps, opens thoracic spine, enhances shoulder mobility.",
    primaryMuscles: ["deltoidsShoulders", "erectorSpinae", "latissimusDorsi", "coreAbdominals"],
    kinematics3D: {
      torsoAngle: 25,
      spineArch: 0.35,
      headPitch: -30,
      leftArmPitch: 80,
      leftArmRoll: 10,
      leftArmYaw: 0,
      leftElbowFlex: 100,
      rightArmPitch: 80,
      rightArmRoll: 10,
      rightArmYaw: 0,
      rightElbowFlex: 100,
      leftHipFlex: 45,
      leftKneeFlex: 90,
      rightHipFlex: 45,
      rightKneeFlex: 90,
      handsJoined: false,
      handsOnFloor: true,
      bodyElevationY: -0.85,
      isFloorPose: true
    }
  },
  {
    stepNumber: 7,
    poseId: "bhujangasana-7",
    sanskritName: "Bhujangasana",
    englishName: "Cobra Pose",
    solarMantra: "Om Hiranyagarbhaya Namaha",
    mantraTranslation: "Salutations to the Golden Cosmic Vessel containing all life force.",
    breathAction: "Inhale",
    chakraFocus: {
      name: "Swadhisthana (Sacral Chakra)",
      location: "Pelvic center",
      color: "#D48B70"
    },
    recommendedSeconds: 5,
    keyAlignmentCues: [
      "Inhale, glide forward, flatten the tops of your feet onto the mat.",
      "Roll shoulders back and lift your chest using upper back muscles, not pressing hard on hands.",
      "Keep elbows slightly bent and tucked close beside your torso.",
      "Lengthen your neck and gaze gently forward and upward."
    ],
    anatomicalFocus: "Strengthens spinal extensors, broadens ribcage, stimulates adrenal glands.",
    primaryMuscles: ["erectorSpinae", "pectoralisChest", "deltoidsShoulders", "glutes"],
    kinematics3D: {
      torsoAngle: -40,
      spineArch: 0.55,
      headPitch: -20,
      leftArmPitch: 70,
      leftArmRoll: 15,
      leftArmYaw: 0,
      leftElbowFlex: 40,
      rightArmPitch: 70,
      rightArmRoll: 15,
      rightArmYaw: 0,
      rightElbowFlex: 40,
      leftHipFlex: -10,
      leftKneeFlex: 0,
      rightHipFlex: -10,
      rightKneeFlex: 0,
      handsJoined: false,
      handsOnFloor: true,
      bodyElevationY: -0.75,
      isFloorPose: true
    }
  },
  {
    stepNumber: 8,
    poseId: "adho-mukha-svanasana-8",
    sanskritName: "Parvatasana / Adho Mukha Svanasana",
    englishName: "Mountain / Downward-Facing Dog",
    solarMantra: "Om Marichaye Namaha",
    mantraTranslation: "Salutations to the Ray of Dawn who awakens vital awareness.",
    breathAction: "Exhale",
    chakraFocus: {
      name: "Vishuddha (Throat Chakra)",
      location: "Throat / base of neck",
      color: "#5B7B94"
    },
    recommendedSeconds: 6,
    keyAlignmentCues: [
      "Exhale, tuck toes, and press hips high and back into an inverted V.",
      "Press the floor away through palms, sending your chest toward your thighs.",
      "Reach heels toward the floor while keeping sitting bones lifted high.",
      "Let head and neck hang relaxed between upper arms."
    ],
    anatomicalFocus: "Full posterior chain stretch, upper body strength, spinal decompression.",
    primaryMuscles: ["hamstrings", "calvesAnkles", "deltoidsShoulders", "latissimusDorsi"],
    kinematics3D: {
      torsoAngle: 55,
      spineArch: -0.1,
      headPitch: 40,
      leftArmPitch: 165,
      leftArmRoll: 15,
      leftArmYaw: 0,
      leftElbowFlex: 0,
      rightArmPitch: 165,
      rightArmRoll: 15,
      rightArmYaw: 0,
      rightElbowFlex: 0,
      leftHipFlex: 80,
      leftKneeFlex: 10,
      rightHipFlex: 80,
      rightKneeFlex: 10,
      handsJoined: false,
      handsOnFloor: true,
      bodyElevationY: -0.45,
      isFloorPose: true
    }
  },
  {
    stepNumber: 9,
    poseId: "ashwa-sanchalanasana-9",
    sanskritName: "Ashwa Sanchalanasana (Left Back / Right Forward)",
    englishName: "Equestrian / Low Lunge (Opposite Side)",
    solarMantra: "Om Adityaya Namaha",
    mantraTranslation: "Salutations to the Son of Aditi, the boundless cosmic mother.",
    breathAction: "Inhale",
    chakraFocus: {
      name: "Ajna (Third Eye Chakra)",
      location: "Eyebrow center",
      color: "#6B5B95"
    },
    recommendedSeconds: 5,
    keyAlignmentCues: [
      "Inhale and step your RIGHT foot forward between hands (or left foot to balance sides).",
      "Lower back knee to mat, untuck toes, and sink pelvis forward.",
      "Lift chest, broaden collarbones, and gaze upward toward the sky.",
      "Feel the deep rejuvenating stretch through the back hip flexor."
    ],
    anatomicalFocus: "Bilateral balance, hip flexor release, spinal elongation.",
    primaryMuscles: ["hipFlexors", "quadriceps", "glutes", "erectorSpinae"],
    kinematics3D: {
      torsoAngle: -10,
      spineArch: 0.3,
      headPitch: -25,
      leftArmPitch: 65,
      leftArmRoll: 25,
      leftArmYaw: 0,
      leftElbowFlex: 20,
      rightArmPitch: 65,
      rightArmRoll: 25,
      rightArmYaw: 0,
      rightElbowFlex: 20,
      leftHipFlex: -40,
      leftKneeFlex: 90,
      rightHipFlex: 90,
      rightKneeFlex: 90,
      handsJoined: false,
      handsOnFloor: true,
      bodyElevationY: -0.45,
      isFloorPose: true
    }
  },
  {
    stepNumber: 10,
    poseId: "padahastasana-10",
    sanskritName: "Hastapadasana (Uttanasana)",
    englishName: "Standing Forward Bend",
    solarMantra: "Om Savitre Namaha",
    mantraTranslation: "Salutations to the Stimulator of life and supreme vital power.",
    breathAction: "Exhale",
    chakraFocus: {
      name: "Swadhisthana (Sacral Chakra)",
      location: "Lower pelvic center",
      color: "#D48B70"
    },
    recommendedSeconds: 5,
    keyAlignmentCues: [
      "Exhale and step back foot forward beside front foot, folding over legs.",
      "Bring palms or fingertips beside feet on the floor.",
      "Relax your head completely, feeling gravity gently elongate your spine.",
      "Distribute weight evenly across the four corners of both feet."
    ],
    anatomicalFocus: "Hamstring flexibility, relaxation of spinal muscles, nervous system calming.",
    primaryMuscles: ["hamstrings", "calvesAnkles", "erectorSpinae", "glutes"],
    kinematics3D: {
      torsoAngle: 95,
      spineArch: -0.3,
      headPitch: 45,
      leftArmPitch: 85,
      leftArmRoll: 15,
      leftArmYaw: 0,
      leftElbowFlex: 10,
      rightArmPitch: 85,
      rightArmRoll: 15,
      rightArmYaw: 0,
      rightElbowFlex: 10,
      leftHipFlex: 95,
      leftKneeFlex: 8,
      rightHipFlex: 95,
      rightKneeFlex: 8,
      handsJoined: false,
      handsOnFloor: true,
      bodyElevationY: 0,
      isFloorPose: false
    }
  },
  {
    stepNumber: 11,
    poseId: "hasta-uttanasana-11",
    sanskritName: "Hasta Uttanasana",
    englishName: "Raised Arms / Arching Back Pose",
    solarMantra: "Om Arkaya Namaha",
    mantraTranslation: "Salutations to the One worthy of highest reverence and praise.",
    breathAction: "Inhale",
    chakraFocus: {
      name: "Vishuddha (Throat Chakra)",
      location: "Throat center",
      color: "#5B7B94"
    },
    recommendedSeconds: 5,
    keyAlignmentCues: [
      "Inhale, sweep arms wide, and rise with a long spine all the way up.",
      "Extend arms overhead, lifting the heart into a gentle arch back.",
      "Ground firmly through feet, drawing energy up from the earth through fingers.",
      "Keep abdominal muscles lightly firmed to protect the lower back."
    ],
    anatomicalFocus: "Full front body expansion, chest and lung capacity, invigorating energy.",
    primaryMuscles: ["pectoralisChest", "deltoidsShoulders", "erectorSpinae", "quadriceps"],
    kinematics3D: {
      torsoAngle: -20,
      spineArch: 0.45,
      headPitch: -30,
      leftArmPitch: 175,
      leftArmRoll: 10,
      leftArmYaw: 0,
      leftElbowFlex: 5,
      rightArmPitch: 175,
      rightArmRoll: 10,
      rightArmYaw: 0,
      rightElbowFlex: 5,
      leftHipFlex: -10,
      leftKneeFlex: 0,
      rightHipFlex: -10,
      rightKneeFlex: 0,
      handsJoined: false,
      handsOnFloor: false,
      bodyElevationY: 0,
      isFloorPose: false
    }
  },
  {
    stepNumber: 12,
    poseId: "pranamasana-12",
    sanskritName: "Pranamasana / Tadasana",
    englishName: "Prayer Mountain Pose (Completion)",
    solarMantra: "Om Bhaskaraya Namaha",
    mantraTranslation: "Salutations to the Source of all radiance, brilliance, and spiritual awakening.",
    breathAction: "Exhale",
    chakraFocus: {
      name: "Anahata (Heart Chakra)",
      location: "Heart center",
      color: "#4E8256"
    },
    recommendedSeconds: 6,
    keyAlignmentCues: [
      "Exhale and bring palms back together at your heart center.",
      "Stand tall, grounded, and centered in perfect stillness.",
      "Feel the solar heat, heightened circulation, and quiet calm throughout your body.",
      "Take 2 slow, mindful breaths to complete the round."
    ],
    anatomicalFocus: "Posture integration, cardiovascular calm, mental centering.",
    primaryMuscles: ["quadriceps", "coreAbdominals", "calvesAnkles"],
    kinematics3D: {
      torsoAngle: 0,
      spineArch: 0,
      headPitch: 0,
      leftArmPitch: 35,
      leftArmRoll: 25,
      leftArmYaw: 0,
      leftElbowFlex: 95,
      rightArmPitch: 35,
      rightArmRoll: 25,
      rightArmYaw: 0,
      rightElbowFlex: 95,
      leftHipFlex: 0,
      leftKneeFlex: 0,
      rightHipFlex: 0,
      rightKneeFlex: 0,
      handsJoined: true,
      handsOnFloor: false,
      bodyElevationY: 0,
      isFloorPose: false
    }
  }
];

export const SURYA_NAMASKAR_ROUNDS_PRESETS = [
  { rounds: 3, label: "Gentle Morning Awakening (3 Rounds)", minutes: 5, difficulty: "Beginner" },
  { rounds: 6, label: "Classic Solar Vitality (6 Rounds)", minutes: 10, difficulty: "Intermediate" },
  { rounds: 12, label: "Full Solar Cycle (12 Rounds - Traditional)", minutes: 20, difficulty: "Dedicated Yogi" },
  { rounds: 24, label: "Endurance & Prana Flow (24 Rounds)", minutes: 35, difficulty: "Advanced" },
  { rounds: 108, label: "Sacred Solstice Sadhana (108 Rounds)", minutes: 90, difficulty: "Mastery Challenge" },
];
