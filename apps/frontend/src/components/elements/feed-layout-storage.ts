import type { LayoutStorage } from "react-resizable-panels";

export const 一覧と詳細の幅の保存先: LayoutStorage = {
  getItem: (key) => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      return;
    }
  },
};
