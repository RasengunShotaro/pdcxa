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
import { useObjectUrl } from "@/hooks/use-object-url";
import { cn } from "@/lib/utils";
import { useFetchPdImage } from "@/schema/api";
import { ImageViewer } from "../image-viewer/image-viewer";

type ImageShape = "row" | "wide";

const SHAPE_CLASS: Record<ImageShape, string> = {
  row: "mt-3 aspect-[5/2] rounded-xl",
  wide: "mt-5 aspect-video rounded-[22px]",
};

interface PdCardImageProps {
  imageFileName: string | null;
  alt: string;
  shape?: ImageShape;
}

export function PdCardImage({
  imageFileName,
  alt,
  shape = "row",
}: PdCardImageProps) {
  const { data, isPending, error } = useFetchPdImage(imageFileName ?? "", {
    query: { enabled: Boolean(imageFileName) },
  });
  const [failed, setFailed] = useState(false);
  const imageBlob = data?.data;
  const src = useObjectUrl(imageBlob);

  if (!imageFileName) return null;

  const hasError = Boolean(error) || failed;
  const frameClassName = cn("w-full overflow-hidden", SHAPE_CLASS[shape]);

  if ((isPending || (imageBlob && !src)) && !hasError) {
    return <Skeleton className={frameClassName} />;
  }

  if (hasError) {
    return (
      <div
        className={cn(
          frameClassName,
          "flex flex-col items-center justify-center gap-2 bg-fill text-ink-3",
        )}
      >
        <ImageOff aria-hidden="true" className="size-6" />
        <span className="text-[0.8125rem]">画像を読み込めませんでした</span>
      </div>
    );
  }

  if (!src) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          aria-label={`${alt}を拡大表示`}
          className={cn(
            frameClassName,
            "relative z-[1] block cursor-zoom-in bg-fill transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
          type="button"
        >
          {/* biome-ignore lint/performance/noImgElement: backend が配信する R2 画像を ObjectURL で表示するため next/image は使えない */}
          <img
            alt={alt}
            className="size-full object-cover"
            onError={() => setFailed(true)}
            src={src}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="flex h-[85vh] flex-col gap-2 p-3 sm:max-w-5xl">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">
          {alt}の拡大表示
        </DialogDescription>
        <ImageViewer alt={alt} src={src} />
      </DialogContent>
    </Dialog>
  );
}
