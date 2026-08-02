"use client";

import dynamic from "next/dynamic";

export const ThreeCanvas = dynamic(() => import("./three-canvas"), {
  ssr: false,
});

export { default as FloatingMesh } from "./floating-mesh";
