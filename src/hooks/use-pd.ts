import { createPd } from "@/feature/pd/api/pd/create-pd";
import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePd = ({ pdId, userId }: { pdId?: string; userId?: string }) => {
  const queryClient = useQueryClient();

  const {
    data: pds = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["PD詳細", pdId, userId],
    queryFn: async () => fetchPds({ pdId, userId }),
  });

  const { mutate: createNewPd } = useMutation({
    mutationFn: (content: string) => createPd({ content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PD詳細"] });
    },
  });

  return {
    pds,
    isPending,
    error,
    createPd: createNewPd,
  };
};
