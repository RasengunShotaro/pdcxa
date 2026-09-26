import { Context, type Effect } from "effect";
import type { DatabaseError } from "../errors";
import type {
  NewPd,
  PdPage,
  RawPd,
  投稿者別集計群,
  日毎の集計,
  集計期間,
} from "./types";

export class PdRepository extends Context.Tag("PdRepository")<
  PdRepository,
  {
    readonly 一覧を取得する: (params: {
      readonly userId?: string;
      readonly cursor?: string;
    }) => Effect.Effect<PdPage, DatabaseError>;
    readonly IDで取得する: (
      pdId: string,
    ) => Effect.Effect<RawPd[], DatabaseError>;
    readonly 作成する: (newPd: NewPd) => Effect.Effect<RawPd, DatabaseError>;
    readonly いいねをトグルする: (params: {
      readonly pdId: string;
      readonly userId: string;
    }) => Effect.Effect<void, DatabaseError>;
    readonly ブックマーク状態を設定する: (params: {
      readonly pdId: string;
      readonly userId: string;
      readonly bookmarked: boolean;
    }) => Effect.Effect<void, DatabaseError>;
    readonly ブックマーク済みのPDIDを絞り込む: (params: {
      readonly userId: string;
      readonly pdIds: readonly string[];
    }) => Effect.Effect<string[], DatabaseError>;
    readonly ブックマークしたPD一覧を取得する: (params: {
      readonly userId: string;
      readonly cursor?: string;
    }) => Effect.Effect<PdPage, DatabaseError>;
    readonly 日毎の集計を取得する: (
      range: 集計期間,
    ) => Effect.Effect<日毎の集計, DatabaseError>;
    readonly 投稿者別集計を取得する: (
      range: 集計期間,
    ) => Effect.Effect<投稿者別集計群, DatabaseError>;
  }
>() {}
