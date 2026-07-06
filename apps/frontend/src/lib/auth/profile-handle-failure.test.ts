import { describe, expect, it } from "vitest";
import { clerkCodesToHandleFailureReason } from "./profile-handle-failure";

describe("ID 変更の失敗理由の判定", () => {
  it("既に使われているIDのときは重複として扱う", () => {
    const reason = clerkCodesToHandleFailureReason(["form_identifier_exists"]);

    expect(reason).toBe("taken");
  });

  it("文字数が規定外のときは長さ違反として扱う", () => {
    const reason = clerkCodesToHandleFailureReason([
      "form_username_invalid_length",
    ]);

    expect(reason).toBe("invalidLength");
  });

  it("使えない文字が含まれるときは文字種違反として扱う", () => {
    const reason = clerkCodesToHandleFailureReason([
      "form_username_invalid_character",
    ]);

    expect(reason).toBe("invalidCharacter");
  });

  it("入力形式が不正なときは文字種違反として扱う", () => {
    const reason = clerkCodesToHandleFailureReason([
      "form_param_format_invalid",
    ]);

    expect(reason).toBe("invalidCharacter");
  });

  it("数字だけのIDのときは英字必須違反として扱う", () => {
    const reason = clerkCodesToHandleFailureReason([
      "form_username_needs_non_number_char",
    ]);

    expect(reason).toBe("needsNonNumberChar");
  });

  it("未知のコードだけのときは原因不明として扱う", () => {
    const reason = clerkCodesToHandleFailureReason(["something_unexpected"]);

    expect(reason).toBe("unknown");
  });

  it("複数の原因のうち特定できる最初の理由を優先する", () => {
    const reason = clerkCodesToHandleFailureReason([
      "something_unexpected",
      "form_identifier_exists",
    ]);

    expect(reason).toBe("taken");
  });

  it("特定できる理由が複数あるときは並び順で先頭の理由を採用する", () => {
    const reason = clerkCodesToHandleFailureReason([
      "form_username_invalid_length",
      "form_identifier_exists",
    ]);

    expect(reason).toBe("invalidLength");
  });

  it("原因が何も無いときは原因不明として扱う", () => {
    const reason = clerkCodesToHandleFailureReason([]);

    expect(reason).toBe("unknown");
  });
});
