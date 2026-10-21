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
import { AdminProvider } from "@/context/admin-context";
import AdminPasskeyModal from "@/components/admin/admin-passkey-modal";
import AdminHUD from "@/components/admin/admin-hud";

interface ClientShellProps {
  children: React.ReactNode;
}

/**
 * Client-side shell that wraps the entire page content.
 * Handles the loading screen → content transition and Admin mode capabilities.
 */
export default function ClientShell({ children }: ClientShellProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AdminProvider>
      <SmoothScrollProvider>
        <AuroraBackground />
        <ParticleField />
        <ScrollProgressBar />
        <LoadingScreen />
        <AdminPasskeyModal />
        <AdminHUD />
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
    </AdminProvider>
  );
}

