"use server";

import { pds } from "@/db/schema";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import * as v from "valibot";

const createPdSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(200, "PDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "PDを入力してください")
  ),
  userId: v.string(),
});

export const createPd = actionClient
  .schema(createPdSchema)
  .action(async ({ parsedInput: { content, userId } }) => {
    const newPd = {
      content,
      createdAt: new Date(),
      userId: `${userId}`,
    };

    try {
      await db.insert(pds).values(newPd);

      return;
    } catch (error) {
      console.error("PDの保存に失敗しました:", error);
      throw error;
    }
  });
