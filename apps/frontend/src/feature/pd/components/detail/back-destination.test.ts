import { describe, expect, it } from "vitest";
import { backDestination } from "./back-destination";

describe("backDestination", () => {
  it("サイト内に戻れる履歴があるときは直前の画面へ戻る", () => {
    expect(
      backDestination({
        canGoBack: true,
        referrer: "",
        origin: "https://pdcxa.com",
      }),
    ).toBe("history");
  });

  it("サイト内に戻れる履歴が無いときは外部から来ていてもホームへ戻る", () => {
    expect(
      backDestination({
        canGoBack: false,
        referrer: "https://pdcxa.com/user/taro",
        origin: "https://pdcxa.com",
      }),
    ).toBe("home");
  });

  it("履歴を判定できないブラウザでサイト内の画面から来たときは直前の画面へ戻る", () => {
    expect(
      backDestination({
        canGoBack: undefined,
        referrer: "https://pdcxa.com/user/taro",
        origin: "https://pdcxa.com",
      }),
    ).toBe("history");
  });

  it("履歴を判定できないブラウザで外部サイトから来たときはホームへ戻る", () => {
    expect(
      backDestination({
        canGoBack: undefined,
        referrer: "https://example.com/share",
        origin: "https://pdcxa.com",
      }),
    ).toBe("home");
  });

  it("履歴を判定できないブラウザで URL を直接開いたときはホームへ戻る", () => {
    expect(
      backDestination({
        canGoBack: undefined,
        referrer: "",
        origin: "https://pdcxa.com",
      }),
    ).toBe("home");
  });

  it("ドメイン名の前方一致だけの別サイトから来たときはホームへ戻る", () => {
    expect(
      backDestination({
        canGoBack: undefined,
        referrer: "https://pdcxa.com.evil.example/",
        origin: "https://pdcxa.com",
      }),
    ).toBe("home");
  });
});
