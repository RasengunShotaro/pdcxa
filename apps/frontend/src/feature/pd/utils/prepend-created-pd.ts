import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { pdDetailQueryKey } from "../api/query-keys";
import type { Pd } from "../types";

type InfinitePds = {
  items: Pd[];
  nextCursor?: string;
};

export const PDをタイムラインに楽観追加する = ({
  queryClient,
  pd,
}: {
  queryClient: QueryClient;
  pd: Pd;
}) => {
  queryClient.setQueryData<InfiniteData<InfinitePds>>(
    pdDetailQueryKey(),
    (oldPages) => {
      if (!oldPages || oldPages.pages.length === 0) {
        return oldPages;
      }

      const [firstPage, ...restPages] = oldPages.pages;

      return {
        ...oldPages,
        pages: [
          { ...firstPage, items: [pd, ...firstPage.items] },
          ...restPages,
        ],
      };
    },
  );
};
