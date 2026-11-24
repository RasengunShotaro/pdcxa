"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ポインタの位置, 送り位置 } from "./image-viewer-pan";
import {
  ZOOM_MIN,
  ホイールで変わる倍率を求める,
  ボタンで変わる倍率を求める,
  type 倍率を変える向き,
  type 大きさ,
  指した点を保つ送り位置を求める,
} from "./image-viewer-zoom";

interface 倍率を変える指示 {
  readonly view: HTMLElement;
  readonly 収めた大きさ: 大きさ;
  readonly 起点: 送り位置;
  readonly 今の倍率: number;
  readonly 次の倍率: number;
  readonly 指した位置: ポインタの位置 | null;
}

interface 送り位置の予約 {
  readonly 送り位置: 送り位置;
  readonly 画像の幅: number;
}

const 倍率を変えた後の送り位置を予約する = ({
  view,
  収めた大きさ,
  起点,
  今の倍率,
  次の倍率,
  指した位置,
}: 倍率を変える指示): 送り位置の予約 => {
  const 枠 = view.getBoundingClientRect();
  const 枠の中で指した位置 = {
    x:
      指した位置 === null
        ? view.clientWidth / 2
        : 指した位置.clientX - 枠.left - view.clientLeft,
    y:
      指した位置 === null
        ? view.clientHeight / 2
        : 指した位置.clientY - 枠.top - view.clientTop,
  };
  const 送り位置 = {
    scrollLeft: 指した点を保つ送り位置を求める({
      送り位置: 起点.scrollLeft,
      指した位置: 枠の中で指した位置.x,
      枠の長さ: view.clientWidth,
      前の中身の長さ: 収めた大きさ.幅 * 今の倍率,
      次の中身の長さ: 収めた大きさ.幅 * 次の倍率,
    }),
    scrollTop: 指した点を保つ送り位置を求める({
      送り位置: 起点.scrollTop,
      指した位置: 枠の中で指した位置.y,
      枠の長さ: view.clientHeight,
      前の中身の長さ: 収めた大きさ.高さ * 今の倍率,
      次の中身の長さ: 収めた大きさ.高さ * 次の倍率,
    }),
  };
  return { 送り位置, 画像の幅: 収めた大きさ.幅 * 次の倍率 };
};

export const useImageViewerZoom = ({
  view,
  画像,
  収めた大きさ,
}: {
  readonly view: HTMLElement | null;
  readonly 画像: HTMLImageElement | null;
  readonly 収めた大きさ: 大きさ;
}): {
  readonly 倍率: number;
  readonly ボタンで倍率を変える: (向き: 倍率を変える向き) => void;
  readonly 全体を表示する: () => void;
} => {
  const [倍率, set倍率] = useState(ZOOM_MIN);
  const 倍率Ref = useRef(倍率);
  const 収めた大きさRef = useRef(収めた大きさ);
  const 戻す送り位置Ref = useRef<送り位置の予約 | null>(null);

  useLayoutEffect(() => {
    収めた大きさRef.current = 収めた大きさ;
  }, [収めた大きさ]);

  useEffect(() => {
    if (view === null || 画像 === null || typeof ResizeObserver === "undefined")
      return;
    const observer = new ResizeObserver(() => {
      const 予約 = 戻す送り位置Ref.current;
      if (予約 === null) return;
      const 今の画像の幅 = 画像.getBoundingClientRect().width;
      if (Math.abs(今の画像の幅 - 予約.画像の幅) > 1) return;
      戻す送り位置Ref.current = null;
      view.scrollLeft = 予約.送り位置.scrollLeft;
      view.scrollTop = 予約.送り位置.scrollTop;
    });
    observer.observe(画像);
    return () => observer.disconnect();
  }, [view, 画像]);

  const 倍率を変える = ({
    次の倍率,
    指した位置,
  }: {
    readonly 次の倍率: number;
    readonly 指した位置: ポインタの位置 | null;
  }) => {
    const 今の倍率 = 倍率Ref.current;
    if (view === null || 次の倍率 === 今の倍率) return;
    戻す送り位置Ref.current = 倍率を変えた後の送り位置を予約する({
      view,
      収めた大きさ: 収めた大きさRef.current,
      起点: 戻す送り位置Ref.current?.送り位置 ?? view,
      今の倍率,
      次の倍率,
      指した位置,
    });
    倍率Ref.current = 次の倍率;
    set倍率(次の倍率);
  };

  useEffect(() => {
    if (view === null) return;
    const 拡大縮小する = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const 今の倍率 = 倍率Ref.current;
      const 次の倍率 = ホイールで変わる倍率を求める({
        倍率: 今の倍率,
        送り量: event.deltaY,
        送りの単位: event.deltaMode,
      });
      if (次の倍率 === 今の倍率) return;
      戻す送り位置Ref.current = 倍率を変えた後の送り位置を予約する({
        view,
        収めた大きさ: 収めた大きさRef.current,
        起点: 戻す送り位置Ref.current?.送り位置 ?? view,
        今の倍率,
        次の倍率,
        指した位置: { clientX: event.clientX, clientY: event.clientY },
      });
      倍率Ref.current = 次の倍率;
      set倍率(次の倍率);
    };
    view.addEventListener("wheel", 拡大縮小する, { passive: false });
    return () => view.removeEventListener("wheel", 拡大縮小する);
  }, [view]);

  return {
    倍率,
    ボタンで倍率を変える: (向き) =>
      倍率を変える({
        次の倍率: ボタンで変わる倍率を求める({ 倍率: 倍率Ref.current, 向き }),
        指した位置: null,
      }),
    全体を表示する: () =>
      倍率を変える({ 次の倍率: ZOOM_MIN, 指した位置: null }),
  };
};
