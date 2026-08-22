import React, { useState } from "react";
import { UserProfile, FeedbackCategory } from "../types";
import { authService } from "../services/authService";
import { 
  MessageSquarePlus, 
  X, 
  Send, 
  Bug, 
  Layout, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Tag
} from "lucide-react";

interface UserFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onFeedbackSubmitted?: () => void;
}

const CATEGORIES: { type: FeedbackCategory; label: string; icon: any; desc: string }[] = [
  { type: "Bug", label: "Software Bug", icon: Bug, desc: "Something isn't working as expected" },
  { type: "UI Issue", label: "Visual & Layout", icon: Layout, desc: "Display alignment or design glitch" },
  { type: "Feature Request", label: "Feature Idea", icon: Sparkles, desc: "New sequence, timer, or sound idea" },
  { type: "Content Improvement", label: "Yoga Instruction", icon: FileText, desc: "Pose cue, Sanskrit, or anatomy suggestion" },
  { type: "Posture Feedback", label: "Form & Safety", icon: ShieldCheck, desc: "Injury modification or alignment note" },
];

export const UserFeedbackModal: React.FC<UserFeedbackModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onFeedbackSubmitted,
}) => {
  const [selectedType, setSelectedType] = useState<FeedbackCategory>("Feature Request");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please enter a short title and details for your feedback.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.submitFeedback({
        userId: currentUser?.id || "guest",
        userName: currentUser?.name || guestName || "Guest Yogi",
        userEmail: currentUser?.email || guestEmail || "guest@flowstate.app",
        type: selectedType,
        priority,
        title: title.trim(),
        description: description.trim(),
      });

      setIsSuccess(true);
      if (onFeedbackSubmitted) onFeedbackSubmitted();

      setTimeout(() => {
        setIsSuccess(false);
        setTitle("");
        setDescription("");
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMessage("Could not send feedback. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E2DAD0] w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#E4DCD0] bg-[#F4EDE2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4E6548] text-white flex items-center justify-center shadow-xs">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1A221C]">
                Share Feedback or Report an Issue
              </h3>
              <p className="text-xs text-[#5D6B60]">
                Sent directly to our engineering and yoga team for review
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

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#4E6548]/15 text-[#4E6548] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-medium text-[#1A221C]">Feedback Received!</h4>
              <p className="text-sm text-[#546556] max-w-sm mx-auto">
                Thank you for helping improve FlowState. Your report has been logged to the developer console.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-[#F8D7DA] text-[#721C24] text-xs font-medium border border-[#F5C6CB] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Tag / Category Picker */}
              <div>
                <label className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Topic Category</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedType === cat.type;
                    return (
                      <button
                        type="button"
                        key={cat.type}
                        onClick={() => setSelectedType(cat.type)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-medium transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#4E6548] text-white border-[#4E6548] shadow-xs"
                            : "bg-[#F4EDE2] text-[#3E4D41] border-[#DDD3C2] hover:bg-[#EBE2D4]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-semibold truncate">{cat.label}</span>
                        </div>
                        <span className={`text-[10px] line-clamp-1 ${isSelected ? "text-white/80" : "text-[#6E7E70]"}`}>
                          {cat.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-1">
                  Summary / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Add ocean waves sound option or fixed hip stretch note"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-sm text-[#1E2520] focus:outline-hidden focus:border-[#4E6548]"
                />
              </div>

              {/* Details Textarea */}
              <div>
                <label className="text-xs font-semibold text-[#4E6548] uppercase tracking-wider block mb-1 flex items-center justify-between">
                  <span>Detailed Description</span>
                  <span className="text-[10px] text-[#718274] font-normal">{description.length}/500</span>
                </label>
                <textarea
                  rows={4}
                  maxLength={500}
                  placeholder="Describe what happened or what you'd love to see added. Be as specific as you like!"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-sm text-[#1E2520] focus:outline-hidden focus:border-[#4E6548] resize-none"
                />
              </div>

              {/* Guest User Fields (if not logged in) */}
              {!currentUser && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] text-[#637265] block mb-1">Your Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Maya"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-xs text-[#1E2520] focus:outline-hidden focus:border-[#4E6548]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#637265] block mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="maya@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F4EDE2] border border-[#DDD3C2] text-xs text-[#1E2520] focus:outline-hidden focus:border-[#4E6548]"
                    />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#4E6548] hover:bg-[#3D5237] disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting to Backend..." : "Send Feedback to Developer Team"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
