import * as v from "valibot";

export const checkEmailFormSchema = v.object({
  email: v.pipe(v.string(), v.email("メールアドレスの形式が正しくありません")),
});

export type CheckEmailFormSchema = v.InferOutput<typeof checkEmailFormSchema>;
