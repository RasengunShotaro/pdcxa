import { describe, expect, it } from "vitest";
import { トーストのテーマを決める } from "./sonner-theme";

describe("トーストのテーマを決める", () => {
  it("画面がダークで表示されているときはダークにする", () => {
    expect(
      トーストのテーマを決める({
        forcedTheme: undefined,
        resolvedTheme: "dark",
      }),
    ).toBe("dark");
  });

  it("画面がライトで表示されているときはライトにする", () => {
    expect(
      トーストのテーマを決める({
        forcedTheme: undefined,
        resolvedTheme: "light",
      }),
    ).toBe("light");
  });

  it("ページがテーマを固定しているときは固定されたテーマに合わせる", () => {
    expect(
      トーストのテーマを決める({ forcedTheme: "dark", resolvedTheme: "light" }),
    ).toBe("dark");
  });

  it("ライトでもダークでもないテーマではライトにする", () => {
    expect(
      トーストのテーマを決める({
        forcedTheme: undefined,
        resolvedTheme: "legacy",
      }),
    ).toBe("light");
  });

  it("テーマがまだ決まっていないときはライトにする", () => {
    expect(
      トーストのテーマを決める({
        forcedTheme: undefined,
        resolvedTheme: undefined,
      }),
    ).toBe("light");
  });
});
