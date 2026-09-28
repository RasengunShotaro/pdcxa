import { 件数の変化の向きを決める } from "./count-direction";

const MAX_VISIBLE_UNREAD_COUNT = 99;

interface DecideUnreadBadgePopInput {
  previous: number;
  next: number;
}

export function 未読バッジを弾ませるか({
  previous,
  next,
}: DecideUnreadBadgePopInput): boolean {
  return previous > 0 && 件数の変化の向きを決める({ previous, next }) === "up";
}

export function 表示上の未読件数に丸める(count: number): number {
  return Math.min(count, MAX_VISIBLE_UNREAD_COUNT + 1);
}

export function 未読件数を表示用に整える(count: number): string {
  return count > MAX_VISIBLE_UNREAD_COUNT
    ? `${MAX_VISIBLE_UNREAD_COUNT}+`
    : String(count);
}
