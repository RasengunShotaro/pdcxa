"use server";

import { pds } from "@/db/schema";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { currentUser } from "@clerk/nextjs/server";
import * as v from "valibot";
import { resizeImage } from "../../utils/resize-image";
import { compressImage } from "./compress-image";
import { uploadToS3 } from "./s3-utils";

const createPdSchema = v.object({
  content: v.pipe(
    v.string(),
    v.maxLength(200, "PDが長すぎます。200文字以内で入力してください"),
    v.minLength(1, "PDを入力してください")
  ),
  image: v.optional(
    v.pipe(
      v.blob("画像ファイルを選択してください"),
      v.maxSize(5 * 1024 * 1024, "ファイルサイズは5MB以下にしてください")
    )
  ),
});

export const createPd = actionClient
  .schema(createPdSchema)
  .action(async ({ parsedInput: { content, image } }) => {
    const user = await currentUser();
    if (!user) {
      throw new Error("ユーザーが認証されていません。");
    }

    const compressedImage = image
      ? await compressImage({
          image: await resizeImage(await image.arrayBuffer()),
        })
      : null;
    const imageFileName = compressedImage
      ? await uploadToS3({
          body: compressedImage,
          fileName: `${user.id}-${Date.now()}`,
          contentType: "image/jpeg",
          extension: "jpeg",
        })
      : null;

    const newPd = {
      content,
      createdAt: new Date(),
      userId: `${user.id}`,
      imageFileName: imageFileName,
    };

    await db.insert(pds).values(newPd);

    return;
  });
