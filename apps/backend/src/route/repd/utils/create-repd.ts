import { rePds } from "../../../db/schema";
import { db } from "../../../lib/db";

export const RePDを作成する = async ({
  pdId,
  content,
  ログイン中のユーザーID,
}: {
  pdId: string;
  content: string;
  ログイン中のユーザーID: string;
}) => {
  const newRePd = {
    pdId,
    content,
    createdAt: new Date(),
    userId: ログイン中のユーザーID,
  };

  await db.insert(rePds).values(newRePd);

  return;
};
