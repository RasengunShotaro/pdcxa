import * as v from "valibot";

export const signinFormSchema = v.object({
  email: v.pipe(v.string(), v.email("メールアドレスの形式が正しくありません")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "パスワードは8文字以上である必要があります"),
  ),
});

export type SigninFormSchema = v.InferOutput<typeof signinFormSchema>;
