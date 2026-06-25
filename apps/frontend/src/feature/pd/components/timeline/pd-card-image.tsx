"use client";

import { ImageOff } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  if (isPending && !hasError) {
    return <Skeleton className="mx-auto h-48 w-full max-w-xs rounded-lg" />;
  }

  if (hasError) {
    return (
      <div className="mx-auto flex h-32 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted text-muted-foreground">
        <ImageOff aria-hidden="true" className="size-6" />
        <span className="text-sm">画像を読み込めませんでした</span>
      </div>
    );
  }

  if (!imageBlob) return null;

  const src = blobToObjectUrl(imageBlob);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label={`${alt}を拡大表示`}
          className="mx-auto block w-fit cursor-zoom-in rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          type="button"
        >
          {/* biome-ignore lint/performance/noImgElement: backend が配信する R2 画像を ObjectURL で表示するため next/image は使えない */}
          <img
            alt={alt}
            className="max-h-80 w-auto rounded-lg border border-border object-contain"
            onError={() => setFailed(true)}
            src={src}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-2">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">
          {alt}の拡大表示
        </DialogDescription>
        {/* biome-ignore lint/performance/noImgElement: backend が配信する R2 画像を ObjectURL で表示するため next/image は使えない */}
        <img
          alt={alt}
          className="max-h-[80vh] w-full rounded-lg object-contain"
          src={src}
        />
      </DialogContent>
    </Dialog>
  );
}
