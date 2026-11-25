export interface Viewport {
  readonly width: number;
  readonly height: number;
}

export interface PanelRect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly radius: number;
}

export type EnterAppMotion = "fade" | "dissolve" | "morph";

const RAIL_MIN_VIEWPORT_WIDTH = 900;
const FRAME_MAX_WIDTH = 1440;
const FRAME_SIDE_MARGIN = 16;
const FRAME_BOTTOM_MARGIN = 24;
const HEADER_HEIGHT = 80;
const RAIL_WIDTH = 240;
const RAIL_RADIUS = 24;
const SAME_PLACE_TOLERANCE = 0.5;

export const ENTER_APP_TIMING = {
  dropletOut: 220,
  coverOut: 480,
  wipe: 800,
  panelDelay: 250,
  panelMove: 650,
  panelAdjust: 240,
  panelOut: 240,
  contentOut: 280,
  revealAfter: 350,
  dissolveOut: 260,
  fadeHold: 120,
  fadeOut: 200,
  waitLimit: 4000,
} as const;

export const アプリのレールの位置を求める = ({
  width,
  height,
}: Viewport): PanelRect | null => {
  if (width < RAIL_MIN_VIEWPORT_WIDTH) {
    return null;
  }
  return {
    left: Math.max(0, (width - FRAME_MAX_WIDTH) / 2) + FRAME_SIDE_MARGIN,
    top: HEADER_HEIGHT,
    width: RAIL_WIDTH,
    height: height - HEADER_HEIGHT - FRAME_BOTTOM_MARGIN,
    radius: RAIL_RADIUS,
  };
};

interface MotionInput {
  readonly reducedMotion: boolean;
  readonly hasSheet: boolean;
  readonly rail: PanelRect | null;
}

export const 入場の演出を選ぶ = ({
  reducedMotion,
  hasSheet,
  rail,
}: MotionInput): EnterAppMotion => {
  if (reducedMotion) {
    return "fade";
  }
  return hasSheet && rail ? "morph" : "dissolve";
};

interface SamePlaceInput {
  readonly current: PanelRect;
  readonly measured: PanelRect;
}

export const 同じ位置にある = ({
  current,
  measured,
}: SamePlaceInput): boolean =>
  Math.abs(current.left - measured.left) <= SAME_PLACE_TOLERANCE &&
  Math.abs(current.top - measured.top) <= SAME_PLACE_TOLERANCE &&
  Math.abs(current.width - measured.width) <= SAME_PLACE_TOLERANCE &&
  Math.abs(current.height - measured.height) <= SAME_PLACE_TOLERANCE &&
  Math.abs(current.radius - measured.radius) <= SAME_PLACE_TOLERANCE;
