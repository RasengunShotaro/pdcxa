export type RenderMode = "webgl2" | "static" | "photo";
export type GlassVariant = "drop" | "ring";

export const WIDE_SCREEN_QUERY =
  "(min-width: 768px) and (min-aspect-ratio: 1 / 1)";

const RENDER_MODE_LABELS: Record<RenderMode, string> = {
  webgl2: "WebGL2",
  static: "静止画",
  photo: "写真のみ",
};

export const 描画方式の表示名を求める = (mode: RenderMode): string =>
  RENDER_MODE_LABELS[mode];

const isRenderMode = (value: string | null): value is RenderMode =>
  value === "webgl2" || value === "static" || value === "photo";

export const 指定された描画方式を読む = (search: string): RenderMode | null => {
  const value = new URLSearchParams(search).get("renderer");
  return isRenderMode(value) ? value : null;
};

export const 指定されたガラスの形を読む = (search: string): GlassVariant =>
  new URLSearchParams(search).get("variant") === "ring" ? "ring" : "drop";

interface ModeInput {
  readonly forcedMode: RenderMode | null;
  readonly isWideScreen: boolean;
}

export const 描画方式を決める = ({
  forcedMode,
  isWideScreen,
}: ModeInput): RenderMode => {
  if (!isWideScreen || forcedMode === "photo") {
    return "photo";
  }
  return forcedMode === "static" ? "static" : "webgl2";
};
