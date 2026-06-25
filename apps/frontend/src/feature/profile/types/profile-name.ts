import * as v from "valibot";

export const nameFormSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.maxLength(10, "First Name は10文字以内で入力してください"),
    v.minLength(1, "First Name を入力してください"),
  ),
  lastName: v.pipe(
    v.string(),
    v.maxLength(10, "Last Name は10文字以内で入力してください"),
    v.minLength(1, "Last Name を入力してください"),
  ),
});

export type NameFormSchema = v.InferOutput<typeof nameFormSchema>;
