import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";
import { StorageService } from "#/domain/storage/service";

export const GIFを含むPDを作成する = ({
  content,
  image,
}: {
  readonly content: string;
  readonly image: File;
}) =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const storage = yield* StorageService;
    const { userId } = yield* AuthContext;

    const imageFileName = yield* storage.GIF画像をアップロードする({
      image,
      userId,
    });

    const created = yield* repo.作成する({
      content,
      userId,
      createdAt: new Date(),
      imageFileName,
    });

    return { ...created, isMyPd: true };
  });
