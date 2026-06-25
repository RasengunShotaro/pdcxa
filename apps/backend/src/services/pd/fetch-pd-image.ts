import { Effect } from "effect";
import { StorageService } from "#/domain/storage/service";

export const PD画像を取得する = ({ fileName }: { readonly fileName: string }) =>
  Effect.gen(function* () {
    const storage = yield* StorageService;
    return yield* storage.画像を取得する({ fileName });
  });
