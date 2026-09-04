import { TargetPoseReference, Landmark3D } from "../types/poseTracking";
import { POSE_LANDMARKS } from "../utils/poseGeometry";

function buildWarriorIILandmarks(): Landmark3D[] {
  const points: Landmark3D[] = [];
  for (let i = 0; i < 33; i++) points.push({ x: 0.5, y: 0.5, z: 0, visibility: 1.0 });

  // Head & shoulders
  points[POSE_LANDMARKS.NOSE] = { x: 0.48, y: 0.22, z: 0.05 };
  points[POSE_LANDMARKS.LEFT_SHOULDER] = { x: 0.42, y: 0.32, z: 0 };
  points[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: 0.58, y: 0.32, z: 0 };

  // Arms: stretched horizontally (parallel to floor)
  points[POSE_LANDMARKS.LEFT_ELBOW] = { x: 0.24, y: 0.32, z: 0.02 };
  points[POSE_LANDMARKS.LEFT_WRIST] = { x: 0.08, y: 0.32, z: 0.03 };
  points[POSE_LANDMARKS.RIGHT_ELBOW] = { x: 0.76, y: 0.32, z: -0.02 };
  points[POSE_LANDMARKS.RIGHT_WRIST] = { x: 0.92, y: 0.32, z: -0.03 };

  // Hips
  points[POSE_LANDMARKS.LEFT_HIP] = { x: 0.44, y: 0.55, z: 0 };
  points[POSE_LANDMARKS.RIGHT_HIP] = { x: 0.56, y: 0.55, z: 0 };

  // Left leg: bent at 90 degrees forward
  points[POSE_LANDMARKS.LEFT_KNEE] = { x: 0.32, y: 0.68, z: 0.12 };
  points[POSE_LANDMARKS.LEFT_ANKLE] = { x: 0.32, y: 0.88, z: 0.12 };
  points[POSE_LANDMARKS.LEFT_FOOT_INDEX] = { x: 0.26, y: 0.9, z: 0.18 };

  // Right leg: extended straight back at ~175 deg
  points[POSE_LANDMARKS.RIGHT_KNEE] = { x: 0.72, y: 0.72, z: -0.1 };
  points[POSE_LANDMARKS.RIGHT_ANKLE] = { x: 0.84, y: 0.88, z: -0.18 };
  points[POSE_LANDMARKS.RIGHT_FOOT_INDEX] = { x: 0.88, y: 0.9, z: -0.2 };

  return points;
}

function buildTreePoseLandmarks(): Landmark3D[] {
  const points: Landmark3D[] = [];
  for (let i = 0; i < 33; i++) points.push({ x: 0.5, y: 0.5, z: 0, visibility: 1.0 });

  // Head & shoulders
  points[POSE_LANDMARKS.NOSE] = { x: 0.5, y: 0.18, z: 0 };
  points[POSE_LANDMARKS.LEFT_SHOULDER] = { x: 0.44, y: 0.28, z: 0 };
  points[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: 0.56, y: 0.28, z: 0 };

  // Hands in Anjali Mudra (at heart center)
  points[POSE_LANDMARKS.LEFT_ELBOW] = { x: 0.38, y: 0.38, z: 0.1 };
  points[POSE_LANDMARKS.LEFT_WRIST] = { x: 0.48, y: 0.38, z: 0.15 };
  points[POSE_LANDMARKS.RIGHT_ELBOW] = { x: 0.62, y: 0.38, z: 0.1 };
  points[POSE_LANDMARKS.RIGHT_WRIST] = { x: 0.52, y: 0.38, z: 0.15 };

  // Hips
  points[POSE_LANDMARKS.LEFT_HIP] = { x: 0.45, y: 0.5, z: 0 };
  points[POSE_LANDMARKS.RIGHT_HIP] = { x: 0.55, y: 0.5, z: 0 };

  // Left leg: standing straight (180 deg)
  points[POSE_LANDMARKS.LEFT_KNEE] = { x: 0.46, y: 0.72, z: 0 };
  points[POSE_LANDMARKS.LEFT_ANKLE] = { x: 0.47, y: 0.92, z: 0 };
  points[POSE_LANDMARKS.LEFT_FOOT_INDEX] = { x: 0.47, y: 0.95, z: 0.08 };

  // Right leg: bent outward onto inner thigh
  points[POSE_LANDMARKS.RIGHT_KNEE] = { x: 0.75, y: 0.65, z: 0.05 };
  points[POSE_LANDMARKS.RIGHT_ANKLE] = { x: 0.54, y: 0.68, z: 0.04 };
  points[POSE_LANDMARKS.RIGHT_FOOT_INDEX] = { x: 0.52, y: 0.68, z: 0.06 };

  return points;
}

function buildDownwardDogLandmarks(): Landmark3D[] {
  const points: Landmark3D[] = [];
  for (let i = 0; i < 33; i++) points.push({ x: 0.5, y: 0.5, z: 0, visibility: 1.0 });

  // Inverted V shape: Hips at the apex
  points[POSE_LANDMARKS.NOSE] = { x: 0.32, y: 0.65, z: 0 };
  points[POSE_LANDMARKS.LEFT_SHOULDER] = { x: 0.34, y: 0.55, z: -0.06 };
  points[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: 0.34, y: 0.55, z: 0.06 };

  // Arms reaching down to floor
  points[POSE_LANDMARKS.LEFT_ELBOW] = { x: 0.26, y: 0.72, z: -0.06 };
  points[POSE_LANDMARKS.LEFT_WRIST] = { x: 0.18, y: 0.88, z: -0.06 };
  points[POSE_LANDMARKS.RIGHT_ELBOW] = { x: 0.26, y: 0.72, z: 0.06 };
  points[POSE_LANDMARKS.RIGHT_WRIST] = { x: 0.18, y: 0.88, z: 0.06 };

  // Apex: Pelvis / Hips high up
  points[POSE_LANDMARKS.LEFT_HIP] = { x: 0.52, y: 0.32, z: -0.05 };
  points[POSE_LANDMARKS.RIGHT_HIP] = { x: 0.52, y: 0.32, z: 0.05 };

  // Legs extending straight down to heels
  points[POSE_LANDMARKS.LEFT_KNEE] = { x: 0.68, y: 0.6, z: -0.05 };
  points[POSE_LANDMARKS.LEFT_ANKLE] = { x: 0.82, y: 0.88, z: -0.05 };
  points[POSE_LANDMARKS.RIGHT_KNEE] = { x: 0.68, y: 0.6, z: 0.05 };
  points[POSE_LANDMARKS.RIGHT_ANKLE] = { x: 0.82, y: 0.88, z: 0.05 };

  return points;
}

export const TARGET_POSES_LIBRARY: TargetPoseReference[] = [
  {
    id: "warrior-ii",
    name: "Warrior II",
    sanskritName: "Virabhadrasana II",
    difficulty: "Beginner",
    category: "Standing",
    description: "A foundational standing asana building stamina, pelvic stability, thoracic opening, and focus.",
    benefits: [
      "Deeply strengthens quadriceps, glutes, and ankle stabilizers",
      "Expands thoracic cavity and improves respiratory capacity",
      "Increases hip joint mobility and adductor flexibility",
    ],
    cautions: ["Keep front knee stacked directly over ankle; avoid collapsing inwards."],
    keyJointMetrics: [
      {
        id: "front-knee",
        name: "Front Knee (Left)",
        jointTriplet: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
        targetAngle: 90,
        tolerance: 15,
        lowCue: "Open front knee slightly — don't over-bend past 90°",
        highCue: "Sink deeper into front thigh towards a 90° angle",
        muscleGroup: "Quadriceps & Gluteus",
      },
      {
        id: "back-knee",
        name: "Back Knee (Right)",
        jointTriplet: [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
        targetAngle: 175,
        tolerance: 12,
        lowCue: "Straighten and ground your back leg actively",
        highCue: "Micro-soften back knee if locking out painfully",
        muscleGroup: "Hamstrings & Calves",
      },
      {
        id: "left-arm",
        name: "Lead Arm Extension",
        jointTriplet: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
        targetAngle: 180,
        tolerance: 15,
        lowCue: "Extend forward arm fully at shoulder height",
        highCue: "Keep forward arm parallel to floor",
        muscleGroup: "Deltoids & Triceps",
      },
      {
        id: "right-arm",
        name: "Back Arm Extension",
        jointTriplet: [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
        targetAngle: 180,
        tolerance: 15,
        lowCue: "Lift rear arm up level with shoulders",
        highCue: "Keep rear arm parallel to floor",
        muscleGroup: "Deltoids & Latissimus",
      },
      {
        id: "torso-alignment",
        name: "Spinal Alignment",
        jointTriplet: [POSE_LANDMARKS.NOSE, POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
        targetAngle: 90,
        tolerance: 18,
        lowCue: "Keep torso upright — avoid leaning forward over front leg",
        highCue: "Center your ribcage directly over pelvis",
        muscleGroup: "Erector Spinae & Core",
      },
    ],
    idealLandmarks3D: buildWarriorIILandmarks(),
  },
  {
    id: "tree-pose",
    name: "Tree Pose",
    sanskritName: "Vrksasana",
    difficulty: "Beginner",
    category: "Balance",
    description: "Classic unilateral balancing asana cultivating mental calm, proprioception, and grounded focus.",
    benefits: [
      "Builds vestibular and proprioceptive balance mechanisms",
      "Strengthens arches of feet, ankles, and spinal stabilizers",
      "Gently opens groins, inner thighs, and pelvic floor",
    ],
    cautions: ["Never place the lifted foot directly against the knee joint — place on calf or upper thigh."],
    keyJointMetrics: [
      {
        id: "standing-knee",
        name: "Standing Leg (Left)",
        jointTriplet: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
        targetAngle: 180,
        tolerance: 10,
        lowCue: "Straighten standing leg and engage the quad",
        highCue: "Avoid hyperextending standing knee",
        muscleGroup: "Quadriceps & Gluteus Medius",
      },
      {
        id: "lifted-knee",
        name: "Lifted Knee Flexion (Right)",
        jointTriplet: [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
        targetAngle: 50,
        tolerance: 20,
        lowCue: "Place foot flat against inner calf or inner thigh",
        highCue: "Open right knee out to side to deepen hip opening",
        muscleGroup: "Hip External Rotators",
      },
      {
        id: "torso-plumbline",
        name: "Upright Plumbline",
        jointTriplet: [POSE_LANDMARKS.NOSE, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
        targetAngle: 90,
        tolerance: 15,
        lowCue: "Draw naval in and lengthen crown toward ceiling",
        highCue: "Keep shoulders relaxed down away from ears",
        muscleGroup: "Core & Paraspinals",
      },
    ],
    idealLandmarks3D: buildTreePoseLandmarks(),
  },
  {
    id: "downward-dog",
    name: "Downward-Facing Dog",
    sanskritName: "Adho Mukha Svanasana",
    difficulty: "Beginner",
    category: "Inversion",
    description: "Full-body rejuvenating inversion stretching the posterior myofascial chain while energizing circulation.",
    benefits: [
      "Decompresses lumbar spine and lengthens hamstrings",
      "Strengthens wrists, forearms, shoulders, and serratus anterior",
      "Increases cerebral blood flow without strain",
    ],
    cautions: ["If hamstrings are tight, keep knees generously bent to prioritize a long spine."],
    keyJointMetrics: [
      {
        id: "hip-crease",
        name: "Hip Flexion (Apex)",
        jointTriplet: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
        targetAngle: 70,
        tolerance: 18,
        lowCue: "Press through palms to lift sit-bones higher and back",
        highCue: "Push chest gently toward thighs to deepen fold",
        muscleGroup: "Hip Flexors & Lats",
      },
      {
        id: "arm-extension",
        name: "Elbow Extension",
        jointTriplet: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
        targetAngle: 180,
        tolerance: 12,
        lowCue: "Straighten arms and press down into finger pads",
        highCue: "Avoid locking elbows rigidly",
        muscleGroup: "Triceps & Anterior Deltoids",
      },
      {
        id: "knee-extension",
        name: "Leg Extension",
        jointTriplet: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
        targetAngle: 175,
        tolerance: 15,
        lowCue: "Reach heels toward the earth and lengthen hamstrings",
        highCue: "Micro-bend knees if lower back is rounding",
        muscleGroup: "Gastrocnemius & Hamstrings",
      },
    ],
    idealLandmarks3D: buildDownwardDogLandmarks(),
  },
];
