import type { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { mutatePdLike } from "@/feature/pd/api/pd/mutate-pd-like";
import { errorDisplay } from "@/lib/error-message";
import { legacyDelay } from "@/utils/legacy-delay";
import type { LikeUser, Pd } from "../types";
import {
  optimisticUpdateLike,
  type PdDetailSnapshot,
} from "./optimistic-update-like";

type PdLikeMutationContext = {
  previousQueries?: PdDetailSnapshot;
};

interface CreatePdLikeMutationOptionsInput {
  pd: Pd;
  queryClient: QueryClient;
  myUserId: string;
  myLikeUser: LikeUser;
}

export const createPdLikeMutationOptions = ({
  pd,
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
    optimisticUpdateLike({ pd, queryClient, myUserId, myLikeUser }),
  onError: (error, _variables, context) => {
    for (const [key, data] of context?.previousQueries ?? []) {
      queryClient.setQueryData(key, data);
    }
    toast.warning(errorDisplay(error).message);
  },
});
