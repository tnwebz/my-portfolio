"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, LogOut, RotateCcw, Check, Sparkles, AlertCircle } from "lucide-react";
import { useAdmin } from "@/context/admin-context";

export default function AdminHUD() {
  const { isAdmin, exitAdmin, saveAll, resetToDefaults, isSaving, lastSavedAt } = useAdmin();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isAdmin) return null;

  const handleSave = async () => {
    const success = await saveAll();
    if (success) {
      setToastMessage("All changes saved to portfolio!");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold font-geist shadow-2xl border border-white/20"
          >
            <Check size={14} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Admin Dock */}
      <motion.aside
        aria-label="Admin controls"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-red-500/30 shadow-[0_12px_40px_rgba(239,68,68,0.18)]"
      >
        {/* Status indicator */}
        <div className="flex items-center gap-2 pr-3 border-r border-zinc-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="text-[11px] font-bold font-mono tracking-wider text-red-600 uppercase">
            Admin Active
          </span>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold font-geist transition-all shadow-xs cursor-pointer active:scale-95"
        >
          {isSaving ? (
            <span className="animate-spin text-xs">⏳</span>
          ) : (
            <Save size={13} />
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={resetToDefaults}
          title="Reset all content to defaults"
          className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
        </button>

        {/* Exit Admin */}
        <button
          type="button"
          onClick={exitAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-red-50 text-zinc-700 hover:text-red-600 text-xs font-semibold font-geist transition-colors cursor-pointer"
        >
          <LogOut size={13} />
          <span>Exit Admin</span>
        </button>
      </motion.aside>
    </>
  );
}
