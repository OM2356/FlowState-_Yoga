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
    | "treePose"
    | "downwardDog" 
    | "upwardDog" 
    | "cobra" 
    | "childPose" 
    | "forwardFold" 
    | "seatedForwardFold"
    | "chair" 
    | "chairPose"
    | "triangle" 
    | "sideAngle" 
    | "pigeon" 
    | "pigeonPose"
    | "crow" 
    | "crowPose"
    | "boat" 
    | "boatPose"
    | "bridge" 
    | "bridgePose"
    | "wheel" 
    | "wheelPose"
    | "camel" 
    | "camelPose"
    | "dancer"
    | "dancerPose"
    | "twistedLizard"
    | "seatedTwist" 
    | "butterfly" 
    | "savasana" 
    | "plank" 
    | "chaturanga" 
    | "sidePlank"
    | "halfMoon"
    | "headstand" 
    | "shoulderStand" 
    | "legsUpWall"
    | "eagle"
    | "malasana"
    | "goddess"
    | "catCow"
    | "fishPose"
    | "skaterJump"
    | "kneeToElbow"
    | "sumoSquat"
    | "wallPushUp"
    | "curtsyLunge"
    | "wallSit"
    | "elbowsBack"
    | "crunch9090";
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "user" | "developer" | "admin";
  level: DifficultyLevel;
  focusAreas: string[];
  mindfulMinutesGoal: number;
  streakDays: number;
  joinedDate: string;
  lastActiveDate?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token?: string;
}

export type FeedbackCategory = "Bug" | "UI Issue" | "Feature Request" | "Content Improvement" | "Posture Feedback";

export interface UserFeedbackRecord {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  type: FeedbackCategory;
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  eventType: "AUTH_LOGIN" | "AUTH_REGISTER" | "AUTH_FAILED" | "RATE_LIMIT_HIT" | "SESSION_SYNC" | "FEEDBACK_SUBMITTED" | "AI_QUERY";
  ipRedacted: string;
  details: string;
  status: "SUCCESS" | "WARN" | "BLOCKED";
}

export type MasteryBadgeCategory = 
  | "poses" 
  | "duration" 
  | "balance" 
  | "flexibility" 
  | "strength" 
  | "ritual" 
  | "exploration";

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface MasteryBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lore: string;
  iconName: string;
  category: MasteryBadgeCategory;
  rarity: BadgeRarity;
  xpReward: number;
  // Criteria checks
  requiredPoseIds?: string[];
  requiredPoseCategory?: PoseCategory;
  requiredUniquePoseCount?: number;
  requiredTotalHoldSeconds?: number;
  requiredTotalFlowMinutes?: number;
  requiredStreakDays?: number;
  required3DInspections?: number;
  accentColor: string;
  gradient: string;
}

export interface PoseCompletionRecord {
  poseId: string;
  completedCount: number;
  totalHoldSeconds: number;
  lastCompletedAt: string;
  masteryTier: 1 | 2 | 3; // Tier 1 (Practiced >=1), Tier 2 (Adept >=3), Tier 3 (Master >=5)
}

export interface UserMasteryState {
  posesCompleted: Record<string, PoseCompletionRecord>;
  unlockedBadgeIds: string[];
  badgeUnlockDates: Record<string, string>;
  inspected3dPoseIds: string[];
  totalFlowMinutes: number;
  totalXp: number;
  lastUpdated: string;
}

export interface BadgeProgress {
  badge: MasteryBadge;
  isUnlocked: boolean;
  unlockedAt?: string;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  progressLabel: string;
  missingRequirements?: string[];
}

