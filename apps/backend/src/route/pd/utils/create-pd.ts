import { pds } from "../../../db/schema";
import { db } from "../../../lib/db";
import { compressImage } from "./compress-image";
import { R2に画像をアップロードする } from "./r2-utils";

export const PDを作成する = async ({
  content,
  image,
  ログイン中のユーザーID,
  R2,
}: {
  content: string;
  image?: File;
  ログイン中のユーザーID: string;
  R2: R2Bucket;
}) => {
  const compressedImage = image ? await compressImage({ image }) : null;
  const imageFileName = compressedImage
    ? await R2に画像をアップロードする({
        body: compressedImage,
        fileName: `${ログイン中のユーザーID}-${Date.now()}`,
        contentType: "image/jpeg",
        extension: "jpeg",
        R2: R2,
      })
    : null;

  const newPd = {
    content,
    createdAt: new Date(),
    userId: `${ログイン中のユーザーID}`,
    imageFileName: imageFileName,
  };

  await db.insert(pds).values(newPd);

  return;
};
