import { describe, expect, it } from "vitest";
import type { DropLayout } from "./droplet-motion";
import {
  type SceneState,
  UNIFORM_FLOAT_COUNT,
  場面をユニフォームに詰める,
  次の場面を求める,
  雫が溶けきった,
  静止した場面を作る,
} from "./droplet-scene";

const aLayout = (overrides: Partial<DropLayout> = {}): DropLayout => ({
  center: { x: -0.4, y: 0 },
  radius: 0.2,
  ...overrides,
});

const aScene = (overrides: Partial<SceneState> = {}): SceneState => ({
  ...静止した場面を作る({ isDark: false }),
  ...overrides,
});

const DARK_INDEX = 18;
const MELT_INDEX = 19;
const RADIUS_INDEX = 10;
const VARIANT_INDEX = 11;

describe("静止した場面を作る", () => {
  it("ダークのときは暗い見た目で始まる", () => {
    const scene = 静止した場面を作る({ isDark: true });

    expect(scene.dark).toBe(1);
  });

  it("雫は凹みも揺れも無い状態で止まっている", () => {
    const scene = 静止した場面を作る({ isDark: false });

    expect(scene).toMatchObject({
      press: { value: 0, velocity: 0 },
      pushX: { value: 0, velocity: 0 },
      pushY: { value: 0, velocity: 0 },
    });
  });
});

describe("次の場面を求める", () => {
  it("ポインタが雫の上にあると雫が凹み始める", () => {
    const next = 次の場面を求める({
      state: aScene(),
      deltaSeconds: 0.05,
      pointerTarget: { x: -0.4, y: 0 },
      layout: aLayout({ center: { x: -0.4, y: 0 } }),
      isDark: false,
      melting: false,
    });

    expect(next.press.value).toBeGreaterThan(0);
  });

  it("溶け始めていなければ雫は元の姿のままでいる", () => {
    const next = 次の場面を求める({
      state: aScene(),
      deltaSeconds: 0.05,
      pointerTarget: null,
      layout: aLayout(),
      isDark: false,
      melting: false,
    });

    expect(next.melt).toBe(0);
  });

  it("溶け始めると時間とともに溶けていく", () => {
    const next = 次の場面を求める({
      state: aScene(),
      deltaSeconds: 0.05,
      pointerTarget: null,
      layout: aLayout(),
      isDark: false,
      melting: true,
    });

    expect(next.melt).toBeGreaterThan(0);
    expect(next.melt).toBeLessThan(1);
  });

  it("溶け始めてから 2 秒たてば雫は溶けきっている", () => {
    const next = 次の場面を求める({
      state: aScene({ melt: 0 }),
      deltaSeconds: 2,
      pointerTarget: null,
      layout: aLayout(),
      isDark: false,
      melting: true,
    });

    expect(雫が溶けきった(next)).toBe(true);
  });

  it("溶けている間はポインタが上にあっても雫を凹ませない", () => {
    const next = 次の場面を求める({
      state: aScene(),
      deltaSeconds: 0.05,
      pointerTarget: { x: -0.4, y: 0 },
      layout: aLayout({ center: { x: -0.4, y: 0 } }),
      isDark: false,
      melting: true,
    });

    expect(next.press.value).toBe(0);
  });

  it("ポインタが離れると凹みが戻り始める", () => {
    const next = 次の場面を求める({
      state: aScene({ press: { value: 1, velocity: 0 } }),
      deltaSeconds: 0.05,
      pointerTarget: null,
      layout: aLayout(),
      isDark: false,
      melting: false,
    });

    expect(next.press.value).toBeLessThan(1);
  });

  it("ダークへ切り替えると少しずつ暗くなる", () => {
    const next = 次の場面を求める({
      state: aScene({ dark: 0 }),
      deltaSeconds: 0.1,
      pointerTarget: null,
      layout: aLayout(),
      isDark: true,
      melting: false,
    });

    expect(next.dark).toBeGreaterThan(0);
    expect(next.dark).toBeLessThan(1);
  });
});

describe("場面をユニフォームに詰める", () => {
  const pack = (
    state: SceneState,
    variant: "drop" | "ring" = "drop",
  ): readonly number[] =>
    場面をユニフォームに詰める({
      state,
      size: { width: 1600, height: 900 },
      resolution: { width: 1600, height: 900 },
      imageSize: { width: 3840, height: 2560 },
      variant,
      photo: { poolColor: [1, 0.5, 0.2], poolStrength: 1, groundOffset: 2 },
    });

  it("シェーダーが受け取る数だけ値を詰める", () => {
    const uniforms = pack(aScene());

    expect(uniforms).toHaveLength(UNIFORM_FLOAT_COUNT);
  });

  it("すべての値が有限の数になる", () => {
    const uniforms = pack(aScene({ time: 12 }));

    expect(uniforms.every(Number.isFinite)).toBe(true);
  });

  it("ダークの度合いをそのまま伝える", () => {
    const uniforms = pack(aScene({ dark: 1 }));

    expect(uniforms[DARK_INDEX]).toBe(1);
  });

  it("背景の写真は動かさない", () => {
    const uniforms = pack(aScene({ pointer: { x: 0.4, y: -0.3 }, time: 12 }));

    expect([uniforms[6], uniforms[7]]).toEqual([0, 0]);
  });

  it("溶けるにつれて雫は小さくなる", () => {
    const before = pack(aScene({ melt: 0 }));
    const after = pack(aScene({ melt: 1 }));

    expect(after[RADIUS_INDEX]).toBeLessThan(before[RADIUS_INDEX]);
  });

  it("溶け始めの屈折がほどける間は、雫の大きさを変えない", () => {
    const before = pack(aScene({ melt: 0 }));
    const early = pack(aScene({ melt: 0.2 }));

    expect(early[RADIUS_INDEX]).toBe(before[RADIUS_INDEX]);
  });

  it("溶け具合をそのまま伝える", () => {
    const uniforms = pack(aScene({ melt: 0.5 }));

    expect(uniforms[MELT_INDEX]).toBe(0.5);
  });

  it("円環を選ぶと円環の形で描くよう伝える", () => {
    const uniforms = pack(aScene(), "ring");

    expect(uniforms[VARIANT_INDEX]).toBe(1);
  });
});
