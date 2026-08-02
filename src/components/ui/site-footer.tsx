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
            <div className="lg:col-span-4">
              <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none">
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
                    href="https://NITHISH0728.github.io/"
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
                  <span>25 Ashmitha Garden<br />Chengalpattu 603101.</span>
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
