import { describe, expect, it } from "vitest";
import { ApiError } from "./api-error";
import { errorDisplay, errorDisplayForStatus } from "./error-message";

describe("HTTP ステータスからユーザー向け文言を決める", () => {
  it("401 は再ログインを促す文言にする", () => {
    const result = errorDisplayForStatus(401);

    expect(result).toEqual({ kind: "auth", message: "ログインが必要です" });
  });

  it("サーバー障害は再試行を促す文言にする", () => {
    const result = errorDisplayForStatus(503);

    expect(result).toEqual({
      kind: "retryable",
      message: "通信に失敗しました。再試行してください",
    });
  });

  it("ステータス不明の通信失敗は再試行を促す文言にする", () => {
    const result = errorDisplayForStatus(null);

    expect(result).toEqual({
      kind: "retryable",
      message: "通信に失敗しました。再試行してください",
    });
  });

  it("想定外のクライアントエラーは予期しないエラー文言にする", () => {
    const result = errorDisplayForStatus(404);

    expect(result).toEqual({
      kind: "fatal",
      message: "予期しないエラーが発生しました",
    });
  });
});

describe("発生したエラーからユーザー向け文言を決める", () => {
  it("API エラーの保持するステータスで文言を選ぶ", () => {
    const result = errorDisplay(new ApiError(500));

    expect(result.kind).toBe("retryable");
  });

  it("ステータスを持たない例外は通信失敗として扱う", () => {
    const result = errorDisplay(new TypeError("Failed to fetch"));

    expect(result.kind).toBe("retryable");
  });
});
