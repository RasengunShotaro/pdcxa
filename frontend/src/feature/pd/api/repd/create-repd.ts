"use server";

import * as v from "valibot";
import { getClient } from "@/lib/hono";
import { actionClient } from "@/lib/safe-action";

const createRePdSchema = v.object({
  pdId: v.string(),
  content: v.pipe(
    v.string(),
    v.maxLength(200, "RePDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "RePDを入力してください")
  ),
});

export const createRePd = actionClient
  .inputSchema(createRePdSchema)
  .action(async ({ parsedInput: { pdId, content } }) => {
    const client = await getClient();
    await client.repd.create.$post({
      json: {
        pdId,
        content,
      },
    });

    return;
  });
