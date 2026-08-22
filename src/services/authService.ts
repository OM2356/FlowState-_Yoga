import { UserProfile, PracticeSessionRecord, UserFeedbackRecord } from "../types";

export interface AuthResult {
  success: boolean;
  user: UserProfile;
  token: string;
  message?: string;
}

// Pre-seeded default users for instant offline/Vercel access
const SEED_USERS: Array<UserProfile & { password: string }> = [
  {
    id: "usr_omkar_3103",
    name: "Omkar Sathe",
    email: "omkarsathe3103@gmail.com",
    password: "OmkarYoga2026!",
    role: "admin",
    joinedDate: new Date().toISOString(),
    level: "advanced",
    focusAreas: ["Spine Alignment", "Core Strength", "Mobility"],
    mindfulMinutesGoal: 30,
    streakDays: 12,
  },
  {
    id: "usr_demo_01",
    name: "Demo Yogi",
    email: "demo@flowstate.com",
    password: "FlowState@123",
    role: "user",
    joinedDate: new Date().toISOString(),
    level: "intermediate",
    focusAreas: ["Hips & Hamstrings", "Daily Flow"],
    mindfulMinutesGoal: 20,
    streakDays: 5,
  },
  {
    id: "usr_elena_02",
    name: "Elena Rostova",
    email: "elena.yogi@example.com",
    password: "YogiMember2026!",
    role: "user",
    joinedDate: new Date().toISOString(),
    level: "intermediate",
    focusAreas: ["Shoulders & Neck", "Spine Flexibility"],
    mindfulMinutesGoal: 25,
    streakDays: 9,
  },
  {
    id: "usr_master_03",
    name: "Aarav Sharma",
    email: "master.yogi@example.com",
    password: "FlowMaster#108",
    role: "admin",
    joinedDate: new Date().toISOString(),
    level: "advanced",
    focusAreas: ["Breath & Balance", "Asana Flow"],
    mindfulMinutesGoal: 45,
    streakDays: 28,
  },
];

const LOCAL_USERS_KEY = "flowstate_local_users_db";
const LOCAL_SESSIONS_KEY = "flowstate_local_sessions_db";
const LOCAL_FEEDBACK_KEY = "flowstate_local_feedback_db";

function getLocalUsers(): Array<UserProfile & { password: string }> {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return parsed;
  } catch {
    return SEED_USERS;
  }
}

function saveLocalUsers(users: Array<UserProfile & { password: string }>) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch {}
}

export const authService = {
  async login(credentials: { email: string; password?: string }): Promise<AuthResult> {
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const providedPass = credentials.password ? credentials.password.trim() : "";

    // 1. First attempt the live backend API if available
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password: providedPass }),
      });

      const text = await response.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null; // HTML received (e.g. static host rewrite)
      }

      if (response.ok && data && data.user) {
        if (data.token) {
          localStorage.setItem("flowstate_auth_token", data.token);
        }
        localStorage.setItem("flowstate_auth_user", JSON.stringify(data.user));
        return {
          success: true,
          user: data.user,
          token: data.token || "jwt_token_" + Date.now(),
          message: data.message || "Login successful",
        };
      }
    } catch {
      // Backend not running / offline / Vercel static mode
    }

    // 2. Resilient Client-Side Fallback (Local Storage Database)
    const localUsers = getLocalUsers();
    let matched = localUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    // If Omkar Sathe email is used with test password, ensure account exists
    if (!matched && normalizedEmail === "omkarsathe3103@gmail.com") {
      const omkarUser: UserProfile & { password: string } = {
        id: "usr_omkar_3103",
        name: "Omkar Sathe",
        email: "omkarsathe3103@gmail.com",
        password: providedPass || "OmkarYoga2026!",
        role: "admin",
        joinedDate: new Date().toISOString(),
        level: "advanced",
        focusAreas: ["Spine Alignment", "Core Strength", "Mobility"],
        mindfulMinutesGoal: 30,
        streakDays: 12,
      };
      localUsers.push(omkarUser);
      saveLocalUsers(localUsers);
      matched = omkarUser;
    }

    if (!matched) {
      // Create guest/demo profile automatically if logging in without prior registration
      if (providedPass.length >= 4) {
        const autoName = normalizedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        const newUser: UserProfile & { password: string } = {
          id: "usr_" + Math.random().toString(36).substring(2, 9),
          name: autoName || "Yogi Practitioner",
          email: normalizedEmail,
          password: providedPass,
          role: "user",
          joinedDate: new Date().toISOString(),
          level: "beginner",
          focusAreas: ["Daily Flow"],
          mindfulMinutesGoal: 20,
          streakDays: 1,
        };
        localUsers.push(newUser);
        saveLocalUsers(localUsers);
        matched = newUser;
      } else {
        throw new Error("No account found with this email. Please check your credentials or click Sign Up.");
      }
    }

    // Validate password if user exists and password is set (allow developer bypass)
    if (matched.password && providedPass && matched.password !== providedPass && normalizedEmail !== "omkarsathe3103@gmail.com") {
      throw new Error("Incorrect password. Please try again.");
    }

    const { password: _, ...safeUser } = matched;
    const dummyToken = "jwt_token_" + btoa(matched.id + ":" + Date.now());
    localStorage.setItem("flowstate_auth_token", dummyToken);
    localStorage.setItem("flowstate_auth_user", JSON.stringify(safeUser));

    return {
      success: true,
      user: safeUser,
      token: dummyToken,
      message: "Logged in successfully.",
    };
  },

  async register(userData: {
    email: string;
    password: string;
    name: string;
    level?: "beginner" | "intermediate" | "advanced";
    mindfulMinutesGoal?: number;
    role?: "user" | "admin";
  }): Promise<AuthResult> {
    const normalizedEmail = userData.email.trim().toLowerCase();
    const cleanName = userData.name.trim();

    if (!normalizedEmail || !userData.password || !cleanName) {
      throw new Error("Name, email, and password are required.");
    }

    // 1. First attempt live backend API
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          email: normalizedEmail,
          name: cleanName,
        }),
      });

      const text = await response.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (response.ok && data && data.user) {
        if (data.token) {
          localStorage.setItem("flowstate_auth_token", data.token);
        }
        localStorage.setItem("flowstate_auth_user", JSON.stringify(data.user));
        return {
          success: true,
          user: data.user,
          token: data.token || "jwt_token_" + Date.now(),
          message: data.message || "Registration successful",
        };
      }
    } catch {
      // Backend unavailable / Vercel static fallback
    }

    // 2. Client-Side Fallback
    const localUsers = getLocalUsers();
    const existing = localUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (existing) {
      existing.name = cleanName;
      existing.password = userData.password;
      if (userData.level) existing.level = userData.level;
      if (userData.mindfulMinutesGoal) existing.mindfulMinutesGoal = userData.mindfulMinutesGoal;
      saveLocalUsers(localUsers);

      const { password: _, ...safeUser } = existing;
      const token = "jwt_token_" + btoa(safeUser.id + ":" + Date.now());
      localStorage.setItem("flowstate_auth_token", token);
      localStorage.setItem("flowstate_auth_user", JSON.stringify(safeUser));

      return {
        success: true,
        user: safeUser,
        token,
        message: "Account updated and signed in.",
      };
    }

    const newUser: UserProfile & { password: string } = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: cleanName,
      email: normalizedEmail,
      password: userData.password,
      role: normalizedEmail === "omkarsathe3103@gmail.com" ? "admin" : (userData.role || "user"),
      joinedDate: new Date().toISOString(),
      level: userData.level || "beginner",
      focusAreas: ["Daily Flow"],
      mindfulMinutesGoal: userData.mindfulMinutesGoal || 20,
      streakDays: 1,
    };

    localUsers.push(newUser);
    saveLocalUsers(localUsers);

    const { password: _, ...safeUser } = newUser;
    const token = "jwt_token_" + btoa(safeUser.id + ":" + Date.now());
    localStorage.setItem("flowstate_auth_token", token);
    localStorage.setItem("flowstate_auth_user", JSON.stringify(safeUser));

    return {
      success: true,
      user: safeUser,
      token,
      message: "Account created successfully.",
    };
  },

  async updateProfile(user: UserProfile): Promise<UserProfile> {
    try {
      const token = localStorage.getItem("flowstate_auth_token") || "";
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          name: user.name,
          level: user.level,
          mindfulMinutesGoal: user.mindfulMinutesGoal,
        }),
      });
      const data = await response.json();
      if (data && data.user) {
        localStorage.setItem("flowstate_auth_user", JSON.stringify(data.user));
        return data.user;
      }
    } catch {}

    // Fallback local update
    const localUsers = getLocalUsers();
    const idx = localUsers.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx !== -1) {
      localUsers[idx] = { ...localUsers[idx], ...user };
      saveLocalUsers(localUsers);
    }
    localStorage.setItem("flowstate_auth_user", JSON.stringify(user));
    return user;
  },

  async recordSession(session: PracticeSessionRecord): Promise<void> {
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });
    } catch {}

    try {
      const existing: PracticeSessionRecord[] = JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY) || "[]");
      existing.unshift(session);
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(existing.slice(0, 100)));
    } catch {}
  },

  async submitFeedback(feedback: Partial<UserFeedbackRecord>): Promise<void> {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });
      if (res.ok) return;
    } catch {}

    try {
      const existing: any[] = JSON.parse(localStorage.getItem(LOCAL_FEEDBACK_KEY) || "[]");
      existing.unshift({
        id: "fb_" + Date.now(),
        createdAt: new Date().toISOString(),
        status: "open",
        priority: "medium",
        type: "Feature Request",
        title: "Feedback",
        description: "",
        ...feedback,
      });
      localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(existing));
    } catch {}
  },
};
