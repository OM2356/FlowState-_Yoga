export interface Landmark3D {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export type JointStatus = "aligned" | "warning" | "error";

export interface JointAngleMetric {
  id: string;
  name: string;
  jointTriplet: [number, number, number]; // [jointA, centerJoint, jointC] index in 33 MediaPipe landmarks
  currentAngle: number;
  targetAngle: number;
  tolerance: number; // in degrees, e.g. 15
  status: JointStatus;
  deviation: number;
  cue: string;
  muscleGroup?: string;
}

export interface TargetPoseReference {
  id: string;
  name: string;
  sanskritName: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "Standing" | "Balance" | "Inversion" | "Forward Bend" | "Core";
  description: string;
  benefits: string[];
  cautions: string[];
  keyJointMetrics: {
    id: string;
    name: string;
    jointTriplet: [number, number, number];
    targetAngle: number;
    tolerance: number;
    lowCue: string; // when angle is too low
    highCue: string; // when angle is too high
    muscleGroup: string;
  }[];
  idealLandmarks3D: Landmark3D[];
}

export interface PoseComparisonResult {
  overallScore: number; // 0 to 100%
  metrics: JointAngleMetric[];
  criticalCues: string[];
  positiveCues: string[];
  isFullyAligned: boolean;
}

export type VideoSourceMode = "webcam" | "demo-stream" | "interactive-rig";
