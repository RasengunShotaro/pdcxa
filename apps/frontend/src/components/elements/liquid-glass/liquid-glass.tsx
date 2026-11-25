"use client";

import {
  type CSSProperties,
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { ガラスをポインターの光で照らす } from "./pointer-light";
import { ガラスの屈折マップを作る } from "./refraction-map";

type ガラスの濃さ = "clear" | "regular" | "strong";

interface LiquidGlassProps {
  className?: string;
  radius: number;
  bezel?: number;
  strength?: number;
  tone?: ガラスの濃さ;
  lens?: boolean;
  blur?: number;
}

const 濃さごとのぼかし: Readonly<Record<ガラスの濃さ, number>> = {
  clear: 1,
  regular: 6,
  strong: 16,
};

const 色ごとの曲がり方 = [
  {
    channel: "red",
    ratio: 1,
    matrix: "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0",
  },
  {
    channel: "green",
    ratio: 0.9,
    matrix: "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0",
  },
  {
    channel: "blue",
    ratio: 0.8,
    matrix: "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0",
  },
] as const;

interface 屈折の画像 {
  readonly url: string;
  readonly width: number;
  readonly height: number;
}

const 屈折できる最大の画素数 = 1_600_000;

const 背景を屈折させられる = (): boolean =>
  typeof navigator !== "undefined" && "userAgentData" in navigator;

const 屈折の画像を作る = ({
  width,
  height,
  radius,
  bezel,
}: {
  width: number;
  height: number;
  radius: number;
  bezel: number;
}): 屈折の画像 | null => {
  if (width * height > 屈折できる最大の画素数) return null;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const pixels = ガラスの屈折マップを作る({ width, height, radius, bezel });
  context.putImageData(new ImageData(pixels, width, height), 0, 0);
  return { url: canvas.toDataURL(), width, height };
};

export function LiquidGlass({
  className,
  radius,
  bezel = 24,
  strength = 72,
  tone = "regular",
  lens = true,
  blur,
}: LiquidGlassProps) {
  const ref = useRef<HTMLDivElement>(null);
  const filterId = `liquid-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [map, setMap] = useState<屈折の画像 | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return ガラスをポインターの光で照らす(element);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !lens || !背景を屈折させられる()) return;
    let frame = 0;
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = Math.round(entry.contentRect.width);
        const height = Math.round(entry.contentRect.height);
        if (width < 1 || height < 1) return;
        setMap(屈折の画像を作る({ width, height, radius, bezel }));
      });
    });
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [radius, bezel, lens]);

  const refraction = map
    ? `url(#${filterId}) blur(${blur ?? 濃さごとのぼかし[tone]}px) saturate(var(--glass-saturate)) brightness(var(--glass-brightness))`
    : undefined;
  const style: CSSProperties = {
    borderRadius: radius,
    backdropFilter: refraction,
    WebkitBackdropFilter: refraction,
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "liquid-glass pointer-events-none absolute inset-0 -z-10",
        tone === "strong" && "liquid-glass-strong",
        tone === "clear" && "liquid-glass-clear",
        className,
      )}
      data-refraction={map ? "lens" : "blur"}
      ref={ref}
      style={style}
    >
      <span className="liquid-glass-rim" />
      {map ? (
        <svg aria-hidden="true" className="absolute size-0" focusable="false">
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height={map.height}
            id={filterId}
            width={map.width}
            x="0"
            y="0"
          >
            <feImage
              height={map.height}
              href={map.url}
              preserveAspectRatio="none"
              result="refraction-map"
              width={map.width}
              x="0"
              y="0"
            />
            {色ごとの曲がり方.map(({ channel, ratio, matrix }) => (
              <Fragment key={channel}>
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="refraction-map"
                  result={`bent-${channel}`}
                  scale={strength * ratio}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
                <feColorMatrix
                  in={`bent-${channel}`}
                  result={channel}
                  type="matrix"
                  values={matrix}
                />
              </Fragment>
            ))}
            <feBlend in="red" in2="green" mode="screen" result="red-green" />
            <feBlend in="red-green" in2="blue" mode="screen" />
          </filter>
        </svg>
      ) : null}
    </div>
  );
}
