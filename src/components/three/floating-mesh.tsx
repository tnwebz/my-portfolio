"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const { mouse } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current || !wireframeRef.current) return;

    // Constant slow rotational motion
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.2;

    wireframeRef.current.rotation.x += delta * 0.15;
    wireframeRef.current.rotation.y += delta * 0.2;

    // Smooth rotation lerp towards mouse position
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouse.y * 0.5,
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouse.x * 0.5,
      0.05
    );
  });

  return (
    <group position={[2.5, 0, 0]}>
      {/* Core Dark Mesh */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color="#050505"
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Outer Laser Red Wireframe Line Grid */}
      <lineSegments ref={wireframeRef}>
        <wireframeGeometry args={[new THREE.IcosahedronGeometry(1.82, 1)]} />
        <lineBasicMaterial color="#ef4444" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}
