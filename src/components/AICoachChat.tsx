import React, { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Sparkles, Compass, CheckCircle2, MessageSquare } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
  suggestedPoseId?: string;
}

export const AICoachChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "coach",
      text: "Namaste. I am your FlowState Biomechanical & Mindfulness AI Coach. Ask me any question regarding posture alignment, muscle recruitment, safe modifications, or pranayama breathwork.",
      timestamp: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim() || isLoading) return;

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
      const response = await fetch("/api/chat-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: promptToSend,
          contextPose: "all",
        }),
      });

      if (!response.ok) throw new Error("Coach response failed");
      const data = await response.json();

      const coachMsg: ChatMessage = {
        id: "coach-" + Date.now(),
        sender: "coach",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedPoseId: data.suggestedPoseId,
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const fallbackCoachMsg: ChatMessage = {
        id: "coach-" + Date.now(),
        sender: "coach",
        text: "In yoga biomechanics, the key is maintaining active joint centration and lengthening before deepening any flexion or extension. Ground through the four corners of your feet or hands, engage your transverse abdominis, and never force a range of motion that causes pinching.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackCoachMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "Why does my lower back feel pinched in Cobra Pose?",
    "How to position hips correctly in Warrior 1 vs Warrior 2?",
    "What are best poses to release tight IT band and glutes?",
    "How should I breathe when transitioning into Downward Dog?"
  ];

  return (
    <div id="ai-coach-chat-container" className="bg-[#FAF7F2] rounded-3xl border border-[#E4DCD0] shadow-xs flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E8DFD0] bg-[#F4EDE2]/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5A6D56] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-serif font-medium text-[#1E2520]">
                FlowState Anatomical AI Coach
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#5A6D56] animate-pulse" />
            </div>
            <span className="text-[11px] text-[#6D7A70] block">
              Powered by Gemini • Biomechanics, Alignment & Injury Prevention
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "coach" && (
              <div className="w-7 h-7 rounded-full bg-[#5A6D56]/15 text-[#5A6D56] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[#5A6D56] text-white rounded-tr-xs shadow-xs"
                  : "bg-[#F3EDE2] text-[#28332A] rounded-tl-xs border border-[#E0D7C9] shadow-2xs font-sans"
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <span
                className={`text-[10px] block mt-1.5 ${
                  msg.sender === "user" ? "text-[#DCE4DC] text-right" : "text-[#8A968E]"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === "user" && (
              <div className="w-7 h-7 rounded-full bg-[#BF6F55]/15 text-[#BF6F55] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#7A877E] italic p-2">
            <Bot className="w-4 h-4 animate-spin text-[#5A6D56]" />
            <span>Consulting biomechanical alignment framework...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-[#F6F0E5] border-t border-[#E8DFD0] flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
        <span className="text-[#8C988F] font-medium whitespace-nowrap">Try asking:</span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(undefined, q)}
            className="px-3 py-1 rounded-full bg-[#FAF7F1] hover:bg-[#EBE2D4] text-[#475549] border border-[#DDD3C2] whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-[#FAF7F2] border-t border-[#E8DFD0] flex items-center gap-2">
        <input
          id="coach-chat-input"
          type="text"
          placeholder="Ask about joint alignment, muscle engagement, or modifications..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl bg-[#F3EDE2] border border-[#DDD3C3] text-xs sm:text-sm text-[#2A342B] placeholder-[#9CA99F] focus:outline-hidden focus:border-[#5A6D56] transition-colors"
        />
        <button
          type="submit"
          id="btn-send-coach-chat"
          disabled={isLoading || !inputMessage.trim()}
          className="p-3 rounded-2xl bg-[#5A6D56] hover:bg-[#485944] disabled:opacity-40 text-white shadow-xs transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
