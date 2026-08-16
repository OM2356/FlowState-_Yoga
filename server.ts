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

  // AI Yoga Coach and Alignment Assistant
  app.post("/api/ai/coach", async (req, res) => {
    try {
      const { message, context, userCondition } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const ai = getGeminiClient();
      const systemInstruction = `You are a certified master yoga instructor, biomechanics specialist, and mindfulness mentor for FlowState.
Your tone is calm, grounded, encouraging, and deeply knowledgeable about human anatomy, yoga posture alignment, breathwork (pranayama), and physical recovery.
When giving advice:
1. Provide precise anatomical cues (e.g. "engage serratus anterior", "rotate thighs inward", "lengthen lumbar spine").
2. Suggest modifications for beginners or specific injuries (e.g. wrists, knees, lower back).
3. If recommending a yoga sequence, outline the postures clearly with recommended hold times (in seconds or breaths).
4. Emphasize mindful breathing and non-judgmental awareness. Keep advice safe and empowering.`;

      const prompt = `Context: ${JSON.stringify(context || {})}
User condition: ${JSON.stringify(userCondition || {})}
User Question: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text || "May your practice bring you peace and grounding." });
    } catch (error: any) {
      console.error("AI Coach Error:", error);
      res.status(500).json({
        error: error?.message || "An error occurred while consulting the Yoga Guide.",
        fallback: "Listen deeply to your body. Take slow, even diaphragmatic breaths, soften any tension in your neck and shoulders, and honor your current range of motion."
      });
    }
  });

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
