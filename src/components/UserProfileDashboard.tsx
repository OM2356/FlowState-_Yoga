import React, { useState } from "react";
import { UserProfile, PracticeSessionRecord, FlowSequence } from "../types";
import { PRESET_FLOWS } from "../data/presetFlows";
import { 
  User, 
  Flame, 
  Target, 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Heart, 
  TrendingUp, 
  Play, 
  Smile, 
  ShieldCheck,
  Compass,
  Edit2,
  Sparkles,
  LogOut
} from "lucide-react";

interface UserProfileDashboardProps {
  user: UserProfile | null;
  sessionHistory: PracticeSessionRecord[];
  onOpenAuth: () => void;
  onStartFlow: (flow: FlowSequence) => void;
}

export const UserProfileDashboard: React.FC<UserProfileDashboardProps> = ({
  user,
  sessionHistory,
  onOpenAuth,
  onStartFlow,
}) => {
  const totalMinutes = sessionHistory.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const streak = user?.streakDays || (sessionHistory.length > 0 ? 3 : 0);
  const dailyGoal = user?.mindfulMinutesGoal || 15;

  // Calculate goal progress for today
  const todayStr = new Date().toDateString();
  const todayMinutes = sessionHistory
    .filter((s) => new Date(s.date).toDateString() === todayStr)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const goalPercentage = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100));

  const moodBreakdown = sessionHistory.reduce((acc: Record<string, number>, curr) => {
    acc[curr.moodAfter] = (acc[curr.moodAfter] || 0) + 1;
    return acc;
  }, {});

  const favoriteFlow = sessionHistory.length > 0
    ? sessionHistory[0].sequenceTitle
    : "15-Minute Desk Reset";

  return (
    <div id="user-profile-dashboard" className="space-y-6">
      {/* Top Banner with Member ID & Quick Actions */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center font-serif text-2xl font-medium shadow-xs">
            {user ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C]">
                {user ? user.name : "Guest Yogi"}
              </h2>
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#4E6548]/10 text-[#4E6548]">
                {user ? `${user.level} Level` : "Free Tier"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5D6D60] mt-0.5">
              {user ? user.email : "Sign in to persist your sessions, streaks, and personal flow routines."}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuth}
          className="py-2.5 px-4.5 rounded-2xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          {user ? (
            <>
              <Edit2 className="w-4 h-4 text-[#4E6548]" />
              <span>Edit Goals & Level</span>
            </>
          ) : (
            <>
              <User className="w-4 h-4 text-[#4E6548]" />
              <span>Sign In / Register</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#708073] font-medium">Daily Goal Progress</span>
            <Target className="w-4 h-4 text-[#4E6548]" />
          </div>
          <div className="text-2xl font-serif font-medium text-[#1E2520]">
            {todayMinutes} / {dailyGoal}m
          </div>
          <div className="w-full h-1.5 bg-[#E4DCD0] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#4E6548] rounded-full transition-all duration-500"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#708073] font-medium">Ritual Streak</span>
            <Flame className="w-4 h-4 text-[#C1664C]" />
          </div>
          <div className="text-2xl font-serif font-medium text-[#1E2520]">
            {streak} Days
          </div>
          <span className="text-[11px] text-[#637366] block mt-1">
            Consistent practice
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#708073] font-medium">Total Mindful Time</span>
            <Clock className="w-4 h-4 text-[#4E6548]" />
          </div>
          <div className="text-2xl font-serif font-medium text-[#1E2520]">
            {totalMinutes} mins
          </div>
          <span className="text-[11px] text-[#637366] block mt-1">
            {sessionHistory.length} total sessions
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#708073] font-medium">Primary Focus Area</span>
            <Award className="w-4 h-4 text-[#C1664C]" />
          </div>
          <div className="text-lg font-serif font-medium text-[#1E2520] truncate">
            Spine & Hips
          </div>
          <span className="text-[11px] text-[#637366] block mt-1">
            Recovery & Mobility
          </span>
        </div>
      </div>

      {/* Recommended Next Practice & Habit Continuity */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8B5A3C] block mb-1">
            Recommended For Today's Practice
          </span>
          <h3 className="text-xl font-serif font-medium text-[#1A221C]">
            {PRESET_FLOWS[0].title}
          </h3>
          <p className="text-xs sm:text-sm text-[#546457] mt-1">
            {PRESET_FLOWS[0].subtitle}
          </p>
        </div>

        <button
          onClick={() => onStartFlow(PRESET_FLOWS[0])}
          className="py-3 px-6 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Begin Flow</span>
        </button>
      </div>

      {/* Session Records Log */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-medium text-[#1A221C] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4E6548]" />
            <span>Practice Session History</span>
          </h3>
          <span className="text-xs text-[#708073]">
            {sessionHistory.length} recorded session{sessionHistory.length === 1 ? "" : "s"}
          </span>
        </div>

        {sessionHistory.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F4] rounded-2xl border border-[#DDD3C2] text-xs sm:text-sm text-[#617264]">
            You have not completed any practice sessions yet today. Launch any sequence or breathing timer to begin logging your journey!
          </div>
        ) : (
          <div className="space-y-3">
            {sessionHistory.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#DDD3C2] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="text-[11px] text-[#7A8B7D] font-medium block">
                    {new Date(rec.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <h4 className="font-serif font-medium text-base text-[#1E2520] mt-0.5">
                    {rec.sequenceTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#526355] mt-1">
                    <span>Feeling: <strong>{rec.physicalFeelingAfter}</strong></span>
                    <span>•</span>
                    <span>State: <strong className="text-[#4E6548]">{rec.moodAfter}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-[#EBE2D4] px-3 py-1.5 rounded-xl text-[#2B382E]">
                    {rec.durationMinutes} mins
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
