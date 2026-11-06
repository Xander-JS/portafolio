"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";
import { Vector3, type Group } from "three";
import { useScrollStore } from "@/lib/useScrollStore";

// Tech Red (NestJS-ish crimson), tuned per theme so the glow reads on both black and white grounds.
const TECH_RED = { light: "#dc2626", dark: "#f04359" };

// Build a graph once: circular sphere nodes plus thin lines joining each node to its few nearest neighbours.
function useGraph() {
  return useMemo(() => {
    const N = 48;
    const nodes: Vector3[] = [];
    for (let i = 0; i < N; i++) nodes.push(new Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4));

    const seg: number[] = [];
    nodes.forEach((a, i) => {
      nodes
        .map((b, j) => ({ j, d: a.distanceTo(b) }))
        .filter((o) => o.j > i && o.d < 2.3) // j>i: each edge once
        .sort((x, y) => x.d - y.d)
        .slice(0, 3)
        .forEach(({ j }) => seg.push(a.x, a.y, a.z, nodes[j].x, nodes[j].y, nodes[j].z));
    });
    return { nodes, lines: new Float32Array(seg) };
  }, []);
}

/**
 * Placeholder volumetric node network. This is where the per-section BufferGeometry morphing lands later (the
 * targets: MAI monogram, ER graph, neural net, project clusters, git pipeline, orbit mesh, broadcast node). For now
 * it is a static graph that rotates with scroll progress, so z-layering, theming and the circles-and-lines look are
 * verifiable. Offset right so the left-side content has room.
 */
function NodeGraph({ color }: { color: string }) {
  const group = useRef<Group>(null);
  const { nodes, lines } = useGraph();

  useFrame((_, delta) => {
    const { progress } = useScrollStore.getState(); // read imperatively: no React re-render per frame
    if (group.current) {
      group.current.rotation.y = progress * Math.PI * 2;
      group.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={group} position={[1.4, 0, 0]}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.28} />
      </lineSegments>
    </group>
  );
}

/** The full-screen fixed 3D background (z-index 0). Mounted client-only (no SSR) by the template. */
export function Scene() {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "dark" ? TECH_RED.dark : TECH_RED.light;

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 55 }} dpr={[1, 2]}>
      <NodeGraph color={color} />
    </Canvas>
  );
}
