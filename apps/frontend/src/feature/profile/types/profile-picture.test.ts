import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { imageFormSchema } from "./profile-picture";

const anImageOfBytes = (bytes: number): Blob =>
  new Blob([new Uint8Array(bytes)], { type: "image/png" });

describe("プロフィール画像のバリデーション", () => {
  it("10MB以下の画像を受け付ける", () => {
    const result = v.safeParse(imageFormSchema, {
      image: anImageOfBytes(1024),
    });

    expect(result.success).toBe(true);
  });

  it("10MBちょうどの画像を受け付ける", () => {
    const result = v.safeParse(imageFormSchema, {
      image: anImageOfBytes(10 * 1024 * 1024),
    });

    expect(result.success).toBe(true);
  });

  it("10MBを超える画像を拒否する", () => {
    const result = v.safeParse(imageFormSchema, {
      image: anImageOfBytes(10 * 1024 * 1024 + 1),
    });

    expect(result.success).toBe(false);
  });

  it("画像以外の値を拒否する", () => {
    const result = v.safeParse(imageFormSchema, { image: "not-a-file" });

    expect(result.success).toBe(false);
  });
});
