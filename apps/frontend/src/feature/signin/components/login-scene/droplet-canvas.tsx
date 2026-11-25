"use client";

import { useEffect, useRef, useState } from "react";
import { type BackdropPhoto, 背景の写真を選ぶ } from "./droplet-photos";
import { 液体ガラスの雫を描き始める } from "./droplet-stage";
import styles from "./login-scene.module.css";
import {
  type RenderMode,
  WIDE_SCREEN_QUERY,
  指定されたガラスの形を読む,
  指定された描画方式を読む,
} from "./render-mode";

export function DropletCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<BackdropPhoto | null>(null);
  const [isWideScreen, setIsWideScreen] = useState<boolean | null>(null);
  const [mode, setMode] = useState<RenderMode | null>(null);

  useEffect(() => {
    setPhoto(
      背景の写真を選ぶ({
        search: window.location.search,
        random: Math.random(),
      }),
    );
    const wide = window.matchMedia(WIDE_SCREEN_QUERY);
    const update = (): void => setIsWideScreen(wide.matches);
    update();
    wide.addEventListener("change", update);
    return () => wide.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const container = hostRef.current;
    if (!container || !photo || isWideScreen === null) {
      return;
    }
    return 液体ガラスの雫を描き始める({
      container,
      photo,
      forcedMode: 指定された描画方式を読む(window.location.search),
      variant: 指定されたガラスの形を読む(window.location.search),
      isWideScreen,
      onMode: setMode,
    });
  }, [photo, isWideScreen]);

  return (
    <div
      className={styles.backdrop}
      data-photo={photo?.name}
      data-renderer={mode ?? "loading"}
      data-testid="droplet-stage"
    >
      <div
        className={styles.photo}
        data-login-photo=""
        data-mirror={photo?.mirror ? "true" : "false"}
        data-ready={photo ? "true" : "false"}
        style={
          photo
            ? {
                backgroundImage: `url(${photo.src})`,
                backgroundPosition: `${(photo.focus?.x ?? 0.5) * 100}% ${(photo.focus?.y ?? 0.5) * 100}%`,
              }
            : undefined
        }
      />
      <div className="absolute inset-0" ref={hostRef} />
      {mode === "static" ? (
        <div aria-hidden="true" className={styles.stillDrop} />
      ) : null}
    </div>
  );
}
