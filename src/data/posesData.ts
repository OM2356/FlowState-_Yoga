import { YogaPose } from "../types";

export const YOGA_POSES: YogaPose[] = [
  {
    id: "tadasana",
    name: "Mountain Pose",
    sanskritName: "Tadasana",
    englishPronunciation: "tah-DAHS-anna",
    category: "standing",
    difficulty: "beginner",
    primaryMuscles: ["quadriceps", "coreAbdominals", "calvesAnkles"],
    secondaryMuscles: ["glutes", "erectorSpinae", "deltoidsShoulders"],
    benefits: ["deskPosturedetox", "energyBoost", "spineFlexibility"],
    recommendedHoldSeconds: 45,
    description: "The foundational standing blueprint for all yoga postures. Teaches rooted stability, neutral pelvic alignment, and effortless spinal elongation.",
    stepByStepInstructions: [
      "Stand with the big toes touching, heels slightly apart so your second toes are parallel.",
      "Root evenly through the four corners of each foot: inner ball, outer ball, inner heel, and outer heel.",
      "Gently lift the kneecaps by engaging your quadriceps without hyperextending.",
      "Draw the tailbone slightly downward and lift the lower belly toward your heart.",
      "Broaden your collarbones, let the arms hang relaxed beside your torso with palms softly facing forward.",
      "Lengthen through the crown of the head as if suspended by a gentle golden thread."
    ],
    breathGuide: {
      inhaleAction: "Inhale to lengthen the spine from grounded soles up through the crown.",
      exhaleAction: "Exhale to root your feet deeper into the earth, relaxing the jaw and collarbones.",
      holdNotes: "Maintain smooth diaphragmatic breath in a 4-count inhale and 4-count exhale cycle."
    },
    alignmentCues: [
      { joint: "Feet & Ankles", cue: "Equal weight distribution across the 4 corners of both feet." },
      { joint: "Pelvis & Lumbar", cue: "Neutral pelvis; avoid dumping into lower back arch." },
      { joint: "Shoulders", cue: "Drawn gently down and away from the ears, shoulder blades relaxed down the back." }
    ],
    commonMistakes: [
      { mistake: "Locking the knees backward (hyperextension)", correction: "Maintain a micro-softness in the knee joints while firming thigh muscles." },
      { mistake: "Flaring the front rib cage open", correction: "Knit the front lower ribs softly toward the hip points." }
    ],
    modifications: {
      beginner: "Stand with feet hip-width apart for enhanced balance stability.",
      advanced: "Close the eyes to challenge proprioception and internal balance.",
      propUsage: "Place a yoga block between your upper inner thighs to practice adductor engagement."
    },
    kinematics: {
      headTilt: 0,
      neckAngle: 0,
      spineCurve: 0,
      torsoAngle: 0,
      pelvisTilt: 0,
      leftShoulderAngle: 15,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 15,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 0,
      leftKneeAngle: 0,
      leftAnkleAngle: 0,
      rightHipAngle: 0,
      rightKneeAngle: 0,
      rightAnkleAngle: 0,
      elevationY: 0,
      symmetry: true,
      facing: "front",
      poseArchetype: "tadasana"
    }
  },
  {
    id: "downward-dog",
    name: "Downward-Facing Dog",
    sanskritName: "Adho Mukha Svanasana",
    englishPronunciation: "AH-doh MOO-kah shvah-NAHS-anna",
    category: "inversion",
    difficulty: "beginner",
    primaryMuscles: ["hamstrings", "calvesAnkles", "deltoidsShoulders", "latissimusDorsi"],
    secondaryMuscles: ["coreAbdominals", "quadriceps", "erectorSpinae"],
    benefits: ["spineFlexibility", "stressRelief", "runnersRecovery", "energyBoost"],
    recommendedHoldSeconds: 60,
    description: "An invigorating semi-inversion that decompresses the vertebral column, opens tight hamstrings and calves, and builds upper-body endurance.",
    stepByStepInstructions: [
      "Come onto hands and knees in tabletop with wrists under shoulders and knees under hips.",
      "Spread fingers wide, pressing firmly through the base of the index finger and thumb.",
      "Tuck toes, lift knees off the mat, and draw the sitting bones upward and backward toward the ceiling.",
      "Keep a gentle bend in the knees if hamstrings are tight to prioritize a long, straight spine.",
      "Rotate the upper outer arms inward to broaden the shoulder blades across the back.",
      "Let the neck release completely so the head hangs naturally between the upper arms."
    ],
    breathGuide: {
      inhaleAction: "Inhale into the back of your lungs, pressing the mat away to elevate the hips.",
      exhaleAction: "Exhale to soften the heels toward the mat and melt the heart toward your thighs.",
      holdNotes: "Focus on Ujjayi ocean breath, calming the nervous system."
    },
    alignmentCues: [
      { joint: "Hands & Wrists", cue: "Middle fingers point straight ahead; suction-cup palm center (Hasta Bandha)." },
      { joint: "Spine", cue: "Unbroken straight diagonal line from wrists through sit bones." },
      { joint: "Shoulders", cue: "External rotation; create space around the base of the neck." }
    ],
    commonMistakes: [
      { mistake: "Rounding the upper spine to force heels flat", correction: "Bend the knees generously and lift sit bones higher to straighten the spine first." },
      { mistake: "Collapsing weight into the wrist creases", correction: "Press down through the finger pads and index knuckle." }
    ],
    modifications: {
      beginner: "Keep knees bent and heels lifted; pedal the feet slowly.",
      advanced: "Lift one leg high into Three-Legged Dog (Eka Pada Adho Mukha Svanasana).",
      propUsage: "Place hands on two blocks under shoulders to alleviate tight wrists or shoulders."
    },
    kinematics: {
      headTilt: 45,
      neckAngle: 0,
      spineCurve: -0.1,
      torsoAngle: 55,
      pelvisTilt: -25,
      leftShoulderAngle: 170,
      leftElbowAngle: 0,
      leftWristAngle: 75,
      rightShoulderAngle: 170,
      rightElbowAngle: 0,
      rightWristAngle: 75,
      leftHipAngle: 80,
      leftKneeAngle: 10,
      leftAnkleAngle: 45,
      rightHipAngle: 80,
      rightKneeAngle: 10,
      rightAnkleAngle: 45,
      elevationY: 0.5,
      symmetry: true,
      facing: "side",
      poseArchetype: "downwardDog"
    }
  },
  {
    id: "warrior-1",
    name: "Warrior I",
    sanskritName: "Virabhadrasana I",
    englishPronunciation: "veer-uh-buh-DRAHS-anna",
    category: "standing",
    difficulty: "beginner",
    primaryMuscles: ["quadriceps", "hipFlexors", "glutes", "deltoidsShoulders"],
    secondaryMuscles: ["calvesAnkles", "coreAbdominals", "erectorSpinae"],
    benefits: ["hipMobility", "coreStrength", "energyBoost", "stressRelief"],
    recommendedHoldSeconds: 45,
    description: "A fierce grounding posture that develops tremendous leg stability, releases deep psoas tightness, and elevates chest vitality.",
    stepByStepInstructions: [
      "From Mountain Pose, step the left foot back about 3.5 to 4 feet.",
      "Turn the back left foot out at a 45-degree angle with the heel firmly anchored.",
      "Bend the right knee directly over the right ankle, tracking toward the second toe.",
      "Square the hip points forward toward the front edge of the mat.",
      "Inhale to sweep both arms overhead, biceps beside the ears with palms facing each other.",
      "Soften the shoulders down as you lift your sternum toward the sky."
    ],
    breathGuide: {
      inhaleAction: "Inhale to draw prana upwards through the side body and fingertips.",
      exhaleAction: "Exhale to sink the front thigh closer to parallel while anchoring the back heel.",
      holdNotes: "Stay steady, feeling the simultaneous grounding downwards and expansion upwards."
    },
    alignmentCues: [
      { joint: "Front Knee", cue: "Stacked right over the ankle at 90 degrees; don't let it overshoot the toes." },
      { joint: "Back Foot", cue: "Press the outer edge of the back foot firmly into the ground." },
      { joint: "Hips", cue: "Draw the front hip back and roll the back hip forward to square." }
    ],
    commonMistakes: [
      { mistake: "Letting the back heel lift off the ground", correction: "Shorten your stance slightly until the back heel grounds with strong arch support." },
      { mistake: "Arching excessively in the lower lumbar spine", correction: "Engage the core and lengthen the tailbone down toward the floor." }
    ],
    modifications: {
      beginner: "Widen feet hip-width apart like standing on railroad tracks.",
      advanced: "Bring palms together overhead and gaze up at thumbs in a gentle upper-back arch.",
      propUsage: "Perform with hands on hips to focus solely on pelvic alignment."
    },
    kinematics: {
      headTilt: -15,
      neckAngle: 0,
      spineCurve: 0.2,
      torsoAngle: 0,
      pelvisTilt: 10,
      leftShoulderAngle: 175,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 175,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 85,
      leftKneeAngle: 90,
      leftAnkleAngle: 85,
      rightHipAngle: -25,
      rightKneeAngle: 0,
      rightAnkleAngle: 45,
      elevationY: 0.3,
      symmetry: false,
      facing: "side",
      poseArchetype: "warrior1"
    }
  },
  {
    id: "warrior-2",
    name: "Warrior II",
    sanskritName: "Virabhadrasana II",
    englishPronunciation: "veer-uh-buh-DRAHS-anna TWO",
    category: "standing",
    difficulty: "beginner",
    primaryMuscles: ["quadriceps", "glutes", "deltoidsShoulders", "hipFlexors"],
    secondaryMuscles: ["coreAbdominals", "calvesAnkles", "pectoralisChest"],
    benefits: ["hipMobility", "coreStrength", "energyBoost", "deskPosturedetox"],
    recommendedHoldSeconds: 45,
    description: "An expansive, open-hip posture embodying calm focused strength. Stimulates circulation throughout the hips and tones the lower body.",
    stepByStepInstructions: [
      "Step feet wide apart, about 4 to 4.5 feet.",
      "Turn the front right foot 90 degrees out and back left foot slightly inward (about 5-10 degrees).",
      "Align the front heel with the arch of the back foot.",
      "Bend front right knee to 90 degrees directly above the ankle.",
      "Extend arms out parallel to the floor, actively reaching forward and backward.",
      "Gaze serenely over the front middle fingertip (Drishti)."
    ],
    breathGuide: {
      inhaleAction: "Inhale to expand the wingspan of your arms and lengthen the spine.",
      exhaleAction: "Exhale to settle into the hips and ground both feet firmly into the mat.",
      holdNotes: "Breathe through the nose with ease; soften tension in the trapezius."
    },
    alignmentCues: [
      { joint: "Front Knee", cue: "Press gently outward toward the pinky toe side to keep knee tracking safely." },
      { joint: "Torso", cue: "Shoulders stacked directly over hips; avoid leaning forward." },
      { joint: "Arms", cue: "Parallel to the earth, engaged from the back of the shoulder blades." }
    ],
    commonMistakes: [
      { mistake: "Front knee collapsing inward toward the midline", correction: "Engage the outer right glute to pull the knee open over the second toe." },
      { mistake: "Hunching shoulders up by the ears", correction: "Slide shoulder blades down the ribcage while keeping arms energetic." }
    ],
    modifications: {
      beginner: "Do not bend the front knee all the way to 90 degrees; work at 60-70 degrees.",
      advanced: "Deepen the front thigh fully horizontal to the mat and hold for 10 full breaths.",
      propUsage: "Rest front hand lightly on a block if resting or recovering from fatigue."
    },
    kinematics: {
      headTilt: 0,
      neckAngle: 80,
      spineCurve: 0,
      torsoAngle: 0,
      pelvisTilt: 0,
      leftShoulderAngle: 90,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 90,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 80,
      leftKneeAngle: 90,
      leftAnkleAngle: 85,
      rightHipAngle: 30,
      rightKneeAngle: 0,
      rightAnkleAngle: 85,
      elevationY: 0.35,
      symmetry: false,
      facing: "front",
      poseArchetype: "warrior2"
    }
  },
  {
    id: "warrior-3",
    name: "Warrior III",
    sanskritName: "Virabhadrasana III",
    englishPronunciation: "veer-uh-buh-DRAHS-anna THREE",
    category: "balance",
    difficulty: "intermediate",
    primaryMuscles: ["hamstrings", "glutes", "coreAbdominals", "erectorSpinae"],
    secondaryMuscles: ["deltoidsShoulders", "calvesAnkles", "quadriceps"],
    benefits: ["coreStrength", "runnersRecovery", "energyBoost", "spineFlexibility"],
    recommendedHoldSeconds: 30,
    description: "A dynamic balance pose forming a horizontal 'T' shape. Tests whole-body kinetic integration, stabilizes ankles, and reinforces deep core stability.",
    stepByStepInstructions: [
      "Start in Warrior I or High Lunge with right leg forward.",
      "Shift weight onto the right standing foot, hinging at the hips forward.",
      "Simultaneously float the back left leg off the mat until parallel with the floor.",
      "Reach arms forward alongside the ears or back in an airplane wing variation.",
      "Flex the back left foot, pointing toes straight down to keep hips squared.",
      "Maintain a strong straight line from fingertips through the back heel."
    ],
    breathGuide: {
      inhaleAction: "Inhale to lengthen horizontally from fingertips to the back heel.",
      exhaleAction: "Exhale to draw the navel tight to the spine for balance stabilization.",
      holdNotes: "Keep your gaze steady on a single unmoving point on the floor 3 feet ahead."
    },
    alignmentCues: [
      { joint: "Hips", cue: "Both hip bones level and pointing straight toward the floor." },
      { joint: "Standing Leg", cue: "Micro-bend the knee to avoid locking joint; engage outer hip." },
      { joint: "Neck", cue: "Back of the neck long; gaze down toward the floor." }
    ],
    commonMistakes: [
      { mistake: "Opening the lifted hip toward the ceiling", correction: "Internally rotate the back thigh so pinky toe points straight down." },
      { mistake: "Sagging the chest toward the ground", correction: "Engage the back muscles and lift the chest to match the height of the back leg." }
    ],
    modifications: {
      beginner: "Keep hands on blocks on the floor or bring hands to prayer at heart center.",
      advanced: "Arms extended forward, interlocking thumbs and pulsing back leg slightly.",
      propUsage: "Place hands on the back of a sturdy chair for balance support."
    },
    kinematics: {
      headTilt: 0,
      neckAngle: 0,
      spineCurve: 0,
      torsoAngle: 90,
      pelvisTilt: 0,
      leftShoulderAngle: 180,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 180,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 90,
      leftKneeAngle: 0,
      leftAnkleAngle: 0,
      rightHipAngle: -90,
      rightKneeAngle: 0,
      rightAnkleAngle: 90,
      elevationY: 0,
      symmetry: false,
      facing: "side",
      poseArchetype: "warrior3"
    }
  },
  {
    id: "tree-pose",
    name: "Tree Pose",
    sanskritName: "Vrksasana",
    englishPronunciation: "vrik-SHAH-sah-nah",
    category: "balance",
    difficulty: "beginner",
    primaryMuscles: ["calvesAnkles", "hipFlexors", "glutes"],
    secondaryMuscles: ["coreAbdominals", "quadriceps"],
    benefits: ["stressRelief", "hipMobility", "energyBoost"],
    recommendedHoldSeconds: 45,
    description: "A calming yet grounding balance posture that develops ankle stability, opens the hip rotators, and cultivates mental centering.",
    stepByStepInstructions: [
      "Begin in Mountain Pose with weight evenly distributed on both feet.",
      "Shift weight onto your left foot, anchoring it deep into the mat.",
      "Bend the right knee, rotating the right hip outward.",
      "Place the sole of the right foot against the inner left ankle, calf, or inner thigh (never directly on the knee joint).",
      "Press the foot and the inner standing thigh firmly against one another.",
      "Bring hands to Anjali Mudra (prayer at heart center) or grow your branches overhead."
    ],
    breathGuide: {
      inhaleAction: "Inhale to lengthen up through the spine and reach higher.",
      exhaleAction: "Exhale to root your standing foot down, feeling steady like a redwood tree.",
      holdNotes: "If you wobble, embrace the subtle micro-adjustments as your nervous system learns balance."
    },
    alignmentCues: [
      { joint: "Standing Knee", cue: "Micro-soft; engage thigh and outer glute." },
      { joint: "Foot Placement", cue: "Above or below the knee joint; never pressing sideways on the knee." },
      { joint: "Pelvis", cue: "Keep hip points level; do not let standing hip jut out sideways." }
    ],
    commonMistakes: [
      { mistake: "Pressing the foot directly against the side of the knee joint", correction: "Lower to the calf or elevate all the way to the inner groin." },
      { mistake: "Sinking into the standing hip", correction: "Firm the outer standing hip muscle to keep pelvis neutral." }
    ],
    modifications: {
      beginner: "Keep right toes lightly kickstanded on the floor with heel resting against ankle.",
      advanced: "Close eyes or gaze up to the ceiling while in full tree expression.",
      propUsage: "Stand near a wall and rest one hand on it for balance security."
    },
    kinematics: {
      headTilt: 0,
      neckAngle: 0,
      spineCurve: 0,
      torsoAngle: 0,
      pelvisTilt: 0,
      leftShoulderAngle: 15,
      leftElbowAngle: 60,
      leftWristAngle: 0,
      rightShoulderAngle: 15,
      rightElbowAngle: 60,
      rightWristAngle: 0,
      leftHipAngle: 0,
      leftKneeAngle: 0,
      leftAnkleAngle: 0,
      rightHipAngle: 50,
      rightKneeAngle: 120,
      rightAnkleAngle: 0,
      elevationY: 0,
      symmetry: false,
      facing: "front",
      poseArchetype: "tree"
    }
  },
  {
    id: "triangle-pose",
    name: "Extended Triangle Pose",
    sanskritName: "Utthita Trikonasana",
    englishPronunciation: "oo-TEE-tah tree-koh-NAHS-anna",
    category: "standing",
    difficulty: "beginner",
    primaryMuscles: ["hamstrings", "hipFlexors", "latissimusDorsi", "coreAbdominals"],
    secondaryMuscles: ["quadriceps", "deltoidsShoulders", "calvesAnkles"],
    benefits: ["spineFlexibility", "hipMobility", "lowerBackPain", "deskPosturedetox"],
    recommendedHoldSeconds: 45,
    description: "A foundational lateral stretch that decompresses the thoracic spine, elongates the hamstrings, and stimulates abdominal digestion.",
    stepByStepInstructions: [
      "From standing, step feet 3.5 to 4 feet apart.",
      "Turn the front right foot 90 degrees out and back left foot slightly inward.",
      "Extend both arms parallel to the floor, reaching out through the fingertips.",
      "Reach forward with your right torso directly over the right leg, hinging at the right hip crease.",
      "Lower the right hand to the right shin, ankle, or a block outside the right foot.",
      "Reach the left arm straight up toward the sky, opening the chest like a book."
    ],
    breathGuide: {
      inhaleAction: "Inhale to expand the ribs and lengthen both sides of the waist equally.",
      exhaleAction: "Exhale to rotate the heart subtly toward the sky, staying light on bottom hand.",
      holdNotes: "Smooth, continuous breath; do not dump body weight into the bottom wrist."
    },
    alignmentCues: [
      { joint: "Spine", cue: "Keep both sides of the waist long; avoid collapsing into the bottom side." },
      { joint: "Front Knee", cue: "Straight but not hyperextended; engage quadricep." },
      { joint: "Chest", cue: "Stacked ribcage; imagine leaning your back against a flat wall." }
    ],
    commonMistakes: [
      { mistake: "Rounding the upper back forward to reach the floor", correction: "Place hand on shin or a high block so your chest remains open and broad." },
      { mistake: "Hyperextending the front knee joint", correction: "Keep a micro-bend and actively pull kneecap upward." }
    ],
    modifications: {
      beginner: "Place a yoga block on its tallest setting directly behind the front ankle.",
      advanced: "Hover the bottom arm parallel to the top arm (core challenge).",
      propUsage: "Lean upper back against a wall to master planar alignment."
    },
    kinematics: {
      headTilt: 45,
      neckAngle: 0,
      spineCurve: 0,
      torsoAngle: 60,
      pelvisTilt: 20,
      leftShoulderAngle: 180,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 0,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 45,
      leftKneeAngle: 0,
      leftAnkleAngle: 0,
      rightHipAngle: -45,
      rightKneeAngle: 0,
      rightAnkleAngle: 0,
      elevationY: 0.15,
      symmetry: false,
      facing: "front",
      poseArchetype: "triangle"
    }
  },
  {
    id: "child-pose",
    name: "Child's Pose",
    sanskritName: "Balasana",
    englishPronunciation: "bah-LAHS-anna",
    category: "seatedRestorative",
    difficulty: "beginner",
    primaryMuscles: ["erectorSpinae", "glutes", "latissimusDorsi"],
    secondaryMuscles: ["calvesAnkles", "hipFlexors"],
    benefits: ["stressRelief", "lowerBackPain", "sleepQuality", "spineFlexibility"],
    recommendedHoldSeconds: 90,
    description: "A sanctuary posture for deep nervous system recovery. Gently stretches the hips, thighs, and ankles while calming brain activity.",
    stepByStepInstructions: [
      "Kneel on the mat with big toes touching and knees spread wide to the mat edges.",
      "Sit back onto your heels and exhale to fold your torso forward between your thighs.",
      "Rest your forehead comfortably onto the mat.",
      "Extend your arms out long in front with palms grounded, or sweep them back alongside your hips.",
      "Allow your belly to soften between your thighs and let your spine drape like a soft blanket."
    ],
    breathGuide: {
      inhaleAction: "Inhale into the back of your lungs and lower back, feeling the kidneys expand.",
      exhaleAction: "Exhale to surrender all physical and mental weight into the support of the earth.",
      holdNotes: "Deep, slow, continuous belly breathing."
    },
    alignmentCues: [
      { joint: "Hips & Heels", cue: "Sink hips heavily toward heels; use a folded blanket under sit bones if needed." },
      { joint: "Forehead", cue: "Resting comfortably on the mat or block to stimulate the parasympathetic nerve point." },
      { joint: "Shoulders", cue: "Relaxed; elbows can rest softly on the floor." }
    ],
    commonMistakes: [
      { mistake: "Hips floating high in the air due to tight hips", correction: "Place a folded blanket or bolster between calves and thighs for support." },
      { mistake: "Straining the neck by looking forward", correction: "Keep forehead grounded so the cervical spine is completely neutral." }
    ],
    modifications: {
      beginner: "Keep knees closer together or place a pillow under torso.",
      advanced: "Side-stretch variation: walk hands 45 degrees to the right, then left for deep lat stretch.",
      propUsage: "Place a bolster lengthwise under the chest for restorative practice."
    },
    kinematics: {
      headTilt: 80,
      neckAngle: 0,
      spineCurve: -0.6,
      torsoAngle: 90,
      pelvisTilt: -60,
      leftShoulderAngle: 170,
      leftElbowAngle: 15,
      leftWristAngle: 0,
      rightShoulderAngle: 170,
      rightElbowAngle: 15,
      rightWristAngle: 0,
      leftHipAngle: 130,
      leftKneeAngle: 150,
      leftAnkleAngle: 40,
      rightHipAngle: 130,
      rightKneeAngle: 150,
      rightAnkleAngle: 40,
      elevationY: 0.9,
      symmetry: true,
      facing: "side",
      poseArchetype: "childPose"
    }
  },
  {
    id: "cobra-pose",
    name: "Cobra Pose",
    sanskritName: "Bhujangasana",
    englishPronunciation: "boo-jang-GAHS-anna",
    category: "backbend",
    difficulty: "beginner",
    primaryMuscles: ["erectorSpinae", "latissimusDorsi", "pectoralisChest"],
    secondaryMuscles: ["glutes", "deltoidsShoulders", "coreAbdominals"],
    benefits: ["deskPosturedetox", "spineFlexibility", "lowerBackPain", "energyBoost"],
    recommendedHoldSeconds: 30,
    description: "An invigorating prone backbend that strengthens the spine, expands the chest and lung capacity, and combats forward-slumped desk posture.",
    stepByStepInstructions: [
      "Lie face down on the mat with legs extended straight back, tops of the feet grounded.",
      "Place hands flat on the mat under your shoulders, hugging elbows close to your ribcage.",
      "Press the pubic bone and tops of all ten toes firmly into the floor.",
      "Inhale to gently lift the chest off the floor using back muscle strength rather than pushing with arms.",
      "Keep the back of the neck long and gaze softly at the floor about two feet ahead.",
      "Roll shoulders back and down away from the ears."
    ],
    breathGuide: {
      inhaleAction: "Inhale to pull the heart forward through the gates of the shoulders.",
      exhaleAction: "Exhale to anchor the pelvis and soften the shoulder blades down.",
      holdNotes: "Avoid holding your breath; keep a steady buoyant rhythm in the ribcage."
    },
    alignmentCues: [
      { joint: "Elbows", cue: "Drawn back toward hip points; do not let elbows wing outward." },
      { joint: "Lower Back", cue: "Distribute the backbend evenly throughout the thoracic upper spine." },
      { joint: "Feet", cue: "Tops of feet glued to the floor; do not allow heels to splay apart." }
    ],
    commonMistakes: [
      { mistake: "Pushing hard with arms and crunching into the lower lumbar spine", correction: "Hover hands off the mat for a second to verify you are using back extensor strength." },
      { mistake: "Throwing the head back and pinching the cervical spine", correction: "Keep the chin slightly tucked so the neck follows the natural spine curve." }
    ],
    modifications: {
      beginner: "Sphinx Pose: rest on forearms with elbows directly under shoulders.",
      advanced: "Straighten arms more into High Cobra or King Cobra with bent knees.",
      propUsage: "Place a folded blanket under the pelvis for hip point comfort."
    },
    kinematics: {
      headTilt: -25,
      neckAngle: 0,
      spineCurve: 0.5,
      torsoAngle: -45,
      pelvisTilt: 0,
      leftShoulderAngle: 40,
      leftElbowAngle: 90,
      leftWristAngle: 70,
      rightShoulderAngle: 40,
      rightElbowAngle: 90,
      rightWristAngle: 70,
      leftHipAngle: 0,
      leftKneeAngle: 0,
      leftAnkleAngle: 20,
      rightHipAngle: 0,
      rightKneeAngle: 0,
      rightAnkleAngle: 20,
      elevationY: 0.8,
      symmetry: true,
      facing: "side",
      poseArchetype: "cobra"
    }
  },
  {
    id: "upward-facing-dog",
    name: "Upward-Facing Dog",
    sanskritName: "Urdhva Mukha Svanasana",
    englishPronunciation: "OORD-vah MOO-kah shvah-NAHS-anna",
    category: "backbend",
    difficulty: "intermediate",
    primaryMuscles: ["pectoralisChest", "deltoidsShoulders", "erectorSpinae", "quadriceps"],
    secondaryMuscles: ["coreAbdominals", "latissimusDorsi", "glutes"],
    benefits: ["deskPosturedetox", "energyBoost", "spineFlexibility", "coreStrength"],
    recommendedHoldSeconds: 30,
    description: "A powerful full-body backbend where only the hands and tops of the feet touch the floor. Opens the anterior chain and builds strong wrists and arms.",
    stepByStepInstructions: [
      "From prone or Chaturanga, roll over the toes onto the tops of the feet.",
      "Press firmly down through the palms to straighten the arms fully.",
      "Lift thighs, knees, and hips completely off the mat.",
      "Broaden through the collarbones and draw the chest forward between the upper arms.",
      "Firm the glutes slightly and press the tops of the feet down with strength."
    ],
    breathGuide: {
      inhaleAction: "Inhale deeply, drawing the chest up and forward.",
      exhaleAction: "Exhale to roll shoulders back and broaden the sternum.",
      holdNotes: "Maintain strong press through palms to avoid collapsing into shoulders."
    },
    alignmentCues: [
      { joint: "Wrists & Shoulders", cue: "Wrists directly beneath the shoulders." },
      { joint: "Thighs", cue: "Lifted 2-3 inches clear of the floor; active kneecaps." },
      { joint: "Chest", cue: "Sternum leading forward, shoulder blades pinching slightly together on the back." }
    ],
    commonMistakes: [
      { mistake: "Letting knees and thighs rest on the floor", correction: "Engage quadriceps powerfully and press through the tops of the feet to levitate legs." },
      { mistake: "Shoulders creeping up to the ears", correction: "Press the floor away and draw shoulder blades down toward your back pockets." }
    ],
    modifications: {
      beginner: "Substitute Cobra Pose with hips on the ground.",
      advanced: "Smooth seamless transition rolling over the toes straight back into Downward Dog.",
      propUsage: "Place hands on blocks to elevate torso if shoulders are tight."
    },
    kinematics: {
      headTilt: -30,
      neckAngle: 0,
      spineCurve: 0.65,
      torsoAngle: -60,
      pelvisTilt: 10,
      leftShoulderAngle: 10,
      leftElbowAngle: 0,
      leftWristAngle: 85,
      rightShoulderAngle: 10,
      rightElbowAngle: 0,
      rightWristAngle: 85,
      leftHipAngle: -10,
      leftKneeAngle: 0,
      leftAnkleAngle: 25,
      rightHipAngle: -10,
      rightKneeAngle: 0,
      rightAnkleAngle: 25,
      elevationY: 0.65,
      symmetry: true,
      facing: "side",
      poseArchetype: "upwardDog"
    }
  },
  {
    id: "pigeon-pose",
    name: "Half Pigeon Pose",
    sanskritName: "Eka Pada Rajakapotasana",
    englishPronunciation: "EH-kah PAH-dah rah-JAH-kah-poh-TAHS-anna",
    category: "forwardBend",
    difficulty: "intermediate",
    primaryMuscles: ["glutes", "hipFlexors"],
    secondaryMuscles: ["hamstrings", "erectorSpinae", "quadriceps"],
    benefits: ["hipMobility", "lowerBackPain", "stressRelief", "sleepQuality"],
    recommendedHoldSeconds: 90,
    description: "The classic deep hip opener targeting the piriformis, gluteus medius, and psoas. Releases deep emotional and physical tension held in the pelvic bowl.",
    stepByStepInstructions: [
      "From Downward Dog, sweep the right leg forward and place the right knee behind the right wrist.",
      "Angle the right foot toward the left hip (parallel shin is advanced; angled shin is safer for knees).",
      "Slide the back left leg straight back, top of the foot grounded, hips squared to the front.",
      "Inhale to sit up tall through your spine.",
      "Exhale to walk your hands forward, draping your torso over the front shin onto forearms or a resting block."
    ],
    breathGuide: {
      inhaleAction: "Inhale to send breath and spaciousness into the outer right hip crease.",
      exhaleAction: "Exhale to surrender micro-tensions, allowing gravity to gently open the hip.",
      holdNotes: "Long, restorative 5-second inhales and 6-second exhales."
    },
    alignmentCues: [
      { joint: "Right Ankle", cue: "Flex the front right foot to protect the right knee joint ligament." },
      { joint: "Hips", cue: "Keep both hip points equidistant from the floor; do not collapse onto the right buttock." },
      { joint: "Back Leg", cue: "Reaching directly straight back from the hip, not angled outward." }
    ],
    commonMistakes: [
      { mistake: "Collapsing entirely onto the right outer hip and twisting the spine", correction: "Slide a block or folded blanket beneath the right sitting bone for level hips." },
      { mistake: "Feeling sharp pain in the front knee", correction: "Immediately back out and switch to Reclined Figure Four (Thread the Needle) on your back." }
    ],
    modifications: {
      beginner: "Figure Four (Supta Kapotasana) on your back crossing right ankle over left knee.",
      advanced: "Mermaid or King Pigeon binding with the back foot in the crook of the elbow.",
      propUsage: "Place a bolster under your chest and a block under your front hip."
    },
    kinematics: {
      headTilt: 45,
      neckAngle: 0,
      spineCurve: -0.2,
      torsoAngle: 45,
      pelvisTilt: 0,
      leftShoulderAngle: 120,
      leftElbowAngle: 90,
      leftWristAngle: 0,
      rightShoulderAngle: 120,
      rightElbowAngle: 90,
      rightWristAngle: 0,
      leftHipAngle: 100,
      leftKneeAngle: 90,
      leftAnkleAngle: 30,
      rightHipAngle: -10,
      rightKneeAngle: 0,
      rightAnkleAngle: 20,
      elevationY: 0.85,
      symmetry: false,
      facing: "side",
      poseArchetype: "pigeon"
    }
  },
  {
    id: "bridge-pose",
    name: "Bridge Pose",
    sanskritName: "Setu Bandhasana",
    englishPronunciation: "SAY-too BAHN-dah-sah-nah",
    category: "backbend",
    difficulty: "beginner",
    primaryMuscles: ["glutes", "hamstrings", "erectorSpinae"],
    secondaryMuscles: ["quadriceps", "pectoralisChest", "coreAbdominals"],
    benefits: ["lowerBackPain", "deskPosturedetox", "stressRelief", "spineFlexibility"],
    recommendedHoldSeconds: 45,
    description: "A therapeutic backbend that stimulates the thyroid, opens the chest, and reverses prolonged sitting fatigue by firing the posterior chain.",
    stepByStepInstructions: [
      "Lie on your back with knees bent and feet flat on the floor, hip-width apart.",
      "Walk your heels close enough to your sit bones that your fingertips can lightly graze the heels.",
      "Press feet and upper arms firmly into the floor.",
      "Exhale to lift your hips toward the sky, rolling up the spine vertebra by vertebra.",
      "Clasp hands beneath your pelvis, rolling onto the outer edges of your shoulders.",
      "Keep thighs parallel, pressing through the big toe mounds."
    ],
    breathGuide: {
      inhaleAction: "Inhale to puff the chest upward toward the chin (chin stays pointing up).",
      exhaleAction: "Exhale to ground down through heels and engage glutes firmly.",
      holdNotes: "Breathe into the front of the hips and belly."
    },
    alignmentCues: [
      { joint: "Knees", cue: "Knees stacked directly over ankles, staying parallel (do not let knees splay out)." },
      { joint: "Neck", cue: "Keep head still and gaze straight up; never turn head sideways while hips are lifted." },
      { joint: "Chest", cue: "Sternum lifts toward chin while chin stays pointing away from chest to preserve cervical curve." }
    ],
    commonMistakes: [
      { mistake: "Letting knees splay out wide to the sides", correction: "Imagine squeezing a yoga block between the upper thighs to activate adductors." },
      { mistake: "Over-squeezing glutes so much that hips internally pinch", correction: "Focus on driving downward through the heels and lengthening thighs forward." }
    ],
    modifications: {
      beginner: "Restorative Bridge: slide a yoga block under the sacrum on low or medium height.",
      advanced: "One-Legged Bridge (Eka Pada Setu Bandhasana) extending one leg vertical to the sky.",
      propUsage: "Yoga block between knees or under sacrum."
    },
    kinematics: {
      headTilt: 0,
      neckAngle: 0,
      spineCurve: 0.5,
      torsoAngle: -35,
      pelvisTilt: 25,
      leftShoulderAngle: -20,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: -20,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: -25,
      leftKneeAngle: 85,
      leftAnkleAngle: 85,
      rightHipAngle: -25,
      rightKneeAngle: 85,
      rightAnkleAngle: 85,
      elevationY: 0.7,
      symmetry: true,
      facing: "side",
      poseArchetype: "bridge"
    }
  },
  {
    id: "chair-pose",
    name: "Chair Pose",
    sanskritName: "Utkatasana",
    englishPronunciation: "OOT-kah-TAHS-anna",
    category: "standing",
    difficulty: "beginner",
    primaryMuscles: ["quadriceps", "glutes", "coreAbdominals", "deltoidsShoulders"],
    secondaryMuscles: ["calvesAnkles", "erectorSpinae"],
    benefits: ["coreStrength", "energyBoost", "runnersRecovery"],
    recommendedHoldSeconds: 45,
    description: "The 'Fierce Pose' builds formidable heat and lower body power while strengthening the ankles and opening the shoulder girdle.",
    stepByStepInstructions: [
      "Begin in Mountain Pose with big toes touching and heels slightly separated.",
      "Inhale to sweep both arms overhead, biceps framing your ears.",
      "Exhale to bend knees deeply, shifting weight back into the heels as if sitting into an imaginary low chair.",
      "Draw the tailbone slightly down and pull the belly button toward your spine.",
      "Keep chest lifted and gaze forward and slightly up."
    ],
    breathGuide: {
      inhaleAction: "Inhale to elevate the heart and reach higher through the fingers.",
      exhaleAction: "Exhale to sit 1 inch deeper into the heels, keeping the spine long.",
      holdNotes: "Stay relaxed in the face and throat despite the fiery leg heat."
    },
    alignmentCues: [
      { joint: "Knees & Toes", cue: "Knees stay behind the toes when glancing down; weight is in heels." },
      { joint: "Spine", cue: "Maintain natural spinal curvature without extreme swayback." },
      { joint: "Arms", cue: "Shoulders soft, triceps engaged, pinkies rotating slightly inward." }
    ],
    commonMistakes: [
      { mistake: "Knees projecting far forward past the toes", correction: "Hinge deeper at the hips and sit your glutes back like reaching for a low bench." },
      { mistake: "Excessive lumbar hyperextension (duck butt)", correction: "Draw the front ribs in and gently lengthen tailbone down." }
    ],
    modifications: {
      beginner: "Separate feet hip-distance apart and keep hands at heart center in prayer.",
      advanced: "Revolved Chair Pose (Parivrtta Utkatasana) hooking left elbow outside right knee.",
      propUsage: "Place a block between thighs to build adductor firing awareness."
    },
    kinematics: {
      headTilt: -15,
      neckAngle: 0,
      spineCurve: 0.1,
      torsoAngle: 40,
      pelvisTilt: 15,
      leftShoulderAngle: 160,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 160,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 75,
      leftKneeAngle: 85,
      leftAnkleAngle: 65,
      rightHipAngle: 75,
      rightKneeAngle: 85,
      rightAnkleAngle: 65,
      elevationY: 0.35,
      symmetry: true,
      facing: "side",
      poseArchetype: "chair"
    }
  },
  {
    id: "crow-pose",
    name: "Crow Pose",
    sanskritName: "Bakasana",
    englishPronunciation: "bah-KAHS-anna",
    category: "balance",
    difficulty: "advanced",
    primaryMuscles: ["coreAbdominals", "deltoidsShoulders", "pectoralisChest"],
    secondaryMuscles: ["latissimusDorsi", "glutes", "calvesAnkles"],
    benefits: ["coreStrength", "energyBoost", "stressRelief"],
    recommendedHoldSeconds: 25,
    description: "The definitive beginner-to-intermediate arm balance. Teaches core compression, wrist loading tolerance, and buoyant lift through the pelvic floor.",
    stepByStepInstructions: [
      "Begin in a deep squat (Malasana) with feet close together.",
      "Plant hands flat on the mat shoulder-width apart, fingers spread wide like starfishes.",
      "Lift hips high, come onto the balls of the feet, and place knees onto the backs of your upper triceps.",
      "Shift body weight forward into your hands, looking slightly ahead onto the floor (not back at feet).",
      "Engage your deep core, lifting one foot off the mat, then the other, bringing big toes to touch in midair."
    ],
    breathGuide: {
      inhaleAction: "Inhale to hollow the belly and round the upper back (cat spine).",
      exhaleAction: "Exhale to hug inner knees against triceps and lift heels closer to sit bones.",
      holdNotes: "Breathe steadily; balance comes from weight distribution, not pure arm strength."
    },
    alignmentCues: [
      { joint: "Gaze (Drishti)", cue: "Look forward 1 foot ahead; looking down makes you tip forward." },
      { joint: "Hands", cue: "Fingers clawing the mat slightly (Hasta Bandha) to micro-control balance." },
      { joint: "Core", cue: "Mula bandha and uddiyana bandha engaged to create lightness." }
    ],
    commonMistakes: [
      { mistake: "Looking backward at the feet", correction: "Look forward to keep your center of mass balanced over wrists." },
      { mistake: "Jumping into the pose with momentum", correction: "Shift weight forward slowly until feet lift organically through lightness." }
    ],
    modifications: {
      beginner: "Place a block under the feet to start with elevated hips, or place a pillow in front of face.",
      advanced: "Straighten arms into Crane Pose (Bakasana) with knees locked in armpits.",
      propUsage: "Rest forehead on a tall block to practice the leg lift with confidence."
    },
    kinematics: {
      headTilt: -30,
      neckAngle: 0,
      spineCurve: -0.5,
      torsoAngle: 45,
      pelvisTilt: -30,
      leftShoulderAngle: 80,
      leftElbowAngle: 60,
      leftWristAngle: 90,
      rightShoulderAngle: 80,
      rightElbowAngle: 60,
      rightWristAngle: 90,
      leftHipAngle: 120,
      leftKneeAngle: 140,
      leftAnkleAngle: 20,
      rightHipAngle: 120,
      rightKneeAngle: 140,
      rightAnkleAngle: 20,
      elevationY: 0.6,
      symmetry: true,
      facing: "side",
      poseArchetype: "crow"
    }
  },
  {
    id: "boat-pose",
    name: "Boat Pose",
    sanskritName: "Navasana",
    englishPronunciation: "nah-VAHS-anna",
    category: "balance",
    difficulty: "intermediate",
    primaryMuscles: ["coreAbdominals", "hipFlexors", "erectorSpinae"],
    secondaryMuscles: ["quadriceps", "deltoidsShoulders"],
    benefits: ["coreStrength", "digestion", "energyBoost", "spineFlexibility"],
    recommendedHoldSeconds: 30,
    description: "An intensive core strengthener that activates the rectus abdominis, transverse abdominals, and hip flexors while training upright spinal balance.",
    stepByStepInstructions: [
      "Sit on the floor with knees bent and feet flat on the mat.",
      "Hold onto the backs of your thighs and lean back slightly, balancing between sit bones and tailbone.",
      "Lift feet off the floor, bringing shins parallel to the mat (bent-knee variation).",
      "Engage lower abdominals and extend arms straight forward alongside knees, palms facing inward.",
      "If comfortable, straighten legs fully into a 'V' shape without rounding the lower back."
    ],
    breathGuide: {
      inhaleAction: "Inhale to lift the sternum and open the collarbones.",
      exhaleAction: "Exhale to draw the navel deeper toward the spine.",
      holdNotes: "Keep breath fluid; don't grip in the neck or grit the teeth."
    },
    alignmentCues: [
      { joint: "Chest & Spine", cue: "Lifted high; avoid collapsing or rounding into the lumbar spine." },
      { joint: "Shoulders", cue: "Broad and relaxed away from the ears." },
      { joint: "Inner Thighs", cue: "Magnetized together to maintain midline core engagement." }
    ],
    commonMistakes: [
      { mistake: "Rounding into the lower back and rolling onto the sacrum", correction: "Bend knees and hold backs of thighs to keep spine completely straight and chest tall." },
      { mistake: "Holding breath due to abdominal exertion", correction: "Maintain soft diaphragmatic rhythm throughout the hold." }
    ],
    modifications: {
      beginner: "Keep knees bent with shins parallel to floor and hands lightly holding back of thighs.",
      advanced: "Low Boat (Ardha Navasana) hovering shoulder blades and heels 2 inches off floor.",
      propUsage: "Loop a yoga strap around the balls of the feet and hold the ends with hands."
    },
    kinematics: {
      headTilt: 0,
      neckAngle: 0,
      spineCurve: 0,
      torsoAngle: 45,
      pelvisTilt: 25,
      leftShoulderAngle: 80,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 80,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 90,
      leftKneeAngle: 0,
      leftAnkleAngle: 20,
      rightHipAngle: 90,
      rightKneeAngle: 0,
      rightAnkleAngle: 20,
      elevationY: 0.8,
      symmetry: true,
      facing: "side",
      poseArchetype: "boat"
    }
  },
  {
    id: "seated-forward-bend",
    name: "Seated Forward Bend",
    sanskritName: "Paschimottanasana",
    englishPronunciation: "PAH-shee-moh-tahn-AHS-anna",
    category: "forwardBend",
    difficulty: "beginner",
    primaryMuscles: ["hamstrings", "erectorSpinae", "calvesAnkles"],
    secondaryMuscles: ["glutes", "latissimusDorsi"],
    benefits: ["spineFlexibility", "stressRelief", "sleepQuality", "lowerBackPain"],
    recommendedHoldSeconds: 60,
    description: "The classic calming forward fold. Stretches the entire posterior chain from heels to the base of the skull while gently massaging abdominal organs.",
    stepByStepInstructions: [
      "Sit upright in Staff Pose (Dandasana) with legs extended straight in front and feet flexed.",
      "Inhale to reach both arms overhead, lengthening all four sides of the waist.",
      "Exhale to hinge forward from the hip joints (not the waist), leading with the heart.",
      "Clasp outer edges of feet, shins, or ankles with your hands.",
      "With every inhale lengthen the spine forward; with every exhale soften deeper into the fold."
    ],
    breathGuide: {
      inhaleAction: "Inhale to pull the crown of the head toward your toes.",
      exhaleAction: "Exhale to soften the belly onto the thighs and melt the heart.",
      holdNotes: "Long, meditative exhalations triggering the calming parasympathetic response."
    },
    alignmentCues: [
      { joint: "Pelvis", cue: "Hinge from the hip creases; imagine tipping the pelvis forward like a bowl of water." },
      { joint: "Feet", cue: "Active flex (Dorsiflexion); toes pointing straight up." },
      { joint: "Shoulders", cue: "Drawn back and down away from the ears." }
    ],
    commonMistakes: [
      { mistake: "Rounding the upper back just to touch the toes with forehead", correction: "Bend knees as much as needed so the lower abdomen rests on thighs with a straight spine." },
      { mistake: "Pulling aggressively with arm strength", correction: "Use breath and passive gravity to release rather than forceful muscular pulling." }
    ],
    modifications: {
      beginner: "Sit on a folded blanket and place a rolled towel under the knees.",
      advanced: "Interlock wrists around the soles of the feet and rest chin on shins.",
      propUsage: "Loop a yoga strap around the balls of the feet, holding each side with relaxed arms."
    },
    kinematics: {
      headTilt: 45,
      neckAngle: 0,
      spineCurve: -0.3,
      torsoAngle: 75,
      pelvisTilt: -35,
      leftShoulderAngle: 60,
      leftElbowAngle: 30,
      leftWristAngle: 0,
      rightShoulderAngle: 60,
      rightElbowAngle: 30,
      rightWristAngle: 0,
      leftHipAngle: 90,
      leftKneeAngle: 0,
      leftAnkleAngle: 90,
      rightHipAngle: 90,
      rightKneeAngle: 0,
      rightAnkleAngle: 90,
      elevationY: 0.9,
      symmetry: true,
      facing: "side",
      poseArchetype: "forwardFold"
    }
  },
  {
    id: "camel-pose",
    name: "Camel Pose",
    sanskritName: "Ustrasana",
    englishPronunciation: "oosh-TRAHS-anna",
    category: "backbend",
    difficulty: "intermediate",
    primaryMuscles: ["quadriceps", "hipFlexors", "pectoralisChest", "deltoidsShoulders"],
    secondaryMuscles: ["erectorSpinae", "coreAbdominals", "cervicalNeck"],
    benefits: ["deskPosturedetox", "energyBoost", "spineFlexibility", "stressRelief"],
    recommendedHoldSeconds: 30,
    description: "A profound heart-opening backbend that counteracts forward hunched posture, expands the lungs, and releases stored emotional tightness in the chest.",
    stepByStepInstructions: [
      "Kneel on the mat with knees hip-width apart and thighs perpendicular to the floor.",
      "Place palms on your lower back/sacrum with fingers pointing down.",
      "Inhale to lift the chest high and draw the elbows toward each other behind your back.",
      "Press the hips forward over the knees as you arch gently backward through the upper spine.",
      "If comfortable, reach hands back one at a time to grasp your heels or ankles.",
      "Keep neck in a comfortable position, gaze up or let head hang back gently if neck is healthy."
    ],
    breathGuide: {
      inhaleAction: "Inhale to lift the sternum high toward the ceiling.",
      exhaleAction: "Exhale to press thighs forward and open the heart broader.",
      holdNotes: "Breathe deeply into the upper chest; exit slowly on an inhale."
    },
    alignmentCues: [
      { joint: "Hips & Thighs", cue: "Maintain thighs vertical and perpendicular to the floor (don't sit backward)." },
      { joint: "Chest", cue: "Lift the ribcage up and out of the pelvis before bending backward." },
      { joint: "Lower Back", cue: "Keep length in the lumbar spine; engage lower abdominals." }
    ],
    commonMistakes: [
      { mistake: "Allowing hips to slide backward over the calves to reach heels", correction: "Keep hips pushing forward directly over knees; place hands on sacrum instead of heels." },
      { mistake: "Compressing the lower back without thoracic lift", correction: "Focus on chest elevation toward the ceiling rather than backbend depth." }
    ],
    modifications: {
      beginner: "Tuck toes under to elevate the heels 3-4 inches, or keep hands supporting the lower back.",
      advanced: "Untuck toes, reach both hands to heels, and drop head back smoothly.",
      propUsage: "Place two yoga blocks outside the ankles on highest height to rest hands on."
    },
    kinematics: {
      headTilt: -45,
      neckAngle: 0,
      spineCurve: 0.7,
      torsoAngle: -45,
      pelvisTilt: 20,
      leftShoulderAngle: -45,
      leftElbowAngle: 0,
      leftWristAngle: 45,
      rightShoulderAngle: -45,
      rightElbowAngle: 0,
      rightWristAngle: 45,
      leftHipAngle: 0,
      leftKneeAngle: 90,
      leftAnkleAngle: 40,
      rightHipAngle: 0,
      rightKneeAngle: 90,
      rightAnkleAngle: 40,
      elevationY: 0.5,
      symmetry: true,
      facing: "side",
      poseArchetype: "camel"
    }
  },
  {
    id: "savasana",
    name: "Corpse Pose",
    sanskritName: "Savasana",
    englishPronunciation: "shah-VAHS-anna",
    category: "seatedRestorative",
    difficulty: "beginner",
    primaryMuscles: ["cervicalNeck", "erectorSpinae"],
    secondaryMuscles: ["hamstrings", "quadriceps", "glutes", "deltoidsShoulders"],
    benefits: ["stressRelief", "sleepQuality", "lowerBackPain"],
    recommendedHoldSeconds: 300,
    description: "The ultimate posture of integration, deep surrender, and autonomic nervous system reset. Allows the physical and subtle benefits of practice to settle into the body.",
    stepByStepInstructions: [
      "Lie flat on your back on the mat.",
      "Separate the legs comfortably wider than hip-width and let the feet naturally flop outward.",
      "Rest arms alongside the torso, a few inches away from the body with palms turned upward.",
      "Tuck the chin very slightly to lengthen the back of the neck.",
      "Close the eyes, soften the tongue away from the roof of the mouth, and unclench the jaw.",
      "Release all control of the breath, letting the body breathe itself in effortless stillness."
    ],
    breathGuide: {
      inhaleAction: "Allow the breath to become naturally soft, subtle, and effortless.",
      exhaleAction: "With every breath out, feel the body melting 10% deeper into the floor.",
      holdNotes: "Rest in non-doing awareness. Notice sensations without attachment."
    },
    alignmentCues: [
      { joint: "Spine", cue: "Neutral and completely supported by the ground." },
      { joint: "Palms", cue: "Turned up to promote open chest and relaxed shoulders." },
      { joint: "Eyes & Jaw", cue: "Completely soft, eyes relaxing into their sockets." }
    ],
    commonMistakes: [
      { mistake: "Fidgeting or checking the clock", correction: "Commit to complete stillness for the duration of the rest." },
      { mistake: "Lower back tension from lying flat", correction: "Place a rolled blanket or bolster under the knees to relax the lumbar spine." }
    ],
    modifications: {
      beginner: "Place a folded blanket under the head for neck support and under the knees.",
      advanced: "Deep Yoga Nidra body-scan visualization during the 5-10 minute rest.",
      propUsage: "Place an eye pillow over the eyes and cover with a warm blanket."
    },
    kinematics: {
      headTilt: 0,
      neckAngle: 0,
      spineCurve: 0,
      torsoAngle: 90,
      pelvisTilt: 0,
      leftShoulderAngle: 30,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 30,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 15,
      leftKneeAngle: 0,
      leftAnkleAngle: 20,
      rightHipAngle: 15,
      rightKneeAngle: 0,
      rightAnkleAngle: 20,
      elevationY: 0.95,
      symmetry: true,
      facing: "floor",
      poseArchetype: "savasana"
    }
  },
  {
    id: "seated-twist",
    name: "Half Lord of the Fishes Pose",
    sanskritName: "Ardha Matsyendrasana",
    englishPronunciation: "ARD-hah maht-syen-DRAHS-anna",
    category: "seatedRestorative",
    difficulty: "beginner",
    primaryMuscles: ["erectorSpinae", "glutes", "coreAbdominals"],
    secondaryMuscles: ["deltoidsShoulders", "cervicalNeck", "latissimusDorsi"],
    benefits: ["digestion", "spineFlexibility", "lowerBackPain", "deskPosturedetox"],
    recommendedHoldSeconds: 45,
    description: "A detoxifying spinal rotation that cleanses the digestive organs, restores vertebral elasticity, and releases piriformis and shoulder tension.",
    stepByStepInstructions: [
      "Sit on the mat with legs extended straight in front.",
      "Bend the right knee and step the right foot over the left thigh, placing it flat on the mat outside the left knee.",
      "Bend the left knee, tucking the left foot near the right outer hip (or keep left leg straight).",
      "Place your right hand on the floor just behind your sacrum like a second spine.",
      "Inhale to reach the left arm up high; exhale to twist to the right, hooking the left elbow outside the right knee.",
      "Gaze gently over the right shoulder with each exhale."
    ],
    breathGuide: {
      inhaleAction: "Inhale to grow 1 inch taller through the crown of your head.",
      exhaleAction: "Exhale to gently wring out the spine from the belly up to the shoulders.",
      holdNotes: "Never force the twist with arm leverage; let the core muscles initiate the turn."
    },
    alignmentCues: [
      { joint: "Sitting Bones", cue: "Both sit bones grounded evenly into the mat." },
      { joint: "Spine", cue: "Straight vertical axis; avoid leaning backward into the back hand." },
      { joint: "Neck", cue: "Turn head gently to complete the twist; avoid straining." }
    ],
    commonMistakes: [
      { mistake: "Rounding the lower spine and collapsing backward", correction: "Sit on a folded blanket to elevate the pelvis and straighten the back." },
      { mistake: "Cranking the neck excessively", correction: "Keep the twist focused in the mid-back (thoracic) rather than only the neck." }
    ],
    modifications: {
      beginner: "Keep the bottom left leg extended straight out on the mat; hug right knee with left arm.",
      advanced: "Thread the left arm under the right knee to bind hands behind the back.",
      propUsage: "Sit on a bolster or blanket to keep hips higher than knees."
    },
    kinematics: {
      headTilt: 0,
      neckAngle: 70,
      spineCurve: 0,
      torsoAngle: 0,
      pelvisTilt: 0,
      leftShoulderAngle: 45,
      leftElbowAngle: 90,
      leftWristAngle: 0,
      rightShoulderAngle: -35,
      rightElbowAngle: 10,
      rightWristAngle: 45,
      leftHipAngle: 80,
      leftKneeAngle: 120,
      leftAnkleAngle: 0,
      rightHipAngle: 90,
      rightKneeAngle: 110,
      rightAnkleAngle: 0,
      elevationY: 0.9,
      symmetry: false,
      facing: "side",
      poseArchetype: "seatedTwist"
    }
  },
  {
    id: "butterfly-pose",
    name: "Bound Angle Pose",
    sanskritName: "Baddha Konasana",
    englishPronunciation: "BAH-dah koh-NAHS-anna",
    category: "seatedRestorative",
    difficulty: "beginner",
    primaryMuscles: ["hipFlexors", "glutes"],
    secondaryMuscles: ["erectorSpinae", "hamstrings"],
    benefits: ["hipMobility", "lowerBackPain", "stressRelief", "sleepQuality"],
    recommendedHoldSeconds: 60,
    description: "An essential seated hip opener and pelvic floor relaxer. Relieves menstrual cramps, stimulates abdominal organs, and soothes lower back fatigue.",
    stepByStepInstructions: [
      "Sit tall on your mat with legs extended.",
      "Bend both knees and draw the soles of the feet together in front of your pelvis.",
      "Allow the knees to fall open naturally toward the sides like butterfly wings.",
      "Clasp your feet or ankles with both hands.",
      "Inhale to lengthen the spine tall; exhale to gently hinge forward from the hips with a long spine."
    ],
    breathGuide: {
      inhaleAction: "Inhale to pull the heart forward and broaden collarbones.",
      exhaleAction: "Exhale to allow the knees to soften toward the ground without forcing.",
      holdNotes: "Slow, soothing belly breath into the pelvis."
    },
    alignmentCues: [
      { joint: "Spine", cue: "Keep chest proud and spine long; avoid hunching shoulders." },
      { joint: "Feet", cue: "Open the soles of the feet upward like opening a book." },
      { joint: "Knees", cue: "Let gravity work; do not push down harshly with hands." }
    ],
    commonMistakes: [
      { mistake: "Rounding into the upper back and forcing the head to the feet", correction: "Prioritize length in the spine and hinge from the hips." },
      { mistake: "Hips too tight causing knees to stay very high and lower back to ache", correction: "Sit on a yoga block or blanket and place blocks under each knee." }
    ],
    modifications: {
      beginner: "Slide feet further away from pelvis into a diamond shape for gentle release.",
      advanced: "Reclined Butterfly (Supta Baddha Konasana) lying flat on back.",
      propUsage: "Place blocks under the outer knees for supportive resting."
    },
    kinematics: {
      headTilt: 20,
      neckAngle: 0,
      spineCurve: -0.2,
      torsoAngle: 30,
      pelvisTilt: -15,
      leftShoulderAngle: 30,
      leftElbowAngle: 40,
      leftWristAngle: 0,
      rightShoulderAngle: 30,
      rightElbowAngle: 40,
      rightWristAngle: 0,
      leftHipAngle: 75,
      leftKneeAngle: 135,
      leftAnkleAngle: 0,
      rightHipAngle: 75,
      rightKneeAngle: 135,
      rightAnkleAngle: 0,
      elevationY: 0.9,
      symmetry: true,
      facing: "front",
      poseArchetype: "butterfly"
    }
  },
  {
    id: "low-lunge",
    name: "Crescent Low Lunge",
    sanskritName: "Anjaneyasana",
    englishPronunciation: "AHN-jah-nay-AHS-anna",
    category: "standing",
    difficulty: "beginner",
    primaryMuscles: ["hipFlexors", "quadriceps", "glutes"],
    secondaryMuscles: ["deltoidsShoulders", "erectorSpinae", "coreAbdominals"],
    benefits: ["hipMobility", "deskPosturedetox", "runnersRecovery", "energyBoost"],
    recommendedHoldSeconds: 45,
    description: "The ultimate antidote to hours in a desk chair. Deeply releases the psoas and hip flexors while lifting the chest into an energizing crescent shape.",
    stepByStepInstructions: [
      "From Downward Dog, step right foot forward between the hands, aligning right knee over ankle.",
      "Lower the back left knee to the mat and untuck the left toes.",
      "Slide the back knee further back until you feel a comfortable stretch in the front of the left hip.",
      "Inhale to sweep both arms overhead, drawing the lower belly gently in and up.",
      "Sink the hips forward and down while lifting the ribcage away from the pelvis."
    ],
    breathGuide: {
      inhaleAction: "Inhale to reach high through fingertips and lift the heart.",
      exhaleAction: "Exhale to melt the pelvis down and forward toward the front heel.",
      holdNotes: "Maintain soft, deep thoracic breathing."
    },
    alignmentCues: [
      { joint: "Front Knee", cue: "Stacked right above the heel at 90 degrees." },
      { joint: "Back Knee", cue: "Cushioned with a folded mat if sensitive." },
      { joint: "Tailbone", cue: "Lengthened downward to protect the lower back." }
    ],
    commonMistakes: [
      { mistake: "Front knee traveling way ahead of toes putting strain on patella", correction: "Walk front foot further forward until knee is stacked over ankle." },
      { mistake: "Dumping into the lumbar spine", correction: "Engage lower abdominals and lift up through the side waist." }
    ],
    modifications: {
      beginner: "Keep hands resting on the front thigh or on two blocks flanking the front foot.",
      advanced: "Add a gentle backbend or reach back to catch the back foot for a quad stretch.",
      propUsage: "Place a soft pad or folded blanket under the back knee."
    },
    kinematics: {
      headTilt: -20,
      neckAngle: 0,
      spineCurve: 0.3,
      torsoAngle: -15,
      pelvisTilt: 15,
      leftShoulderAngle: 175,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 175,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 85,
      leftKneeAngle: 90,
      leftAnkleAngle: 85,
      rightHipAngle: -40,
      rightKneeAngle: 90,
      rightAnkleAngle: 30,
      elevationY: 0.55,
      symmetry: false,
      facing: "side",
      poseArchetype: "warrior1"
    }
  },
  {
    id: "legs-up-the-wall",
    name: "Legs-Up-The-Wall Pose",
    sanskritName: "Viparita Karani",
    englishPronunciation: "vip-ah-REE-tah kah-RAH-nee",
    category: "inversion",
    difficulty: "beginner",
    primaryMuscles: ["calvesAnkles", "hamstrings"],
    secondaryMuscles: ["erectorSpinae", "glutes"],
    benefits: ["sleepQuality", "stressRelief", "runnersRecovery", "lowerBackPain"],
    recommendedHoldSeconds: 180,
    description: "A deeply restorative inverted posture that drains lymphatic fluid from fatigued legs, lowers heart rate, and prepares the brain for sound sleep.",
    stepByStepInstructions: [
      "Sit sideways close to a wall, hips as close to the wall as comfortable.",
      "Gently pivot on your hips and swing both legs up the wall as you recline your back to the floor.",
      "Rest arms out to the sides with palms facing up.",
      "Let the legs remain relaxed vertically against the wall.",
      "Close the eyes and remain for 3 to 10 minutes in restorative stillness."
    ],
    breathGuide: {
      inhaleAction: "Inhale slowly for 4 counts, feeling the belly and ribs expand.",
      exhaleAction: "Exhale gently for 6 to 8 counts, slowing the heart rate.",
      holdNotes: "Allow yourself to completely unwind all muscular tension."
    },
    alignmentCues: [
      { joint: "Sacrum", cue: "Resting flat on the floor or on a folded blanket." },
      { joint: "Neck", cue: "Soft and elongated, chin slightly tucked." },
      { joint: "Legs", cue: "Supported by the wall with no effort required." }
    ],
    commonMistakes: [
      { mistake: "Hips too far from the wall causing legs to fall forward", correction: "Shuffle closer to the wall so legs are naturally stacked." }
    ],
    modifications: {
      beginner: "Place a bolster or pillow under the hips to elevate the pelvis.",
      advanced: "Widen legs into a 'V' shape on the wall for an inner thigh stretch.",
      propUsage: "Place an eye mask on and place a sandbag or folded blanket on the feet."
    },
    kinematics: {
      headTilt: 0,
      neckAngle: 0,
      spineCurve: 0,
      torsoAngle: 90,
      pelvisTilt: 0,
      leftShoulderAngle: 45,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 45,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: 90,
      leftKneeAngle: 0,
      leftAnkleAngle: 10,
      rightHipAngle: 90,
      rightKneeAngle: 0,
      rightAnkleAngle: 10,
      elevationY: 0.95,
      symmetry: true,
      facing: "floor",
      poseArchetype: "legsUpWall"
    }
  },
  {
    id: "hasta-uttanasana",
    name: "Raised Arms / Arching Back Pose",
    sanskritName: "Hasta Uttanasana",
    englishPronunciation: "HAHS-tuh oo-tahn-AHS-uh-nuh",
    category: "backbend",
    difficulty: "beginner",
    primaryMuscles: ["pectoralisChest", "deltoidsShoulders", "erectorSpinae"],
    secondaryMuscles: ["quadriceps", "coreAbdominals", "glutes"],
    benefits: ["spineFlexibility", "energyBoost", "stressRelief"],
    recommendedHoldSeconds: 30,
    description: "Classic 2nd and 11th step of Surya Namaskar. Sweeping arms skyward while gently arching the upper thoracic spine to greet the sun and expand cardiovascular lung capacity.",
    stepByStepInstructions: [
      "From Mountain Pose, inhale and sweep both arms overhead alongside ears.",
      "Engage your glutes and draw the lower belly in to protect your lumbar spine.",
      "Lift from the center of your chest, arching gently through the upper back.",
      "Keep neck elongated, gazing softly toward your palms or the sky."
    ],
    breathGuide: {
      inhaleAction: "Inhale expansively as your heart opens to the sun.",
      exhaleAction: "Exhale softly while rooting through heels and keeping chest lifted.",
      holdNotes: "Breathe into the high chest and collarbones."
    },
    alignmentCues: [
      { joint: "Chest & Heart", cue: "Lift straight up before arching backward." },
      { joint: "Shoulders", cue: "Relaxed away from ears with palms parallel." },
      { joint: "Lower Back", cue: "Keep tailbone heavy to prevent pinching in lumbar." }
    ],
    commonMistakes: [
      { mistake: "Bending purely from lower back", correction: "Distribute the backbend evenly through the upper thoracic chest." }
    ],
    modifications: {
      beginner: "Keep arms shoulder-width apart without joining palms if shoulders are tight.",
      advanced: "Deepen the arch while keeping palms pressed in Anjali Mudra overhead.",
      propUsage: "Hold a yoga block between hands to maintain parallel arm alignment."
    },
    kinematics: {
      headTilt: -25,
      neckAngle: -15,
      spineCurve: 0.45,
      torsoAngle: -20,
      pelvisTilt: -10,
      leftShoulderAngle: 175,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: 175,
      rightElbowAngle: 0,
      rightWristAngle: 0,
      leftHipAngle: -10,
      leftKneeAngle: 0,
      leftAnkleAngle: 0,
      rightHipAngle: -10,
      rightKneeAngle: 0,
      rightAnkleAngle: 0,
      elevationY: 0,
      symmetry: true,
      facing: "front",
      poseArchetype: "tadasana"
    }
  },
  {
    id: "ashwa-sanchalanasana",
    name: "Equestrian / Low Lunge Pose",
    sanskritName: "Ashwa Sanchalanasana",
    englishPronunciation: "ASH-wah sahn-chah-lahn-AHS-uh-nuh",
    category: "standing",
    difficulty: "beginner",
    primaryMuscles: ["hipFlexors", "quadriceps", "glutes"],
    secondaryMuscles: ["erectorSpinae", "hamstrings", "pectoralisChest"],
    benefits: ["hipMobility", "deskPosturedetox", "energyBoost"],
    recommendedHoldSeconds: 40,
    description: "4th and 9th step of Surya Namaskar. Releases deep iliopsoas tension from prolonged sitting, stimulates pelvic circulation, and opens the chest.",
    stepByStepInstructions: [
      "From standing forward fold, step your right leg far back and lower right knee to the mat.",
      "Ensure front left knee stacks directly over your left ankle at a 90-degree angle.",
      "Untuck back toes and press fingertips into the floor on either side of the front foot.",
      "Roll shoulders back, lift the heart, and gaze softly upward toward the eyebrow center."
    ],
    breathGuide: {
      inhaleAction: "Inhale and draw prana upwards from the back hip into your sternum.",
      exhaleAction: "Exhale and let the pelvis sink gently downward toward the mat.",
      holdNotes: "Maintain smooth, continuous breaths into the front hip crease."
    },
    alignmentCues: [
      { joint: "Front Knee", cue: "Directly over ankle; never overshooting past the toes." },
      { joint: "Pelvis", cue: "Square hips forward; sink weight into the back hip flexor." },
      { joint: "Chest", cue: "Broad and lifted with collarbones open." }
    ],
    commonMistakes: [
      { mistake: "Collapsing torso onto front thigh", correction: "Keep chest buoyant and spine elongated." }
    ],
    modifications: {
      beginner: "Place hands on yoga blocks to elevate the floor.",
      advanced: "Lift back knee off the floor into High Lunge.",
      propUsage: "Place a folded blanket beneath the back knee for extra cushioning."
    },
    kinematics: {
      headTilt: -20,
      neckAngle: -10,
      spineCurve: 0.25,
      torsoAngle: -10,
      pelvisTilt: 15,
      leftShoulderAngle: 65,
      leftElbowAngle: 20,
      leftWristAngle: 0,
      rightShoulderAngle: 65,
      rightElbowAngle: 20,
      rightWristAngle: 0,
      leftHipAngle: 90,
      leftKneeAngle: 90,
      leftAnkleAngle: 0,
      rightHipAngle: -40,
      rightKneeAngle: 90,
      rightAnkleAngle: 20,
      elevationY: 0.45,
      symmetry: false,
      facing: "side",
      poseArchetype: "warrior1"
    }
  },
  {
    id: "ashtanga-namaskara",
    name: "Eight-Limbed Salutation",
    sanskritName: "Ashtanga Namaskara",
    englishPronunciation: "ash-TAHN-guh nah-mahs-KAR-uh",
    category: "seatedRestorative",
    difficulty: "beginner",
    primaryMuscles: ["deltoidsShoulders", "erectorSpinae", "latissimusDorsi"],
    secondaryMuscles: ["coreAbdominals", "pectoralisChest", "calvesAnkles"],
    benefits: ["spineFlexibility", "energyBoost", "stressRelief"],
    recommendedHoldSeconds: 30,
    description: "6th step of Surya Namaskar. Eight points of the body touch the earth simultaneously (feet, knees, hands, chest, chin) in an act of deep reverence, strengthening shoulder stabilizers and upper spine mobility.",
    stepByStepInstructions: [
      "From high plank, exhale and lower both knees to the mat.",
      "Slide the chest and chin forward and down to touch the floor between your hands.",
      "Keep hips and abdomen slightly elevated off the floor.",
      "Hug elbows tightly into your ribs and press down evenly through palms and toes."
    ],
    breathGuide: {
      inhaleAction: "Prepare in plank with an inhale.",
      exhaleAction: "Exhale completely as all 8 points settle upon the earth.",
      holdNotes: "Pause momentarily in deep surrender before gliding forward into Cobra."
    },
    alignmentCues: [
      { joint: "Elbows", cue: "Hugged close to ribs, pointing straight back toward feet." },
      { joint: "Hips", cue: "Suspended slightly above the mat with tailbone pointing up." },
      { joint: "Neck", cue: "Gently elongated with chin resting on the floor." }
    ],
    commonMistakes: [
      { mistake: "Flaring elbows out to the sides", correction: "Keep elbows pinned close against the ribcage." }
    ],
    modifications: {
      beginner: "Rest flat onto the belly into Prone position if chest lowering is difficult.",
      advanced: "Engage pelvic floor and lift knees 1 inch off floor.",
      propUsage: "Place a blanket under chest for soft support."
    },
    kinematics: {
      headTilt: -30,
      neckAngle: -15,
      spineCurve: 0.35,
      torsoAngle: 25,
      pelvisTilt: 20,
      leftShoulderAngle: 80,
      leftElbowAngle: 100,
      leftWristAngle: 90,
      rightShoulderAngle: 80,
      rightElbowAngle: 100,
      rightWristAngle: 90,
      leftHipAngle: 45,
      leftKneeAngle: 90,
      leftAnkleAngle: 90,
      rightHipAngle: 45,
      rightKneeAngle: 90,
      rightAnkleAngle: 90,
      elevationY: 0.85,
      symmetry: true,
      facing: "floor",
      poseArchetype: "cobra"
    }
  },
  {
    id: "twisted-lizard",
    name: "Twisted Lizard Pose (Quad Stretch)",
    sanskritName: "Parivrtta Utthan Pristhasana",
    englishPronunciation: "pah-ree-VREE-tah oot-TAHN prees-TAHS-uh-nuh",
    category: "seatedRestorative",
    difficulty: "intermediate",
    primaryMuscles: ["quadriceps", "hipFlexors", "pectoralisChest", "deltoidsShoulders"],
    secondaryMuscles: ["glutes", "erectorSpinae", "hamstrings", "coreAbdominals"],
    benefits: ["hipMobility", "deskPosturedetox", "spineFlexibility", "stressRelief"],
    recommendedHoldSeconds: 45,
    description: "An exquisite, deep restorative hip opener and quadriceps release as shown in the reference. The front leg anchors in a deep lunge while the back knee rests on the mat with the shin bent upward, grasped by the spiraling arm in a buoyant thoracic spinal twist.",
    stepByStepInstructions: [
      "Begin in Low Lunge with your front left foot planted outside your left hand.",
      "Lower your back right knee softly to the mat or onto a folded blanket.",
      "Ground your right forearm or palm firmly onto the mat or a yoga block.",
      "Inhale to rotate your chest and torso open toward the left, spiraling through the thoracic spine.",
      "Bend your back right knee, bringing the right foot toward your glutes.",
      "Reach your left hand back to grasp the outer edge of your right foot or ankle.",
      "Gently draw the heel closer to your glute to deepen the quadriceps and psoas release while gazing softly skyward."
    ],
    breathGuide: {
      inhaleAction: "Inhale into the open chest and heart space, creating length through the spine.",
      exhaleAction: "Exhale and gently surrender hip tension down toward the earth.",
      holdNotes: "Stay relaxed with smooth diaphragmatic breathing; do not force the foot closer than feels organic."
    },
    alignmentCues: [
      { joint: "Front Knee", cue: "Stacked over or slightly behind front ankle; externally rotated safely." },
      { joint: "Spine", cue: "Lengthen first before spiraling into the rotation." },
      { joint: "Back Quad & Knee", cue: "Rest weight above the kneecap onto the lower thigh rather than direct patella pressure." },
      { joint: "Shoulders", cue: "Broad and open, drawing shoulder blades toward the spine." }
    ],
    commonMistakes: [
      { mistake: "Dumping direct bodyweight onto the kneecap bone", correction: "Slide the back knee further back so the weight rests on the lower quadriceps muscle." },
      { mistake: "Rounding the upper back while grasping the foot", correction: "Use a yoga strap around the back foot to maintain open collarbones." }
    ],
    modifications: {
      beginner: "Keep the back foot on the floor and simply twist the torso, or loop a strap around the ankle.",
      advanced: "Lower the grounding forearm flat to the floor and melt the hips deeper toward the mat.",
      propUsage: "Place a yoga block under the grounding front forearm and a blanket under the back knee."
    },
    kinematics: {
      headTilt: -35,
      neckAngle: 30,
      spineCurve: 0.3,
      torsoAngle: 25,
      pelvisTilt: 30,
      leftShoulderAngle: 120,
      leftElbowAngle: 45,
      leftWristAngle: 20,
      rightShoulderAngle: 75,
      rightElbowAngle: 90,
      rightWristAngle: 70,
      leftHipAngle: 90,
      leftKneeAngle: 85,
      leftAnkleAngle: 10,
      rightHipAngle: -35,
      rightKneeAngle: 115,
      rightAnkleAngle: 30,
      elevationY: 0.4,
      symmetry: false,
      facing: "side",
      poseArchetype: "twistedLizard"
    }
  },
  {
    id: "dancer-pose",
    name: "Lord of the Dance Pose",
    sanskritName: "Natarajasana",
    englishPronunciation: "nah-tah-rah-JAHS-uh-nuh",
    category: "balance",
    difficulty: "advanced",
    primaryMuscles: ["quadriceps", "hipFlexors", "pectoralisChest", "calvesAnkles"],
    secondaryMuscles: ["glutes", "erectorSpinae", "deltoidsShoulders"],
    benefits: ["spineFlexibility", "coreStrength", "energyBoost"],
    recommendedHoldSeconds: 30,
    description: "An elegant standing balance combining a graceful backbend, deep hip extension, and focused single-point concentration.",
    stepByStepInstructions: [
      "Stand tall in Mountain Pose and root firmly into your left standing foot.",
      "Bend your right knee, bringing your right heel toward your glute.",
      "Reach back with your right hand and grasp the inside of your right ankle.",
      "Inhale your left arm forward and upward alongside your ear.",
      "Exhale and begin kicking your right foot back and up into your hand, hinging forward slightly from the hips.",
      "Keep chest lifted and gaze steadily at a single point ahead."
    ],
    breathGuide: {
      inhaleAction: "Inhale to lengthen the front torso and elevate the reaching fingertips.",
      exhaleAction: "Exhale and kick strongly into the back hand to open the shoulder and chest.",
      holdNotes: "Keep breath steady to support vestibular balance."
    },
    alignmentCues: [
      { joint: "Standing Knee", cue: "Micro-bend to avoid locking; quadriceps firmly engaged." },
      { joint: "Hips", cue: "Squared forward toward the front of the mat." },
      { joint: "Chest", cue: "Lifted high and proud, counterbalancing the kick." }
    ],
    commonMistakes: [
      { mistake: "Opening the right hip out to the side", correction: "Keep the right inner thigh rolling inward and hips level." }
    ],
    modifications: {
      beginner: "Hold a wall or chair with the forward hand for stability.",
      advanced: "Reach both hands overhead to grip the back foot in full Natarajasana.",
      propUsage: "Use a strap looped around the back foot."
    },
    kinematics: {
      headTilt: -15,
      neckAngle: 0,
      spineCurve: 0.45,
      torsoAngle: 30,
      pelvisTilt: 25,
      leftShoulderAngle: 170,
      leftElbowAngle: 0,
      leftWristAngle: 0,
      rightShoulderAngle: -60,
      rightElbowAngle: 60,
      rightWristAngle: 30,
      leftHipAngle: 0,
      leftKneeAngle: 5,
      leftAnkleAngle: 0,
      rightHipAngle: -85,
      rightKneeAngle: 120,
      rightAnkleAngle: 45,
      elevationY: 0.1,
      symmetry: false,
      facing: "side",
      poseArchetype: "dancerPose"
    }
  },
  {
    id: "wheel-pose",
    name: "Wheel Pose (Upward Bow)",
    sanskritName: "Chakrasana / Urdhva Dhanurasana",
    englishPronunciation: "chak-RAHS-uh-nuh",
    category: "backbend",
    difficulty: "advanced",
    primaryMuscles: ["erectorSpinae", "quadriceps", "deltoidsShoulders", "pectoralisChest"],
    secondaryMuscles: ["glutes", "latissimusDorsi", "calvesAnkles"],
    benefits: ["spineFlexibility", "energyBoost", "coreStrength"],
    recommendedHoldSeconds: 25,
    description: "The crown jewel of backbends. Builds monumental spinal flexibility, stimulates nervous system vitality, and strengthens the entire posterior kinetic chain.",
    stepByStepInstructions: [
      "Lie supine on your back, bend knees, and place feet flat on the mat hip-width apart.",
      "Bring hands beside your ears with fingers pointing toward your shoulders.",
      "Press evenly through feet and hands, lifting hips, torso, and head off the floor.",
      "Straighten arms and legs gradually, pushing the chest toward the wall behind you.",
      "Relax the neck and breathe deeply into the ribcage."
    ],
    breathGuide: {
      inhaleAction: "Inhale to press down through palms and soles, arching the spine.",
      exhaleAction: "Exhale to relax neck tension and soften inner thighs.",
      holdNotes: "Maintain smooth diaphragmatic breaths."
    },
    alignmentCues: [
      { joint: "Feet", cue: "Parallel with big toes pointing forward; do not turn feet outward." },
      { joint: "Elbows", cue: "Hugged inward parallel, not winging out." }
    ],
    commonMistakes: [
      { mistake: "Splaying knees and feet outward", correction: "Keep inner thighs rolling downward and feet parallel." }
    ],
    modifications: {
      beginner: "Practice Bridge Pose or place hands on blocks against a wall.",
      advanced: "One-legged Wheel Pose (Eka Pada Chakrasana).",
      propUsage: "Place a yoga strap around thighs to keep knees hip-distance."
    },
    kinematics: {
      headTilt: -45,
      neckAngle: -30,
      spineCurve: 0.85,
      torsoAngle: 0,
      pelvisTilt: 0,
      leftShoulderAngle: 170,
      leftElbowAngle: 20,
      leftWristAngle: 90,
      rightShoulderAngle: 170,
      rightElbowAngle: 20,
      rightWristAngle: 90,
      leftHipAngle: -35,
      leftKneeAngle: 85,
      leftAnkleAngle: 30,
      rightHipAngle: -35,
      rightKneeAngle: 85,
      rightAnkleAngle: 30,
      elevationY: 0.5,
      symmetry: true,
      facing: "side",
      poseArchetype: "wheelPose"
    }
  }
];

export const MUSCLE_GROUPS_INFO: Record<string, { label: string; anatomicalName: string; description: string; color: string }> = {
  hamstrings: { label: "Hamstrings", anatomicalName: "Biceps femoris, Semitendinosus", description: "Back of the thighs; essential for forward folds and knee flexion.", color: "#BF6F55" },
  quadriceps: { label: "Quadriceps", anatomicalName: "Rectus femoris, Vastus lateralis/medialis", description: "Front thigh extensors; powers standing warriors and lunges.", color: "#D48B70" },
  glutes: { label: "Gluteal Complex", anatomicalName: "Gluteus maximus, medius, minimus", description: "Pelvic stabilizers and hip extensors for balance and backbends.", color: "#6F7E68" },
  hipFlexors: { label: "Hip Flexors & Psoas", anatomicalName: "Iliopsoas, Tensor fasciae latae", description: "Deep pelvic muscles connecting spine to legs; tight from sitting.", color: "#8A9B83" },
  coreAbdominals: { label: "Core & Abdominals", anatomicalName: "Transversus abdominis, Rectus abdominis, Obliques", description: "Central powerhouse protecting the spine in balances and twists.", color: "#9E7B66" },
  erectorSpinae: { label: "Spine Extensors", anatomicalName: "Erector spinae, Multifidus", description: "Deep spinal support muscles running from sacrum to skull.", color: "#556B52" },
  deltoidsShoulders: { label: "Shoulders & Deltoids", anatomicalName: "Deltoid anterior/lateral/posterior, Rotator cuff", description: "Stabilizes arm balances, Downward Dog, and overhead extensions.", color: "#7B6F8E" },
  pectoralisChest: { label: "Chest & Heart", anatomicalName: "Pectoralis major, minor", description: "Front chest opened by backbends and shoulder rolls.", color: "#B85C4B" },
  latissimusDorsi: { label: "Upper Back & Lats", anatomicalName: "Latissimus dorsi, Rhomboids, Trapezius", description: "Draws shoulder blades down to decompress neck and expand chest.", color: "#516353" },
  calvesAnkles: { label: "Calves & Feet", anatomicalName: "Gastrocnemius, Soleus, Plantar fascia", description: "Foundational rooting roots of standing balance and forward folds.", color: "#8C7355" },
  cervicalNeck: { label: "Cervical Spine & Neck", anatomicalName: "Sternocleidomastoid, Scalenes", description: "Upper cervical alignment; relaxed for parasympathetic calm.", color: "#6B7B8C" }
};
