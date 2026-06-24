import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";
import { StorageService } from "#/domain/storage/service";

export const PDを作成する = ({
  content,
  image,
}: {
  readonly content: string;
  readonly image?: File;
}) =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const storage = yield* StorageService;
    const { userId } = yield* AuthContext;

    const imageFileName = image
      ? yield* storage.画像を圧縮してアップロードする({ image, userId })
      : null;

    yield* repo.作成する({
      content,
      userId,
      createdAt: new Date(),
      imageFileName,
    });
  });
