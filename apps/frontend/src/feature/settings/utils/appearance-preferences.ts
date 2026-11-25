export const 背景の選択肢 = [
  { value: "sky", label: "空" },
  { value: "plain", label: "無地" },
] as const;

export type 背景の種類 = (typeof 背景の選択肢)[number]["value"];

export const 既定の背景: 背景の種類 = "sky";

export interface 表示の設定 {
  readonly reduceTransparency: boolean;
  readonly reduceMotion: boolean;
  readonly backdrop: 背景の種類;
}

export const 表示の設定の既定値: 表示の設定 = {
  reduceTransparency: false,
  reduceMotion: false,
  backdrop: 既定の背景,
};

export const 表示の設定の保存先 = "pdcxa:appearance";

const 真偽値に限る = (value: unknown): boolean => value === true;

const 背景の種類に限る = (value: unknown): 背景の種類 =>
  背景の選択肢.find((option) => option.value === value)?.value ?? 既定の背景;

export const 描く背景を決める = ({
  backdrop,
  available,
}: {
  backdrop: 背景の種類;
  available: readonly 背景の種類[];
}): 背景の種類 => (available.includes(backdrop) ? backdrop : 既定の背景);

const 解釈する = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const 保存された表示の設定を読む = (raw: string | null): 表示の設定 => {
  if (raw === null) return 表示の設定の既定値;
  const parsed = 解釈する(raw);
  if (typeof parsed !== "object" || parsed === null) return 表示の設定の既定値;
  return {
    reduceTransparency: 真偽値に限る(
      "reduceTransparency" in parsed ? parsed.reduceTransparency : false,
    ),
    reduceMotion: 真偽値に限る(
      "reduceMotion" in parsed ? parsed.reduceMotion : false,
    ),
    backdrop: 背景の種類に限る(
      "backdrop" in parsed ? parsed.backdrop : 既定の背景,
    ),
  };
};

export const 表示の設定を保存できる形にする = (settings: 表示の設定): string =>
  JSON.stringify(settings);

export const 表示の設定で切り替える見た目 = (
  settings: Pick<表示の設定, "reduceTransparency" | "reduceMotion">,
): Readonly<Record<"reduce-transparency" | "reduce-motion", boolean>> => ({
  "reduce-transparency": settings.reduceTransparency,
  "reduce-motion": settings.reduceMotion,
});
