"use server";

import { pds } from "@/db/schema";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { currentUser } from "@clerk/nextjs/server";
import { pdFormSchema } from "../../types";
import { uploadPicture } from "./upload-picture";

export const createPd = actionClient
  .schema(pdFormSchema)
  .action(async ({ parsedInput: { content, image } }) => {
    const user = await currentUser();
    if (!user) {
      throw new Error("ユーザーが認証されていません。");
    }

    const imageUrl = await uploadPicture({
      blob: image,
      fileName: `${user.id}-${Date.now()}`,
    });

    const newPd = {
      content,
      createdAt: new Date(),
      userId: `${user.id}`,
      imageUrl: imageUrl,
    };

    await db.insert(pds).values(newPd);

    return;
  });
