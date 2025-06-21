import type { ClerkClient } from "@clerk/backend";

export const ユーザー名に紐づくユーザー詳細を取得 = async ({
  userName,
  clerkClient,
}: {
  userName: string;
  clerkClient: ClerkClient;
}) => {
  const 生ユーザー詳細 = (
    await clerkClient.users.getUserList({ username: [userName] })
  ).data[0];

  const ユーザー詳細 = {
    id: 生ユーザー詳細.id,
    firstName: 生ユーザー詳細.firstName,
    lastName: 生ユーザー詳細.lastName,
    imageUrl: 生ユーザー詳細.imageUrl,
    userName: 生ユーザー詳細.username,
  };

  return ユーザー詳細;
};
