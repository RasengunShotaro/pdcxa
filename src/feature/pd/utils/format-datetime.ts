export const formatDateTime = (date: Date): string => {
  const typeSafeDate = date instanceof Date ? date : new Date(date); // 弾けないので、型ガードを入れる

  const seconds = Math.floor(
    (new Date().getTime() - typeSafeDate.getTime()) / 1000
  );

  if (seconds < 60) return `${seconds}秒前`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}時間前`;
  return `${Math.floor(seconds / 86400)}日前`;
};
