import React, { useState } from "react";
import { UserProfile } from "../types";
import { authService } from "../services/authService";
import { 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Flame, 
  Award, 
  Clock, 
  Target, 
  LogOut, 
  LogIn, 
  UserPlus, 
  X, 
  Edit2, 
  Calendar, 
  Layers,
  Key
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onUpdateProfile,
}) => {
  const [mode, setMode] = useState<"login" | "signup" | "profile">(currentUser ? "profile" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [dailyGoal, setDailyGoal] = useState<number>(15);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all required credentials.");
      return;
    }

    if (mode === "signup" && !name) {
      setError("Please enter your display name.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "signup") {
        const result = await authService.register({
          email,
          password,
          name,
          level,
          mindfulMinutesGoal: dailyGoal,
        });
        onLogin(result.user);
      } else {
        const result = await authService.login({ email, password });
        onLogin(result.user);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const updated: UserProfile = {
        ...currentUser,
        name: name || currentUser.name,
        level: level,
        mindfulMinutesGoal: dailyGoal,
      };

      const savedUser = await authService.updateProfile(updated);
      onUpdateProfile(savedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFillDemo = () => {
    setMode("login");
    setEmail("demo@flowstate.com");
    setPassword("FlowState@123");
    setError(null);
  };

  const handleQuickFillAdmin = () => {
    setMode("login");
    setEmail("admin@flowstate.com");
    setPassword("Admin@FlowState123");
    setError(null);
  };

  const handleQuickFillMember = () => {
    setMode("login");
    setEmail("elena.yogi@example.com");
    setPassword("YogiMember2026!");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E2DAD0] w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#E4DCD0] bg-[#F4EDE2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1A221C]">
                {currentUser ? "Your Yogi Profile & Goals" : mode === "login" ? "Welcome Back to FlowState" : "Create Your Member Profile"}
              </h3>
              <p className="text-xs text-[#5D6B60]">
                {currentUser ? "Manage your mindful minutes & skill level" : "Save your ritual streaks and personalized sessions"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {currentUser ? (
            /* Logged in Profile View */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#DDD3C2] flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center font-serif text-xl font-medium">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-lg font-medium text-[#1A221C]">{currentUser.name}</h4>
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#4E6548]/10 text-[#4E6548]">
                      {currentUser.level}
                    </span>
                    {currentUser.role === "developer" && (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#1E2520] text-[#8BBA85]">
                        DEV
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#637266]">{currentUser.email}</p>
                </div>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C2] text-center">
                  <Flame className="w-4 h-4 text-[#C1664C] mx-auto mb-1" />
                  <span className="text-[11px] text-[#637266] block">Active Streak</span>
                  <span className="font-serif font-medium text-base text-[#1E2520]">{currentUser.streakDays} Days</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C2] text-center">
                  <Target className="w-4 h-4 text-[#4E6548] mx-auto mb-1" />
                  <span className="text-[11px] text-[#637266] block">Daily Target</span>
                  <span className="font-serif font-medium text-base text-[#1E2520]">{currentUser.mindfulMinutesGoal}m / day</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C2] text-center">
                  <Award className="w-4 h-4 text-[#C1664C] mx-auto mb-1" />
                  <span className="text-[11px] text-[#637266] block">Experience</span>
                  <span className="font-serif font-medium text-xs capitalize text-[#1E2520] mt-1 block">{currentUser.level}</span>
                </div>
              </div>

              {/* Edit preferences form */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
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
                        className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                          level === lvl
                            ? "bg-[#4E6548] text-white border-[#4E6548]"
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
                    Daily Mindful Goal (Minutes)
                  </label>
                  <div className="flex items-center gap-3">
                    {[10, 15, 20, 30].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => setDailyGoal(mins)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          dailyGoal === mins
                            ? "bg-[#4E6548] text-white border-[#4E6548]"
                            : "bg-[#F4EDE2] text-[#3E4D41] border-[#DDD3C2] hover:bg-[#EBE2D4]"
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="py-3 px-4 rounded-2xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#8F3E2C] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Login / Signup Form */
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-[#F8D7DA] text-[#721C24] text-xs font-medium border border-[#F5C6CB]">
                  {error}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7A8B7D] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Maya Lin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-sm text-[#1E2520] focus:outline-hidden focus:border-[#4E6548]"
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
                    placeholder="yogi@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-sm text-[#1E2520] focus:outline-hidden focus:border-[#4E6548]"
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-sm text-[#1E2520] focus:outline-hidden focus:border-[#4E6548]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer mt-2"
              >
                {isLoading
                  ? "Verifying..."
                  : mode === "login"
                  ? "Sign In to Your Rituals"
                  : "Create Account & Start Practicing"}
              </button>

              {/* Quick Fill Credentials helpers */}
              <div className="pt-3 border-t border-[#EAE0D4] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#5A6D56] uppercase tracking-wider block">
                    Sample Test Accounts (1-Click Fill)
                  </span>
                  <span className="text-[10px] text-[#869688]">Tap button to auto-fill</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleQuickFillDemo}
                    className="py-2 px-2 rounded-xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] text-[11px] font-semibold flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer border border-[#DDD0BC]"
                  >
                    <User className="w-3.5 h-3.5 text-[#4E6548]" />
                    <span>Demo Yogi</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickFillAdmin}
                    className="py-2 px-2 rounded-xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] text-[11px] font-semibold flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer border border-[#DDD0BC]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8A5A3C]" />
                    <span>Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickFillMember}
                    className="py-2 px-2 rounded-xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] text-[11px] font-semibold flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer border border-[#DDD0BC]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C1664C]" />
                    <span>Elena</span>
                  </button>
                </div>

                {/* Sample credentials summary table */}
                <div className="p-2.5 rounded-xl bg-[#F0E9DC] border border-[#DDD2BF] text-[11px] text-[#4A5A4D] space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-semibold text-[#1A221C]">Demo User:</span>
                    <span>demo@flowstate.com / FlowState@123</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-semibold text-[#1A221C]">Elena (Member):</span>
                    <span>elena.yogi@example.com / YogiMember2026!</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode(mode === "login" ? "signup" : "login");
                  }}
                  className="text-xs font-medium text-[#4E6548] hover:underline"
                >
                  {mode === "login"
                    ? "New to FlowState? Create a free account"
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
