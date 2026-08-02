"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Hook to detect if an element is in the viewport
 * Used for scroll-triggered animations
 */
export function useInView(
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(element); // Only trigger once
      }
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

/**
 * Hook to track mouse position (for cursor effects, parallax, etc.)
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return position;
}

function subscribeWindowSize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

const emptyWindowSize = { width: 0, height: 0 };

function getWindowSizeSnapshot() {
  return { width: window.innerWidth, height: window.innerHeight };
}

function getWindowSizeServerSnapshot() {
  return emptyWindowSize;
}

/**
 * Hook to get window dimensions (responsive breakpoint logic)
 */
export function useWindowSize() {
  return useSyncExternalStore(
    subscribeWindowSize,
    getWindowSizeSnapshot,
    getWindowSizeServerSnapshot
  );
}
