import React, { useState } from "react";
import { FlowSequence, FlowItem, YogaPose } from "../types";
import { YOGA_POSES } from "../data/posesData";
import { HumanYogaAvatar } from "./HumanYogaAvatar";
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Play, 
  Save, 
  Sparkles, 
  Clock, 
  X, 
  Check, 
  Compass 
} from "lucide-react";

interface CustomFlowBuilderProps {
  onClose: () => void;
  onSaveFlow: (flow: FlowSequence) => void;
  onStartFlow: (flow: FlowSequence) => void;
}

export const CustomFlowBuilder: React.FC<CustomFlowBuilderProps> = ({
  onClose,
  onSaveFlow,
  onStartFlow,
}) => {
  const [title, setTitle] = useState<string>("My Mindful Flow");
  const [category, setCategory] = useState<"deskRelief" | "recovery" | "energy" | "sleep">("recovery");
  const [selectedPoses, setSelectedPoses] = useState<FlowItem[]>([
    { poseId: "child-pose", durationSeconds: 60, note: "Ground breath and open spine." },
    { poseId: "downward-dog", durationSeconds: 45, note: "Lengthen posterior chain." },
    { poseId: "warrior-2", durationSeconds: 45, side: "right", note: "Root through outer edge of back foot." },
    { poseId: "warrior-2", durationSeconds: 45, side: "left", note: "Keep torso vertical over pelvis." },
    { poseId: "savasana", durationSeconds: 120, note: "Rest in stillness." }
  ]);

  const [searchFilter, setSearchFilter] = useState<string>("");

  const totalSeconds = selectedPoses.reduce((acc, curr) => acc + curr.durationSeconds, 0);
  const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));

  const handleAddPose = (pose: YogaPose) => {
    const newItem: FlowItem = {
      poseId: pose.id,
      durationSeconds: pose.recommendedHoldSeconds || 45,
      note: pose.stepByStepInstructions[0] || "Breathe deeply."
    };
    setSelectedPoses([...selectedPoses, newItem]);
  };

  const handleRemovePose = (index: number) => {
    setSelectedPoses(selectedPoses.filter((_, idx) => idx !== index));
  };

  const handleMovePose = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === selectedPoses.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...selectedPoses];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSelectedPoses(updated);
  };

  const handleUpdateDuration = (index: number, secs: number) => {
    const updated = [...selectedPoses];
    updated[index].durationSeconds = Math.max(10, secs);
    setSelectedPoses(updated);
  };

  const handleUpdateSide = (index: number, side: "left" | "right" | "both") => {
    const updated = [...selectedPoses];
    updated[index].side = side;
    setSelectedPoses(updated);
  };

  const buildSequenceObject = (): FlowSequence => {
    return {
      id: "custom-flow-" + Date.now(),
      title: title || "Custom Yoga Routine",
      subtitle: `Bespoke ${totalMinutes}-minute sequence created by you.`,
      durationMinutes: totalMinutes,
      category,
      difficulty: "intermediate",
      physicalFocus: ["Whole Body Mobility"],
      mentalFocus: "Presence & Alignment",
      description: "Custom formulated sequence tailored to your exact pacing and posture preferences.",
      bannerGradient: "from-[#F5EFEB] to-[#E5DCD0]",
      poses: selectedPoses,
      isCustom: true,
    };
  };

  const handleSave = () => {
    const newFlow = buildSequenceObject();
    onSaveFlow(newFlow);
    onClose();
  };

  const handleSaveAndPractice = () => {
    const newFlow = buildSequenceObject();
    onSaveFlow(newFlow);
    onStartFlow(newFlow);
  };

  const filteredLibrary = YOGA_POSES.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.sanskritName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div id="custom-flow-builder-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#181C19]/70 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#FBF9F5] rounded-3xl border border-[#E2DAD0] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E0D2] flex items-center justify-between bg-[#F5EFEB]/80">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68]">
              Sequence Studio & Architect
            </span>
            <div className="flex items-center gap-3 mt-1">
              <input
                id="custom-flow-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl sm:text-2xl font-serif font-medium text-[#1E241F] bg-transparent border-b border-dashed border-[#CFC3B0] focus:border-[#5A6D56] focus:outline-hidden"
              />
              <span className="text-xs text-[#7A877E] bg-[#EAE2D4] px-2.5 py-1 rounded-full font-medium">
                {totalMinutes} min • {selectedPoses.length} postures
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-save-custom-flow"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#EDE5D8] hover:bg-[#DFD5C5] text-[#334237] text-xs font-medium border border-[#D4C8B5] flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-[#BF6F55]" />
              <span>Save Flow</span>
            </button>

            <button
              id="btn-practice-custom-flow"
              onClick={handleSaveAndPractice}
              className="px-4 py-2 rounded-xl bg-[#5A6D56] hover:bg-[#485944] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice Now</span>
            </button>

            <button
              id="btn-close-builder"
              onClick={onClose}
              className="p-2 rounded-xl text-[#5A685D] hover:bg-[#EBE2D5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Builder Workspace Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sequence Timeline */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68]">
                Sequence Poses ({selectedPoses.length})
              </h3>
              <span className="text-xs text-[#8A978E]">Drag or click arrows to reorder</span>
            </div>

            {selectedPoses.length === 0 ? (
              <div className="p-12 text-center bg-[#F5EFE6] rounded-2xl border border-dashed border-[#DDD2C0] text-xs text-[#6F7D72]">
                No poses added yet. Pick postures from the library on the right to compose your flow.
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedPoses.map((item, idx) => {
                  const pose = YOGA_POSES.find((p) => p.id === item.poseId) || YOGA_POSES[0];
                  return (
                    <div
                      key={idx}
                      id={`builder-pose-${idx}`}
                      className="p-3 rounded-2xl bg-[#FAF7F1] border border-[#E2D8C8] flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#EAE2D4] text-[#4A5A4E] flex items-center justify-center font-serif text-xs font-medium">
                          {idx + 1}
                        </span>

                        <div>
                          <h4 className="text-sm font-serif font-medium text-[#1E2520]">{pose.name}</h4>
                          <span className="text-[11px] font-serif italic text-[#8B786B]">
                            {pose.sanskritName}
                          </span>
                        </div>
                      </div>

                      {/* Controls: Side, Duration, Order & Delete */}
                      <div className="flex items-center gap-2">
                        {/* Side selector if applicable */}
                        <select
                          value={item.side || "both"}
                          onChange={(e) => handleUpdateSide(idx, e.target.value as any)}
                          className="px-2 py-1 text-[11px] bg-[#EFE9DF] rounded-lg border border-[#DDD3C3] text-[#49574D] font-medium"
                        >
                          <option value="both">Both / Neutral</option>
                          <option value="right">Right Side</option>
                          <option value="left">Left Side</option>
                        </select>

                        {/* Duration Seconds Input */}
                        <div className="flex items-center gap-1 bg-[#EFE9DF] px-2 py-1 rounded-lg border border-[#DDD3C3] text-xs text-[#334237]">
                          <Clock className="w-3.5 h-3.5 text-[#8A988E]" />
                          <input
                            type="number"
                            min="10"
                            max="300"
                            step="5"
                            value={item.durationSeconds}
                            onChange={(e) => handleUpdateDuration(idx, parseInt(e.target.value) || 30)}
                            className="w-10 bg-transparent text-center font-medium text-xs focus:outline-hidden"
                          />
                          <span className="text-[10px] text-[#7A877E]">sec</span>
                        </div>

                        {/* Move Up/Down */}
                        <button
                          onClick={() => handleMovePose(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded-md text-[#6D7A70] hover:bg-[#EAE2D4] disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMovePose(idx, "down")}
                          disabled={idx === selectedPoses.length - 1}
                          className="p-1 rounded-md text-[#6D7A70] hover:bg-[#EAE2D4] disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemovePose(idx)}
                          className="p-1 rounded-md text-[#BF6F55] hover:bg-[#FAF0ED]"
                          title="Remove pose"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Pose Catalog Palette */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6F7E68]">
                Pose Palette Library
              </h3>
              <input
                type="text"
                placeholder="Filter poses..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-36 px-2.5 py-1 text-xs rounded-xl bg-[#F4EFE6] border border-[#DDD3C3] text-[#2A342B] focus:outline-hidden"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-1">
              {filteredLibrary.map((pose) => (
                <div
                  key={pose.id}
                  className="p-2.5 rounded-xl bg-[#FAF7F1] border border-[#E2D8C8] hover:border-[#5A6D56] flex items-center justify-between gap-2 transition-colors"
                >
                  <div>
                    <h5 className="text-xs font-serif font-medium text-[#222923]">{pose.name}</h5>
                    <span className="text-[10px] text-[#7A877E]">{pose.category} • {pose.recommendedHoldSeconds}s</span>
                  </div>

                  <button
                    id={`btn-add-palette-${pose.id}`}
                    onClick={() => handleAddPose(pose)}
                    className="p-1.5 rounded-lg bg-[#5A6D56] hover:bg-[#485944] text-white text-xs font-medium flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
