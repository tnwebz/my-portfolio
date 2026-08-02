"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import ProjectDetailModal, { ProjectDetailData } from "@/components/ui/project-detail-modal";

/* ─── Wireframe Cube Icon Component ─────────────────────────── */
function WireframeCube() {
  return (
    <svg
      className="w-10 h-10 text-zinc-700 opacity-75"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

/* ─── Main Projects Section Component ───────────────────────── */
export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Modal State
  const [selectedProject, setSelectedProject] = useState<ProjectDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateNav();
    el.addEventListener("scroll", updateNav, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      el.removeEventListener("scroll", updateNav);
      window.removeEventListener("resize", updateNav);
    };
  }, [updateNav]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-project-card]");
    const gap = 20;
    const amount = card ? card.offsetWidth + gap : el.clientWidth * 0.6;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const handleOpenDetail = (project: typeof siteConfig.projects[number]) => {
    const detailData: ProjectDetailData = {
      title: project.title,
      description: project.description,
      problem:
        "Outdated platforms lacked intuitive course building, real-time coding environments, and effective collaboration tools, hindering learning experiences.",
      solution:
        "Developed a modern LMS using React and Node.js, integrating a robust code arena, real-time sockets for collaboration, and an intuitive course builder.",
      tech: project.tech ? [...project.tech] : ["React", "Node.js", "TypeScript"],
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
    };

    setSelectedProject(detailData);
    setIsModalOpen(true);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#fafafa] py-16 sm:py-24 lg:py-28 text-zinc-950"
    >
      {/* Background Subtle Noise/Grid Highlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="page-shell relative z-10">
        {/* ── Header Section ────────────────────────────────── */}
        <div className="mb-8 sm:mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-anton text-5xl sm:text-7xl lg:text-8xl xl:text-9xl uppercase tracking-tight leading-[0.88] text-fade-gradient mb-4 select-none">
              FEATURE PROJECTS
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-geist max-w-xl leading-relaxed">
              Explore key software systems, architectural solutions, and full-stack web applications.
            </p>
          </motion.div>

          {/* Top Right Controls & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 shrink-0 self-start lg:self-end"
          >
            {/* Arrow Nav Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous projects"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-xs transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-zinc-200 disabled:hover:bg-white disabled:hover:text-zinc-800"
              >
                <ArrowLeft size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next projects"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-xs transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-zinc-200 disabled:hover:bg-white disabled:hover:text-zinc-800"
              >
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Book a demo CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-900 shadow-xs transition-all hover:bg-zinc-950 hover:text-white hover:border-zinc-950"
            >
              <span>Book a demo</span>
              <ArrowUpRight size={14} strokeWidth={2} />
            </a>
          </motion.div>
        </div>

        {/* ── Projects Horizontal Carousel Track ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full min-w-0"
        >
          <div
            ref={trackRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth pb-6 pt-2 w-full min-w-0 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {siteConfig.projects.map((project, idx) => (
              <article
                key={project.title}
                data-project-card
                onClick={() => handleOpenDetail(project)}
                className="group flex w-[min(100%,290px)] sm:w-[320px] lg:w-[340px] shrink-0 snap-start flex-col transition-transform duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* ── Top Part: Light Silver/Zinc Image Box ───── */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-t-3xl bg-[#e5e5e5] border-t border-x border-zinc-300/60 flex flex-col items-center justify-center text-center p-4">
                  {project.image && project.image !== "/images/placeholder-project.svg" ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <WireframeCube />
                      <span className="font-mono text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
                        IMG — {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  {/* Featured Tag */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 rounded-full bg-zinc-950/80 px-2.5 py-0.5 text-[10px] font-mono font-medium text-white backdrop-blur-xs">
                      Featured
                    </div>
                  )}
                </div>

                {/* ── Bottom Part: Black Card Body ───────────── */}
                <div className="flex flex-1 flex-col justify-between rounded-b-3xl bg-[#09090b] p-6 sm:p-7 text-white shadow-xl border-b border-x border-zinc-900">
                  <div>
                    {/* Tech Stack Pills */}
                    {project.tech && project.tech.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-0.5 text-[11px] font-medium text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Project Title */}
                    <h3 className="mb-2 font-geist text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-zinc-100">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-6 font-geist text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Actions & Links */}
                  <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(project);
                      }}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:text-laser-red cursor-pointer"
                    >
                      <span>Read more</span>
                      <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
                    </button>

                    {project.githubUrl && project.githubUrl !== "#" && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${project.title} GitHub repository`}
                        className="text-zinc-400 transition-colors hover:text-white"
                      >
                        <Github size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Project Detail Modal (Stitch Screen a2e5e8e85ac4443298081f248cd8e250) ── */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
