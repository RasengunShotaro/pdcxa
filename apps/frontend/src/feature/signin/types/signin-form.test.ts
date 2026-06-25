import * as v from "valibot";
import { describe, expect, test } from "vitest";
import { signinFormSchema } from "./signin-form";

const validate = (input: { email: string; password: string }) =>
  v.safeParse(signinFormSchema, input);

describe("signinFormSchema", () => {
  test("正しいメールと8文字以上のパスワードは通る", () => {
    expect(
      validate({ email: "user@example.com", password: "password1" }).success,
    ).toBe(true);
  });

  test("メール形式が不正なら弾く", () => {
    const result = validate({ email: "not-an-email", password: "password1" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe(
        "メールアドレスの形式が正しくありません",
      );
    }
  });

  test("パスワードが8文字未満なら弾く", () => {
    const result = validate({ email: "user@example.com", password: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe(
        "パスワードは8文字以上である必要があります",
      );
    }
  });
});
