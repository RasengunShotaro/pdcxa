"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGifPd } from "@/feature/pd/api/pd/create-gif-pd";
import { createPd } from "@/feature/pd/api/pd/create-pd";
import { resizeImage } from "@/feature/pd/utils/resize-image";

interface CreatePdInput {
  content: string;
  image?: File;
}

export const useCreatePd = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ content, image }: CreatePdInput) => {
      if (image?.type === "image/gif") {
        await createGifPd({ content, image });
        return;
      }
      const resized = image ? await resizeImage(image) : undefined;
      await createPd({ content, image: resized });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PD詳細"] });
      queryClient.invalidateQueries({ queryKey: ["週次統計"] });
    },
  });

  return { createPd: mutateAsync, isPending };
};
