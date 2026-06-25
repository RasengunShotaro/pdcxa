import * as v from "valibot";
import { describe, expect, test } from "vitest";
import { checkEmailFormSchema, resetPasswordFormSchema } from "./reset-form";

describe("checkEmailFormSchema", () => {
  test("正しいメールは通る", () => {
    expect(
      v.safeParse(checkEmailFormSchema, { email: "u@example.com" }).success,
    ).toBe(true);
  });

  test("メール形式が不正なら弾く", () => {
    const result = v.safeParse(checkEmailFormSchema, { email: "bad" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe(
        "メールアドレスの形式が正しくありません",
      );
    }
  });
});

describe("resetPasswordFormSchema", () => {
  const valid = {
    code: "123456",
    password: "password1",
    confirmPassword: "password1",
  };

  test("コード6桁・パスワード一致なら通る", () => {
    expect(v.safeParse(resetPasswordFormSchema, valid).success).toBe(true);
  });

  test("確認コードが6桁でなければ弾く", () => {
    const result = v.safeParse(resetPasswordFormSchema, {
      ...valid,
      code: "123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe(
        "確認コードは6文字である必要があります",
      );
    }
  });

  test("パスワードが8文字未満なら弾く", () => {
    const result = v.safeParse(resetPasswordFormSchema, {
      ...valid,
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  test("パスワードと再入力が一致しなければ弾く", () => {
    const result = v.safeParse(resetPasswordFormSchema, {
      ...valid,
      confirmPassword: "different1",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.issues.some((i) => i.message === "パスワードが一致しません"),
      ).toBe(true);
    }
  });
});
