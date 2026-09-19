"use client";

import { Phone, Mail, Linkedin, Github, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export default function SiteFooter() {
  const { contact } = siteConfig;

  return (
    <footer id="contact" className="w-full bg-white pb-8 pt-2 text-white">
      <div className="page-shell">
        {/* Dark Container Box */}
        <div className="bg-black rounded-3xl p-6 sm:p-8 lg:p-10 border border-zinc-900 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Brand Title */}
            <div className="lg:col-span-4 relative group select-none">
              {/* Laser ambient radiance blur */}
              <div
                className="pointer-events-none absolute -top-8 -left-8 w-72 h-36 bg-[radial-gradient(ellipse_at_center,rgba(255,23,68,0.22)_0%,rgba(255,0,60,0.06)_45%,transparent_70%)] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 rounded-full"
                aria-hidden="true"
              />
              <h2 className="relative z-10 font-anton text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-laser-glow leading-none inline-block cursor-default transition-transform duration-300 group-hover:scale-[1.01]">
                NITHISH S S
              </h2>
            </div>

            {/* Right Contact Info Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* CONTACT */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                  CONTACT
                </h3>
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    <Phone size={14} className="shrink-0 text-zinc-400" />
                    <span>{contact.phone}</span>
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors break-all"
                  >
                    <Mail size={14} className="shrink-0 text-zinc-400" />
                    <span>{contact.email}</span>
                  </a>
                </div>
              </div>

              {/* SOCIAL */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                  SOCIAL
                </h3>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://www.linkedin.com/in/nithish-s-s-81a0212a5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors break-all"
                  >
                    <Linkedin size={14} className="shrink-0 text-zinc-400" />
                    <span>LinkedIn Profile</span>
                  </a>
                  <a
                    href="https://github.com/NITHISH0728"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors break-all"
                  >
                    <Github size={14} className="shrink-0 text-zinc-400" />
                    <span>GitHub Profile</span>
                  </a>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                  ADDRESS
                </h3>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-zinc-400" />
                  <span>
                    25 Ashmitha Garden
                    <br />
                    Chengalpattu 603101.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar inside dark container */}
          <div className="mt-10 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-3">
            <p>© 2026 Nithish S S. All rights reserved.</p>
            <a href="#top" className="hover:text-white transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
