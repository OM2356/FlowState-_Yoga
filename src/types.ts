export type PoseCategory = 
  | "standing" 
  | "balance" 
  | "backbend" 
  | "forwardBend" 
  | "inversion" 
  | "seatedRestorative";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type MuscleGroup = 
  | "hamstrings"
  | "quadriceps"
  | "glutes"
  | "hipFlexors"
  | "coreAbdominals"
  | "erectorSpinae"
  | "deltoidsShoulders"
  | "pectoralisChest"
  | "latissimusDorsi"
  | "calvesAnkles"
  | "cervicalNeck";

export type BenefitTag = 
  | "stressRelief"
  | "lowerBackPain"
  | "deskPosturedetox"
  | "hipMobility"
  | "spineFlexibility"
  | "coreStrength"
  | "sleepQuality"
  | "energyBoost"
  | "digestion"
  | "runnersRecovery";

// Realistic skeletal joint data for accurate human anatomical rendering
export interface HumanPoseKinematics {
  // Head & Neck
  headTilt: number; // in degrees
  neckAngle: number;
  // Torso / Spine
  spineCurve: number; // -1 (forward fold) to +1 (deep backbend)
  torsoAngle: number; // rotation from vertical
  pelvisTilt: number;
  // Arms
  leftShoulderAngle: number;
  leftElbowAngle: number;
  leftWristAngle: number;
  rightShoulderAngle: number;
  rightElbowAngle: number;
  rightWristAngle: number;
  // Legs
  leftHipAngle: number;
  leftKneeAngle: number;
  leftAnkleAngle: number;
  rightHipAngle: number;
  rightKneeAngle: number;
  rightAnkleAngle: number;
  // Ground contact / Orientation
  elevationY: number; // 0 = standing, 1 = sitting on floor, 2 = lying down, 3 = inverted
  symmetry: boolean;
  facing: "side" | "front" | "threeQuarter" | "floor";
  // Custom SVG path offsets or key landmark adjustments
  poseArchetype: 
    | "tadasana" 
    | "warrior1" 
    | "warrior2" 
    | "warrior3" 
    | "tree" 
    | "downwardDog" 
    | "upwardDog" 
    | "cobra" 
    | "childPose" 
    | "forwardFold" 
    | "chair" 
    | "triangle" 
    | "sideAngle" 
    | "pigeon" 
    | "crow" 
    | "boat" 
    | "bridge" 
    | "wheel" 
    | "camel" 
    | "seatedTwist" 
    | "butterfly" 
    | "savasana" 
    | "plank" 
    | "chaturanga" 
    | "headstand" 
    | "shoulderStand" 
    | "legsUpWall"
    | "dancer"
    | "eagle"
    | "malasana"
    | "catCow"
    | "fishPose";
}

export interface YogaPose {
  id: string;
  name: string;
  sanskritName: string;
  englishPronunciation?: string;
  category: PoseCategory;
  difficulty: DifficultyLevel;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  benefits: BenefitTag[];
  recommendedHoldSeconds: number;
  description: string;
  stepByStepInstructions: string[];
  breathGuide: {
    inhaleAction: string;
    exhaleAction: string;
    holdNotes: string;
  };
  alignmentCues: {
    joint: string;
    cue: string;
  }[];
  commonMistakes: {
    mistake: string;
    correction: string;
  }[];
  modifications: {
    beginner: string;
    advanced: string;
    propUsage?: string;
  };
  kinematics: HumanPoseKinematics;
  iconName?: string;
}

export interface FlowItem {
  poseId: string;
  durationSeconds: number;
  side?: "left" | "right" | "both";
  breathCueOverride?: string;
  note?: string;
}

export type FlowCategory = "morning" | "recovery" | "destress" | "focus" | "evening" | "custom" | "cycle" | "deskRelief" | "energy" | "sleep";

export interface FlowSequence {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  category: FlowCategory;
  difficulty: DifficultyLevel;
  physicalFocus: string[];
  mentalFocus: string;
  description: string;
  poses: FlowItem[];
  bannerGradient: string;
  isCustom?: boolean;
}

export interface PracticeSessionRecord {
  id: string;
  sequenceId: string;
  sequenceTitle: string;
  date: string;
  durationMinutes: number;
  moodBefore: string;
  moodAfter: string;
  physicalFeelingAfter: string;
  rating: number; // 1 to 5
  notes?: string;
}

export interface MoodOption {
  id: string;
  label: string;
  subtext: string;
  iconName: string;
  recommendedTag: BenefitTag;
  recommendedCategory: PoseCategory;
  accentColor: string;
}

export interface PhysicalTensionOption {
  id: string;
  label: string;
  bodyRegion: string;
  muscleGroups: MuscleGroup[];
  iconName: string;
  accentColor: string;
}
