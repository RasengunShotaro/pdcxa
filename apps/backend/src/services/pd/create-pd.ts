import { Effect } from "effect";
import { AuthContext } from "#/domain/auth/principal";
import { PdRepository } from "#/domain/pd/repository";
import { StorageService } from "#/domain/storage/service";
import { 引用元のPDを確かめる } from "./verify-quoted-pd";

export const PDを作成する = ({
  content,
  image,
  quotedPdId,
}: {
  readonly content: string;
  readonly image?: File;
  readonly quotedPdId?: string;
}) =>
  Effect.gen(function* () {
    const repo = yield* PdRepository;
    const storage = yield* StorageService;
    const { userId } = yield* AuthContext;
    const 引用元 = yield* 引用元のPDを確かめる(quotedPdId);

    const imageFileName = image
      ? yield* storage.画像を圧縮してアップロードする({ image, userId })
      : null;

    const created = yield* repo.作成する({
      content,
      userId,
      createdAt: new Date(),
      imageFileName,
      quotedPdId: 引用元,
    });

    return { ...created, isMyPd: true, isBookmarked: false };
  });
