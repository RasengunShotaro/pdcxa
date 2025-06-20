import * as v from "valibot";

export const imageFormSchema = v.object({
  image: v.pipe(
    v.blob("画像ファイルを選択してください"),
    v.maxSize(10 * 1024 * 1024, "ファイルサイズは10MB以下にしてください")
  ),
});

export type ImageFormSchema = v.InferOutput<typeof imageFormSchema>;
