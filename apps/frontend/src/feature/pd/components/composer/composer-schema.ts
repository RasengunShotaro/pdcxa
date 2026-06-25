import * as v from "valibot";

export const MAX_CONTENT_LENGTH = 200;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const composerSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(
      MAX_CONTENT_LENGTH,
      `${MAX_CONTENT_LENGTH}文字以内で入力してください`,
    ),
    v.check((value) => value.trim().length > 0, "空白だけでは投稿できません"),
  ),
  image: v.optional(
    v.pipe(
      v.file("画像ファイルを選択してください"),
      v.maxSize(
        MAX_IMAGE_BYTES,
        `画像は${MAX_IMAGE_BYTES / 1024 / 1024}MB以下にしてください`,
      ),
    ),
  ),
});

export type ComposerSchema = v.InferOutput<typeof composerSchema>;

export const contentLength = (content: string): number => content.length;

export const remainingChars = (content: string): number =>
  MAX_CONTENT_LENGTH - contentLength(content);

export const isContentOverLimit = (content: string): boolean =>
  contentLength(content) > MAX_CONTENT_LENGTH;

export const isContentBlank = (content: string): boolean =>
  content.trim().length === 0;

export const canSubmitContent = (content: string): boolean =>
  !isContentBlank(content) && !isContentOverLimit(content);
