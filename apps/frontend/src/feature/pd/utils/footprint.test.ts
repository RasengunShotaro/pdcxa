import { describe, expect, it } from "vitest";
import {
  type FootprintDay,
  あしあとのマスを作る,
  あしあとの件数を表す,
  あしあとの日付を表す,
  あしあとを週ごとに並べる,
  活動の濃さを決める,
  矢印キーで移る日を決める,
} from "./footprint";

const 一日 = (overrides: Partial<FootprintDay> = {}): FootprintDay => ({
  date: "2026-11-25",
  pdCount: 0,
  rePdCount: 0,
  likeCount: 0,
  ...overrides,
});

const 連続した日々 = ({
  start,
  count,
}: {
  start: string;
  count: number;
}): FootprintDay[] =>
  Array.from({ length: count }, (_, index) =>
    一日({
      date: new Date(Date.parse(`${start}T00:00:00Z`) + index * 86_400_000)
        .toISOString()
        .slice(0, 10),
    }),
  );

describe("活動の濃さを決める", () => {
  it("活動が無い日は色を付けない", () => {
    expect(活動の濃さを決める({ count: 0, max: 8 })).toBe(0);
  });

  it("いちばん活動した日はいちばん濃くする", () => {
    expect(活動の濃さを決める({ count: 8, max: 8 })).toBe(4);
  });

  it("少しだけ活動した日はいちばん薄い色にする", () => {
    expect(活動の濃さを決める({ count: 1, max: 8 })).toBe(1);
  });

  it("いちばん活動した日の半分なら中くらいの濃さにする", () => {
    expect(活動の濃さを決める({ count: 4, max: 8 })).toBe(2);
  });
});

describe("あしあとのマスを作る", () => {
  it("PD と RePD を合わせた件数で日ごとの濃さを決める", () => {
    const days = [
      一日({ date: "2026-11-23" }),
      一日({ date: "2026-11-24", pdCount: 1, rePdCount: 1 }),
      一日({ date: "2026-11-25", pdCount: 3, rePdCount: 1 }),
    ];

    const cells = あしあとのマスを作る(days);

    expect(cells.map((cell) => cell.level)).toEqual([0, 2, 4]);
  });

  it("いいねをもらっただけの日には色を付けない", () => {
    const days = [
      一日({ date: "2026-11-24", likeCount: 9 }),
      一日({ date: "2026-11-25", pdCount: 1 }),
    ];

    const cells = あしあとのマスを作る(days);

    expect(cells.map((cell) => cell.level)).toEqual([0, 4]);
  });

  it("一度も活動していない期間はどの日にも色を付けない", () => {
    const days = [一日({ date: "2026-11-24" }), 一日({ date: "2026-11-25" })];

    const cells = あしあとのマスを作る(days);

    expect(cells.map((cell) => cell.level)).toEqual([0, 0]);
  });
});

describe("あしあとを週ごとに並べる", () => {
  it("水曜日は日曜始まりの週の 4 段目に置く", () => {
    const cells = あしあとのマスを作る([一日({ date: "2026-11-25" })]);

    const calendar = あしあとを週ごとに並べる(cells);

    expect(calendar.cells[0]).toMatchObject({ column: 0, row: 3 });
  });

  it("土曜日の次の日曜日は次の週の列の先頭に置く", () => {
    const cells = あしあとのマスを作る(
      連続した日々({ start: "2026-11-28", count: 2 }),
    );

    const calendar = あしあとを週ごとに並べる(cells);

    expect(calendar.cells[1]).toMatchObject({ column: 1, row: 0 });
  });

  it("木曜日から始まる 52 週間は 53 列に収まる", () => {
    const cells = あしあとのマスを作る(
      連続した日々({ start: "2025-11-27", count: 364 }),
    );

    const calendar = あしあとを週ごとに並べる(cells);

    expect(calendar.columnCount).toBe(53);
  });

  it("月が変わる週の列に、その月の目盛りを置く", () => {
    const cells = あしあとのマスを作る(
      連続した日々({ start: "2026-10-04", count: 42 }),
    );

    const calendar = あしあとを週ごとに並べる(cells);

    expect(calendar.months).toEqual([
      { column: 0, label: "10月" },
      { column: 4, label: "11月" },
    ]);
  });

  it("期間の先頭のすぐ後に月が変わるときは、先頭の月の目盛りを省く", () => {
    const cells = あしあとのマスを作る(
      連続した日々({ start: "2026-10-25", count: 21 }),
    );

    const calendar = あしあとを週ごとに並べる(cells);

    expect(calendar.months).toEqual([{ column: 1, label: "11月" }]);
  });

  it("日が無いときは何も並べない", () => {
    expect(あしあとを週ごとに並べる([])).toEqual({
      columnCount: 0,
      cells: [],
      months: [],
    });
  });
});

describe("あしあとの日付を表す", () => {
  it("月日と曜日で表す", () => {
    expect(あしあとの日付を表す("2026-11-25")).toBe("11月25日(水)");
  });
});

describe("あしあとの件数を表す", () => {
  it("PD・RePD・いいねの件数を並べる", () => {
    expect(
      あしあとの件数を表す(一日({ pdCount: 2, rePdCount: 1, likeCount: 3 })),
    ).toBe("PD 2件・RePD 1件・いいね 3件");
  });

  it("何も無かった日は活動なしと表す", () => {
    expect(あしあとの件数を表す(一日())).toBe("活動なし");
  });
});

describe("矢印キーで移る日を決める", () => {
  it("右を押すと 1 週間後の同じ曜日へ移る", () => {
    expect(
      矢印キーで移る日を決める({ index: 10, key: "ArrowRight", count: 364 }),
    ).toBe(17);
  });

  it("上を押すと前の日へ移る", () => {
    expect(
      矢印キーで移る日を決める({ index: 10, key: "ArrowUp", count: 364 }),
    ).toBe(9);
  });

  it("最後の週で右を押しても今の日にとどまる", () => {
    expect(
      矢印キーで移る日を決める({ index: 360, key: "ArrowRight", count: 364 }),
    ).toBe(360);
  });

  it("矢印以外のキーでは今の日にとどまる", () => {
    expect(矢印キーで移る日を決める({ index: 10, key: "a", count: 364 })).toBe(
      10,
    );
  });
});
