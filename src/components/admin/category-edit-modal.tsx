"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus } from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { type CertificateCategory } from "@/data/certificates";

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_COLORS = [
  "#2563eb", // Blue
  "#059669", // Emerald
  "#0891b2", // Cyan
  "#d97706", // Amber
  "#7e22ce", // Purple
  "#dc2626", // Red
  "#ea580c", // Orange
  "#4f46e5", // Indigo
];

export default function CategoryEditModal({ isOpen, onClose }: CategoryEditModalProps) {
  const { addCategory } = useAdmin();

  const [label, setLabel] = useState("");
  const [organization, setOrganization] = useState("");
  const [year, setYear] = useState("2024");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);

  const handleSave = () => {
    if (!label.trim()) return;

    const id = label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const newCat: CertificateCategory = {
      id,
      label: label.trim(),
      organization: organization.trim() || label.trim(),
      year: year.trim() || "2024",
      description: description.trim(),
      folder: id,
      accentColor,
      icon: icon.trim() || label.trim().slice(0, 2).toUpperCase(),
    };

    addCategory(newCat);
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold font-geist mb-2">
                <FolderPlus size={13} />
                <span>Certificate Category</span>
              </div>
              <h3 className="font-geist text-xl font-bold text-zinc-950 tracking-tight">
                Create New Certificate Category
              </h3>
              <p className="font-geist text-xs text-zinc-500">
                Add a new verified credential category section with customizable badge icon and theme color.
              </p>
            </div>

            <div className="space-y-4">
              {/* Category Label */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value);
                    if (!icon && e.target.value) {
                      setIcon(e.target.value.slice(0, 2).toUpperCase());
                    }
                  }}
                  placeholder="e.g. AWS, Coursera, Stanford Online"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                />
              </div>

              {/* Organization & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Year Range
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2024–2025"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              {/* Icon Badge & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Badge Symbol (1-3 letters or emoji)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. AWS, G, 🚀"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-mono font-bold focus:border-zinc-950 focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                    Badge Accent Color
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAccentColor(color)}
                        style={{ backgroundColor: color }}
                        className={`h-7 w-7 rounded-full cursor-pointer transition-transform ${
                          accentColor === color ? "scale-115 ring-2 ring-zinc-950 ring-offset-2" : "hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold font-geist text-zinc-700 mb-1">
                  Category Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Professional certifications and credentials verifying expertise in..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-geist focus:border-zinc-950 focus:outline-none leading-relaxed"
                />
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
                disabled={!label.trim()}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold font-geist transition-all shadow-sm cursor-pointer"
              >
                Create Category
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
