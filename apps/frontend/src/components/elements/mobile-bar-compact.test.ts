import { describe, expect, it } from "vitest";
import { 下部ナビを縮めるか } from "./mobile-bar-compact";

describe("下部ナビを縮めるか", () => {
  it("下へスクロールすると縮める", () => {
    expect(
      下部ナビを縮めるか({ previousY: 200, currentY: 260, compact: false }),
    ).toBe(true);
  });

  it("上へスクロールすると元の大きさに戻す", () => {
    expect(
      下部ナビを縮めるか({ previousY: 400, currentY: 340, compact: true }),
    ).toBe(false);
  });

  it("ごくわずかな揺れでは今の大きさを保つ", () => {
    expect(
      下部ナビを縮めるか({ previousY: 400, currentY: 403, compact: true }),
    ).toBe(true);
  });

  it("画面のいちばん上では縮めない", () => {
    expect(
      下部ナビを縮めるか({ previousY: 0, currentY: 12, compact: true }),
    ).toBe(false);
  });
});
