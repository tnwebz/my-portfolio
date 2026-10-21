"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, KeyRound, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useAdmin } from "@/context/admin-context";

export default function AdminPasskeyModal() {
  const { passkeyModalOpen, setPasskeyModalOpen, verifyPasskey } = useAdmin();
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (passkeyModalOpen) {
      setKeyInput("");
      setError(false);
      setSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [passkeyModalOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (keyInput.trim() === "0728") {
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        verifyPasskey(keyInput);
      }, 400);
    } else {
      setError(true);
      setSuccess(false);
      setTimeout(() => {
        setKeyInput("");
      }, 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {passkeyModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPasskeyModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl border border-zinc-200/80 z-10"
          >
            {/* Close button */}
            <button
              onClick={() => setPasskeyModalOpen(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Icon Header */}
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4 shadow-inner">
                {success ? (
                  <CheckCircle2 size={26} className="text-emerald-600 animate-in zoom-in" />
                ) : (
                  <KeyRound size={26} />
                )}
              </div>

              <h3 className="font-geist text-xl font-bold text-zinc-950 tracking-tight">
                Admin Authentication
              </h3>
              <p className="font-geist text-xs text-zinc-500 mt-1 max-w-[240px]">
                Enter the portfolio master passkey to unlock inline editor mode.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="password"
                  maxLength={6}
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    if (error) setError(false);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Passkey"
                  className={`w-full text-center tracking-[0.4em] font-mono text-2xl font-bold py-3 px-4 rounded-xl border bg-zinc-50 transition-all outline-none ${
                    error
                      ? "border-red-500 ring-2 ring-red-500/20 text-red-600 animate-shake"
                      : success
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-600"
                      : "border-zinc-200 focus:border-zinc-950 focus:bg-white focus:ring-2 focus:ring-zinc-950/10 text-zinc-900"
                  }`}
                />
              </div>

              {error && (
                <div className="flex items-center justify-center gap-1.5 text-red-600 text-xs font-geist font-medium">
                  <AlertCircle size={14} />
                  <span>Invalid passkey. Please try again.</span>
                </div>
              )}

              {success && (
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-geist font-medium">
                  <CheckCircle2 size={14} />
                  <span>Access granted! Switching to Admin View...</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-geist font-semibold text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                Unlock Admin Mode
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-[11px] text-zinc-400 font-mono">
                Tip: Double-click the red N logo to exit anytime.
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
