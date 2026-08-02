"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/ui/loading-screen";
import ScrollProgressBar from "@/components/ui/scroll-progress-bar";
import {
  SmoothScrollProvider,
  ParticleField,
  AuroraBackground,
} from "@/components/effects";

interface ClientShellProps {
  children: React.ReactNode;
}

/**
 * Client-side shell that wraps the entire page content.
 * Handles the loading screen → content transition.
 */
export default function ClientShell({ children }: ClientShellProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for loading screen to finish, then reveal content
    // The LoadingScreen component handles its own timing
    // We just need to show content after the loading screen unmounts
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100); // Small delay to ensure loading screen mounts first

    return () => clearTimeout(timer);
  }, []);

  return (
    <SmoothScrollProvider>
      <AuroraBackground />
      <ParticleField />
      <ScrollProgressBar />
      <LoadingScreen />
      <AnimatePresence>
        {isReady && (
          <motion.div
            key="page-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </SmoothScrollProvider>
  );
}
