"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, UploadCloud, Sparkles, Trash2 } from "lucide-react";
import { useAdmin, type SkillItem, type SkillsData } from "@/context/admin-context";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface SkillEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetGroup: keyof SkillsData;
  initialSkill?: SkillItem;
  editIndex?: number;
}

const PRESET_ICONS = [
  "Java", "JavaScript", "C", "HTML", "CSS", "React", "Tailwind",
  "NodeJS", "ExpressJS", "Python", "MySQL", "MongoDB", "PostgreSQL",
  "Claude", "Cursor", "Antigravity", "n8n", "GitHub", "VSCode"
];

const GLOW_COLORS = [
  { label: "Cyan", value: "rgba(6, 182, 212, 0.25)", bg: "from-cyan-50/80 to-teal-100/40" },
  { label: "Blue", value: "rgba(59, 130, 246, 0.22)", bg: "from-blue-50/80 to-blue-100/40" },
  { label: "Green", value: "rgba(34, 197, 94, 0.22)", bg: "from-green-50/80 to-emerald-100/40" },
  { label: "Amber", value: "rgba(234, 179, 8, 0.25)", bg: "from-amber-50/80 to-yellow-100/40" },
  { label: "Red", value: "rgba(239, 68, 68, 0.22)", bg: "from-red-50/80 to-orange-100/40" },
  { label: "Purple", value: "rgba(168, 85, 247, 0.25)", bg: "from-purple-50/80 to-indigo-100/40" },
  { label: "Pink", value: "rgba(236, 72, 153, 0.25)", bg: "from-pink-50/80 to-rose-100/40" },
  { label: "Dark", value: "rgba(0, 0, 0, 0.20)", bg: "from-zinc-100/80 to-zinc-200/40" },
];

export default function SkillEditModal({
  isOpen,
  onClose,
  targetGroup,
  initialSkill,
  editIndex,
}: SkillEditModalProps) {
  const { addSkill, updateSkill } = useAdmin();

  const [name, setName] = useState(initialSkill?.name || "");
  const [selectedGroup, setSelectedGroup] = useState<keyof SkillsData>(targetGroup);
  const [iconType, setIconType] = useState<"upload" | "preset">(
    initialSkill?.iconUrl ? "upload" : "preset"
  );
  const [presetName, setPresetName] = useState(initialSkill?.presetName || "React");
  const [iconUrl, setIconUrl] = useState(initialSkill?.iconUrl || "");
  const [selectedColor, setSelectedColor] = useState(
    GLOW_COLORS[0]
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync when initialSkill changes
  React.useEffect(() => {
    if (initialSkill) {
      setName(initialSkill.name);
      setIconType(initialSkill.iconUrl ? "upload" : "preset");
      if (initialSkill.presetName) setPresetName(initialSkill.presetName);
      if (initialSkill.iconUrl) setIconUrl(initialSkill.iconUrl);
      const matchColor = GLOW_COLORS.find(c => c.value === initialSkill.glowColor);
      if (matchColor) setSelectedColor(matchColor);
    } else {
      setName("");
      setIconType("upload");
      setIconUrl("");
      setPresetName("React");
    }
    setSelectedGroup(targetGroup);
  }, [initialSkill, targetGroup, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const url = await uploadImageToCloudinary(file);
      setIconUrl(url);
      setIconType("upload");
      setIsUploading(false);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload to Cloudinary");
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const skillItem: SkillItem = {
      name: name.trim(),
      glowColor: selectedColor.value,
      iconBg: selectedColor.bg,
      iconType: iconType === "upload" ? "image" : "preset",
      presetName: iconType === "preset" ? presetName : undefined,
      iconUrl: iconType === "upload" ? iconUrl : undefined,
    };

    if (editIndex !== undefined && initialSkill) {
      updateSkill(selectedGroup, editIndex, skillItem);
    } else {
      addSkill(selectedGroup, skillItem);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl border border-zinc-200 z-10"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold font-geist mb-2">
                <Sparkles size={13} />
                <span>Skills Management</span>
              </div>
              <h3 className="font-geist text-xl font-bold text-zinc-950 tracking-tight">
                {editIndex !== undefined ? "Edit Skill" : "Add New Skill"}
              </h3>
              <p className="font-geist text-xs text-zinc-500">
                Upload a brand/tech logo to Cloudinary or select a preset icon to match the grid styling.
              </p>
            </div>

            <div className="space-y-4">
              {/* Skill Name */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js, Docker, Figma, AWS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                />
              </div>

              {/* Target Category */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Category Section
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) =>
                    setSelectedGroup(e.target.value as keyof SkillsData)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none bg-white"
                >
                  <option value="programmingLanguages">Programming Languages</option>
                  <option value="webDevFrontend">Web Development — Frontend</option>
                  <option value="webDevBackend">Web Development — Backend</option>
                  <option value="webDevDatabase">Web Development — Database</option>
                  <option value="tools">Tools &amp; Platforms</option>
                </select>
              </div>

              {/* Icon Type Selection */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1.5">
                  Skill Logo Source
                </label>
                <div className="flex rounded-xl bg-zinc-100 p-1 mb-3">
                  <button
                    type="button"
                    onClick={() => setIconType("upload")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      iconType === "upload"
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    <UploadCloud size={14} />
                    <span>Upload Logo (Cloudinary)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIconType("preset")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold font-geist transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      iconType === "preset"
                        ? "bg-white text-zinc-950 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    <Sparkles size={14} />
                    <span>Built-in SVG</span>
                  </button>
                </div>

                {iconType === "upload" ? (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-zinc-50/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {isUploading ? (
                        <p className="text-xs text-blue-600 font-semibold font-geist">
                          Uploading logo to Cloudinary...
                        </p>
                      ) : iconUrl ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={iconUrl}
                            alt="Logo preview"
                            className="w-10 h-10 object-contain rounded-md"
                          />
                          <div className="text-left">
                            <p className="text-xs font-semibold text-emerald-600">
                              Logo uploaded to Cloudinary!
                            </p>
                            <p className="text-[11px] text-zinc-400">
                              Click to choose another
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-2">
                          <UploadCloud size={20} className="text-zinc-400 mb-1" />
                          <span className="text-xs font-semibold text-zinc-700">
                            Click to upload SVG, PNG, or WEBP logo
                          </span>
                        </div>
                      )}
                    </label>

                    {/* Direct URL alternative */}
                    <div className="pt-1">
                      <input
                        type="text"
                        value={iconUrl}
                        onChange={(e) => setIconUrl(e.target.value)}
                        placeholder="Or paste direct image URL (https://...)"
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono focus:border-zinc-950 focus:outline-none"
                      />
                    </div>

                    {uploadError && (
                      <p className="text-xs text-red-600">{uploadError}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <select
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none bg-white"
                    >
                      {PRESET_ICONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Glow Accent Color */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-2">
                  Atmospheric Hover Glow Tint
                </label>
                <div className="flex flex-wrap gap-2">
                  {GLOW_COLORS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium font-geist border transition-all cursor-pointer ${
                        selectedColor.label === c.label
                          ? "border-zinc-950 bg-zinc-950 text-white"
                          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-7 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold font-geist text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!name.trim() || (iconType === "upload" && !iconUrl)}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold font-geist transition-all shadow-sm cursor-pointer"
              >
                {editIndex !== undefined ? "Save Skill" : "Add to Skills"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
