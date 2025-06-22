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
  const compressedImage = image ? await compressImage({ image }) : null;
  const imageFileName = compressedImage
    ? await R2に画像をアップロードする({
        body: compressedImage,
        fileName: `${user.userId}-${Date.now()}`,
        contentType: "image/jpeg",
        extension: "jpeg",
        c,
      })
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
