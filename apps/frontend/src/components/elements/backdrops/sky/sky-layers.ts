export const CLOUD_LAYER_COUNT = 3;
export const CLOUD_COLUMN_COUNT = 48;

const CLOUD_PIXELS_PER_CSS_PIXEL = 1.5;
const MAX_CLOUD_EDGE = 2880;
const ATMOSPHERE_HEIGHT = 288;
const SNAPSHOT_SECONDS = 4;
const SNAPSHOT_START_SECONDS = 40;
const CLOUD_FADE_MS = 1100;
const FRAMES_PER_COLUMN = 2;

export interface LayerSize {
  readonly width: number;
  readonly height: number;
}

export interface ColumnRect {
  readonly x: number;
  readonly width: number;
}

export interface SnapshotPose {
  readonly time: number;
  readonly pan: number;
}

export interface LayerRoles {
  readonly previous: number;
  readonly next: number;
  readonly work: number;
}

export interface SnapshotProgress {
  readonly column: number;
  readonly frame: number;
}

export const computeCloudLayerSize = ({
  renderSize,
  pixelRatio,
  overscan,
  detail,
}: {
  readonly renderSize: LayerSize;
  readonly pixelRatio: number;
  readonly overscan: number;
  readonly detail: number;
}): LayerSize => {
  const density =
    Math.min(1, CLOUD_PIXELS_PER_CSS_PIXEL / Math.max(1, pixelRatio)) * detail;
  const width = renderSize.width * density * overscan;
  const height = renderSize.height * density;
  const shrink = Math.min(1, MAX_CLOUD_EDGE / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * shrink)),
    height: Math.max(1, Math.round(height * shrink)),
  };
};

export const computeAtmosphereSize = (renderSize: LayerSize): LayerSize => ({
  width: Math.max(
    16,
    Math.round((ATMOSPHERE_HEIGHT * renderSize.width) / renderSize.height),
  ),
  height: ATMOSPHERE_HEIGHT,
});

export const columnRect = ({
  index,
  width,
}: {
  readonly index: number;
  readonly width: number;
}): ColumnRect => {
  const start = Math.floor((index * width) / CLOUD_COLUMN_COUNT);
  const end = Math.floor(((index + 1) * width) / CLOUD_COLUMN_COUNT);
  return { x: start, width: end - start };
};

export const snapshotPose = ({
  snapshot,
  panRadiansPerSecond,
}: {
  readonly snapshot: number;
  readonly panRadiansPerSecond: number;
}): SnapshotPose => ({
  time: SNAPSHOT_START_SECONDS + snapshot * SNAPSHOT_SECONDS,
  pan: snapshot * SNAPSHOT_SECONDS * panRadiansPerSecond,
});

export const advanceProgress = (
  progress: SnapshotProgress,
): SnapshotProgress =>
  progress.frame + 1 < FRAMES_PER_COLUMN
    ? { column: progress.column, frame: progress.frame + 1 }
    : { column: progress.column + 1, frame: 0 };

export const isColumnDue = (progress: SnapshotProgress): boolean =>
  progress.frame === 0 && progress.column < CLOUD_COLUMN_COUNT;

export const isSnapshotComplete = (progress: SnapshotProgress): boolean =>
  progress.column >= CLOUD_COLUMN_COUNT;

export const blendOf = (progress: SnapshotProgress): number =>
  Math.min(
    1,
    (progress.column * FRAMES_PER_COLUMN + progress.frame) /
      (CLOUD_COLUMN_COUNT * FRAMES_PER_COLUMN),
  );

export const blendTurns = ({
  blend,
  hasMotion,
  panRadiansPerSecond,
}: {
  readonly blend: number;
  readonly hasMotion: boolean;
  readonly panRadiansPerSecond: number;
}): { readonly toPrevious: number; readonly toNext: number } => {
  if (!hasMotion) return { toPrevious: 0, toNext: 0 };
  const step = SNAPSHOT_SECONDS * panRadiansPerSecond;
  const clamped = Math.min(1, Math.max(0, blend));
  return { toPrevious: clamped * step, toNext: (clamped - 1) * step };
};

export const initialLayerRoles = (): LayerRoles => ({
  previous: 0,
  next: 0,
  work: 0,
});

export const rotateLayerRoles = ({
  roles,
  completedSnapshots,
}: {
  readonly roles: LayerRoles;
  readonly completedSnapshots: number;
}): LayerRoles => {
  const previous = completedSnapshots === 0 ? roles.work : roles.next;
  const next = roles.work;
  const candidates = Array.from(
    { length: CLOUD_LAYER_COUNT },
    (_, layer) => layer,
  );
  const work =
    candidates.find((layer) => layer !== previous && layer !== next) ?? 0;
  return { previous, next, work };
};

export const advanceCloudFade = ({
  current,
  deltaMs,
}: {
  readonly current: number;
  readonly deltaMs: number;
}): number => Math.min(1, current + Math.max(0, deltaMs) / CLOUD_FADE_MS);
