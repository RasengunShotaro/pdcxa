import type { Context } from "hono";
import { pds } from "../../../db/schema";
import type { Bindings } from "../../../lib/bindings";
import { db } from "../../../lib/db";
import { ログイン中のユーザーを取得 } from "../../../utils/current-user";
import { compressImage } from "./compress-image";
import { R2に画像をアップロードする } from "./r2-utils";

export const PDを作成する = async ({
  content,
  image,
  c,
}: {
  content: string;
  image?: File;
  c: Context<Bindings>;
}) => {
  const user = ログイン中のユーザーを取得(c);

  const imageFileName = image
    ? await (async () => {
        const isGif = image.type === "image/gif";
        const fileName = `${user.userId}-${Date.now()}`;

        if (isGif) {
          const imageBuffer = await image.arrayBuffer();
          return R2に画像をアップロードする({
            body: new Uint8Array(imageBuffer),
            fileName,
            contentType: "image/gif",
            extension: "gif",
            c,
          });
        }

        const compressedImage = await compressImage({ image });
        return R2に画像をアップロードする({
          body: compressedImage,
          fileName,
          contentType: "image/jpeg",
          extension: "jpeg",
          c,
        });
      })()
    : null;

  const newPd = {
    content,
    createdAt: new Date(),
    userId: `${user.userId}`,
    imageFileName: imageFileName,
  };

  await db.insert(pds).values(newPd);

  return;
};
