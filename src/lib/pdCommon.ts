import type { Pd, RePd } from "@/feature/pd/types/pd";
import type { useQueryClient } from "@tanstack/react-query";

/**
 * Pd関連の共通処理を提供するモジュール
 */

const STORAGE_KEY = "pd_items";

// キャッシュのキー
export const PD_QUERY_KEY = ["pds"] as const;
export const REPD_QUERY_KEY = ["repds"] as const;

// PDの取得
export const getPds = async (): Promise<Pd[]> => {
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
};

// PDの作成
export const createPd = async (content: string): Promise<Pd> => {
  const newPd: Pd = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date(),
    user: {
      id: "AAAAA",
      username: "@test_user",
      displayName: "テストユーザー",
    },
    rePds: 0,
    likes: [],
  };

  try {
    const currentPds = await getPds();
    const updatedPds = [newPd, ...currentPds];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPds));
    return newPd;
  } catch (error) {
    console.error("PDの保存に失敗しました:", error);
    throw error;
  }
};

// リプライの作成
export const createRePd = async (
  pdId: string,
  content: string,
): Promise<RePd> => {
  const newRePd: RePd = {
    id: crypto.randomUUID(),
    pdId,
    content,
    createdAt: new Date(),
    user: {
      id: "AAAAA",
      username: "@test_user",
      displayName: "テストユーザー",
    },
    likes: [],
  };

  try {
    const currentPds = await getPds();
    const updatedPds = currentPds.map((pd) =>
      pd.id === pdId ? { ...pd, rePds: pd.rePds + 1 } : pd,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPds));
    return newRePd;
  } catch (error) {
    console.error("リプライの保存に失敗しました:", error);
    throw error;
  }
};

// キャッシュ更新用のユーティリティ関数
export const updatePdCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  newPd: Pd,
) => {
  queryClient.setQueryData<Pd[]>(PD_QUERY_KEY, (old = []) => [newPd, ...old]);
};

export const updateRePdCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  pdId: string,
) => {
  queryClient.setQueryData<Pd[]>(PD_QUERY_KEY, (old = []) =>
    old.map((pd) => (pd.id === pdId ? { ...pd, rePds: pd.rePds + 1 } : pd)),
  );
};
