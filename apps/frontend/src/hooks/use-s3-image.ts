"use client";
import { useQuery } from "@tanstack/react-query";
import { getFromS3 } from "@/feature/pd/api/pd/s3-utils";
import { legacyDelay } from "@/utils/legacy-delay";

export const useS3Image = (fileName: string | null) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["画像", fileName],
    queryFn: async () => {
      if (!fileName) {
        return null;
      }
      await legacyDelay();
      return await getFromS3(fileName);
    },
  });

  return {
    data,
    isPending,
    error,
  };
};
