import { Context, type Effect } from "effect";
import type { DatabaseError } from "../errors";
import type { NotificationPage } from "./types";

export class NotificationRepository extends Context.Tag(
  "NotificationRepository",
)<
  NotificationRepository,
  {
    readonly 既読時刻を取得する: (
      userId: string,
    ) => Effect.Effect<Date | null, DatabaseError>;
    readonly 未読件数を取得する: (params: {
      readonly userId: string;
      readonly lastSeenAt: Date;
    }) => Effect.Effect<number, DatabaseError>;
    readonly 一覧を取得する: (params: {
      readonly userId: string;
      readonly cursor?: string;
    }) => Effect.Effect<NotificationPage, DatabaseError>;
    readonly 既読にする: (params: {
      readonly userId: string;
      readonly seenAt: Date;
    }) => Effect.Effect<void, DatabaseError>;
  }
>() {}
