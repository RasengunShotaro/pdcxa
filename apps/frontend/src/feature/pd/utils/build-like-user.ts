import type { LikeUser } from "../types";

interface LikeUserSource {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string;
}

export const buildLikeUser = (user: LikeUserSource | null): LikeUser => ({
  userId: user?.id ?? "",
  userFullName:
    user?.fullName ?? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
  imageUrl: user?.imageUrl ?? "",
  userName: "",
});
