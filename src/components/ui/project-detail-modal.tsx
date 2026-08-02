"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Bell, User, Image as ImageIcon, ExternalLink } from "lucide-react";

export interface ProjectDetailData {
  title: string;
  category?: string;
  description: string;
  problem: string;
  solution: string;
  tech: readonly string[] | string[];
  liveUrl?: string;
  githubUrl?: string;
  galleryImages?: string[];
}

interface ProjectDetailModalProps {
  project: ProjectDetailData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailModalProps) {
  // Prevent background body scroll when full screen overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press to close overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!project) return null;

  // Placeholder Gallery Images (4 slots ready for user updates)
  const gallerySlots = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [1, 2, 3, 4];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] min-h-screen w-screen bg-[#fafafa] text-zinc-950 overflow-y-auto overflow-x-hidden flex flex-col"
        >
          {/* Subtle Background Pattern */}
          <div
            className="pointer-events-none fixed inset-0 opacity-30 z-0"
            style={{
              backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* ── Top Navigation Bar ────────────────────────────── */}
          <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between shadow-xs">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2 text-xs sm:text-sm font-semibold text-zinc-900 shadow-xs transition-all hover:bg-zinc-950 hover:text-white hover:border-zinc-950 cursor-pointer"
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span>Back to Projects</span>
            </button>

            <div className="flex items-center gap-3">
              <h1 className="font-geist font-bold text-sm sm:text-base text-zinc-950 hidden md:block">
                {project.title}
              </h1>
              <div className="hidden sm:flex items-center gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-0.5 text-[11px] font-mono font-medium text-zinc-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* ── Main Fullscreen Container Content ─────────────── */}
          <main className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 py-12 sm:py-16 flex-1 flex flex-col space-y-16">

            {/* ── 1. Top UI Dashboard Mockup Card ──────────────── */}
            <section className="w-full bg-white rounded-3xl border border-zinc-200/90 shadow-2xl overflow-hidden">
              {/* Mockup Header Bar */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-zinc-100 bg-white">
                <div className="flex items-center gap-3 font-bold font-geist text-zinc-950 text-sm sm:text-base">
                  <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-mono">
                    ✦
                  </div>
                  <span>{project.title}</span>
                </div>

                {/* Mock Search Input */}
                <div className="hidden sm:flex items-center gap-2 rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-2 text-xs text-zinc-400 w-72">
                  <Search size={14} className="text-zinc-400" />
                  <span>Search for company...</span>
                </div>

                <div className="flex items-center gap-4 text-zinc-400">
                  <Bell size={18} className="hover:text-zinc-700 cursor-pointer" />
                  <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 font-semibold text-xs">
                    <User size={16} />
                  </div>
                </div>
              </div>

              {/* Mockup Dashboard Content Area */}
              <div className="p-6 sm:p-10 bg-[#f4f4f5] grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch min-h-[320px]">
                {/* Left Mini Sidebar */}
                <div className="hidden md:flex md:col-span-3 flex-col space-y-2 text-xs font-medium text-zinc-600">
                  <div className="bg-zinc-950 text-white rounded-xl px-4 py-3 font-semibold shadow-xs">
                    Home
                  </div>
                  <div className="px-4 py-2.5 hover:bg-zinc-200/70 rounded-xl transition-colors cursor-pointer">
                    Building
                  </div>
                  <div className="px-4 py-2.5 hover:bg-zinc-200/70 rounded-xl transition-colors cursor-pointer">
                    Iconography
                  </div>
                  <div className="px-4 py-2.5 hover:bg-zinc-200/70 rounded-xl transition-colors cursor-pointer">
                    Reloads
                  </div>
                </div>

                {/* Main Hero Card */}
                <div className="md:col-span-6 bg-zinc-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[220px] shadow-lg">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold leading-snug tracking-tight mb-3 text-zinc-100">
                      Growth &mdash; comprehensive {project.title}, platform suite
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-6 border-t border-zinc-800 text-xs text-zinc-400">
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-900" />
                      <div className="w-6 h-6 rounded-full bg-zinc-600 border border-zinc-900" />
                      <div className="w-6 h-6 rounded-full bg-zinc-500 border border-zinc-900" />
                    </div>
                    <span>1685 comments</span>
                  </div>
                </div>

                {/* Right Widget */}
                <div className="hidden md:flex md:col-span-3 bg-white rounded-2xl p-5 border border-zinc-200 flex-col justify-between text-xs space-y-4 shadow-sm">
                  <div>
                    <span className="font-bold text-zinc-950 text-sm block mb-3">Get started</span>
                    <div className="rounded-xl border border-zinc-200 p-2.5 text-zinc-500 text-xs mb-3 flex items-center justify-between bg-zinc-50">
                      <span>Select platform</span>
                      <span>&darr;</span>
                    </div>
                    <div className="text-xs text-zinc-500 space-y-2">
                      <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                        <span>Binter 1</span>
                        <span className="text-[10px] text-zinc-400">22m</span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                        Update 2 &bull; Sync
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 2. Problem & Solution 2-Column Section ───────── */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              {/* PROBLEM Column */}
              <div className="space-y-4 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-sm">
                <h2 className="font-anton text-5xl sm:text-7xl uppercase tracking-tight leading-none text-fade-gradient select-none">
                  PROBLEM
                </h2>
                <p className="font-geist text-base sm:text-lg text-zinc-600 leading-relaxed">
                  {project.problem}
                </p>
              </div>

              {/* SOLUTION Column */}
              <div className="space-y-4 bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200/80 shadow-sm">
                <h2 className="font-anton text-5xl sm:text-7xl uppercase tracking-tight leading-none text-fade-gradient select-none">
                  SOLUTION
                </h2>
                <p className="font-geist text-base sm:text-lg text-zinc-600 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </section>

            {/* ── 3. Project Gallery Section (Preset for User Images) ── */}
            <section className="space-y-8 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-laser-red font-mono font-semibold block mb-2">
                    MEDIA SHOWCASE
                  </span>
                  <h3 className="font-anton text-4xl sm:text-5xl uppercase tracking-tight text-zinc-950">
                    PROJECT GALLERY
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 font-geist max-w-xs">
                  Interface previews, dashboard views, and visual design assets.
                </p>
              </div>

              {/* 4 Gallery Cards Grid Preset */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {gallerySlots.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-[16/10] w-full rounded-2xl bg-gradient-to-br from-zinc-200/90 via-zinc-100 to-zinc-200/60 border border-zinc-300/80 overflow-hidden shadow-sm flex flex-col items-center justify-center p-6 transition-all duration-300 hover:shadow-md hover:border-zinc-400 cursor-pointer"
                  >
                    {typeof item === "string" ? (
                      <img
                        src={item}
                        alt={`Gallery preview ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/90 border border-zinc-300/80 shadow-xs flex items-center justify-center text-zinc-600 group-hover:scale-110 transition-transform duration-300">
                          <ImageIcon size={22} strokeWidth={1.5} />
                        </div>
                        <span className="font-mono text-xs font-semibold tracking-wider text-zinc-500 uppercase mt-2">
                          GALLERY IMAGE {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-geist">
                          (Click to view asset)
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── 4. Bottom Footer Bar ─────────────────────────── */}
            <footer className="pt-10 pb-6 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-7 py-3.5 text-xs sm:text-sm font-semibold text-zinc-900 shadow-md transition-all hover:bg-zinc-950 hover:text-white hover:border-zinc-950 cursor-pointer"
              >
                <ArrowLeft size={16} strokeWidth={2} />
                <span>Back to Projects</span>
              </button>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-950 hover:text-laser-red transition-colors"
                >
                  <span>Visit Live Project Demo</span>
                  <ExternalLink size={15} />
                </a>
              )}
            </footer>

          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
