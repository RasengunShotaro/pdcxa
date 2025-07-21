import * as v from "valibot";

export const checkEmailFormSchema = v.object({
  email: v.pipe(v.string(), v.email("メールアドレスの形式が正しくありません")),
});

export type CheckEmailFormSchema = v.InferOutput<typeof checkEmailFormSchema>;

export const resetPasswordFormSchema = v.pipe(
  v.object({
    code: v.pipe(
      v.string(),
      v.length(6, "確認コードは6文字である必要があります"),
    ),
    password: v.pipe(
      v.string(),
      v.minLength(8, "パスワードは8文字以上である必要があります"),
    ),
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "パスワードが一致しません",
    ),
    ["confirmPassword"],
  ),
);

export type ResetPasswordFormSchema = v.InferOutput<
  typeof resetPasswordFormSchema
>;
