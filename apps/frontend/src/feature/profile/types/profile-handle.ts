import * as v from "valibot";

export const handleFormSchema = v.object({
  handle: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "IDを入力してください"),
    v.regex(/^\S+$/, "IDに空白は使えません"),
  ),
});

export type HandleFormSchema = v.InferOutput<typeof handleFormSchema>;
