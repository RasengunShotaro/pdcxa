import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import {
  type 背景の種類,
  背景の選択肢,
} from "@/feature/settings/utils/appearance-preferences";

const 背景の部品: Partial<Record<背景の種類, ComponentType>> = {
  sky: dynamic(
    () =>
      import("../backdrops/sky/sky-backdrop").then(
        (module) => module.SkyBackdrop,
      ),
    { ssr: false },
  ),
};

export const 選べる背景: readonly 背景の種類[] = 背景の選択肢
  .map((option) => option.value)
  .filter((kind) => kind === "plain" || kind in 背景の部品);

export const 背景の部品を選ぶ = (kind: 背景の種類): ComponentType | null =>
  背景の部品[kind] ?? null;
