"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";

/* ─── Certificate Items Extended Metadata ──────────────────── */
const certificationData = siteConfig.certifications.map((cert) => ({
  id: cert.credentialId,
  title: cert.name,
  issuer: `${cert.institution} · ${cert.date}`,
  description: `Verified credential ${cert.credentialId}. Issued by ${cert.institution} in ${cert.date}. Demonstrating expertise in cloud architecture, full-stack development, and modern web technologies.`,
  src: cert.logo,
}));

/* ─── Gap calculator (from CircularTestimonials) ────────────── */
function calculateGap(width: number) {
  const minWidth = 300;
  const maxWidth = 600;
  const minGap = 40;
  const maxGap = 76;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export default function CertificationsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(500);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  const activeCert = certificationData[activeIndex];
  const count = useMemo(() => certificationData.length, []);

  // Responsive gap measurement
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 5000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [count]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, [count]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, [count]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePrev, handleNext]);

  // 3D image positioning (left, center, right from CircularTestimonials)
  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + count) % count === index;
    const isRight = (activeIndex + 1) % count === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

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
        {/* ── Section Header — Large SVG "Verified Credentials" with bottom fade ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 sm:mb-12 pointer-events-none select-none"
        >
          <svg
            viewBox="0 0 1100 160"
            preserveAspectRatio="xMinYMid meet"
            className="w-full max-w-[950px]"
            style={{ overflow: "visible" }}
            aria-label="Verified Credentials"
          >
            <defs>
              <linearGradient
                id="certTextGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#09090b" stopOpacity="1" />
                <stop offset="50%" stopColor="#09090b" stopOpacity="1" />
                <stop offset="72%" stopColor="#09090b" stopOpacity="0.55" />
                <stop offset="88%" stopColor="#09090b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="certItalicGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#52525b" stopOpacity="1" />
                <stop offset="50%" stopColor="#52525b" stopOpacity="1" />
                <stop offset="72%" stopColor="#52525b" stopOpacity="0.55" />
                <stop offset="88%" stopColor="#52525b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#52525b" stopOpacity="0" />
              </linearGradient>
              <filter
                id="certDropShadow"
                x="-10%"
                y="-10%"
                width="120%"
                height="150%"
              >
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
                <feOffset in="blur" dx="0" dy="10" result="offsetBlur" />
                <feComponentTransfer in="offsetBlur" result="fadedShadow">
                  <feFuncA type="linear" slope="0.12" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="fadedShadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <text
              x="0"
              y="95"
              filter="url(#certDropShadow)"
              style={{
                fontFamily: 'var(--font-geist), "Inter", sans-serif',
                fontWeight: 800,
                fontSize: "110px",
                letterSpacing: "-0.03em",
                textAnchor: "start",
                dominantBaseline: "central",
              }}
            >
              <tspan fill="url(#certTextGradient)">Verified </tspan>
              <tspan
                fill="url(#certItalicGradient)"
                style={{
                  fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                Credentials
              </tspan>
            </text>
          </svg>
        </motion.div>

        {/* ── 2-Column Split Composition ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* ════ LEFT COLUMN: 3-Photo Perspective Carousel ════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-start"
          >
            <div
              ref={imageContainerRef}
              className="relative w-full max-w-md"
              style={{
                height: "24rem",
                perspective: "1000px",
              }}
            >
              {certificationData.map((cert, index) => (
                <img
                  key={cert.id}
                  src={cert.src}
                  alt={cert.title}
                  draggable={false}
                  className="select-none"
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "1.5rem",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                    ...getImageStyle(index),
                  }}
                />
              ))}
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

            {/* Controls: Arrows + View More */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous certification"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white cursor-pointer"
              >
                <ArrowLeft size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next certification"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white cursor-pointer"
              >
                <ArrowRight size={18} strokeWidth={2} />
              </button>

              {/* View More — links to /certificates page */}
              <Link
                href="/certificates"
                className="relative inline-flex items-center gap-2 overflow-hidden cursor-pointer select-none ml-2 group"
                style={{
                  padding: "10px 22px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(18px) saturate(180%)",
                  WebkitBackdropFilter: "blur(18px) saturate(180%)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 8px 22px rgba(0,0,0,0.05), 0 1px 3px rgba(255,255,255,.25) inset",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  letterSpacing: "0.02em",
                  color: "#09090b",
                  transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
                }}
              >
                {/* Glass reflection */}
                <span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(130deg, rgba(255,255,255,0.55), rgba(255,255,255,0.08), transparent 70%)",
                    opacity: 0.55,
                    borderRadius: "inherit",
                  }}
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="relative z-10 font-geist">View More</span>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
