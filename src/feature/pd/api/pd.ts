"use client";

import type { Pd } from "@/feature/pd/types";

const STORAGE_KEY = "pd_items";

export const pdApi = {
  getPds: async (): Promise<Pd[]> => {
    try {
      const storedPds = localStorage.getItem(STORAGE_KEY);
      if (!storedPds) return [];

      const parsedPds = JSON.parse(storedPds).map(
        (pd: Omit<Pd, "createdAt"> & { createdAt: string }) => ({
          ...pd,
          createdAt: new Date(pd.createdAt),
        }),
      );
      return parsedPds;
    } catch (error) {
      console.error("PDの読み込みに失敗しました:", error);
      return [];
    }
  },

  createPd: async (content: string): Promise<Pd> => {
    const newPd: Pd = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date(),
      user: {
        id: "AAAAA",
        username: "@test_user",
        displayName: "テストユーザー",
      },
      likes: [],
      rePds: [],
    };

    try {
      const currentPds = await pdApi.getPds();
      const updatedPds = [newPd, ...currentPds];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPds));
      return newPd;
    } catch (error) {
      console.error("PDの保存に失敗しました:", error);
      throw error;
    }
  },
};
