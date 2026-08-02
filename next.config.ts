import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization for external domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stone-expand-60400629.figma.site",
      },
      {
        protocol: "https",
        hostname: "db.onlinewebfonts.com",
      },
    ],
  },

  // Turbopack enabled by default in Next.js 15
  // No additional config needed

  // Strict mode for catching issues early
  reactStrictMode: true,
};

export default nextConfig;
