import { Context, type Effect } from "effect";
import type { StorageError } from "../errors";
import type { R2Storage } from "./r2";

export type StoredImage = {
  readonly body: ReadableStream;
  readonly contentType: string;
};

export class StorageService extends Context.Tag("StorageService")<
  StorageService,
  {
    readonly 画像を圧縮してアップロードする: (params: {
      readonly image: File;
      readonly userId: string;
    }) => Effect.Effect<string, StorageError, R2Storage>;
    readonly GIF画像をアップロードする: (params: {
      readonly image: File;
      readonly userId: string;
    }) => Effect.Effect<string, StorageError, R2Storage>;
    readonly 画像を取得する: (params: {
      readonly fileName: string;
    }) => Effect.Effect<StoredImage | null, StorageError, R2Storage>;
  }
>() {}
