"use server";

import * as v from "valibot";
import { getClient } from "@/lib/hono";
import { actionClient } from "@/lib/safe-action";

const createGifPdSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(200, "PDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "PDを入力してください"),
  ),
  image: v.pipe(
    v.file(),
    v.check(
      (file) => file.type === "image/gif",
      "GIFファイルのみ対応しています",
    ),
  ),
});

export const createGifPd = actionClient
  .inputSchema(createGifPdSchema)
  .action(async ({ parsedInput: { content, image } }) => {
    const client = await getClient();

    await client.pd["create-gif"].$post({
      form: {
        content,
        image,
      },
    });

    return;
  });
