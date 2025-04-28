import * as v from "valibot";

export const invitationFormSchema = v.object({
  mail: v.pipe(v.string(), v.email("メールアドレスの形式が正しくありません")),
});

export type InvitationFormSchema = v.InferOutput<typeof invitationFormSchema>;
