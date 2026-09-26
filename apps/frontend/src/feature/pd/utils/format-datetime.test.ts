import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { formatAbsoluteDateTime, formatDateTime } from "./format-datetime";

describe("投稿の経過時間を計算する", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2020-01-01T12:00:00Z"));
  });

  test("経過時間が負の数の投稿に対しては、0秒前と扱われる", () => {
    const date = new Date("2020-01-01T12:00:01Z");

    const result = formatDateTime(date);

    expect(result).toBe("0秒前");
  });

  test("経過時間が60秒未満の投稿に対しては、経過秒数が返ってくる", () => {
    const date = new Date("2020-01-01T11:59:01Z");

    const result = formatDateTime(date);

    expect(result).toBe("59秒前");
  });

  describe("経過時間が1分以上1時間未満の投稿に対しては、経過分数が返ってくる", () => {
    test("経過時間が1分の場合、1分前と表示される", () => {
      const date = new Date("2020-01-01T11:59:00Z");

      const result = formatDateTime(date);

      expect(result).toBe("1分前");
    });

    test("経過時間が59分59秒の場合、59分前と表示される", () => {
      const date = new Date("2020-01-01T11:00:01Z");

      const result = formatDateTime(date);

      expect(result).toBe("59分前");
    });
  });

  describe("経過時間が1時間以上1日未満の投稿の場合", () => {
    test("経過時間が1時間の場合、1時間前と表示される", () => {
      const date = new Date("2020-01-01T11:00:00Z");

      const result = formatDateTime(date);

      expect(result).toBe("1時間前");
    });

    test("経過時間が23時間59分59秒の場合、23時間前と表示される", () => {
      const date = new Date("2019-12-31T12:00:01Z");

      const result = formatDateTime(date);

      expect(result).toBe("23時間前");
    });
  });

  test("経過時間が1日以上の場合、経過日数が返ってくる", () => {
    const date = new Date("2019-12-31T12:00:00Z");

    const result = formatDateTime(date);

    expect(result).toBe("1日前");
  });

  test("経過時間が7日未満の投稿は経過日数で表示される", () => {
    const date = new Date("2019-12-25T12:00:01Z");

    const result = formatDateTime(date);

    expect(result).toBe("6日前");
  });

  test("経過時間が7日以上で同じ年の投稿は月日で表示される", () => {
    vi.setSystemTime(new Date("2020-03-20T12:00:00Z"));
    const date = new Date("2020-03-13T12:00:00Z");

    const result = formatDateTime(date);

    expect(result).toBe("3月13日");
  });

  test("経過時間が7日以上で前の年の投稿は年月日で表示される", () => {
    const date = new Date("2019-12-20T12:00:00Z");

    const result = formatDateTime(date);

    expect(result).toBe("2019年12月20日");
  });

  test("Date型でない入力値の場合でも正しく経過時間が返ってくる", () => {
    const dateString = "2020-01-01T03:00:00.000Z";

    const result = formatDateTime(dateString as unknown as Date); // drizzleの返り値は型ガードを貫通することがある

    expect(result).toBe("9時間前");
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});

describe("formatAbsoluteDateTime", () => {
  test("投稿日時を日本時間の年月日と時刻で表示する", () => {
    const date = "2020-01-01T03:05:00.000Z";

    const result = formatAbsoluteDateTime(date);

    expect(result).toBe("2020年1月1日 12:05");
  });
});
