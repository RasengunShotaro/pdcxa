import {
  adaptFrameLoad,
  advanceMode,
  computeRenderSize,
  easePointer,
  frameInterval,
  isFrameDue,
  MOTION,
  needsResize,
  nextRenderScale,
  type Point,
  packAtmosphereUniforms,
  packCloudUniforms,
  packFrameUniforms,
  pointerParallax,
  type RenderSize,
  resolveMotion,
  SKY_OVERSCAN,
  type SkyMotion,
  sceneTime,
} from "./sky-frame";
import {
  advanceCloudFade,
  advanceProgress,
  blendOf,
  blendTurns,
  CLOUD_COLUMN_COUNT,
  columnRect,
  computeAtmosphereSize,
  computeCloudLayerSize,
  initialLayerRoles,
  isColumnDue,
  isSnapshotComplete,
  type LayerRoles,
  type LayerSize,
  rotateLayerRoles,
  type SnapshotProgress,
  snapshotPose,
} from "./sky-layers";
import { createSkyRenderer, type SkyRenderer } from "./sky-renderer";

const MAX_FRAME_DELTA_MS = 250;
const FIRST_SNAPSHOT_COLUMNS_PER_FRAME = 1;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const NO_OFFSET: Point = { x: 0, y: 0 };
const START: SnapshotProgress = { column: 0, frame: 0 };

export type SkyBackend = "webgl2" | "css";

export interface SkyScene {
  readonly backend: SkyBackend;
  readonly destroy: () => void;
}

interface StartSkySceneInput {
  readonly host: HTMLElement;
  readonly canvasClassName: string;
}

interface SceneState {
  renderer: SkyRenderer | null;
  prepared: boolean;
  mode: number;
  elapsedMs: number;
  lastFrameAt: number;
  load: number;
  scale: number;
  drewLastTick: boolean;
  frame: number;
  dirty: boolean;
  destroyed: boolean;
  renderSize: RenderSize | null;
  cloudSource: RenderSize | null;
  layerSize: LayerSize | null;
  cloudDetail: number;
  roles: LayerRoles;
  snapshot: number;
  progress: SnapshotProgress;
  completedSnapshots: number;
  cloudFade: number;
  pointer: Point;
  pointerTarget: Point;
}

export const startSkyScene = ({
  host,
  canvasClassName,
}: StartSkySceneInput): SkyScene => {
  const canvas = document.createElement("canvas");
  canvas.className = canvasClassName;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  const firstRenderer = createSkyRenderer(canvas);
  if (!firstRenderer) {
    canvas.remove();
    return { backend: "css", destroy: () => undefined };
  }

  const root = document.documentElement;
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  const readMotion = (): SkyMotion =>
    resolveMotion({
      reduceMotion:
        reducedMotion.matches || root.classList.contains("reduce-motion"),
      reduceTransparency: root.classList.contains("reduce-transparency"),
    });
  const readTarget = (): number => (root.classList.contains("dark") ? 1 : 0);

  const state: SceneState = {
    renderer: firstRenderer,
    prepared: false,
    mode: readTarget(),
    elapsedMs: 0,
    lastFrameAt: 0,
    load: 1,
    scale: 1,
    drewLastTick: false,
    frame: 0,
    dirty: true,
    destroyed: false,
    renderSize: null,
    cloudSource: null,
    layerSize: null,
    cloudDetail: 1,
    roles: initialLayerRoles(),
    snapshot: 0,
    progress: START,
    completedSnapshots: 0,
    cloudFade: 0,
    pointer: NO_OFFSET,
    pointerTarget: NO_OFFSET,
  };

  const cloudsVisible = (): boolean => state.mode < 1 || readTarget() < 1;

  const awaitingFirstSnapshot = (): boolean =>
    cloudsVisible() &&
    state.layerSize !== null &&
    state.completedSnapshots === 0;

  const fitToWindow = (renderer: SkyRenderer): RenderSize => {
    const wanted = computeRenderSize({
      cssWidth: window.innerWidth,
      cssHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio,
    });
    const sameCanvas =
      state.renderSize?.width === wanted.width &&
      state.renderSize.height === wanted.height;
    const keepClouds =
      state.cloudDetail === state.scale &&
      !needsResize({ current: state.cloudSource, next: wanted });
    if (sameCanvas && keepClouds) return wanted;
    if (!sameCanvas) {
      canvas.width = wanted.width;
      canvas.height = wanted.height;
      const atmosphereSize = computeAtmosphereSize(wanted);
      const baked = renderer.resizeAtmosphere({
        atmosphereSize,
        atmosphereUniforms: packAtmosphereUniforms({
          size: atmosphereSize,
          viewAspect: wanted.width / wanted.height,
        }),
      });
      state.renderSize = wanted;
      if (!baked) state.layerSize = null;
    }
    if (keepClouds) return wanted;
    state.cloudDetail = state.scale;
    state.cloudSource = wanted;
    const layerSize = computeCloudLayerSize({
      renderSize: wanted,
      pixelRatio: wanted.width / Math.max(1, window.innerWidth),
      overscan: SKY_OVERSCAN,
      detail: state.cloudDetail,
    });
    const ready = renderer.resizeCloudLayers(layerSize);
    state.layerSize = ready ? layerSize : null;
    state.roles = initialLayerRoles();
    state.progress = START;
    state.completedSnapshots = 0;
    state.cloudFade = 0;
    return wanted;
  };

  const drawCloudColumns = ({
    renderer,
    renderSize,
    layerSize,
    count,
  }: {
    readonly renderer: SkyRenderer;
    readonly renderSize: RenderSize;
    readonly layerSize: LayerSize;
    readonly count: number;
  }): void => {
    const pose = snapshotPose({
      snapshot: state.snapshot,
      panRadiansPerSecond: MOTION.panRadiansPerSecond,
    });
    const uniforms = packCloudUniforms({
      layerSize,
      viewAspect: renderSize.width / renderSize.height,
      time: pose.time,
      pan: pose.pan,
    });
    const first = state.progress.column;
    const last = Math.min(CLOUD_COLUMN_COUNT, first + count);
    for (let index = first; index < last; index += 1) {
      renderer.renderCloudColumn({
        layer: state.roles.work,
        column: columnRect({ index, width: layerSize.width }),
        uniforms,
      });
    }
  };

  const finishSnapshot = (): void => {
    state.roles = rotateLayerRoles({
      roles: state.roles,
      completedSnapshots: state.completedSnapshots,
    });
    state.completedSnapshots += 1;
    state.snapshot += 1;
    state.progress = START;
  };

  const advanceClouds = ({
    renderer,
    renderSize,
    layerSize,
  }: {
    readonly renderer: SkyRenderer;
    readonly renderSize: RenderSize;
    readonly layerSize: LayerSize;
  }): void => {
    if (state.completedSnapshots === 0) {
      const count = FIRST_SNAPSHOT_COLUMNS_PER_FRAME;
      drawCloudColumns({ renderer, renderSize, layerSize, count });
      state.progress = { column: state.progress.column + count, frame: 0 };
    } else {
      if (isColumnDue(state.progress)) {
        drawCloudColumns({ renderer, renderSize, layerSize, count: 1 });
      }
      state.progress = advanceProgress(state.progress);
    }
    if (isSnapshotComplete(state.progress)) finishSnapshot();
  };

  const draw = (now: number): void => {
    const renderer = state.renderer;
    if (!renderer) return;
    const motion = readMotion();
    const target = readTarget();
    const deltaMs = Math.min(MAX_FRAME_DELTA_MS, now - state.lastFrameAt);
    state.lastFrameAt = now;
    state.mode =
      motion === "animate"
        ? advanceMode({ current: state.mode, target, deltaMs })
        : target;
    if (motion === "animate") state.elapsedMs += deltaMs;
    state.pointer =
      motion === "animate"
        ? easePointer({
            current: state.pointer,
            target: state.pointerTarget,
            deltaMs,
          })
        : NO_OFFSET;

    const renderSize = fitToWindow(renderer);
    const layerSize = state.layerSize;
    const first = state.completedSnapshots === 0;
    if (layerSize && cloudsVisible() && (first || motion === "animate")) {
      advanceClouds({ renderer, renderSize, layerSize });
    }
    if (state.completedSnapshots > 0) {
      state.cloudFade =
        motion === "animate"
          ? advanceCloudFade({ current: state.cloudFade, deltaMs })
          : 1;
    }

    const hasMotion = state.roles.previous !== state.roles.next;
    const blend = hasMotion ? blendOf(state.progress) : 0;
    const turns = blendTurns({
      blend,
      hasMotion,
      panRadiansPerSecond: MOTION.panRadiansPerSecond,
    });
    renderer.renderFrame({
      uniforms: packFrameUniforms({
        size: renderSize,
        time: sceneTime({ motion, elapsedSeconds: state.elapsedMs / 1000 }),
        mode: state.mode,
        pixelRatio: renderSize.width / Math.max(1, window.innerWidth),
        blend,
        cloudFade: state.cloudFade,
        turnToPrevious: turns.toPrevious,
        turnToNext: turns.toNext,
        pointer: state.pointer,
      }),
      previousLayer: state.roles.previous,
      nextLayer: state.roles.next,
    });
    state.dirty = false;
    canvas.dataset.ready = "true";
  };

  const needsFrame = (): boolean => {
    if (state.destroyed || document.hidden || !state.renderer) return false;
    const motion = readMotion();
    if (motion === "off") return false;
    return (
      !state.prepared ||
      motion === "animate" ||
      state.dirty ||
      state.mode !== readTarget() ||
      awaitingFirstSnapshot() ||
      (state.completedSnapshots > 0 && state.cloudFade < 1)
    );
  };

  const schedule = (): void => {
    if (state.frame !== 0 || !needsFrame()) return;
    state.frame = requestAnimationFrame(tick);
  };

  const tick = (now: number): void => {
    state.frame = 0;
    if (state.destroyed) return;
    if (state.renderer && !state.prepared) {
      state.prepared = state.renderer.prepare();
      state.lastFrameAt = now;
      schedule();
      return;
    }
    if (state.drewLastTick && !awaitingFirstSnapshot()) {
      const load = adaptFrameLoad({
        load: state.load,
        gapAfterDrawMs: now - state.lastFrameAt,
      });
      const adapted = cloudsVisible()
        ? nextRenderScale({ scale: state.scale, load })
        : { scale: state.scale, load };
      state.load = adapted.load;
      state.scale = adapted.scale;
    }
    state.drewLastTick =
      state.dirty ||
      state.mode !== readTarget() ||
      awaitingFirstSnapshot() ||
      isFrameDue({
        now,
        lastFrameAt: state.lastFrameAt,
        intervalMs: frameInterval({ mode: state.mode, load: state.load }),
      });
    if (state.drewLastTick) draw(now);
    schedule();
  };

  const invalidate = (): void => {
    state.dirty = true;
    state.drewLastTick = false;
    schedule();
  };

  const handlePointerMove = (event: PointerEvent): void => {
    state.pointerTarget = pointerParallax({
      x: event.clientX / Math.max(1, window.innerWidth),
      y: event.clientY / Math.max(1, window.innerHeight),
    });
  };

  const handleContextLost = (event: Event): void => {
    event.preventDefault();
    state.renderer = null;
    delete canvas.dataset.ready;
  };

  const handleContextRestored = (): void => {
    state.renderer = createSkyRenderer(canvas);
    state.prepared = false;
    state.renderSize = null;
    state.cloudSource = null;
    state.layerSize = null;
    invalidate();
  };

  const classObserver = new MutationObserver(invalidate);
  classObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
  reducedMotion.addEventListener("change", invalidate);
  window.addEventListener("resize", invalidate);
  document.addEventListener("visibilitychange", invalidate);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);
  schedule();

  return {
    backend: "webgl2",
    destroy: () => {
      if (state.destroyed) return;
      state.destroyed = true;
      cancelAnimationFrame(state.frame);
      classObserver.disconnect();
      reducedMotion.removeEventListener("change", invalidate);
      window.removeEventListener("resize", invalidate);
      document.removeEventListener("visibilitychange", invalidate);
      window.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      state.renderer?.destroy();
      canvas.remove();
    },
  };
};
