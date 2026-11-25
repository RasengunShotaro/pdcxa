import {
  type 背景の種類,
  背景の選択肢,
} from "@/feature/settings/utils/appearance-preferences";

const 描ける背景の種類: readonly 背景の種類[] = ["sky", "plain"];

export const 選べる背景: readonly 背景の種類[] = 背景の選択肢
  .map((option) => option.value)
  .filter((kind) => 描ける背景の種類.includes(kind));
