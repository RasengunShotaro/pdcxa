import { describe, expect, it } from "vitest";
import {
  adaptFrameLoad,
  advanceMode,
  computeRenderSize,
  computeSkyView,
  FRAME_UNIFORM_FLOAT_COUNT,
  frameInterval,
  isSoftwareRenderer,
  MOTION_INTENSITY,
  meteorAt,
  motionAmounts,
  needsResize,
  nextRenderScale,
  packFrameUniforms,
  pointerParallax,
  resolveMotion,
  sceneTime,
} from "./sky-frame";

describe("computeRenderSize", () => {
  it("高精細な画面では、星がぼやけないよう画素比 2 の等倍で描く", () => {
    const size = computeRenderSize({
      cssWidth: 1440,
      cssHeight: 900,
      pixelRatio: 2,
    });

    expect(size).toEqual({ width: 2880, height: 1800 });
  });

  it("画素比が 2 を超える画面でも、2 までしか使わない", () => {
    const size = computeRenderSize({
      cssWidth: 400,
      cssHeight: 800,
      pixelRatio: 3,
    });

    expect(size).toEqual({ width: 800, height: 1600 });
  });

  it("5K 相当の画面は縮めずに描く", () => {
    const size = computeRenderSize({
      cssWidth: 2560,
      cssHeight: 1440,
      pixelRatio: 2,
    });

    expect(size).toEqual({ width: 5120, height: 2880 });
  });

  it("上限を超える大きな画面は、縦横比を保って縮める", () => {
    const size = computeRenderSize({
      cssWidth: 3840,
      cssHeight: 2160,
      pixelRatio: 2,
    });

    expect(size).toEqual({ width: 5120, height: 2880 });
  });
});

describe("needsResize", () => {
  it("幅が変わったら作り直す", () => {
    const result = needsResize({
      current: { width: 800, height: 600 },
      next: { width: 801, height: 600 },
    });

    expect(result).toBe(true);
  });

  it("アドレスバーの出入り程度の高さの変化では作り直さない", () => {
    const result = needsResize({
      current: { width: 800, height: 1600 },
      next: { width: 800, height: 1700 },
    });

    expect(result).toBe(false);
  });
});

describe("描画の間引き", () => {
  it("夜は昼より描く間隔を空ける", () => {
    const day = frameInterval({ mode: 0, load: 1 });
    const night = frameInterval({ mode: 1, load: 1 });

    expect(night).toBeGreaterThan(day);
  });

  it("描画が遅れたら負荷係数を上げ、間に合っていれば 1 へ戻していく", () => {
    const late = adaptFrameLoad({ load: 1, gapAfterDrawMs: 80 });
    const onTime = adaptFrameLoad({ load: 2, gapAfterDrawMs: 16 });

    expect(late).toBeGreaterThan(1);
    expect(onTime).toBeLessThan(2);
    expect(adaptFrameLoad({ load: 1, gapAfterDrawMs: 16 })).toBe(1);
  });

  it("間引きが上限に達したら、雲の細かさを一段落として負荷係数を戻す", () => {
    const result = nextRenderScale({ scale: 1, load: 4 });

    expect(result).toEqual({ scale: 0.75, load: 1 });
  });

  it("雲の細かさは下限より落とさない", () => {
    const result = nextRenderScale({ scale: 0.5, load: 4 });

    expect(result).toEqual({ scale: 0.5, load: 4 });
  });
});

describe("動きの設定", () => {
  it("透明度を下げる設定では描かず、動きを減らす設定では静止画にする", () => {
    expect(
      resolveMotion({ reduceMotion: true, reduceTransparency: true }),
    ).toBe("off");
    expect(
      resolveMotion({ reduceMotion: true, reduceTransparency: false }),
    ).toBe("still");
    expect(
      resolveMotion({ reduceMotion: false, reduceTransparency: false }),
    ).toBe("animate");
  });

  it("静止画のときは時刻が進まない", () => {
    const early = sceneTime({ motion: "still", elapsedSeconds: 1 });
    const late = sceneTime({ motion: "still", elapsedSeconds: 90 });

    expect(late).toBe(early);
  });

  it("動きの強さを上げると、風・回転・視差が大きくなり流れ星の間隔が縮む", () => {
    const calm = motionAmounts(1);
    const lively = motionAmounts(MOTION_INTENSITY);

    expect(lively.windMetersPerSecond).toBeGreaterThan(
      calm.windMetersPerSecond,
    );
    expect(lively.nightTurn).toBeGreaterThan(calm.nightTurn);
    expect(lively.pointerReach).toBeGreaterThan(calm.pointerReach);
    expect(lively.meteorSlotSeconds).toBeLessThan(calm.meteorSlotSeconds);
  });

  it("動きの強さ 0 では何も動かない", () => {
    const frozen = motionAmounts(0);

    expect(frozen.windMetersPerSecond).toBe(0);
    expect(frozen.panRadiansPerSecond).toBe(0);
    expect(frozen.starTwinkle).toBe(0);
  });

  it("昼夜の切り替えは目標を行き過ぎない", () => {
    const result = advanceMode({ current: 0.9, target: 1, deltaMs: 5000 });

    expect(result).toBe(1);
  });

  it("ポインターが中央にあるときは視差が付かない", () => {
    const offset = pointerParallax({ x: 0.5, y: 0.5 });

    expect(offset).toEqual({ x: 0, y: 0 });
  });
});

describe("isSoftwareRenderer", () => {
  it("GPU を使わない描画環境は、重い空を描かない対象として見分ける", () => {
    const result = isSoftwareRenderer(
      "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (LLVM 10.0.0) (0x0000C0DE)), SwiftShader driver)",
    );

    expect(result).toBe(true);
  });

  it("GPU で描ける環境は対象にしない", () => {
    const result = isSoftwareRenderer(
      "ANGLE (Apple, ANGLE Metal Renderer: Apple M5, Unspecified Version)",
    );

    expect(result).toBe(false);
  });
});

describe("computeSkyView", () => {
  it("横長すぎる画面では水平の画角を頭打ちにする", () => {
    const wide = computeSkyView(4);
    const wider = computeSkyView(8);

    expect(wider.tanHalfFovX).toBe(wide.tanHalfFovX);
    expect(wider.tanHalfFovY).toBeLessThan(wide.tanHalfFovY);
  });
});

describe("meteorAt", () => {
  const samples = Array.from({ length: 6000 }, (_, index) =>
    meteorAt(index * 0.05),
  );
  const visible = samples.filter((meteor) => meteor.intensity > 0);

  it("流れ星はときどき現れ、常には出ていない", () => {
    const share = visible.length / samples.length;

    expect(share).toBeGreaterThan(0.01);
    expect(share).toBeLessThan(0.2);
  });

  it("現れている間は、空の上半分から下向きに進む", () => {
    expect(
      visible.every(
        (meteor) =>
          meteor.progress > 0 &&
          meteor.progress < 1 &&
          meteor.from.y < 0.5 &&
          meteor.to.y > meteor.from.y,
      ),
    ).toBe(true);
  });

  it("同じ時刻なら同じ流れ星になる", () => {
    expect(meteorAt(123.4)).toEqual(meteorAt(123.4));
  });
});

describe("packFrameUniforms", () => {
  it("シェーダへ渡す値を決まった個数に詰め、昼夜の混ぜ具合を 0〜1 に収める", () => {
    const uniforms = packFrameUniforms({
      size: { width: 2880, height: 1800 },
      time: 12,
      mode: 1,
      pixelRatio: 2,
      blend: 0.5,
      cloudFade: 1,
      turnToPrevious: 0,
      turnToNext: 0,
      pointer: { x: 0, y: 0 },
    });

    expect(uniforms).toHaveLength(FRAME_UNIFORM_FLOAT_COUNT);
    expect(Array.from(uniforms.slice(0, 4))).toEqual([2880, 1800, 12, 1]);
  });
});
