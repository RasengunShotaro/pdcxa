import { describe, expect, it } from "bun:test";

declare const 結果: { ok: boolean; reason: string };

describe("組込みルール", () => {
  it("条件が外れると何も確かめない", () => {
    if (!結果.ok) {
      expect(結果.reason).toBe("x");
    }
  });

  it("同じ名前", () => {
    expect(結果.ok).toBe(true);
  });

  it("同じ名前", () => {
    expect(結果.reason).toBe("x");
  });

  it.skip("後で書く", () => {});

  it("何も確かめない", () => {
    結果.reason.trim();
  });
});
