import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { handleFormSchema } from "./profile-handle";

const aHandle = (overrides: Partial<{ handle: string }> = {}) => ({
  handle: "pdcxa",
  ...overrides,
});

describe("ID フォームの入力前チェック", () => {
  it("空白を含まない入力を受け付ける", () => {
    const result = v.safeParse(
      handleFormSchema,
      aHandle({ handle: "pd_cxa1" }),
    );

    expect(result.success).toBe(true);
  });

  it("前後の空白は取り除いて受け付ける", () => {
    const result = v.safeParse(
      handleFormSchema,
      aHandle({ handle: "  pdcxa  " }),
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.handle).toBe("pdcxa");
    }
  });

  it("空のIDを拒否する", () => {
    const result = v.safeParse(handleFormSchema, aHandle({ handle: "" }));

    expect(result.success).toBe(false);
  });

  it("途中に空白を含むIDを拒否する", () => {
    const result = v.safeParse(handleFormSchema, aHandle({ handle: "pd cxa" }));

    expect(result.success).toBe(false);
  });
});
