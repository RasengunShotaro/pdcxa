"use server";

import { rePds } from "@/db/schema";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { currentUser } from "@clerk/nextjs/server";
import * as v from "valibot";

const createRePdSchema = v.object({
  pdId: v.string(),
  content: v.pipe(
    v.string(),
    v.maxLength(200, "RePDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "RePDを入力してください")
  ),
});

export const createRePd = actionClient
  .schema(createRePdSchema)
  .action(async ({ parsedInput: { pdId, content } }) => {
    const user = await currentUser();
    if (!user) {
      throw new Error("ユーザーが認証されていません。");
    }
    const userId = user.id;

    const newRePd = {
      pdId,
      content,
      createdAt: new Date(),
      userId: `${userId}`,
    };

    await db.insert(rePds).values(newRePd);

    return;
  });
