import type {
  InfiniteData,
  QueryClient,
  QueryKey,
  UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { mutatePdLike } from "@/feature/pd/api/pd/mutate-pd-like";
import { errorDisplay } from "@/lib/error-message";
import { legacyDelay } from "@/utils/legacy-delay";
import type { LikeUser, Pd } from "../types";
import { optimisticUpdateLike } from "./optimistic-update-like";

type InfinitePds = {
  items: Pd[];
  nextCursor?: string;
};

type PdLikeMutationContext = {
  previousPages?: InfiniteData<InfinitePds>;
};

interface CreatePdLikeMutationOptionsInput {
  pd: Pd;
  queryKey: QueryKey;
  queryClient: QueryClient;
  myUserId: string;
  myLikeUser: LikeUser;
}

export const createPdLikeMutationOptions = ({
  pd,
  queryKey,
  queryClient,
  myUserId,
  myLikeUser,
}: CreatePdLikeMutationOptionsInput): UseMutationOptions<
  void,
  unknown,
  void,
  PdLikeMutationContext
> => ({
  mutationFn: async () => {
    await legacyDelay();
    await mutatePdLike(pd.id);
  },
  onMutate: () =>
    optimisticUpdateLike({ pd, queryKey, queryClient, myUserId, myLikeUser }),
  onError: (error, _variables, context) => {
    if (context?.previousPages) {
      queryClient.setQueryData(queryKey, context.previousPages);
    }
    toast.warning(errorDisplay(error).message);
  },
});
