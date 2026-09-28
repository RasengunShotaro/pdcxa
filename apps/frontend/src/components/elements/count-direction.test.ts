import { describe, expect, it } from "vitest";
import { 件数の変化の向きを決める } from "./count-direction";

describe("件数の変化の向きを決める", () => {
  it("初めて表示するときは動かさない", () => {
    const direction = 件数の変化の向きを決める({
      previous: undefined,
      next: 3,
    });

    expect(direction).toBe("none");
  });

  it("件数が増えたら上向きに動かす", () => {
    const direction = 件数の変化の向きを決める({ previous: 3, next: 4 });

    expect(direction).toBe("up");
  });

  it("件数が減ったら下向きに動かす", () => {
    const direction = 件数の変化の向きを決める({ previous: 4, next: 3 });

    expect(direction).toBe("down");
  });

  it("件数が変わらなければ動かさない", () => {
    const direction = 件数の変化の向きを決める({ previous: 4, next: 4 });

    expect(direction).toBe("none");
  });
});
