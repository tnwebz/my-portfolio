"use client";

import { Canvas } from "@react-three/fiber";
import FloatingMesh from "./floating-mesh";

export default function ThreeCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block overflow-hidden opacity-70">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ef4444" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#efeee9" />
        <FloatingMesh />
      </Canvas>
    </div>
  );
}
