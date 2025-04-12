"use server";

import { rePds } from "@/db/schema";
import { db } from "@/lib/db";
import type { Pd } from "../types";

export const createRePd = async (
  pdId: string,
  content: string,
  userId: string
): Promise<Pd> => {
  const newRePd = {
    pdId,
    content,
    createdAt: new Date(),
    userId: `${userId}`,
  };

  try {
    const [insertedRePd] = await db.insert(rePds).values(newRePd).returning({
      id: rePds.id,
      pdId: rePds.pdId,
      content: rePds.content,
      createdAt: rePds.createdAt,
      userId: rePds.userId,
    });

    return insertedRePd;
  } catch (error) {
    console.error("RePDの保存に失敗しました:", error);
    throw error;
  }
};
