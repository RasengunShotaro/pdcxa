import { describe, expect, test } from "vitest";
import { avatarInitials } from "./avatar-initials";

describe("avatarInitials", () => {
  test("姓名から先頭2文字のイニシャルを作る", () => {
    expect(avatarInitials("田中 太郎")).toBe("田太");
  });

  test("英字名は大文字のイニシャルにする", () => {
    expect(avatarInitials("john doe")).toBe("JD");
  });

  test("単一の語は先頭1文字を返す", () => {
    expect(avatarInitials("花子")).toBe("花");
  });

  test("空文字のときはプレースホルダを返す", () => {
    expect(avatarInitials("   ")).toBe("?");
  });

  test("絵文字を含む名前でも先頭の1文字を壊さない", () => {
    expect(avatarInitials("😀 田中")).toBe("😀田");
  });
});
