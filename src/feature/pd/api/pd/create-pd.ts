"use server";

import { pds } from "@/db/schema";
import { db } from "@/lib/db";
import type { Pd } from "../../types";

export const createPd = async (
  content: string,
  userId: string
): Promise<Pd> => {
  const newPd = {
    content,
    createdAt: new Date(),
    userId: `${userId}`,
  };

  try {
    const [insertedPd] = await db.insert(pds).values(newPd).returning({
      id: pds.id,
      content: pds.content,
      createdAt: pds.createdAt,
      userId: pds.userId,
    });

    return insertedPd;
  } catch (error) {
    console.error("PDの保存に失敗しました:", error);
    throw error;
  }
};
