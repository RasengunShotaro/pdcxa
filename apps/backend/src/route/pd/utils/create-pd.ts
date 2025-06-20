import { Bindings } from "@/lib/bindings";
import { ログイン中のユーザーを取得 } from "@/utils/current-user";
import { Context } from "hono";
import { compressImage } from "./compress-image";
import { R2に画像をアップロードする } from "./r2-utils";
import { db } from "@/lib/db";
import { pds } from "@/db/schema";

export const PDを作成する = async ({
  content,
  image,
  c,
}: {
  content: string;
  image?: ArrayBuffer;
  c: Context<Bindings>;
}) => {
  const user = ログイン中のユーザーを取得(c);
  const compressedImage = image ? await compressImage({ image, c }) : null;
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
