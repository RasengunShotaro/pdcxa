import * as v from "valibot";

export const pdFormSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(200, "PDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "PDを入力してください")
  ),
  image: v.optional(
    v.pipe(
      v.blob("画像ファイルを選択してください"),
      v.maxSize(5 * 1024 * 1024, "ファイルサイズは5MB以下にしてください")
    )
  ),
});

export type PdFormSchema = v.InferOutput<typeof pdFormSchema>;
