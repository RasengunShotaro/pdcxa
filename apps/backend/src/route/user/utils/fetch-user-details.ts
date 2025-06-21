import type { ClerkClient } from "@clerk/backend";

export const ユーザーIDに紐づくユーザー詳細一覧を取得 = async ({
  userIds,
  clerkClient,
}: {
  userIds: string[];
  clerkClient: ClerkClient;
}) => {
  const limit = userIds.length < 500 ? userIds.length : 500;

  const 生ユーザー詳細一覧 = (
    await clerkClient.users.getUserList({
      userId: userIds,
      limit,
    })
  ).data;
  const ユーザー詳細一覧 = 生ユーザー詳細一覧.map((user) => {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      userName: user.username,
    };
  });

  return ユーザー詳細一覧;
};
