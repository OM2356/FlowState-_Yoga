import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazily
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Helper: map keywords in user message or reply to known pose IDs
  function detectSuggestedPose(text: string): { poseId: string; poseTitle: string } | null {
    const lower = text.toLowerCase();
    if (lower.includes("child") || lower.includes("balasana") || lower.includes("rest pose") || lower.includes("relaxation")) {
      return { poseId: "child-pose", poseTitle: "Child's Pose (Balasana)" };
    }
    if (lower.includes("downward") || lower.includes("adho mukha") || lower.includes("down dog")) {
      return { poseId: "downward-dog", poseTitle: "Downward-Facing Dog" };
    }
    if (lower.includes("cobra") || lower.includes("bhujangasana") || lower.includes("chest opening")) {
      return { poseId: "cobra-pose", poseTitle: "Cobra Pose (Bhujangasana)" };
    }
    if (lower.includes("cat") || lower.includes("cow") || lower.includes("marjaryasana") || lower.includes("spine wave")) {
      return { poseId: "cat-cow", poseTitle: "Cat-Cow Spine Warmup" };
    }
    if (lower.includes("pigeon") || lower.includes("rajakapotasana") || lower.includes("tight hips") || lower.includes("glute stretch") || lower.includes("sciatica")) {
      return { poseId: "pigeon-pose", poseTitle: "Half Pigeon Pose (Hip Opener)" };
    }
    if (lower.includes("bridge") || lower.includes("setu bandha") || lower.includes("glute bridge")) {
      return { poseId: "bridge-pose", poseTitle: "Bridge Pose (Setu Bandhasana)" };
    }
    if (lower.includes("warrior 2") || lower.includes("warrior ii") || lower.includes("virabhadrasana ii")) {
      return { poseId: "warrior-2", poseTitle: "Warrior II Pose" };
    }
    if (lower.includes("warrior 1") || lower.includes("warrior i") || lower.includes("virabhadrasana i")) {
      return { poseId: "warrior-1", poseTitle: "Warrior I Pose" };
    }
    if (lower.includes("tree") || lower.includes("vrksasana") || lower.includes("balance")) {
      return { poseId: "tree-pose", poseTitle: "Tree Pose (Vrksasana)" };
    }
    if (lower.includes("triangle") || lower.includes("trikonasana") || lower.includes("side stretch")) {
      return { poseId: "triangle-pose", poseTitle: "Triangle Pose (Trikonasana)" };
    }
    if (lower.includes("savasana") || lower.includes("corpse") || lower.includes("sleep") || lower.includes("calm mind")) {
      return { poseId: "savasana", poseTitle: "Corpse Pose (Savasana)" };
    }
    if (lower.includes("legs up") || lower.includes("viparita") || lower.includes("tired legs")) {
      return { poseId: "legs-up-wall", poseTitle: "Legs-Up-The-Wall Pose" };
    }
    if (lower.includes("twist") || lower.includes("matsyendrasana") || lower.includes("detox")) {
      return { poseId: "supine-twist", poseTitle: "Reclined Spinal Twist" };
    }
    if (lower.includes("squat") || lower.includes("malasana") || lower.includes("pelvic")) {
      return { poseId: "malasana", poseTitle: "Yogi Squat (Malasana)" };
    }
    return null;
  }

  // Common handler for AI Yoga Coach
  const handleCoachRequest = async (req: express.Request, res: express.Response) => {
    const { message, history, contextPose } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    // Comprehensive expert fallback answers in plain English for instant reliability
    const getSmartFallback = (msg: string) => {
      const lower = msg.toLowerCase();
      if (lower.includes("back") || lower.includes("spine") || lower.includes("pinch")) {
        return {
          reply: `To safely ease lower back tension, always prioritize lengthening your spine before bending:
• **Keep a gentle bend in your knees**: When folding or stretching, bending your knees takes pressure off your lower back.
• **Engage your lower belly**: Gently pull your navel toward your spine to support your core like a natural weight belt.
• **Avoid pinching**: Never push into sharp discomfort. If a backbend pinches, lower down to Sphinx Pose on your forearms.
• **Recommended starting posture**: Cat-Cow Stretch and Child's Pose gently restore fluid movement between vertebrae.`,
          suggestedPoseId: "cat-cow",
          poseTitle: "Cat-Cow Spine Warmup"
        };
      }
      if (lower.includes("neck") || lower.includes("shoulder") || lower.includes("desk") || lower.includes("sit")) {
        return {
          reply: `For desk stiffness in your neck and shoulders:
• **Slide shoulder blades down**: Relax your shoulders away from your ears rather than hunching forward.
• **Chin tucks**: Gently tuck your chin slightly back so your head rests evenly over your heart.
• **Open your chest**: Clasp hands behind your lower back or practice Cobra Pose to counteract keyboard hunching.
• **Deep belly breath**: Take 3 slow, deep inhales through your nose to release neck tension.`,
          suggestedPoseId: "cobra-pose",
          poseTitle: "Cobra Pose"
        };
      }
      if (lower.includes("hip") || lower.includes("glute") || lower.includes("sciatica") || lower.includes("tight")) {
        return {
          reply: `Opening tight hips requires patience and gentle breath:
• **Never force rotation**: The hip is a ball-and-socket joint. Let gravity do the work gradually.
• **Flex your front foot**: In Pigeon Pose or Figure-4, actively flexing your foot keeps your knee joint safe.
• **Support your sit bones**: Place a cushion or folded blanket under your hip so both hips remain level.
• **Breathe slow**: Exhale for 5 seconds to signal your nervous system to release deep muscle tension.`,
          suggestedPoseId: "pigeon-pose",
          poseTitle: "Half Pigeon Pose"
        };
      }
      if (lower.includes("breath") || lower.includes("pranayama") || lower.includes("anxiety") || lower.includes("stress")) {
        return {
          reply: `Here is the simplest way to link your breath to yoga:
• **The Golden Rule**: Inhale when you expand, reach, or lift up; Exhale when you fold, twist, or surrender down.
• **4-4 Box Breathing**: Inhale for 4 seconds, hold gently for 4 seconds, exhale for 4 seconds, hold for 4 seconds.
• **Nose Breathing**: Breathe through your nose to warm the air and immediately activate your calming parasympathetic nervous system.`,
          suggestedPoseId: "child-pose",
          poseTitle: "Child's Pose"
        };
      }
      return {
        reply: `Welcome to mindful yoga practice. Here are the 3 core principles for safe, easy movement:
1. **Comfort over depth**: A posture is successful when your breath flows smoothly without straining.
2. **Joint alignment**: Keep your knees tracking in the same direction as your second toe, and spread your fingers wide like starfishes to support your wrists.
3. **Daily consistency**: Even 10 minutes of gentle stretching each morning creates profound physical relief.

Ask me about any specific body area (back, neck, hips, knees) or posture you'd like guidance on!`,
        suggestedPoseId: "child-pose",
        poseTitle: "Child's Pose"
      };
    };

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const fallback = getSmartFallback(message);
        return res.json(fallback);
      }

      const ai = getGeminiClient();
      const systemInstruction = `You are a friendly, compassionate certified master yoga instructor and posture mentor for FlowState.
CRITICAL COMMUNICATION STYLE:
- Use simple, plain English that is easy for anyone (including complete beginners) to understand.
- Avoid overly dry medical or academic jargon. If you mention an anatomical term, immediately explain it simply (e.g., write "lower back and spine" instead of "erector spinae", write "front of your thighs" instead of "quadriceps femoris").
- Format answers with clear, clean bullet points (•) and bold titles for easy reading.
- Focus on practical, safe alignment cues, gentle modifications, and breathing instructions.
- If recommending postures, specify exact poses like Child's Pose, Downward-Facing Dog, Cobra Pose, Cat-Cow, Warrior II, Pigeon Pose, Bridge Pose, Tree Pose, or Savasana.`;

      let prompt = `User Question: "${message}"`;
      if (contextPose && contextPose !== "all") {
        prompt += `\nContext Pose: ${contextPose}`;
      }
      if (Array.isArray(history) && history.length > 0) {
        const conversationSnippet = history.slice(-4).map((h: any) => `${h.sender === "user" ? "User" : "Coach"}: ${h.text}`).join("\n");
        prompt += `\nRecent Conversation:\n${conversationSnippet}\nUser Question: ${message}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "";
      const poseInfo = detectSuggestedPose(message + " " + replyText);

      res.json({
        reply: replyText || "Take slow, even breaths. Listen to your body and honor your range of motion.",
        suggestedPoseId: poseInfo ? poseInfo.poseId : "child-pose",
        poseTitle: poseInfo ? poseInfo.poseTitle : "Child's Pose"
      });
    } catch (error: any) {
      console.error("AI Coach Backend Error:", error);
      const fallback = getSmartFallback(message);
      res.json(fallback);
    }
  };

  // Support both /api/chat-coach and /api/ai/coach endpoints
  app.post("/api/chat-coach", handleCoachRequest);
  app.post("/api/ai/coach", handleCoachRequest);

  // AI Flow Generation endpoint
  app.post("/api/ai/generate-flow", async (req, res) => {
    try {
      const { physicalFeeling, mentalState, durationMinutes, experienceLevel } = req.body;
      const ai = getGeminiClient();

      const prompt = `Generate a customized yoga sequence for:
- Physical state: ${physicalFeeling || "General tight body"}
- Mental state: ${mentalState || "Seeking calm and focus"}
- Duration: ${durationMinutes || 15} minutes
- Experience level: ${experienceLevel || "All levels"}

Return a JSON array of 5 to 8 yoga poses matching the flow.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are an expert yoga sequence designer. Output ONLY valid JSON array with objects containing:
- poseName: English name of pose (e.g. "Downward-Facing Dog", "Warrior II", "Child's Pose", "Pigeon Pose", "Bridge Pose", "Cat-Cow Stretch", "Corpse Pose")
- sanskritName: Sanskrit name (e.g. "Adho Mukha Svanasana")
- durationSeconds: Number of seconds (e.g. 45, 60, 90)
- focusArea: string
- breathCue: string (e.g. "Inhale lengthen, exhale melt your hips down")
- biomechanicalTip: string on anatomical alignment`,
          responseMimeType: "application/json",
        },
      });

      try {
        const parsed = JSON.parse(response.text || "[]");
        res.json({ flow: parsed });
      } catch {
        res.json({ raw: response.text });
      }
    } catch (error: any) {
      console.error("AI Flow Generation Error:", error);
      res.status(500).json({ error: error?.message || "Could not generate flow." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FlowState Yoga server running on port ${PORT}`);
  });
}

startServer();
