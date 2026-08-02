"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X, ZoomIn, ZoomOut, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { certificateCategories, type CertificateCategory } from "@/data/certificates";

/* ─────────────────────────────────────────────────────────────
   /certificates — Dedicated Certificate Gallery Page
   ───────────────────────────────────────────────────────────── */

export default function CertificatesPage() {
  const [activeCategoryId, setActiveCategoryId] = useState(certificateCategories[0].id);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fullscreen viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(0);

  const activeCategory = certificateCategories.find((c) => c.id === activeCategoryId)!;

  // ── Fetch images when category changes ──
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/certificates/${activeCategoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.images) {
          setImages(data.images);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setImages([]);
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [activeCategoryId]);

  // ── Viewer helpers ──
  const openViewer = useCallback((index: number) => {
    setViewerIndex(index);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
    setViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const viewerPrev = useCallback(() => {
    setViewerIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }, [images.length]);

  const viewerNext = useCallback(() => {
    setViewerIndex((i) => (i + 1) % images.length);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }, [images.length]);

  // Keyboard: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!viewerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") viewerPrev();
      if (e.key === "ArrowRight") viewerNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewerOpen, closeViewer, viewerPrev, viewerNext]);

  // Lock body scroll when viewer is open
  useEffect(() => {
    document.body.style.overflow = viewerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [viewerOpen]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.5, Math.min(4, z - e.deltaY * 0.002)));
  }, []);

  // Pinch zoom
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinchDist.current > 0) {
        const delta = dist - lastPinchDist.current;
        setZoom((z) => Math.max(0.5, Math.min(4, z + delta * 0.005)));
      }
      lastPinchDist.current = dist;
    }
  }, []);

  const handleTouchEnd = useCallback(() => { lastPinchDist.current = 0; }, []);

  // Pan when zoomed
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - translate.x, y: e.clientY - translate.y };
  }, [zoom, translate]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setTranslate({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => { setIsDragging(false); }, []);

  // ── Shared glass button style ──
  const glassBtn: React.CSSProperties = {
    background: "rgba(255,255,255,0.14)",
    backdropFilter: "blur(18px) saturate(180%)",
    WebkitBackdropFilter: "blur(18px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.20)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    borderRadius: "999px",
    color: "#fff",
  };

  return (
    <div className="min-h-screen bg-[#fafafa] relative">
      {/* ── Background Ambient ── */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px]"
          style={{ background: `radial-gradient(circle, ${activeCategory.accentColor}08 0%, transparent 70%)` }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════
         TOP BAR: Back + Horizontal Category Navigation
         ══════════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(250,250,250,0.72)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="page-shell flex items-center gap-4 py-4">
          {/* Back button */}
          <Link
            href="/#certifications"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-all hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer"
            aria-label="Back to portfolio"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </Link>

          {/* Category pills — horizontally scrollable */}
          <div className="flex-1 overflow-x-auto scrollbar-none -mx-1 px-1">
            <div className="flex gap-2 w-max">
              {certificateCategories.map((cat: CertificateCategory) => {
                const isActive = cat.id === activeCategoryId;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    whileTap={{ scale: 0.96 }}
                    className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-geist tracking-tight whitespace-nowrap cursor-pointer transition-all duration-300"
                    style={{
                      background: isActive ? cat.accentColor : "rgba(255,255,255,0.85)",
                      color: isActive ? "#fff" : "#3f3f46",
                      border: isActive ? `1px solid ${cat.accentColor}` : "1px solid rgba(0,0,0,0.06)",
                      boxShadow: isActive
                        ? `0 8px 24px ${cat.accentColor}30, 0 0 0 1px ${cat.accentColor}20`
                        : "0 2px 8px rgba(0,0,0,0.03)",
                    }}
                  >
                    {/* Glass reflection on active */}
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute inset-0 pointer-events-none rounded-full"
                        style={{
                          background: "linear-gradient(130deg, rgba(255,255,255,0.30), transparent 60%)",
                          borderRadius: "inherit",
                        }}
                      />
                    )}
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-bold shrink-0"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.25)" : cat.accentColor,
                        color: "#fff",
                      }}
                    >
                      {cat.icon}
                    </span>
                    <span className="relative z-10">{cat.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════
         MAIN: Certificate Grid
         ══════════════════════════════════════════════════════════ */}
      <main className="page-shell relative z-10 pt-10 pb-20">
        {/* Category info header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-geist text-zinc-950 tracking-tight mb-2">
              {activeCategory.label}
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 font-geist max-w-xl leading-relaxed">
              {activeCategory.organization} · {activeCategory.year} — {activeCategory.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="aspect-[4/3] rounded-3xl"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              />
            ))}
          </div>
        )}

        {/* Certificate grid */}
        {!isLoading && images.length > 0 && (
          <motion.div
            key={activeCategoryId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {images.map((src, index) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                }}
                onClick={() => openViewer(index)}
                className="group relative cursor-pointer overflow-hidden"
                style={{
                  borderRadius: "24px",
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  boxShadow:
                    "0 12px 35px rgba(15,23,42,.08), 0 6px 18px rgba(15,23,42,.06), 0 1px 2px rgba(255,255,255,.25) inset",
                  transition: "box-shadow 0.35s cubic-bezier(.22,1,.36,1), border-color 0.35s",
                }}
              >
                {/* Glass reflection */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: "linear-gradient(130deg, rgba(255,255,255,0.55), rgba(255,255,255,0.08), transparent 70%)",
                    opacity: 0.55,
                    borderRadius: "inherit",
                  }}
                />

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "rgba(0,0,0,0.15)",
                    borderRadius: "inherit",
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-semibold font-geist"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <ZoomIn size={14} />
                    View
                  </div>
                </div>

                {/* Certificate image */}
                <div className="aspect-[4/3] p-3">
                  <img
                    src={src}
                    alt={`${activeCategory.label} Certificate ${index + 1}`}
                    className="w-full h-full object-contain rounded-xl"
                    draggable={false}
                  />
                </div>

                {/* Bottom label */}
                <div className="px-5 pb-4 pt-1">
                  <p className="text-sm font-semibold font-geist text-zinc-800 truncate">
                    Certificate {index + 1}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-geist">
                    {activeCategory.organization}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!isLoading && images.length === 0 && (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm text-zinc-400 font-mono">No certificates found in this category.</p>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════
         FULLSCREEN VIEWER
         ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {viewerOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            style={{
              background: "rgba(10,10,10,0.72)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) closeViewer(); }}
          >
            {/* Close */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeViewer}
              className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center cursor-pointer z-20"
              style={glassBtn}
              aria-label="Close viewer"
            >
              <X size={20} strokeWidth={2} />
            </motion.button>

            {/* Zoom controls */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.3))}
                className="flex h-10 w-10 items-center justify-center cursor-pointer"
                style={glassBtn}
                aria-label="Zoom out"
              >
                <ZoomOut size={16} />
              </motion.button>
              <span
                className="px-3 py-1.5 text-xs font-mono font-semibold text-white/80 inline-flex items-center"
                style={glassBtn}
              >
                {Math.round(zoom * 100)}%
              </span>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setZoom((z) => Math.min(4, z + 0.3))}
                className="flex h-10 w-10 items-center justify-center cursor-pointer"
                style={glassBtn}
                aria-label="Zoom in"
              >
                <ZoomIn size={16} />
              </motion.button>
            </div>

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={viewerPrev}
                  className="absolute left-4 sm:left-8 flex h-12 w-12 items-center justify-center cursor-pointer z-20"
                  style={glassBtn}
                  aria-label="Previous certificate"
                >
                  <ArrowLeft size={20} strokeWidth={2} />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={viewerNext}
                  className="absolute right-4 sm:right-8 flex h-12 w-12 items-center justify-center cursor-pointer z-20"
                  style={glassBtn}
                  aria-label="Next certificate"
                >
                  <ArrowRight size={20} strokeWidth={2} />
                </motion.button>
              </>
            )}

            {/* Image container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.8 }}
              onWheel={handleWheel}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "24px",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                touchAction: "none",
                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[viewerIndex]}
                  src={images[viewerIndex]}
                  alt={`Certificate ${viewerIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="select-none"
                  style={{
                    maxWidth: "88vw",
                    maxHeight: "76vh",
                    objectFit: "contain",
                    transform: `scale(${zoom}) translate(${translate.x / zoom}px, ${translate.y / zoom}px)`,
                    transition: isDragging ? "none" : "transform 0.2s ease",
                    borderRadius: "16px",
                    padding: "16px",
                  }}
                  draggable={false}
                />
              </AnimatePresence>
            </motion.div>

            {/* Bottom counter */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
              <span
                className="px-4 py-2 text-xs font-mono font-semibold text-white/80 inline-flex items-center"
                style={glassBtn}
              >
                {viewerIndex + 1} / {images.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
