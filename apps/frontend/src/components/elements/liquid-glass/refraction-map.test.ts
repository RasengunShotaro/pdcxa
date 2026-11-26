import { describe, expect, it } from "vitest";
import { ガラスの屈折マップを作る } from "./refraction-map";

const 画素 = ({
  map,
  width,
  x,
  y,
}: {
  map: Uint8ClampedArray;
  width: number;
  x: number;
  y: number;
}) => {
  const offset = (y * width + x) * 4;
  return { r: map[offset], g: map[offset + 1], a: map[offset + 3] };
};

describe("ガラスの屈折マップを作る", () => {
  const width = 120;
  const height = 80;
  const map = ガラスの屈折マップを作る({
    width,
    height,
    radius: 20,
    bezel: 12,
  });

  it("縁から離れた中央は背景をそのまま通す", () => {
    expect(画素({ map, width, x: 60, y: 40 })).toEqual({
      r: 128,
      g: 128,
      a: 255,
    });
  });

  it("左の縁は内側にあたる右から背景を引き込む", () => {
    expect(画素({ map, width, x: 1, y: 40 }).r).toBeGreaterThan(200);
  });

  it("右の縁は内側にあたる左から背景を引き込む", () => {
    expect(画素({ map, width, x: width - 2, y: 40 }).r).toBeLessThan(56);
  });

  it("上の縁は下から背景を引き込み、横方向にはずらさない", () => {
    const top = 画素({ map, width, x: 60, y: 1 });
    expect(top.g).toBeGreaterThan(200);
    expect(top.r).toBe(128);
  });

  it("縁に近いほど強く曲げる", () => {
    const nearEdge = 画素({ map, width, x: 1, y: 40 }).r;
    const insideBezel = 画素({ map, width, x: 8, y: 40 }).r;
    expect(nearEdge).toBeGreaterThan(insideBezel);
    expect(insideBezel).toBeGreaterThan(128);
  });

  it("角の外側は曲げずに通す", () => {
    expect(画素({ map, width, x: 0, y: 0 })).toEqual({
      r: 128,
      g: 128,
      a: 255,
    });
  });

  it("幅と高さぶんの RGBA を返す", () => {
    expect(map).toHaveLength(38400);
  });
});
