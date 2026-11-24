"use client";

import { useEffect, useRef, useState } from "react";
import {
  つかんで動かした後の送り位置を求める,
  ドラッグ操作か,
  type ポインタの位置,
  type 送り位置,
} from "./image-viewer-pan";

const 左ボタン = 0;
const 中ボタン = 1;
const 左ボタンのビット = 1;
const 中ボタンのビット = 4;

interface つかみの記録 {
  readonly つかんだボタン: number;
  readonly 押した位置: ポインタの位置;
  readonly 始めの送り位置: 送り位置;
  readonly 動かした: boolean;
}

export const useImageViewerDragPan = ({
  view,
  動かせる,
}: {
  readonly view: HTMLElement | null;
  readonly 動かせる: boolean;
}): { readonly つかんでいる: boolean } => {
  const [つかんでいる, setつかんでいる] = useState(false);
  const 動かせるRef = useRef(動かせる);

  useEffect(() => {
    動かせるRef.current = 動かせる;
  }, [動かせる]);

  useEffect(() => {
    if (view === null) return;
    let 今のつかみ: つかみの記録 | null = null;

    const つかむ = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !動かせるRef.current) return;
      if (event.button !== 左ボタン && event.button !== 中ボタン) return;
      event.preventDefault();
      今のつかみ = {
        つかんだボタン: event.button,
        押した位置: { clientX: event.clientX, clientY: event.clientY },
        始めの送り位置: {
          scrollLeft: view.scrollLeft,
          scrollTop: view.scrollTop,
        },
        動かした: false,
      };
    };

    const 放す = () => {
      if (今のつかみ === null) return;
      今のつかみ = null;
      setつかんでいる(false);
    };

    const 動かす = (event: PointerEvent) => {
      const つかみ = 今のつかみ;
      if (つかみ === null) return;
      const 押し続けているビット =
        つかみ.つかんだボタン === 中ボタン
          ? 中ボタンのビット
          : 左ボタンのビット;
      if ((event.buttons & 押し続けているビット) === 0) {
        放す();
        return;
      }
      const 今の位置 = { clientX: event.clientX, clientY: event.clientY };
      if (!つかみ.動かした) {
        if (!ドラッグ操作か({ 押した位置: つかみ.押した位置, 今の位置 }))
          return;
        今のつかみ = { ...つかみ, 動かした: true };
        setつかんでいる(true);
      }
      event.preventDefault();
      const 次の送り位置 = つかんで動かした後の送り位置を求める({
        始めの送り位置: つかみ.始めの送り位置,
        押した位置: つかみ.押した位置,
        今の位置,
      });
      view.scrollLeft = 次の送り位置.scrollLeft;
      view.scrollTop = 次の送り位置.scrollTop;
    };

    view.addEventListener("pointerdown", つかむ);
    window.addEventListener("pointermove", 動かす);
    window.addEventListener("pointerup", 放す);
    window.addEventListener("pointercancel", 放す);
    return () => {
      view.removeEventListener("pointerdown", つかむ);
      window.removeEventListener("pointermove", 動かす);
      window.removeEventListener("pointerup", 放す);
      window.removeEventListener("pointercancel", 放す);
      setつかんでいる(false);
    };
  }, [view]);

  return { つかんでいる };
};
