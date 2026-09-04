import { Landmark3D, TargetPoseReference, PoseComparisonResult, JointAngleMetric } from "../types/poseTracking";

// 33 MediaPipe Pose Landmark Indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

// Canonical bone connections for rendering 2D/3D skeleton
export const POSE_CONNECTIONS: [number, number][] = [
  // Head / Torso
  [POSE_LANDMARKS.NOSE, POSE_LANDMARKS.LEFT_SHOULDER],
  [POSE_LANDMARKS.NOSE, POSE_LANDMARKS.RIGHT_SHOULDER],
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],

  // Left Arm
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
  [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
  [POSE_LANDMARKS.LEFT_WRIST, POSE_LANDMARKS.LEFT_INDEX],

  // Right Arm
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
  [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
  [POSE_LANDMARKS.RIGHT_WRIST, POSE_LANDMARKS.RIGHT_INDEX],

  // Left Leg
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
  [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
  [POSE_LANDMARKS.LEFT_ANKLE, POSE_LANDMARKS.LEFT_FOOT_INDEX],
  [POSE_LANDMARKS.LEFT_ANKLE, POSE_LANDMARKS.LEFT_HEEL],
  [POSE_LANDMARKS.LEFT_HEEL, POSE_LANDMARKS.LEFT_FOOT_INDEX],

  // Right Leg
  [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
  [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
  [POSE_LANDMARKS.RIGHT_ANKLE, POSE_LANDMARKS.RIGHT_FOOT_INDEX],
  [POSE_LANDMARKS.RIGHT_HEEL, POSE_LANDMARKS.RIGHT_FOOT_INDEX],
  [POSE_LANDMARKS.RIGHT_ANKLE, POSE_LANDMARKS.RIGHT_HEEL],
];

/**
 * Calculates 3D angle between 3 points in degrees where p2 is the joint vertex
 */
export function calculateAngle3D(
  p1: Landmark3D,
  p2: Landmark3D,
  p3: Landmark3D
): number {
  if (!p1 || !p2 || !p3) return 0;

  const v1 = {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
    z: (p1.z || 0) - (p2.z || 0),
  };

  const v2 = {
    x: p3.x - p2.x,
    y: p3.y - p2.y,
    z: (p3.z || 0) - (p2.z || 0),
  };

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

  if (mag1 === 0 || mag2 === 0) return 0;

  let cosTheta = dot / (mag1 * mag2);
  // Clamp between -1 and 1 to prevent NaN from floating point inaccuracies
  cosTheta = Math.max(-1, Math.min(1, cosTheta));

  const angleRad = Math.acos(cosTheta);
  return Math.round((angleRad * 180) / Math.PI);
}

/**
 * Compares current 33 landmarks against target reference pose
 */
export function evaluatePoseAlignment(
  currentLandmarks: Landmark3D[],
  target: TargetPoseReference
): PoseComparisonResult {
  if (!currentLandmarks || currentLandmarks.length < 33) {
    return {
      overallScore: 0,
      metrics: [],
      criticalCues: ["Awaiting user in camera frame..."],
      positiveCues: [],
      isFullyAligned: false,
    };
  }

  const metrics: JointAngleMetric[] = [];
  const criticalCues: string[] = [];
  const positiveCues: string[] = [];
  let totalScoreAcc = 0;

  for (const rule of target.keyJointMetrics) {
    const [idxA, idxB, idxC] = rule.jointTriplet;
    const pA = currentLandmarks[idxA];
    const pB = currentLandmarks[idxB];
    const pC = currentLandmarks[idxC];

    const currentAngle = calculateAngle3D(pA, pB, pC);
    const deviation = Math.abs(currentAngle - rule.targetAngle);

    let status: "aligned" | "warning" | "error" = "aligned";
    let cue = "Optimal alignment";

    if (deviation <= rule.tolerance) {
      status = "aligned";
      cue = `Aligned: ${currentAngle}° (Target: ${rule.targetAngle}°)`;
      positiveCues.push(`${rule.name} well aligned`);
      totalScoreAcc += 100;
    } else if (deviation <= rule.tolerance * 2) {
      status = "warning";
      cue = currentAngle < rule.targetAngle ? rule.lowCue : rule.highCue;
      criticalCues.push(cue);
      const partialScore = Math.max(50, 100 - (deviation - rule.tolerance) * 2.5);
      totalScoreAcc += partialScore;
    } else {
      status = "error";
      cue = currentAngle < rule.targetAngle ? rule.lowCue : rule.highCue;
      criticalCues.push(cue);
      const lowScore = Math.max(20, 50 - (deviation - rule.tolerance * 2));
      totalScoreAcc += lowScore;
    }

    metrics.push({
      id: rule.id,
      name: rule.name,
      jointTriplet: rule.jointTriplet,
      currentAngle,
      targetAngle: rule.targetAngle,
      tolerance: rule.tolerance,
      status,
      deviation,
      cue,
      muscleGroup: rule.muscleGroup,
    });
  }

  const overallScore = Math.round(
    metrics.length > 0 ? totalScoreAcc / metrics.length : 0
  );
  const isFullyAligned = overallScore >= 88;

  return {
    overallScore,
    metrics,
    criticalCues,
    positiveCues,
    isFullyAligned,
  };
}

/**
 * Creates a clean neutral T-Pose 33-landmark coordinate set
 */
export function createNeutralPose(): Landmark3D[] {
  const points: Landmark3D[] = [];
  for (let i = 0; i < 33; i++) {
    points.push({ x: 0.5, y: 0.5, z: 0, visibility: 1.0 });
  }

  // Head & shoulders
  points[POSE_LANDMARKS.NOSE] = { x: 0.5, y: 0.15, z: 0 };
  points[POSE_LANDMARKS.LEFT_SHOULDER] = { x: 0.4, y: 0.25, z: 0 };
  points[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: 0.6, y: 0.25, z: 0 };

  // Arms extended
  points[POSE_LANDMARKS.LEFT_ELBOW] = { x: 0.25, y: 0.25, z: 0 };
  points[POSE_LANDMARKS.RIGHT_ELBOW] = { x: 0.75, y: 0.25, z: 0 };
  points[POSE_LANDMARKS.LEFT_WRIST] = { x: 0.1, y: 0.25, z: 0 };
  points[POSE_LANDMARKS.RIGHT_WRIST] = { x: 0.9, y: 0.25, z: 0 };

  // Hips
  points[POSE_LANDMARKS.LEFT_HIP] = { x: 0.44, y: 0.5, z: 0 };
  points[POSE_LANDMARKS.RIGHT_HIP] = { x: 0.56, y: 0.5, z: 0 };

  // Legs
  points[POSE_LANDMARKS.LEFT_KNEE] = { x: 0.44, y: 0.72, z: 0 };
  points[POSE_LANDMARKS.RIGHT_KNEE] = { x: 0.56, y: 0.72, z: 0 };
  points[POSE_LANDMARKS.LEFT_ANKLE] = { x: 0.44, y: 0.92, z: 0 };
  points[POSE_LANDMARKS.RIGHT_ANKLE] = { x: 0.56, y: 0.92, z: 0 };
  points[POSE_LANDMARKS.LEFT_FOOT_INDEX] = { x: 0.42, y: 0.95, z: 0.05 };
  points[POSE_LANDMARKS.RIGHT_FOOT_INDEX] = { x: 0.58, y: 0.95, z: 0.05 };

  return points;
}
