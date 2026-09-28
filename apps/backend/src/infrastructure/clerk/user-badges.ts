const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const 公開メタデータからバッジを取り出す = (
  publicMetadata: unknown,
): string[] => {
  if (!isRecord(publicMetadata)) {
    return [];
  }

  const { badges } = publicMetadata;
  if (!Array.isArray(badges)) {
    return [];
  }

  return badges.filter((badge): badge is string => typeof badge === "string");
};
