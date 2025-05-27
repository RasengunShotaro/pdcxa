"use client";
import { getFromS3 } from "@/feature/pd/api/pd/s3-utils";
import { useQuery } from "@tanstack/react-query";

export const useS3Image = (fileName: string | null) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["画像", fileName],
    queryFn: () => {
      if (!fileName) {
        return null;
      }
      return getFromS3(fileName);
    },
  });

  return {
    data,
    isPending,
    error,
  };
};
