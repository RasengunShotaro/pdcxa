import { describe, expect, it } from "vitest";
import {
  つかんで動かした後の送り位置を求める,
  つかんで動かせるか,
  ドラッグ操作か,
} from "./image-viewer-pan";

describe("つかんで動かした後の送り位置を求める", () => {
  it("右下へ動かすと画像も右下へ付いてきて、見える範囲は左上へ戻る", () => {
    const next = つかんで動かした後の送り位置を求める({
      始めの送り位置: { scrollLeft: 300, scrollTop: 200 },
      押した位置: { clientX: 100, clientY: 100 },
      今の位置: { clientX: 150, clientY: 130 },
    });

    expect(next).toEqual({ scrollLeft: 250, scrollTop: 170 });
  });
});

describe("ドラッグ操作か", () => {
  it("押した位置からほとんど動いていなければクリックとして扱う", () => {
    const dragged = ドラッグ操作か({
      押した位置: { clientX: 100, clientY: 100 },
      今の位置: { clientX: 101, clientY: 101 },
    });

    expect(dragged).toBe(false);
  });

  it("押した位置からはっきり動いたらドラッグとして扱う", () => {
    const dragged = ドラッグ操作か({
      押した位置: { clientX: 100, clientY: 100 },
      今の位置: { clientX: 130, clientY: 100 },
    });

    expect(dragged).toBe(true);
  });
});

describe("つかんで動かせるか", () => {
  it("画像が枠に収まっているときは動かせない", () => {
    const movable = つかんで動かせるか({
      中身: { 幅: 600, 高さ: 400 },
      枠: { 幅: 800, 高さ: 600 },
    });

    expect(movable).toBe(false);
  });

  it("画像が横にだけはみ出していても動かせる", () => {
    const movable = つかんで動かせるか({
      中身: { 幅: 1200, 高さ: 400 },
      枠: { 幅: 800, 高さ: 600 },
    });

    expect(movable).toBe(true);
  });
});
