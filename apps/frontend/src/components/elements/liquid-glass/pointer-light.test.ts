import { describe, expect, it } from "vitest";
import { ガラスに当たる光を求める } from "./pointer-light";

const ガラス = { left: 100, top: 200, width: 300, height: 80 };

describe("ガラスに当たる光を求める", () => {
  it("光の位置をガラスの左上からの距離で返す", () => {
    const light = ガラスに当たる光を求める({
      pointer: { x: 150, y: 230 },
      rect: ガラス,
    });

    expect(light).toMatchObject({ x: 50, y: 30 });
  });

  it("ポインターがガラスの上にあるときは最も強く照らす", () => {
    const light = ガラスに当たる光を求める({
      pointer: { x: 250, y: 240 },
      rect: ガラス,
    });

    expect(light.intensity).toBe(1);
  });

  it("ポインターがガラスから離れるほど弱く照らす", () => {
    const near = ガラスに当たる光を求める({
      pointer: { x: 430, y: 240 },
      rect: ガラス,
    });
    const far = ガラスに当たる光を求める({
      pointer: { x: 520, y: 240 },
      rect: ガラス,
    });

    expect(near.intensity).toBeGreaterThan(far.intensity);
    expect(far.intensity).toBeGreaterThan(0);
  });

  it("ポインターが遠くにあるときは照らさない", () => {
    const light = ガラスに当たる光を求める({
      pointer: { x: 2000, y: 1500 },
      rect: ガラス,
    });

    expect(light.intensity).toBe(0);
  });
});
