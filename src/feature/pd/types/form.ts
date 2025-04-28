import * as v from "valibot";

export const pdFormSchema = v.object({
  pd: v.pipe(
    v.string(),
    v.maxLength(200, "PDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "PDを入力してください")
  ),
});

export type PdFormSchema = v.InferOutput<typeof pdFormSchema>;
