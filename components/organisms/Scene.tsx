"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef } from "react";
import {
  InstancedMesh,
  MathUtils,
  Mesh,
  Object3D,
  PointLight,
  Vector3,
} from "three";
import { STEP_COUNT } from "@/data/steps";
import { createGraphData } from "@/lib/sceneGraph";
import { useScrollStore } from "@/lib/useScrollStore";

const THEME_PALETTES = {
  dark: {
    bg: "#050507",
    node: "#f04359",
    active: "#ff6b81",
    halo: "#ff3b57",
    fog: "#050507",
  },
  light: {
    bg: "#eeeef1",
    node: "#dc2626",
    active: "#991b1b",
    halo: "#ef4444",
    fog: "#eeeef1",
  },
};

/**
 * 3D Constellation & Camera Journey.
 *
 * - Enveloping cylindrical distribution: keeps the central forward line of sight open, preventing depth clumping.
 * - Guaranteed minimum spacing between nodes (Poisson-disk rejection sampling) so nodes never bunch up.
 * - Section-calibrated depth fog that softly reveals the active and upcoming section while keeping the horizon clean.
 * - Focused milestone breathes organically with subtle harmonic titileo on the node itself.
 */
function Constellation({
  palette,
}: {
  palette: typeof THEME_PALETTES.dark;
}) {
  const { viewport } = useThree();
  const aspect = viewport.aspect || 1.77;

  // Responsive horizontal adaptation: adapts spread gracefully for portrait / mobile
  const rawFactor = Math.min(1.0, Math.max(0.38, aspect / 1.6));
  const horizontalFactor = Math.round(rawFactor * 20) / 20;

  const graph = useMemo(() => createGraphData(horizontalFactor), [horizontalFactor]);

  const instancedRef = useRef<InstancedMesh>(null);
  const coreRefs = useRef<(Mesh | null)[]>([]);
  const lightRef = useRef<PointLight>(null);

  // Smooth camera tracking refs
  const smoothProgress = useRef(0);
  const camPos = useRef(new Vector3().copy(graph.camCurve.getPoint(0)));
  const lookAtPos = useRef(new Vector3().copy(graph.targetCurve.getPoint(0)));

  // Populate instanced ambient nodes once per graph generation
  useEffect(() => {
    if (!instancedRef.current) return;
    const dummy = new Object3D();
    graph.ambientNodes.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.scale.setScalar(0.065);
      dummy.updateMatrix();
      instancedRef.current!.setMatrixAt(i, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [graph.ambientNodes]);

  useFrame((state, delta) => {
    const { progress } = useScrollStore.getState();

    // Smooth scroll inertia with delta damping
    smoothProgress.current = MathUtils.damp(
      smoothProgress.current,
      progress,
      4.0,
      delta
    );

    // Compute target camera waypoint and look-at point from 3D curves
    const targetCam = graph.camCurve.getPoint(smoothProgress.current);
    const targetLook = graph.targetCurve.getPoint(smoothProgress.current);

    // Idle organic breathing (subtle zero-g float)
    const time = state.clock.getElapsedTime();
    const idleX = Math.sin(time * 0.7) * 0.1;
    const idleY = Math.cos(time * 0.5) * 0.08;

    // Smoothly damp camera position and gaze target
    camPos.current.lerp(targetCam, Math.min(1, delta * 5.5));
    lookAtPos.current.lerp(targetLook, Math.min(1, delta * 5.5));

    state.camera.position.set(
      camPos.current.x + idleX,
      camPos.current.y + idleY,
      camPos.current.z
    );
    state.camera.lookAt(lookAtPos.current);

    // Milestone focus animation: breathing & flickering of the node itself
    const stepFloat = smoothProgress.current * (STEP_COUNT - 1);

    graph.milestones.forEach((_, i) => {
      const dist = Math.abs(stepFloat - i);
      const activation = Math.max(0, 1 - dist * 1.35);

      const core = coreRefs.current[i];
      if (core) {
        if (activation > 0.01) {
          // Smooth breathing wave [0..1]
          const breath = Math.sin(time * 3.2) * 0.5 + 0.5;
          // Subtle harmonic titileo
          const flicker = Math.sin(time * 8.0) * 0.08 * breath;
          // Scale node up and down organically
          const coreScale = 1.0 + activation * (0.65 * breath + flicker);
          core.scale.setScalar(coreScale);
        } else {
          core.scale.setScalar(1.0);
        }
      }
    });

    // Soft point light follows active milestone position
    const activeIdx = Math.max(0, Math.min(STEP_COUNT - 1, Math.round(stepFloat)));
    const activePos = graph.milestones[activeIdx];
    if (lightRef.current && activePos) {
      lightRef.current.position.lerp(activePos, Math.min(1, delta * 6));
      const activeActivation = Math.max(0, 1 - Math.abs(stepFloat - activeIdx) * 1.35);
      lightRef.current.intensity = 1.0 + 3.0 * activeActivation;
    }
  });

  return (
    <>
      {/* Calibrated distance fog: keeps the immediate and next section visible while preventing distant background clumps */}
      <fog attach="fog" args={[palette.fog, 6, 26]} />

      <pointLight
        ref={lightRef}
        color={palette.halo}
        intensity={2}
        distance={12}
        decay={2}
      />

      {/* 7 Milestone Nodes along the spine (single node with pure breathing animation) */}
      {graph.milestones.map((pos, i) => (
        <mesh
          key={`milestone-${i}`}
          ref={(el) => {
            coreRefs.current[i] = el;
          }}
          position={pos}
        >
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshBasicMaterial color={palette.node} />
        </mesh>
      ))}

      {/* Backbone line connecting milestones */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[graph.backboneLines, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.active}
          transparent
          opacity={0.42}
        />
      </lineSegments>

      {/* Ambient constellation lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[graph.ambientLines, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.node}
          transparent
          opacity={0.18}
        />
      </lineSegments>

      {/* Ambient nodes rendered in a single high-performance draw call */}
      <instancedMesh
        ref={instancedRef}
        args={[undefined, undefined, graph.ambientNodes.length]}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color={palette.node}
          transparent
          opacity={0.65}
        />
      </instancedMesh>
    </>
  );
}

/** The full-screen fixed 3D background (z-index 0). Mounted client-only (no SSR) by the template. */
export function Scene() {
  const { resolvedTheme } = useTheme();
  const palette = resolvedTheme === "light" ? THEME_PALETTES.light : THEME_PALETTES.dark;

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Constellation palette={palette} />
    </Canvas>
  );
}
