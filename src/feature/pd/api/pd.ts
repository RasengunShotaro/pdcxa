import type { Pd, RePd } from "@/feature/pd/types/pd";
import type { useQueryClient } from "@tanstack/react-query";
const PD_STORAGE_KEY = "pd_items";
const REPD_STORAGE_KEY = "repd_items";

// キャッシュのキー
export const PD_QUERY_KEY = ["pds"] as const;
export const REPD_QUERY_KEY = ["repds"] as const;

// PDの取得
export const getPds = async ({
  pdIds,
}: {
  pdIds?: string[];
}): Promise<Pd[]> => {
  try {
    const storedPds = localStorage.getItem(PD_STORAGE_KEY);
    if (!storedPds) return [];

    const parsedPds: Pd[] = JSON.parse(storedPds).map(
      (pd: Omit<Pd, "createdAt"> & { createdAt: string }) => ({
        ...pd,
        createdAt: new Date(pd.createdAt),
      })
    );

    return pdIds ? parsedPds.filter((pd) => pdIds.includes(pd.id)) : parsedPds;
  } catch (error) {
    console.error("PDの読み込みに失敗しました:", error);
    return [];
  }
};

// PDの作成
export const createPd = async (
  content: string,
  userId: string
): Promise<Pd> => {
  const newPd: Pd = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date(),
    userId: `${userId}`,
    likes: [],
  };

  try {
    const currentPds = await getPds({});
    const updatedPds = [newPd, ...currentPds];
    localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(updatedPds));
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
  userId: string
): Promise<RePd> => {
  const newRePd: RePd = {
    id: crypto.randomUUID(),
    pdId,
    content,
    createdAt: new Date(),
    userId: `${userId}`,
    likes: [],
  };

  try {
    const currentPds = await getPds({});
    localStorage.setItem(PD_STORAGE_KEY, JSON.stringify(currentPds));

    const storedRePds = localStorage.getItem(REPD_STORAGE_KEY);
    const currentRePds: RePd[] = storedRePds ? JSON.parse(storedRePds) : [];
    const updatedRePds = [newRePd, ...currentRePds];
    localStorage.setItem(REPD_STORAGE_KEY, JSON.stringify(updatedRePds));

    return newRePd;
  } catch (error) {
    console.error("リプライの保存に失敗しました:", error);
    throw error;
  }
};

export const getRePds = async (pdId: string): Promise<RePd[]> => {
  try {
    const storedRePds = localStorage.getItem(REPD_STORAGE_KEY);
    if (!storedRePds) return [];

    const parsedRePds: RePd[] = JSON.parse(storedRePds)
      .filter(
        (rePd: Omit<RePd, "createdAt"> & { createdAt: string }) =>
          rePd.pdId === pdId
      )
      .map((rePd: Omit<RePd, "createdAt"> & { createdAt: string }) => ({
        ...rePd,
        createdAt: new Date(rePd.createdAt),
      }));

    return parsedRePds;
  } catch (error) {
    console.error("リプライの読み込みに失敗しました:", error);
    return [];
  }
};

export const updatePdCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  newPd: Pd
) => {
  queryClient.setQueryData<Pd[]>(PD_QUERY_KEY, (old = []) => [newPd, ...old]);
};

export const updateRePdCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  pdId: string
) => {
  queryClient.setQueryData<Pd[]>(PD_QUERY_KEY, (old = []) =>
    old.map((pd) => (pd.id === pdId ? { ...pd } : pd))
  );
};
