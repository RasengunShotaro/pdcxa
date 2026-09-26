import { mutatePdBookmark as mutatePdBookmarkApi } from "@/schema/api";

interface MutatePdBookmarkInput {
  pdId: string;
  bookmarked: boolean;
}

export const mutatePdBookmark = async ({
  pdId,
  bookmarked,
}: MutatePdBookmarkInput) => {
  await mutatePdBookmarkApi({ pdId, bookmarked });
};
