import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Award, 
  Clock, 
  Target, 
  LogIn, 
  UserPlus, 
  Terminal, 
  Key,
  Shield,
  Heart,
  Layers,
  ArrowRight,
  Compass
} from "lucide-react";

interface AuthLandingPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [dailyGoal, setDailyGoal] = useState<number>(15);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setError("Please provide your full display name.");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "signup"
          ? {
              email: email.trim().toLowerCase(),
              password: password.trim(),
              name: name.trim(),
              level,
              mindfulMinutesGoal: dailyGoal,
              role: email.toLowerCase() === "omkarsathe3103@gmail.com" ? "developer" : "user",
            }
          : {
              email: email.trim().toLowerCase(),
              password: password.trim(),
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      if (data.token) {
        localStorage.setItem("flowstate_auth_token", data.token);
      }
      if (data.user) {
        localStorage.setItem("flowstate_auth_user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick One-Click Logins for testing and instant access
  const handleQuickLoginOmkar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "omkarsathe3103@gmail.com",
          password: "flowstate2026",
        }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        localStorage.setItem("flowstate_auth_token", data.token);
        localStorage.setItem("flowstate_auth_user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        // In case not registered yet, auto-register
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "omkarsathe3103@gmail.com",
            password: "flowstate2026",
            name: "Omkar Sathe (Lead Developer)",
            role: "developer",
            level: "advanced",
            mindfulMinutesGoal: 30,
          }),
        });
        const regData = await regRes.json();
        if (regData.user) {
          localStorage.setItem("flowstate_auth_token", regData.token);
          localStorage.setItem("flowstate_auth_user", JSON.stringify(regData.user));
          onLoginSuccess(regData.user);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLoginElena = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "elena.yogi@example.com",
          password: "YogiMember2026!",
        }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        localStorage.setItem("flowstate_auth_token", data.token);
        localStorage.setItem("flowstate_auth_user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLoginDevInternal = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "dev@flowstate.internal",
          password: "DeveloperPass123!",
        }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        localStorage.setItem("flowstate_auth_token", data.token);
        localStorage.setItem("flowstate_auth_user", JSON.stringify(data.user));
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1A221C] flex flex-col justify-between selection:bg-[#4E6548] selection:text-white">
      {/* Top Simple Bar */}
      <div className="py-4 px-6 border-b border-[#E2DAD0] bg-[#FAF8F4]/80 backdrop-blur-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-medium tracking-tight text-[#1A221C]">FlowState</span>
            <span className="text-[10px] uppercase ml-2 px-2 py-0.5 rounded-md bg-[#C1664C]/15 text-[#9E4F38] font-bold tracking-wider">
              Yoga & Recovery
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#5D6B60]">
          <ShieldCheck className="w-4 h-4 text-[#4E6548]" />
          <span className="hidden sm:inline font-medium">Bcrypt Hashed & Rate-Limited Security</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Side: Editorial Introduction */}
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE2D4] border border-[#DDD3C2] text-xs font-semibold text-[#4E6548]">
            <Sparkles className="w-3.5 h-3.5 text-[#C1664C]" />
            <span>Member Authentication & Studio Access</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1A221C] leading-[1.15]">
            Return to Stillness, Alignment, & Flow.
          </h1>

          <p className="text-sm sm:text-base text-[#526355] leading-relaxed max-w-xl">
            FlowState is a mindful movement and somatic recovery sanctuary. Sign in to track your practice history, unlock customized breathwork, and access anatomical yoga alignments.
          </p>

          {/* Value points */}
          <div className="space-y-3 pt-2">
            {[
              {
                title: "Personalized Somatic Protocols",
                desc: "Desk worker relief, nervous system down-regulation, and hip mobility.",
              },
              {
                title: "Realistic 3D Asana Visualizer",
                desc: "Interactive biomechanical posture guides and Sanskrit pronunciations.",
              },
              {
                title: "Pranayama Breathwork Rhythm Engine",
                desc: "Guided 4-7-8, Box Breathing, and Vagal Nerve soothing loops.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#4E6548]/15 text-[#4E6548] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-[#1E2520]">{item.title}</h2>
                  <p className="text-xs text-[#637265]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Lead Developer Quick Link Badge */}
          <div className="p-4 rounded-2xl bg-[#EBE3D5] border border-[#DDD2C0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1E2520] text-[#8BBA85] flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1E2520] block">Developer Access</span>
                <span className="text-[11px] text-[#556457]">Lead Developer: omkarsathe3103@gmail.com</span>
              </div>
            </div>
            <button
              onClick={handleQuickLoginOmkar}
              className="py-1.5 px-3 rounded-xl bg-[#1E2520] hover:bg-[#2F3A31] text-[#8BBA85] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>1-Click Dev Sign-In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Auth Card Form */}
        <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl border border-[#E2DAD0] shadow-xl p-6 sm:p-8 space-y-6">
          {/* Toggle Tab */}
          <div className="flex items-center bg-[#ECE4D6] p-1.5 rounded-2xl border border-[#DDD3C2]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-[#FAF8F4] text-[#1A221C] shadow-xs"
                  : "text-[#546457] hover:text-[#1A221C]"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-[#FAF8F4] text-[#1A221C] shadow-xs"
                  : "text-[#546457] hover:text-[#1A221C]"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          <div className="text-center">
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#1A221C]">
              {mode === "login" ? "Welcome Back to Practice" : "Join the FlowState Studio"}
            </h2>
            <p className="text-xs text-[#637265] mt-1">
              {mode === "login"
                ? "Enter your credentials to continue your yoga journey"
                : "Create your practitioner profile to save streaks and custom flows"}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-[#F8D7DA] text-[#721C24] text-xs font-medium border border-[#F5C6CB] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#721C24] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-1">
                  Full Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7A8B7D] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-sm text-[#1E2520] focus:outline-hidden focus:border-[#4E6548] transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A8B7D] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="yogi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-sm text-[#1E2520] focus:outline-hidden focus:border-[#4E6548] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A8B7D] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-sm text-[#1E2520] focus:outline-hidden focus:border-[#4E6548] transition-colors"
                />
              </div>
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <label className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-1.5">
                    Experience Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setLevel(lvl)}
                        className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                          level === lvl
                            ? "bg-[#4E6548] text-white border-[#4E6548] shadow-2xs"
                            : "bg-[#F4EDE2] text-[#3E4D41] border-[#DDD3C2] hover:bg-[#EBE2D4]"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-1.5">
                    Daily Practice Goal
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 20, 30].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => setDailyGoal(mins)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          dailyGoal === mins
                            ? "bg-[#4E6548] text-white border-[#4E6548] shadow-2xs"
                            : "bg-[#F4EDE2] text-[#3E4D41] border-[#DDD3C2] hover:bg-[#EBE2D4]"
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] disabled:opacity-50 text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-3"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : mode === "login" ? (
                <>
                  <span>Sign In & Open Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Account & Start</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sign In Section */}
          <div className="pt-4 border-t border-[#E8E0D2] space-y-2">
            <span className="text-[11px] font-semibold text-[#667768] block text-center uppercase tracking-wider">
              Quick One-Click Sign In:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickLoginOmkar}
                disabled={isLoading}
                className="p-2 rounded-xl bg-[#1E2520] hover:bg-[#2F3A31] text-[#8BBA85] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Log in as Omkar Sathe (Developer)"
              >
                <Terminal className="w-3.5 h-3.5 text-[#8BBA85]" />
                <span className="truncate">Omkar (Dev)</span>
              </button>

              <button
                type="button"
                onClick={handleQuickLoginElena}
                disabled={isLoading}
                className="p-2 rounded-xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Log in as Elena Rostova (Member)"
              >
                <User className="w-3.5 h-3.5 text-[#4E6548]" />
                <span className="truncate">Elena (Member)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-[#E2DAD0] bg-[#FAF8F4] text-center text-xs text-[#718274]">
        FlowState Yoga & Recovery Studio • Designed with mindfulness & biomechanical safety
      </footer>
    </div>
  );
};
