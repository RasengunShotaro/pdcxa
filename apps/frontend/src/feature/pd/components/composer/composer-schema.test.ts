import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import {
  canSubmitContent,
  composerSchema,
  isContentBlank,
  isContentOverLimit,
  MAX_CONTENT_LENGTH,
  MAX_IMAGE_BYTES,
  remainingChars,
} from "./composer-schema";

describe("remainingChars", () => {
  it("空文字のときは上限値をそのまま残数として返す", () => {
    expect(remainingChars("")).toBe(200);
  });

  it("入力した文字数だけ残数が減る", () => {
    expect(remainingChars("こんにちは")).toBe(195);
  });

  it("上限を超えた入力では残数が負になる", () => {
    const over = "a".repeat(MAX_CONTENT_LENGTH + 3);

    expect(remainingChars(over)).toBe(-3);
  });
});

describe("isContentBlank", () => {
  it("空白と改行だけの入力は空とみなす", () => {
    expect(isContentBlank("　 \n\t ")).toBe(true);
  });

  it("空白以外の文字が含まれていれば空ではない", () => {
    expect(isContentBlank("  あ  ")).toBe(false);
  });
});

describe("isContentOverLimit", () => {
  it("上限ちょうどは超過とみなさない", () => {
    expect(isContentOverLimit("a".repeat(MAX_CONTENT_LENGTH))).toBe(false);
  });

  it("上限を1文字でも超えると超過とみなす", () => {
    expect(isContentOverLimit("a".repeat(MAX_CONTENT_LENGTH + 1))).toBe(true);
  });
});

describe("canSubmitContent", () => {
  it("内容があり上限内なら送信できる", () => {
    expect(canSubmitContent("今日のPD")).toBe(true);
  });

  it("空白だけのときは送信できない", () => {
    expect(canSubmitContent("   ")).toBe(false);
  });

  it("上限を超えているときは送信できない", () => {
    expect(canSubmitContent("a".repeat(MAX_CONTENT_LENGTH + 1))).toBe(false);
  });
});

const messagesOf = (input: { content: string; image?: File }): string[] => {
  const result = safeParse(composerSchema, input);
  return result.success ? [] : result.issues.map((issue) => issue.message);
};

const imageOfBytes = (bytes: number): File =>
  new File([new Uint8Array(bytes)], "photo.png", { type: "image/png" });

describe("composerSchema", () => {
  it("本文だけの投稿を受け付ける", () => {
    expect(messagesOf({ content: "今日のPD" })).toEqual([]);
  });

  it("空白だけの本文を拒否する", () => {
    expect(messagesOf({ content: "   " })).toContain(
      "空白だけでは投稿できません",
    );
  });

  it("5MB以下の画像付き投稿を受け付ける", () => {
    expect(
      messagesOf({ content: "画像付き", image: imageOfBytes(MAX_IMAGE_BYTES) }),
    ).toEqual([]);
  });

  it("5MBを超える画像を拒否する", () => {
    expect(
      messagesOf({
        content: "画像付き",
        image: imageOfBytes(MAX_IMAGE_BYTES + 1),
      }),
    ).toContain("画像は5MB以下にしてください");
  });
});
