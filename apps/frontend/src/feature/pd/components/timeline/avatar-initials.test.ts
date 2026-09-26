import { describe, expect, test } from "vitest";
import { avatarInitials } from "./avatar-initials";

describe("avatarInitials", () => {
  test("姓名の表示名は先頭の1文字だけをイニシャルにする", () => {
    expect(avatarInitials("太郎 山田")).toBe("太");
  });

  test("英字名は先頭1文字を大文字にする", () => {
    expect(avatarInitials("john doe")).toBe("J");
  });

  test("単一の語は先頭1文字を返す", () => {
    expect(avatarInitials("花子")).toBe("花");
  });

  test("前後の空白は無視して先頭の1文字を返す", () => {
    expect(avatarInitials("  花子")).toBe("花");
  });

  test("空文字のときはプレースホルダを返す", () => {
    expect(avatarInitials("   ")).toBe("?");
  });

  test("先頭が絵文字の名前は絵文字1つをそのまま返す", () => {
    expect(avatarInitials("😀 田中")).toBe("😀");
  });

  test("複数の符号で組み立てた絵文字も分割せずに返す", () => {
    expect(avatarInitials("👨‍👩‍👧 家族")).toBe("👨‍👩‍👧");
  });

  test("国旗の絵文字も分割せずに返す", () => {
    expect(avatarInitials("🇯🇵 日本")).toBe("🇯🇵");
  });
});
