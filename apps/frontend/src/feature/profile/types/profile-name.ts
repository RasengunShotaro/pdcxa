import * as v from "valibot";

export const nameFormSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.maxLength(10, "表示名（前）は10文字以内で入力してください"),
    v.minLength(1, "表示名（前）を入力してください"),
  ),
  lastName: v.pipe(
    v.string(),
    v.maxLength(10, "表示名（後）は10文字以内で入力してください"),
    v.minLength(1, "表示名（後）を入力してください"),
  ),
});

export type NameFormSchema = v.InferOutput<typeof nameFormSchema>;
