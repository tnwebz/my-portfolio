"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ───────────────────────────────────────────────────── */
interface GradientStop {
  offset: string;
  color: string;
  opacity?: number;
}

interface HeroSVGTextRevealProps {
  topText: string;
  revealText: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: string;
  revealFontSize?: string;
  letterSpacing?: string;
  revealLetterSpacing?: string;
  className?: string;
  gradientStops?: GradientStop[];
}

/* ─── Defaults ────────────────────────────────────────────────── */
const DEFAULT_GRADIENT_STOPS: GradientStop[] = [
  { offset: "0%", color: "#09090b", opacity: 1 },
  { offset: "50%", color: "#09090b", opacity: 1 },
  { offset: "70%", color: "#09090b", opacity: 0.6 },
  { offset: "85%", color: "#09090b", opacity: 0.25 },
  { offset: "100%", color: "#09090b", opacity: 0 },
];

const DEFAULT_FONT_FAMILY =
  '"Clash Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

/* ─── Component ───────────────────────────────────────────────── */
export default function HeroSVGTextReveal({
  topText,
  revealText,
  fontFamily = DEFAULT_FONT_FAMILY,
  fontWeight = 500,
  fontSize = "165px",
  revealFontSize = "140px",
  letterSpacing = "-0.03em",
  revealLetterSpacing = "-0.01em",
  className = "",
  gradientStops = DEFAULT_GRADIENT_STOPS,
}: HeroSVGTextRevealProps) {
  const [hovered, setHovered] = useState(false);
  const gradientId = "heroTextGradient";

  /* ── Shared SVG text style ────────────────────────────────── */
  const sharedTextStyle: React.CSSProperties = {
    fontFamily,
    fontWeight,
    dominantBaseline: "central",
    textAnchor: "middle",
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      className={`pointer-events-auto cursor-default flex justify-center items-center w-full px-2 sm:px-4 ${className}`}
    >
      <AnimatePresence mode="wait">
        {!hovered ? (
          <motion.div
            key="top-text"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="developer-rise flex items-center justify-center w-full"
          >
            <svg
              viewBox="0 0 1000 280"
              preserveAspectRatio="xMidYMid meet"
              className="w-full select-none"
              style={{ overflow: "visible" }}
              aria-label={topText}
              role="heading"
              aria-level={1}
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  {gradientStops.map((stop, i) => (
                    <stop
                      key={i}
                      offset={stop.offset}
                      stopColor={stop.color}
                      stopOpacity={stop.opacity ?? 1}
                    />
                  ))}
                </linearGradient>
                {/* Drop shadow filter — blurs the text shape downward */}
                <filter
                  id="heroDropShadow"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="150%"
                >
                  <feGaussianBlur
                    in="SourceAlpha"
                    stdDeviation="6"
                    result="blur"
                  />
                  <feOffset in="blur" dx="0" dy="14" result="offsetBlur" />
                  <feComponentTransfer in="offsetBlur" result="fadedShadow">
                    <feFuncA type="linear" slope="0.18" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="fadedShadow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text
                x="50%"
                y="100"
                fill={`url(#${gradientId})`}
                filter="url(#heroDropShadow)"
                style={{
                  ...sharedTextStyle,
                  fontSize,
                  letterSpacing,
                }}
              >
                {topText}
              </text>
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="reveal-text"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center w-full"
          >
            <svg
              viewBox="0 0 1000 280"
              preserveAspectRatio="xMidYMid meet"
              className="w-full select-none"
              style={{ overflow: "visible" }}
              aria-label={revealText}
            >
              <defs>
                <linearGradient
                  id={`${gradientId}Reveal`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  {gradientStops.map((stop, i) => (
                    <stop
                      key={i}
                      offset={stop.offset}
                      stopColor={stop.color}
                      stopOpacity={stop.opacity ?? 1}
                    />
                  ))}
                </linearGradient>
                {/* Drop shadow filter for reveal text */}
                <filter
                  id="heroDropShadowReveal"
                  x="-10%"
                  y="-10%"
                  width="120%"
                  height="150%"
                >
                  <feGaussianBlur
                    in="SourceAlpha"
                    stdDeviation="5"
                    result="blur"
                  />
                  <feOffset in="blur" dx="0" dy="12" result="offsetBlur" />
                  <feComponentTransfer in="offsetBlur" result="fadedShadow">
                    <feFuncA type="linear" slope="0.15" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="fadedShadow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text
                x="50%"
                y="100"
                fill={`url(#${gradientId}Reveal)`}
                filter="url(#heroDropShadowReveal)"
                style={{
                  ...sharedTextStyle,
                  fontSize: revealFontSize,
                  letterSpacing: revealLetterSpacing,
                }}
              >
                {revealText}
              </text>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
