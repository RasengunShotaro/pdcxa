import {
  type DropLayout,
  type Spring,
  type StageSize,
  type Vec2,
  ばねを進める,
  ポインタの押し込みを求める,
  写真の敷き方を求める,
  雫の配置を決める,
} from "./droplet-motion";
import type { BackdropPhoto } from "./droplet-photos";
import type { GlassVariant } from "./render-mode";

export const UNIFORM_FLOAT_COUNT = 28;
export const STILL_FRAME_TIME = 2.4;

const POINTER_FOLLOW_RATE = 5;
const THEME_FOLLOW_RATE = 4;
const PRESS_STIFFNESS = 150;
const PRESS_DAMPING = 7;
const PUSH_STIFFNESS = 90;
const PUSH_DAMPING = 6;
const LIGHT_REST: Vec2 = { x: -0.34, y: 0.42 };
const LIGHT_REACH = 0.22;
const MELT_SECONDS = 0.9;
const MELT_SHRINK = 0.25;
const MELT_SAG = 0.3;
const MELT_WOBBLE = 0.35;
const COLLAPSE_FROM = 0.3;
const COLLAPSE_TO = 0.85;

const RESTING_SPRING: Spring = { value: 0, velocity: 0 };

export interface SceneState {
  readonly time: number;
  readonly pointer: Vec2;
  readonly press: Spring;
  readonly pushX: Spring;
  readonly pushY: Spring;
  readonly dark: number;
  readonly melt: number;
}

interface StillSceneInput {
  readonly isDark: boolean;
}

export const 静止した場面を作る = ({
  isDark,
}: StillSceneInput): SceneState => ({
  time: STILL_FRAME_TIME,
  pointer: { x: 0, y: 0 },
  press: RESTING_SPRING,
  pushX: RESTING_SPRING,
  pushY: RESTING_SPRING,
  dark: isDark ? 1 : 0,
  melt: 0,
});

export const 雫が溶けきった = (state: SceneState): boolean => state.melt >= 1;

const follow = ({
  from,
  to,
  rate,
  deltaSeconds,
}: {
  readonly from: number;
  readonly to: number;
  readonly rate: number;
  readonly deltaSeconds: number;
}): number => from + (to - from) * (1 - Math.exp(-rate * deltaSeconds));

interface NextSceneInput {
  readonly state: SceneState;
  readonly deltaSeconds: number;
  readonly pointerTarget: Vec2 | null;
  readonly layout: DropLayout;
  readonly isDark: boolean;
  readonly melting: boolean;
}

export const 次の場面を求める = ({
  state,
  deltaSeconds,
  pointerTarget,
  layout,
  isDark,
  melting,
}: NextSceneInput): SceneState => {
  const target = pointerTarget ?? { x: 0, y: 0 };
  const press = ポインタの押し込みを求める({
    pointer: melting ? null : pointerTarget,
    layout,
  });
  return {
    melt: melting
      ? Math.min(1, state.melt + deltaSeconds / MELT_SECONDS)
      : state.melt,
    time: state.time + deltaSeconds,
    pointer: {
      x: follow({
        from: state.pointer.x,
        to: target.x,
        rate: POINTER_FOLLOW_RATE,
        deltaSeconds,
      }),
      y: follow({
        from: state.pointer.y,
        to: target.y,
        rate: POINTER_FOLLOW_RATE,
        deltaSeconds,
      }),
    },
    press: ばねを進める({
      spring: state.press,
      target: press.depth,
      stiffness: PRESS_STIFFNESS,
      damping: PRESS_DAMPING,
      deltaSeconds,
    }),
    pushX: ばねを進める({
      spring: state.pushX,
      target: press.push.x,
      stiffness: PUSH_STIFFNESS,
      damping: PUSH_DAMPING,
      deltaSeconds,
    }),
    pushY: ばねを進める({
      spring: state.pushY,
      target: press.push.y,
      stiffness: PUSH_STIFFNESS,
      damping: PUSH_DAMPING,
      deltaSeconds,
    }),
    dark: follow({
      from: state.dark,
      to: isDark ? 1 : 0,
      rate: THEME_FOLLOW_RATE,
      deltaSeconds,
    }),
  };
};

const clampUnit = (value: number): number => Math.min(Math.max(value, -1), 1);

interface UniformInput {
  readonly state: SceneState;
  readonly size: StageSize;
  readonly resolution: StageSize;
  readonly imageSize: StageSize;
  readonly variant: GlassVariant;
  readonly photo: Pick<
    BackdropPhoto,
    "poolColor" | "poolStrength" | "groundOffset" | "mirror" | "focus"
  >;
}

export const 場面をユニフォームに詰める = ({
  state,
  size,
  resolution,
  imageSize,
  variant,
  photo,
}: UniformInput): readonly number[] => {
  const layout = 雫の配置を決める(size);
  const fit = 写真の敷き方を求める({
    resolution,
    imageSize,
    mirror: photo.mirror,
    focus: photo.focus,
  });
  const collapse = Math.min(
    Math.max((state.melt - COLLAPSE_FROM) / (COLLAPSE_TO - COLLAPSE_FROM), 0),
    1,
  );
  const eased = collapse * collapse * (3 - 2 * collapse);
  const center = {
    x: layout.center.x + state.pushX.value,
    y: layout.center.y + state.pushY.value - layout.radius * MELT_SAG * eased,
  };
  const wobble = Math.min(
    1,
    Math.abs(state.press.velocity) * 0.12 +
      (Math.hypot(state.pushX.velocity, state.pushY.velocity) / layout.radius) *
        0.25 +
      Math.sin(Math.PI * state.melt) * MELT_WOBBLE,
  );
  return [
    resolution.width,
    resolution.height,
    state.time,
    fit.baseLod,
    fit.scale.x,
    fit.scale.y,
    fit.offset.x,
    fit.offset.y,
    center.x,
    center.y,
    layout.radius * (1 - MELT_SHRINK * eased),
    variant === "ring" ? 1 : 0,
    state.pointer.x - center.x,
    state.pointer.y - center.y,
    state.press.value,
    wobble,
    LIGHT_REST.x + clampUnit(state.pointer.x * 1.6) * LIGHT_REACH,
    LIGHT_REST.y + clampUnit(state.pointer.y * 2) * LIGHT_REACH,
    state.dark,
    state.melt,
    layout.center.x + layout.radius * 0.12,
    layout.center.y - layout.radius * photo.groundOffset,
    photo.poolStrength,
    0,
    photo.poolColor[0],
    photo.poolColor[1],
    photo.poolColor[2],
    0,
  ];
};
