import { describe, expect, it } from "vitest";
import { toClerkError, toDatabaseError, toStorageError } from "./error-mapping";

describe("toDatabaseError", () => {
  it("DBエラーからエラーコードと制約名を取り出す", () => {
    const pgError = Object.assign(new Error("duplicate key value"), {
      code: "23505",
      constraint: "pd_likes_pkey",
    });

    const result = toDatabaseError(pgError);

    expect(result.message).toBe("duplicate key value");
    expect(result.code).toBe("23505");
    expect(result.constraint).toBe("pd_likes_pkey");
  });

  it("構造を持たない値はメッセージだけ文字列化しエラーコードは持たせない", () => {
    const result = toDatabaseError("接続に失敗しました");

    expect(result.message).toBe("接続に失敗しました");
    expect(result.code).toBeUndefined();
    expect(result.constraint).toBeUndefined();
  });
});

describe("toClerkError", () => {
  it("認証サービスのエラー応答からHTTPステータスと先頭エラーのコードと詳細文言を取り出す", () => {
    const clerkError = Object.assign(new Error("Unprocessable Entity"), {
      status: 422,
      errors: [
        {
          code: "form_identifier_exists",
          message: "exists",
          longMessage: "その識別子は既に使われています",
        },
      ],
    });

    const result = toClerkError(clerkError);

    expect(result.status).toBe(422);
    expect(result.code).toBe("form_identifier_exists");
    expect(result.message).toBe("その識別子は既に使われています");
  });

  it("構造化されたエラー詳細が無ければ例外メッセージをそのまま使う", () => {
    const result = toClerkError(new Error("network down"));

    expect(result.message).toBe("network down");
    expect(result.status).toBeUndefined();
    expect(result.code).toBeUndefined();
  });
});

describe("toStorageError", () => {
  it("Error の message を保持する", () => {
    const result = toStorageError(new Error("R2 upload failed"));

    expect(result.message).toBe("R2 upload failed");
  });
});
