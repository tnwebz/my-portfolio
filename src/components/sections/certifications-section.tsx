"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site-config";

/* ─── Certificate Items Extended Metadata ──────────────────── */
const certificationData = siteConfig.certifications.map((cert) => ({
  id: cert.credentialId,
  title: cert.name,
  issuer: `${cert.institution} · ${cert.date}`,
  description: `Verified credential ${cert.credentialId}. Issued by ${cert.institution} in ${cert.date}. Demonstrating expertise in cloud architecture, full-stack development, and modern web technologies.`,
  badgeText: cert.institution.includes("Meta") ? "META" : cert.institution.includes("AWS") ? "AWS" : "VERIFIED",
  themeColor: cert.institution.includes("Meta") ? "#2563eb" : cert.institution.includes("AWS") ? "#d97706" : "#059669",
}));

export default function CertificationsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const activeCert = certificationData[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % certificationData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + certificationData.length) % certificationData.length);
  };

  return (
    <section
      id="certifications"
      ref={containerRef}
      className="relative w-full min-h-screen py-16 sm:py-24 lg:py-28 bg-[#fafafa] overflow-hidden flex flex-col justify-center"
    >
      {/* Background Subtle Ambient Wash */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="page-shell relative z-10">
        {/* ── Section Header Tag & Editorial Title ──────────── */}
        <div className="mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-laser-red font-mono font-semibold">
              04 &mdash; CERTIFICATIONS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-none"
          >
            <span className="font-geist font-extrabold text-zinc-950">
              Verified{" "}
            </span>
            <span className="font-serif italic font-light text-zinc-400">
              Credentials
            </span>
          </motion.h2>
        </div>

        {/* ── 2-Column Split Composition ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* ════ LEFT COLUMN: 3D Stacked Certificate Cards ════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-start relative min-h-[340px] sm:min-h-[380px]"
          >
            <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center">
              
              {/* Backing Stacked Card 3 (Bottom) */}
              <div
                className="absolute inset-0 rounded-3xl bg-zinc-100 border border-zinc-200/60 shadow-sm pointer-events-none transition-all duration-500"
                style={{
                  transform: "translateY(24px) scale(0.88)",
                  opacity: 0.5,
                }}
              />

              {/* Backing Stacked Card 2 (Middle) */}
              <div
                className="absolute inset-0 rounded-3xl bg-zinc-50 border border-zinc-200/80 shadow-md pointer-events-none transition-all duration-500"
                style={{
                  transform: "translateY(12px) scale(0.94)",
                  opacity: 0.85,
                }}
              />

              {/* Active Foreground Card (Top) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCert.id}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-3xl bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-8 flex flex-col items-center justify-center text-center select-none"
                >
                  {/* Top Circular Brand Badge with Color Glow */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm tracking-wider mb-6 transition-all duration-500 border"
                    style={{
                      borderColor: `${activeCert.themeColor}40`,
                      backgroundColor: `${activeCert.themeColor}0a`,
                      color: activeCert.themeColor,
                      boxShadow: `0 8px 24px -4px ${activeCert.themeColor}30`,
                    }}
                  >
                    {activeCert.badgeText}
                  </div>

                  {/* Certificate Representation Bars */}
                  <div className="w-full max-w-[220px] space-y-2.5 mb-6">
                    {/* Main title bar */}
                    <div className="h-3.5 bg-zinc-800 rounded-full w-full mx-auto" />
                    {/* Subtitle bar 1 */}
                    <div className="h-2 bg-zinc-300/80 rounded-full w-4/5 mx-auto" />
                    {/* Subtitle bar 2 */}
                    <div className="h-1.5 bg-zinc-200 rounded-full w-3/5 mx-auto" />
                  </div>

                  {/* Colored Action Ribbon Badge */}
                  <div
                    className="px-6 py-2 rounded-lg text-white font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-500 shadow-sm"
                    style={{
                      backgroundColor: activeCert.themeColor,
                      boxShadow: `0 4px 14px ${activeCert.themeColor}40`,
                    }}
                  >
                    VERIFIED STAMP
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </motion.div>

          {/* ════ RIGHT COLUMN: Active Credential Info & Controls ════ */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center gap-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCert.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-geist text-zinc-950 tracking-tight leading-snug">
                  {activeCert.title}
                </h3>

                {/* Issuer & Year */}
                <p className="text-xs sm:text-sm font-semibold font-mono text-zinc-500 tracking-wide uppercase">
                  {activeCert.issuer}
                </p>

                {/* Description */}
                <p className="text-sm sm:text-base text-zinc-600 font-geist leading-relaxed max-w-lg pt-1">
                  {activeCert.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Controls: Left & Right Arrows */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous certification"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
              >
                <ArrowLeft size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next certification"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
              >
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
