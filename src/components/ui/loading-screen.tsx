"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Animation Config ────────────────────────────────────────
type EaseTuple = [number, number, number, number];
const EXPO_OUT: EaseTuple = [0.22, 1, 0.36, 1];
const QUINT_IN_OUT: EaseTuple = [0.76, 0, 0.24, 1];

const LOADING_DURATION = 3200; // Total loading time in ms
const EXIT_DURATION = 1.2; // Exit animation duration in seconds

const letterVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    rotateX: -90,
    filter: "blur(8px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.08,
      ease: EXPO_OUT,
    },
  }),
};

const roleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 1.4 + i * 0.15,
      ease: EXPO_OUT,
    },
  }),
};

const progressBarVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: LOADING_DURATION / 1000,
      ease: EXPO_OUT,
    },
  },
};

const containerExitVariants = {
  exit: {
    clipPath: "inset(0 0 100% 0)",
    transition: {
      duration: EXIT_DURATION,
      ease: QUINT_IN_OUT,
    },
  },
};

// ─── Component ───────────────────────────────────────────────
export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) {
      setReducedMotion(true);
      setIsLoading(false);
      return;
    }
  }, []);

  // Smooth progress counter
  const animateProgress = useCallback(() => {
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / LOADING_DURATION, 1);

      // Eased progress (ease-out-expo feel)
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(Math.floor(eased * 100));

      if (rawProgress < 1) {
        requestAnimationFrame(tick);
      } else {
        setProgress(100);
        // Small delay after hitting 100% before exit
        setTimeout(() => setIsLoading(false), 400);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!reducedMotion) {
      animateProgress();
    }
  }, [reducedMotion, animateProgress]);

  // Lock scroll during loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      // Delay overflow restore to let exit animation play
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
      }, EXIT_DURATION * 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const nameLetters = "NITHISH".split("");
  const roles = ["Senior Developer", "Architect", "UI/UX Developer"];

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          variants={containerExitVariants}
          exit="exit"
        >
          {/* ─── Subtle grid background ─── */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* ─── Center content ─── */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Logo / Name letters */}
            <div className="flex items-center gap-[0.5vw] perspective-[1000px]">
              {nameLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block font-hn text-[10vw] sm:text-[7vw] md:text-[5vw] leading-none text-zinc-950 tracking-[0.15em] font-light"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Role taglines */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
              {roles.map((role, i) => (
                <motion.span
                  key={role}
                  custom={i}
                  variants={roleVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-text-secondary text-xs sm:text-sm tracking-[0.25em] uppercase font-geist"
                >
                  {role}
                </motion.span>
              ))}
            </div>

            {/* ─── Progress section ─── */}
            <motion.div
              className="mt-12 flex flex-col items-center gap-4 w-[60vw] sm:w-[30vw] max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              {/* Progress bar track */}
              <div className="relative w-full h-[1px] bg-black/10 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 w-full bg-laser-red origin-left"
                  variants={progressBarVariants}
                  initial="hidden"
                  animate="visible"
                />
              </div>

              {/* Percentage + label row */}
              <div className="flex w-full items-center justify-between">
                <span className="text-text-muted text-[10px] tracking-[0.3em] uppercase font-geist">
                  Loading
                </span>
                <span className="font-mono text-zinc-950 text-sm tabular-nums tracking-wider font-medium">
                  {String(progress).padStart(3, "\u00A0")}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* ─── Corner branding ─── */}
          <motion.div
            className="absolute bottom-8 left-8 sm:left-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
          >
            <span className="text-text-muted text-[10px] tracking-[0.3em] uppercase font-geist">
              Portfolio &mdash; 2025
            </span>
          </motion.div>

          <motion.div
            className="absolute bottom-8 right-8 sm:right-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            <span className="text-text-muted text-[10px] tracking-[0.3em] uppercase font-geist">
              Nithish S S
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
