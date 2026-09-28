import { describe, expect, it } from "vitest";
import {
  未読バッジを弾ませるか,
  未読件数を表示用に整える,
  表示上の未読件数に丸める,
} from "./unread-count";

describe("未読バッジを弾ませるか", () => {
  it("未読が増えたら弾ませる", () => {
    const shouldPop = 未読バッジを弾ませるか({ previous: 2, next: 3 });

    expect(shouldPop).toBe(true);
  });

  it("未読が減ったら弾ませない", () => {
    const shouldPop = 未読バッジを弾ませるか({ previous: 3, next: 2 });

    expect(shouldPop).toBe(false);
  });

  it("未読が変わらなければ弾ませない", () => {
    const shouldPop = 未読バッジを弾ませるか({ previous: 3, next: 3 });

    expect(shouldPop).toBe(false);
  });

  it("未読が無い状態から現れるときは弾ませない", () => {
    const shouldPop = 未読バッジを弾ませるか({ previous: 0, next: 1 });

    expect(shouldPop).toBe(false);
  });
});

describe("表示上の未読件数に丸める", () => {
  it("99 件以下はそのままの件数にする", () => {
    const count = 表示上の未読件数に丸める(99);

    expect(count).toBe(99);
  });

  it("100 件を超えても 100 件として扱う", () => {
    const count = 表示上の未読件数に丸める(250);

    expect(count).toBe(100);
  });
});

describe("未読件数を表示用に整える", () => {
  it("99 件以下は件数をそのまま出す", () => {
    const label = 未読件数を表示用に整える(99);

    expect(label).toBe("99");
  });

  it("100 件以上は 99+ と出す", () => {
    const label = 未読件数を表示用に整える(100);

    expect(label).toBe("99+");
  });
});
