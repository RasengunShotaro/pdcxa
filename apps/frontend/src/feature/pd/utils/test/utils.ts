import type { RawPd, UserDetail } from "../../types/pd";

export const UserDetailMother = (
  override: Partial<UserDetail>,
): UserDetail => ({
  id: "user-1",
  firstName: "田中",
  lastName: "太郎",
  imageUrl: "https://example.com/avatar.jpg",
  userName: "user1",
  ...override,
});

export const RawPdMother = (override: Partial<RawPd>): RawPd => ({
  id: "pd-1",
  content: "これはテスト用のPD投稿です",
  createdAt: "2024-01-01T00:00:00.000Z",
  userId: "user-1",
  likeCount: 0,
  replyCount: 0,
  likes: [],
  isMyPd: false,
  imageFileName: null,
  ...override,
});
