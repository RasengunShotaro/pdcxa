export const FRAME_UNIFORM_FLOAT_COUNT = 28;
export const CLOUD_UNIFORM_FLOAT_COUNT = 16;
export const ATMOSPHERE_UNIFORM_FLOAT_COUNT = 12;
export const SKY_OVERSCAN = 1.07;
export const MOTION_INTENSITY = 1.8;

const MAX_PIXEL_RATIO = 2;
const MAX_RENDER_EDGE = 5120;
const DAY_FRAME_INTERVAL_MS = 1000 / 24;
const NIGHT_FRAME_INTERVAL_MS = 1000 / 15;
const MAX_FRAME_LOAD = 4;
const LATE_FRAME_GAP_MS = 45;
const FRAME_TOLERANCE_MS = 2;
const RENDER_SCALE_STEP = 0.25;
const MIN_RENDER_SCALE = 0.5;
const MODE_FADE_MS = 700;
const STILL_TIME_SECONDS = 4;
const HEIGHT_CHANGE_TOLERANCE = 0.15;
const VERTICAL_HALF_FOV = (24 * Math.PI) / 180;
const MAX_HORIZONTAL_HALF_FOV = (54 * Math.PI) / 180;
const VIEW_PITCH = (36 * Math.PI) / 180;
const SUN_AZIMUTH = (-34 * Math.PI) / 180;
const SUN_ELEVATION = (66 * Math.PI) / 180;
const NIGHT_TURN_PERIOD_SECONDS = 260;
const METEOR_SECONDS = 0.95;
const METEOR_CHANCE = 0.7;
const POINTER_EASE_MS = 900;

export type SkyMotion = "animate" | "still" | "off";

export interface RenderSize {
  readonly width: number;
  readonly height: number;
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface SkyView {
  readonly tanHalfFovX: number;
  readonly tanHalfFovY: number;
  readonly pitch: number;
}

export type Direction = readonly [number, number, number];

export interface MotionAmounts {
  readonly panRadiansPerSecond: number;
  readonly windMetersPerSecond: number;
  readonly cloudEvolution: number;
  readonly nightTurn: number;
  readonly starTwinkle: number;
  readonly meteorSlotSeconds: number;
  readonly pointerReach: number;
}

export interface Meteor {
  readonly from: Point;
  readonly to: Point;
  readonly progress: number;
  readonly intensity: number;
}

export const computeRenderSize = ({
  cssWidth,
  cssHeight,
  pixelRatio,
}: {
  readonly cssWidth: number;
  readonly cssHeight: number;
  readonly pixelRatio: number;
}): RenderSize => {
  const ratio = Math.min(MAX_PIXEL_RATIO, Math.max(1, pixelRatio));
  const scaledWidth = Math.max(1, cssWidth * ratio);
  const scaledHeight = Math.max(1, cssHeight * ratio);
  const shrink = Math.min(
    1,
    MAX_RENDER_EDGE / Math.max(scaledWidth, scaledHeight),
  );
  return {
    width: Math.max(1, Math.round(scaledWidth * shrink)),
    height: Math.max(1, Math.round(scaledHeight * shrink)),
  };
};

export const needsResize = ({
  current,
  next,
}: {
  readonly current: RenderSize | null;
  readonly next: RenderSize;
}): boolean => {
  if (!current) return true;
  if (current.width !== next.width) return true;
  const heightChange = Math.abs(current.height - next.height) / current.height;
  return heightChange > HEIGHT_CHANGE_TOLERANCE;
};

export const frameInterval = ({
  mode,
  load,
}: {
  readonly mode: number;
  readonly load: number;
}): number => {
  const clamped = Math.min(1, Math.max(0, mode));
  const base =
    DAY_FRAME_INTERVAL_MS +
    (NIGHT_FRAME_INTERVAL_MS - DAY_FRAME_INTERVAL_MS) * clamped;
  return base * load;
};

export const isFrameDue = ({
  now,
  lastFrameAt,
  intervalMs,
}: {
  readonly now: number;
  readonly lastFrameAt: number;
  readonly intervalMs: number;
}): boolean => now - lastFrameAt >= intervalMs - FRAME_TOLERANCE_MS;

export const adaptFrameLoad = ({
  load,
  gapAfterDrawMs,
}: {
  readonly load: number;
  readonly gapAfterDrawMs: number;
}): number => {
  if (gapAfterDrawMs > LATE_FRAME_GAP_MS) {
    return Math.min(MAX_FRAME_LOAD, load * 1.5);
  }
  return Math.max(1, load * 0.97);
};

export const nextRenderScale = ({
  scale,
  load,
}: {
  readonly scale: number;
  readonly load: number;
}): { readonly scale: number; readonly load: number } => {
  if (load < MAX_FRAME_LOAD || scale <= MIN_RENDER_SCALE) {
    return { scale, load };
  }
  return {
    scale: Math.max(MIN_RENDER_SCALE, scale - RENDER_SCALE_STEP),
    load: 1,
  };
};

const SOFTWARE_RENDERER_PATTERN =
  /swiftshader|llvmpipe|softpipe|software|basic render/i;

export const isSoftwareRenderer = (rendererName: string): boolean =>
  SOFTWARE_RENDERER_PATTERN.test(rendererName);

export const resolveMotion = ({
  reduceMotion,
  reduceTransparency,
}: {
  readonly reduceMotion: boolean;
  readonly reduceTransparency: boolean;
}): SkyMotion => {
  if (reduceTransparency) return "off";
  return reduceMotion ? "still" : "animate";
};

export const advanceMode = ({
  current,
  target,
  deltaMs,
}: {
  readonly current: number;
  readonly target: number;
  readonly deltaMs: number;
}): number => {
  const step = Math.max(0, deltaMs) / MODE_FADE_MS;
  if (current < target) return Math.min(target, current + step);
  return Math.max(target, current - step);
};

export const easeMode = (progress: number): number => {
  const clamped = Math.min(1, Math.max(0, progress));
  return clamped * clamped * (3 - 2 * clamped);
};

export const sceneTime = ({
  motion,
  elapsedSeconds,
}: {
  readonly motion: SkyMotion;
  readonly elapsedSeconds: number;
}): number =>
  motion === "animate"
    ? STILL_TIME_SECONDS + elapsedSeconds
    : STILL_TIME_SECONDS;

export const motionAmounts = (intensity: number): MotionAmounts => {
  const level = Math.max(0, intensity);
  const gentle = Math.sqrt(level);
  return {
    panRadiansPerSecond: 0.0013 * level,
    windMetersPerSecond: 3.5 * level,
    cloudEvolution: 0.003 * level,
    nightTurn: 0.0075 * gentle,
    starTwinkle: Math.min(1, 0.32 * level ** 0.75),
    meteorSlotSeconds: 16 / Math.max(0.25, level),
    pointerReach: 0.0016 * level,
  };
};

export const MOTION = motionAmounts(MOTION_INTENSITY);

export const computeSkyView = (aspect: number): SkyView => {
  const safeAspect = Math.max(0.2, aspect);
  const tanHalfFovX = Math.min(
    Math.tan(MAX_HORIZONTAL_HALF_FOV),
    Math.tan(VERTICAL_HALF_FOV) * safeAspect,
  );
  return {
    tanHalfFovX,
    tanHalfFovY: tanHalfFovX / safeAspect,
    pitch: VIEW_PITCH,
  };
};

export const directionFromAngles = ({
  azimuth,
  elevation,
}: {
  readonly azimuth: number;
  readonly elevation: number;
}): Direction => [
  Math.sin(azimuth) * Math.cos(elevation),
  Math.sin(elevation),
  -Math.cos(azimuth) * Math.cos(elevation),
];

export const nightTurn = (time: number): number =>
  MOTION.nightTurn * Math.sin((2 * Math.PI * time) / NIGHT_TURN_PERIOD_SECONDS);

export const pointerParallax = (pointer: Point): Point => {
  const clamp = (value: number): number => Math.min(1, Math.max(0, value));
  return {
    x: (0.5 - clamp(pointer.x)) * 2 * MOTION.pointerReach,
    y: (0.5 - clamp(pointer.y)) * 2 * MOTION.pointerReach,
  };
};

export const easePointer = ({
  current,
  target,
  deltaMs,
}: {
  readonly current: Point;
  readonly target: Point;
  readonly deltaMs: number;
}): Point => {
  const blend = 1 - Math.exp(-Math.max(0, deltaMs) / POINTER_EASE_MS);
  return {
    x: current.x + (target.x - current.x) * blend,
    y: current.y + (target.y - current.y) * blend,
  };
};

const hashUnit = ({
  slot,
  salt,
}: {
  readonly slot: number;
  readonly salt: number;
}): number => {
  const mixed = Math.imul(slot ^ (salt * 0x9e3779b1), 0x85ebca6b);
  const scrambled = Math.imul(mixed ^ (mixed >>> 13), 0xc2b2ae35);
  return ((scrambled ^ (scrambled >>> 16)) >>> 0) / 4294967296;
};

const NO_METEOR: Meteor = {
  from: { x: 0, y: 0 },
  to: { x: 0, y: 0 },
  progress: 0,
  intensity: 0,
};

export const meteorAt = (time: number): Meteor => {
  const slotSeconds = MOTION.meteorSlotSeconds;
  const slot = Math.floor(time / slotSeconds);
  const unit = (salt: number): number => hashUnit({ slot, salt });
  if (unit(1) > METEOR_CHANCE) return NO_METEOR;
  const startsAt =
    slot * slotSeconds + unit(2) * (slotSeconds - METEOR_SECONDS);
  const progress = (time - startsAt) / METEOR_SECONDS;
  if (progress <= 0 || progress >= 1) return NO_METEOR;
  const from = { x: 0.12 + 0.76 * unit(3), y: 0.06 + 0.38 * unit(4) };
  const heading = unit(5) < 0.5 ? -1 : 1;
  const slope = 0.35 + 0.5 * unit(6);
  const length = 0.16 + 0.14 * unit(7);
  const run = length / Math.hypot(1, slope);
  return {
    from,
    to: { x: from.x + heading * run, y: from.y + slope * run },
    progress,
    intensity: 0.55 + 0.45 * unit(8),
  };
};

const viewAndSun = (aspect: number): readonly number[] => {
  const view = computeSkyView(aspect);
  const sun = directionFromAngles({
    azimuth: SUN_AZIMUTH,
    elevation: SUN_ELEVATION,
  });
  return [
    view.tanHalfFovX,
    view.tanHalfFovY,
    Math.sin(view.pitch),
    Math.cos(view.pitch),
    sun[0],
    sun[1],
    sun[2],
  ];
};

export const packFrameUniforms = ({
  size,
  time,
  mode,
  pixelRatio,
  blend,
  cloudFade,
  turnToPrevious,
  turnToNext,
  pointer,
}: {
  readonly size: RenderSize;
  readonly time: number;
  readonly mode: number;
  readonly pixelRatio: number;
  readonly blend: number;
  readonly cloudFade: number;
  readonly turnToPrevious: number;
  readonly turnToNext: number;
  readonly pointer: Point;
}): Float32Array<ArrayBuffer> => {
  const meteor = meteorAt(time);
  const uniforms = new Float32Array(FRAME_UNIFORM_FLOAT_COUNT);
  uniforms.set([
    size.width,
    size.height,
    time,
    easeMode(mode),
    ...viewAndSun(size.width / size.height),
    pixelRatio,
    blend,
    cloudFade,
    turnToPrevious,
    turnToNext,
    pointer.x,
    pointer.y,
    MOTION.starTwinkle,
    nightTurn(time),
    meteor.from.x,
    meteor.from.y,
    meteor.to.x,
    meteor.to.y,
    meteor.progress,
    meteor.intensity,
    0,
    0,
  ]);
  return uniforms;
};

export const packCloudUniforms = ({
  layerSize,
  viewAspect,
  time,
  pan,
}: {
  readonly layerSize: RenderSize;
  readonly viewAspect: number;
  readonly time: number;
  readonly pan: number;
}): Float32Array<ArrayBuffer> => {
  const uniforms = new Float32Array(CLOUD_UNIFORM_FLOAT_COUNT);
  uniforms.set([
    layerSize.width,
    layerSize.height,
    time,
    MOTION.cloudEvolution,
    ...viewAndSun(viewAspect),
    1,
    Math.cos(pan),
    Math.sin(pan),
    MOTION.windMetersPerSecond,
    0,
  ]);
  return uniforms;
};

export const packAtmosphereUniforms = ({
  size,
  viewAspect,
}: {
  readonly size: RenderSize;
  readonly viewAspect: number;
}): Float32Array<ArrayBuffer> => {
  const uniforms = new Float32Array(ATMOSPHERE_UNIFORM_FLOAT_COUNT);
  uniforms.set([size.width, size.height, 0, 0, ...viewAndSun(viewAspect), 1]);
  return uniforms;
};
