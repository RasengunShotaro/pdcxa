import { z } from "zod";

export const pdFormSchema = z.object({
  pd: z
    .string()
    .max(200, {
      message: "PDが長すぎます。200文字以内で入力してください",
    })
    .min(1, {
      message: "PDを入力してください",
    }),
});

export type PdFormSchema = z.infer<typeof pdFormSchema>;
