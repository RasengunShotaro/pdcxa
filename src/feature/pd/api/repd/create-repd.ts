"use server";

import { rePds } from "@/db/schema";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import * as v from "valibot";

const createRePdSchema = v.object({
  pdId: v.string(),
  content: v.pipe(
    v.string(),
    v.maxLength(200, "RePDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "RePDを入力してください")
  ),
  userId: v.string(),
});

export const createRePd = actionClient
  .schema(createRePdSchema)
  .action(async ({ parsedInput: { pdId, content, userId } }) => {
    const newRePd = {
      pdId,
      content,
      createdAt: new Date(),
      userId: `${userId}`,
    };

    try {
      await db.insert(rePds).values(newRePd);

      return;
    } catch (error) {
      console.error("RePDの保存に失敗しました:", error);
      throw error;
    }
  });
