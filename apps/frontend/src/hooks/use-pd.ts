import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createPd } from "@/feature/pd/api/pd/create-pd";
import { fetchDetailedPds } from "@/feature/pd/api/pd/fetch-detailed-pds";
import type { Pd } from "@/feature/pd/types";
import { legacyDelay } from "@/utils/legacy-delay";

export const usePd = ({
  pdId,
  userName,
}: {
  pdId?: string;
  userName?: string;
}) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["PD詳細", pdId, userName],
    queryFn: async ({ pageParam: cursor }) => {
      await legacyDelay();
      return await fetchDetailedPds({ pdId, userName, cursor });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const {
    mutateAsync: createNewPd,
    isPending: isMutationPending,
    isError: isMutationError,
  } = useMutation({
    mutationFn: async ({
      content,
      image,
    }: {
      content: string;
      image?: File;
    }) => {
      await legacyDelay();
      await createPd({ content, image });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PD詳細"] });
    },
  });

  const pds: Pd[] = data?.pages.flatMap((page) => page.items) ?? [];

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
