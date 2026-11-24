"use client";

import { Maximize, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { つかんで動かせるか } from "./image-viewer-pan";
import {
  ZOOM_MAX,
  ZOOM_MIN,
  type 倍率を変える向き,
  type 大きさ,
  画像を枠に収める大きさを求める,
} from "./image-viewer-zoom";
import { useFrameSize } from "./use-frame-size";
import { useImageViewerDragPan } from "./use-image-viewer-drag-pan";
import { useImageViewerZoom } from "./use-image-viewer-zoom";

interface ImageViewerProps {
  src: string;
  alt: string;
}

interface ImageViewerToolbarProps {
  倍率: number;
  onZoom: (向き: 倍率を変える向き) => void;
  onFit: () => void;
}

function ImageViewerToolbar({ 倍率, onZoom, onFit }: ImageViewerToolbarProps) {
  return (
    <div className="flex items-center justify-center gap-1 pr-10">
      <Button
        aria-label="縮小"
        disabled={倍率 <= ZOOM_MIN}
        onClick={() => onZoom("縮小")}
        size="sm"
        variant="outline"
      >
        <ZoomOut aria-hidden="true" className="size-4" />
      </Button>
      <output
        aria-label="表示倍率"
        className="w-14 text-center text-sm text-muted-foreground tabular-nums"
      >
        {Math.round(倍率 * 100)}%
      </output>
      <Button
        aria-label="拡大"
        disabled={倍率 >= ZOOM_MAX}
        onClick={() => onZoom("拡大")}
        size="sm"
        variant="outline"
      >
        <ZoomIn aria-hidden="true" className="size-4" />
      </Button>
      <Button
        disabled={倍率 <= ZOOM_MIN}
        onClick={onFit}
        size="sm"
        variant="outline"
      >
        <Maximize aria-hidden="true" className="size-4" />
        全体を表示
      </Button>
    </div>
  );
}

export function ImageViewer({ src, alt }: ImageViewerProps) {
  const [view, setView] = useState<HTMLDivElement | null>(null);
  const [画像, set画像] = useState<HTMLImageElement | null>(null);
  const [画像の大きさ, set画像の大きさ] = useState<大きさ>({ 幅: 0, 高さ: 0 });
  const 枠 = useFrameSize(view);
  const 収めた大きさ = 画像を枠に収める大きさを求める({
    画像: 画像の大きさ,
    枠,
  });
  const { 倍率, ボタンで倍率を変える, 全体を表示する } = useImageViewerZoom({
    view,
    画像,
    収めた大きさ,
  });
  const 中身 = { 幅: 収めた大きさ.幅 * 倍率, 高さ: 収めた大きさ.高さ * 倍率 };
  const 動かせる = つかんで動かせるか({ 中身, 枠 });
  const { つかんでいる } = useImageViewerDragPan({ view, 動かせる });
  const 大きさが決まった = 中身.幅 > 0 && 中身.高さ > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <ImageViewerToolbar
        onFit={全体を表示する}
        onZoom={ボタンで倍率を変える}
        倍率={倍率}
      />
      <div
        className={cn(
          "min-h-0 flex-1 overflow-auto rounded-md bg-muted",
          動かせる && (つかんでいる ? "cursor-grabbing" : "cursor-grab"),
        )}
        data-testid="image-viewer-frame"
        ref={setView}
      >
        <div className="flex h-max min-h-full w-max min-w-full items-center justify-center">
          {/* biome-ignore lint/performance/noImgElement: backend が配信する R2 画像を ObjectURL で表示するため next/image は使えない */}
          <img
            alt={alt}
            className={cn(
              "max-w-none select-none",
              !大きさが決まった && "invisible",
            )}
            draggable={false}
            onLoad={(event) =>
              set画像の大きさ({
                幅: event.currentTarget.naturalWidth,
                高さ: event.currentTarget.naturalHeight,
              })
            }
            ref={set画像}
            src={src}
            style={
              大きさが決まった
                ? { width: 中身.幅, height: 中身.高さ }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
