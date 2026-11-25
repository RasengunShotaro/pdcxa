import { describe, expect, it } from "vitest";
import {
  type PanelRect,
  アプリのレールの位置を求める,
  入場の演出を選ぶ,
  同じ位置にある,
} from "./enter-app-plan";

const aRect = (overrides: Partial<PanelRect> = {}): PanelRect => ({
  left: 24,
  top: 80,
  width: 240,
  height: 796,
  radius: 24,
  ...overrides,
});

describe("アプリのレールの位置を求める", () => {
  it("PC 幅ではヘッダーの下、左の余白の内側にレールを置く", () => {
    const rail = アプリのレールの位置を求める({ width: 1440, height: 900 });

    expect(rail).toEqual({
      left: 16,
      top: 80,
      width: 240,
      height: 796,
      radius: 24,
    });
  });

  it("アプリの最大幅より広い画面では、中央寄せされた枠の左端に合わせる", () => {
    const rail = アプリのレールの位置を求める({ width: 1920, height: 1080 });

    expect(rail?.left).toBe(256);
  });

  it("レールを出さないスマホ幅では位置を返さない", () => {
    const rail = アプリのレールの位置を求める({ width: 390, height: 844 });

    expect(rail).toBeNull();
  });
});

describe("入場の演出を選ぶ", () => {
  it("動きを減らす設定のときは短いフェードだけにする", () => {
    const motion = 入場の演出を選ぶ({
      reducedMotion: true,
      hasSheet: true,
      rail: aRect(),
    });

    expect(motion).toBe("fade");
  });

  it("レールがある画面ではフォームのガラスをレールへ移す", () => {
    const motion = 入場の演出を選ぶ({
      reducedMotion: false,
      hasSheet: true,
      rail: aRect(),
    });

    expect(motion).toBe("morph");
  });

  it("レールが無い画面では写真を溶かすだけにする", () => {
    const motion = 入場の演出を選ぶ({
      reducedMotion: false,
      hasSheet: true,
      rail: null,
    });

    expect(motion).toBe("dissolve");
  });
});

describe("同じ位置にある", () => {
  it("見積もった位置と実際の位置が一致すれば同じとみなす", () => {
    const same = 同じ位置にある({ current: aRect(), measured: aRect() });

    expect(same).toBe(true);
  });

  it("実際のレールがずれていれば違う位置とみなす", () => {
    const same = 同じ位置にある({
      current: aRect({ top: 80 }),
      measured: aRect({ top: 96 }),
    });

    expect(same).toBe(false);
  });
});
