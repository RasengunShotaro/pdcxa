"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./sky-backdrop.module.css";
import { type SkyBackend, startSkyScene } from "./sky-scene";

export function SkyBackdrop() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [backend, setBackend] = useState<SkyBackend | "loading">("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = startSkyScene({ host, canvasClassName: styles.canvas });
    setBackend(scene.backend);
    return () => scene.destroy();
  }, []);

  return (
    <div
      aria-hidden="true"
      className={styles.backdrop}
      data-sky-backend={backend}
      ref={hostRef}
    />
  );
}
