import { describe, expect, it } from "vitest";
import {
  type DropLayout,
  ばねを進める,
  ポインタの押し込みを求める,
  写真の敷き方を求める,
  描画の解像度を決める,
  画面の点を描画の座標にする,
  雫の配置を決める,
} from "./droplet-motion";

const aLayout = (overrides: Partial<DropLayout> = {}): DropLayout => ({
  center: { x: -0.4, y: 0 },
  radius: 0.2,
  ...overrides,
});

describe("雫の配置を決める", () => {
  it("横長の画面では雫を左側に置く", () => {
    const layout = 雫の配置を決める({ width: 1600, height: 900 });

    expect(layout.center.x).toBeLessThan(0);
  });

  it("縦長の画面では雫を左右の中央に置く", () => {
    const layout = 雫の配置を決める({ width: 400, height: 900 });

    expect(layout.center.x).toBe(0);
  });

  it("縦長の画面では雫を上側に置く", () => {
    const layout = 雫の配置を決める({ width: 400, height: 900 });

    expect(layout.center.y).toBeGreaterThan(0);
  });

  it("縦長の画面でも雫が画面の幅に収まる", () => {
    const layout = 雫の配置を決める({ width: 300, height: 900 });

    expect(layout.radius * 2).toBeLessThan(300 / 900);
  });
});

describe("ばねを進める", () => {
  it("目標から離れていると目標へ向かって動き出す", () => {
    const spring = ばねを進める({
      spring: { value: 0, velocity: 0 },
      target: 1,
      stiffness: 100,
      damping: 8,
      deltaSeconds: 0.05,
    });

    expect(spring.value).toBeGreaterThan(0);
  });

  it("揺れながら目標を一度行き過ぎる", () => {
    const spring = ばねを進める({
      spring: { value: 0, velocity: 0 },
      target: 1,
      stiffness: 100,
      damping: 4,
      deltaSeconds: 0.35,
    });

    expect(spring.value).toBeGreaterThan(1);
  });

  it("十分に時間が経つと目標で止まる", () => {
    const spring = ばねを進める({
      spring: { value: 0, velocity: 0 },
      target: 1,
      stiffness: 100,
      damping: 8,
      deltaSeconds: 5,
    });

    expect(spring.value).toBeCloseTo(1, 3);
    expect(spring.velocity).toBeCloseTo(0, 3);
  });

  it("時間が進まなければ動かない", () => {
    const spring = ばねを進める({
      spring: { value: 0.3, velocity: 2 },
      target: 1,
      stiffness: 100,
      damping: 8,
      deltaSeconds: 0,
    });

    expect(spring).toEqual({ value: 0.3, velocity: 2 });
  });
});

describe("ポインタの押し込みを求める", () => {
  it("ポインタが無いときは雫を押さない", () => {
    const press = ポインタの押し込みを求める({
      pointer: null,
      layout: aLayout(),
    });

    expect(press).toEqual({ depth: 0, push: { x: 0, y: 0 } });
  });

  it("ポインタが雫の中心にあると最も深く凹む", () => {
    const press = ポインタの押し込みを求める({
      pointer: { x: -0.4, y: 0 },
      layout: aLayout({ center: { x: -0.4, y: 0 } }),
    });

    expect(press.depth).toBe(1);
  });

  it("ポインタが雫から遠いと凹まない", () => {
    const press = ポインタの押し込みを求める({
      pointer: { x: 0.5, y: 0 },
      layout: aLayout({ center: { x: -0.4, y: 0 }, radius: 0.2 }),
    });

    expect(press.depth).toBe(0);
  });

  it("右から近づくと雫は左へ押される", () => {
    const press = ポインタの押し込みを求める({
      pointer: { x: -0.25, y: 0 },
      layout: aLayout({ center: { x: -0.4, y: 0 }, radius: 0.2 }),
    });

    expect(press.push.x).toBeLessThan(0);
  });
});

describe("画面の点を描画の座標にする", () => {
  it("画面の中央は原点になる", () => {
    const point = 画面の点を描画の座標にする({
      clientX: 400,
      clientY: 300,
      size: { width: 800, height: 600 },
    });

    expect(point).toEqual({ x: 0, y: 0 });
  });

  it("画面の上端は高さの半分だけ上になる", () => {
    const point = 画面の点を描画の座標にする({
      clientX: 400,
      clientY: 0,
      size: { width: 800, height: 600 },
    });

    expect(point.y).toBe(0.5);
  });
});

describe("描画の解像度を決める", () => {
  it("高精細な画面では 2 倍の解像度で描く", () => {
    const resolution = 描画の解像度を決める({
      size: { width: 800, height: 600 },
      devicePixelRatio: 2,
    });

    expect(resolution).toEqual({ width: 1600, height: 1200 });
  });

  it("3 倍の画面でも 2 倍までに抑える", () => {
    const resolution = 描画の解像度を決める({
      size: { width: 400, height: 300 },
      devicePixelRatio: 3,
    });

    expect(resolution).toEqual({ width: 800, height: 600 });
  });

  it("とても大きな画面では 4K 相当の画素数までに抑える", () => {
    const resolution = 描画の解像度を決める({
      size: { width: 5120, height: 2880 },
      devicePixelRatio: 2,
    });

    expect(resolution.width * resolution.height).toBeLessThanOrEqual(8_300_000);
  });
});

describe("写真の敷き方を求める", () => {
  it("写真より横長の画面では写真の横幅をほぼすべて使う", () => {
    const fit = 写真の敷き方を求める({
      resolution: { width: 2000, height: 1000 },
      imageSize: { width: 3000, height: 2000 },
    });

    expect(fit.scale.x * 2).toBeGreaterThan(0.95);
    expect(fit.scale.x * 2).toBeLessThanOrEqual(1);
  });

  it("写真より縦長の画面では写真の縦幅をほぼすべて使う", () => {
    const fit = 写真の敷き方を求める({
      resolution: { width: 500, height: 1000 },
      imageSize: { width: 3000, height: 2000 },
    });

    expect(-fit.scale.y).toBeGreaterThan(0.95);
    expect(-fit.scale.y).toBeLessThanOrEqual(1);
  });

  it("写真は縦横の比を保ったまま敷かれる", () => {
    const fit = 写真の敷き方を求める({
      resolution: { width: 2000, height: 1000 },
      imageSize: { width: 3000, height: 2000 },
    });

    expect(-fit.scale.y / fit.scale.x).toBeCloseTo(1.5);
  });

  it("左右を反転する写真は横の向きだけが逆になる", () => {
    const fit = 写真の敷き方を求める({
      resolution: { width: 2000, height: 1000 },
      imageSize: { width: 3000, height: 2000 },
      mirror: true,
    });

    expect(fit.scale.x).toBeLessThan(0);
    expect(fit.scale.y).toBeLessThan(0);
  });

  it("切り出す位置を指定しなければ写真の中央を使う", () => {
    const fit = 写真の敷き方を求める({
      resolution: { width: 2000, height: 1000 },
      imageSize: { width: 3000, height: 2000 },
    });

    expect(fit.offset).toEqual({ x: 0, y: 0 });
  });

  it("横長の画面で上端を指定すると写真の上側を使う", () => {
    const fit = 写真の敷き方を求める({
      resolution: { width: 2000, height: 1000 },
      imageSize: { width: 3000, height: 2000 },
      focus: { x: 0.5, y: 0 },
    });

    expect(fit.offset.x).toBeCloseTo(0);
    expect(fit.offset.y).toBeCloseTo(-0.125);
  });

  it("縦長の画面で右端を指定すると写真の右側を使う", () => {
    const fit = 写真の敷き方を求める({
      resolution: { width: 500, height: 1000 },
      imageSize: { width: 3000, height: 2000 },
      focus: { x: 1, y: 0.5 },
    });

    expect(fit.offset.x).toBeCloseTo(1 / 3);
    expect(fit.offset.y).toBeCloseTo(0);
  });

  it("写真が画面より粗いときは縮小版を使わない", () => {
    const fit = 写真の敷き方を求める({
      resolution: { width: 4000, height: 2000 },
      imageSize: { width: 300, height: 200 },
    });

    expect(fit.baseLod).toBe(0);
  });

  it("写真が画面の 4 倍ほど細かいときは 2 段階縮小した版に近いものを使う", () => {
    const fit = 写真の敷き方を求める({
      resolution: { width: 750, height: 500 },
      imageSize: { width: 3000, height: 2000 },
    });

    expect(fit.baseLod).toBeGreaterThan(1.8);
    expect(fit.baseLod).toBeLessThanOrEqual(2);
  });
});
