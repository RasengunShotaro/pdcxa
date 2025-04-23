"use server";

import { pds } from "@/db/schema";
import { db } from "@/lib/db";

export const createPd = async (content: string, userId: string) => {
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
};
