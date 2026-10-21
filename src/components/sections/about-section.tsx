"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Edit3 } from "lucide-react";
import BorderGlow from "@/components/ui/border-glow";
import { useAdmin } from "@/context/admin-context";
import ImageUploaderModal from "@/components/admin/image-uploader-modal";
import AboutEditModal from "@/components/admin/about-edit-modal";

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { isAdmin, aboutData, updateAbout } = useAdmin();

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [textModalOpen, setTextModalOpen] = useState(false);

  // Mouse tilt state for 3D photo effect
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate subtle rotation angles (max 12 deg)
    const rotateY = (mouseX / (rect.width / 2)) * 12;
    const rotateX = -(mouseY / (rect.height / 2)) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-dvh w-full py-16 sm:py-24 lg:py-28 bg-bg-primary flex flex-col justify-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/3 left-10 w-125 h-125 rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="page-shell relative z-10">
        {/* Section Header — Large SVG "ABOUT" with bottom fade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 sm:mb-10 pointer-events-none select-none"
        >
          <svg
            viewBox="0 0 600 160"
            preserveAspectRatio="xMinYMid meet"
            className="w-full max-w-[520px]"
            style={{ overflow: "visible" }}
            aria-label="About"
          >
            <defs>
              <linearGradient
                id="aboutTextGradient"
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
              <filter
                id="aboutDropShadow"
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
              fill="url(#aboutTextGradient)"
              filter="url(#aboutDropShadow)"
              style={{
                fontFamily: '"Clash Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: 600,
                fontSize: "130px",
                letterSpacing: "-0.02em",
                textAnchor: "start",
                dominantBaseline: "central",
              }}
            >
              ABOUT
            </text>
          </svg>
        </motion.div>

        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column — 3D Interactive Photo Card with BorderGlow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center relative"
          >
            <BorderGlow
              interactive={false}
              borderRadius={20}
              glowRadius={28}
              glowIntensity={1.2}
              coneSpread={30}
              colors={['#ef4444', '#f59e0b', '#ec4899']}
              glowColor="0 100 50"
              className="w-full max-w-md aspect-[3/4]"
            >
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-full rounded-2xl p-1 glass transition-transform duration-200 ease-out cursor-pointer perspective-[1000px] group"
                style={{
                  transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img
                    src={aboutData.photo}
                    alt={aboutData.name}
                    className="w-full h-full object-cover object-center filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Tag overlay inside 3D card */}
                  <div
                    className="absolute bottom-6 left-6 right-6 p-4 glass rounded-lg border border-white/10"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <p className="text-xs text-cream/70 uppercase tracking-widest font-geist">
                      {aboutData.name}
                    </p>
                    <p className="text-sm text-cream font-medium font-geist mt-0.5">
                      {aboutData.role}
                    </p>
                  </div>

                  {/* Admin Change Photo Button Overlay */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageModalOpen(true);
                      }}
                      className="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold font-geist shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Camera size={13} />
                      <span>Change Photo (Cloudinary)</span>
                    </button>
                  )}
                </div>

                {/* Glowing Corner Accents */}
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-laser-red/60 rounded-tr-lg pointer-events-none" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-laser-red/60 rounded-bl-lg pointer-events-none" />
              </div>
            </BorderGlow>
          </motion.div>

          {/* Right Column — Bio & Stat Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-10 relative">
            {/* Admin Edit Content Button */}
            {isAdmin && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setTextModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold font-geist transition-colors cursor-pointer"
                >
                  <Edit3 size={13} />
                  <span>Edit Heading, Bio &amp; Stats</span>
                </button>
              </div>
            )}

            {/* Bio Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-geist font-light text-cream leading-tight tracking-tight"
            >
              {aboutData.heading}
            </motion.h2>

            {/* Bio Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 text-text-secondary text-base sm:text-lg leading-relaxed font-geist"
            >
              {aboutData.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </motion.div>

            {/* Glassmorphism Stat Cards Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4"
            >
              {aboutData.stats.map((stat, idx) => (
                <motion.div
                  key={`${stat.label}-${idx}`}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 glass glass-hover rounded-xl border border-white/5 flex flex-col justify-between group cursor-default"
                >
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-cream group-hover:text-laser-red transition-colors duration-300">
                    {stat.value}
                  </span>
                  <span className="text-xs text-text-muted uppercase tracking-wider font-geist mt-2">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cloudinary Photo Uploader Modal */}
      <ImageUploaderModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        currentImage={aboutData.photo}
        title="Upload About Profile Photo"
        description="Upload a new portrait photo to Cloudinary. It will instantly update on your 3D About card."
        onImageSelected={(url) => updateAbout({ photo: url })}
      />

      {/* Text & Stats Editor Modal */}
      <AboutEditModal
        isOpen={textModalOpen}
        onClose={() => setTextModalOpen(false)}
      />
    </section>
  );
}

