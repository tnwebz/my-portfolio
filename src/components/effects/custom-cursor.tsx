"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    // Center positioning helpers
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    // GSAP quickSetters for 60fps performance
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setRingX = gsap.quickSetter(ring, "x", "px");
    const setRingY = gsap.quickSetter(ring, "y", "px");
    const setGlowX = gsap.quickSetter(glow, "x", "px");
    const setGlowY = gsap.quickSetter(glow, "y", "px");

    let magneticTarget: HTMLElement | null = null;
    let magneticBounds: DOMRect | null = null;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (isHidden) setIsHidden(false);

      // Check magnetic element targeting
      const target = (e.target as HTMLElement).closest("[data-magnetic]") as HTMLElement | null;
      if (target) {
        magneticTarget = target;
        magneticBounds = target.getBoundingClientRect();
      } else {
        magneticTarget = null;
        magneticBounds = null;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setIsHidden(true);
    const onMouseEnter = () => setIsHidden(false);

    // Track interactive hovers (links, buttons, inputs)
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.getAttribute("role") === "button" ||
        target.hasAttribute("data-cursor") ||
        target.hasAttribute("data-magnetic");

      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Render loop with lerp
    let animationFrameId: number;

    const render = () => {
      let targetX = mouse.x;
      let targetY = mouse.y;

      // Handle magnetic pull
      if (magneticTarget && magneticBounds) {
        const centerX = magneticBounds.left + magneticBounds.width / 2;
        const centerY = magneticBounds.top + magneticBounds.height / 2;
        const distanceX = mouse.x - centerX;
        const distanceY = mouse.y - centerY;

        targetX = centerX + distanceX * 0.35;
        targetY = centerY + distanceY * 0.35;

        // Optionally pull element slightly
        gsap.to(magneticTarget, {
          x: distanceX * 0.2,
          y: distanceY * 0.2,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      // Smooth lerp for dot & ring
      pos.x += (targetX - pos.x) * 0.2;
      pos.y += (targetY - pos.y) * 0.2;

      setDotX(mouse.x);
      setDotY(mouse.y);

      setRingX(pos.x);
      setRingY(pos.y);

      setGlowX(pos.x);
      setGlowY(pos.y);

      // Reset non-hovered magnetic targets
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        if (el !== magneticTarget) {
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power2.out" });
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHidden]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Soft ambient light following cursor */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none z-30 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, rgba(239,68,68,0) 70%)",
          opacity: isHidden ? 0 : 1,
        }}
      />

      {/* Main Cursor Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-950 rounded-full pointer-events-none z-[9999] transition-transform duration-150 ${
          isHidden ? "opacity-0" : "opacity-100"
        } ${isClicking ? "scale-50" : "scale-100"}`}
      />

      {/* Outer Cursor Ring */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[9998] transition-all duration-300 ${
          isHidden ? "opacity-0 scale-0" : "opacity-100"
        } ${
          isHovered
            ? "w-14 h-14 bg-zinc-950/90 mix-blend-difference border-none scale-100"
            : "w-10 h-10 border border-zinc-950/40 bg-transparent scale-100"
        } ${isClicking ? "scale-75" : ""}`}
      />
    </>
  );
}
