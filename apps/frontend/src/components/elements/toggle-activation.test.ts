import { describe, expect, it } from "vitest";
import { オンに切り替わったかを判定する } from "./toggle-activation";

describe("オンに切り替わったかを判定する", () => {
  it("オフからオンになったときは弾ませる", () => {
    const activated = オンに切り替わったかを判定する({
      previous: false,
      next: true,
    });

    expect(activated).toBe(true);
  });

  it("オンからオフに戻したときは弾ませない", () => {
    const activated = オンに切り替わったかを判定する({
      previous: true,
      next: false,
    });

    expect(activated).toBe(false);
  });

  it("オンのまま変わらないときは弾ませない", () => {
    const activated = オンに切り替わったかを判定する({
      previous: true,
      next: true,
    });

    expect(activated).toBe(false);
  });
});
