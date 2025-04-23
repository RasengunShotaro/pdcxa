"use server";

import { rePds } from "@/db/schema";
import { db } from "@/lib/db";

export const createRePd = async (
  pdId: string,
  content: string,
  userId: string
) => {
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
};
