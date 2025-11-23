import { pds } from "../../../db/schema";
import { db } from "../../../lib/db";
import { R2に画像をアップロードする } from "./r2-utils";

export const GIFを含むPDを作成する = async ({
  content,
  image,
  ログイン中のユーザーID,
  R2,
}: {
  content: string;
  image: File;
  ログイン中のユーザーID: string;
  R2: R2Bucket;
}) => {
  const imageBuffer = await image.arrayBuffer();
  const fileName = `${ログイン中のユーザーID}-${Date.now()}`;

  const imageFileName = await R2に画像をアップロードする({
    body: new Uint8Array(imageBuffer),
    fileName,
    contentType: "image/gif",
    extension: "gif",
    R2,
  });

  const newPd = {
    content,
    createdAt: new Date(),
    userId: `${ログイン中のユーザーID}`,
    imageFileName: imageFileName,
  };

  await db.insert(pds).values(newPd);

  return;
};
