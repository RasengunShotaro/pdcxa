const 伏せ字の代わりの文字 = "0";

interface 写す入力欄 {
  readonly type: string;
  readonly autocomplete: string;
  readonly value: string;
}

interface 写した入力欄の見た目 {
  readonly type: string;
  readonly value: string;
}

const パスワードの欄か = ({ type, autocomplete }: 写す入力欄): boolean =>
  type === "password" || autocomplete.includes("password");

export const 演出に写す入力欄の見た目 = (
  input: 写す入力欄,
): 写した入力欄の見た目 =>
  パスワードの欄か(input)
    ? {
        type: "password",
        value: 伏せ字の代わりの文字.repeat(input.value.length),
      }
    : { type: input.type, value: input.value };
