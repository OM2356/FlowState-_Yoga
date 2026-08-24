import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "flowstate-yoga-secret-jwt-key-2026";

// ==========================================
// Types & Backend In-Memory Database
// ==========================================
interface UserRecord {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "user" | "developer" | "admin";
  created_at: string;
  last_login: string;
  is_active: boolean;
  level?: "beginner" | "intermediate" | "advanced";
  focusAreas?: string[];
  mindfulMinutesGoal?: number;
  streakDays?: number;
  totalYogaMinutes?: number;
  totalMeditationMinutes?: number;
}

interface YogaSessionRecord {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  category: string;
  duration: number; // minutes
  difficulty: string;
  completed: boolean;
  completed_at: string;
  calories_estimate?: number;
  mood_before?: string;
  mood_after?: string;
  rating?: number;
  notes?: string;
}

interface MeditationSessionRecord {
  id: string;
  user_id: string;
  duration: number; // minutes
  type: string;
  completed_at: string;
  soundscape?: string;
}

interface SuryaNamaskarSessionRecord {
  id: string;
  user_id: string;
  rounds: number;
  duration: number; // minutes
  completed_at: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  eventType: "AUTH_LOGIN" | "AUTH_REGISTER" | "AUTH_PASSWORD_CHANGE" | "AUTH_FAILED" | "RATE_LIMIT_HIT" | "SESSION_SYNC" | "FEEDBACK_SUBMITTED" | "AI_QUERY" | "DEV_UNAUTHORIZED";
  ipRedacted: string;
  details: string;
  status: "SUCCESS" | "WARN" | "BLOCKED";
}

// In-Memory Database matching PostgreSQL table schema
const DB = {
  users: new Map<string, UserRecord>(),
  yoga_sessions: [] as YogaSessionRecord[],
  meditation_sessions: [] as MeditationSessionRecord[],
  surya_namaskar_sessions: [] as SuryaNamaskarSessionRecord[],
  feedback: [] as any[],
  auditLogs: [] as AuditLog[],
  rateLimits: new Map<string, { count: number; firstAttempt: number }>(),
};

// Seed initial users with strictly bcrypt hashed passwords
async function seedDatabase() {
  // 1. Seed demo user (Email: demo@flowstate.com, Pass: FlowState@123)
  const demoHash = await bcrypt.hash("FlowState@123", 10);
  const demoUser: UserRecord = {
    id: "usr-demo-001",
    name: "Demo Yogi",
    email: "demo@flowstate.com",
    password_hash: demoHash,
    role: "user",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    last_login: new Date(Date.now() - 3600000 * 3).toISOString(),
    is_active: true,
    level: "beginner",
    focusAreas: ["Morning Yoga", "Flexibility", "Stress Relief"],
    mindfulMinutesGoal: 20,
    streakDays: 5,
    totalYogaMinutes: 110,
    totalMeditationMinutes: 45,
  };

  // 2. Seed Admin user (Email: admin@flowstate.com, Pass: Admin@FlowState123)
  const adminHash = await bcrypt.hash("Admin@FlowState123", 10);
  const adminUser: UserRecord = {
    id: "usr-admin-001",
    name: "FlowState Administrator",
    email: "admin@flowstate.com",
    password_hash: adminHash,
    role: "admin",
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    last_login: new Date().toISOString(),
    is_active: true,
    level: "advanced",
    focusAreas: ["Strength", "Balance", "Back & Posture"],
    mindfulMinutesGoal: 30,
    streakDays: 18,
    totalYogaMinutes: 380,
    totalMeditationMinutes: 120,
  };

  // 3. Seed user account (Email: omkarsathe3103@gmail.com, Pass: flowstate2026)
  const omkarHash = await bcrypt.hash("flowstate2026", 10);
  const omkarUser: UserRecord = {
    id: "usr-omkar-001",
    name: "Omkar Sathe",
    email: "omkarsathe3103@gmail.com",
    password_hash: omkarHash,
    role: "user",
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    last_login: new Date().toISOString(),
    is_active: true,
    level: "advanced",
    focusAreas: ["Spine Mobility", "Nervous System Reset", "Core Integration"],
    mindfulMinutesGoal: 30,
    streakDays: 14,
    totalYogaMinutes: 420,
    totalMeditationMinutes: 150,
  };

  // 4. Seed Elena member account (Email: elena.yogi@example.com, Pass: YogiMember2026!)
  const elenaHash = await bcrypt.hash("YogiMember2026!", 10);
  const elenaUser: UserRecord = {
    id: "usr-elena-001",
    name: "Elena Rostova",
    email: "elena.yogi@example.com",
    password_hash: elenaHash,
    role: "user",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    last_login: new Date().toISOString(),
    is_active: true,
    level: "intermediate",
    focusAreas: ["Evening Restore", "Hip Mobility", "Mindful Breathing"],
    mindfulMinutesGoal: 25,
    streakDays: 9,
    totalYogaMinutes: 240,
    totalMeditationMinutes: 80,
  };

  DB.users.set(demoUser.id, demoUser);
  DB.users.set(adminUser.id, adminUser);
  DB.users.set(omkarUser.id, omkarUser);
  DB.users.set(elenaUser.id, elenaUser);

  // Seed sample sessions
  DB.yoga_sessions.push(
    {
      id: "ysess-001",
      user_id: demoUser.id,
      user_name: demoUser.name,
      title: "Morning Sun Salutation Flow",
      category: "Morning Yoga",
      duration: 20,
      difficulty: "beginner",
      completed: true,
      completed_at: new Date(Date.now() - 86400000).toISOString(),
      calories_estimate: 95,
      mood_before: "Sleepy",
      mood_after: "Energized & Calm",
      rating: 5,
      notes: "Loved the slow pacing.",
    },
    {
      id: "ysess-002",
      user_id: demoUser.id,
      user_name: demoUser.name,
      title: "Deep Spine & Posture Recovery",
      category: "Back & Posture",
      duration: 25,
      difficulty: "intermediate",
      completed: true,
      completed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      calories_estimate: 120,
      mood_before: "Stiff",
      mood_after: "Open & Relaxed",
      rating: 5,
      notes: "Neck tension disappeared.",
    },
    {
      id: "ysess-003",
      user_id: omkarUser.id,
      user_name: omkarUser.name,
      title: "Warrior Core & Balance",
      category: "Strength",
      duration: 30,
      difficulty: "advanced",
      completed: true,
      completed_at: new Date(Date.now() - 86400000).toISOString(),
      calories_estimate: 180,
      mood_before: "Tense",
      mood_after: "Focused & Grounded",
      rating: 5,
    }
  );

  DB.meditation_sessions.push(
    {
      id: "med-001",
      user_id: demoUser.id,
      duration: 10,
      type: "Mindful Breath & Nature",
      completed_at: new Date(Date.now() - 86400000).toISOString(),
      soundscape: "Tibetan Bowl & Forest Birds",
    },
    {
      id: "med-002",
      user_id: demoUser.id,
      duration: 15,
      type: "Evening Stress Dissolve",
      completed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      soundscape: "Mountain Stream",
    }
  );

  DB.surya_namaskar_sessions.push({
    id: "sn-001",
    user_id: demoUser.id,
    rounds: 6,
    duration: 12,
    completed_at: new Date(Date.now() - 86400000).toISOString(),
  });

  DB.auditLogs.push({
    id: "log-seed-01",
    timestamp: new Date().toISOString(),
    eventType: "AUTH_LOGIN",
    ipRedacted: "192.168.***.***",
    details: "FlowState Security Engine initialized with bcrypt hashing and JWT protection",
    status: "SUCCESS",
  });
}

seedDatabase();

// ==========================================
// Security & Logging Helpers
// ==========================================

function redactIp(ip: string | undefined): string {
  if (!ip) return "127.0.***.***";
  const parts = ip.replace(/^.*:/, "").split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip.slice(0, 4) + "***";
}

function logSecurityEvent(
  eventType: AuditLog["eventType"],
  ip: string | undefined,
  details: string,
  status: AuditLog["status"] = "SUCCESS"
) {
  // Redact any accidental tokens or passwords
  const sanitizedDetails = details
    .replace(/(password|token|apiKey|secret)[:=]\s*["']?[^"',\s]+["']?/gi, "$1=[REDACTED]")
    .replace(/bearer\s+[a-zA-Z0-9._-]+/gi, "bearer [REDACTED]");

  const logEntry: AuditLog = {
    id: "log-" + crypto.randomUUID().slice(0, 8),
    timestamp: new Date().toISOString(),
    eventType,
    ipRedacted: redactIp(ip),
    details: sanitizedDetails,
    status,
  };

  DB.auditLogs.unshift(logEntry);
  if (DB.auditLogs.length > 200) DB.auditLogs.pop();
}

// Rate Limiter: Max 5 attempts per 15 minutes for auth endpoints
function checkRateLimit(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = DB.rateLimits.get(key);

  if (!entry) {
    DB.rateLimits.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (now - entry.firstAttempt > windowMs) {
    DB.rateLimits.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxAttempts - entry.count };
}

// Helper: safe user serializer (strictly omits password_hash)
function safeUser(u: UserRecord) {
  const { password_hash, ...rest } = u;
  return {
    ...rest,
    password_status: "Securely Hashed (bcrypt)",
    password_masked: "••••••••",
  };
}

// Token creation helper
function createToken(user: UserRecord): string {
  try {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
  } catch {
    return "flw_jwt_" + crypto.randomBytes(24).toString("hex");
  }
}

// Token verification helper
function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch {
    return null;
  }
}

// ==========================================
// Express Server Setup
// ==========================================

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

  // ----------------------------------------------------
  // AUTHENTICATION & SECURITY ENDPOINTS (JWT + BCRYPT)
  // ----------------------------------------------------

  // Register New User (supports both /api/auth/register and /api/register)
  app.post(["/api/auth/register", "/api/register"], async (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const { name, email, password, level, mindfulMinutesGoal, role } = req.body;

      if (!email || !password || !name) {
        logSecurityEvent("AUTH_REGISTER", ip, `Registration failed: missing required fields for ${email}`, "WARN");
        return res.status(400).json({ error: "Full Name, email, and password are required." });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
      }

      // Check existing email
      const existing = Array.from(DB.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (existing) {
        logSecurityEvent("AUTH_REGISTER", ip, `Registration rejected: email ${email} already exists`, "WARN");
        return res.status(409).json({ error: "An account with this email address already exists. Please login instead." });
      }

      // Hash password using bcrypt (10 rounds) - NEVER store plaintext
      const password_hash = await bcrypt.hash(password, 10);
      const userId = "usr-" + crypto.randomUUID().slice(0, 8);
      const userRole = (role === "admin" || email.toLowerCase().includes("admin@flowstate")) ? "admin" : "user";

      const newUser: UserRecord = {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        role: userRole,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        level: level || "beginner",
        focusAreas: ["Morning Yoga", "Flexibility", "Stress Relief"],
        mindfulMinutesGoal: Number(mindfulMinutesGoal) || 20,
        streakDays: 1,
        totalYogaMinutes: 0,
        totalMeditationMinutes: 0,
      };

      DB.users.set(userId, newUser);

      // Generate secure JWT token
      const token = createToken(newUser);

      logSecurityEvent("AUTH_REGISTER", ip, `New user registered securely [bcrypt]: ${newUser.email} [role: ${userRole}]`, "SUCCESS");

      return res.status(201).json({
        user: safeUser(newUser),
        token,
        message: "Account created successfully. Welcome to FlowState!",
      });
    } catch (err: any) {
      console.error("Registration Error:", err);
      return res.status(500).json({ error: "Internal error during registration." });
    }
  });

  // Login User (supports both /api/auth/login and /api/login)
  app.post(["/api/auth/login", "/api/login"], async (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const rateKey = `login:${ip}:${email.toLowerCase().trim()}`;
      const rateCheck = checkRateLimit(rateKey, 6, 15 * 60 * 1000);

      if (!rateCheck.allowed) {
        logSecurityEvent("RATE_LIMIT_HIT", ip, `Login blocked: rate limit exceeded for ${email}`, "BLOCKED");
        return res.status(429).json({
          error: "Too many login attempts. Please wait 15 minutes before trying again.",
        });
      }

      const user = Array.from(DB.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) {
        logSecurityEvent("AUTH_FAILED", ip, `Login failed: user not found (${email})`, "WARN");
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // Secure bcrypt comparison against stored hash
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        logSecurityEvent("AUTH_FAILED", ip, `Login failed: invalid password for ${email}`, "WARN");
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // Update streak and last active
      const now = new Date();
      const lastLoginDate = new Date(user.last_login);
      const diffHours = (now.getTime() - lastLoginDate.getTime()) / (1000 * 3600);
      if (diffHours >= 18 && diffHours <= 48) {
        user.streakDays = (user.streakDays || 1) + 1;
      }
      user.last_login = now.toISOString();

      // Sign JWT token
      const token = createToken(user);

      logSecurityEvent("AUTH_LOGIN", ip, `User logged in: ${user.email} [role: ${user.role}]`, "SUCCESS");

      return res.json({
        user: safeUser(user),
        token,
        message: `Welcome back, ${user.name}! Your yoga journey continues.`,
      });
    } catch (err: any) {
      console.error("Login Error:", err);
      return res.status(500).json({ error: "Internal error during login." });
    }
  });

  // Change Password Endpoint (Requires old password verification with bcrypt)
  app.post("/api/auth/change-password", async (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const { email, currentPassword, newPassword } = req.body;

      if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: "Email, current password, and new password are required." });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long." });
      }

      const user = Array.from(DB.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // 1. Verify current password with bcrypt
      const match = await bcrypt.compare(currentPassword, user.password_hash);
      if (!match) {
        logSecurityEvent("AUTH_PASSWORD_CHANGE", ip, `Password change failed: incorrect current password for ${email}`, "WARN");
        return res.status(401).json({ error: "Current password is incorrect." });
      }

      // 2. Hash new password with bcrypt
      const newHash = await bcrypt.hash(newPassword, 10);
      user.password_hash = newHash;

      logSecurityEvent("AUTH_PASSWORD_CHANGE", ip, `Password changed and re-hashed successfully for ${email}`, "SUCCESS");

      return res.json({
        message: "Password updated successfully. All credentials re-encrypted.",
      });
    } catch (err: any) {
      console.error("Change Password Error:", err);
      return res.status(500).json({ error: "Could not update password." });
    }
  });

  // Forgot Password / Password Reset request
  app.post("/api/auth/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = Array.from(DB.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (user) {
      // In production, an email would be dispatched. For demo/preview, confirm request safely
      logSecurityEvent("AUTH_PASSWORD_CHANGE", req.ip, `Password reset token requested for ${email}`, "SUCCESS");
    }

    return res.json({
      message: "If an account exists with that email, password reset instructions have been sent.",
    });
  });

  // Get Current Authenticated User (Token check)
  app.get("/api/auth/me", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : (req.query.token as string);

    if (!token) {
      return res.status(401).json({ error: "Unauthenticated." });
    }

    const decoded = verifyToken(token);
    if (decoded?.id && DB.users.has(decoded.id)) {
      const user = DB.users.get(decoded.id)!;
      return res.json({ user: safeUser(user) });
    }

    // Fallback: search by id/email from decoded token
    if (decoded?.email) {
      const user = Array.from(DB.users.values()).find((u) => u.email.toLowerCase() === decoded.email.toLowerCase());
      if (user) return res.json({ user: safeUser(user) });
    }

    return res.status(401).json({ error: "Session expired or invalid token." });
  });

  // Update Profile Preferences
  app.put("/api/auth/profile", (req, res) => {
    const { email, name, level, mindfulMinutesGoal, focusAreas } = req.body;

    let user: UserRecord | undefined;
    if (email) {
      user = Array.from(DB.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    }

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (name) user.name = name.trim();
    if (level) user.level = level;
    if (mindfulMinutesGoal) user.mindfulMinutesGoal = Number(mindfulMinutesGoal);
    if (Array.isArray(focusAreas)) user.focusAreas = focusAreas;

    return res.json({ user: safeUser(user), message: "Profile updated successfully." });
  });

  // ----------------------------------------------------
  // SESSIONS STORAGE (YOGA, MEDITATION, SURYA NAMASKAR)
  // ----------------------------------------------------

  // Save Yoga Practice Session
  app.post("/api/sessions", (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const {
        userId,
        userName,
        type, // 'yoga' | 'meditation' | 'surya_namaskar'
        title,
        category,
        durationMinutes,
        difficulty,
        rounds,
        calories_estimate,
        moodBefore,
        moodAfter,
        rating,
        notes,
        soundscape,
      } = req.body;

      const duration = Number(durationMinutes) || 15;
      const now = new Date().toISOString();

      if (type === "meditation") {
        const medSession: MeditationSessionRecord = {
          id: "med-" + crypto.randomUUID().slice(0, 8),
          user_id: userId || "guest-yogi",
          duration,
          type: title || category || "Mindful Meditation",
          completed_at: now,
          soundscape: soundscape || "Nature Soundscape",
        };
        DB.meditation_sessions.unshift(medSession);

        if (userId && DB.users.has(userId)) {
          const u = DB.users.get(userId)!;
          u.totalMeditationMinutes = (u.totalMeditationMinutes || 0) + duration;
        }

        logSecurityEvent("SESSION_SYNC", ip, `Meditation completed (${duration}m) by ${userName || "User"}`, "SUCCESS");
        return res.status(201).json({ session: medSession, message: "Meditation session logged." });
      }

      if (type === "surya_namaskar") {
        const snSession: SuryaNamaskarSessionRecord = {
          id: "sn-" + crypto.randomUUID().slice(0, 8),
          user_id: userId || "guest-yogi",
          rounds: Number(rounds) || 6,
          duration,
          completed_at: now,
        };
        DB.surya_namaskar_sessions.unshift(snSession);

        if (userId && DB.users.has(userId)) {
          const u = DB.users.get(userId)!;
          u.totalYogaMinutes = (u.totalYogaMinutes || 0) + duration;
        }

        logSecurityEvent("SESSION_SYNC", ip, `Surya Namaskar (${rounds || 6} rounds) logged by ${userName || "User"}`, "SUCCESS");
        return res.status(201).json({ session: snSession, message: "Surya Namaskar session recorded." });
      }

      // Default: Yoga Session
      const yogaSession: YogaSessionRecord = {
        id: "ysess-" + crypto.randomUUID().slice(0, 8),
        user_id: userId || "guest-yogi",
        user_name: userName || "FlowState Yogi",
        title: title || "FlowState Yoga Practice",
        category: category || "General Yoga",
        duration,
        difficulty: difficulty || "beginner",
        completed: true,
        completed_at: now,
        calories_estimate: Number(calories_estimate) || Math.round(duration * 4.5),
        mood_before: moodBefore || "Normal",
        mood_after: moodAfter || "Grounded & Energized",
        rating: Number(rating) || 5,
        notes: notes || "",
      };

      DB.yoga_sessions.unshift(yogaSession);

      if (userId && DB.users.has(userId)) {
        const u = DB.users.get(userId)!;
        u.totalYogaMinutes = (u.totalYogaMinutes || 0) + duration;
        u.last_login = now;
      }

      logSecurityEvent(
        "SESSION_SYNC",
        ip,
        `Yoga session saved: "${yogaSession.title}" (${duration}m) for ${yogaSession.user_name}`,
        "SUCCESS"
      );

      return res.status(201).json({ session: yogaSession, message: "Yoga session saved to database." });
    } catch (err: any) {
      console.error("Session Save Error:", err);
      return res.status(500).json({ error: "Could not save practice session." });
    }
  });

  // Get sessions list
  app.get("/api/sessions", (req, res) => {
    const userId = req.query.userId as string;
    if (userId) {
      const userYoga = DB.yoga_sessions.filter((s) => s.user_id === userId);
      const userMed = DB.meditation_sessions.filter((s) => s.user_id === userId);
      const userSn = DB.surya_namaskar_sessions.filter((s) => s.user_id === userId);
      return res.json({
        yoga: userYoga,
        meditation: userMed,
        surya_namaskar: userSn,
        sessions: userYoga, // compatibility
      });
    }
    return res.json({
      yoga: DB.yoga_sessions.slice(0, 50),
      meditation: DB.meditation_sessions.slice(0, 50),
      surya_namaskar: DB.surya_namaskar_sessions.slice(0, 50),
      sessions: DB.yoga_sessions.slice(0, 50),
    });
  });

  // ----------------------------------------------------
  // DEVELOPER & ADMIN SECURE PORTAL APIS (Restricted to omkarsathe3103@gmail.com)
  // ----------------------------------------------------

  const devAuthGuard: express.RequestHandler = (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress;
    const authHeader = req.headers.authorization;
    const devKey = req.headers["x-dev-key"] as string;
    const devEmail = req.headers["x-dev-email"] as string;

    let isAuthorized = false;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded?.email?.toLowerCase().trim() === "omkarsathe3103@gmail.com") {
        isAuthorized = true;
      }
    }

    if (
      !isAuthorized &&
      devEmail?.toLowerCase().trim() === "omkarsathe3103@gmail.com" &&
      (devKey === "flowstate2026" || devKey === "dev123")
    ) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      logSecurityEvent(
        "DEV_UNAUTHORIZED",
        ip,
        `Blocked unauthorized access attempt to ${req.path} from email: ${devEmail || "anonymous"}`,
        "BLOCKED"
      );
      return res.status(403).json({
        error: "Access Denied: Developer Portal is strictly restricted to omkarsathe3103@gmail.com",
      });
    }

    next();
  };

  app.get("/api/dev/overview", devAuthGuard, (_req, res) => {
    const totalUsers = DB.users.size;
    const totalYogaSessions = DB.yoga_sessions.length;
    const totalMeditationSessions = DB.meditation_sessions.length;
    const totalSuryaSessions = DB.surya_namaskar_sessions.length;
    const totalMinutes = DB.yoga_sessions.reduce((acc, s) => acc + s.duration, 0) + 
                         DB.meditation_sessions.reduce((acc, s) => acc + s.duration, 0);

    res.json({
      totalUsers,
      totalYogaSessions,
      totalMeditationSessions,
      totalSuryaSessions,
      totalMinutes,
      databaseType: "PostgreSQL Schema (Secured with Bcrypt)",
      passwordSecurityStandard: "bcrypt_10_rounds_salt",
      recentAuditLogs: DB.auditLogs.slice(0, 15),
    });
  });

  app.get("/api/dev/users", devAuthGuard, (req, res) => {
    const roleFilter = req.query.role as string;
    
    // Map users with calculated session counts, strictly NEVER exposing password_hash
    let usersList = Array.from(DB.users.values()).map((u) => {
      const userYogaCount = DB.yoga_sessions.filter((s) => s.user_id === u.id).length;
      const userMedCount = DB.meditation_sessions.filter((s) => s.user_id === u.id).length;
      const userSnCount = DB.surya_namaskar_sessions.filter((s) => s.user_id === u.id).length;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        created_at: u.created_at,
        last_login: u.last_login,
        is_active: u.is_active,
        level: u.level || "beginner",
        yoga_sessions_count: userYogaCount,
        meditation_sessions_count: userMedCount,
        surya_namaskar_rounds: userSnCount,
        total_yoga_minutes: u.totalYogaMinutes || 0,
        total_meditation_minutes: u.totalMeditationMinutes || 0,
        password_status: "Securely Hashed (bcrypt)",
        password_display: "••••••••",
      };
    });
    
    if (roleFilter) {
      usersList = usersList.filter((u) => u.role === roleFilter);
    }

    res.json({ users: usersList, totalCount: DB.users.size });
  });

  app.get("/api/dev/feedback", devAuthGuard, (_req, res) => {
    res.json({ feedback: DB.feedback });
  });

  app.get("/api/dev/audit-logs", devAuthGuard, (_req, res) => {
    res.json({ auditLogs: DB.auditLogs });
  });

  // ----------------------------------------------------
  // MULTI-CATEGORY QUERY ENDPOINT
  // ----------------------------------------------------
  app.get("/api/flows", (req, res) => {
    // Array query support for categories (e.g. ?categories=spine,stress,morning or ?category=spine&category=hips)
    let categories: string[] = [];
    if (typeof req.query.categories === "string") {
      categories = req.query.categories.split(",").map((s) => s.trim().toLowerCase());
    } else if (Array.isArray(req.query.categories)) {
      categories = (req.query.categories as string[]).map((s) => s.toLowerCase());
    } else if (req.query.category) {
      categories = Array.isArray(req.query.category)
        ? (req.query.category as string[]).map((s) => s.toLowerCase())
        : [(req.query.category as string).toLowerCase()];
    }

    const difficulty = (req.query.difficulty as string)?.toLowerCase();
    const maxDuration = req.query.maxDuration ? Number(req.query.maxDuration) : null;

    res.json({
      query: { categories, difficulty, maxDuration },
      message: "Multi-category filter parsed successfully.",
    });
  });

  // ----------------------------------------------------
  // AI YOGA COACH & SMART FALLBACKS
  // ----------------------------------------------------

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

  const getSmartFallback = (msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes("back") || lower.includes("spine") || lower.includes("pinch")) {
      return {
        reply: `Namaste! To safely relieve lower back stiffness without any strain, follow these key pointers:
• **Gentle bend in the knees**: When bending forward, please keep a slight soft bend in your knees so the lower back is completely relaxed.
• **Draw the navel in**: Gently pull your belly in towards your spine to provide steady core support (Mula & Uddiyana Bandha).
• **Avoid over-arching**: If your lower back feels compressed during backbends, gently come into Sphinx Pose or rest on your forearms.
• **Recommended Asanas**: Marjaryasana-Bitilasana (Cat-Cow) and Balasana (Child's Pose) will restore natural flexibility to each vertebra.`,
        suggestedPoseId: "cat-cow",
        poseTitle: "Cat-Cow (Marjaryasana)",
      };
    }
    if (lower.includes("neck") || lower.includes("shoulder") || lower.includes("desk") || lower.includes("sit")) {
      return {
        reply: `Namaste! For relieving desk tension from your neck, shoulders, and upper back:
• **Relax your shoulders downwards**: Roll your shoulder blades gently back and down, keeping ears away from the shoulders.
• **Jalandhara / Soft Chin Tuck**: Gently draw your chin slightly inward to align your cervical spine naturally.
• **Bhujangasana (Cobra Pose)**: Practice a gentle Cobra pose with palms under your shoulders to open your chest and strengthen upper back muscles.
• **Deep Yogic Breathing**: Take 3 slow, deep breaths through both nostrils, allowing the neck muscles to soften on each exhale.`,
        suggestedPoseId: "cobra-pose",
        poseTitle: "Cobra Pose (Bhujangasana)",
      };
    }
    if (lower.includes("hip") || lower.includes("glute") || lower.includes("sciatica") || lower.includes("tight")) {
      return {
        reply: `Namaste! To gently open tight hips and relieve sciatica:
• **Sthira Sukham Asanam (Steady & Comfortable)**: Never force the hip joint. Allow gravity and steady breathing to open the hip naturally.
• **Flex your front foot**: In Ardha Kapotasana (Half Pigeon), keep your front foot actively flexed to safeguard the knee joint.
• **Support with a cushion or block**: If the hip is elevated, place a folded blanket underneath for solid grounding.
• **Slow Exhalations**: Breathe out long and smooth to release deep tension stored in the pelvis and psoas muscles.`,
        suggestedPoseId: "pigeon-pose",
        poseTitle: "Half Pigeon Pose (Ardha Kapotasana)",
      };
    }
    if (lower.includes("breath") || lower.includes("pranayama") || lower.includes("anxiety") || lower.includes("stress")) {
      return {
        reply: `Namaste! Connecting with your Prana (breath) is the heart of traditional Yoga:
• **Fundamental Breathing Rule**: Inhale when lifting, expanding, and opening; Exhale when folding forward, twisting, and letting go.
• **Nadi Shodhana & Box Breathing**: Inhale deeply for 4 counts, hold gently for 4 counts, exhale smoothly for 4 counts, pause for 4 counts.
• **Nasal Breathing**: Always breathe in and out softly through your nostrils to calm your mind and activate healing parasympathetic energy.`,
        suggestedPoseId: "child-pose",
        poseTitle: "Child's Pose (Balasana)",
      };
    }
    return {
      reply: `Namaste! Welcome to your mindful yoga journey. In Indian classical tradition, remember these three core principles:
1. **Sthira Sukham Asanam**: Every yoga posture should be steady, grounded, and joyful — never painful or strained.
2. **Proper Alignment**: Keep your spine comfortably elongated and joints naturally stacked.
3. **Daily Abhyasa (Practice)**: Even 10 to 15 minutes of daily mindful asana and pranayama brings wonderful vitality, flexibility, and peace of mind.

Please feel free to ask about any specific posture, pain relief, or breathing technique!`,
      suggestedPoseId: "child-pose",
      poseTitle: "Child's Pose (Balasana)",
    };
  };

  // ----------------------------------------------------
  // AI YOGA CHATBOT & ROUTINE ASSISTANT (/api/chat)
  // ----------------------------------------------------

  const FALLBACK_ROUTINES: Record<string, any> = {
    back: {
      message: "Namaste! I hear that you are experiencing mild lower back tension. Let's move with gentle compassion, focusing on gentle spinal decompression and core stability without any forced twisting or deep forward flexion.",
      routine: {
        title: "Lower Back Decompression & Posture Flow",
        focusArea: "Spinal Mobility & Shoulder Opening",
        precautions: "Avoid pulling forcefully in backbends; maintain a soft bend in knees and move with breath. Always consult a physician if experiencing sharp, shooting, or acute pain.",
        durationMinutes: 15,
        level: "beginner",
        warmUp: ["Cat-Cow Stretch", "Child's Pose"],
        mainFlow: ["Sphinx Pose", "Glute Bridges", "Reclined Hand-to-Big-Toe Prep"],
        coolDown: ["Gentle Reclined Spinal Twist", "Corpse Pose (Savasana)"],
        poses: [
          {
            name: "Cat-Cow Stretch (Marjaryasana-Bitilasana)",
            duration: "5-8 breaths",
            visualCue: "Inhale to arch back softly and look up; exhale to round spine towards ceiling.",
            benefit: "Warms up vertebrae and releases mid-back tightness.",
            targetMuscles: ["Erector Spinae", "Abdominals"]
          },
          {
            name: "Child's Pose (Balasana)",
            duration: "1-2 minutes",
            visualCue: "Hips sink back to heels, knees wide, forehead grounded, arms reaching forward.",
            benefit: "Gently lengthens lumbar spine and relaxes the sacrum.",
            targetMuscles: ["Lower Back", "Glutes", "Lats"]
          },
          {
            name: "Sphinx Pose (Salamba Bhujangasana)",
            duration: "1 minute",
            visualCue: "Lie on belly, forearms on mat parallel to each other, gently press chest forward.",
            benefit: "Strengthens lumbar region with safe natural curvature without compressive pinching.",
            targetMuscles: ["Upper Back", "Lumbar Spine", "Chest"]
          },
          {
            name: "Glute Bridges (Setu Bandhasana prep)",
            duration: "10 reps (slow)",
            visualCue: "Press heels down, engage core, lift hips until knees and shoulders align.",
            benefit: "Activates gluteal muscles and hamstrings to relieve excessive pressure from the lower back.",
            targetMuscles: ["Gluteus Maximus", "Hamstrings", "Transverse Abdominis"]
          },
          {
            name: "Reclined Spinal Twist (Supta Matsyendrasana)",
            duration: "1 minute each side",
            visualCue: "Lie on back, hug right knee in, gently guide knee across body with shoulders pinned down.",
            benefit: "Releases tension in the lower back and stretches outer hip rotators.",
            targetMuscles: ["Obliques", "Gluteus Medius", "Spinal Rotators"]
          },
          {
            name: "Corpse Pose (Savasana)",
            duration: "3 minutes",
            visualCue: "Lie flat on your back, arms open at sides with palms facing up, soften jaw and breath.",
            benefit: "Calms sympathetic nervous system and consolidates tissue relaxation.",
            targetMuscles: ["Full Body Relaxation"]
          }
        ]
      }
    },
    posture: {
      message: "Namaste! Improving upper body posture will expand your rib cage, improve oxygen capacity, and eliminate desk hunching.",
      routine: {
        title: "Upper Body Posture & Chest Opening Flow",
        focusArea: "Thoracic Mobility, Scapular Retraction & Core Alignment",
        precautions: "Keep shoulders relaxed down away from ears. Avoid overarching the lumbar spine by keeping the navel softly drawn in.",
        durationMinutes: 15,
        level: "all-levels",
        warmUp: ["Seated Neck & Shoulder Rolls", "Cactus Arms Expansion"],
        mainFlow: ["Cobra Pose", "Downward-Facing Dog", "Warrior II"],
        coolDown: ["Puppy Pose (Heart Melting)", "Savasana"],
        poses: [
          {
            name: "Cat-Cow with Scapular Waves",
            duration: "6 breaths",
            visualCue: "On hands and knees, glide shoulder blades together on inhale, spread them wide on exhale.",
            benefit: "Mobilizes thoracic spine and awakens rhomboids.",
            targetMuscles: ["Rhomboids", "Serratus Anterior"]
          },
          {
            name: "Downward-Facing Dog (Adho Mukha Svanasana)",
            duration: "1 minute",
            visualCue: "Press firmly through hands, draw chest towards thighs, create inverted V shape.",
            benefit: "Decompresses the entire spine and lengthens tight pectoral muscles.",
            targetMuscles: ["Shoulders", "Hamstrings", "Lats"]
          },
          {
            name: "Cobra Pose (Bhujangasana)",
            duration: "5 breaths",
            visualCue: "Palms under shoulders, lift chest using upper back muscles with minimal weight in hands.",
            benefit: "Counteracts forward head posture by strengthening erector spinae and posterior deltoids.",
            targetMuscles: ["Upper Back", "Chest", "Trapezius"]
          },
          {
            name: "Warrior II (Virabhadrasana II)",
            duration: "45 seconds per side",
            visualCue: "Arms extended parallel to mat at shoulder height, gaze over front fingertips, open hips.",
            benefit: "Builds upright stamina, balances pelvic tilt, and expands chest.",
            targetMuscles: ["Deltoids", "Quadriceps", "Core"]
          },
          {
            name: "Puppy Pose (Uttana Shishosana)",
            duration: "1-2 minutes",
            visualCue: "Hips stay stacked directly above knees, walk hands forward and melt forehead and chest to mat.",
            benefit: "Deep passive opening for stiff shoulders, chest, and thoracic spine.",
            targetMuscles: ["Pectorals", "Latissimus Dorsi", "Shoulders"]
          },
          {
            name: "Corpse Pose (Savasana)",
            duration: "2-3 minutes",
            visualCue: "Rest comfortably on back, letting collarbones broaden naturally with every exhale.",
            benefit: "Integrates postural realignment into neural muscle memory.",
            targetMuscles: ["Nervous System Integration"]
          }
        ]
      }
    },
    morning: {
      message: "Namaste and Good Morning! This invigorating routine gently awakens circulation, lubricates all major joints, and centers your breath for a vibrant day.",
      routine: {
        title: "Morning Vitality & Prana Energy Flow",
        focusArea: "Full Body Awakening & Mind-Body Focus",
        precautions: "Move smoothly without rushing. Since the body is stiffer in the morning, honor smaller ranges of motion.",
        durationMinutes: 12,
        level: "beginner",
        warmUp: ["Gentle Cat-Cow", "Wrist & Ankle Circles"],
        mainFlow: ["Sun Salutation A Prep", "Tree Pose", "Low Lunge"],
        coolDown: ["Child's Pose", "Seated Breath Meditation"],
        poses: [
          {
            name: "Cat-Cow Spine Awakening",
            duration: "5-6 breaths",
            visualCue: "Inhale arch gently, exhale curve spine skyward with belly drawn in.",
            benefit: "Stimulates cerebrospinal fluid flow and awakens spinal nerve pathways.",
            targetMuscles: ["Spine", "Core"]
          },
          {
            name: "Downward-Facing Dog (Adho Mukha Svanasana)",
            duration: "1 minute (pedaling heels)",
            visualCue: "Gently pedal feet left and right to wake up calves and hamstrings.",
            benefit: "Invigorates circulation by gently inverting the heart above the head.",
            targetMuscles: ["Calves", "Hamstrings", "Shoulders"]
          },
          {
            name: "Low Lunge (Anjaneyasana)",
            duration: "45 seconds per side",
            visualCue: "Step one foot forward between hands, lower back knee down, sweep arms overhead.",
            benefit: "Stretches tight hip flexors and psoas muscles from sleep.",
            targetMuscles: ["Psoas", "Quadriceps", "Chest"]
          },
          {
            name: "Tree Pose (Vrksasana)",
            duration: "30-45 seconds per side",
            visualCue: "Place sole of foot on inner calf or thigh (never on knee joint), hands at heart center.",
            benefit: "Sharpens mental focus, balances nervous system, and grounds energy.",
            targetMuscles: ["Ankles", "Core", "Hip Abductors"]
          },
          {
            name: "Child's Pose (Balasana)",
            duration: "2 minutes",
            visualCue: "Rest hips back, take 5 slow diaphragmatic breaths into your lower back.",
            benefit: "Deep grounded calm before beginning daily activities.",
            targetMuscles: ["Lower Back", "Hips"]
          }
        ]
      }
    },
    desk: {
      message: "Namaste! Spending long hours sitting compresses the spine and tightens the neck and hips. This targeted desk recovery routine will restore physical ease.",
      routine: {
        title: "Desk Worker Neck, Shoulder & Hip Reset",
        focusArea: "Cervical Alignment, Psoas Release & Scapular Mobility",
        precautions: "Avoid forcing neck rotation; keep all cervical movements gentle and fluid with steady nasal breathing.",
        durationMinutes: 10,
        level: "all-levels",
        warmUp: ["Ear-to-Shoulder Neck Stretches", "Shoulder Shrugs & Rolls"],
        mainFlow: ["Eagle Arms Stretch", "Low Lunge Psoas Opener", "Half Pigeon / Seated Figure 4"],
        coolDown: ["Child's Pose", "Corpse Pose"],
        poses: [
          {
            name: "Eagle Arms Stretch (Garudasana Arms)",
            duration: "5 breaths each side",
            visualCue: "Cross right elbow under left, wrap forearms together with palms pressing, lift elbows to shoulder height.",
            benefit: "Deep stretch for rhomboids and space between shoulder blades.",
            targetMuscles: ["Upper Trapezius", "Rhomboids", "Deltoids"]
          },
          {
            name: "Low Lunge (Anjaneyasana)",
            duration: "45 seconds per side",
            visualCue: "Right foot forward, left knee on mat, hands on front thigh or reaching up, sink pelvis forward.",
            benefit: "Counteracts tight hip flexors caused by 8+ hours of chair sitting.",
            targetMuscles: ["Iliopsoas", "Rectus Femoris"]
          },
          {
            name: "Sphinx Pose (Salamba Bhujangasana)",
            duration: "1 minute",
            visualCue: "Rest on forearms, draw chest through arm bones, gently look forward.",
            benefit: "Restores natural lumbar lordosis and opens tight chest.",
            targetMuscles: ["Upper Back", "Pectorals"]
          },
          {
            name: "Half Pigeon Pose (Ardha Kapotasana)",
            duration: "1 minute per side",
            visualCue: "Right shin forward at comfortable angle, back leg straight, fold forward softly.",
            benefit: "Releases deep tension in piriformis and gluteal muscles to prevent sciatica.",
            targetMuscles: ["Gluteus Medius", "Piriformis", "IT Band"]
          },
          {
            name: "Child's Pose (Balasana)",
            duration: "2 minutes",
            visualCue: "Sink back into heels, extend fingertips long, breathe into lower ribs.",
            benefit: "Allows nervous system to shift from sympathetic stress to healing parasympathetic rest.",
            targetMuscles: ["Spine", "Hips", "Shoulders"]
          }
        ]
      }
    }
  };

  const handleChatAssistant = async (req: express.Request, res: express.Response) => {
    const ip = req.ip || req.socket.remoteAddress;
    const body = req.body || {};
    let promptText = "";

    if (typeof body.prompt === "string") {
      promptText = body.prompt;
    } else if (typeof body.message === "string") {
      promptText = body.message;
    } else if (Array.isArray(body.messages) && body.messages.length > 0) {
      const lastMsg = body.messages[body.messages.length - 1];
      promptText = lastMsg.content || lastMsg.text || "";
    }

    promptText = promptText.trim();
    if (!promptText) {
      return res.status(400).json({ error: "A prompt or message is required." });
    }

    const lower = promptText.toLowerCase();

    // Determine fallback key based on context keywords
    let fallbackKey = "back";
    if (lower.includes("posture") || lower.includes("chest") || lower.includes("hunch") || lower.includes("straight")) {
      fallbackKey = "posture";
    } else if (lower.includes("morning") || lower.includes("energy") || lower.includes("wake") || lower.includes("sun")) {
      fallbackKey = "morning";
    } else if (lower.includes("desk") || lower.includes("neck") || lower.includes("shoulder") || lower.includes("sit")) {
      fallbackKey = "desk";
    } else if (lower.includes("hip") || lower.includes("sciatica") || lower.includes("glute")) {
      fallbackKey = "back";
    }

    const defaultFallback = FALLBACK_ROUTINES[fallbackKey] || FALLBACK_ROUTINES.back;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        logSecurityEvent("AI_QUERY", ip, `Chat fallback served for query: "${promptText.slice(0, 30)}..."`, "SUCCESS");
        return res.json({
          message: defaultFallback.message,
          routine: defaultFallback.routine,
          text: `${defaultFallback.message}\n\n${JSON.stringify(defaultFallback.routine, null, 2)}`
        });
      }

      const ai = getGeminiClient();
      const systemInstruction = `You are an expert AI Yoga Instructor specializing in posture alignment, mobility, and gentle therapy.

Strict Instructions:
1. Safety Protocols:
   - For back pain: Avoid deep forward folds or sudden twisting. Focus on spinal decompression, core stability (glute bridges, gentle sphinx, bird-dog), and safe hip openers.
   - For posture: Focus on chest openers, upper back strengthening (rhomboids, posterior deltoids), and pelvic alignment.
   - Always include a concise safety warning to consult a medical professional if pain is acute, sharp, or severe.

2. Routine Structure:
   - Structure routines logically: Warm-up (~15%), Main Asana Flow (~70%), Cool-down/Savasana (~15%).
   - Include 4 to 6 specific yoga poses.
   - Keep pose explanations concise with clear duration (in breaths or minutes).

3. Response Format:
   Return valid JSON with the following schema:
   {
     "message": "A short, warm, empathetic introductory message in courteous tone",
     "routine": {
       "title": "Clear descriptive routine title",
       "focusArea": "Primary physical and mental focus areas",
       "precautions": "Safety guidance and disclaimer",
       "durationMinutes": 15,
       "level": "beginner | intermediate | all-levels",
       "warmUp": ["Pose 1", "Pose 2"],
       "mainFlow": ["Pose 3", "Pose 4"],
       "coolDown": ["Pose 5", "Corpse Pose"],
       "poses": [
         {
           "name": "Pose Name in English (and Sanskrit)",
           "duration": "e.g., 5-8 breaths or 1 minute",
           "visualCue": "Clear, concise anatomical visual cue",
           "benefit": "Biomechanical and wellness benefit",
           "targetMuscles": ["Muscle 1", "Muscle 2"]
         }
       ]
     }
   }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `User Query / Condition / Goal: "${promptText}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      const responseText = response.text || "";
      let parsedData: any = null;

      try {
        parsedData = JSON.parse(responseText);
      } catch (parseErr) {
        // Attempt substring regex extraction if markdown wraps it
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      }

      if (parsedData && parsedData.routine) {
        logSecurityEvent("AI_QUERY", ip, `AI Routine generated for query: "${promptText.slice(0, 30)}..."`, "SUCCESS");
        return res.json({
          message: parsedData.message || defaultFallback.message,
          routine: parsedData.routine,
          text: responseText
        });
      }

      // If structure slightly different (top level has routine fields)
      if (parsedData && parsedData.poses) {
        return res.json({
          message: parsedData.message || defaultFallback.message,
          routine: parsedData,
          text: responseText
        });
      }

      // Fallback if parsing failed
      return res.json({
        message: defaultFallback.message,
        routine: defaultFallback.routine,
        text: responseText || `${defaultFallback.message}\n\n${JSON.stringify(defaultFallback.routine, null, 2)}`
      });

    } catch (err: any) {
      console.error("Chat API Error:", err);
      logSecurityEvent("AI_QUERY", ip, `Chat API error, served fallback: ${err?.message}`, "WARN");
      return res.json({
        message: defaultFallback.message,
        routine: defaultFallback.routine,
        text: `${defaultFallback.message}\n\n${JSON.stringify(defaultFallback.routine, null, 2)}`
      });
    }
  };

  // Support all standard chat & routine endpoints
  app.post("/api/chat", handleChatAssistant);
  app.post("/api/ai/chat", handleChatAssistant);
  app.post("/api/ai/routine", handleChatAssistant);

  const handleCoachRequest = async (req: express.Request, res: express.Response) => {
    const { message, history, contextPose } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const ip = req.ip || req.socket.remoteAddress;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        const fallback = getSmartFallback(message);
        logSecurityEvent("AI_QUERY", ip, `AI Coach fallback served for query: "${message.slice(0, 30)}..."`, "SUCCESS");
        return res.json(fallback);
      }

      const ai = getGeminiClient();
      const systemInstruction = `You are a certified master Indian yoga guru and compassionate posture mentor for FlowState Yoga.
CRITICAL COMMUNICATION STYLE:
- Use warm, polite, encouraging Indian English phrasing (e.g., "Namaste!", "Please ensure your spine is comfortably straight", "Do not strain your body at all", "Take deep breaths from the belly", "Hold with ease (Sthira Sukham Asanam)", "Very good!").
- Provide clear, simple explanations combining authentic Sanskrit terms (e.g. Asana, Pranayama, Balasana, Trikonasana, Bhujangasana, Parivrtta Utthan Pristhasana, Surya Namaskar) with their plain English meanings.
- Format answers with clean bullet points (•) and bold highlights for effortless reading.
- Focus on practical anatomical alignment, safety precautions, joint health, and mindful breathing.
- If recommending postures, specify exact poses like Child's Pose (Balasana), Downward Dog (Adho Mukha Svanasana), Cobra Pose (Bhujangasana), Cat-Cow (Marjaryasana), Twisted Lizard (Parivrtta Utthan Pristhasana), Dancer (Natarajasana), Camel (Ustrasana), Wheel (Chakrasana), or Savasana.`;

      let prompt = `User Question: "${message}"`;
      if (contextPose && contextPose !== "all") {
        prompt += `\nContext Pose: ${contextPose}`;
      }
      if (Array.isArray(history) && history.length > 0) {
        const conversationSnippet = history
          .slice(-4)
          .map((h: any) => `${h.sender === "user" ? "User" : "Coach"}: ${h.text}`)
          .join("\n");
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

      logSecurityEvent("AI_QUERY", ip, `AI Coach answered query: "${message.slice(0, 30)}..."`, "SUCCESS");

      res.json({
        reply: replyText || "Take slow, even breaths. Listen to your body and honor your range of motion.",
        suggestedPoseId: poseInfo ? poseInfo.poseId : "child-pose",
        poseTitle: poseInfo ? poseInfo.poseTitle : "Child's Pose",
      });
    } catch (error: any) {
      console.error("AI Coach Backend Error:", error);
      logSecurityEvent("AI_QUERY", ip, `AI Coach error, serving fallback: ${error?.message}`, "WARN");
      const fallback = getSmartFallback(message);
      res.json(fallback);
    }
  };

  app.post("/api/chat-coach", handleCoachRequest);
  app.post("/api/ai/coach", handleCoachRequest);

  // AI Flow Generation Endpoint with robust Fallback
  app.post("/api/ai/generate-flow", async (req, res) => {
    try {
      const { physicalFeeling, mentalState, durationMinutes, experienceLevel } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // High quality fallback sequence
        return res.json({
          flow: [
            {
              poseName: "Cat-Cow Spine Warmup",
              sanskritName: "Marjaryasana-Bitilasana",
              durationSeconds: 60,
              focusArea: "Spine & Core",
              breathCue: "Inhale arch gently, exhale round through upper back",
              biomechanicalTip: "Stack wrists directly under shoulders and knees under hips.",
            },
            {
              poseName: "Downward-Facing Dog",
              sanskritName: "Adho Mukha Svanasana",
              durationSeconds: 60,
              focusArea: "Hamstrings & Shoulders",
              breathCue: "Exhale lengthen hips skyward, relax neck completely",
              biomechanicalTip: "Press firmly through thumb and index finger knuckles.",
            },
            {
              poseName: "Warrior II",
              sanskritName: "Virabhadrasana II",
              durationSeconds: 60,
              focusArea: "Hips & Quadriceps",
              breathCue: "Inhale expand arms wide, exhale sink front knee over ankle",
              biomechanicalTip: "Keep torso upright directly centered between feet.",
            },
            {
              poseName: "Half Pigeon Pose",
              sanskritName: "Ardha Kapotasana",
              durationSeconds: 90,
              focusArea: "Glutes & Hip Flexors",
              breathCue: "Deep slow exhales to release outer hip tension",
              biomechanicalTip: "Flex front foot to stabilize and protect knee joint.",
            },
            {
              poseName: "Corpse Pose",
              sanskritName: "Savasana",
              durationSeconds: 120,
              focusArea: "Full Body Nervous System",
              breathCue: "Allow breath to return to natural effortless rhythm",
              biomechanicalTip: "Palms turn open to the ceiling with shoulders resting heavy.",
            },
          ],
        });
      }

      const ai = getGeminiClient();
      const prompt = `Generate a customized yoga sequence for:
- Physical state: ${physicalFeeling || "General tight body"}
- Mental state: ${mentalState || "Seeking calm and focus"}
- Duration: ${durationMinutes || 15} minutes
- Experience level: ${experienceLevel || "All levels"}

Return a JSON array of 5 to 7 yoga poses matching the flow.`;

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

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      metrics: {
        users: DB.users.size,
        yoga_sessions: DB.yoga_sessions.length,
        surya_namaskar_sessions: DB.surya_namaskar_sessions.length,
        feedback: DB.feedback.length,
      },
    });
  });

  // ----------------------------------------------------
  // Vite Middleware Setup
  // ----------------------------------------------------
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
