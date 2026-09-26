import { describe, expect, test } from "vitest";
import { 件数を短く表す } from "./format-count";

describe("件数を短く表す", () => {
  test("1万未満はそのままの数字で表す", () => {
    expect(件数を短く表す(0)).toBe("0");
    expect(件数を短く表す(9999)).toBe("9999");
  });

  test("1万以上は万の単位で小数 1 桁まで表す", () => {
    expect(件数を短く表す(10000)).toBe("1万");
    expect(件数を短く表す(123456)).toBe("12.3万");
    expect(件数を短く表す(9876543)).toBe("987.7万");
  });

  test("1億以上は億の単位で表す", () => {
    expect(件数を短く表す(123456789)).toBe("1.2億");
  });
});
