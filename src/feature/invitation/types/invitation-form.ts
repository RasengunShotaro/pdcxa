import { z } from "zod";

export const invitationFormSchema = z.object({
  mail: z.string().email({
    message: "メールアドレスの形式が正しくありません",
  }),
});

export type InvitationFormSchema = z.infer<typeof invitationFormSchema>;
