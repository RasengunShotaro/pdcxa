"use client";

import { ImageOff } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { blobToObjectUrl } from "@/feature/pd/utils/blob-to-url";
import { useFetchPdImage } from "@/schema/api";

interface PdCardImageProps {
  imageFileName: string | null;
  alt: string;
}

export function PdCardImage({ imageFileName, alt }: PdCardImageProps) {
  const { data, isPending, error } = useFetchPdImage(imageFileName ?? "", {
    query: { enabled: Boolean(imageFileName) },
  });
  const [failed, setFailed] = useState(false);

  if (!imageFileName) return null;

  const hasError = Boolean(error) || failed;
  const imageBlob = data?.data;

  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-border bg-muted">
      {isPending && !hasError ? (
        <Skeleton className="absolute inset-0 size-full" />
      ) : null}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageOff aria-hidden="true" className="size-6" />
          <span className="text-sm">画像を読み込めませんでした</span>
        </div>
      ) : null}
      {imageBlob && !hasError ? (
        // biome-ignore lint/performance/noImgElement: backend が配信する R2 画像を ObjectURL で表示するため next/image は使えない
        <img
          alt={alt}
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailed(true)}
          src={blobToObjectUrl(imageBlob)}
        />
      ) : null}
    </div>
  );
}
