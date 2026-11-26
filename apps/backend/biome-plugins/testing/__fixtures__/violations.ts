import { expect, it } from "bun:test";

declare const 換算する: (pt: number) => number;
declare const 一覧: readonly string[];
declare const 結果: { kind: string; reason: string };
declare const 前: object;
declare const 後: object;
declare const 入力: { 利用量: number };

it("違反", async () => {
  expect(換算する(20)).toBe(Math.round((20 * 96) / 72));
  expect(換算する(20)).toBe(入力.利用量 * 1.25);
  expect(換算する(20)).toBeCloseTo(入力.利用量 / 3, 6);
  expect(結果.kind === "failed" ? 結果.reason : "").toBe("x");
  expect(結果.kind === "failed" && 結果.reason).toBe("x");
  expect(一覧.length).toBe(2);
  expect(一覧.includes("a")).toBe(true);
  expect(結果.kind === "failed").toBe(true);
  expect(JSON.stringify(前)).toBe(JSON.stringify(後));
  expect(結果.kind).toBe(結果.kind);
  expect(true).toBe(true);
  await Bun.sleep(10);
  await new Promise((resolve) => setTimeout(resolve, 10));
  const 偽物 = {} as unknown as typeof 結果;
  expect(偽物).toEqual(結果);
  expect(Promise.reject(new Error("x"))).rejects.toThrow();
  expect(Promise.resolve(1)).resolves.toBe(1);
  expect<string>(結果.kind === "failed" ? 結果.reason : "").toBe("x");
  expect<number>(一覧.length).toBe(2);
  expect<boolean>(一覧.includes("a")).toBe(true);
  expect<boolean>(結果.kind === "failed").toBe(true);
  expect<number>(換算する(20)).toBe(入力.利用量 * 2);
  expect<string>(JSON.stringify(前)).toBe(JSON.stringify(後));
  await new Promise<void>((resolve) => setTimeout(resolve, 10));
  await new Promise((resolve) => {
    setTimeout(() => resolve(undefined), 10);
  });
  expect(結果.kind === "failed" && 結果.reason, "理由").toBe("x");
  expect(一覧.length, "件数").toBe(2);
});
