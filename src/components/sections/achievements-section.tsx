"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Edit3 } from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import AchievementsEditModal from "@/components/admin/achievements-edit-modal";

function StatCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(value * (1 - Math.pow(1 - progress, 3)));

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, value]);

  return (
    <span
      ref={ref}
      className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight"
    >
      {count}
      {suffix}
    </span>
  );
}

export default function AchievementsSection() {
  const { isAdmin, statMetrics, achievementCards } = useAdmin();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-white text-zinc-950 overflow-hidden"
    >
      <div className="page-shell">
        {/* Massive Condensed Headline on Single Line with Top-to-Bottom Fade Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full overflow-hidden mb-6 sm:mb-8"
        >
          <h2 className="font-anton text-[clamp(2.5rem,8vw,7.5rem)] tracking-tight uppercase leading-[0.92] text-fade-gradient select-none w-full text-center">
            HONORS &amp; TROPHIES
          </h2>

          {/* Admin Edit Honors & Counts Trigger */}
          {isAdmin && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => setEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold font-geist cursor-pointer transition-colors shadow-xs"
              >
                <Edit3 size={13} />
                <span>Edit Honors &amp; Counter Values</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Count-up Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 text-center mb-8 sm:mb-10"
        >
          {statMetrics.map((metric, idx) => (
            <div
              key={`${metric.label}-${idx}`}
              className="flex flex-col items-center justify-center gap-1"
            >
              <StatCounter value={metric.value} suffix={metric.suffix} />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-600">
                {metric.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Glassy Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {achievementCards.map((card, index) => (
            <motion.div
              key={`${card.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.2 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-zinc-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group min-h-[160px]"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base sm:text-lg">{card.emoji}</span>
                  <h3 className="font-bold text-zinc-950 text-sm sm:text-base tracking-tight">
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="mt-5">
                <span className="inline-block px-2.5 py-1 bg-zinc-100/90 border border-zinc-200 rounded text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-600">
                  {card.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Admin Honors & Metrics Modal */}
      <AchievementsEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </section>
  );
}

