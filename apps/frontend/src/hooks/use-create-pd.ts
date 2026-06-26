"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGifPd } from "@/feature/pd/api/pd/create-gif-pd";
import { createPd } from "@/feature/pd/api/pd/create-pd";
import { weeklyStatsQueryKey } from "@/feature/pd/api/query-keys";
import { 作成したPDを詳細化する } from "@/feature/pd/utils/build-created-pd";
import { PDをタイムラインに楽観追加する } from "@/feature/pd/utils/prepend-created-pd";
import { resizeImage } from "@/feature/pd/utils/resize-image";
import { useCurrentUser } from "@/lib/auth/use-current-user";

interface CreatePdInput {
  content: string;
  image?: File;
}

export const useCreatePd = () => {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ content, image }: CreatePdInput) => {
      if (image?.type === "image/gif") {
        return await createGifPd({ content, image });
      }
      const resized = image ? await resizeImage(image) : undefined;
      return await createPd({ content, image: resized });
    },
    onSuccess: (created) => {
      PDをタイムラインに楽観追加する({
        queryClient,
        pd: 作成したPDを詳細化する({ created, user }),
      });
      queryClient.invalidateQueries({ queryKey: weeklyStatsQueryKey() });
    },
  });

  return { createPd: mutateAsync, isPending };
};
