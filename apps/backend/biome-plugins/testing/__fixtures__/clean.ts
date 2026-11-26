import { expect, it } from "bun:test";

declare const 換算する: (pt: number) => number;
declare const 一覧: readonly string[];
declare const 幅: readonly number[];
declare const 結果: { kind: string; reason: string };
declare const 鍵: (x: string) => string;

it("await した rejects / resolves", async () => {
  await expect(Promise.reject(new Error("x"))).rejects.toThrow();
  await expect(Promise.resolve(1)).resolves.toBe(1);
});

it("返した rejects", () => {
  return expect(Promise.reject(new Error("x"))).rejects.toThrow("x");
});

it("違反しない書き方", () => {
  expect(換算する(20)).toBe(27);
  expect(換算する(20)).toBe(100 * 1024 * 1024);
  expect(換算する(20)).toBeCloseTo(0.5 * 3, 6);
  expect(換算する(20)).toBe(1e3 * 2);
  expect(幅[1]).toBe(Math.max(...幅));
  expect(結果).toMatchObject({ kind: "failed", reason: "x" });
  expect(一覧).toHaveLength(2);
  expect(一覧).toContain("a");
  expect(一覧).not.toContain("b");
  expect(結果.kind).toBe("failed");
  expect(鍵("a")).toBe(鍵("a"));
  expect(`${結果.kind}`).toBe("failed");
  expect(換算する(20)).toBe(
    100 *
      1024 *
      1024,
  );
});
