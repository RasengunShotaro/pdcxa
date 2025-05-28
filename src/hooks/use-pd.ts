import { createPd } from "@/feature/pd/api/pd/create-pd";
import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import type { PdsResponse } from "@/feature/pd/api/pd/fetch-pds";
import type { Pd } from "@/feature/pd/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const usePd = ({ pdId, userId }: { pdId?: string; userId?: string }) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["PD詳細", pdId, userId],
    queryFn: ({ pageParam: cursor }) => fetchPds({ pdId, userId, cursor }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const {
    mutateAsync: createNewPd,
    isPending: isMutationPending,
    isError: isMutationError,
  } = useMutation({
    mutationFn: ({
      content,
      image,
    }: {
      content: string;
      image?: ArrayBuffer;
    }) => createPd({ content, image }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PD詳細"] });
    },
  });

  const pds: Pd[] =
    data?.pages.flatMap((page: PdsResponse) => page.items) ?? [];

  return {
    pds,
    isPending,
    isError,
    createPd: createNewPd,
    isMutationPending,
    isMutationError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
