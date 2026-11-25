export interface Vec2 {
  readonly x: number;
  readonly y: number;
}

export interface StageSize {
  readonly width: number;
  readonly height: number;
}

export interface DropLayout {
  readonly center: Vec2;
  readonly radius: number;
}

export interface Spring {
  readonly value: number;
  readonly velocity: number;
}

export interface PointerPress {
  readonly depth: number;
  readonly push: Vec2;
}

export interface PhotoFit {
  readonly scale: Vec2;
  readonly offset: Vec2;
  readonly baseLod: number;
}

const clamp = ({
  value,
  min,
  max,
}: {
  readonly value: number;
  readonly min: number;
  readonly max: number;
}): number => Math.min(Math.max(value, min), max);

const smoothstep = ({
  from,
  to,
  value,
}: {
  readonly from: number;
  readonly to: number;
  readonly value: number;
}): number => {
  const t = clamp({ value: (value - from) / (to - from), min: 0, max: 1 });
  return t * t * (3 - 2 * t);
};

export const 雫の配置を決める = ({ width, height }: StageSize): DropLayout => {
  const aspect = width / height;
  if (aspect < 1) {
    return {
      center: { x: 0, y: 0.24 },
      radius: Math.min(0.16, aspect * 0.28),
    };
  }
  return {
    center: { x: -0.25 * aspect, y: 0.03 },
    radius: clamp({ value: aspect * 0.115, min: 0.15, max: 0.21 }),
  };
};

const SPRING_STEP_SECONDS = 1 / 120;

interface SpringInput {
  readonly spring: Spring;
  readonly target: number;
  readonly stiffness: number;
  readonly damping: number;
  readonly deltaSeconds: number;
}

export const ばねを進める = ({
  spring,
  target,
  stiffness,
  damping,
  deltaSeconds,
}: SpringInput): Spring => {
  if (deltaSeconds <= 0) {
    return spring;
  }
  const step = Math.min(deltaSeconds, SPRING_STEP_SECONDS);
  const velocity =
    spring.velocity +
    (-stiffness * (spring.value - target) - damping * spring.velocity) * step;
  return ばねを進める({
    spring: { value: spring.value + velocity * step, velocity },
    target,
    stiffness,
    damping,
    deltaSeconds: deltaSeconds - step,
  });
};

interface PressInput {
  readonly pointer: Vec2 | null;
  readonly layout: DropLayout;
}

export const ポインタの押し込みを求める = ({
  pointer,
  layout,
}: PressInput): PointerPress => {
  if (!pointer) {
    return { depth: 0, push: { x: 0, y: 0 } };
  }
  const offset = {
    x: pointer.x - layout.center.x,
    y: pointer.y - layout.center.y,
  };
  const distance = Math.hypot(offset.x, offset.y);
  const depth =
    1 -
    smoothstep({
      from: layout.radius * 0.6,
      to: layout.radius * 1.45,
      value: distance,
    });
  if (distance < 1e-6) {
    return { depth, push: { x: 0, y: 0 } };
  }
  const amount = (depth * layout.radius * 0.16) / distance;
  return { depth, push: { x: -offset.x * amount, y: -offset.y * amount } };
};

interface PointerInput {
  readonly clientX: number;
  readonly clientY: number;
  readonly size: StageSize;
}

export const 画面の点を描画の座標にする = ({
  clientX,
  clientY,
  size,
}: PointerInput): Vec2 => ({
  x: (clientX - size.width / 2) / size.height,
  y: (size.height / 2 - clientY) / size.height,
});

const MAX_PIXELS = 3840 * 2160;

interface ResolutionInput {
  readonly size: StageSize;
  readonly devicePixelRatio: number;
}

export const 描画の解像度を決める = ({
  size,
  devicePixelRatio,
}: ResolutionInput): StageSize => {
  const ratio = clamp({ value: devicePixelRatio, min: 1, max: 2 });
  const pixels = size.width * size.height * ratio * ratio;
  const scale = ratio * Math.min(1, Math.sqrt(MAX_PIXELS / pixels));
  return {
    width: Math.max(1, Math.round(size.width * scale)),
    height: Math.max(1, Math.round(size.height * scale)),
  };
};

interface PhotoFitInput {
  readonly resolution: StageSize;
  readonly imageSize: StageSize;
  readonly mirror?: boolean;
  readonly focus?: Vec2;
}

export const 写真の敷き方を求める = ({
  resolution,
  imageSize,
  mirror = false,
  focus = { x: 0.5, y: 0.5 },
}: PhotoFitInput): PhotoFit => {
  const stageAspect = resolution.width / resolution.height;
  const imageAspect = imageSize.width / imageSize.height;
  const direction = mirror ? -1 : 1;
  const scale =
    stageAspect > imageAspect
      ? {
          x: direction / stageAspect,
          y: -imageAspect / stageAspect,
        }
      : { x: direction / imageAspect, y: -1 };
  const texelsPerPixel = (imageSize.height * -scale.y) / resolution.height;
  return {
    scale,
    offset: {
      x: (focus.x - 0.5) * (1 - Math.abs(scale.x) * stageAspect),
      y: (focus.y - 0.5) * (1 + scale.y),
    },
    baseLod: Math.max(0, Math.log2(texelsPerPixel)),
  };
};
