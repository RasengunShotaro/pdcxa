import * as v from "valibot";
import { describe, expect, test } from "vitest";
import { rePdComposerSchema } from "./repd-composer-schema";

const validate = (content: string) =>
  v.safeParse(rePdComposerSchema, { content });

describe("rePdComposerSchema", () => {
  test("通常の本文は通る", () => {
    expect(validate("とても参考になりました").success).toBe(true);
  });

  test("空白のみは弾く", () => {
    const result = validate("   \n  ");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe("空白だけでは返信できません");
    }
  });

  test("200文字ちょうどは通る", () => {
    expect(validate("あ".repeat(200)).success).toBe(true);
  });

  test("201文字は弾く", () => {
    const result = validate("あ".repeat(201));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe("200文字以内で入力してください");
    }
  });
});
