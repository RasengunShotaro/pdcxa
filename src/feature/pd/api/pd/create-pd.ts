"use server";

import { pds } from "@/db/schema";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { currentUser } from "@clerk/nextjs/server";
import * as v from "valibot";

const createPdSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(200, "PDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "PDを入力してください")
  ),
});

export const createPd = actionClient
  .schema(createPdSchema)
  .action(async ({ parsedInput: { content } }) => {
    const user = await currentUser();
    if (!user) {
      throw new Error("ユーザーが認証されていません。");
    }

    const newPd = {
      content,
      createdAt: new Date(),
      userId: `${user.id}`,
    };

    await db.insert(pds).values(newPd);

    return;
  });
