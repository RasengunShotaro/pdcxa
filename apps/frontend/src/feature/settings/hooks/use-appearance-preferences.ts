"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  保存された表示の設定を読む,
  type 表示の設定,
  表示の設定で切り替える見た目,
  表示の設定の保存先,
  表示の設定を保存できる形にする,
} from "../utils/appearance-preferences";

const 表示の設定が変わった知らせ = "pdcxa:appearance-change";

const 変更を待つ = (onChange: () => void): (() => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(表示の設定が変わった知らせ, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(表示の設定が変わった知らせ, onChange);
  };
};

const 保存された値 = (): string | null => {
  try {
    return window.localStorage.getItem(表示の設定の保存先);
  } catch {
    return null;
  }
};

const サーバーでの値 = (): string | null => null;

interface 表示の設定の操作 {
  settings: 表示の設定;
  update: (next: Partial<表示の設定>) => void;
}

export function useAppearancePreferences(): 表示の設定の操作 {
  const raw = useSyncExternalStore(変更を待つ, 保存された値, サーバーでの値);
  const settings = 保存された表示の設定を読む(raw);
  const { reduceTransparency, reduceMotion } = settings;

  useEffect(() => {
    const looks = 表示の設定で切り替える見た目({
      reduceTransparency,
      reduceMotion,
    });
    for (const [name, enabled] of Object.entries(looks)) {
      document.documentElement.classList.toggle(name, enabled);
    }
  }, [reduceTransparency, reduceMotion]);

  const update = (next: Partial<表示の設定>) => {
    try {
      window.localStorage.setItem(
        表示の設定の保存先,
        表示の設定を保存できる形にする({ ...settings, ...next }),
      );
    } catch {
      return;
    }
    window.dispatchEvent(new Event(表示の設定が変わった知らせ));
  };

  return { settings, update };
}
