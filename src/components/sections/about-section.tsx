"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { siteConfig } from "@/data/site-config";

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

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
        className="absolute top-1/3 left-10 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="page-shell relative z-10">
        {/* Section Header Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-[1px] w-12 bg-laser-red" />
          <span className="text-xs uppercase tracking-[0.3em] text-laser-red font-geist font-medium">
            01 &mdash; About
          </span>
        </motion.div>

        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column — 3D Interactive Photo Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-md aspect-[3/4] rounded-2xl p-1 glass transition-transform duration-200 ease-out cursor-pointer perspective-[1000px] group"
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img
                  src="/images/Nithish1.png"
                  alt={siteConfig.fullName}
                  className="w-full h-full object-cover object-center filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                
                {/* Floating Tag overlay inside 3D card */}
                <div
                  className="absolute bottom-6 left-6 right-6 p-4 glass rounded-lg border border-white/10"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <p className="text-xs text-cream/70 uppercase tracking-widest font-geist">
                    {siteConfig.fullName}
                  </p>
                  <p className="text-sm text-cream font-medium font-geist mt-0.5">
                    Senior Developer & Architect
                  </p>
                </div>
              </div>

              {/* Glowing Corner Accents */}
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-laser-red/60 rounded-tr-lg pointer-events-none" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-laser-red/60 rounded-bl-lg pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Column — Bio & Stat Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-10">
            {/* Bio Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-geist font-light text-cream leading-tight tracking-tight"
            >
              Architecting scalable systems with an obsessive eye for{" "}
              <span className="text-laser-red italic font-normal">visual precision</span>.
            </motion.h2>

            {/* Bio Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 text-text-secondary text-base sm:text-lg leading-relaxed font-geist"
            >
              {siteConfig.about.bio.map((paragraph, index) => (
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
              {siteConfig.about.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
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
    </section>
  );
}
