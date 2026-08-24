import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Eye, 
  HelpCircle, 
  RefreshCw, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Wind,
  Layers,
  MessageSquareText
} from "lucide-react";
import { YogaPose, FlowSequence } from "../types";
import { YOGA_POSES } from "../data/posesData";
import YogaChatbot from "./YogaChatbot";

interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
  suggestedPoseId?: string;
  poseTitle?: string;
}

interface AICoachChatProps {
  onInspectPose?: (pose: YogaPose) => void;
  onPracticePose?: (pose: YogaPose) => void;
  onStartFlow?: (flow: FlowSequence) => void;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({
  onInspectPose,
  onPracticePose,
  onStartFlow,
}) => {
  const [activeMode, setActiveMode] = useState<"routine" | "chat">("routine");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "coach",
      text: `Namaste and welcome! I am your FlowState Personal Yoga & Mindfulness Coach.

I am here to help you move with comfort, safety, and confidence. You can ask me anything in simple words:
• How to fix lower back, neck, or hip stiffness
• Step-by-step guidance for any yoga posture
• Easy modifications for beginners or stiff bodies
• How to breathe properly during exercise

How can I support your practice today?`,
      timestamp: "Just now",
      suggestedPoseId: "child-pose",
      poseTitle: "Child's Pose (Balasana)",
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Text-to-Speech audio read-aloud
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isSpeaking && speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown bullets for speech
    const cleanText = text.replace(/[*#•]/g, "").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.92; // calm, peaceful pace
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(
      (v) =>
        v.lang === "en-IN" ||
        v.lang === "en_IN" ||
        v.name.toLowerCase().includes("india") ||
        v.name.includes("Veena") ||
        v.name.includes("Rishi") ||
        v.name.includes("Aditi")
    );
    const preferred = indianVoice || voices.find((v) => v.lang.startsWith("en")) || voices[0];
    if (preferred) {
      utterance.voice = preferred;
      if (preferred.lang) utterance.lang = preferred.lang;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    setIsSpeaking(true);
    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = (customPrompt || inputMessage).trim();
    if (!promptToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Send chat history for context
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await fetch("/api/chat-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          history: historyPayload,
          contextPose: "all",
        }),
      });

      if (!response.ok) throw new Error("Coach response error");
      const data = await response.json();

      const coachMsg: ChatMessage = {
        id: "coach-" + Date.now(),
        sender: "coach",
        text: data.reply || "Listen to your breath and honor what your body feels today.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedPoseId: data.suggestedPoseId,
        poseTitle: data.poseTitle,
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const fallbackCoachMsg: ChatMessage = {
        id: "coach-" + Date.now(),
        sender: "coach",
        text: `Here is simple advice to keep your body safe:
• **Move with comfort**: Never push through sharp or pinching pain.
• **Bend your knees**: In forward folds and standing poses, soft knees keep your lower back safe.
• **Even breathing**: Breathe in and out through your nose in steady 4-second counts.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedPoseId: "child-pose",
        poseTitle: "Child's Pose",
      };
      setMessages((prev) => [...prev, fallbackCoachMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickTopics = [
    { label: "Ease Lower Back Pain", prompt: "What are the best gentle yoga poses to relieve lower back pain and stiffness?" },
    { label: "Fix Neck & Shoulder Tension", prompt: "How can I release tight neck and upper back muscles from sitting at a computer all day?" },
    { label: "Open Tight Hips & Glutes", prompt: "Explain step-by-step how to stretch and open tight hips safely without hurting my knees." },
    { label: "Beginner Guide & Safety", prompt: "What are the most important rules a complete beginner should know before starting yoga?" },
    { label: "How to Breathe Correctly", prompt: "Explain in simple terms when I should inhale and when I should exhale during yoga poses." },
    { label: "Morning Energy Booster", prompt: "Give me a quick 10-minute morning sequence to wake up my body and energize my mind." },
  ];

  return (
    <div id="ai-coach-chat-container" className="space-y-6">
      {/* Top Mode Segmented Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-[#FAF7F2] p-4 sm:p-5 rounded-3xl border border-[#E2DAD0] shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-[#1A221C]">
              FlowState AI Yoga Studio Assistant
            </h2>
            <p className="text-xs text-[#5D6B60]">
              Personalized routines, spinal decompression, posture alignment, and mindful guidance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#EFE8DC] p-1.5 rounded-2xl border border-[#DFD6C7]">
          <button
            onClick={() => setActiveMode("routine")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "routine"
                ? "bg-[#4E6548] text-white shadow-xs"
                : "text-[#425044] hover:text-[#1A221C]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Routine Generator</span>
          </button>
          <button
            onClick={() => setActiveMode("chat")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "chat"
                ? "bg-[#4E6548] text-white shadow-xs"
                : "text-[#425044] hover:text-[#1A221C]"
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Interactive Q&A Coach</span>
          </button>
        </div>
      </div>

      {/* Routine Generator View */}
      {activeMode === "routine" && (
        <YogaChatbot 
          onStartFlow={onStartFlow} 
          onInspectPose={onInspectPose} 
        />
      )}

      {/* Interactive Chat Mode */}
      {activeMode === "chat" && (
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#E2DAD0] shadow-xs flex flex-col h-[740px] overflow-hidden">
          {/* Top Coach Header */}
          <div className="px-6 py-4.5 border-b border-[#E4DCD0] bg-[#F4EDE2] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base sm:text-lg font-serif font-medium text-[#1A221C]">
                    Conversational Yoga Guru
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4E6548] bg-[#4E6548]/10 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4E6548] animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-xs text-[#5D6B60] mt-0.5">
                  Ask biomechanical questions, posture adjustments & breathing tips
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#718073] hidden md:inline">
                Natural voice read-aloud supported
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF7F2]">
            {messages.map((msg) => {
              const matchingPose = msg.suggestedPoseId
                ? YOGA_POSES.find((p) => p.id === msg.suggestedPoseId)
                : null;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 sm:gap-4 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "coach" && (
                    <div className="w-9 h-9 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[90%] sm:max-w-[78%] rounded-3xl p-5 sm:p-6 text-sm sm:text-base leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#4E6548] text-white rounded-tr-md shadow-xs"
                        : "bg-[#F4ECE0] text-[#1E2720] rounded-tl-md border border-[#E0D5C5] shadow-2xs font-sans"
                    }`}
                  >
                    {/* Message Body */}
                    <div className="whitespace-pre-line text-sm sm:text-base font-normal tracking-wide">
                      {msg.text}
                    </div>

                    {/* Interactive Pose Recommendation Card */}
                    {msg.sender === "coach" && matchingPose && (
                      <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#DDD3C2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#EBE2D4] text-[#4E6548] flex items-center justify-center font-serif text-sm font-medium">
                            {matchingPose.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-[#8B5A3C] uppercase tracking-wider block">
                              Recommended Posture
                            </span>
                            <h4 className="text-sm sm:text-base font-serif font-medium text-[#1E2520]">
                              {matchingPose.name} ({matchingPose.sanskritName})
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {onInspectPose && (
                            <button
                              onClick={() => onInspectPose(matchingPose)}
                              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-[#EBE2D4] hover:bg-[#DDD2C0] text-[#2D382F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#4E6548]" />
                              <span>View 3D Form</span>
                            </button>
                          )}
                          {onPracticePose && (
                            <button
                              onClick={() => onPracticePose(matchingPose)}
                              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-[#4E6548] hover:bg-[#3D5237] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Practice</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer bar with timestamp & voice read-aloud */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/5 text-xs">
                      <span className={msg.sender === "user" ? "text-[#D6E3D4]" : "text-[#758477]"}>
                        {msg.timestamp}
                      </span>

                      {msg.sender === "coach" && (
                        <button
                          onClick={() => handleToggleSpeech(msg.id, msg.text)}
                          className="flex items-center gap-1 text-xs text-[#5D6D5E] hover:text-[#2D392E] font-medium transition-colors px-2 py-0.5 rounded-lg hover:bg-black/5 cursor-pointer"
                          title="Listen to this guidance"
                        >
                          {isSpeaking && speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-[#C1664C]" />
                              <span className="text-[#C1664C]">Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-[#4E6548]" />
                              <span>Listen (Voice)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-9 h-9 rounded-2xl bg-[#C1664C] text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F4ECE0] max-w-sm text-[#4E6548] border border-[#E0D5C5] shadow-2xs">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Consulting yoga coach for clear, simple guidance...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Question Chips */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#F0E8DC] border-t border-[#E2DAD0] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-[#677769] whitespace-nowrap">
              Quick Topics:
            </span>
            {quickTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(undefined, topic.prompt)}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E5DCD0] text-[#334035] text-xs font-medium border border-[#DCD3C3] whitespace-nowrap shadow-2xs transition-colors cursor-pointer"
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E4DCD0] flex items-center gap-3"
          >
            <input
              id="coach-chat-input"
              type="text"
              placeholder="Ask a question in plain English (e.g., 'How do I stop my lower back hurting in Cobra?')"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-2xl bg-[#F4EDE2] border border-[#D8CEBE] text-sm sm:text-base text-[#1E2520] placeholder-[#8A978E] focus:outline-hidden focus:border-[#4E6548] focus:ring-2 focus:ring-[#4E6548]/20 transition-all"
            />
            <button
              type="submit"
              id="btn-send-coach-chat"
              disabled={isLoading || !inputMessage.trim()}
              className="px-5 py-3.5 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] disabled:opacity-40 text-white font-medium text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
