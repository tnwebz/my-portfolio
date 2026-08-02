"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Type Definitions ────────────────────────────────────────
type EaseTuple = [number, number, number, number];

// ─── Animation Constants ─────────────────────────────────────
const EXPO_OUT: EaseTuple = [0.22, 1, 0.36, 1];
const QUINT_IN_OUT: EaseTuple = [0.76, 0, 0.24, 1];

// ─── Nav Data ────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://NITHISH0728.github.io/" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nithish-s-s-81a0212a5",
  },
];

// ─── Component ───────────────────────────────────────────────
export default function HeroSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showScrollNav, setShowScrollNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.95) {
        setShowScrollNav(true);
      } else {
        setShowScrollNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <section id="hero" className="relative h-[100dvh] w-full overflow-hidden">
      {/* ═══════════════════════════════════════════════════════
          LAYER 0 — Dark Background with gradient
          ═══════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════
          LAYER 0 — Light Gallery Background
          ═══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 bg-[#faf9f5]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)",
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════
          LAYER 1 — Background Portrait Image
          ═══════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-0 anim-fade-in"
        style={{ animationDelay: "0ms" }}
      >
        <img
          src="/images/Nithish1.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15"
          style={{
            objectPosition: "center 20%",
            filter: "grayscale(100%) contrast(1.1) brightness(1.1)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.8) 100%),
              linear-gradient(to right, rgba(255,255,255,0.3) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.3) 100%)
            `,
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════
          LAYER 2 — Giant faded DEVELOPER (rises from below)
          ═══════════════════════════════════════════════════════ */}
      <div className="pointer-events-none absolute inset-x-0 top-[16vh] sm:top-[14vh] md:top-[25vh] z-10 flex justify-center overflow-hidden w-full max-w-full">
        <h1
          aria-label="Developer"
          className="developer-rise developer-gradient select-none font-hn text-[20vw] font-light leading-[0.85] tracking-[-0.05em] sm:text-[18vw] md:text-[16vw] lg:text-[15vw]"
        >
          DEVELOPER
        </h1>
      </div>

      {/* ═══════════════════════════════════════════════════════
          LAYER 3 — Front Portrait (Cutout over wordmark)
          ═══════════════════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[68vh] sm:h-[72vh] max-w-lg sm:max-w-xl md:max-w-2xl w-full z-20 pointer-events-none anim-rise-in flex items-end justify-center"
        style={{ animationDelay: "300ms" }}
      >
        <img
          src="/images/Nithish1.png"
          alt="Portrait"
          className="h-full w-full object-contain object-bottom filter contrast-105"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%)",
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════
          LAYER 4 — Horizontal Rule
          ═══════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-x-6 sm:inset-x-10 bottom-24 sm:bottom-32 z-30 h-[1px] bg-zinc-950/80 origin-left anim-line"
        style={{ animationDelay: "1200ms" }}
      />

      {/* ═══════════════════════════════════════════════════════
          LAYER 5 — Desktop Header
          ═══════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════
          LAYER 5 — Floating Glassmorphic Nav
          ═══════════════════════════════════════════════════════ */}
      <header className="fixed inset-x-0 top-0 w-screen pointer-events-none z-50">
        <AnimatePresence>
          {!showScrollNav && (
            <motion.nav 
              key="hero-nav"
              initial={{ opacity: 0, scale: 0.96, y: -10, x: "-50%", filter: "blur(8px)" }}
              animate={{ 
                opacity: 1, 
                scale: 1.0, 
                y: 24, 
                x: "-50%",
                filter: "blur(0px)",
                width: "calc(min(100% - 32px, 480px))"
              }}
              exit={{ opacity: 0, scale: 0.96, y: -10, x: "-50%", filter: "blur(8px)" }}
              whileHover={{
                y: 22,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              transition={{ 
                type: "tween",
                ease: [0.22, 1, 0.36, 1],
                duration: 0.4
              }}
              className="fixed left-1/2 pointer-events-auto flex items-center justify-between sm:justify-center gap-6 sm:gap-12 rounded-full glass-nav-premium px-8 sm:px-10 h-[68px] select-none"
            >
              {/* Left links (Desktop) */}
              <div className="hidden sm:flex items-center gap-8 z-10">
                <a href="#about" className="text-sm font-semibold text-zinc-800 hover:text-zinc-950 transition-colors">About</a>
                <a href="#projects" className="text-sm font-semibold text-zinc-800 hover:text-zinc-950 transition-colors">Projects</a>
              </div>

              {/* Center Logo */}
              <a href="#top" className="flex items-center gap-3 group shrink-0 z-10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-white font-geist font-bold text-sm transition-transform group-hover:scale-105">
                  N
                </div>
                <span className="font-geist font-extrabold text-sm text-zinc-950 tracking-tight">Nithish S S</span>
              </a>

              {/* Right links (Desktop) */}
              <div className="hidden sm:flex items-center gap-8 z-10">
                <a href="#contact" className="text-sm font-semibold text-zinc-800 hover:text-zinc-950 transition-colors">Contact</a>
              </div>

              {/* Mobile Hamburger (Visible only on mobile) */}
              <button
                onClick={toggleDrawer}
                className="sm:hidden relative z-50 flex flex-col items-center justify-center h-8 w-8 pointer-events-auto"
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative h-3.5 w-5 flex flex-col justify-between">
                  <span
                    className="block h-[1.5px] w-full bg-zinc-950 transition-all"
                    style={{
                      transitionDuration: "500ms",
                      transitionTimingFunction: `cubic-bezier(${QUINT_IN_OUT.join(",")})`,
                      transform: drawerOpen
                        ? "translateY(6px) rotate(45deg)"
                        : "translateY(0) rotate(0deg)",
                    }}
                  />
                  <span
                    className="block h-[1.5px] w-full bg-zinc-950 transition-opacity"
                    style={{
                      transitionDuration: "300ms",
                      opacity: drawerOpen ? 0 : 1,
                    }}
                  />
                  <span
                    className="block h-[1.5px] w-full bg-zinc-950 transition-all"
                    style={{
                      transitionDuration: "500ms",
                      transitionTimingFunction: `cubic-bezier(${QUINT_IN_OUT.join(",")})`,
                      transform: drawerOpen
                        ? "translateY(-6px) rotate(-45deg)"
                        : "translateY(0) rotate(0deg)",
                    }}
                  />
                </div>
              </button>
            </motion.nav>
          )}

          {showScrollNav && (
            <motion.nav 
              key="scroll-nav"
              initial={{ opacity: 0, scale: 0.9, y: -10, x: "-50%", filter: "blur(8px)" }}
              animate={{ 
                opacity: 1, 
                scale: 1.0, 
                y: 12, 
                x: "-50%",
                filter: "blur(0px)",
                width: "calc(min(100% - 32px, 360px))"
              }}
              exit={{ opacity: 0, scale: 0.9, y: -10, x: "-50%", filter: "blur(8px)" }}
              whileHover={{
                y: 10,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              transition={{ 
                type: "tween",
                ease: [0.22, 1, 0.36, 1],
                duration: 0.4
              }}
              className="fixed left-1/2 pointer-events-auto flex items-center justify-between sm:justify-center gap-4 sm:gap-8 rounded-full glass-nav-premium px-6 h-[52px] select-none"
            >
              {/* Left links (Desktop - compact) */}
              <div className="hidden sm:flex items-center gap-6 z-10">
                <a href="#about" className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 transition-colors">About</a>
                <a href="#projects" className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 transition-colors">Projects</a>
              </div>

              {/* Center Logo - compact */}
              <a href="#top" className="flex items-center gap-2 group shrink-0 z-10">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 text-white font-geist font-bold text-xs transition-transform group-hover:scale-105">
                  N
                </div>
                <span className="font-geist font-bold text-xs text-zinc-950 tracking-tight">Nithish</span>
              </a>

              {/* Right links (Desktop - compact) */}
              <div className="hidden sm:flex items-center gap-6 z-10">
                <a href="#contact" className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 transition-colors">Contact</a>
              </div>

              {/* Mobile Hamburger (Visible only on mobile - compact) */}
              <button
                onClick={toggleDrawer}
                className="sm:hidden relative z-50 flex flex-col items-center justify-center h-6 w-6 pointer-events-auto"
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
              >
                <div className="relative h-3 w-4.5 flex flex-col justify-between">
                  <span
                    className="block h-[1.2px] w-full bg-zinc-950 transition-all"
                    style={{
                      transitionDuration: "500ms",
                      transitionTimingFunction: `cubic-bezier(${QUINT_IN_OUT.join(",")})`,
                      transform: drawerOpen
                        ? "translateY(5.2px) rotate(45deg)"
                        : "translateY(0) rotate(0deg)",
                    }}
                  />
                  <span
                    className="block h-[1.2px] w-full bg-zinc-950 transition-opacity"
                    style={{
                      transitionDuration: "300ms",
                      opacity: drawerOpen ? 0 : 1,
                    }}
                  />
                  <span
                    className="block h-[1.2px] w-full bg-zinc-950 transition-all"
                    style={{
                      transitionDuration: "500ms",
                      transitionTimingFunction: `cubic-bezier(${QUINT_IN_OUT.join(",")})`,
                      transform: drawerOpen
                        ? "translateY(-5.2px) rotate(-45deg)"
                        : "translateY(0) rotate(0deg)",
                    }}
                  />
                </div>
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════════════════════
          LAYER 6 — Footer
          ═══════════════════════════════════════════════════════ */}
      <footer className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-6 sm:px-10 sm:pb-10 text-xs sm:text-sm leading-relaxed font-hn">
        {/* Footer Left — Roles */}
        <div
          className="flex flex-col anim-fade-up"
          style={{ animationDelay: "1400ms" }}
        >
          <span className="text-zinc-950 font-medium">Senior Developer</span>
          <span className="text-zinc-950 font-medium">Architect</span>
          <span className="text-zinc-950 font-medium">UI/UX Developer</span>
        </div>

        {/* Footer Right — Branding */}
        <div
          className="text-right flex flex-col anim-fade-up"
          style={{ animationDelay: "1550ms" }}
        >
          <span className="text-zinc-950 font-medium">A portfolio by</span>
          <span className="text-zinc-950 font-medium">Nithish S S</span>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════
          LAYER 7 — Mobile Drawer
          ═══════════════════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        className="sm:hidden fixed inset-0 z-40 transition-all"
        style={{
          transitionDuration: "500ms",
          backgroundColor: drawerOpen ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
          backdropFilter: drawerOpen ? "blur(4px)" : "blur(0px)",
          pointerEvents: drawerOpen ? "auto" : "none",
        }}
        onClick={closeDrawer}
      />

      {/* Panel */}
      <div
        className="sm:hidden fixed inset-y-0 right-0 z-40 w-[80%] max-w-sm bg-[#141414] px-8 py-10 transition-transform"
        style={{
          transitionDuration: "600ms",
          transitionTimingFunction: `cubic-bezier(${QUINT_IN_OUT.join(",")})`,
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Close button */}
        <button
          onClick={closeDrawer}
          className="absolute right-6 top-6 transition-all"
          style={{
            transitionDuration: "400ms",
            transitionDelay: drawerOpen ? "300ms" : "0ms",
            opacity: drawerOpen ? 1 : 0,
            transform: drawerOpen ? "rotate(0deg)" : "rotate(90deg)",
          }}
          aria-label="Close menu"
        >
          <X size={26} strokeWidth={1.5} className="text-cream" />
        </button>

        {/* Site Index */}
        <div className="mt-16 space-y-6">
          <span
            className="block text-[10px] uppercase tracking-[0.2em] text-cream/50 transition-all"
            style={{
              transitionDuration: "500ms",
              transitionDelay: drawerOpen ? "250ms" : "0ms",
              opacity: drawerOpen ? 1 : 0,
              transform: drawerOpen ? "translateY(0)" : "translateY(12px)",
            }}
          >
            Site Index
          </span>
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeDrawer}
                className="text-cream text-4xl font-hn tracking-wide transition-all"
                style={{
                  transitionDuration: "500ms",
                  transitionTimingFunction: `cubic-bezier(${EXPO_OUT.join(",")})`,
                  transitionDelay: drawerOpen ? `${300 + i * 80}ms` : "0ms",
                  opacity: drawerOpen ? 1 : 0,
                  transform: drawerOpen ? "translateY(0)" : "translateY(24px)",
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Find Me */}
        <div className="mt-12 space-y-4">
          <span
            className="block text-[10px] uppercase tracking-[0.2em] text-cream/50 transition-all"
            style={{
              transitionDuration: "500ms",
              transitionDelay: drawerOpen ? "500ms" : "0ms",
              opacity: drawerOpen ? 1 : 0,
              transform: drawerOpen ? "translateY(0)" : "translateY(12px)",
            }}
          >
            Find Me
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {SOCIAL_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream text-sm font-hn hover:opacity-60 transition-all"
                style={{
                  transitionDuration: "500ms",
                  transitionTimingFunction: `cubic-bezier(${EXPO_OUT.join(",")})`,
                  transitionDelay: drawerOpen ? `${550 + i * 60}ms` : "0ms",
                  opacity: drawerOpen ? 1 : 0,
                  transform: drawerOpen ? "translateY(0)" : "translateY(16px)",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CSS Animation Classes (inline styles via <style>)
          ═══════════════════════════════════════════════════════ */}
      <style jsx>{`
        .anim-fade-in {
          animation: hero-fade-in 1.2s ease-out both;
        }
        .anim-rise-in {
          animation: hero-rise-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .anim-fade-up {
          animation: hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .anim-line {
          animation: hero-line-grow 1.1s cubic-bezier(0.76, 0, 0.24, 1) both;
        }
        .developer-rise {
          animation: developer-rise 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.35s
            both;
          will-change: transform, opacity;
        }
        .developer-gradient {
          background-image: linear-gradient(
            to bottom,
            #09090b 0%,
            #09090b 28%,
            rgba(9, 9, 11, 0.55) 55%,
            rgba(9, 9, 11, 0.18) 78%,
            rgba(9, 9, 11, 0) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        @keyframes hero-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes hero-rise-in {
          from {
            opacity: 0;
            transform: translateY(4vh) scale(1.03);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes hero-fade-up {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes hero-line-grow {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        @keyframes developer-rise {
          from {
            opacity: 0;
            transform: translateY(85vh);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-fade-in,
          .anim-rise-in,
          .anim-fade-up,
          .anim-line,
          .developer-rise {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>
    </section>
  );
}
