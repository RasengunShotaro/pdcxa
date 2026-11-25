import { describe, expect, it } from "vitest";
import { 演出に写す入力欄の見た目 } from "./copied-input-value";

const 入力欄 = (
  overrides: Partial<Parameters<typeof 演出に写す入力欄の見た目>[0]> = {},
) => ({
  type: "text",
  autocomplete: "",
  value: "",
  ...overrides,
});

describe("演出に写す入力欄の見た目", () => {
  it("パスワードは同じ長さの伏せ字の見た目だけを写し、本物の文字は写さない", () => {
    const result = 演出に写す入力欄の見た目(
      入力欄({ type: "password", value: "secret12" }),
    );

    expect(result).toEqual({ type: "password", value: "00000000" });
  });

  it("パスワードを表示に切り替えていても、伏せ字の見た目で写す", () => {
    const result = 演出に写す入力欄の見た目(
      入力欄({
        type: "text",
        autocomplete: "current-password",
        value: "secret12",
      }),
    );

    expect(result).toEqual({ type: "password", value: "00000000" });
  });

  it("メールアドレスは入力したまま写す", () => {
    const result = 演出に写す入力欄の見た目(
      入力欄({ type: "email", value: "natsu@example.com" }),
    );

    expect(result).toEqual({ type: "email", value: "natsu@example.com" });
  });
});
