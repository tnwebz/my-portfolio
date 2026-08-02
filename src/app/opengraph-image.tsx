import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Nithish S S — Senior Developer & Architect";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Radial Glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(9, 9, 11, 0) 70%)",
          }}
        />

        {/* Top Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "20px",
            color: "#ef4444",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />
          Portfolio & Architectural Showcase
        </div>

        {/* Hero Name & Titles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
              background: "linear-gradient(to right, #ffffff, #a1a1aa)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            NITHISH S S
          </h1>
          <p
            style={{
              fontSize: "32px",
              color: "#a1a1aa",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Senior Developer · Architect · UI/UX Specialist
          </p>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "32px",
            color: "#71717a",
            fontSize: "20px",
          }}
        >
          <div>nithish.dev</div>
          <div>Chennai, India</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
