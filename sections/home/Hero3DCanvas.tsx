"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float, Center, Resize } from "@react-three/drei";
import * as THREE from "three";

function CompressedShirtModel() {
  const { scene } = useGLTF("/models/shirt.glb", true);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          materials.forEach((mat) => {
            mat.side = THREE.DoubleSide;
          });
        }
      }
    });
  }, [clonedScene]);

  return (
    /* Increased scale from 2.3 to 4.8 to fill the card bounds */
    <Resize scale={4.8}>
      <Center position={[0, 0.1, 0]}>
        <primitive object={clonedScene} rotation={[0, Math.PI, 0]} />
      </Center>
    </Resize>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="relative h-full w-full min-h-[360px] cursor-grab active:cursor-grabbing">
      <Canvas
        /* Brought camera closer to Z = 5.5 */
        camera={{ position: [0, 0, 5.5], fov: 40 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
          });
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 7]} intensity={2.2} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#C89B3C" />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <CompressedShirtModel />
          </Float>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={1.8}
          rotateSpeed={0.8}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}