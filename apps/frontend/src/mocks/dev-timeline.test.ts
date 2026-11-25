import { describe, expect, it } from "vitest";
import { 開発用のタイムラインを1ページ分返す } from "./dev-timeline";

describe("開発用のタイムラインを1ページ分返す", () => {
  it("最初のページでは新しい順に PD を返す", () => {
    const page = 開発用のタイムラインを1ページ分返す({ cursor: null });

    const [first, second] = page.items;
    expect(first.createdAt > second.createdAt).toBe(true);
  });

  it("続きがあるときは、次のページを読む手がかりを返す", () => {
    const page = 開発用のタイムラインを1ページ分返す({ cursor: null });

    expect(page.nextCursor).toBeDefined();
  });

  it("次のページは前のページと重ならない PD を返す", () => {
    const first = 開発用のタイムラインを1ページ分返す({ cursor: null });

    const second = 開発用のタイムラインを1ページ分返す({
      cursor: first.nextCursor ?? null,
    });

    const firstIds = new Set(first.items.map((pd) => pd.id));
    expect(second.items.some((pd) => firstIds.has(pd.id))).toBe(false);
  });

  it("最後のページでは続きの手がかりを返さない", () => {
    const pages = [開発用のタイムラインを1ページ分返す({ cursor: null })];
    while (pages[pages.length - 1].nextCursor) {
      pages.push(
        開発用のタイムラインを1ページ分返す({
          cursor: pages[pages.length - 1].nextCursor ?? null,
        }),
      );
    }

    expect(pages.length).toBeGreaterThan(2);
  });

  it("画像付きの PD が混ざっている", () => {
    const page = 開発用のタイムラインを1ページ分返す({ cursor: null });

    expect(page.items.some((pd) => pd.imageFileName !== null)).toBe(true);
  });
});
