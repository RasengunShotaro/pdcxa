import {
  DROPLET_HOST_ATTRIBUTE,
  LOGIN_SCENE_FREEZE_EVENT,
  LOGIN_SCENE_MELT_EVENT,
} from "../../transition/scene-freeze";
import {
  type StageSize,
  type Vec2,
  描画の解像度を決める,
  画面の点を描画の座標にする,
  雫の配置を決める,
} from "./droplet-motion";
import type { BackdropPhoto } from "./droplet-photos";
import { type DropletRenderer, 雫の描画器を作る } from "./droplet-renderer";
import {
  type SceneState,
  場面をユニフォームに詰める,
  次の場面を求める,
  雫が溶けきった,
  静止した場面を作る,
} from "./droplet-scene";
import {
  type GlassVariant,
  type RenderMode,
  描画方式を決める,
} from "./render-mode";

const MAX_DELTA_SECONDS = 0.05;

interface StartInput {
  readonly container: HTMLElement;
  readonly photo: BackdropPhoto;
  readonly forcedMode: RenderMode | null;
  readonly variant: GlassVariant;
  readonly isWideScreen: boolean;
  readonly onMode: (mode: RenderMode) => void;
}

const 写真を読み込む = async (src: string): Promise<ImageBitmap> => {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`背景の写真を読み込めませんでした: ${response.status}`);
  }
  return createImageBitmap(await response.blob());
};

const キャンバスを作る = (): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;display:block";
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("data-login-droplet", "");
  return canvas;
};

interface LoopInput {
  readonly container: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly renderer: DropletRenderer;
  readonly imageSize: StageSize;
  readonly photo: BackdropPhoto;
  readonly variant: GlassVariant;
}

interface Loop {
  readonly redrawWhenStill: () => void;
  readonly stop: () => void;
}

const 描画を回す = ({
  container,
  canvas,
  renderer,
  imageSize,
  photo,
  variant,
}: LoopInput): Loop => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isDarkNow = (): boolean =>
    document.documentElement.classList.contains("dark");
  const sizeNow = (): StageSize => {
    const rect = container.getBoundingClientRect();
    return {
      width: Math.max(rect.width, 1),
      height: Math.max(rect.height, 1),
    };
  };
  let size = sizeNow();
  let scene: SceneState = 静止した場面を作る({ isDark: isDarkNow() });
  let pointerTarget: Vec2 | null = null;
  let frameId = 0;
  let lastTime = 0;
  let melting = false;

  const draw = (): void => {
    const resolution = 描画の解像度を決める({
      size,
      devicePixelRatio: window.devicePixelRatio,
    });
    if (canvas.width !== resolution.width) {
      canvas.width = resolution.width;
    }
    if (canvas.height !== resolution.height) {
      canvas.height = resolution.height;
    }
    renderer.draw(
      new Float32Array(
        場面をユニフォームに詰める({
          state: scene,
          size,
          resolution,
          imageSize,
          variant,
          photo,
        }),
      ),
    );
  };

  const drawStill = (): void => {
    scene = 静止した場面を作る({ isDark: isDarkNow() });
    draw();
  };

  const pause = (): void => {
    cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const dispose = (): void => {
    pause();
    resizeObserver.disconnect();
    themeObserver.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener(
      "pointerleave",
      onPointerLeave,
    );
    document.removeEventListener("visibilitychange", refresh);
    document.removeEventListener(LOGIN_SCENE_FREEZE_EVENT, draw);
    document.removeEventListener(LOGIN_SCENE_MELT_EVENT, onMelt);
    reducedMotion.removeEventListener("change", refresh);
    renderer.dispose();
    canvas.remove();
  };

  const frame = (now: number): void => {
    const elapsedSeconds = Math.max((now - lastTime) / 1000, 0);
    const deltaSeconds = melting
      ? elapsedSeconds
      : Math.min(elapsedSeconds, MAX_DELTA_SECONDS);
    lastTime = now;
    scene = 次の場面を求める({
      state: scene,
      deltaSeconds,
      pointerTarget,
      layout: 雫の配置を決める(size),
      isDark: isDarkNow(),
      melting,
    });
    draw();
    if (雫が溶けきった(scene)) {
      dispose();
      return;
    }
    frameId = requestAnimationFrame(frame);
  };

  const onMelt = (): void => {
    const host = document.querySelector(`[${DROPLET_HOST_ATTRIBUTE}]`);
    if (melting || frameId === 0 || !host) {
      return;
    }
    melting = true;
    resizeObserver.disconnect();
    host.appendChild(canvas);
  };

  const refresh = (): void => {
    pause();
    if (melting) {
      dispose();
      return;
    }
    if (document.hidden) {
      return;
    }
    if (
      reducedMotion.matches ||
      document.documentElement.classList.contains("reduce-motion")
    ) {
      drawStill();
      return;
    }
    lastTime = performance.now();
    frameId = requestAnimationFrame(frame);
  };

  const redrawWhenStill = (): void => {
    if (frameId === 0 && !document.hidden) {
      drawStill();
    }
  };
  const onResize = (): void => {
    size = sizeNow();
    redrawWhenStill();
  };
  const onPointerMove = (event: PointerEvent): void => {
    pointerTarget = 画面の点を描画の座標にする({
      clientX: event.clientX,
      clientY: event.clientY,
      size,
    });
  };
  const onPointerLeave = (): void => {
    pointerTarget = null;
  };

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(container);
  const themeObserver = new MutationObserver(redrawWhenStill);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("pointermove", onPointerMove);
  document.documentElement.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", refresh);
  document.addEventListener(LOGIN_SCENE_FREEZE_EVENT, draw);
  document.addEventListener(LOGIN_SCENE_MELT_EVENT, onMelt);
  reducedMotion.addEventListener("change", refresh);

  container.appendChild(canvas);
  refresh();

  return {
    redrawWhenStill,
    stop: () => {
      if (!melting) {
        dispose();
      }
    },
  };
};

export const 液体ガラスの雫を描き始める = ({
  container,
  photo,
  forcedMode,
  variant,
  isWideScreen,
  onMode,
}: StartInput): (() => void) => {
  let stopped = false;
  let cleanups: readonly (() => void)[] = [];

  const run = async (): Promise<void> => {
    const image = await 写真を読み込む(photo.src);
    if (stopped) {
      return;
    }
    const mode = 描画方式を決める({ forcedMode, isWideScreen });
    if (mode !== "webgl2") {
      onMode(mode);
      return;
    }
    const canvas = キャンバスを作る();
    const renderer = 雫の描画器を作る({ canvas, image });
    if (!renderer) {
      onMode("static");
      return;
    }
    const loop = 描画を回す({
      container,
      canvas,
      renderer,
      imageSize: { width: image.width, height: image.height },
      photo,
      variant,
    });
    cleanups = [loop.stop];
    onMode("webgl2");
  };

  run().catch((error: unknown) => {
    console.warn("液体ガラスの雫を描けないため静止画にします", error);
    if (!stopped) {
      onMode("static");
    }
  });

  return () => {
    stopped = true;
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
};
