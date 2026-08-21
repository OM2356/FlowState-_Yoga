import { MasteryBadge, UserMasteryState, BadgeProgress, PracticeSessionRecord, UserProfile, YogaPose } from "../types";
import { YOGA_POSES } from "./posesData";

export const MASTERY_BADGES: MasteryBadge[] = [
  {
    id: "warrior-pro",
    title: "Warrior Pro",
    subtitle: "Master of Grounded Strength",
    description: "Complete and hold all 3 iconic Warrior asanas (Warrior I, Warrior II, Warrior III) in the Pose Library.",
    lore: "In Sanskrit, Virabhadra represents the noble spiritual warrior who overcomes ignorance through grounded discipline and unwavering focus.",
    iconName: "Shield",
    category: "poses",
    rarity: "epic",
    xpReward: 350,
    requiredPoseIds: ["warrior-1", "warrior-2", "warrior-3"],
    accentColor: "#C1664C",
    gradient: "from-[#C1664C] to-[#8F3E2C]",
  },
  {
    id: "flexible-master",
    title: "Flexible Master",
    subtitle: "Elastic Spine & Open Hamstrings",
    description: "Complete deep flexibility asanas (Standing Forward Fold, Seated Forward Fold, Pigeon, Downward Dog) with 5+ minutes total hold time.",
    lore: "Flexibility is not merely physical elongation—it is cultivating mental receptivity and yielding without breaking.",
    iconName: "Sparkles",
    category: "flexibility",
    rarity: "epic",
    xpReward: 400,
    requiredPoseIds: ["forward-fold", "seated-forward-fold", "pigeon-pose", "downward-dog"],
    requiredTotalHoldSeconds: 300,
    accentColor: "#4E6548",
    gradient: "from-[#4E6548] to-[#2F3E2D]",
  },
  {
    id: "balance-alchemist",
    title: "Balance Alchemist",
    subtitle: "Master of Proprioception & Equanimity",
    description: "Successfully complete 3 single-leg balancing postures (Tree Pose, Warrior III, Dancer Pose, or Half Moon).",
    lore: "Equilibrium on a single foot demands total alignment of the physical body, breath rhythm, and concentrated gaze (Drishti).",
    iconName: "Compass",
    category: "balance",
    rarity: "rare",
    xpReward: 300,
    requiredPoseIds: ["tree-pose", "warrior-3", "dancer-pose", "half-moon"],
    accentColor: "#8B5A3C",
    gradient: "from-[#8B5A3C] to-[#5C3B26]",
  },
  {
    id: "backbend-pioneer",
    title: "Heart Opener",
    subtitle: "Thoracic Extension & Vitality",
    description: "Complete backbending postures (Cobra, Bridge Pose, Camel Pose, or Wheel Pose) with deep thoracic expansion.",
    lore: "Opening the front body frees accumulated emotional tension in the pectorals and invigorates the sympathetic nervous system.",
    iconName: "Heart",
    category: "strength",
    rarity: "rare",
    xpReward: 300,
    requiredPoseIds: ["cobra-pose", "bridge-pose", "camel-pose", "wheel-pose"],
    accentColor: "#D4775E",
    gradient: "from-[#D4775E] to-[#B0533C]",
  },
  {
    id: "core-architect",
    title: "Core Architect",
    subtitle: "Center of Power & Agni Fire",
    description: "Hold core-activating postures (Plank Pose, Side Plank, Boat Pose, Chaturanga) for at least 3 minutes total.",
    lore: "The solar plexus (Manipura chakra) ignites determination, digestive vitality, and inner willpower.",
    iconName: "Flame",
    category: "strength",
    rarity: "rare",
    xpReward: 275,
    requiredPoseIds: ["plank-pose", "side-plank", "boat-pose", "chaturanga"],
    requiredTotalHoldSeconds: 180,
    accentColor: "#C1664C",
    gradient: "from-[#C1664C] to-[#E28B70]",
  },
  {
    id: "inversion-explorer",
    title: "Inversion Explorer",
    subtitle: "Perspective Shift & Circulation",
    description: "Hold inverted postures (Downward Dog, Headstand, or Legs Up the Wall) for 4+ minutes total.",
    lore: "Inversions invert gravity's load on the cardiovascular system, calming the heart rate and clearing mental clutter.",
    iconName: "Layers",
    category: "exploration",
    rarity: "common",
    xpReward: 200,
    requiredPoseIds: ["downward-dog"],
    requiredTotalHoldSeconds: 240,
    accentColor: "#3B5A6F",
    gradient: "from-[#3B5A6F] to-[#253B4B]",
  },
  {
    id: "flow-initiate",
    title: "Flow Initiate",
    subtitle: "First Mindful Movements",
    description: "Complete your first 15 minutes of guided yoga flow practice in the studio.",
    lore: "Every lifelong journey of mindful embodiment begins with a single conscious breath on the mat.",
    iconName: "Play",
    category: "duration",
    rarity: "common",
    xpReward: 150,
    requiredTotalFlowMinutes: 15,
    accentColor: "#556E52",
    gradient: "from-[#556E52] to-[#3B4E39]",
  },
  {
    id: "flow-marathoner",
    title: "Flow Marathoner",
    subtitle: "Dedication to the Path",
    description: "Accumulate at least 60 mindful minutes across multiple flow practices.",
    lore: "Consistency compounds like rivers sculpting stone. Steady practice turns effort into natural elegance.",
    iconName: "Award",
    category: "duration",
    rarity: "epic",
    xpReward: 500,
    requiredTotalFlowMinutes: 60,
    accentColor: "#D08A37",
    gradient: "from-[#D08A37] to-[#99601E]",
  },
  {
    id: "asana-encyclopedist",
    title: "Asana Encyclopedist",
    subtitle: "Curiosity & Anatomical Breadth",
    description: "Explore and practice at least 8 unique postures from the Pose Library.",
    lore: "Expanding your repertoire unlocks diverse kinetic pathways, preventing repetitive stress and awakening subtle stabilizers.",
    iconName: "BookOpen",
    category: "poses",
    rarity: "rare",
    xpReward: 350,
    requiredUniquePoseCount: 8,
    accentColor: "#4E6548",
    gradient: "from-[#4E6548] to-[#6E8A66]",
  },
  {
    id: "zen-master",
    title: "Zen Master",
    subtitle: "The Sacred Art of Stillness",
    description: "Complete restorative holds (Child's Pose, Savasana, Butterfly) for 6+ minutes total.",
    lore: "The most difficult posture for the modern mind is conscious stillness without anticipation.",
    iconName: "Wind",
    category: "ritual",
    rarity: "rare",
    xpReward: 300,
    requiredPoseIds: ["child-pose", "savasana"],
    requiredTotalHoldSeconds: 360,
    accentColor: "#6B7C85",
    gradient: "from-[#6B7C85] to-[#48555C]",
  },
  {
    id: "biomechanics-scholar",
    title: "3D Biomechanics Scholar",
    subtitle: "Kinematic & Muscle Heatmap Inspector",
    description: "Inspect 3D human rigging, muscle heatmaps, and joint alignment for 5 different asanas.",
    lore: "Understanding your musculoskeletal levers and vectors transforms blind imitation into precision anatomy.",
    iconName: "Rotate3d",
    category: "exploration",
    rarity: "common",
    xpReward: 200,
    required3DInspections: 5,
    accentColor: "#2F4A38",
    gradient: "from-[#2F4A38] to-[#1B2C21]",
  },
  {
    id: "ritual-guardian",
    title: "Ritual Guardian",
    subtitle: "7-Day Unbroken Mindfulness Streak",
    description: "Maintain an active daily yoga practice streak for 7 consecutive days.",
    lore: "Tapas (discipline) creates a sacred sanctuary in daily life that grounds the mind amidst any storm.",
    iconName: "ShieldCheck",
    category: "ritual",
    rarity: "legendary",
    xpReward: 600,
    requiredStreakDays: 7,
    accentColor: "#A65538",
    gradient: "from-[#A65538] to-[#783921]",
  }
];

export const XP_LEVELS = [
  { level: 1, title: "Curious Novice", minXp: 0, maxXp: 300 },
  { level: 2, title: "Sadhaka (Seeker)", minXp: 300, maxXp: 750 },
  { level: 3, title: "Asana Practitioner", minXp: 750, maxXp: 1350 },
  { level: 4, title: "Flow Artisan", minXp: 1350, maxXp: 2100 },
  { level: 5, title: "Biomechanics Scholar", minXp: 2100, maxXp: 3000 },
  { level: 6, title: "Pranayama Adept", minXp: 3000, maxXp: 4100 },
  { level: 7, title: "Harmony Alchemist", minXp: 4100, maxXp: 5400 },
  { level: 8, title: "Zen Master", minXp: 5400, maxXp: 7000 },
  { level: 9, title: "Yogacharya", minXp: 7000, maxXp: 9000 },
  { level: 10, title: "Flow Luminary", minXp: 9000, maxXp: 15000 },
];

export function getXpRankInfo(totalXp: number) {
  let currentLevel = XP_LEVELS[0];
  for (const lvl of XP_LEVELS) {
    if (totalXp >= lvl.minXp) {
      currentLevel = lvl;
    }
  }

  const nextLevel = XP_LEVELS.find((l) => l.level === currentLevel.level + 1) || currentLevel;
  const range = currentLevel === nextLevel ? 1000 : nextLevel.minXp - currentLevel.minXp;
  const progressInLevel = totalXp - currentLevel.minXp;
  const progressPercent = currentLevel === nextLevel ? 100 : Math.min(100, Math.max(0, Math.round((progressInLevel / range) * 100)));

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXp: totalXp,
    minXp: currentLevel.minXp,
    maxXp: nextLevel.minXp,
    xpToNext: Math.max(0, nextLevel.minXp - totalXp),
    progressPercent,
  };
}

export function getInitialMasteryState(): UserMasteryState {
  try {
    const stored = localStorage.getItem("flowstate_mastery_state");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        posesCompleted: parsed.posesCompleted || {},
        unlockedBadgeIds: parsed.unlockedBadgeIds || [],
        badgeUnlockDates: parsed.badgeUnlockDates || {},
        inspected3dPoseIds: parsed.inspected3dPoseIds || [],
        totalFlowMinutes: parsed.totalFlowMinutes || 0,
        totalXp: parsed.totalXp || 0,
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      };
    }
  } catch {}

  // Default initial seed state with friendly progression
  return {
    posesCompleted: {
      "tadasana": { poseId: "tadasana", completedCount: 3, totalHoldSeconds: 135, lastCompletedAt: new Date().toISOString(), masteryTier: 2 },
      "downward-dog": { poseId: "downward-dog", completedCount: 2, totalHoldSeconds: 120, lastCompletedAt: new Date().toISOString(), masteryTier: 1 },
      "warrior-1": { poseId: "warrior-1", completedCount: 2, totalHoldSeconds: 90, lastCompletedAt: new Date().toISOString(), masteryTier: 1 },
      "child-pose": { poseId: "child-pose", completedCount: 3, totalHoldSeconds: 180, lastCompletedAt: new Date().toISOString(), masteryTier: 2 },
    },
    unlockedBadgeIds: ["flow-initiate"],
    badgeUnlockDates: {
      "flow-initiate": new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    inspected3dPoseIds: ["tadasana", "twisted-lizard", "downward-dog"],
    totalFlowMinutes: 25,
    totalXp: 450,
    lastUpdated: new Date().toISOString(),
  };
}

export function calculateBadgeProgress(
  badge: MasteryBadge,
  state: UserMasteryState,
  sessionHistory: PracticeSessionRecord[],
  user: UserProfile | null
): BadgeProgress {
  const isAlreadyUnlocked = state.unlockedBadgeIds.includes(badge.id);
  const unlockedAt = state.badgeUnlockDates[badge.id];

  // Specific pose requirements (e.g. Warrior I, II, III)
  if (badge.requiredPoseIds && badge.requiredPoseIds.length > 0) {
    const required = badge.requiredPoseIds;
    
    // Check if hold seconds are required as well
    if (badge.requiredTotalHoldSeconds) {
      let currentHold = 0;
      for (const pid of required) {
        currentHold += state.posesCompleted[pid]?.totalHoldSeconds || 0;
      }
      const targetHold = badge.requiredTotalHoldSeconds;
      const progressPercent = Math.min(100, Math.round((currentHold / targetHold) * 100));
      const isComplete = currentHold >= targetHold;

      const missing = required
        .filter((pid) => !state.posesCompleted[pid] || state.posesCompleted[pid].completedCount === 0)
        .map((pid) => YOGA_POSES.find((p) => p.id === pid)?.name || pid);

      return {
        badge,
        isUnlocked: isAlreadyUnlocked || isComplete,
        unlockedAt,
        currentValue: currentHold,
        targetValue: targetHold,
        progressPercent: isAlreadyUnlocked ? 100 : progressPercent,
        progressLabel: `${Math.round(currentHold / 60)} / ${Math.round(targetHold / 60)} min held`,
        missingRequirements: missing,
      };
    }

    // Number of completed required poses (e.g., all 3 warriors)
    const completedCount = required.filter(
      (pid) => state.posesCompleted[pid] && state.posesCompleted[pid].completedCount > 0
    ).length;
    const targetCount = required.length;
    const progressPercent = Math.min(100, Math.round((completedCount / targetCount) * 100));
    const isComplete = completedCount >= targetCount;

    const missing = required
      .filter((pid) => !state.posesCompleted[pid] || state.posesCompleted[pid].completedCount === 0)
      .map((pid) => YOGA_POSES.find((p) => p.id === pid)?.name || pid);

    return {
      badge,
      isUnlocked: isAlreadyUnlocked || isComplete,
      unlockedAt,
      currentValue: completedCount,
      targetValue: targetCount,
      progressPercent: isAlreadyUnlocked ? 100 : progressPercent,
      progressLabel: `${completedCount} / ${targetCount} poses mastered`,
      missingRequirements: missing,
    };
  }

  // Unique pose count (Asana Encyclopedist)
  if (badge.requiredUniquePoseCount) {
    const currentUnique = Object.keys(state.posesCompleted).length;
    const target = badge.requiredUniquePoseCount;
    const progressPercent = Math.min(100, Math.round((currentUnique / target) * 100));
    return {
      badge,
      isUnlocked: isAlreadyUnlocked || currentUnique >= target,
      unlockedAt,
      currentValue: currentUnique,
      targetValue: target,
      progressPercent: isAlreadyUnlocked ? 100 : progressPercent,
      progressLabel: `${currentUnique} / ${target} poses practiced`,
    };
  }

  // Total flow minutes (Flow Initiate / Marathoner)
  if (badge.requiredTotalFlowMinutes) {
    const historyMinutes = sessionHistory.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalMinutes = Math.max(state.totalFlowMinutes, historyMinutes);
    const target = badge.requiredTotalFlowMinutes;
    const progressPercent = Math.min(100, Math.round((totalMinutes / target) * 100));
    return {
      badge,
      isUnlocked: isAlreadyUnlocked || totalMinutes >= target,
      unlockedAt,
      currentValue: totalMinutes,
      targetValue: target,
      progressPercent: isAlreadyUnlocked ? 100 : progressPercent,
      progressLabel: `${totalMinutes} / ${target} mins completed`,
    };
  }

  // 3D Inspections (Biomechanics Scholar)
  if (badge.required3DInspections) {
    const currentCount = state.inspected3dPoseIds.length;
    const target = badge.required3DInspections;
    const progressPercent = Math.min(100, Math.round((currentCount / target) * 100));
    return {
      badge,
      isUnlocked: isAlreadyUnlocked || currentCount >= target,
      unlockedAt,
      currentValue: currentCount,
      targetValue: target,
      progressPercent: isAlreadyUnlocked ? 100 : progressPercent,
      progressLabel: `${currentCount} / ${target} 3D poses inspected`,
    };
  }

  // Streak days (Ritual Guardian)
  if (badge.requiredStreakDays) {
    const streak = user?.streakDays || (sessionHistory.length > 0 ? 4 : 0);
    const target = badge.requiredStreakDays;
    const progressPercent = Math.min(100, Math.round((streak / target) * 100));
    return {
      badge,
      isUnlocked: isAlreadyUnlocked || streak >= target,
      unlockedAt,
      currentValue: streak,
      targetValue: target,
      progressPercent: isAlreadyUnlocked ? 100 : progressPercent,
      progressLabel: `${streak} / ${target} days active streak`,
    };
  }

  return {
    badge,
    isUnlocked: isAlreadyUnlocked,
    unlockedAt,
    currentValue: 0,
    targetValue: 1,
    progressPercent: isAlreadyUnlocked ? 100 : 0,
    progressLabel: isAlreadyUnlocked ? "Completed" : "In Progress",
  };
}

export function evaluateAndUnlockBadges(
  currentState: UserMasteryState,
  sessionHistory: PracticeSessionRecord[],
  user: UserProfile | null
): { updatedState: UserMasteryState; newlyUnlockedBadges: MasteryBadge[] } {
  let newState: UserMasteryState = { ...currentState };
  let newBadges: MasteryBadge[] = [];
  let addedXp = 0;

  for (const badge of MASTERY_BADGES) {
    if (!newState.unlockedBadgeIds.includes(badge.id)) {
      const progress = calculateBadgeProgress(badge, newState, sessionHistory, user);
      if (progress.currentValue >= progress.targetValue || progress.progressPercent >= 100) {
        newBadges.push(badge);
        newState.unlockedBadgeIds = [...newState.unlockedBadgeIds, badge.id];
        newState.badgeUnlockDates = {
          ...newState.badgeUnlockDates,
          [badge.id]: new Date().toISOString(),
        };
        addedXp += badge.xpReward;
      }
    }
  }

  if (addedXp > 0) {
    newState.totalXp = newState.totalXp + addedXp;
  }
  newState.lastUpdated = new Date().toISOString();

  try {
    localStorage.setItem("flowstate_mastery_state", JSON.stringify(newState));
  } catch {}

  return { updatedState: newState, newlyUnlockedBadges: newBadges };
}
