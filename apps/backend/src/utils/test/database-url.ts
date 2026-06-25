const ローカル既定URL = "postgres://test:test@localhost:5432/test";

export const テスト用データベースURL = (): string => {
  const url = process.env.DATABASE_URL || ローカル既定URL;

  if (!/@(localhost|127\.0\.0\.1)[:/]/.test(url)) {
    throw new Error(
      "テスト用 DATABASE_URL は localhost のみ許可（実 DB の破壊を防止）",
    );
  }

  return url;
};
