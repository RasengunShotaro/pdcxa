import * as v from "valibot";

export const nameFormSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.maxLength(10, "FirstNameが長すぎます。10文字以内で入力してください"),
    v.minLength(1, "FirstNameを1文字以上入力してください")
  ),
  lastName: v.pipe(
    v.string(),
    v.maxLength(10, "LastNameが長すぎます。10文字以内で入力してください"),
    v.minLength(1, "LastNameを1文字以上入力してください")
  ),
});

export type NameFormSchema = v.InferOutput<typeof nameFormSchema>;
