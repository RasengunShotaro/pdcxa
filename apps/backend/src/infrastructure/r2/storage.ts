import { Effect, Layer } from "effect";
import { R2Storage } from "#/domain/storage/r2";
import { StorageService } from "#/domain/storage/service";
import { toStorageError } from "../error-mapping";
import { compressImage } from "./compress-image";

const R2にアップロードする = async ({
  body,
  fileName,
  contentType,
  extension,
  R2,
}: {
  body: Uint8Array | Blob;
  fileName: string;
  contentType: string;
  extension: string;
  R2: R2Bucket;
}): Promise<string> => {
  const fullFileName = `${fileName}.${extension}`;

  await R2.put(fullFileName, body, {
    httpMetadata: { contentType },
  });

  return fullFileName;
};

export const StorageServiceLive = Layer.succeed(StorageService, {
  画像を圧縮してアップロードする: ({ image, userId }) =>
    Effect.gen(function* () {
      const R2 = yield* R2Storage;
      return yield* Effect.tryPromise({
        try: async () => {
          const compressed = await compressImage({ image });
          return R2にアップロードする({
            body: compressed,
            fileName: `${userId}-${Date.now()}`,
            contentType: "image/jpeg",
            extension: "jpeg",
            R2,
          });
        },
        catch: toStorageError,
      });
    }),

  GIF画像をアップロードする: ({ image, userId }) =>
    Effect.gen(function* () {
      const R2 = yield* R2Storage;
      return yield* Effect.tryPromise({
        try: async () => {
          const imageBuffer = await image.arrayBuffer();
          return R2にアップロードする({
            body: new Uint8Array(imageBuffer),
            fileName: `${userId}-${Date.now()}`,
            contentType: "image/gif",
            extension: "gif",
            R2,
          });
        },
        catch: toStorageError,
      });
    }),
});
