import React, { useState, useEffect } from "react";
import { UserProfile, UserFeedbackRecord, SecurityAuditLog } from "../types";
import { 
  Terminal, 
  Users, 
  Database, 
  ShieldCheck, 
  MessageSquare, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Flame, 
  AlertTriangle, 
  Lock, 
  Unlock,
  Search, 
  ChevronRight, 
  Key,
  Shield,
  Eye,
  EyeOff,
  UserCheck
} from "lucide-react";

interface DeveloperPortalProps {
  currentUser: UserProfile | null;
}

export const DeveloperPortal: React.FC<DeveloperPortalProps> = ({ currentUser }) => {
  const isOmkarAccount = Boolean(
    currentUser?.email && currentUser.email.toLowerCase().trim() === "omkarsathe3103@gmail.com"
  );

  // Authorization Gate State
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    try {
      if (currentUser?.email?.toLowerCase().trim() === "omkarsathe3103@gmail.com") {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [activeSubTab, setActiveSubTab] = useState<"overview" | "users" | "sessions" | "feedback" | "audit">("overview");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());

  // Backend state fetched from server
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [allFeedback, setAllFeedback] = useState<UserFeedbackRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);

  // Filter & Privacy states
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [userScopeFilter, setUserScopeFilter] = useState<"staff" | "active" | "all">("staff");
  const [maskSensitivePII, setMaskSensitivePII] = useState<boolean>(true);
  const [feedbackFilter, setFeedbackFilter] = useState<string>("all");

  const handleUnlockDeveloperMode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isOmkarAccount) {
      setAuthError("Access restricted. Only omkarsathe3103@gmail.com can access the Developer Portal.");
      return;
    }

    const cleanPass = passcode.trim().toLowerCase();
    if (
      cleanPass === "flowstate2026" || 
      cleanPass === "dev123" || 
      cleanPass === "developer" ||
      isOmkarAccount
    ) {
      setIsAuthorized(true);
      setAuthError("");
      try {
        sessionStorage.setItem("flowstate_dev_authorized", "true");
      } catch {}
    } else {
      setAuthError("Invalid developer passkey. (Hint: flowstate2026)");
    }
  };

  const handleLockDeveloperMode = () => {
    setIsAuthorized(false);
    try {
      sessionStorage.removeItem("flowstate_dev_authorized");
    } catch {}
  };

  const fetchData = async () => {
    if (!isOmkarAccount) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("flowstate_auth_token") || "";
      const headers = { 
        "x-dev-key": "flowstate2026",
        "x-dev-email": "omkarsathe3103@gmail.com",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const [ovRes, usersRes, sessRes, fbRes, logsRes] = await Promise.all([
        fetch("/api/dev/overview", { headers }).then((r) => r.json()).catch(() => null),
        fetch("/api/dev/users", { headers }).then((r) => r.json()).catch(() => ({ users: [] })),
        fetch("/api/dev/sessions", { headers }).then((r) => r.json()).catch(() => ({ sessions: [] })),
        fetch("/api/dev/feedback", { headers }).then((r) => r.json()).catch(() => ({ feedback: [] })),
        fetch("/api/dev/audit-logs", { headers }).then((r) => r.json()).catch(() => ({ auditLogs: [] })),
      ]);

      if (ovRes) setOverviewStats(ovRes);
      if (usersRes?.users) setAllUsers(usersRes.users);
      if (sessRes?.sessions) setAllSessions(sessRes.sessions);
      if (fbRes?.feedback) setAllFeedback(fbRes.feedback);
      if (logsRes?.auditLogs) setAuditLogs(logsRes.auditLogs);

      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Developer Portal Fetch Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [isAuthorized]);

  const handleUpdateFeedbackStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setAllFeedback((prev) =>
        prev.map((fb) => (fb.id === id ? { ...fb, status: newStatus as any } : fb))
      );
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  // Helper to mask emails for privacy
  const formatMaskedEmail = (email: string) => {
    if (!maskSensitivePII) return email;
    if (!email || !email.includes("@")) return "***";
    const [user, domain] = email.split("@");
    if (user.length <= 2) return `${user.charAt(0)}***@${domain}`;
    return `${user.charAt(0)}***${user.charAt(user.length - 1)}@${domain}`;
  };

  // Filter users based on scope (Staff / Active / All)
  const filteredUsers = allUsers.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.id?.toLowerCase().includes(searchUserQuery.toLowerCase());

    if (!matchSearch) return false;

    if (userScopeFilter === "staff") {
      return u.role === "developer" || u.role === "admin" || u.email?.includes("flowstate") || u.email === "omkarsathe3103@gmail.com";
    }
    if (userScopeFilter === "active") {
      return (u.totalMinutesCompleted || 0) > 0 || (u.streakDays || 0) > 0;
    }
    return true;
  });

  const filteredFeedback = allFeedback.filter((fb) => {
    if (feedbackFilter === "all") return true;
    return fb.status === feedbackFilter || fb.type === feedbackFilter;
  });

  // If NOT authorized or not Omkar's account, render Developer Access Lock Screen
  if (!isAuthorized || !isOmkarAccount) {
    return (
      <div id="developer-auth-gate" className="max-w-xl mx-auto my-12 p-8 bg-[#FAF7F2] rounded-3xl border border-[#E2DAD0] shadow-xs text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#1E2520] text-[#8BBA85] mx-auto flex items-center justify-center shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E2520] text-xs font-semibold text-[#8BBA85] mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Developer Account Only: omkarsathe3103@gmail.com</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C]">
            Developer & Engineering Portal
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6B60] mt-2 leading-relaxed">
            Access to database telemetry, security audit logs, and developer consoles is strictly restricted to lead developer <span className="font-semibold text-[#1A221C]">omkarsathe3103@gmail.com</span>.
          </p>
        </div>

        {isOmkarAccount ? (
          <form onSubmit={handleUnlockDeveloperMode} className="space-y-4 max-w-sm mx-auto">
            <div>
              <div className="relative">
                <Key className="w-4 h-4 text-[#7A8B7D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="dev-passkey-input"
                  type="password"
                  placeholder="Enter developer key (flowstate2026)..."
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F4EDE2] border border-[#DDD3C2] text-xs sm:text-sm text-[#1A221C] placeholder-[#9CA99F] focus:outline-hidden focus:border-[#4E6548] transition-colors font-mono"
                />
              </div>
              {authError && (
                <p className="text-xs text-[#C1664C] mt-2 font-medium flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                id="btn-unlock-developer-mode"
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#1E2520] hover:bg-[#2C382F] text-[#8BBA85] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Developer Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPasscode("flowstate2026");
                  setIsAuthorized(true);
                }}
                className="text-xs text-[#4E6548] hover:underline font-medium pt-1 cursor-pointer"
              >
                1-Click Developer Unlock (omkarsathe3103@gmail.com)
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-[#FCE8E6] border border-[#F3B3AA] text-[#B3261E] text-xs leading-relaxed max-w-md mx-auto">
            <span className="font-semibold">Access Denied:</span> You are signed in as{" "}
            <span className="font-mono font-bold">{currentUser?.email || "Guest"}</span>. Only{" "}
            <span className="font-mono font-bold">omkarsathe3103@gmail.com</span> is authorized to view developer tools.
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="developer-portal" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1E2520] text-white flex items-center justify-center shadow-xs">
            <Terminal className="w-7 h-7 text-[#8BBA85]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A221C]">
                Developer & Backend Data Portal
              </h2>
              <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#1E2520] text-[#8BBA85] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Authorized Access
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5C6D5F] mt-1">
              Backend database telemetry, registered member records, practice session logs, and security audit trail.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-xs text-[#718274]">Updated: {lastRefreshed}</span>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="py-2.5 px-4 rounded-2xl bg-[#EBE2D4] hover:bg-[#DDD2BF] text-[#2C382F] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#4E6548]" : ""}`} />
            <span>Refresh DB</span>
          </button>
          <button
            onClick={handleLockDeveloperMode}
            className="py-2.5 px-4 rounded-2xl bg-[#1E2520] hover:bg-[#2C382F] text-[#8BBA85] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lock Developer Portal"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-[#ECE4D6] p-1.5 rounded-2xl border border-[#DDD3C2] overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Overview & Analytics", icon: Activity, count: null },
          { id: "users", label: "Registered Users", icon: Users, count: filteredUsers.length },
          { id: "sessions", label: "Practice Sessions DB", icon: Database, count: allSessions.length },
          { id: "feedback", label: "Issue & Feedback Queue", icon: MessageSquare, count: allFeedback.length },
          { id: "audit", label: "Security & Audit Trail", icon: ShieldCheck, count: auditLogs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#FAF8F4] text-[#1A221C] shadow-xs"
                  : "text-[#546457] hover:text-[#1A221C] hover:bg-[#E2D8C8]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-[#4E6548]" : "text-[#718274]"}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? "bg-[#4E6548] text-white" : "bg-[#DDD2BF] text-[#3A493D]"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: Overview & Metrics */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#708073] font-medium">Total Users in DB</span>
                <Users className="w-4 h-4 text-[#4E6548]" />
              </div>
              <div className="text-2xl font-serif font-medium text-[#1E2520]">
                {overviewStats?.totalUsers || allUsers.length}
              </div>
              <span className="text-[11px] text-[#637366] block mt-1">Bcrypt password hashed</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#708073] font-medium">Logged Sessions</span>
                <Database className="w-4 h-4 text-[#4E6548]" />
              </div>
              <div className="text-2xl font-serif font-medium text-[#1E2520]">
                {overviewStats?.totalSessions || allSessions.length}
              </div>
              <span className="text-[11px] text-[#637366] block mt-1">Stored backend records</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#708073] font-medium">Mindful Minutes</span>
                <Clock className="w-4 h-4 text-[#C1664C]" />
              </div>
              <div className="text-2xl font-serif font-medium text-[#1E2520]">
                {overviewStats?.totalMinutes || allSessions.reduce((acc, c) => acc + c.durationMinutes, 0)}m
              </div>
              <span className="text-[11px] text-[#637366] block mt-1">Practiced community-wide</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E0D7C9] shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#708073] font-medium">Open Feedback Tickets</span>
                <MessageSquare className="w-4 h-4 text-[#4E6548]" />
              </div>
              <div className="text-2xl font-serif font-medium text-[#1E2520]">
                {allFeedback.filter((f) => f.status === "open").length}
              </div>
              <span className="text-[11px] text-[#637366] block mt-1">Awaiting triage</span>
            </div>
          </div>

          {/* Quick Summary Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Sessions */}
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E2DAD0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-medium text-lg text-[#1A221C]">Latest Completed Practices</h3>
                <button
                  onClick={() => setActiveSubTab("sessions")}
                  className="text-xs text-[#4E6548] hover:underline font-semibold cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5">
                {allSessions.slice(0, 4).map((s) => (
                  <div key={s.id} className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#DDD3C2] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-medium text-sm text-[#1A221C]">{s.sequenceTitle}</span>
                        <span className="text-[10px] bg-[#EBE2D4] px-2 py-0.5 rounded-md font-semibold text-[#3C4A3E]">
                          {s.durationMinutes} mins
                        </span>
                      </div>
                      <span className="text-xs text-[#637366]">User: {s.userName} • Rating: {s.rating}★</span>
                    </div>
                    <span className="text-[11px] text-[#7A8B7D]">
                      {new Date(s.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Audit Logs */}
            <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E2DAD0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-medium text-lg text-[#1A221C]">Security & System Events</h3>
                <button
                  onClick={() => setActiveSubTab("audit")}
                  className="text-xs text-[#4E6548] hover:underline font-semibold cursor-pointer"
                >
                  Full Trail
                </button>
              </div>

              <div className="space-y-2.5">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#DDD3C2] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          log.status === "SUCCESS"
                            ? "bg-[#4E6548]/10 text-[#4E6548]"
                            : log.status === "WARN"
                            ? "bg-[#C1664C]/10 text-[#C1664C]"
                            : "bg-[#721C24]/10 text-[#721C24]"
                        }`}>
                          {log.eventType}
                        </span>
                        <span className="text-xs text-[#1E2520] font-medium truncate max-w-xs">
                          {log.details}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#718274] mt-0.5 block">IP: {log.ipRedacted}</span>
                    </div>
                    <span className="text-[10px] text-[#7A8B7D]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Users Storage */}
      {activeSubTab === "users" && (
        <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1A221C]">
                Registered Member Records ({filteredUsers.length} of {allUsers.length})
              </h3>
              <p className="text-xs text-[#637366] mt-0.5">
                Stored securely with salted Bcrypt (12 rounds) hashing. Only authorized developer scopes can inspect records.
              </p>
            </div>

            {/* Scope Filter Buttons & Privacy Toggle */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="flex items-center gap-1 bg-[#ECE4D6] p-1 rounded-2xl border border-[#DDD3C2] text-xs">
                {[
                  { id: "staff", label: "Core Staff / Devs" },
                  { id: "active", label: "Active Members" },
                  { id: "all", label: "All Users" },
                ].map((scope) => (
                  <button
                    key={scope.id}
                    onClick={() => setUserScopeFilter(scope.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      userScopeFilter === scope.id
                        ? "bg-[#FAF8F4] text-[#1A221C] shadow-2xs"
                        : "text-[#5D6C60] hover:text-[#1A221C]"
                    }`}
                  >
                    {scope.label}
                  </button>
                ))}
              </div>

              {/* Privacy Mask Toggle */}
              <button
                onClick={() => setMaskSensitivePII(!maskSensitivePII)}
                className={`px-3 py-1.5 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  maskSensitivePII ? "bg-[#4E6548] text-white border-[#4E6548]" : "bg-[#ECE4D6] text-[#3B4A3E] border-[#DDD3C2]"
                }`}
                title="Toggle PII masking on emails and identifiers"
              >
                {maskSensitivePII ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{maskSensitivePII ? "PII Masked" : "Unmasked"}</span>
              </button>

              {/* Search input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-[#7A8B7D] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search user or email..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-xs text-[#1E2520] focus:outline-hidden focus:border-[#4E6548]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DDD3C2] text-[#4E6548] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">User & Email</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Experience</th>
                  <th className="py-3 px-3">Streak</th>
                  <th className="py-3 px-3">Daily Target</th>
                  <th className="py-3 px-3">Total Minutes</th>
                  <th className="py-3 px-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE0D4]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F5EFE5] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#1E2520] flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {(u.role === "developer" || u.role === "admin") && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-[#1E2520] text-[#8BBA85] rounded font-bold">STAFF</span>
                        )}
                      </div>
                      <div className="text-[#657567] text-[11px] font-mono">{formatMaskedEmail(u.email)}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase ${
                        u.role === "developer" || u.role === "admin"
                          ? "bg-[#1E2520] text-[#8BBA85]"
                          : "bg-[#4E6548]/10 text-[#4E6548]"
                      }`}>
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-3 px-3 capitalize text-[#3A4A3E] font-medium">{u.level}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#C1664C] flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current" /> {u.streakDays}d
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#3A4A3E] font-medium">{u.mindfulMinutesGoal} mins/day</td>
                    <td className="py-3 px-3 text-[#3A4A3E] font-medium">{u.totalMinutesCompleted || 0} mins</td>
                    <td className="py-3 px-3 text-[#708072]">
                      {new Date(u.joinedDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Sessions Storage */}
      {activeSubTab === "sessions" && (
        <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1A221C]">
              Stored Practice Sessions ({allSessions.length})
            </h3>
            <p className="text-xs text-[#637366]">
              All completed yoga flows, somatic recovery logs, and user satisfaction ratings.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DDD3C2] text-[#4E6548] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Flow Title</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Mood Transition</th>
                  <th className="py-3 px-3">Physical Sensation</th>
                  <th className="py-3 px-3">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE0D4]">
                {allSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F5EFE5] transition-colors">
                    <td className="py-3 px-3 text-[#708072] whitespace-nowrap">
                      {new Date(s.date).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#1E2520]">{s.userName}</td>
                    <td className="py-3 px-3 font-medium text-[#1E2520]">{s.sequenceTitle}</td>
                    <td className="py-3 px-3 text-[#3A4A3E] font-semibold">{s.durationMinutes} mins</td>
                    <td className="py-3 px-3">
                      <div className="text-[11px] text-[#637366]">
                        {s.moodBefore} → <strong className="text-[#4E6548]">{s.moodAfter}</strong>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#506052] max-w-xs truncate">{s.physicalFeelingAfter}</td>
                    <td className="py-3 px-3 text-[#8B5A3C] font-semibold">{s.rating} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: User Issue & Feedback System */}
      {activeSubTab === "feedback" && (
        <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1A221C]">
                Issue & Feature Feedback Queue ({filteredFeedback.length})
              </h3>
              <p className="text-xs text-[#637366]">
                Incoming bug reports, UI enhancement requests, and alignment suggestions from practitioners.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-[#ECE4D6] p-1 rounded-xl border border-[#DDD3C2]">
              {["all", "open", "in-progress", "resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFeedbackFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    feedbackFilter === st ? "bg-[#FAF8F4] text-[#1A221C] shadow-2xs" : "text-[#637366]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeedback.map((fb) => (
              <div
                key={fb.id}
                className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#DDD3C2] shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        fb.type === "Bug"
                          ? "bg-[#721C24]/10 text-[#721C24]"
                          : fb.type === "UI Issue"
                          ? "bg-[#8B5A3C]/10 text-[#8B5A3C]"
                          : "bg-[#4E6548]/10 text-[#4E6548]"
                      }`}>
                        {fb.type}
                      </span>
                      <span className="text-[10px] text-[#718274]">• {new Date(fb.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Status badge & selector */}
                    <select
                      value={fb.status}
                      onChange={(e) => handleUpdateFeedbackStatus(fb.id, e.target.value)}
                      className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-[#ECE4D6] border border-[#DDD3C2] text-[#2F3E32] focus:outline-hidden cursor-pointer"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <h4 className="font-serif font-medium text-base text-[#1E2520]">{fb.title}</h4>
                  <p className="text-xs text-[#526355] mt-1 leading-relaxed">{fb.description}</p>
                </div>

                <div className="pt-2 border-t border-[#EAE0D4] flex items-center justify-between text-[11px] text-[#718274]">
                  <span>From: <strong>{fb.userName}</strong> ({formatMaskedEmail(fb.userEmail || "")})</span>
                  <span className="capitalize font-semibold text-[#4E6548]">{fb.priority} Priority</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Security & Audit Trail */}
      {activeSubTab === "audit" && (
        <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#E2DAD0] shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1A221C]">
              Security Audit Trail & Redacted Logs
            </h3>
            <p className="text-xs text-[#637366]">
              All IP addresses are automatically sanitized (`192.168.***.***`) and sensitive credentials (passwords, tokens, API keys) are redacted.
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#DDD3C2] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                    log.status === "SUCCESS"
                      ? "bg-[#4E6548]/10 text-[#4E6548]"
                      : log.status === "WARN"
                      ? "bg-[#C1664C]/10 text-[#C1664C]"
                      : "bg-[#721C24]/10 text-[#721C24]"
                  }`}>
                    {log.eventType}
                  </span>
                  <span className="text-[#1E2520] font-mono text-[11px]">{log.details}</span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-[#718274] font-mono">
                  <span>IP: {log.ipRedacted}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
