import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { nameFormSchema } from "./profile-name";

const aName = (
  overrides: Partial<{ firstName: string; lastName: string }> = {},
) => ({
  firstName: "Taro",
  lastName: "Yamada",
  ...overrides,
});

describe("表示名フォームのバリデーション", () => {
  it("1〜10文字の姓名を受け付ける", () => {
    const result = v.safeParse(nameFormSchema, aName());

    expect(result.success).toBe(true);
  });

  it("空のFirst Nameを拒否する", () => {
    const result = v.safeParse(nameFormSchema, aName({ firstName: "" }));

    expect(result.success).toBe(false);
  });

  it("11文字以上のLast Nameを拒否する", () => {
    const result = v.safeParse(
      nameFormSchema,
      aName({ lastName: "a".repeat(11) }),
    );

    expect(result.success).toBe(false);
  });

  it("ちょうど10文字は受け付ける", () => {
    const result = v.safeParse(
      nameFormSchema,
      aName({ firstName: "a".repeat(10) }),
    );

    expect(result.success).toBe(true);
  });
});
