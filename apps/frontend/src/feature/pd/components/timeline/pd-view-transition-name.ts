export const pd詳細へ移る共有要素の名前 = (pdId: string): string =>
  `pd-${pdId.replace(/[^A-Za-z0-9_-]/g, "_")}`;
