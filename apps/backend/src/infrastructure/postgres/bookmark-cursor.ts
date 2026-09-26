const SEPARATOR = "|";

export type 保存一覧の続き位置 = {
  readonly savedAt: string;
  readonly pdId: string;
};

export const 保存一覧の続き位置を作る = ({
  savedAt,
  pdId,
}: 保存一覧の続き位置): string => `${savedAt}${SEPARATOR}${pdId}`;

export const 保存一覧の続き位置を読む = (
  cursor: string | undefined,
): 保存一覧の続き位置 | undefined => {
  if (!cursor) {
    return undefined;
  }
  const separatorIndex = cursor.lastIndexOf(SEPARATOR);
  if (separatorIndex <= 0 || separatorIndex === cursor.length - 1) {
    return undefined;
  }
  return {
    savedAt: cursor.slice(0, separatorIndex),
    pdId: cursor.slice(separatorIndex + 1),
  };
};
