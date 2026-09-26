const TIME_ZONE = "Asia/Tokyo";
const SECONDS_PER_DAY = 86400;
const RELATIVE_DAYS_LIMIT = 7;

const toDate = (date: Date | string): Date =>
  date instanceof Date ? date : new Date(date);

const yearFormat = new Intl.DateTimeFormat("ja-JP", {
  timeZone: TIME_ZONE,
  year: "numeric",
});

const yearOf = (date: Date): string => yearFormat.format(date);

const monthDayFormat = new Intl.DateTimeFormat("ja-JP", {
  timeZone: TIME_ZONE,
  month: "long",
  day: "numeric",
});

const yearMonthDayFormat = new Intl.DateTimeFormat("ja-JP", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("ja-JP", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export const formatDateTime = (date: Date | string): string => {
  const typeSafeDate = toDate(date); // 弾けないので、型ガードを入れる
  const now = new Date();

  const seconds = Math.floor((now.getTime() - typeSafeDate.getTime()) / 1000);

  if (seconds < 0) return "0秒前"; // サーバー側との時間差で、投稿直後に負の数となる場合があるため
  if (seconds < 60) return `${seconds}秒前`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分前`;
  if (seconds < SECONDS_PER_DAY) return `${Math.floor(seconds / 3600)}時間前`;
  if (seconds < SECONDS_PER_DAY * RELATIVE_DAYS_LIMIT)
    return `${Math.floor(seconds / SECONDS_PER_DAY)}日前`;
  if (yearOf(typeSafeDate) === yearOf(now))
    return monthDayFormat.format(typeSafeDate);
  return yearMonthDayFormat.format(typeSafeDate);
};

export const formatAbsoluteDateTime = (date: Date | string): string => {
  const typeSafeDate = toDate(date);
  return `${yearMonthDayFormat.format(typeSafeDate)} ${timeFormat.format(typeSafeDate)}`;
};
