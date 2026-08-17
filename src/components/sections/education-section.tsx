"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { siteConfig } from "@/data/site-config";

type TabKey = "education" | "skills";

/* ─── Helpers ──────────────────────────────────────────────── */
function toDisplayCase(str: string): string {
  const small = new Set(["of", "and", "the", "in", "for", "to", "a", "an"]);
  return str
    .toLowerCase()
    .split(" ")
    .map((word, i) => {
      if (i > 0 && small.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/* ─── Education Data ───────────────────────────────────────── */
const educationData = siteConfig.education.map((item, i) => ({
  period: item.period,
  location: item.location,
  degree: item.degree,
  institution: toDisplayCase(item.institution),
  score: item.score,
  barWidth: item.score === "Pursuing" ? 28 : item.progress * 0.85,
  side: (i % 2 === 0 ? "right" : "left") as "right" | "left",
}));

/* ─── Skills Data ──────────────────────────────────────────── */
interface TechItem {
  name: string;
  glowColor: string;
  iconBg: string;
  icon: React.ReactNode;
}

const Icons = {
  Java: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21c-4.5 0-7-2-7-4 0-1.5 1-2.5 3-3.5" />
      <path d="M15 13.5c2 1 3 2 3 3.5 0 2-2.5 4-7 4" />
      <path d="M9 10c0-2.5 2-4.5 4.5-4.5S17 7.5 17 9" />
      <path d="M12 2v3.5" />
      <path d="M15 3.5v2" />
    </svg>
  ),
  JavaScript: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm10.72 14.28c.45.82 1.19 1.37 2.25 1.37 1.05 0 1.76-.52 1.76-1.25 0-.87-.69-1.2-1.84-1.7l-.63-.27c-1.82-.77-3.03-1.73-3.03-3.72 0-1.85 1.43-3.27 3.68-3.27 1.63 0 2.82.57 3.58 1.93l-1.8 1.15c-.4-.71-.96-1.02-1.78-1.02-.82 0-1.35.45-1.35 1.07 0 .72.5 1.02 1.6 1.5l.63.27c2.15.93 3.32 1.88 3.32 3.93 0 2.25-1.75 3.5-4.13 3.5-2.3 0-3.77-1.12-4.48-2.5l1.83-1.05zM7.22 17.5c.57.97 1.4 1.5 2.5 1.5 1.25 0 2.05-.62 2.05-2.37V9.75h-2.5v6.85c0 .65-.27.93-.78.93-.5 0-.85-.27-1.12-.78l-.15-1.25z"/>
    </svg>
  ),
  C: <span className="font-sans text-xl sm:text-2xl font-black text-zinc-800">C</span>,
  HTML: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622-12.899-.002.693 8.057h8.761l-.343 3.77-3.27.887-3.264-.887-.209-2.383h-2.62l.394 4.793 5.699 1.583 5.706-1.583.778-8.901H8.531z"/>
    </svg>
  ),
  CSS: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622-12.899-.002.693 8.057h8.761l-.343 3.77-3.27.887-3.264-.887-.209-2.383h-2.62l.394 4.793 5.699 1.583 5.706-1.583.778-8.901H8.531z"/>
    </svg>
  ),
  React: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <ellipse cx="12" cy="12" rx="10" ry="4.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  Tailwind: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-teal-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
    </svg>
  ),
  NodeJS: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L3.5 7v10l8.5 5 8.5-5V7L12 2zm6.5 14.2l-6.5 3.8-6.5-3.8V8.8L12 5l6.5 3.8v7.4z"/>
    </svg>
  ),
  ExpressJS: (
    <span className="font-mono text-xs sm:text-sm font-bold tracking-tighter text-zinc-900">ex</span>
  ),
  Python: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.91 1.05c-5.21 0-4.88 2.26-4.88 2.26l.01 2.34h4.96v.71H5.05S1.8 6.03 1.8 11.27c0 5.25 2.82 5.06 2.82 5.06h1.69v-2.39s.09-2.85 2.81-2.85h4.84s2.68.04 2.68-2.6V4.1s.42-3.05-4.84-3.05zm-2.64 1.55a.96.96 0 1 1 0 1.93.96.96 0 0 1 0-1.93zm9.68 5.08h-1.69v2.39s.09 2.85-2.81 2.85h-4.84s-2.68-.04-2.68 2.6v4.38s-.42 3.05 4.84 3.05c5.21 0 4.88-2.26 4.88-2.26l-.01-2.34h-4.96v-.71h6.95s3.25.33 3.25-4.91c0-5.24-2.82-5.05-2.82-5.05zm-2.4 14.77a.96.96 0 1 1 0-1.92.96.96 0 0 1 0 1.92z"/>
    </svg>
  ),
  MySQL: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-sky-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 13.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm-9 0c.8 0 1.5-.7 1.5-1.5S8.3 10.5 7.5 10.5 6 11.2 6 12s.7 1.5 1.5 1.5zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8 0-1.8.6-3.5 1.7-4.8l2.1 2.1c-.2.8.1 1.7.7 2.3.8.8 2.1.8 2.9 0 .8-.8.8-2.1 0-2.9-.6-.6-1.5-.9-2.3-.7L7 5.7C8.4 4.6 10.1 4 12 4c4.4 0 8 3.6 8 8s-3.6 8-8 8z"/>
    </svg>
  ),
  MongoDB: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5s-6.75 6.45-6.75 11.25c0 4.14 3.03 7.5 6.75 7.5s6.75-3.36 6.75-7.5C18.75 7.95 12 1.5 12 1.5zm0 16.5c-2.48 0-4.5-2.02-4.5-4.5 0-2.73 3.32-6.66 4.5-7.98 1.18 1.32 4.5 5.24 4.5 7.98 0 2.48-2.02 4.5-4.5 4.5z"/>
    </svg>
  ),
  PostgreSQL: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"/>
    </svg>
  ),
  Claude: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#da7756]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c.4 0 .7.3.8 1l.7 4.2 3.1-2.9c.5-.5 1.2-.2 1.3.4l.2 4.2 4.1-1.3c.6-.2 1.2.4.9 1l-2.2 3.6 4.1.9c.7.2.8 1 0 1.4l-3.8 1.9 3.2 2.8c.5.5.2 1.3-.4 1.3l-4.2-.3 1.6 4c.3.6-.3 1.2-.9 1l-3.7-2 0 4.3c0 .7-.8 1-1.2.4l-2.4-3.5-2.4 3.5c-.4.6-1.2.3-1.2-.4l0-4.3-3.7 2c-.6.2-1.2-.4-.9-1l1.6-4-4.2.3c-.6 0-.9-.8-.4-1.3l3.2-2.8-3.8-1.9c-.8-.4-.7-1.2 0-1.4l4.1-.9-2.2-3.6c-.3-.6.3-1.2.9-1l4.1 1.3.2-4.2c.1-.6.8-.9 1.3-.4l3.1 2.9.7-4.2c.1-.7.4-1 .8-1z" />
    </svg>
  ),
  Cursor: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.2L3.5 7.1v9.8L12 21.8l8.5-4.9V7.1L12 2.2z" fill="#09090b" />
      <path d="M12 2.2L3.5 7.1l8.5 4.9 8.5-4.9-8.5-4.9z" fill="#3f3f46" />
      <path d="M3.5 7.1v9.8l8.5 4.9v-9.8L3.5 7.1z" fill="#18181b" />
      <path d="M20.5 7.1v9.8l-8.5 4.9v-9.8l8.5-4.9z" fill="#27272a" />
      <path d="M12 7.1L6.5 14h11L12 7.1z" fill="#ffffff" />
    </svg>
  ),
  Antigravity: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="antigravity-rainbow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ff4e00" />
          <stop offset="30%" stopColor="#ffb700" />
          <stop offset="60%" stopColor="#00c853" />
          <stop offset="100%" stopColor="#2979ff" />
        </linearGradient>
      </defs>
      <path
        d="M3.8 18.2C3.2 18.2 2.8 17.5 3.2 16.9C5.1 13 8 5 12 5C16 5 18.9 13 20.8 16.9C21.2 17.5 20.8 18.2 20.2 18.2C18.8 18.2 17.1 16.5 12 11.2C6.9 16.5 5.2 18.2 3.8 18.2Z"
        fill="url(#antigravity-rainbow)"
      />
    </svg>
  ),
  n8n: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#ea4b71]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632" />
    </svg>
  ),
  GitHub: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-900" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  VSCode: (
    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.12a.999.999 0 0 0-1.276.04L.373 7.15a.998.998 0 0 0-.067 1.432L4.04 12 .306 15.418a.998.998 0 0 0 .067 1.432l1.276 1.103a.998.998 0 0 0 1.276.04l4.12-3.12 9.46 8.63a1.494 1.494 0 0 0 1.705.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.94a1.5 1.5 0 0 0-.85-1.353zm-6.54 13.913L10.9 12l5.71-4.5 2.8 1.83v7.34l-2.8 1.83z"/>
    </svg>
  ),
};

const programmingLanguages: TechItem[] = [
  { name: "Java", glowColor: "rgba(59, 130, 246, 0.22)", iconBg: "from-blue-50/80 to-blue-100/40", icon: Icons.Java },
  { name: "JavaScript", glowColor: "rgba(234, 179, 8, 0.25)", iconBg: "from-amber-50/80 to-yellow-100/40", icon: Icons.JavaScript },
  { name: "C", glowColor: "rgba(239, 68, 68, 0.22)", iconBg: "from-red-50/80 to-orange-100/40", icon: Icons.C },
];

const webDevFrontend: TechItem[] = [
  { name: "HTML", glowColor: "rgba(249, 115, 22, 0.22)", iconBg: "from-orange-50/80 to-red-100/40", icon: Icons.HTML },
  { name: "CSS", glowColor: "rgba(37, 99, 235, 0.22)", iconBg: "from-blue-50/80 to-sky-100/40", icon: Icons.CSS },
  { name: "React", glowColor: "rgba(6, 182, 212, 0.25)", iconBg: "from-cyan-50/80 to-teal-100/40", icon: Icons.React },
  { name: "Tailwind CSS", glowColor: "rgba(20, 184, 166, 0.22)", iconBg: "from-teal-50/80 to-emerald-100/40", icon: Icons.Tailwind },
];

const webDevBackend: TechItem[] = [
  { name: "Node.js", glowColor: "rgba(34, 197, 94, 0.22)", iconBg: "from-green-50/80 to-emerald-100/40", icon: Icons.NodeJS },
  { name: "Express.js", glowColor: "rgba(113, 113, 122, 0.22)", iconBg: "from-zinc-100/80 to-zinc-200/40", icon: Icons.ExpressJS },
  { name: "Python", glowColor: "rgba(234, 179, 8, 0.22)", iconBg: "from-yellow-50/80 to-amber-100/40", icon: Icons.Python },
];

const webDevDatabase: TechItem[] = [
  { name: "MySQL", glowColor: "rgba(2, 132, 199, 0.22)", iconBg: "from-sky-50/80 to-blue-100/40", icon: Icons.MySQL },
  { name: "MongoDB", glowColor: "rgba(16, 185, 129, 0.22)", iconBg: "from-emerald-50/80 to-green-100/40", icon: Icons.MongoDB },
  { name: "PostgreSQL", glowColor: "rgba(99, 102, 241, 0.22)", iconBg: "from-indigo-50/80 to-blue-100/40", icon: Icons.PostgreSQL },
];

const tools: TechItem[] = [
  { name: "Claude", glowColor: "rgba(217, 119, 6, 0.22)", iconBg: "from-amber-50/80 to-orange-100/40", icon: Icons.Claude },
  { name: "Cursor", glowColor: "rgba(39, 39, 42, 0.2)", iconBg: "from-zinc-100/80 to-zinc-200/40", icon: Icons.Cursor },
  { name: "Antigravity", glowColor: "rgba(168, 85, 247, 0.22)", iconBg: "from-purple-50/80 to-indigo-100/40", icon: Icons.Antigravity },
  { name: "n8n", glowColor: "rgba(244, 63, 94, 0.22)", iconBg: "from-rose-50/80 to-red-100/40", icon: Icons.n8n },
  { name: "GitHub", glowColor: "rgba(39, 39, 42, 0.2)", iconBg: "from-zinc-100/80 to-zinc-200/40", icon: Icons.GitHub },
  { name: "VS Code", glowColor: "rgba(59, 130, 246, 0.22)", iconBg: "from-blue-50/80 to-sky-100/40", icon: Icons.VSCode },
];

/* ─── Progress Bar ─────────────────────────────────────────── */
function ProgressBar({
  barWidth,
  score,
  isInView,
  delay,
}: {
  barWidth: number;
  score: string;
  isInView: boolean;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-2.5 mt-4">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${barWidth}%` } : {}}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        className="h-[7px] bg-zinc-900 rounded-full shrink-0"
      />
      <div className="flex-1 h-[1.5px] bg-zinc-300/60 rounded-full" />
      <span className="text-[11px] font-semibold text-zinc-500 whitespace-nowrap shrink-0 tracking-wide">
        {score}
      </span>
    </div>
  );
}

/* ─── Education Card ───────────────────────────────────────── */
function EducationCard({
  item,
  index,
  isInView,
}: {
  item: (typeof educationData)[number];
  index: number;
  isInView: boolean;
}) {
  const isRight = item.side === "right";
  const animDelay = 0.25 + index * 0.2;

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 30 : -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: animDelay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/95 backdrop-blur-sm border border-zinc-200/60 rounded-2xl px-6 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] w-full max-w-[400px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] transition-shadow duration-300"
    >
      <p className="text-[11px] font-medium text-zinc-400 tracking-wide mb-1.5">
        {item.period} &bull; {item.location}
      </p>
      <h3 className="text-[15px] sm:text-base font-bold text-zinc-950 leading-snug mb-1 tracking-tight">
        {item.degree}
      </h3>
      <p className="text-[13px] text-zinc-500 leading-relaxed">{item.institution}</p>
      <ProgressBar
        barWidth={item.barWidth}
        score={item.score}
        isInView={isInView}
        delay={animDelay + 0.3}
      />
    </motion.div>
  );
}

function TimelineNode({
  index,
  isInView,
  isActive,
}: {
  index: number;
  isInView: boolean;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={isInView ? { scale: 1 } : {}}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex items-center justify-center"
    >
      <div className={`timeline-node ${isActive ? "active" : ""}`} />
    </motion.div>
  );
}

function SkillCard({ item, index, isInView }: { item: TechItem; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.92 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      whileHover={{ y: -5, scale: 1.05 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 p-2 sm:p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 transition-all duration-300 group cursor-default"
      style={{ boxShadow: `0 12px 28px -6px ${item.glowColor}, 0 2px 6px rgba(0,0,0,0.03)` }}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.iconBg} opacity-50 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none`} />
      <div className="relative z-10 flex items-center justify-center text-zinc-900 group-hover:scale-110 transition-transform duration-300">
        {item.icon}
      </div>
      <span className="relative z-10 text-[10px] sm:text-[11px] font-semibold text-zinc-600 tracking-tight mt-1.5 text-center line-clamp-1">
        {item.name}
      </span>
    </motion.div>
  );
}

/* ─── Tab Switcher ─────────────────────────────────────────── */
function TabSwitcher({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Education and Skills"
      className="relative inline-flex items-center rounded-full border border-zinc-200/80 bg-white/80 p-1 shadow-sm backdrop-blur-sm"
    >
      {([
        { key: "education", label: "Education" },
        { key: "skills", label: "Skills" },
      ] as const).map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`relative z-10 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-300 ${
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="edu-skills-tab"
                className="absolute inset-0 rounded-full bg-zinc-950"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Education Panel ──────────────────────────────────────── */
function EducationPanel({ isInView }: { isInView: boolean }) {
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const desktopNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileNodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [desktopActiveNodes, setDesktopActiveNodes] = useState<boolean[]>([false, false, false]);
  const [mobileActiveNodes, setMobileActiveNodes] = useState<boolean[]>([false, false, false]);
  const [beamPosDesktop, setBeamPosDesktop] = useState<number>(0);
  const [beamPosMobile, setBeamPosMobile] = useState<number>(0);

  useEffect(() => {
    let animFrameId: number;

    const checkProximity = (timestamp: number) => {
      const duration = 3500;
      const progress = (timestamp % duration) / duration;

      // Check Desktop
      if (desktopContainerRef.current) {
        const lineRect = desktopContainerRef.current.getBoundingClientRect();
        const beamY = (1 - progress) * (lineRect.height + 260) - 130;
        const beamCenterY = beamY + 110;
        setBeamPosDesktop(beamY);

        const newActive = educationData.map((_, i) => {
          const nodeEl = desktopNodeRefs.current[i];
          if (!nodeEl) return false;
          const nodeRect = nodeEl.getBoundingClientRect();
          const nodeY = nodeRect.top - lineRect.top + nodeRect.height / 2;
          return Math.abs(beamCenterY - nodeY) < 95;
        });

        setDesktopActiveNodes((prev) => {
          if (prev.some((val, idx) => val !== newActive[idx])) {
            return newActive;
          }
          return prev;
        });
      }

      // Check Mobile
      if (mobileContainerRef.current) {
        const lineRect = mobileContainerRef.current.getBoundingClientRect();
        const beamY = (1 - progress) * (lineRect.height + 260) - 130;
        const beamCenterY = beamY + 110;
        setBeamPosMobile(beamY);

        const newActive = educationData.map((_, i) => {
          const nodeEl = mobileNodeRefs.current[i];
          if (!nodeEl) return false;
          const nodeRect = nodeEl.getBoundingClientRect();
          const nodeY = nodeRect.top - lineRect.top + nodeRect.height / 2;
          return Math.abs(beamCenterY - nodeY) < 95;
        });

        setMobileActiveNodes((prev) => {
          if (prev.some((val, idx) => val !== newActive[idx])) {
            return newActive;
          }
          return prev;
        });
      }

      animFrameId = requestAnimationFrame(checkProximity);
    };

    animFrameId = requestAnimationFrame(checkProximity);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  return (
    <div>
      {/* Styles for Timeline Laser & Node Active States */}
      <style>{`
        .timeline-line-base {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 100%;
          background: rgba(255, 45, 45, 0.14);
          border-radius: 999px;
          overflow: hidden;
          pointer-events: none;
        }

        .timeline-line-base-mobile {
          position: absolute;
          left: 6px;
          top: 0;
          bottom: 16px;
          width: 3px;
          height: 100%;
          background: rgba(255, 45, 45, 0.14);
          border-radius: 999px;
          overflow: hidden;
          pointer-events: none;
        }

        .timeline-laser-beam {
          position: absolute;
          left: 50%;
          width: 7px;
          height: 220px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 80, 80, 0.4) 15%,
            #ff3030 45%,
            #ff0000 55%,
            rgba(255, 80, 80, 0.4) 85%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(1.5px);
          box-shadow:
            0 0 12px #ff3b3b,
            0 0 24px #ff3030,
            0 0 40px rgba(255, 0, 0, 0.5);
          will-change: transform;
        }

        .timeline-node {
          width: 18px;
          height: 18px;
          background: white;
          border: 3px solid #d8d8d8;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }

        .timeline-node.active {
          border-color: #ff2d2d;
          box-shadow:
            0 0 10px #ff4d4d,
            0 0 20px rgba(255, 0, 0, 0.5),
            0 4px 20px rgba(255, 0, 0, 0.25);
          transform: scale(1.18);
        }
      `}</style>

      {/* Desktop timeline */}
      <div ref={desktopContainerRef} className="hidden lg:block relative pb-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="timeline-line-base"
        >
          <div
            className="timeline-laser-beam"
            style={{ transform: `translate(-50%, ${beamPosDesktop}px)` }}
          />
        </motion.div>
        <div className="flex flex-col gap-10 xl:gap-12">
          {educationData.map((item, index) => {
            const isRight = item.side === "right";
            return (
              <div key={index} className="grid grid-cols-[1fr_auto_1fr] items-center gap-0">
                <div className="flex justify-end pr-8">
                  {!isRight && <EducationCard item={item} index={index} isInView={isInView} />}
                </div>
                <div
                  ref={(el) => {
                    desktopNodeRefs.current[index] = el;
                  }}
                  className="relative z-10 shrink-0"
                >
                  <TimelineNode index={index} isInView={isInView} isActive={desktopActiveNodes[index]} />
                </div>
                <div className="flex justify-start pl-8">
                  {isRight && <EducationCard item={item} index={index} isInView={isInView} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile timeline */}
      <div ref={mobileContainerRef} className="lg:hidden relative pb-4 pl-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="timeline-line-base-mobile"
        >
          <div
            className="timeline-laser-beam"
            style={{ transform: `translate(-50%, ${beamPosMobile}px)` }}
          />
        </motion.div>
        <div className="flex flex-col gap-8 pl-10">
          {educationData.map((item, index) => (
            <div key={index} className="relative">
              <div
                ref={(el) => {
                  mobileNodeRefs.current[index] = el;
                }}
                className="absolute -left-[34px] top-6"
              >
                <TimelineNode index={index} isInView={isInView} isActive={mobileActiveNodes[index]} />
              </div>
              <EducationCard item={item} index={index} isInView={isInView} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Skills Panel ─────────────────────────────────────────── */
function SkillsPanel({ isInView }: { isInView: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-3 flex flex-col gap-5"
      >
        <h3 className="text-xl sm:text-2xl font-geist font-normal text-zinc-900 tracking-tight">
          Programming Languages
        </h3>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {programmingLanguages.map((item, index) => (
            <SkillCard key={item.name} item={item} index={index} isInView={isInView} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-6 flex flex-col gap-5"
      >
        <h3 className="text-xl sm:text-2xl font-geist font-normal text-zinc-900 tracking-tight">
          Web Development
        </h3>
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-400">FRONTEND</span>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {webDevFrontend.map((item, index) => (
              <SkillCard key={item.name} item={item} index={index + 3} isInView={isInView} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-400">BACKEND</span>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {webDevBackend.map((item, index) => (
              <SkillCard key={item.name} item={item} index={index + 7} isInView={isInView} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-zinc-400">DATABASE</span>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {webDevDatabase.map((item, index) => (
              <SkillCard key={item.name} item={item} index={index + 10} isInView={isInView} />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-3 flex flex-col gap-5"
      >
        <h3 className="text-xl sm:text-2xl font-geist font-normal text-zinc-900 tracking-tight">Tools</h3>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {tools.map((item, index) => (
            <SkillCard key={item.name} item={item} index={index + 13} isInView={isInView} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Combined Education + Skills Section ──────────────────── */
export default function EducationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<TabKey>("education");

  // Open Skills tab when navigating to #skills
  useEffect(() => {
    const applyHash = () => {
      if (window.location.hash === "#skills") {
        setActiveTab("skills");
      } else if (window.location.hash === "#education") {
        setActiveTab("education");
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const hash = tab === "skills" ? "#skills" : "#education";
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  };

  return (
    <section
      id="education"
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden py-16 sm:py-24 lg:py-24"
      style={{ background: "#f8f7f5" }}
    >
      {/* Anchor for #skills deep links */}
      <div id="skills" className="absolute top-0 left-0 h-0 w-0 overflow-hidden" aria-hidden />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, transparent 38%, rgba(205,185,150,0.07) 48%, rgba(205,185,150,0.04) 56%, transparent 68%)",
          }}
        />
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-125 rounded-full opacity-30 blur-[80px]"
          style={{ background: "rgba(220,200,170,0.15)" }}
        />
      </div>

      <div className="page-shell relative z-10">
        {/* Header: title + switcher */}
        <div className="mb-8 sm:mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="select-none"
          >
            <AnimatePresence mode="wait">
              {activeTab === "education" ? (
                <motion.h2
                  key="edu-title"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="font-anton text-5xl sm:text-7xl lg:text-8xl xl:text-[7rem] uppercase leading-[0.88] tracking-tight text-fade-gradient"
                >
                  ACADEMIC
                  <br />
                  FOUNDATION
                </motion.h2>
              ) : (
                <motion.h2
                  key="skills-title"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-none"
                >
                  <span className="font-geist font-extrabold text-zinc-950">Technology &amp; </span>
                  <span className="font-serif italic font-light text-zinc-400">Mastery</span>
                </motion.h2>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="shrink-0 self-start sm:self-end"
          >
            <TabSwitcher active={activeTab} onChange={handleTabChange} />
          </motion.div>
        </div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          {activeTab === "education" ? (
            <motion.div
              key="education-panel"
              role="tabpanel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <EducationPanel isInView={isInView} />
            </motion.div>
          ) : (
            <motion.div
              key="skills-panel"
              role="tabpanel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <SkillsPanel isInView={isInView} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
