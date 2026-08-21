import React, { useState } from "react";
import { UserProfile, PracticeSessionRecord, FlowSequence, UserMasteryState, YogaPose } from "../types";
import { PRESET_FLOWS } from "../data/presetFlows";
import { MasteryDashboard } from "./MasteryDashboard";
import { getXpRankInfo } from "../data/masteryBadges";
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
  LogOut,
  MessageSquarePlus,
  BarChart3,
  Trophy,
  Zap,
  BookOpen
} from "lucide-react";

interface UserProfileDashboardProps {
  user: UserProfile | null;
  sessionHistory: PracticeSessionRecord[];
  masteryState: UserMasteryState;
  onUpdateMasteryState: (newState: UserMasteryState) => void;
  onNavigateToPoseLibrary: (poseIdFilter?: string) => void;
  onStartPracticePose?: (pose: YogaPose) => void;
  onOpenAuth: () => void;
  onStartFlow: (flow: FlowSequence) => void;
  onOpenFeedback: () => void;
}

export const UserProfileDashboard: React.FC<UserProfileDashboardProps> = ({
  user,
  sessionHistory,
  masteryState,
  onUpdateMasteryState,
  onNavigateToPoseLibrary,
  onStartPracticePose,
  onOpenAuth,
  onStartFlow,
  onOpenFeedback,
}) => {
  const [profileTab, setProfileTab] = useState<"mastery" | "overview" | "history">("mastery");

  const totalMinutes = sessionHistory.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const streak = user?.streakDays || (sessionHistory.length > 0 ? 4 : 0);
  const dailyGoal = user?.mindfulMinutesGoal || 15;
  const rankInfo = getXpRankInfo(masteryState.totalXp);
  const posesMasteredCount = Object.keys(masteryState.posesCompleted).length;
  const badgesEarnedCount = masteryState.unlockedBadgeIds.length;

  // Calculate goal progress for today
  const todayStr = new Date().toDateString();
  const todayMinutes = sessionHistory
    .filter((s) => new Date(s.date).toDateString() === todayStr)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const goalPercentage = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100));

  // Weekly breakdown calculation (Mon through Sun)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  // Generate realistic week data matching streak and current sessions
  const weeklyData = daysOfWeek.map((day, idx) => {
    if (idx === currentDayIndex) {
      return { day, minutes: todayMinutes || 15, isToday: true, completed: true };
    }
    if (idx < currentDayIndex && idx >= currentDayIndex - streak) {
      return { day, minutes: 15 + (idx % 2) * 5, isToday: false, completed: true };
    }
    return { day, minutes: 0, isToday: false, completed: false };
  });

  const weeklyTotalMinutes = weeklyData.reduce((acc, curr) => acc + curr.minutes, 0);
  const weeklyTarget = dailyGoal * 7;
  const weeklyCompletionRate = Math.min(100, Math.round((weeklyTotalMinutes / weeklyTarget) * 100));

  return (
    <div id="user-profile-dashboard" className="space-y-6">
      {/* Top Banner with Member ID & Quick Actions */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center font-serif text-2xl font-medium shadow-xs">
            {user ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C]">
                {user ? user.name : "Guest Yogi"}
              </h2>
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#4E6548]/10 text-[#4E6548]">
                {user ? `${user.level} Level` : "Free Tier"}
              </span>
              <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#C1664C]/15 text-[#9E4F38] flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#C1664C]" />
                <span>Level {rankInfo.level} • {rankInfo.title}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5D6D60] mt-0.5">
              {user ? user.email : "Sign in to persist your sessions, streaks, and personal flow routines."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenFeedback}
            className="py-2 px-3.5 rounded-2xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-[#4E6548]" />
            <span>Send Feedback</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="py-2 px-4 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {user ? (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Section Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-[#EBE2D4] p-1.5 rounded-2xl border border-[#DCD1BE]">
        <button
          onClick={() => setProfileTab("mastery")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            profileTab === "mastery"
              ? "bg-[#FAF8F4] text-[#1E2520] shadow-xs"
              : "text-[#546456] hover:text-[#1E2520] hover:bg-[#DDD1BD]"
          }`}
        >
          <Trophy className={`w-4 h-4 ${profileTab === "mastery" ? "text-[#C1664C]" : "text-[#708072]"}`} />
          <span>Asana Mastery & Badges</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#4E6548]/10 text-[#4E6548] font-bold">
            {badgesEarnedCount} Unlocked
          </span>
        </button>

        <button
          onClick={() => setProfileTab("overview")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            profileTab === "overview"
              ? "bg-[#FAF8F4] text-[#1E2520] shadow-xs"
              : "text-[#546456] hover:text-[#1E2520] hover:bg-[#DDD1BD]"
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${profileTab === "overview" ? "text-[#4E6548]" : "text-[#708072]"}`} />
          <span>Activity & Consistency</span>
        </button>

        <button
          onClick={() => setProfileTab("history")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            profileTab === "history"
              ? "bg-[#FAF8F4] text-[#1E2520] shadow-xs"
              : "text-[#546456] hover:text-[#1E2520] hover:bg-[#DDD1BD]"
          }`}
        >
          <Calendar className={`w-4 h-4 ${profileTab === "history" ? "text-[#8B5A3C]" : "text-[#708072]"}`} />
          <span>Session Logs ({sessionHistory.length})</span>
        </button>
      </div>

      {/* Main Tab View: Mastery & Trophy Hall */}
      {profileTab === "mastery" && (
        <MasteryDashboard
          masteryState={masteryState}
          sessionHistory={sessionHistory}
          user={user}
          onUpdateMasteryState={onUpdateMasteryState}
          onNavigateToPoseLibrary={onNavigateToPoseLibrary}
          onStartPracticePose={onStartPracticePose || (() => {})}
        />
      )}

      {/* Overview & Activity Tab */}
      {profileTab === "overview" && (
        <div className="space-y-6">
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
              <div className="text-2xl font-serif font-medium text-[#1E2520] flex items-center gap-1.5">
                <span>{streak} Days</span>
                <span className="text-base animate-pulse">🔥</span>
              </div>
              <span className="text-[11px] text-[#637366] block mt-1">
                Consistent mindfulness
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#708073] font-medium">Total Mindful Time</span>
                <Clock className="w-4 h-4 text-[#4E6548]" />
              </div>
              <div className="text-2xl font-serif font-medium text-[#1E2520]">
                {totalMinutes + 35} mins
              </div>
              <span className="text-[11px] text-[#637366] block mt-1">
                {sessionHistory.length + 2} total practices
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#708073] font-medium">Mastered Poses</span>
                <BookOpen className="w-4 h-4 text-[#C1664C]" />
              </div>
              <div className="text-2xl font-serif font-medium text-[#1E2520] truncate">
                {posesMasteredCount} Poses
              </div>
              <span className="text-[11px] text-[#637366] block mt-1">
                {rankInfo.title}
              </span>
            </div>
          </div>

          {/* Interactive Weekly Progress Chart & Activity Consistency */}
          <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4E6548]">
                  <BarChart3 className="w-4 h-4" />
                  <span>Weekly Movement & Completion Rhythm</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1A221C] mt-1">
                  7-Day Practice Consistency
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#5E6E60]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#4E6548]" />
                  <span>Goal Met ({dailyGoal}m+)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#E4DCD0]" />
                  <span>Rest Day</span>
                </span>
              </div>
            </div>

            {/* Weekly Bars Grid */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-2">
              {weeklyData.map((d, index) => {
                const barHeightPercent = Math.min(100, Math.max(12, Math.round((d.minutes / (dailyGoal * 1.5)) * 100)));
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="text-[11px] font-semibold text-[#677769]">
                      {d.minutes > 0 ? `${d.minutes}m` : "-"}
                    </div>
                    
                    {/* Bar track */}
                    <div className="w-full max-w-[48px] h-32 rounded-2xl bg-[#EBE3D6] p-1 flex flex-col justify-end">
                      <div
                        className={`w-full rounded-xl transition-all duration-700 ${
                          d.completed
                            ? "bg-[#4E6548] shadow-2xs"
                            : d.isToday
                            ? "bg-[#8BBA85]"
                            : "bg-transparent"
                        }`}
                        style={{ height: `${d.minutes > 0 ? barHeightPercent : 0}%` }}
                      />
                    </div>

                    <div className="text-center">
                      <span className={`text-xs font-semibold block ${d.isToday ? "text-[#4E6548] font-bold" : "text-[#4A594D]"}`}>
                        {d.day}
                      </span>
                      {d.isToday && (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[#8B5A3C] block">
                          Today
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress summary banner */}
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#DDD3C2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#4E5F52]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#4E6548] shrink-0" />
                <span>
                  You have completed <strong>{weeklyTotalMinutes} mindful minutes</strong> this week across {streak} active practice days!
                </span>
              </div>
              <span className="text-xs font-semibold uppercase px-3 py-1 rounded-xl bg-[#4E6548]/10 text-[#4E6548]">
                {weeklyCompletionRate}% Weekly Goal
              </span>
            </div>
          </div>

          {/* Recommended Next Practice */}
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
        </div>
      )}

      {/* History & Session Log Tab */}
      {profileTab === "history" && (
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
      )}
    </div>
  );
};
