"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit3, Plus, Trash2 } from "lucide-react";
import { useAdmin, type AboutData } from "@/context/admin-context";

interface AboutEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutEditModal({ isOpen, onClose }: AboutEditModalProps) {
  const { aboutData, updateAbout, saveAll } = useAdmin();
  const [formData, setFormData] = useState<AboutData>(aboutData);

  useEffect(() => {
    if (isOpen) {
      setFormData(aboutData);
    }
  }, [isOpen, aboutData]);

  const handleParagraphChange = (index: number, value: string) => {
    const newBio = [...formData.bio];
    newBio[index] = value;
    setFormData({ ...formData, bio: newBio });
  };

  const addParagraph = () => {
    setFormData({ ...formData, bio: [...formData.bio, ""] });
  };

  const removeParagraph = (index: number) => {
    setFormData({
      ...formData,
      bio: formData.bio.filter((_, i) => i !== index),
    });
  };

  const handleStatChange = (
    index: number,
    field: "value" | "label",
    text: string
  ) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: text };
    setFormData({ ...formData, stats: newStats });
  };

  const handleSave = async () => {
    updateAbout(formData);
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl border border-zinc-200 z-10"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold font-geist mb-2">
                <Edit3 size={13} />
                <span>Admin View Editor</span>
              </div>
              <h3 className="font-geist text-xl font-bold text-zinc-950 tracking-tight">
                Edit About Section Content
              </h3>
              <p className="font-geist text-xs text-zinc-500">
                Update heading, bio paragraphs, and live statistics in the right column.
              </p>
            </div>

            <div className="space-y-5">
              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              {/* Heading */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Main Bio Heading
                </label>
                <textarea
                  rows={2}
                  value={formData.heading}
                  onChange={(e) =>
                    setFormData({ ...formData, heading: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Bio Paragraphs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold font-geist text-zinc-700">
                    Bio Paragraphs
                  </label>
                  <button
                    type="button"
                    onClick={addParagraph}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Paragraph</span>
                  </button>
                </div>
                <div className="space-y-2.5">
                  {formData.bio.map((p, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <textarea
                        rows={2}
                        value={p}
                        onChange={(e) =>
                          handleParagraphChange(idx, e.target.value)
                        }
                        className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm font-geist focus:border-zinc-950 focus:outline-none"
                        placeholder={`Paragraph ${idx + 1}`}
                      />
                      {formData.bio.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParagraph(idx)}
                          className="p-2 text-zinc-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat Cards */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-2">
                  Statistics Grid Cards (4 slots)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                          Card {idx + 1} Value
                        </span>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) =>
                            handleStatChange(idx, "value", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-sm font-mono font-bold text-zinc-900 bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                          Card {idx + 1} Label
                        </span>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) =>
                            handleStatChange(idx, "label", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-geist text-zinc-700 bg-white"
                        />
                      </div>
                    </div>
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
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold font-geist transition-all shadow-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
