"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  InstancedMesh,
  MathUtils,
  Mesh,
  Object3D,
  PointLight,
  Vector3,
} from "three";
import { STEP_COUNT, steps } from "@/data/steps";
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
  onSelectHref,
}: {
  palette: typeof THEME_PALETTES.dark;
  onSelectHref: (href: string) => void;
}) {
  const activeIndex = useScrollStore((s) => s.index);

  const { viewport, gl } = useThree();
  const aspect = viewport.aspect || 1.77;

  // One-way adaptive quality: if the average frame time stays slow for a sustained window,
  // drop the drawing-buffer pixel ratio to 1x once. Cheap, never ramps back up, so it can't oscillate.
  const perfRef = useRef({ acc: 0, count: 0, regressed: false });

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

  // Reset pointer cursor when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

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
    instancedRef.current.computeBoundingSphere();
  }, [graph.ambientNodes]);

  useFrame((state, delta) => {
    const { progress, isWarping } = useScrollStore.getState();

    // Sustained-slowness detection → single pixel-ratio regression to protect the frame rate.
    // Ignore abnormal frames (>100ms): tab-resume clock jumps and one-off hitches aren't sustained load.
    const perf = perfRef.current;
    if (!perf.regressed && delta < 0.1) {
      perf.acc += delta;
      perf.count += 1;
      if (perf.count >= 90) {
        const avgDelta = perf.acc / perf.count;
        if (avgDelta > 1 / 45 && gl.getPixelRatio() > 1) {
          gl.setPixelRatio(1);
          perf.regressed = true;
        }
        perf.acc = 0;
        perf.count = 0;
      }
    }

    // Smooth scroll inertia with delta damping
    smoothProgress.current = MathUtils.damp(
      smoothProgress.current,
      progress,
      4.0,
      delta
    );

    const clampedProgress = MathUtils.clamp(smoothProgress.current, 0, 1);

    // Compute target camera waypoint and look-at point from 3D curves
    const targetCam = graph.camCurve.getPoint(clampedProgress);
    const targetLook = graph.targetCurve.getPoint(clampedProgress);

    // Idle organic breathing (subtle zero-g float)
    const time = state.clock.getElapsedTime();
    const idleX = Math.sin(time * 0.7) * 0.1;
    const idleY = Math.cos(time * 0.5) * 0.08;

    const stepFloat = smoothProgress.current * (STEP_COUNT - 1);
    const activeIdx = Math.max(0, Math.min(STEP_COUNT - 1, Math.round(stepFloat)));
    const activePos = graph.milestones[activeIdx];

    if (isWarping && activePos) {
      // Rapid cinematic acceleration towards the active milestone
      camPos.current.lerp(activePos, Math.min(1, delta * 11.0));
      lookAtPos.current.lerp(activePos, Math.min(1, delta * 13.0));
    } else {
      camPos.current.lerp(targetCam, Math.min(1, delta * 5.5));
      lookAtPos.current.lerp(targetLook, Math.min(1, delta * 5.5));
    }

    state.camera.position.set(
      camPos.current.x + idleX,
      camPos.current.y + idleY,
      camPos.current.z
    );
    state.camera.lookAt(lookAtPos.current);

    // Milestone focus animation: breathing & flickering of the node itself
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

      {/* Milestone Nodes along the spine with interactive proxy for active navigable module nodes */}
      {graph.milestones.map((pos, i) => {
        const href = steps[i]?.href;
        const isActive = i === activeIndex;

        return (
          <group key={`milestone-${i}`} position={pos}>
            <mesh
              ref={(el) => {
                coreRefs.current[i] = el;
              }}
            >
              <sphereGeometry args={[0.14, 24, 24]} />
              <meshBasicMaterial color={palette.node} />
            </mesh>

            {/* Generous raycast hit proxy for the active interactive node */}
            {Boolean(href) && isActive && (
              <mesh
                visible={false}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                  document.body.style.cursor = "auto";
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (href) {
                    onSelectHref(href);
                  }
                }}
              >
                <sphereGeometry args={[0.7, 12, 12]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>
            )}
          </group>
        );
      })}

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
        frustumCulled={false}
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

/**
 * Picks a render quality tier once per device so phones and low-power machines don't pay for a
 * high pixel ratio + MSAA they can't sustain, while desktops keep the crisp look.
 * - Desktop: up to 2x pixel ratio, antialiasing on.
 * - Mobile / low-power: capped at 1.5x, antialiasing off (the biggest mobile GPU saving).
 */
function getDeviceTier(): { dpr: [number, number]; antialias: boolean } {
  if (typeof window === "undefined") return { dpr: [1, 2], antialias: true };
  // Touch pointer + small viewport reliably identify phones/tablets. navigator.deviceMemory is intentionally
  // left out: Chrome reports it coarsely (capped, often 4 on capable desktops) so it wrongly downgrades them.
  // The one-way adaptive regression in Constellation is the safety net for any device that still runs slow.
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const smallViewport = window.innerWidth < 768;
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const lowPower = coarsePointer || smallViewport || lowCores;
  return lowPower ? { dpr: [1, 1.5], antialias: false } : { dpr: [1, 2], antialias: true };
}

/** The full-screen fixed 3D background (z-index 0). Mounted client-only (no SSR) by the template. */
export function Scene() {
  const router = useRouter();
  const setWarping = useScrollStore((s) => s.setWarping);
  const { resolvedTheme } = useTheme();
  const palette = resolvedTheme === "light" ? THEME_PALETTES.light : THEME_PALETTES.dark;
  const [canvasKey, setCanvasKey] = useState(0);
  const isFirstMount = useRef(true);

  // Device render tier chosen once on the client (never during SSR).
  const [tier] = useState(getDeviceTier);

  // Stop rendering entirely while the tab is hidden; resume on return. Saves GPU/battery in the background.
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  useEffect(() => {
    const onVisibility = () => setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Next.js 16 <Activity> keeps this component mounted while running effect cleanups on route leave,
  // which triggers R3F's unmountComponentAtNode(canvas) and forceContextLoss(). Incrementing the key
  // when returning to Home mounts a fresh Canvas and WebGL context.
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setCanvasKey((k) => k + 1);
  }, []);

  const handleSelectHref = (href: string) => {
    document.body.style.cursor = "auto";
    setWarping(true);
    setTimeout(() => {
      router.push(href);
    }, 280);
  };

  return (
    <Canvas
      key={canvasKey}
      frameloop={frameloop}
      camera={{ position: [0, 0, 10], fov: 50 }}
      dpr={tier.dpr}
      gl={{ antialias: tier.antialias, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
    >
      <Constellation palette={palette} onSelectHref={handleSelectHref} />
    </Canvas>
  );
}
